using AutoMapper;
using GeekHub.Dtos.Language;
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