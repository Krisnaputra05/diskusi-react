import React from 'react';
import { useSelector } from 'react-redux';

function LoadingBar() {
  const authStatus = useSelector((state) => state.auth.status);
  const threadsStatus = useSelector((state) => state.threads.status);
  const usersStatus = useSelector((state) => state.users.status);
  const leaderboardStatus = useSelector((state) => state.leaderboard.status);
  const threadDetailStatus = useSelector((state) => state.threadDetail.status);

  const isLoading = [authStatus, threadsStatus, usersStatus, leaderboardStatus, threadDetailStatus].includes('loading');

  if (!isLoading) return null;

  return (
    <div className="loading-bar w-full fixed top-0 left-0 z-50">
        <div className="h-1 bg-secondary-color animate-pulse w-full" />
    </div>
  );
}

export default LoadingBar;
