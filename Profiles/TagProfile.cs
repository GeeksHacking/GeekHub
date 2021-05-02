using AutoMapper;
using GeekHub.Dtos.Tags;
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