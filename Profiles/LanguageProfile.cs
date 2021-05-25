using AutoMapper;
using GeekHub.DTOs.Language;
using GeekHub.Models;

namespace GeekHub.Profiles
{
    public class LanguageProfile: Profile
    {
        public LanguageProfile()
        {
            CreateMap<Language, LanguageResponseDto>();
        }
    }
}