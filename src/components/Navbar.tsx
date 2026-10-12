import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Bell, MessageSquare, Plus, Sparkles, X, Users, Hash, User, Smartphone, Monitor } from 'lucide-react';

export function Navbar() {
  const {
    currentUser,
    searchQuery,
    setSearchQuery,
    allUsers,
    communities,
    posts,
    setViewingUserId,
    setActiveCommunitySlug,
    setActiveTab,
    setIsCreatePostOpen,
    unreadNotificationsCount,
    deviceMode,
    setDeviceMode,
    executeGlobalSearch,
  } = useApp();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter matching entities for search dropdown
  const query = searchQuery.trim().toLowerCase();
  const matchedUsers = query ? allUsers.filter((u) => u.displayName.toLowerCase().includes(query) || u.handle.toLowerCase().includes(query)) : [];
  const matchedCommunities = query ? communities.filter((c) => c.name.toLowerCase().includes(query) || c.slug.toLowerCase().includes(query)) : [];
  const matchedTags = query
    ? Array.from(new Set(posts.flatMap((p) => p.tags))).filter((t) => t.toLowerCase().includes(query.replace(/^#/, '')))
    : [];

  const hasSearchResults = matchedUsers.length > 0 || matchedCommunities.length > 0 || matchedTags.length > 0;

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Mobile Brand Mark */}
      <div className="flex items-center gap-2.5 md:hidden">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="font-extrabold text-base text-slate-100 tracking-tight">
          Connect<span className="text-indigo-400">Sphere</span>
        </span>
      </div>

      {/* Global Instant Search Bar */}
      <div ref={searchRef} className="relative flex-1 max-w-md hidden sm:block">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              executeGlobalSearch(searchQuery);
              setIsSearchOpen(false);
            }
          }}
          className="relative"
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search creators, c/communities, or #tags..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Search Results Dropdown */}
        {isSearchOpen && query && (
          <div className="absolute left-0 top-11 w-full bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 max-h-80 overflow-y-auto space-y-2 animate-in fade-in zoom-in-95">
            {!hasSearchResults ? (
              <div className="py-4 text-center text-xs text-slate-500">No results found for "{searchQuery}"</div>
            ) : (
              <>
                {matchedUsers.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase px-2 py-1 tracking-wider">
                      Creators
                    </div>
                    {matchedUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setViewingUserId(u.id);
                          setActiveTab('profile');
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-1.5 hover:bg-slate-900 rounded-lg text-left"
                      >
                        <img src={u.avatar} alt={u.displayName} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-xs font-medium text-slate-200">{u.displayName}</span>
                        <span className="text-[11px] text-slate-500">@{u.handle}</span>
                      </button>
                    ))}
                  </div>
                )}

                {matchedCommunities.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase px-2 py-1 tracking-wider">
                      Communities
                    </div>
                    {matchedCommunities.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setActiveCommunitySlug(c.slug);
                          setActiveTab('communities');
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-1.5 hover:bg-slate-900 rounded-lg text-left"
                      >
                        <img src={c.icon} alt={c.name} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-xs font-medium text-indigo-300">c/{c.slug}</span>
                        <span className="text-[11px] text-slate-500 truncate">{c.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {matchedTags.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase px-2 py-1 tracking-wider">
                      Hashtags
                    </div>
                    {matchedTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setActiveTab('explore');
                          setIsSearchOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-900 rounded-lg text-left text-xs font-medium text-indigo-400"
                      >
                        <Hash className="w-3.5 h-3.5" />
                        <span>#{tag}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      executeGlobalSearch(searchQuery);
                      setIsSearchOpen(false);
                    }}
                    className="w-full py-2 px-3 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white rounded-xl text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>View all search results for "{searchQuery}"</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Device Mode Switcher for Quick Access */}
        <button
          onClick={() => setDeviceMode(deviceMode === 'desktop' ? 'mobile_simulator' : 'desktop')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-xs font-medium text-slate-300 transition-colors"
          title="Toggle Mobile Simulator / Responsive Web"
        >
          {deviceMode === 'desktop' ? (
            <>
              <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Mobile Preview</span>
            </>
          ) : (
            <>
              <Monitor className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Desktop View</span>
            </>
          )}
        </button>

        {/* Quick New Post */}
        <button
          onClick={() => setIsCreatePostOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-md shadow-indigo-950/40"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Post</span>
        </button>

        {/* Current user avatar button */}
        <button
          onClick={() => {
            setViewingUserId(currentUser.id);
            setActiveTab('profile');
          }}
          className="relative group p-0.5 rounded-full ring-2 ring-slate-800 hover:ring-indigo-500 transition-colors"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.displayName}
            className="w-8 h-8 rounded-full object-cover"
          />
        </button>
      </div>
    </header>
  );
}
