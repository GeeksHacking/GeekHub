using System;
using System.Collections.Generic;

namespace GeekHub.Models
{
    public class Tag
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        
        public ICollection<Project> Projects { get; set; }
    }
}