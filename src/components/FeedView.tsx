import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PostCard } from './PostCard';
import { Sparkles, Users, Compass, Image, PlusCircle, Flame } from 'lucide-react';

export function FeedView() {
  const { posts, currentUser, setIsCreatePostOpen, setActiveTab, setViewingUserId } = useApp();
  const [feedFilter, setFeedFilter] = useState<'for_you' | 'following' | 'communities'>('for_you');

  // Filter posts based on tab
  const filteredPosts = posts.filter((post) => {
    if (feedFilter === 'following') {
      return post.author.isFollowing || post.authorId === currentUser.id;
    }
    if (feedFilter === 'communities') {
      return Boolean(post.communitySlug);
    }
    return true; // 'for_you' shows all non-blocked
  });

  return (
    <div className="max-w-2xl mx-auto py-5 px-3 sm:px-4 space-y-4">
      {/* Top Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setFeedFilter('for_you')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              feedFilter === 'for_you'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>For You</span>
          </button>

          <button
            onClick={() => setFeedFilter('following')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              feedFilter === 'following'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Following</span>
          </button>

          <button
            onClick={() => setFeedFilter('communities')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              feedFilter === 'communities'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Communities</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          {filteredPosts.length} posts
        </span>
      </div>

      {/* Quick Composer Box */}
      <div
        onClick={() => setIsCreatePostOpen(true)}
        className="bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-3.5 flex items-center gap-3 cursor-pointer shadow-lg transition-all group"
      >
        <img
          src={currentUser.avatar}
          alt={currentUser.displayName}
          className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
        />
        <div className="flex-1 bg-slate-950/60 border border-slate-800/60 rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
          Share a photo gallery, architectural shot, or code insight...
        </div>
        <button
          type="button"
          className="p-2 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 transition-colors shrink-0"
        >
          <Image className="w-4 h-4" />
        </button>
      </div>

      {/* Feed Post List */}
      {filteredPosts.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-indigo-600/10 text-indigo-400 mx-auto flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-200">No posts in this feed yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {feedFilter === 'following'
              ? 'You are not following anyone with new posts. Explore creators to fill your timeline!'
              : 'Join interest-based communities or switch to the "For You" feed to see trending posts.'}
          </p>
          <button
            onClick={() => (feedFilter === 'following' ? setActiveTab('explore') : setActiveTab('communities'))}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
          >
            {feedFilter === 'following' ? 'Discover Creators' : 'Browse Communities'}
          </button>
        </div>
      ) : (
        filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}
