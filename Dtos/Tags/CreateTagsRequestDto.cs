using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace GeekHub.Dtos.Tags
{
    public class CreateTagsRequestDto
    {
        [Required] public IEnumerable<string> Names { get; set; }
    }
}