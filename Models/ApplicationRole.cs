using System;
using Microsoft.AspNetCore.Identity;

namespace GeekHub.Models
{
    public class ApplicationRole: IdentityRole<Guid>
    {
        public Guid ProjectId { get; set; }
        public Project Project { get; set; }
    }
}