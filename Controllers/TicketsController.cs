using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using GeekHub.Attributes;
using GeekHub.Data;
using GeekHub.Dtos.Ticket;
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
            _mapper = _mapper;
            _authorizationService = authorizationService;
        }

        // TODO - return Ids
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketResponseDto>>> ReadProjectTickets(
            [FromRoute] Guid projectId
        )
        {
            try
            {
                var tickets = await _dbContext.Tickets.Include(t => t.Project).Where(t => t.Project.Id == projectId)
                    .ToListAsync();
                
                return Ok(_mapper.Map<List<TicketResponseDto>>(tickets));
            }
            catch (Exception exception)
            {
                Log.Fatal(exception, "Fatal error while reading project tickets");
                return Problem();
            }
        }
    }
}