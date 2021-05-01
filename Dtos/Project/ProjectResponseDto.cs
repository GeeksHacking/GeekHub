using System;

namespace GeekHub.Dtos.Project
{
    public class ProjectResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Uri Repository { get; set; }
    }
}