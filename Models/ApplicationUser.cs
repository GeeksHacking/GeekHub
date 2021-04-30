using System;
using System.Collections.Generic;

using Microsoft.AspNetCore.Identity;

namespace GeekHub.Models
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public List<Project> Projects { get; set; }
    }
}