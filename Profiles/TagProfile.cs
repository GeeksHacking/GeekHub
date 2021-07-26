using AutoMapper;
using GeekHub.DTOs.Tags;
using GeekHub.Models;

namespace GeekHub.Profiles
{
    public class TagProfile: Profile
    {
        public TagProfile()
        {
            CreateMap<Tag, TagResponseDto>();
        }
    }
}