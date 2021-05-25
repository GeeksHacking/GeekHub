using System;
using AutoMapper;
using GeekHub.Converters;
using GeekHub.DTOs.Ticket;
using GeekHub.Models;

namespace GeekHub.Profiles
{
    public class TicketProfile : Profile
    {
        public TicketProfile()
        {
            CreateMap<Ticket, TicketResponseDto>()
                .ForMember(t => t.ReporterId, s => s.MapFrom(t => t.Reporter.Id))
                .ForMember(t => t.AssigneeId, s => s.MapFrom(t => t.Assignee.Id))
                .ForMember(t => t.ParentTicketId, s => s.MapFrom(t => t.ParentTicket.Id));
            CreateMap<CreateTicketRequestDto, Ticket>().ConvertUsing<CreateTicketRequestDtoToTicketConverter>();
        }
    }
}