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
                .ForMember(t => t.TicketStatus, s =>
                    s.MapFrom(t => t.TicketStatus.ToString()))
                .ForMember(t => t.TicketType, s =>
                    s.MapFrom(t => t.TicketType.ToString()));
            CreateMap<CreateTicketRequestDto, Ticket>();
            CreateMap<UpdateTicketRequestDto, Ticket>().ReverseMap();
        }
    }
}