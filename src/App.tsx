import React, { useState } from 'react';
import { Github } from 'lucide-react';
import FileStructure from './components/FileStructure';
import FileCorrelation from './components/FileCorrelation';
import { fetchRepositoryData, initializeGitHubApi } from './utils/githubApi';

function App() {
  const [repoUrl, setRepoUrl] = useState('');
  const [token, setToken] = useState('');
  const [repoData, setRepoData] = useState<{ files: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRepoData(null);

    if (!token) {
      setError('Please enter a GitHub Personal Access Token.');
      setLoading(false);
      return;
    }

    if (!repoUrl) {
      setError('Please enter a GitHub repository URL.');
      setLoading(false);
      return;
    }

    try {
      initializeGitHubApi(token);
      const data = await fetchRepositoryData(repoUrl);
      setRepoData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center flex items-center justify-center">
          <Github className="mr-2" />
          GitHub Project Analyzer
        </h1>
        <div className="mb-8 p-4 bg-blue-100 rounded-md">
          <h2 className="text-xl font-semibold mb-2">How to use:</h2>
          <ol className="list-decimal list-inside">
            <li>Generate a GitHub Personal Access Token (PAT) with 'repo' scope.</li>
            <li>Enter your PAT in the first input field below.</li>
            <li>Enter the GitHub repository URL you want to analyze.</li>
            <li>Click 'Analyze' to visualize the repository structure and file correlations.</li>
          </ol>
        </div>
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col space-y-4">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your GitHub Personal Access Token"
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex">
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="Enter GitHub repository URL (e.g., https://github.com/owner/repo)"
                className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </div>
        </form>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {repoData && (
          <div>
            <FileStructure files={repoData.files} />
            <FileCorrelation files={repoData.files} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;