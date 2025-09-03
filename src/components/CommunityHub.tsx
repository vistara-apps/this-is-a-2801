import React, { useState } from 'react';
import { Search, Filter, Users, TrendingUp, Clock, DollarSign, Loader } from 'lucide-react';
import RemixCard from './RemixCard';
import { useCommunity } from '../hooks/useCommunity';
import LoadingIndicator from './LoadingIndicator';

const CommunityHub: React.FC = () => {
  const {
    remixes,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    loadRemixes,
    updateRemix,
  } = useCommunity();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleTipSuccess = (remixId: string) => {
    // Find the remix and update its tip count
    const remix = remixes.find(r => r.remixId === remixId);
    if (remix) {
      const updatedRemix = {
        ...remix,
        communityTips: remix.communityTips + 1,
      };
      updateRemix(updatedRemix);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Community Hub
        </h2>
        <p className="text-white/70 max-w-2xl mx-auto">
          Discover and share remixes with the Beat Weaver community
        </p>
      </div>

      <div className="glass-card rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="text"
              placeholder="Search remixes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            
            <button
              onClick={() => loadRemixes()}
              className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              title="Refresh"
            >
              <Loader className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {isFilterOpen && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setSortBy('popular')}
                className={`flex items-center space-x-2 p-3 rounded-lg transition-colors duration-200 ${
                  sortBy === 'popular'
                    ? 'bg-primary-500/20 border border-primary-500/50'
                    : 'bg-white/10 border border-white/10 hover:bg-white/15'
                }`}
              >
                <TrendingUp className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Popular</span>
              </button>
              
              <button
                onClick={() => setSortBy('newest')}
                className={`flex items-center space-x-2 p-3 rounded-lg transition-colors duration-200 ${
                  sortBy === 'newest'
                    ? 'bg-primary-500/20 border border-primary-500/50'
                    : 'bg-white/10 border border-white/10 hover:bg-white/15'
                }`}
              >
                <Clock className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Newest</span>
              </button>
              
              <button
                onClick={() => setSortBy('tips')}
                className={`flex items-center space-x-2 p-3 rounded-lg transition-colors duration-200 ${
                  sortBy === 'tips'
                    ? 'bg-primary-500/20 border border-primary-500/50'
                    : 'bg-white/10 border border-white/10 hover:bg-white/15'
                }`}
              >
                <DollarSign className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Most Tips</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <LoadingIndicator message="Loading remixes..." />
      ) : error ? (
        <div className="text-center text-red-500 py-8">
          {error}
        </div>
      ) : remixes.length === 0 ? (
        <div className="glass-card rounded-lg p-8 text-center">
          <Users className="w-12 h-12 text-white/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white">No remixes found</h3>
          <p className="text-white/70 mt-2">
            {searchTerm
              ? `No remixes match "${searchTerm}"`
              : 'Be the first to share a remix!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {remixes.map(remix => (
            <RemixCard
              key={remix.remixId}
              remix={remix}
              onTipSuccess={() => handleTipSuccess(remix.remixId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityHub;

