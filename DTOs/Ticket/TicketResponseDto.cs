using System;
using GeekHub.DTOs.ApplicationUser;
using GeekHub.Models;

namespace GeekHub.DTOs.Ticket
{
    public class TicketResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public TicketType TicketType { get; set; }
        public TicketStatus TicketStatus { get; set; }
        public Guid? ReporterId { get; set; }
        public Guid? AssigneeId { get; set; }
        public Guid? ParentTicketId { get; set; }
    }
}