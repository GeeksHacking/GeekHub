using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using AutoMapper;
using Refit;
using Serilog;
using GeekHub.Attributes;
using GeekHub.Data;
using GeekHub.DTOs.Project;
using GeekHub.Extensions;
using GeekHub.Models;
using GeekHub.Services;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.JsonPatch.Exceptions;

namespace GeekHub.Controllers
{
    [Microsoft.AspNetCore.Authorization.Authorize]
    [AddUserId]
    [ApiController]
    [Route("[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IAuthorizationService _authorizationService;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly IMapper _mapper;
        private readonly IGitHubService _gitHubService;

        public ProjectsController(
            ApplicationDbContext dbContext,
            IAuthorizationService authorizationService,
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager,
            IMapper mapper,
            IGitHubService gitHubService
        )
        {
            _dbContext = dbContext;
            _authorizationService = authorizationService;
            _userManager = userManager;
            _roleManager = roleManager;
            _mapper = mapper;
            _gitHubService = gitHubService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjectResponseDto>>> ReadProjects()
        {
            Debug.Assert(HttpContext.Items["UserId"] != null, "HttpContext.Items['UserId'] != null");
            var userId = (Guid) HttpContext.Items["UserId"];

            var user = await _dbContext.Users.Where(u => u.Id == userId).Include(u => u.Projects).SingleAsync();

            return Ok(_mapper.Map<IEnumerable<ProjectResponseDto>>(user.Projects));
        }

        [HttpPost]
        public async Task<ActionResult<ProjectResponseDto>> CreateProject(
            [FromBody] CreateProjectRequestDto createProjectRequestDto
        )
        {
            // Validate that the project exists on GitHub, this isn't done in the validator as it is async
            var repositoryPathSplit = createProjectRequestDto.Repository.Split("/");
            if (repositoryPathSplit.Length < 2) return BadRequest();
            List<string> languages;
            try
            {
                languages = (await _gitHubService.GetLanguagesAsync(repositoryPathSplit[^2], repositoryPathSplit[^1]))
                    .ToList();
            }
            catch (ApiException exception)
            {
                Log.Warning(exception, "User submitted invalid repository link");
                return BadRequest();
            }

            Debug.Assert(HttpContext.Items["UserId"] != null, "HttpContext.Items['UserId'] != null");
            var userId = (Guid) HttpContext.Items["UserId"];

            var project = _mapper.Map<Project>(createProjectRequestDto);

            try
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());

                // Add user to project
                project.Users = new List<ApplicationUser> {user};

                // Add project
                project = (await _dbContext.Projects.AddAsync(project)).Entity;

                var dbLanguages = await _dbContext.Languages.Where(l => languages.Contains(l.Name))
                    .Include(l => l.Projects).ToListAsync();

                foreach (var language in languages)
                {
                    var dbLanguage = dbLanguages.Find(l => l.Name == language);
                    if (dbLanguage is null)
                    {
                        // Create if language doesn't exist
                        await _dbContext.Languages.AddAsync(new Language
                        {
                            Name = language,
                            Projects = new List<Project>
                            {
                                project
                            }
                        });
                    }
                    else
                    {
                        // Add project to language if it exists
                        dbLanguage.Projects.Add(project);
                    }
                }

                await _dbContext.SaveChangesAsync();

                await _roleManager.CreateDefaultRoles(project);
                await _userManager.AddToRoleAsync(user, $"Projects/{project.Id.ToString()}/Owner");

                return Ok(_mapper.Map<ProjectResponseDto>(project));
            }
            catch (Exception exception)
            {
                Log.Fatal(exception, "Fatal error while creating project");
                return Problem();
            }
        }

        [HttpPatch("{projectId:guid}")]
        public async Task<ActionResult<ProjectResponseDto>> UpdateProject(
            [FromRoute] Guid projectId,
            [FromBody] JsonPatchDocument<UpdateProjectRequestDto> updateProjectRequestDto
        )
        {
            try
            {
                var project = await _dbContext.Projects.Include(p => p.Languages)
                    .SingleOrDefaultAsync(p => p.Id == projectId);
                if (project == default(Project)) return NotFound();

                // Check if user has permission to update project
                var authorization =
                    await _authorizationService.AuthorizeAsync(User, project, Permission.UpdateProject.ToString());
                if (!authorization.Succeeded) return Forbid();

                var projectDto = _mapper.Map<UpdateProjectRequestDto>(project);

                try
                {
                    updateProjectRequestDto.ApplyTo(projectDto);
                }
                catch (JsonPatchException)
                {
                    return BadRequest();
                }

                TryValidateModel(projectDto);

                if (!ModelState.IsValid) return BadRequest();
                if (projectDto.Repository != project.Repository.ToString())
                {
                    // Validate that the project exists on GitHub, this isn't done in the validator as it is async
                    var repositoryPathSplit = projectDto.Repository.Split("/");
                    if (repositoryPathSplit.Length < 2) return BadRequest();

                    List<string> languages;
                    try
                    {
                        languages = (await _gitHubService.GetLanguagesAsync(repositoryPathSplit[^2],
                                repositoryPathSplit[^1]))
                            .ToList();
                    }
                    catch (ApiException exception)
                    {
                        Log.Warning(exception, "User submitted invalid repository link");
                        return BadRequest();
                    }

                    // If the repository is updated, we need to update the languages as well
                    project.Languages.Clear();
                    await _dbContext.SaveChangesAsync();

                    var dbLanguages = await _dbContext.Languages.Where(l => languages.Contains(l.Name)).ToListAsync();

                    foreach (var language in languages)
                    {
                        var dbLanguage = dbLanguages.Find(l => l.Name == language);
                        if (dbLanguage is null)
                        {
                            // Create if language doesn't exist
                            await _dbContext.Languages.AddAsync(new Language
                            {
                                Name = language,
                                Projects = new List<Project>
                                {
                                    project
                                }
                            });
                        }
                        else
                        {
                            // Add project to language if it exists
                            project.Languages.Add(dbLanguage);
                        }
                    }
                }

                _mapper.Map(projectDto, project);
                _dbContext.Projects.Update(project);
                await _dbContext.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception exception)
            {
                Log.Fatal(exception, "Fatal error while updating project");
                return Problem();
            }
        }

        [HttpDelete("{projectId:guid}")]
        public async Task<ActionResult> DeleteProject(
            [FromRoute] Guid projectId
        )
        {
            try
            {
                var project = await _dbContext.Projects.FindAsync(projectId);
                if (project is null) return NotFound();

                var authorization =
                    await _authorizationService.AuthorizeAsync(User, project, Permission.DeleteProject.ToString());
                if (!authorization.Succeeded) return Forbid();

                _dbContext.Projects.Remove(project);
                await _dbContext.SaveChangesAsync();

                return Ok();
            }
            catch (Exception exception)
            {
                Log.Fatal(exception, "Fatal error while deleting project");
                return Problem();
            }
        }
    }
}