using System;
using AutoMapper;
using GeekHub.DTOs.Ticket;
using GeekHub.Models;

namespace GeekHub.Converters
{
    public class CreateTicketRequestDtoToTicketConverter: ITypeConverter<CreateTicketRequestDto, Ticket>
    {
        public Ticket Convert(CreateTicketRequestDto source, Ticket destination, ResolutionContext context)
        {
            return new()
            {
                Name = source.Name,
                Description = source.Description,
                TicketType = source.TicketType,
                TicketStatus = source.TicketStatus,
                ReporterId = source.ReporterId == Guid.Empty ? null : source.ReporterId,
                AssigneeId = source.AssigneeId == Guid.Empty ? null : source.AssigneeId,
                ParentTicketId = source.ParentTicketId == Guid.Empty ? null : source.ParentTicketId
            };
        }
    }
}