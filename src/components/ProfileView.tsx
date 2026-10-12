import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PostCard } from './PostCard';
import {
  MapPin,
  Link2,
  Calendar,
  Settings,
  MessageSquare,
  UserPlus,
  Check,
  Shield,
  Flag,
  Lock,
  Grid,
  Bookmark,
  Sparkles,
} from 'lucide-react';

export function ProfileView() {
  const {
    viewingUserId,
    currentUser,
    allUsers,
    posts,
    toggleFollow,
    toggleBlock,
    startDirectMessage,
    setIsEditProfileOpen,
    setUserListModal,
    setReportingTarget,
    setActiveLightboxMedia,
  } = useApp();

  const [activeProfileTab, setActiveProfileTab] = useState<'posts' | 'media' | 'saved'>('posts');

  const targetUserId = viewingUserId || currentUser.id;
  const targetUser = allUsers.find((u) => u.id === targetUserId) || currentUser;
  const isSelf = targetUser.id === currentUser.id;

  // Filter posts
  const userPosts = posts.filter((p) => p.authorId === targetUser.id);
  const userMedia = userPosts.flatMap((p) =>
    (p.media || []).map((m) => ({ media: m, post: p }))
  );
  const savedPosts = posts.filter((p) => p.isBookmarked);

  // Followers and following mock lists
  const handleOpenFollowers = () => {
    const followers = allUsers.filter((u) => u.id !== targetUser.id);
    setUserListModal({
      title: `${targetUser.displayName}'s Followers`,
      users: followers,
    });
  };

  const handleOpenFollowing = () => {
    const following = allUsers.filter((u) => u.isFollowing || u.id !== targetUser.id);
    setUserListModal({
      title: `People followed by ${targetUser.displayName}`,
      users: following,
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">
      {/* Cover Banner & Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="h-44 sm:h-64 relative bg-slate-800">
          <img src={targetUser.banner} alt="Profile banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        </div>

        <div className="p-5 sm:p-7 -mt-16 sm:-mt-20 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="relative">
              <img
                src={targetUser.avatar}
                alt={targetUser.displayName}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-slate-900 shadow-2xl bg-slate-900"
              />
              {targetUser.isVerified && (
                <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-slate-900">
                  ✓
                </span>
              )}
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              {isSelf ? (
                <button
                  onClick={() => setIsEditProfileOpen(true)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition-colors shadow-sm"
                >
                  <Settings className="w-4 h-4 text-indigo-400" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => startDirectMessage(targetUser)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                    title="Direct Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleFollow(targetUser.id)}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      targetUser.isFollowing
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/50'
                    }`}
                  >
                    {targetUser.isFollowing ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() =>
                      setReportingTarget({
                        targetType: 'user',
                        targetId: targetUser.id,
                        targetAuthorName: targetUser.displayName,
                        targetContentPreview: targetUser.bio,
                      })
                    }
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                    title="Report or Block User"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* User Bio and Meta Info */}
          <div className="mt-4 space-y-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {targetUser.displayName}
                </h1>
                {targetUser.role === 'admin' && (
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
                    Admin
                  </span>
                )}
                {targetUser.role === 'moderator' && (
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                    Moderator
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">@{targetUser.handle}</p>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl font-normal">
              {targetUser.bio}
            </p>

            <div className="flex items-center gap-4 flex-wrap text-xs text-slate-400">
              {targetUser.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {targetUser.location}
                </span>
              )}
              {targetUser.website && (
                <a
                  href={targetUser.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-indigo-400 hover:underline"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  {targetUser.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              <span className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                Joined {new Date(targetUser.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
              </span>
            </div>

            {/* Social Count Numbers */}
            <div className="flex items-center gap-6 pt-2 border-t border-slate-800/80">
              <button
                onClick={handleOpenFollowing}
                className="text-xs sm:text-sm text-slate-400 hover:text-slate-200 transition-colors"
              >
                <b className="text-slate-100 font-bold mr-1.5">{targetUser.followingCount}</b>
                Following
              </button>

              <button
                onClick={handleOpenFollowers}
                className="text-xs sm:text-sm text-slate-400 hover:text-slate-200 transition-colors"
              >
                <b className="text-slate-100 font-bold mr-1.5">{targetUser.followersCount.toLocaleString()}</b>
                Followers
              </button>

              <span className="text-xs sm:text-sm text-slate-400">
                <b className="text-slate-100 font-bold mr-1.5">{userPosts.length}</b>
                Posts
              </span>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex items-center gap-3 px-5 sm:px-7 border-t border-slate-800/80 bg-slate-950/50">
          <button
            onClick={() => setActiveProfileTab('posts')}
            className={`py-3 px-2 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeProfileTab === 'posts'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Posts ({userPosts.length})
          </button>

          <button
            onClick={() => setActiveProfileTab('media')}
            className={`py-3 px-2 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeProfileTab === 'media'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid className="w-4 h-4" />
            Media Gallery ({userMedia.length})
          </button>

          {isSelf && (
            <button
              onClick={() => setActiveProfileTab('saved')}
              className={`py-3 px-2 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeProfileTab === 'saved'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Saved Bookmarks ({savedPosts.length})
            </button>
          )}
        </div>
      </div>

      {/* Profile Tab Contents */}
      {activeProfileTab === 'posts' && (
        <div className="max-w-2xl mx-auto space-y-4">
          {userPosts.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">No posts published yet.</div>
          ) : (
            userPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      )}

      {activeProfileTab === 'media' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {userMedia.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 text-sm">No photos or media uploaded.</div>
          ) : (
            userMedia.map(({ media, post }, idx) => (
              <div
                key={idx}
                onClick={() => setActiveLightboxMedia({ url: media.url, caption: media.caption || post.content })}
                className="group relative rounded-2xl overflow-hidden aspect-square border border-slate-800 bg-slate-950 cursor-pointer shadow-md"
              >
                <img
                  src={media.url}
                  alt={media.caption || 'Media'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                  <p className="text-xs text-white line-clamp-2">{media.caption || post.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeProfileTab === 'saved' && (
        <div className="max-w-2xl mx-auto space-y-4">
          {savedPosts.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">No saved bookmarks yet. Bookmark posts to review them here!</div>
          ) : (
            savedPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      )}
    </div>
  );
}
