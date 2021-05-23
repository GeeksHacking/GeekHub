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

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Ticket>()
                .HasOne(t => t.Reporter)
                .WithMany(u => u.ReportedTickets);
            builder.Entity<Ticket>()
                .HasOne(t => t.Assignee)
                .WithMany(u => u.AssignedTickets);
        }

        public DbSet<Language> Languages { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Tag> Tags { get; set; }
    }
}