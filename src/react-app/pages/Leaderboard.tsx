import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Crown, ChevronDown, ChevronUp } from 'lucide-react'; // Import Chevron icons
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import ErrorMessage from '@/react-app/components/ErrorMessage';
import type { NeynarUserData } from '@/shared/types';

interface LeaderboardResponse {
  success: boolean;
  data?: NeynarUserData[];
  error?: string;
}

// 1. Define a type for the expanded state map
type ExpandedState = {
  [key: number]: boolean;
};

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<NeynarUserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 2. New state to track which user cards are expanded
  const [expandedUsers, setExpandedUsers] = useState<ExpandedState>({});

  const fetchLeaderboard = async () => {
    // ... (rest of fetchLeaderboard remains the same)
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/leaderboard');
      const data: LeaderboardResponse = await response.json();

      if (data.success && data.data) {
        setLeaderboard(data.data);
      } else {
        setError(data.error || 'Failed to fetch leaderboard');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // 3. New toggle function for card expansion
  const toggleDetails = (fid: number) => {
    setExpandedUsers(prev => ({
      ...prev,
      [fid]: !prev[fid],
    }));
  };

  // ... (getRankIcon and getRankColor functions remain the same)
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-500" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-orange-400 to-orange-600';
      default:
        return 'from-purple-400 to-indigo-500';
    }
  };
    
  if (isLoading) {
    return (
      <div className="h-full bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner message="Loading leaderboard..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message={error} onRetry={fetchLeaderboard} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50"> 
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Trophy className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              FarScore Leaderboard
            </h1>
          </div>
          <p className="text-xs text-gray-600 max-w-md mx-auto">
            Top Farcaster users ranked by Neynar score
          </p>
        </div>

        {/* Leaderboard */}
        <div className="max-w-xl mx-auto space-y-2">
          {leaderboard.slice(0, 5).map((user, index) => {
            const rank = index + 1;
            const isExpanded = expandedUsers[user.fid] || false; // Check expansion state

            return (
              <div
                key={user.fid}
                className={`
                  relative bg-white rounded-xl shadow-md border 
                  ${rank <= 3 ? 'border-2' : 'border-gray-200'}
                  ${rank === 1 ? 'border-yellow-300' : rank === 2 ? 'border-gray-300' : rank === 3 ? 'border-orange-300' : ''}
                  transition-all duration-300
                `}
              >
                {rank <= 3 && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${getRankColor(rank)} opacity-5`} />
                )}
                
                {/* Main Compact Row */}
                <div className="relative p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {/* Rank */}
                    <div className="flex-shrink-0">
                      {getRankIcon(rank)}
                    </div>

                    {/* User Avatar */}
                    <div className="flex-shrink-0">
                      {user.pfpUrl ? (
                        <img
                          src={user.pfpUrl}
                          alt={user.username || `User ${user.fid}`}
                          className="w-8 h-8 rounded-full border border-gray-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {(user.username || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* User Info (Username only) */}
                    <div className="min-w-0">
                      {user.username && (
                        <p className="text-gray-900 text-sm font-semibold truncate">@{user.username}</p>
                      )}
                    </div>
                  </div>

                  {/* Score & Dropdown Toggle (Right side) */}
                  <div className="flex items-center space-x-3 text-right flex-shrink-0">
                    <div>
                        {/* 4. Clearly label the score */}
                        <p className="text-sm text-gray-500 font-medium">Neynar Score</p> 
                        <p className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                            {user.score?.toLocaleString() || 'N/A'}
                        </p>
                    </div>
                    
                    {/* 5. Dropdown Toggle Button */}
                    <button 
                        onClick={() => toggleDetails(user.fid)}
                        className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                        aria-expanded={isExpanded}
                        aria-controls={`details-${user.fid}`}
                    >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* 6. Expandable Details Section */}
                {isExpanded && (
                  <div 
                    id={`details-${user.fid}`}
                    className="p-3 pt-0 border-t border-gray-100"
                  >
                    <div className="flex justify-between text-xs text-gray-600">
                        <div className="space-y-1">
                            <p className="font-medium text-gray-800">FID: <span className="font-normal">{user.fid}</span></p>
                            <p className="font-medium text-gray-800">Following: <span className="font-normal">{user.followingCount.toLocaleString()}</span></p>
                        </div>
                        <div className="space-y-1 text-right">
                            <p className="font-medium text-gray-800">Followers: <span className="font-normal">{user.followerCount.toLocaleString()}</span></p>
                            {user.displayName && user.displayName !== user.username && (
                                <p className="font-medium text-gray-800">Name: <span className="font-normal">{user.displayName}</span></p>
                            )}
                        </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {leaderboard.length > 5 && (
            <p className="text-center text-xs text-gray-500 pt-2">
                Showing top 5 users only.
            </p>
          )}

          {leaderboard.length === 0 && (
            <div className="text-center py-6">
              <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <h3 className="text-md font-semibold text-gray-900 mb-1">No data available</h3>
              <p className="text-sm text-gray-600">Leaderboard data is currently unavailable.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}