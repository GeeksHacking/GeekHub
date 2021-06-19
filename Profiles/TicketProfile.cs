using System;
using AutoMapper;
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
                .ForMember(t => t.ParentTicketId, s => s.MapFrom(t => t.ParentTicket.Id))
                .ForMember(t => t.TicketStatus, s =>
                    s.MapFrom(t => t.TicketStatus.ToString()))
                .ForMember(t => t.TicketType, s =>
                    s.MapFrom(t => t.TicketType.ToString()));
            CreateMap<CreateTicketRequestDto, Ticket>();
            CreateMap<UpdateTicketRequestDto, Ticket>().ReverseMap();
        }
    }
}