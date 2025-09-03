import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp } from 'lucide-react';
import RemixCard from './RemixCard';
import { getCommunityRemixes } from '../services/audioService';
import { Remix } from '../types';

const CommunityHub: React.FC = () => {
  const [remixes, setRemixes] = useState<Remix[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'tips'>('popular');

  useEffect(() => {
    loadRemixes();
  }, []);

  const loadRemixes = async () => {
    try {
      const data = await getCommunityRemixes();
      setRemixes(data);
    } catch (error) {
      console.error('Failed to load remixes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRemixes = remixes
    .filter(remix => 
      remix.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      remix.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'tips':
          return b.communityTips - a.communityTips;
        case 'popular':
        default:
          return b.communityTips - a.communityTips; // Same as tips for now
      }
    });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <TrendingUp className="w-6 h-6 text-accent-500" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Community Hub
          </h2>
        </div>
        <p className="text-white/70 max-w-2xl mx-auto">
          Discover amazing remixes from creators around the world and support your favorites
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Search remixes or creators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-white/70" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="popular" className="bg-gray-800">Most Popular</option>
            <option value="newest" className="bg-gray-800">Newest</option>
            <option value="tips" className="bg-gray-800">Most Tips</option>
          </select>
        </div>
      </div>

      {/* Remixes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card rounded-lg p-6 animate-pulse">
              <div className="space-y-4">
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                <div className="h-3 bg-white/20 rounded w-1/2"></div>
                <div className="h-20 bg-white/20 rounded"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-white/20 rounded w-16"></div>
                  <div className="h-6 bg-white/20 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRemixes.map((remix) => (
            <RemixCard
              key={remix.remixId}
              remix={remix}
              variant="withTipButton"
            />
          ))}
        </div>
      )}

      {!loading && filteredRemixes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/60 text-lg">
            {searchTerm ? 'No remixes found matching your search.' : 'No remixes available yet.'}
          </p>
          <p className="text-white/40 text-sm mt-2">
            Be the first to create and share a remix!
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityHub;