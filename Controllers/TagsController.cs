using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using GeekHub.Attributes;
using GeekHub.Data;
using GeekHub.Dtos.Tags;
using GeekHub.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace GeekHub.Controllers
{
    [Microsoft.AspNetCore.Authorization.Authorize]
    [AddUserId]
    [ApiController]
    [Route("Projects/{projectId:guid}/[controller]")]
    public class TagsController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IAuthorizationService _authorizationService;
        private readonly IMapper _mapper;

        public TagsController(ApplicationDbContext dbContext, IAuthorizationService authorizationService,
            IMapper mapper)
        {
            _dbContext = dbContext;
            _authorizationService = authorizationService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TagResponseDto>>> ReadProjectTags(
            [FromRoute] Guid projectId
        )
        {
            try
            {
                var project = await _dbContext.Projects.Include(p => p.Tags)
                    .SingleOrDefaultAsync(p => p.Id == projectId);
                if (project == default(Project)) return NotFound();

                return Ok(_mapper.Map<List<TagResponseDto>>(project.Tags));
            }
            catch (Exception exception)
            {
                Log.Fatal(exception, "Fatal error while reading project tags");
                return Problem();
            }
        }

        [HttpPost]
        public async Task<ActionResult<TagResponseDto>> CreateProjectTags(
            [FromRoute] Guid projectId,
            [FromBody] CreateTagsRequestDto createTagsRequestDto
        )
        {
            try
            {
                var project = await _dbContext.Projects.Include(p => p.Tags)
                    .SingleOrDefaultAsync(p => p.Id == projectId);
                if (project == default(Project)) return NotFound();

                var authorization =
                    await _authorizationService.AuthorizeAsync(User, project, Permission.UpdateProject.ToString());
                if (!authorization.Succeeded) return Forbid();

                var tag = await _dbContext.Tags.SingleOrDefaultAsync(t => t.Name == createTagsRequestDto.Name);
                if (tag == default(Tag))
                {
                    tag = (await _dbContext.Tags.AddAsync(new Tag
                    {
                        Name = createTagsRequestDto.Name,
                        Projects = new List<Project> {project}
                    })).Entity;
                }
                else
                {
                    project.Tags.Add(tag);
                }

                await _dbContext.SaveChangesAsync();

                return Ok(_mapper.Map<TagResponseDto>(tag));
            }
            catch (Exception exception)
            {
                Log.Fatal(exception, "Fatal error while creating project tags");
                return Problem();
            }
        }

        [HttpDelete("{tagId:guid}")]
        public async Task<ActionResult> DeleteTag(
            [FromRoute] Guid projectId,
            [FromRoute] Guid tagId
        )
        {
            try
            {
                var project = await _dbContext.Projects.Include(p => p.Tags)
                    .SingleOrDefaultAsync(p => p.Id == projectId);
                if (project == default(Project)) return NotFound();

                var tag = project.Tags.SingleOrDefault(t => t.Id == tagId);
                if (tag == default(Tag)) return NotFound();

                project.Tags.Remove(tag);

                await _dbContext.SaveChangesAsync();

                return Ok();
            }
            catch (Exception exception)
            {
                Log.Fatal(exception, "Fatal error while deleting tag");
                return Problem();
            }
        }
    }
}