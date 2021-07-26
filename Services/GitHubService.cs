using System.Collections.Generic;
using System.Threading.Tasks;

using GeekHub.GitHub;

namespace GeekHub.Services
{
    public class GitHubService : IGitHubService
    {
        private readonly IGitHubApi _gitHubApi;

        public GitHubService(IGitHubApi gitHubApi)
        {
            _gitHubApi = gitHubApi;
        }

        public async Task<IEnumerable<string>> GetLanguagesAsync(string owner, string repo)
        {
            var languages = await _gitHubApi.GetRepoLanguagesAsync(owner, repo);

            return languages.Keys;
        }
    }
}