using System;
using GeekHub.Dtos.ApplicationUser;
using GeekHub.Models;

namespace GeekHub.Dtos.Ticket
{
    public class TicketResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public TicketType TicketType { get; set; }
        public TicketStatus TicketStatus { get; set; }
        public ApplicationUserResponseDto Reporter { get; set; }
        public ApplicationUserResponseDto Assignee { get; set; }
        public TicketResponseDto ParentTicket { get; set; }
    }
}