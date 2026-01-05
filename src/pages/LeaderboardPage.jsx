import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asyncPopulateLeaderboards } from '../features/leaderboard/leaderboardSlice';

const getRankStyle = (index) => {
  switch (index) {
    case 0: return 'bg-yellow-100 text-yellow-700';
    case 1: return 'bg-gray-200 text-gray-700';
    case 2: return 'bg-orange-100 text-orange-700';
    default: return 'bg-transparent text-gray-400';
  }
};

function LeaderboardPage() {
  const dispatch = useDispatch();
  const { list: leaderboards, status } = useSelector((state) => state.leaderboard);

  useEffect(() => {
    dispatch(asyncPopulateLeaderboards());
  }, [dispatch]);

  if (status === 'loading' && leaderboards.length === 0) {
      return <div className="text-center mt-10">Loading leaderboards...</div>;
  }

  return (
    <div className="container max-w-3xl mx-auto mt-8 pb-10 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Active Users Leaderboard</h1>
      
      <div className="card overflow-hidden p-0 border border-gray-200 shadow-sm rounded-xl bg-white">
          <div className="bg-gray-50 border-b border-gray-100 p-4 flex justify-between items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span>User</span>
              <span>Score</span>
          </div>

          <div className="divide-y divide-gray-50">
              {leaderboards.map(({ user, score }, index) => (
                  <div key={user.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                          <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm 
                              ${getRankStyle(index)}`}>
                              {index + 1}
                          </span>
                          
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border border-gray-100 bg-gray-200 object-cover" />
                          
                          <div>
                              <div className="font-semibold text-gray-900">{user.name}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                      </div>
                      
                      <div className="text-xl font-bold text-primary-600 tabular-nums">
                          {score}
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;
