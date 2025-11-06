import { useState, useEffect } from 'react';
import { Users, UserPlus, TrendingUp, Star, Search, Compass } from 'lucide-react';
import { useFarcasterUser } from '@/react-app/hooks/useFarcasterUser';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import ErrorMessage from '@/react-app/components/ErrorMessage';
import type { NeynarUserData } from '@/shared/types';

interface DiscoveryResponse {
  success: boolean;
  data?: {
    trending: NeynarUserData[];
    recommendations: NeynarUserData[];
    similarUsers: NeynarUserData[];
  };
  error?: string;
}

export default function Discovery() {
  const { user: farcasterUser } = useFarcasterUser();
  const [discoveryData, setDiscoveryData] = useState<DiscoveryResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'trending' | 'recommendations' | 'similar'>('trending');

  const fetchDiscoveryData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = farcasterUser?.fid 
        ? `/api/discovery?fid=${farcasterUser.fid}`
        : '/api/discovery';
      
      const response = await fetch(endpoint);
      const data: DiscoveryResponse = await response.json();

      if (data.success && data.data) {
        setDiscoveryData(data.data);
      } else {
        setError(data.error || 'Failed to fetch discovery data');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscoveryData();
  }, [farcasterUser?.fid]);

  const UserCard = ({ user }: { user: NeynarUserData }) => {
    
    const handleViewProfile = () => {
      const username = user.username;
      
      if (username) {
        const profileUrl = `https://warpcast.com/${username}`;
        window.open(profileUrl, '_blank');
      } else {
        console.error(`Cannot view profile: User ${user.fid} has no username.`);
      }
    };

    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3">
          {user.pfpUrl ? (
            <img
              src={user.pfpUrl}
              alt={user.displayName || user.username || `User ${user.fid}`}
              className="w-12 h-12 rounded-full border-2 border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {(user.displayName || user.username || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {user.displayName || user.username || `User ${user.fid}`}
            </h3>
            {user.username && (
              <p className="text-gray-500 text-sm">@{user.username}</p>
            )}
            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{user.followerCount.toLocaleString()}</span>
              </div>
              {user.score && (
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>{user.score.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={handleViewProfile}
            className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
            disabled={!user.username}
          >
            <UserPlus className="w-4 h-4" />
            <span>View</span>
          </button>
        </div>
      </div>
    );
  };

  const TabButton = ({ 
    id, 
    label, 
    icon: Icon, 
    count 
  }: { 
    id: 'trending' | 'recommendations' | 'similar';
    label: string;
    icon: any;
    count: number;
  }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`
        flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all
        ${activeTab === id 
          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg' 
          : 'text-gray-600 hover:bg-gray-100'
        }
      `}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
      <span className={`
        text-xs px-2 py-1 rounded-full
        ${activeTab === id ? 'bg-white/20' : 'bg-gray-200 text-gray-600'}
      `}>
        {count}
      </span>
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner message="Discovering amazing people..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage message={error} onRetry={fetchDiscoveryData} />
        </div>
      </div>
    );
  }

  const getCurrentUsers = () => {
    if (!discoveryData) return [];
    switch (activeTab) {
      case 'trending':
        return discoveryData.trending || [];
      case 'recommendations':
        return discoveryData.recommendations || [];
      case 'similar':
        return discoveryData.similarUsers || [];
      default:
        return [];
    }
  };

  const currentUsers = getCurrentUsers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Discover People
            </h1>
          </div>
          <p className="text-gray-600 max-w-md mx-auto">
            Find interesting people in the Farcaster ecosystem based on trending activity and social connections
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <TabButton
            id="trending"
            label="Trending"
            icon={TrendingUp}
            count={discoveryData?.trending?.length || 0}
          />
          {farcasterUser && (
            <>
              <TabButton
                id="recommendations"
                label="For You"
                icon={UserPlus}
                count={discoveryData?.recommendations?.length || 0}
              />
              <TabButton
                id="similar"
                label="Similar to You"
                icon={Users}
                count={discoveryData?.similarUsers?.length || 0}
              />
            </>
          )}
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {currentUsers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentUsers.map((user: NeynarUserData) => (
                <UserCard key={user.fid} user={user} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">
                {activeTab === 'trending' 
                  ? 'No trending users available right now.'
                  : farcasterUser 
                    ? 'No recommendations available. Try again later!'
                    : 'Connect your Farcaster account to see personalized recommendations.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Trending</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Users with high engagement and growing follower counts
            </p>
          </div>

          {farcasterUser && (
            <>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <UserPlus className="w-6 h-6 text-indigo-600" />
                  <h3 className="font-semibold text-gray-900">For You</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Personalized recommendations based on your social connections
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <Users className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Similar</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Users with similar metrics and engagement patterns to you
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}