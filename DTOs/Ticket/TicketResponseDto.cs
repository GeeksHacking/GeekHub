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
        public string TicketType { get; set; }
        public string TicketStatus { get; set; }
        public Guid? ReporterId { get; set; }
        public Guid? AssigneeId { get; set; }
        public Guid? ParentTicketId { get; set; }
    }
}