using System;
using System.Collections.Generic;

namespace GeekHub.Models
{
    public class Language
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        
        public ICollection<Project> Projects { get; set; }
    }
}