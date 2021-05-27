using AutoMapper;

using GeekHub.DTOs.Project;
using GeekHub.Models;

namespace GeekHub.Profiles
{
    public class ProjectProfile : Profile
    {
        public ProjectProfile()
        {
            CreateMap<Project, ProjectResponseDto>().ReverseMap();
            CreateMap<CreateProjectRequestDto, Project>();
            CreateMap<UpdateProjectRequestDto, Project>().ReverseMap();
        }
    }
}