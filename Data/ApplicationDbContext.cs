using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

using IdentityServer4.EntityFramework.Options;

using GeekHub.Models;

namespace GeekHub.Data
{
    public class ApplicationDbContext : ApplicationApiAuthorizationDbContext<ApplicationUser, ApplicationRole, Guid>
    {
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }
        
        public DbSet<Language> Languages { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Tag> Tags { get; set; }
    }
}