using System;
using System.ComponentModel.DataAnnotations;
using GeekHub.DTOs.ApplicationUser;
using GeekHub.Models;

namespace GeekHub.DTOs.Ticket
{
    public class CreateTicketRequestDto
    {
        [Required] public string Name { get; set; }
        public string Description { get; set; }
        [Required] public TicketType TicketType { get; set; }
        [Required] public TicketStatus TicketStatus { get; set; }
        public Guid ReporterId { get; set; }
        public Guid AssigneeId { get; set; }
        public Guid ParentTicketId { get; set; }
    }
}