using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using GeekHub.Attributes;
using GeekHub.Data;
using GeekHub.DTOs.ApplicationUser;
using GeekHub.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace GeekHub.Controllers
{
    [Authorize]
    [AddUserId]
    [ApiController]
    [Route("Projects/{projectId:guid}/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IAuthorizationService _authorizationService;

        public UsersController(ApplicationDbContext dbContext, IMapper mapper,
            IAuthorizationService authorizationService)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _authorizationService = authorizationService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ApplicationUserResponseDto>>> ReadProjectMembers(
            [FromRoute] Guid projectId
        )
        {
            try
            {
                var project = await _dbContext.Projects.Include(p => p.Users)
                    .SingleOrDefaultAsync(p => p.Id == projectId);
                if (project == default(Project)) return NotFound();

                return Ok(_mapper.Map<IEnumerable<ApplicationUserResponseDto>>(project.Users));
            }
            catch (Exception exception)
            {
                Log.Fatal(exception, "Fatal error while reading project members");
                return Problem();
            }
        }

        [HttpGet("{userId:guid}")]
        public async Task<ActionResult<ApplicationUserResponseDto>> ReadProjectMember(
            [FromRoute] Guid projectId,
            [FromRoute] Guid userId
        )
        {
            try
            {
                var project = await _dbContext.Projects.Include(p => p.Users)
                    .SingleOrDefaultAsync(p => p.Id == projectId);
                if (project == default(Project)) return NotFound();

                var user = project.Users.SingleOrDefault(u => u.Id == userId);
                if (user == default(ApplicationUser)) return NotFound();

                return Ok(_mapper.Map<ApplicationUserResponseDto>(user));
            }
            catch (Exception exception)
            {
                Log.Fatal(exception, "Fatal error while reading project member");
                return Problem();
            }
        }
    }
}