using System;

namespace GeekHub.DTOs.Project
{
    public class ProjectResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Uri Repository { get; set; }
    }
}