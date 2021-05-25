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
        public Guid ProjectId { get; set; }
        public Project Project { get; set; }
        public Guid? ReporterId { get; set; }
        public virtual ApplicationUser Reporter { get; set; }
        public Guid? AssigneeId { get; set; }
        public virtual ApplicationUser Assignee { get; set; }
        public Guid? ParentTicketId { get; set; }
        public virtual Ticket ParentTicket { get; set; }
    }
}