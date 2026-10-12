import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Users,
  MessageSquare,
  Sparkles,
  Flame,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface GlobalSearchBarProps {
  className?: string;
  autoFocus?: boolean;
}

export function GlobalSearchBar({ className = '', autoFocus = false }: GlobalSearchBarProps) {
  const {
    searchQuery,
    setSearchQuery,
    searchFilter,
    setSearchFilter,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    executeGlobalSearch,
    activeTab,
    setActiveTab,
  } = useApp();

  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    executeGlobalSearch(searchQuery.trim());
    setIsFocused(false);
  };

  const handleSelectRecent = (q: string) => {
    executeGlobalSearch(q);
    setIsFocused(false);
  };

  const handleClear = () => {
    setSearchQuery('');
    if (activeTab === 'search') {
      setActiveTab('feed');
    }
  };

  const TRENDING_SUGGESTIONS = [
    { text: 'Architecture', type: 'tag' },
    { text: 'Redis Streams', type: 'post' },
    { text: 'c/techpulse', type: 'community' },
    { text: 'Sarah Jenkins', type: 'user' },
    { text: 'ShaderMagic', type: 'tag' },
    { text: 'c/designcraft', type: 'community' },
  ];

  return (
    <div ref={containerRef} className={`relative w-full z-20 ${className}`}>
      {/* Top Search Bar Input Box */}
      <form
        onSubmit={handleSearchSubmit}
        className={`flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-slate-900/90 border transition-all duration-200 shadow-lg ${
          isFocused
            ? 'border-indigo-500/80 ring-2 ring-indigo-500/20 bg-slate-900'
            : 'border-slate-800/90 hover:border-slate-700/80'
        }`}
      >
        <div className="pl-2.5 text-slate-400 flex items-center justify-center shrink-0">
          <Search className="w-4 h-4 text-indigo-400" />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (activeTab !== 'search' && e.target.value.trim().length > 0) {
              // Automatically switch to search tab when user starts typing in top content bar
              setActiveTab('search');
            }
          }}
          onFocus={() => setIsFocused(true)}
          placeholder="Search creators, posts, discussions, or c/communities..."
          autoFocus={autoFocus}
          className="flex-1 bg-transparent px-2 py-1 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
        />

        {/* Clear Button */}
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Search Submit Button */}
        <button
          type="submit"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-950/40 transition-colors shrink-0"
        >
          <span>Search</span>
          <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
        </button>
      </form>

      {/* Autocomplete & Recents Popover */}
      {isFocused && (
        <div className="absolute left-0 right-0 top-14 bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 backdrop-blur-md animate-in fade-in zoom-in-95 space-y-3">
          {/* Quick Filter Selectors */}
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-800/80 text-xs">
            <span className="text-slate-500 flex items-center gap-1 text-[11px] font-semibold uppercase px-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {(['all', 'users', 'posts', 'communities'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setSearchFilter(f);
                }}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-colors ${
                  searchFilter === f
                    ? 'bg-indigo-600 text-white text-xs font-semibold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 text-xs'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-1.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" /> Recent Searches
                </span>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    clearRecentSearches();
                  }}
                  className="text-slate-500 hover:text-rose-400 normal-case font-normal text-[11px]"
                >
                  Clear all
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectRecent(item);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/80 hover:bg-slate-850 hover:border-slate-700 text-slate-300 rounded-xl text-xs border border-slate-800 transition-colors"
                  >
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending & Quick Topics */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 mb-1.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-indigo-400" /> Suggested Topics
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TRENDING_SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectRecent(item.text);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span>{item.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
