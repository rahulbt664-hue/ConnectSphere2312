import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CommunityDetail } from './CommunityDetail';
import { Users, Plus, Search, Sparkles, Check, ArrowRight } from 'lucide-react';

export function CommunitiesView() {
  const {
    communities,
    activeCommunitySlug,
    setActiveCommunitySlug,
    toggleJoinCommunity,
    setIsCreateCommunityOpen,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  if (activeCommunitySlug) {
    return <CommunityDetail slug={activeCommunitySlug} />;
  }

  const CATEGORIES = ['All', 'Design & Creative', 'Engineering & Code', 'Gaming', 'Photography', 'Music & Audio'];

  const filtered = communities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase()) ||
      c.tagline.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'All' || c.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-4xl mx-auto py-5 px-3 sm:px-6 space-y-6">
      {/* Header and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            <span>Interest Communities</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Join hubs of creators, developers, designers, and audio architects.
          </p>
        </div>

        <button
          onClick={() => setIsCreateCommunityOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold transition-colors shadow-lg shadow-indigo-950/40 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Community</span>
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedCat === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter communities..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Communities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((comm) => (
          <div
            key={comm.id}
            className="bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col justify-between group"
          >
            {/* Banner preview */}
            <div className="h-24 relative bg-slate-800">
              <img src={comm.banner} alt={comm.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-sm text-[10px] font-semibold text-slate-300 border border-slate-700">
                {comm.category}
              </span>
            </div>

            <div className="p-4 -mt-8 relative z-10 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-end gap-3 mb-2">
                  <img
                    src={comm.icon}
                    alt={comm.name}
                    className="w-14 h-14 rounded-xl object-cover border-2 border-slate-900 shadow-xl bg-slate-900 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-100 text-base group-hover:text-indigo-400 transition-colors truncate">
                      {comm.name}
                    </h3>
                    <span className="text-xs text-indigo-400 font-semibold">c/{comm.slug}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {comm.tagline || comm.description}
                </p>

                <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>{comm.membersCount.toLocaleString()} members</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
                <button
                  onClick={() => toggleJoinCommunity(comm.id)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                    comm.isMember
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950/40'
                  }`}
                >
                  {comm.isMember ? 'Joined' : 'Join'}
                </button>

                <button
                  onClick={() => setActiveCommunitySlug(comm.slug)}
                  className="py-2 px-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
