using System.Collections.Generic;
using System.Threading.Tasks;
using Refit;

namespace GeekHub.GitHub
{
    public interface IGitHubApi
    {
        [Get("/repos/{owner}/{repo}/languages")]
        Task<Dictionary<string, double>> GetRepoLanguagesAsync(string owner, string repo);
    }
}