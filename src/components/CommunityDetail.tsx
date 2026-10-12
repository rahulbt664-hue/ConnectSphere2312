import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PostCard } from './PostCard';
import {
  ArrowLeft,
  Users,
  Shield,
  MessageSquare,
  Sparkles,
  PlusCircle,
  Hash,
  Send,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { Message } from '../types';

interface CommunityDetailProps {
  slug: string;
}

export function CommunityDetail({ slug }: CommunityDetailProps) {
  const {
    communities,
    posts,
    toggleJoinCommunity,
    setActiveCommunitySlug,
    currentUser,
    setIsCreatePostOpen,
    sendMessage,
    getMessages,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'posts' | 'live_chat' | 'rules'>('posts');
  const [chatInput, setChatInput] = useState('');

  const community = communities.find((c) => c.slug.toLowerCase() === slug.toLowerCase());

  if (!community) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <h3 className="text-lg font-bold text-slate-200">Community not found</h3>
        <button
          onClick={() => setActiveCommunitySlug(null)}
          className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-semibold text-white"
        >
          Return to directory
        </button>
      </div>
    );
  }

  const communityPosts = posts.filter(
    (p) => p.communitySlug?.toLowerCase() === slug.toLowerCase() || p.communityId === community.id
  );

  // Community live chat channel ID
  const channelConvId = `conv_channel_${community.slug}`;
  const channelMessages = getMessages(channelConvId);

  const handleSendLiveMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendMessage(channelConvId, chatInput.trim());
    setChatInput('');
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-5">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 pt-4 px-3 sm:px-0">
        <button
          onClick={() => setActiveCommunitySlug(null)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Communities</span>
        </button>
      </div>

      {/* Community Banner & Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="h-44 sm:h-56 relative bg-slate-800">
          <img src={community.banner} alt={community.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="p-5 sm:p-6 -mt-14 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <img
                src={community.icon}
                alt={community.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-slate-900 shadow-2xl bg-slate-900 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                    {community.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                    c/{community.slug}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 line-clamp-1">{community.tagline}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <b className="text-slate-200">{community.membersCount.toLocaleString()}</b> members
                  </span>
                  <span>•</span>
                  <span>{community.category}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => toggleJoinCommunity(community.id)}
                className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  community.isMember
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/50'
                }`}
              >
                {community.isMember ? 'Joined (Member)' : 'Join Community'}
              </button>

              <button
                onClick={() => setIsCreatePostOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-indigo-400" />
                <span>Post Here</span>
              </button>
            </div>
          </div>

          <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
            {community.description}
          </p>
        </div>

        {/* Community Nav Subtabs */}
        <div className="flex items-center gap-2 px-5 sm:px-6 border-t border-slate-800/80 bg-slate-950/50">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'posts'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Posts & Discussions ({communityPosts.length})
          </button>

          <button
            onClick={() => setActiveTab('live_chat')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'live_chat'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Live Chat Room</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'rules'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Rules & Safety
          </button>
        </div>
      </div>

      {/* Tab 1: Posts */}
      {activeTab === 'posts' && (
        <div className="space-y-4 max-w-2xl mx-auto">
          {communityPosts.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <h3 className="text-base font-semibold text-slate-200">No posts in c/{community.slug} yet</h3>
              <p className="text-xs text-slate-400">
                Be the first to share a case study, devlog, or question in this community!
              </p>
              <button
                onClick={() => setIsCreatePostOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
              >
                Create Community Post
              </button>
            </div>
          ) : (
            communityPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      )}

      {/* Tab 2: Discord-style Live Chat Channel */}
      {activeTab === 'live_chat' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl h-[550px] flex flex-col">
          <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-sm text-slate-200">#{community.slug}-lounge</span>
              <span className="text-xs text-slate-500 hidden sm:inline">• Live discussion channel</span>
            </div>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Realtime Sync Active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {channelMessages.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-xs">
                Welcome to #{community.slug}-lounge! Send a message to start the room.
              </div>
            ) : (
              channelMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3 group">
                  <img
                    src={msg.sender.avatar}
                    alt={msg.sender.displayName}
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200">{msg.sender.displayName}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-0.5">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendLiveMessage} className="p-3 bg-slate-950/90 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`Message #${community.slug}-lounge as ${currentUser.displayName}...`}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Rules & Guidelines */}
      {activeTab === 'rules' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-400">
            <Shield className="w-5 h-5" />
            <h3 className="font-semibold text-slate-100 text-base">Community Standards & Rules</h3>
          </div>
          <p className="text-xs text-slate-400">
            All members must abide by these rules. Violations will be reviewed by community moderators.
          </p>

          <div className="space-y-3 pt-2">
            {community.rules.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
