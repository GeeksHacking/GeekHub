using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using GeekHub.Attributes;
using GeekHub.Data;
using GeekHub.DTOs.Language;
using GeekHub.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace GeekHub.Controllers
{
    [Microsoft.AspNetCore.Authorization.Authorize]
    [AddUserId]
    [ApiController]
    [Route("Projects/{projectId:guid}/[controller]")]
    public class LanguagesController: ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IMapper _mapper;

        public LanguagesController(ApplicationDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LanguageResponseDto>>> ReadProjectLanguages(
            [FromRoute] Guid projectId
        )
        {
            try
            {
                var project = await _dbContext.Projects.Include(p => p.Languages)
                    .SingleOrDefaultAsync(p => p.Id == projectId);
                if (project == default(Project)) return NotFound();

                return Ok(_mapper.Map<IEnumerable<LanguageResponseDto>>(project.Languages));
            }
            catch (Exception exception)
            {
                Log.Fatal(exception, "Fatal error while reading project");
                return Problem();
            }
        }
    }
}