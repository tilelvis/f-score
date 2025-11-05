import { useState } from 'react';
import { Users, Search, Trophy } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Compare Users
          </h1>
          <p className="text-gray-600">Compare Farcaster users side by side</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {/* User 1 Column */}
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <Users className="text-purple-600 mr-3" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">User 1</h2>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={user1Query}
                onChange={(e) => setUser1Query(e.target.value)}
                placeholder="Enter FID or username"
                className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <button
                onClick={() => fetchUserStats(user1Query, setUser1Stats, setLoading1, setError1)}
                disabled={loading1}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center"
              >
                <Search size={18} className="mr-2" />
                Search
              </button>
            </div>
            {loading1 && <div className="mt-4 text-center">Loading...</div>}
            {error1 && <div className="mt-4 text-red-500">{error1}</div>}
            {user1Stats && (
              <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                <h3 className="font-bold text-lg">{user1Stats.username}</h3>
                <p>Followers: {user1Stats.followerCount}</p>
                <p>Following: {user1Stats.followingCount}</p>
              </div>
            )}
          </div>

          {/* User 2 Column */}
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center mb-4">
              <Users className="text-indigo-600 mr-3" size={24} />
              <h2 className="text-xl font-semibold text-gray-800">User 2</h2>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={user2Query}
                onChange={(e) => setUser2Query(e.target.value)}
                placeholder="Enter FID or username"
                className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button
                onClick={() => fetchUserStats(user2Query, setUser2Stats, setLoading2, setError2)}
                disabled={loading2}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 flex items-center"
              >
                <Search size={18} className="mr-2" />
                Search
              </button>
            </div>
            {loading2 && <div className="mt-4 text-center">Loading...</div>}
            {error2 && <div className="mt-4 text-red-500">{error2}</div>}
            {user2Stats && (
              <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                <h3 className="font-bold text-lg">{user2Stats.username}</h3>
                <p>Followers: {user2Stats.followerCount}</p>
                <p>Following: {user2Stats.followingCount}</p>
              </div>
            )}
          </div>
        </div>

        {user1Stats && user2Stats && (
          <div className="mt-8 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200">
            <div className="text-center mb-4">
              <Trophy className="text-yellow-500 mx-auto" size={32} />
              <h2 className="text-2xl font-bold text-gray-800">Comparison</h2>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="font-semibold text-gray-700">Metric</div>
              <div className="font-bold text-purple-700">{user1Stats.username}</div>
              <div className="font-bold text-indigo-700">{user2Stats.username}</div>

              <div>Followers</div>
              <div>{user1Stats.followerCount}</div>
              <div>{user2Stats.followerCount}</div>

              <div>Following</div>
              <div>{user1Stats.followingCount}</div>
              <div>{user2Stats.followingCount}</div>

              <div></div>
              <div className={user1Stats.followerCount > user2Stats.followerCount ? 'text-green-500 font-bold' : ''}>
                {user1Stats.followerCount > user2Stats.followerCount ? 'Winner' : ''}
              </div>
              <div className={user2Stats.followerCount > user1Stats.followerCount ? 'text-green-500 font-bold' : ''}>
                {user2Stats.followerCount > user1Stats.followerCount ? 'Winner' : ''}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
