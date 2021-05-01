using System.ComponentModel.DataAnnotations;

using GeekHub.Attributes;

namespace GeekHub.Dtos.Project
{
    public class CreateProjectRequestDto
    {
        [Required] public string Name { get; set; }
        public string Description { get; set; }
        [Required] [Url] [GithubRepository] public string Repository { get; set; }
    }
}