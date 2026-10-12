import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Compass, Hash, Heart, MessageSquare, Sparkles, Image, Flame, Layers } from 'lucide-react';
import { PostCard } from './PostCard';

export function ExploreView() {
  const { posts, setActiveLightboxMedia, setActiveTab, setViewingUserId } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const CATEGORIES = ['All', 'Photography', 'Engineering', 'GameDev', 'Design', 'Music', 'Architecture'];

  // Flatten media items with their parent post
  const mediaItems = posts.flatMap((post) =>
    (post.media || []).map((m) => ({
      media: m,
      post,
    }))
  );

  const filteredMedia = mediaItems.filter(({ post }) => {
    if (selectedCategory === 'All') return true;
    const cat = selectedCategory.toLowerCase();
    const hasTag = (post.tags || []).some((t) => t.toLowerCase().includes(cat));
    const inComm = post.communitySlug?.toLowerCase().includes(cat);
    return hasTag || inComm;
  });

  return (
    <div className="max-w-4xl mx-auto py-5 px-3 sm:px-6 space-y-6">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden p-6 bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 border border-indigo-500/30 shadow-xl">
        <div className="relative z-10 max-w-lg space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Discovery</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Explore Visual Works & Conversations
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Discover breathtaking photography, game dev compute shaders, modular synth experiments, and distributed system architectures.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50 scale-105'
                : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Instagram-Style Explore Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-semibold uppercase tracking-wider">
          <span>Trending Gallery ({filteredMedia.length} visual items)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {filteredMedia.map(({ media, post }, idx) => {
            const isTall = idx % 5 === 0;

            return (
              <div
                key={media.id}
                onClick={() => setActiveLightboxMedia({ url: media.url, caption: media.caption || post.content })}
                className={`group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer aspect-square ${
                  isTall ? 'sm:row-span-2 sm:aspect-auto' : ''
                }`}
              >
                <img
                  src={media.url}
                  alt={media.caption || 'Explore post'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Hover Overlay with Stats and Author */}
                <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={post.author.avatar}
                        alt={post.author.displayName}
                        className="w-6 h-6 rounded-full object-cover border border-slate-600"
                      />
                      <span className="font-semibold truncate max-w-[90px]">{post.author.displayName}</span>
                    </div>
                    {post.communitySlug && (
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">
                        c/{post.communitySlug}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-slate-200 line-clamp-2 italic font-normal">
                      "{post.content}"
                    </p>
                    <div className="flex items-center gap-4 text-xs font-semibold text-white pt-1">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
                        {Object.values(post.reactions).reduce((a, b) => a + b, 0)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                        {post.commentsCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
