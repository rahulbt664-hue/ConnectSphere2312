import React, { useState } from 'react';
import { Post, ReactionType } from '../types';
import { useApp } from '../context/AppContext';
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  Flame,
  Lightbulb,
  Rocket,
  Laugh,
  MoreHorizontal,
  Trash2,
  Flag,
  Check,
  ChevronLeft,
  ChevronRight,
  Send,
  CornerDownRight,
  ThumbsUp,
  Sparkles,
} from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const {
    currentUser,
    reactToPost,
    toggleBookmark,
    deletePost,
    setReportingTarget,
    setActiveLightboxMedia,
    setViewingUserId,
    setActiveCommunitySlug,
    setActiveTab,
    showToast,
    getComments,
    addComment,
    toggleCommentLike,
  } = useApp();

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const isAuthor = post.authorId === currentUser.id;
  const comments = getComments(post.id);

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const REACTION_CONFIG: {
    type: ReactionType;
    icon: React.ReactNode;
    label: string;
    color: string;
  }[] = [
    { type: 'heart', icon: <Heart className="w-4 h-4 fill-current text-rose-500" />, label: 'Love', color: 'text-rose-400' },
    { type: 'fire', icon: <Flame className="w-4 h-4 fill-current text-amber-500" />, label: 'Fire', color: 'text-amber-400' },
    { type: 'insightful', icon: <Lightbulb className="w-4 h-4 fill-current text-yellow-400" />, label: 'Insightful', color: 'text-yellow-400' },
    { type: 'rocket', icon: <Rocket className="w-4 h-4 fill-current text-indigo-400" />, label: 'Rocket', color: 'text-indigo-400' },
    { type: 'laugh', icon: <Laugh className="w-4 h-4 text-emerald-400" />, label: 'Funny', color: 'text-emerald-400' },
    { type: 'like', icon: <ThumbsUp className="w-4 h-4 text-blue-400" />, label: 'Like', color: 'text-blue-400' },
  ];

  const totalReactions = Object.values(post.reactions).reduce((a, b) => a + b, 0);

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    showToast('Post link copied to clipboard!', 'info');
  };

  const handleAddCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addComment(post.id, newCommentText.trim());
    setNewCommentText('');
    setShowComments(true);
  };

  const handleReplySubmit = (parentId: string) => {
    if (!replyText.trim()) return;
    addComment(post.id, replyText.trim(), parentId);
    setReplyText('');
    setReplyingToId(null);
  };

  return (
    <article className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl transition-all duration-200 hover:border-slate-700/80 mb-4">
      {/* Post Header */}
      <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => {
              setViewingUserId(post.author.id);
              setActiveTab('profile');
            }}
            className="shrink-0 relative group"
          >
            <img
              src={post.author.avatar}
              alt={post.author.displayName}
              className="w-11 h-11 rounded-full object-cover border-2 border-slate-800 group-hover:border-indigo-500 transition-colors"
            />
            {post.author.isVerified && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] ring-2 ring-slate-900 font-bold">
                ✓
              </span>
            )}
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => {
                  setViewingUserId(post.author.id);
                  setActiveTab('profile');
                }}
                className="font-semibold text-slate-100 hover:text-indigo-400 transition-colors text-sm sm:text-base truncate"
              >
                {post.author.displayName}
              </button>
              <span className="text-xs text-slate-400">@{post.author.handle}</span>
              <span className="text-slate-600 text-xs">•</span>
              <span className="text-xs text-slate-400">{formatTime(post.createdAt)}</span>
            </div>

            {/* Community attribution if post belongs to a community */}
            {post.communitySlug && (
              <div className="mt-0.5 flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setActiveCommunitySlug(post.communitySlug || null);
                    setActiveTab('communities');
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-xs font-medium transition-colors"
                >
                  {post.communityIcon && (
                    <img src={post.communityIcon} alt="c" className="w-3 h-3 rounded-full object-cover" />
                  )}
                  <span>c/{post.communitySlug}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Post Options Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-10 w-48 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-1 z-30 animate-in fade-in zoom-in-95"
              onClick={() => setShowMenu(false)}
            >
              <button
                onClick={() => toggleBookmark(post.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800/80 hover:text-white rounded-lg transition-colors"
              >
                <Bookmark className="w-4 h-4 text-indigo-400" />
                {post.isBookmarked ? 'Remove Bookmark' : 'Bookmark Post'}
              </button>

              <button
                onClick={handleShare}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800/80 hover:text-white rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4 text-slate-400" />
                Copy Link
              </button>

              {!isAuthor && (
                <button
                  onClick={() =>
                    setReportingTarget({
                      targetType: 'post',
                      targetId: post.id,
                      targetAuthorName: post.author.displayName,
                      targetContentPreview: post.content,
                    })
                  }
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <Flag className="w-4 h-4" />
                  Report Post
                </button>
              )}

              {isAuthor && (
                <button
                  onClick={() => deletePost(post.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Text Body */}
      <div className="px-4 sm:px-5 pb-3">
        <p className="text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
          {post.content}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Media Gallery with Carousel / Lightbox */}
      {post.media && post.media.length > 0 && (
        <div className="relative bg-slate-950/60 border-y border-slate-800/80 overflow-hidden">
          <div
            className="cursor-zoom-in relative group max-h-[520px] flex items-center justify-center bg-black/40"
            onClick={() => setActiveLightboxMedia({ url: post.media[activeMediaIndex].url, caption: post.media[activeMediaIndex].caption })}
          >
            <img
              src={post.media[activeMediaIndex].url}
              alt="Post media"
              className="w-full max-h-[520px] object-cover sm:object-contain transition-transform duration-300 group-hover:scale-[1.01]"
            />

            {/* Subtle overlay hint */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="px-3 py-1.5 bg-slate-950/80 backdrop-blur-sm rounded-lg text-xs font-medium text-white border border-slate-700">
                Click to expand
              </span>
            </div>
          </div>

          {/* Multiple images controls */}
          {post.media.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : post.media.length - 1));
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white backdrop-blur-md transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMediaIndex((prev) => (prev < post.media.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white backdrop-blur-md transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dots indicator */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-slate-950/70 backdrop-blur-md rounded-full border border-slate-800">
                {post.media.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveMediaIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      activeMediaIndex === i ? 'bg-indigo-400 w-4' : 'bg-slate-500 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {post.media[activeMediaIndex].caption && (
            <div className="px-4 py-2 bg-slate-950/90 text-xs text-slate-300 border-t border-slate-800/80">
              {post.media[activeMediaIndex].caption}
            </div>
          )}
        </div>
      )}

      {/* Reaction & Action Bar */}
      <div className="px-4 sm:px-5 py-3 border-t border-slate-800/60 flex items-center justify-between gap-2 relative">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Reaction Trigger with Popover */}
          <div className="relative">
            <button
              onClick={() => {
                // quick toggle default 'heart' or open picker
                if (!post.userReaction) {
                  reactToPost(post.id, 'heart');
                } else {
                  setShowReactionPicker(!showReactionPicker);
                }
              }}
              onMouseEnter={() => setShowReactionPicker(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                post.userReaction
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800/60'
              }`}
            >
              <Heart className={`w-4 h-4 ${post.userReaction ? 'fill-current' : ''}`} />
              <span>{totalReactions > 0 ? totalReactions : 'React'}</span>
            </button>

            {/* Floating Reactions Bar */}
            {showReactionPicker && (
              <div
                onMouseLeave={() => setShowReactionPicker(false)}
                className="absolute left-0 bottom-10 z-30 flex items-center gap-1 p-1.5 bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2"
              >
                {REACTION_CONFIG.map((r) => (
                  <button
                    key={r.type}
                    onClick={() => {
                      reactToPost(post.id, r.type);
                      setShowReactionPicker(false);
                    }}
                    className={`p-2 rounded-xl hover:bg-slate-800 transition-transform hover:scale-125 flex items-center justify-center ${
                      post.userReaction === r.type ? 'bg-indigo-500/20' : ''
                    }`}
                    title={r.label}
                  >
                    {r.icon}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-indigo-400 hover:bg-slate-800/60 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.commentsCount > 0 ? post.commentsCount : 'Comment'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Bookmark Button */}
        <button
          onClick={() => toggleBookmark(post.id)}
          className={`p-2 rounded-xl transition-colors ${
            post.isBookmarked
              ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title={post.isBookmarked ? 'Saved' : 'Bookmark'}
        >
          <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Active Reactions Pills */}
      {totalReactions > 0 && (
        <div className="px-4 sm:px-5 pb-2.5 flex items-center gap-1.5 flex-wrap">
          {REACTION_CONFIG.filter((r) => post.reactions[r.type] > 0).map((r) => (
            <button
              key={r.type}
              onClick={() => reactToPost(post.id, r.type)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium border transition-colors ${
                post.userReaction === r.type
                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{r.icon}</span>
              <span>{post.reactions[r.type]}</span>
            </button>
          ))}
        </div>
      )}

      {/* Expandable Comment Section */}
      {showComments && (
        <div className="bg-slate-950/80 border-t border-slate-800/80 p-4 sm:p-5 space-y-4">
          {/* Add Comment Input */}
          <form onSubmit={handleAddCommentSubmit} className="flex items-start gap-2.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0 mt-0.5"
            />
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Write a constructive comment or reaction..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Post</span>
              </button>
            </div>
          </form>

          {/* Comment Thread List */}
          {comments.length === 0 ? (
            <div className="text-center py-4 text-xs text-slate-500 italic">
              No comments yet. Start the conversation!
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <div className="flex items-start gap-2.5">
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.displayName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0 mt-0.5"
                    />
                    <div className="flex-1 bg-slate-900/70 border border-slate-800/80 rounded-xl p-3 text-xs sm:text-sm">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold text-slate-200">{comment.author.displayName}</span>
                        <span className="text-[11px] text-slate-500">{formatTime(comment.createdAt)}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{comment.content}</p>

                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                        <button
                          onClick={() => toggleCommentLike(post.id, comment.id)}
                          className={`flex items-center gap-1 font-medium transition-colors ${
                            comment.isLiked ? 'text-rose-400' : 'hover:text-slate-200'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-current' : ''}`} />
                          <span>{comment.likesCount}</span>
                        </button>
                        <button
                          onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                          className="hover:text-indigo-400 font-medium"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Reply Input */}
                  {replyingToId === comment.id && (
                    <div className="ml-9 flex items-center gap-2 pt-1">
                      <CornerDownRight className="w-4 h-4 text-slate-500 shrink-0" />
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Reply to ${comment.author.displayName}...`}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                        autoFocus
                      />
                      <button
                        onClick={() => handleReplySubmit(comment.id)}
                        disabled={!replyText.trim()}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-40"
                      >
                        Send
                      </button>
                    </div>
                  )}

                  {/* Threaded Nested Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-8 pl-3 border-l-2 border-slate-800 space-y-2">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-2.5">
                          <img
                            src={reply.author.avatar}
                            alt={reply.author.displayName}
                            className="w-6 h-6 rounded-full object-cover border border-slate-700 shrink-0 mt-0.5"
                          />
                          <div className="flex-1 bg-slate-900/50 border border-slate-800/60 rounded-xl p-2.5 text-xs">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <span className="font-semibold text-slate-200">{reply.author.displayName}</span>
                              <span className="text-[10px] text-slate-500">{formatTime(reply.createdAt)}</span>
                            </div>
                            <p className="text-slate-300">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
