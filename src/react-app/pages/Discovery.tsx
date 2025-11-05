import { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';
import { useFarcasterUser } from '@/react-app/hooks/useFarcasterUser';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import ErrorMessage from '@/react-app/components/ErrorMessage';
import type { NeynarUserData } from '@/shared/types';

interface DiscoveryUser extends NeynarUserData {
  followed_by_user: boolean;
}

export default function Discovery() {
  const { user: farcasterUser } = useFarcasterUser();
  const [discoveryData, setDiscoveryData] = useState<DiscoveryUser[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiscoveryData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Construct the endpoint with the user's FID if available
        const endpoint = farcasterUser?.fid ? `/api/discover-users?fid=${farcasterUser.fid}` : '/api/discover-users';
        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.success) {
          setDiscoveryData(data.data);
        } else {
          setError(data.error || 'Failed to fetch discovery data.');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscoveryData();
  }, [farcasterUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Compass className="mx-auto text-purple-600 mb-2" size={32} />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Discover People
          </h1>
          <p className="text-gray-600">Find interesting people in the Farcaster ecosystem</p>
        </div>

        {isLoading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}

        {discoveryData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {discoveryData.map((user) => (
              <div key={user.fid} className="bg-white/70 backdrop-blur-sm p-5 rounded-xl shadow-md border border-gray-200 flex flex-col items-center text-center">
                <img src={user.pfpUrl} alt={user.username} className="w-24 h-24 rounded-full mb-4 border-4 border-purple-200" />
                <h3 className="font-bold text-lg text-gray-800">{user.displayName}</h3>
                <p className="text-gray-500">@{user.username}</p>
                <div className="mt-4 text-sm text-gray-700">
                  <span className="font-semibold">{user.followerCount}</span> Followers
                </div>
                {user.followed_by_user && (
                  <div className="mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Following you
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
