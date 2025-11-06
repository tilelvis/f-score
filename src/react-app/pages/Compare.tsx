import { useState } from 'react';
import { Users, Search, Trophy, UserPlus } from 'lucide-react';
import type { NeynarUserData, UserStatsResponse } from '@/shared/types';

export default function Compare() {
  const [user1Query, setUser1Query] = useState('');
  const [user2Query, setUser2Query] = useState('');
  const [user1Stats, setUser1Stats] = useState<NeynarUserData | null>(null);
  const [user2Stats, setUser2Stats] = useState<NeynarUserData | null>(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [error1, setError1] = useState<string | null>(null);
  const [error2, setError2] = useState<string | null>(null);

  const fetchUserStats = async (query: string, setUser: (user: NeynarUserData | null) => void, setLoading: (loading: boolean) => void, setError: (error: string | null) => void) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setUser(null);

    try {
      const isNumeric = /^\d+$/.test(query.trim());
      const endpoint = isNumeric 
        ? `/api/user-stats/${query.trim()}`
        : `/api/user-stats/username/${encodeURIComponent(query.trim())}`;

      const response = await fetch(endpoint);
      const data: UserStatsResponse = await response.json();

      if (data.success && data.data) {
        setUser(data.data);
      } else {
        setError(data.error || 'User not found');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch1 = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUserStats(user1Query, setUser1Stats, setLoading1, setError1);
  };

  const handleSearch2 = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUserStats(user2Query, setUser2Stats, setLoading2, setError2);
  };

  const UserCard = ({ 
    user, 
    query, 
    setQuery, 
    loading, 
    error, 
    onSearch, 
    title 
  }: {
    user: NeynarUserData | null;
    query: string;
    setQuery: (query: string) => void;
    loading: boolean;
    error: string | null;
    onSearch: (e: React.FormEvent) => void;
    title: string;
  }) => (
    <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      {/* Search Form */}
      <form onSubmit={onSearch} className="mb-4">
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Username or FID..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-6 text-red-600">
          <p className="text-sm">{error}</p>
        </div>
      ) : user ? (
        <div className="space-y-4">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            {user.pfpUrl ? (
              <img
                src={user.pfpUrl}
                alt={user.displayName || user.username || `User ${user.fid}`}
                className="w-12 h-12 rounded-full border-2 border-gray-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center">
                <span className="text-white font-semibold">
                  {(user.displayName || user.username || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h4 className="font-semibold text-gray-900">
                {user.displayName || user.username || `User ${user.fid}`}
              </h4>
              {user.username && (
                <p className="text-gray-500 text-sm">@{user.username}</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">Neynar Score</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {user.score?.toLocaleString() || 'N/A'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Followers</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {user.followerCount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Following</span>
              </div>
              <span className="text-lg font-bold text-gray-900">
                {user.followingCount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Search for a user to compare</p>
        </div>
      )}
    </div>
  );

  // Comparison metrics
  const getComparison = () => {
    if (!user1Stats || !user2Stats) return null;

    const scoreDiff = (user1Stats.score || 0) - (user2Stats.score || 0);
    const followerDiff = user1Stats.followerCount - user2Stats.followerCount;
    const followingDiff = user1Stats.followingCount - user2Stats.followingCount;

    return { scoreDiff, followerDiff, followingDiff };
  };

  const comparison = getComparison();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Compare Users
            </h1>
          </div>
          <p className="text-gray-600 max-w-md mx-auto">
            Compare two Farcaster users side by side to see their stats and metrics
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <UserCard
              user={user1Stats}
              query={user1Query}
              setQuery={setUser1Query}
              loading={loading1}
              error={error1}
              onSearch={handleSearch1}
              title="User 1"
            />

            {/* VS Divider */}
            <div className="flex items-center justify-center md:flex-col md:py-20">
              <div className="flex items-center space-x-2 md:space-x-0 md:space-y-2 md:flex-col">
                <div className="hidden md:block w-px h-16 bg-gray-300"></div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">VS</span>
                </div>
                <div className="hidden md:block w-px h-16 bg-gray-300"></div>
                <div className="md:hidden h-px flex-1 bg-gray-300"></div>
              </div>
            </div>

            <UserCard
              user={user2Stats}
              query={user2Query}
              setQuery={setUser2Query}
              loading={loading2}
              error={error2}
              onSearch={handleSearch2}
              title="User 2"
            />
          </div>

          {/* Comparison Results */}
          {comparison && user1Stats && user2Stats && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Comparison Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700 mb-1">Neynar Score Difference</p>
                  <p className={`text-xl font-bold ${comparison.scoreDiff > 0 ? 'text-green-600' : comparison.scoreDiff < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {comparison.scoreDiff > 0 ? '+' : ''}{comparison.scoreDiff.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {comparison.scoreDiff > 0 ? `${user1Stats.displayName || user1Stats.username || 'User 1'} leads` : 
                     comparison.scoreDiff < 0 ? `${user2Stats.displayName || user2Stats.username || 'User 2'} leads` : 'Tied'}
                  </p>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700 mb-1">Follower Difference</p>
                  <p className={`text-xl font-bold ${comparison.followerDiff > 0 ? 'text-green-600' : comparison.followerDiff < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {comparison.followerDiff > 0 ? '+' : ''}{comparison.followerDiff.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {comparison.followerDiff > 0 ? `${user1Stats.displayName || user1Stats.username || 'User 1'} leads` : 
                     comparison.followerDiff < 0 ? `${user2Stats.displayName || user2Stats.username || 'User 2'} leads` : 'Tied'}
                  </p>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <UserPlus className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700 mb-1">Following Difference</p>
                  <p className={`text-xl font-bold ${comparison.followingDiff > 0 ? 'text-green-600' : comparison.followingDiff < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    {comparison.followingDiff > 0 ? '+' : ''}{comparison.followingDiff.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {comparison.followingDiff > 0 ? `${user1Stats.displayName || user1Stats.username || 'User 1'} leads` : 
                     comparison.followingDiff < 0 ? `${user2Stats.displayName || user2Stats.username || 'User 2'} leads` : 'Tied'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
