using System;
using System.Collections.Generic;

using Microsoft.AspNetCore.Identity;

namespace GeekHub.Models
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public List<Project> Projects { get; set; }
        public List<Ticket> ReportedTickets { get; set; }
        public List<Ticket> AssignedTickets { get; set; }
    }
}