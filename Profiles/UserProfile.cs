using AutoMapper;
using GeekHub.DTOs.ApplicationUser;
using GeekHub.Models;

namespace GeekHub.Profiles
{
    public class UserProfile: Profile
    {
        public UserProfile()
        {
            CreateMap<ApplicationUser, ApplicationUserResponseDto>();
        }
    }
}