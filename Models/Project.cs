using System;
using System.Collections.Generic;

namespace GeekHub.Models
{
    public class Project
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Uri Repository { get; set; }

        public ICollection<ApplicationUser> Users { get; set; }
        public ICollection<Tag> Tags { get; set; }
        public ICollection<Language> Languages { get; set; }
    }
}