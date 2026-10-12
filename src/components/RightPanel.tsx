import React from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, Users, Sparkles, UserPlus, Check, ExternalLink, ShieldCheck, Hash } from 'lucide-react';

export function RightPanel() {
  const {
    allUsers,
    currentUser,
    toggleFollow,
    communities,
    toggleJoinCommunity,
    setActiveCommunitySlug,
    setActiveTab,
    setViewingUserId,
    posts,
  } = useApp();

  // Users to suggest (excluding current user)
  const suggestedUsers = allUsers.filter((u) => u.id !== currentUser.id).slice(0, 3);

  // Trending communities
  const suggestedCommunities = communities.slice(0, 3);

  // Extract top tags
  const tagCounts: Record<string, number> = {};
  posts.forEach((p) => {
    (p.tags || []).forEach((t) => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([t]) => t);

  return (
    <aside className="w-80 shrink-0 hidden lg:flex flex-col gap-5 p-4 border-l border-slate-800/80 bg-slate-950/40 overflow-y-auto">
      {/* Platform Vision Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-violet-950/30 border border-indigo-500/20 shadow-lg">
        <div className="flex items-center gap-2 text-indigo-400 mb-1.5 font-semibold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>ConnectSphere Core</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Instagram feeds + Reddit communities + Discord live chat in a unified TypeScript architecture.
        </p>
      </div>

      {/* Suggested Creators */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-indigo-400" />
            <span>Creators to Follow</span>
          </h3>
        </div>

        <div className="space-y-3">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-2.5">
              <button
                onClick={() => {
                  setViewingUserId(user.id);
                  setActiveTab('profile');
                }}
                className="flex items-center gap-2.5 min-w-0 text-left group"
              >
                <img
                  src={user.avatar}
                  alt={user.displayName}
                  className="w-9 h-9 rounded-full object-cover border border-slate-700/80 group-hover:border-indigo-500 transition-colors shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors truncate">
                    {user.displayName}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">@{user.handle}</div>
                </div>
              </button>

              <button
                onClick={() => toggleFollow(user.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  user.isFollowing
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950/40'
                }`}
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Communities */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Popular Communities</span>
          </h3>
          <button
            onClick={() => setActiveTab('communities')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            View all
          </button>
        </div>

        <div className="space-y-3">
          {suggestedCommunities.map((comm) => (
            <div key={comm.id} className="flex items-center justify-between gap-2.5">
              <button
                onClick={() => {
                  setActiveCommunitySlug(comm.slug);
                  setActiveTab('communities');
                }}
                className="flex items-center gap-2.5 min-w-0 text-left group"
              >
                <img
                  src={comm.icon}
                  alt={comm.name}
                  className="w-9 h-9 rounded-xl object-cover border border-slate-700/80 shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors truncate">
                    c/{comm.slug}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {comm.membersCount.toLocaleString()} members
                  </div>
                </div>
              </button>

              <button
                onClick={() => toggleJoinCommunity(comm.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                  comm.isMember
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    : 'bg-indigo-600/90 hover:bg-indigo-600 text-white'
                }`}
              >
                {comm.isMember ? 'Joined' : 'Join'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>Trending Topics</span>
          </h3>
        </div>

        <div className="space-y-2">
          {sortedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTab('explore')}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/50 text-left transition-colors group"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 group-hover:text-indigo-400">
                <Hash className="w-3.5 h-3.5 text-slate-500" />
                <span>#{tag}</span>
              </div>
              <span className="text-[11px] text-slate-500">Trending</span>
            </button>
          ))}
        </div>
      </div>

      {/* Safety & Compliance Badge */}
      <div className="px-2 text-[11px] text-slate-500 flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>ConnectSphere Safety Protocol • Real-time moderation active</span>
      </div>
    </aside>
  );
}
