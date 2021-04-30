using System.Collections.Generic;
using System.Threading.Tasks;

namespace GeekHub.Services
{
    public interface IGitHubService
    {
        public Task<IEnumerable<string>> GetLanguagesAsync(string owner, string repo);
    }
}