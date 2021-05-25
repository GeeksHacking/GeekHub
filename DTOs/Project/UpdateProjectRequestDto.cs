using System.ComponentModel.DataAnnotations;
using GeekHub.Attributes;

namespace GeekHub.DTOs.Project
{
    public class UpdateProjectRequestDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        [Url] [GithubRepository] public string Repository { get; set; }
    }
}