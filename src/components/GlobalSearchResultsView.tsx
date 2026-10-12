import React from 'react';
import { useApp } from '../context/AppContext';
import { PostCard } from './PostCard';
import {
  Search,
  Users,
  MessageSquare,
  Sparkles,
  Flame,
  UserPlus,
  Check,
  ArrowRight,
  Hash,
  X,
  Compass,
} from 'lucide-react';

export function GlobalSearchResultsView() {
  const {
    searchQuery,
    setSearchQuery,
    searchFilter,
    setSearchFilter,
    allUsers,
    currentUser,
    posts,
    communities,
    toggleFollow,
    toggleJoinCommunity,
    setActiveCommunitySlug,
    startDirectMessage,
    setViewingUserId,
    setActiveTab,
    executeGlobalSearch,
  } = useApp();

  const query = searchQuery.trim().toLowerCase();
  const rawQuery = searchQuery.trim();

  // Search Matchers
  const matchedUsers = query
    ? allUsers.filter(
        (u) =>
          u.displayName.toLowerCase().includes(query) ||
          u.handle.toLowerCase().includes(query) ||
          u.bio.toLowerCase().includes(query) ||
          (u.location && u.location.toLowerCase().includes(query))
      )
    : [];

  const matchedCommunities = query
    ? communities.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.slug.toLowerCase().includes(query) ||
          c.tagline.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.category.toLowerCase().includes(query)
      )
    : [];

  const matchedPosts = query
    ? posts.filter((p) => {
        const textMatch = p.content.toLowerCase().includes(query);
        const authorMatch =
          p.author.displayName.toLowerCase().includes(query) ||
          p.author.handle.toLowerCase().includes(query);
        const tagMatch = (p.tags || []).some((t) => t.toLowerCase().includes(query.replace(/^#/, '')));
        const commMatch = p.communitySlug?.toLowerCase().includes(query) || p.communityName?.toLowerCase().includes(query);
        return textMatch || authorMatch || tagMatch || commMatch;
      })
    : [];

  const totalResultsCount = matchedUsers.length + matchedCommunities.length + matchedPosts.length;

  const FILTER_TABS: { id: 'all' | 'users' | 'posts' | 'communities'; label: string; count: number }[] = [
    { id: 'all', label: 'All Results', count: totalResultsCount },
    { id: 'users', label: 'Creators', count: matchedUsers.length },
    { id: 'posts', label: 'Posts & Discussions', count: matchedPosts.length },
    { id: 'communities', label: 'Communities', count: matchedCommunities.length },
  ];

  const POPULAR_TOPICS = ['Architecture', 'Berlin', 'TypeScript', 'ShaderMagic', 'ModularSynth', 'WebSockets'];

  return (
    <div className="max-w-4xl mx-auto py-5 px-3 sm:px-6 space-y-6">
      {/* Search Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Search className="w-3.5 h-3.5" />
            <span>Global Search Engine</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {rawQuery ? (
              <>
                Results for <span className="text-indigo-400">"{rawQuery}"</span>
              </>
            ) : (
              'Search ConnectSphere'
            )}
          </h1>

          <p className="text-xs text-slate-400 mt-1">
            {rawQuery
              ? `Found ${totalResultsCount} matching results across creators, posts, and community hubs.`
              : 'Enter keywords above to find creators, discussions, or topics.'}
          </p>
        </div>

        {rawQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveTab('feed');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold self-start sm:self-auto transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear Search</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto scrollbar-none">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSearchFilter(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              searchFilter === tab.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                searchFilter === tab.id ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Zero Query State */}
      {!query && (
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-10 text-center space-y-4">
          <Compass className="w-12 h-12 text-indigo-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">Start discovering with search</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Search for people by name or handle, explore topics with hashtags, or find community hubs for your favorite interests.
          </p>

          <div className="pt-2">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">
              Popular Queries to Try:
            </span>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {POPULAR_TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => executeGlobalSearch(topic)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 text-xs font-semibold text-slate-300 transition-colors"
                >
                  #{topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* No Results Found */}
      {query && totalResultsCount === 0 && (
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-10 text-center space-y-3">
          <Search className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No results found for "{rawQuery}"</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            We couldn't find any creators, posts, or communities matching this query. Try checking for typos or searching a broader topic.
          </p>
          <div className="flex justify-center gap-2 pt-2">
            {POPULAR_TOPICS.slice(0, 4).map((topic) => (
              <button
                key={topic}
                onClick={() => executeGlobalSearch(topic)}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 rounded-lg"
              >
                #{topic}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results Display */}

      {/* 1. All Results View: Sectioned Breakdown */}
      {query && searchFilter === 'all' && totalResultsCount > 0 && (
        <div className="space-y-8">
          {/* Matching Creators Section */}
          {matchedUsers.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>Matching Creators ({matchedUsers.length})</span>
                </h3>
                {matchedUsers.length > 2 && (
                  <button
                    onClick={() => setSearchFilter('users')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    View all creators
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {matchedUsers.slice(0, 4).map((user) => {
                  const isSelf = user.id === currentUser.id;

                  return (
                    <div
                      key={user.id}
                      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md"
                    >
                      <button
                        onClick={() => {
                          setViewingUserId(user.id);
                          setActiveTab('profile');
                        }}
                        className="flex items-center gap-3 min-w-0 text-left group"
                      >
                        <img
                          src={user.avatar}
                          alt={user.displayName}
                          className="w-12 h-12 rounded-full object-cover border border-slate-700 shrink-0 group-hover:border-indigo-500 transition-colors"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-slate-100 group-hover:text-indigo-400 transition-colors truncate flex items-center gap-1">
                            <span>{user.displayName}</span>
                            {user.isVerified && <span className="text-indigo-400 text-xs font-bold">✓</span>}
                          </div>
                          <div className="text-xs text-slate-400 truncate">@{user.handle}</div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">{user.bio}</div>
                        </div>
                      </button>

                      {!isSelf && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => startDirectMessage(user)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                            title="Direct Message"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => toggleFollow(user.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                              user.isFollowing
                                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950/40'
                            }`}
                          >
                            {user.isFollowing ? 'Following' : 'Follow'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matching Communities Section */}
          {matchedCommunities.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Flame className="w-4 h-4 text-indigo-400" />
                  <span>Matching Communities ({matchedCommunities.length})</span>
                </h3>
                {matchedCommunities.length > 2 && (
                  <button
                    onClick={() => setSearchFilter('communities')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    View all communities
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {matchedCommunities.slice(0, 4).map((comm) => (
                  <div
                    key={comm.id}
                    className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md"
                  >
                    <button
                      onClick={() => {
                        setActiveCommunitySlug(comm.slug);
                        setActiveTab('communities');
                      }}
                      className="flex items-center gap-3 min-w-0 text-left group"
                    >
                      <img
                        src={comm.icon}
                        alt={comm.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-slate-100 group-hover:text-indigo-400 transition-colors truncate">
                          c/{comm.slug}
                        </div>
                        <div className="text-xs text-slate-400 truncate">{comm.name}</div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {comm.membersCount.toLocaleString()} members • {comm.category}
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => toggleJoinCommunity(comm.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                        comm.isMember
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950/40'
                      }`}
                    >
                      {comm.isMember ? 'Joined' : 'Join'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matching Posts Section */}
          {matchedPosts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>Matching Posts & Discussions ({matchedPosts.length})</span>
                </h3>
              </div>

              <div className="space-y-4">
                {matchedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Creators Only Filter */}
      {query && searchFilter === 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {matchedUsers.map((user) => {
            const isSelf = user.id === currentUser.id;

            return (
              <div
                key={user.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md"
              >
                <button
                  onClick={() => {
                    setViewingUserId(user.id);
                    setActiveTab('profile');
                  }}
                  className="flex items-center gap-3 min-w-0 text-left group"
                >
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-12 h-12 rounded-full object-cover border border-slate-700 shrink-0 group-hover:border-indigo-500 transition-colors"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-slate-100 group-hover:text-indigo-400 transition-colors truncate flex items-center gap-1">
                      <span>{user.displayName}</span>
                      {user.isVerified && <span className="text-indigo-400 text-xs font-bold">✓</span>}
                    </div>
                    <div className="text-xs text-slate-400 truncate">@{user.handle}</div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">{user.bio}</div>
                  </div>
                </button>

                {!isSelf && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => startDirectMessage(user)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Direct Message"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => toggleFollow(user.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        user.isFollowing
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950/40'
                      }`}
                    >
                      {user.isFollowing ? 'Following' : 'Follow'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Communities Only Filter */}
      {query && searchFilter === 'communities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {matchedCommunities.map((comm) => (
            <div
              key={comm.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md"
            >
              <button
                onClick={() => {
                  setActiveCommunitySlug(comm.slug);
                  setActiveTab('communities');
                }}
                className="flex items-center gap-3 min-w-0 text-left group"
              >
                <img
                  src={comm.icon}
                  alt={comm.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-bold text-sm text-slate-100 group-hover:text-indigo-400 transition-colors truncate">
                    c/{comm.slug}
                  </div>
                  <div className="text-xs text-slate-400 truncate">{comm.name}</div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {comm.membersCount.toLocaleString()} members • {comm.category}
                  </div>
                </div>
              </button>

              <button
                onClick={() => toggleJoinCommunity(comm.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  comm.isMember
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950/40'
                }`}
              >
                {comm.isMember ? 'Joined' : 'Join'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 4. Posts Only Filter */}
      {query && searchFilter === 'posts' && (
        <div className="space-y-4">
          {matchedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
