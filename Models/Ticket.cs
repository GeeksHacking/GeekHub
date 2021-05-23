using System;

namespace GeekHub.Models
{
    public class Ticket
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public TicketType TicketType { get; set; }
        public TicketStatus TicketStatus { get; set; }
        public Project Project { get; set; }
        public ApplicationUser Reporter { get; set; }
        public ApplicationUser Assignee { get; set; }
        public Ticket ParentTicket { get; set; }
    }
}