import { useState, useEffect } from 'react';

const useGitHubStats = (username) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch GitHub stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [username]);

  return { stats, loading };
};

export default useGitHubStats;