let token: string | null = null;

export function initializeGitHubApi(accessToken: string) {
  token = accessToken;
}

export async function fetchRepositoryData(repoUrl: string) {
  if (!token) {
    throw new Error('GitHub API not initialized. Please provide a token first.');
  }

  const [, , , owner, repo] = repoUrl.split('/');

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Repository not found. Please check the URL and try again.');
      }
      throw new Error(`GitHub API request failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.tree) {
      throw new Error('Invalid repository data received. Please check the URL and try again.');
    }

    const files = data.tree
      .filter((item: { type: string }) => item.type === 'blob')
      .map((item: { path: string }) => item.path);

    return { files };
  } catch (error) {
    console.error('Error fetching repository data:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch repository data: ${error.message}`);
    } else {
      throw new Error('An unexpected error occurred while fetching repository data.');
    }
  }
}