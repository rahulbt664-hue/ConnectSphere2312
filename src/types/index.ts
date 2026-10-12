export type UserRole = 'admin' | 'moderator' | 'user';

export interface User {
  id: string;
  username: string;
  handle: string;
  displayName: string;
  avatar: string;
  banner: string;
  bio: string;
  location?: string;
  website?: string;
  role: UserRole;
  isVerified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
  isBlocked?: boolean;
  isMuted?: boolean;
  createdAt: string;
  privacy: {
    isPrivateAccount: boolean;
    allowDirectMessages: 'everyone' | 'following' | 'nobody';
  };
}

export type ReactionType = 'like' | 'fire' | 'heart' | 'insightful' | 'rocket' | 'laugh';

export interface ReactionCount {
  type: ReactionType;
  count: number;
  hasReacted: boolean;
  label: string;
  emoji: string;
}

export interface PostMedia {
  id: string;
  url: string;
  aspectRatio?: 'square' | 'wide' | 'tall';
  caption?: string;
}

export interface Post {
  id: string;
  authorId: string;
  author: User;
  content: string;
  media: PostMedia[];
  tags: string[];
  communityId?: string;
  communitySlug?: string;
  communityName?: string;
  communityIcon?: string;
  reactions: {
    like: number;
    fire: number;
    heart: number;
    insightful: number;
    rocket: number;
    laugh: number;
  };
  userReaction?: ReactionType | null;
  commentsCount: number;
  bookmarksCount: number;
  isBookmarked: boolean;
  sharesCount: number;
  isEdited?: boolean;
  pinned?: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
  parentId?: string | null;
  replies?: Comment[];
}

export interface Community {
  id: string;
  name: string;
  slug: string; // e.g. "techpulse" -> "c/techpulse"
  tagline: string;
  description: string;
  icon: string;
  banner: string;
  category: string;
  membersCount: number;
  isMember: boolean;
  role?: 'creator' | 'mod' | 'member';
  rules: string[];
  createdAt: string;
  isPrivate?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  text: string;
  attachments?: {
    type: 'image';
    url: string;
  }[];
  reactions?: {
    emoji: string;
    count: number;
    userIds: string[];
  }[];
  createdAt: string;
  isRead?: boolean;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'community_channel';
  communityId?: string;
  name?: string;
  participants: User[];
  lastMessage?: {
    text: string;
    senderName: string;
    timestamp: string;
  };
  unreadCount: number;
  updatedAt: string;
}

export type NotificationType = 'follow' | 'reaction' | 'comment' | 'mention' | 'message' | 'mod_alert';

export interface NotificationItem {
  id: string;
  recipientId: string;
  actor: User;
  type: NotificationType;
  message: string;
  targetPostId?: string;
  targetCommunitySlug?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  reporter: User;
  targetType: 'post' | 'user' | 'comment';
  targetId: string;
  targetContentPreview?: string;
  targetAuthorName?: string;
  reason: 'spam' | 'harassment' | 'hate_speech' | 'inappropriate' | 'misinformation' | 'other';
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface ModerationLog {
  id: string;
  moderatorName: string;
  action: 'remove_post' | 'ban_user' | 'warn_user' | 'dismiss_report';
  targetId: string;
  reason: string;
  timestamp: string;
}
