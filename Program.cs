using System;
using System.Threading.Tasks;
using GeekHub.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Events;

namespace GeekHub
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                .Enrich.FromLogContext()
                .WriteTo.File("logs.log", rollingInterval: RollingInterval.Day)
                .WriteTo.Console()
                .CreateLogger();

            Log.Information("Building host...");
            var host = CreateHostBuilder(args).Build();
            Log.Information("Host built");

            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var hostingEnvironment = services.GetService<IWebHostEnvironment>();

                await CreateDbIfNotExists(host, hostingEnvironment);
            }

            await host.RunAsync();
        }

        private static async Task CreateDbIfNotExists(IHost host, IHostEnvironment env)
        {
            using var scope = host.Services.CreateScope();
            var services = scope.ServiceProvider;
            try
            {
                var context = services.GetRequiredService<ApplicationDbContext>();
                Log.Information("Creating Db...");
                // if (env.IsDevelopment())
                // {
                await context.Database.EnsureCreatedAsync();
                // }
                // else
                // {
                //     await context.Database.MigrateAsync();
                // }
                Log.Information("Db created");
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Could not create or run migrations on Db");
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseSerilog()
                .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<Startup>(); });
    }
}