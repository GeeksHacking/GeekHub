using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using GeekHub.Attributes;
using GeekHub.Data;
using GeekHub.DTOs.Ticket;
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
    public class TicketsController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IAuthorizationService _authorizationService;

        public TicketsController(ApplicationDbContext dbContext, IMapper mapper,
            IAuthorizationService authorizationService)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _authorizationService = authorizationService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketResponseDto>>> ReadProjectTickets(
            [FromRoute] Guid projectId
        )
        {
            try
            {
                var tickets = await _dbContext.Tickets.Include(t => t.Project).Where(t => t.Project.Id == projectId)
                    .ToListAsync();

                return Ok(_mapper.Map<IEnumerable<TicketResponseDto>>(tickets));
            }
            catch (Exception exception)
            {
                Log.Fatal(exception, "Fatal error while reading project tickets");
                return Problem();
            }
        }

        [HttpPost]
        public async Task<ActionResult<TicketResponseDto>> CreateProjectTicket(
            [FromRoute] Guid projectId,
            [FromBody] CreateTicketRequestDto createTicketRequestDto
        )
        {
            try
            {
                var project = await _dbContext.Projects.Include(p => p.Tags)
                    .SingleOrDefaultAsync(p => p.Id == projectId);
                if (project == default(Project)) return NotFound();

                var authorization =
                    await _authorizationService.AuthorizeAsync(User, project, Permission.CreateTask.ToString());
                if (!authorization.Succeeded) return Forbid();

                var ticket = _mapper.Map<Ticket>(createTicketRequestDto);
                if (ticket.ParentTicketId is not null &&
                    await _dbContext.Tickets.FindAsync(ticket.ParentTicketId) is null) return NotFound();
                
                // TODO - add checks whether reporter/assignee is in project

                ticket.ProjectId = projectId;
                await _dbContext.Tickets.AddAsync(ticket);
                await _dbContext.SaveChangesAsync();

                return Ok(_mapper.Map<TicketResponseDto>(ticket));
            }
            catch (Exception exception)
            {
                Log.Fatal(exception, "Fatal error while creating project ticket");
                return Problem();
            }
        }
    }
}