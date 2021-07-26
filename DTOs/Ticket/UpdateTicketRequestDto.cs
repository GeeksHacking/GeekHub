using System;
using System.ComponentModel.DataAnnotations;
using GeekHub.Models;

namespace GeekHub.DTOs.Ticket
{
    public class UpdateTicketRequestDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        [EnumDataType(typeof(TicketType))] public TicketType TicketType { get; set; }
        [EnumDataType(typeof(TicketStatus))] public TicketStatus TicketStatus { get; set; }
        public Guid? ReporterId { get; set; }
        public Guid? AssigneeId { get; set; }
        public Guid? ParentTicketId { get; set; }
    }
}