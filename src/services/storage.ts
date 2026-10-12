import {
  User,
  Post,
  Community,
  Conversation,
  Message,
  NotificationItem,
  ReportItem,
  ModerationLog,
  ReactionType,
  Comment,
} from '../types';
import {
  SEED_USERS,
  CURRENT_USER_DEFAULT,
  SEED_COMMUNITIES,
  SEED_POSTS,
  SEED_COMMENTS,
  SEED_CONVERSATIONS,
  SEED_MESSAGES,
  SEED_NOTIFICATIONS,
  SEED_REPORTS,
  SEED_MOD_LOGS,
} from './mockData';

const STORAGE_KEYS = {
  USERS: 'connectsphere_users_v1',
  CURRENT_USER: 'connectsphere_current_user_v1',
  COMMUNITIES: 'connectsphere_communities_v1',
  POSTS: 'connectsphere_posts_v1',
  COMMENTS: 'connectsphere_comments_v1',
  CONVERSATIONS: 'connectsphere_conversations_v1',
  MESSAGES: 'connectsphere_messages_v1',
  NOTIFICATIONS: 'connectsphere_notifications_v1',
  REPORTS: 'connectsphere_reports_v1',
  MOD_LOGS: 'connectsphere_mod_logs_v1',
  BLOCKED_IDS: 'connectsphere_blocked_ids_v1',
};

class StorageManager {
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore storage quota errors in sandbox
    }
  }

  // --- Users ---
  getUsers(): User[] {
    return this.getItem<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
  }

  getCurrentUser(): User {
    const user = this.getItem<User>(STORAGE_KEYS.CURRENT_USER, CURRENT_USER_DEFAULT);
    // ensure latest fields
    return user;
  }

  setCurrentUser(user: User): void {
    this.setItem(STORAGE_KEYS.CURRENT_USER, user);
    // sync in users list
    const users = this.getUsers().map((u) => (u.id === user.id ? user : u));
    this.setItem(STORAGE_KEYS.USERS, users);
  }

  switchUser(userId: string): User {
    const users = this.getUsers();
    const target = users.find((u) => u.id === userId) || users[0];
    this.setItem(STORAGE_KEYS.CURRENT_USER, target);
    return target;
  }

  updateProfile(updatedFields: Partial<User>): User {
    const current = this.getCurrentUser();
    const updated = { ...current, ...updatedFields };
    this.setCurrentUser(updated);
    return updated;
  }

  toggleFollow(targetUserId: string): { isFollowing: boolean; targetUser: User } {
    const current = this.getCurrentUser();
    const users = this.getUsers();
    const targetIndex = users.findIndex((u) => u.id === targetUserId);
    if (targetIndex === -1) throw new Error('User not found');

    const target = users[targetIndex];
    const willFollow = !target.isFollowing;

    const updatedTarget: User = {
      ...target,
      isFollowing: willFollow,
      followersCount: willFollow ? target.followersCount + 1 : Math.max(0, target.followersCount - 1),
    };

    users[targetIndex] = updatedTarget;
    this.setItem(STORAGE_KEYS.USERS, users);

    // update current user following count
    const updatedCurrent: User = {
      ...current,
      followingCount: willFollow ? current.followingCount + 1 : Math.max(0, current.followingCount - 1),
    };
    this.setCurrentUser(updatedCurrent);

    if (willFollow) {
      this.createNotification({
        recipientId: targetUserId,
        actor: current,
        type: 'follow',
        message: 'started following you',
      });
    }

    return { isFollowing: willFollow, targetUser: updatedTarget };
  }

  toggleBlock(targetUserId: string): boolean {
    const blocked = this.getBlockedIds();
    const isCurrentlyBlocked = blocked.includes(targetUserId);
    let nextBlocked: string[];
    if (isCurrentlyBlocked) {
      nextBlocked = blocked.filter((id) => id !== targetUserId);
    } else {
      nextBlocked = [...blocked, targetUserId];
    }
    this.setItem(STORAGE_KEYS.BLOCKED_IDS, nextBlocked);
    return !isCurrentlyBlocked;
  }

  getBlockedIds(): string[] {
    return this.getItem<string[]>(STORAGE_KEYS.BLOCKED_IDS, []);
  }

  // --- Posts ---
  getPosts(): Post[] {
    const blockedIds = this.getBlockedIds();
    const posts = this.getItem<Post[]>(STORAGE_KEYS.POSTS, SEED_POSTS);
    return posts.filter((p) => !blockedIds.includes(p.authorId));
  }

  createPost(newPostData: {
    content: string;
    mediaUrls?: string[];
    tags?: string[];
    communityId?: string;
  }): Post {
    const current = this.getCurrentUser();
    const communities = this.getCommunities();
    const comm = newPostData.communityId ? communities.find((c) => c.id === newPostData.communityId) : undefined;

    const newPost: Post = {
      id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      authorId: current.id,
      author: current,
      content: newPostData.content,
      media: (newPostData.mediaUrls || []).map((url, i) => ({
        id: `m_${Date.now()}_${i}`,
        url,
        aspectRatio: 'wide',
      })),
      tags: newPostData.tags || [],
      communityId: comm?.id,
      communitySlug: comm?.slug,
      communityName: comm?.name,
      communityIcon: comm?.icon,
      reactions: {
        like: 0,
        fire: 0,
        heart: 0,
        insightful: 0,
        rocket: 0,
        laugh: 0,
      },
      userReaction: null,
      commentsCount: 0,
      bookmarksCount: 0,
      isBookmarked: false,
      sharesCount: 0,
      createdAt: new Date().toISOString(),
    };

    const posts = [newPost, ...this.getPosts()];
    this.setItem(STORAGE_KEYS.POSTS, posts);

    // Increment user's post count
    this.updateProfile({ postsCount: current.postsCount + 1 });

    return newPost;
  }

  deletePost(postId: string): void {
    const posts = this.getPosts().filter((p) => p.id !== postId);
    this.setItem(STORAGE_KEYS.POSTS, posts);
  }

  reactToPost(postId: string, reaction: ReactionType): Post {
    const posts = this.getPosts();
    const postIndex = posts.findIndex((p) => p.id === postId);
    if (postIndex === -1) throw new Error('Post not found');

    const post = posts[postIndex];
    const currentUser = this.getCurrentUser();
    const previousReaction = post.userReaction;

    const newReactions = { ...post.reactions };

    if (previousReaction === reaction) {
      // Toggle off
      newReactions[reaction] = Math.max(0, newReactions[reaction] - 1);
      post.userReaction = null;
    } else {
      // Remove old if existed
      if (previousReaction) {
        newReactions[previousReaction] = Math.max(0, newReactions[previousReaction] - 1);
      }
      // Add new
      newReactions[reaction] = (newReactions[reaction] || 0) + 1;
      post.userReaction = reaction;

      // trigger notification if not self
      if (post.authorId !== currentUser.id) {
        this.createNotification({
          recipientId: post.authorId,
          actor: currentUser,
          type: 'reaction',
          message: `reacted to your post "${post.content.slice(0, 35)}..."`,
          targetPostId: post.id,
        });
      }
    }

    post.reactions = newReactions;
    posts[postIndex] = post;
    this.setItem(STORAGE_KEYS.POSTS, posts);
    return post;
  }

  toggleBookmark(postId: string): boolean {
    const posts = this.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) return false;

    post.isBookmarked = !post.isBookmarked;
    post.bookmarksCount = post.isBookmarked
      ? post.bookmarksCount + 1
      : Math.max(0, post.bookmarksCount - 1);

    this.setItem(STORAGE_KEYS.POSTS, posts);
    return post.isBookmarked;
  }

  // --- Comments ---
  getComments(postId: string): Comment[] {
    const all = this.getItem<Record<string, Comment[]>>(STORAGE_KEYS.COMMENTS, SEED_COMMENTS);
    return all[postId] || [];
  }

  addComment(postId: string, content: string, parentId?: string): Comment {
    const all = this.getItem<Record<string, Comment[]>>(STORAGE_KEYS.COMMENTS, SEED_COMMENTS);
    const postComments = all[postId] || [];
    const currentUser = this.getCurrentUser();

    const newComment: Comment = {
      id: `comm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      postId,
      authorId: currentUser.id,
      author: currentUser,
      content,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      isLiked: false,
      parentId: parentId || null,
      replies: [],
    };

    if (parentId) {
      // Find parent comment and append
      const appendReply = (commentsList: Comment[]): boolean => {
        for (const c of commentsList) {
          if (c.id === parentId) {
            c.replies = c.replies || [];
            c.replies.push(newComment);
            return true;
          }
          if (c.replies && appendReply(c.replies)) return true;
        }
        return false;
      };
      appendReply(postComments);
    } else {
      postComments.push(newComment);
    }

    all[postId] = postComments;
    this.setItem(STORAGE_KEYS.COMMENTS, all);

    // update post comments count
    const posts = this.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (post) {
      post.commentsCount += 1;
      this.setItem(STORAGE_KEYS.POSTS, posts);

      if (post.authorId !== currentUser.id) {
        this.createNotification({
          recipientId: post.authorId,
          actor: currentUser,
          type: 'comment',
          message: `commented: "${content.slice(0, 40)}"`,
          targetPostId: post.id,
        });
      }
    }

    return newComment;
  }

  toggleCommentLike(postId: string, commentId: string): boolean {
    const all = this.getItem<Record<string, Comment[]>>(STORAGE_KEYS.COMMENTS, SEED_COMMENTS);
    const postComments = all[postId] || [];

    let isLikedNow = false;
    const toggleInList = (list: Comment[]): boolean => {
      for (const c of list) {
        if (c.id === commentId) {
          c.isLiked = !c.isLiked;
          c.likesCount = c.isLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1);
          isLikedNow = c.isLiked;
          return true;
        }
        if (c.replies && toggleInList(c.replies)) return true;
      }
      return false;
    };

    toggleInList(postComments);
    all[postId] = postComments;
    this.setItem(STORAGE_KEYS.COMMENTS, all);
    return isLikedNow;
  }

  // --- Communities ---
  getCommunities(): Community[] {
    return this.getItem<Community[]>(STORAGE_KEYS.COMMUNITIES, SEED_COMMUNITIES);
  }

  getCommunityBySlug(slug: string): Community | undefined {
    return this.getCommunities().find((c) => c.slug.toLowerCase() === slug.toLowerCase());
  }

  toggleJoinCommunity(communityId: string): Community {
    const communities = this.getCommunities();
    const comm = communities.find((c) => c.id === communityId);
    if (!comm) throw new Error('Community not found');

    comm.isMember = !comm.isMember;
    comm.membersCount = comm.isMember ? comm.membersCount + 1 : Math.max(0, comm.membersCount - 1);

    this.setItem(STORAGE_KEYS.COMMUNITIES, communities);
    return comm;
  }

  createCommunity(data: {
    name: string;
    slug: string;
    tagline: string;
    description: string;
    category: string;
    icon: string;
    banner: string;
    rules: string[];
  }): Community {
    const newCommunity: Community = {
      id: `comm_${Date.now()}`,
      name: data.name,
      slug: data.slug.toLowerCase().replace(/[^a-z0-9_-]/g, ''),
      tagline: data.tagline,
      description: data.description,
      category: data.category,
      icon: data.icon || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      banner: data.banner || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
      membersCount: 1,
      isMember: true,
      role: 'creator',
      rules: data.rules,
      createdAt: new Date().toISOString(),
    };

    const communities = [newCommunity, ...this.getCommunities()];
    this.setItem(STORAGE_KEYS.COMMUNITIES, communities);
    return newCommunity;
  }

  // --- Messaging ---
  getConversations(): Conversation[] {
    const current = this.getCurrentUser();
    const convs = this.getItem<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, SEED_CONVERSATIONS);
    return convs.filter(
      (c) => c.type === 'community_channel' || c.participants.some((p) => p.id === current.id)
    );
  }

  getMessages(conversationId: string): Message[] {
    const all = this.getItem<Record<string, Message[]>>(STORAGE_KEYS.MESSAGES, SEED_MESSAGES);
    return all[conversationId] || [];
  }

  sendMessage(conversationId: string, text: string, attachmentUrl?: string): Message {
    const current = this.getCurrentUser();
    const all = this.getItem<Record<string, Message[]>>(STORAGE_KEYS.MESSAGES, SEED_MESSAGES);
    const messages = all[conversationId] || [];

    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      conversationId,
      senderId: current.id,
      sender: current,
      text,
      attachments: attachmentUrl ? [{ type: 'image', url: attachmentUrl }] : undefined,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    messages.push(newMessage);
    all[conversationId] = messages;
    this.setItem(STORAGE_KEYS.MESSAGES, all);

    // update conversation lastMessage and timestamp
    const convs = this.getItem<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, SEED_CONVERSATIONS);
    const conv = convs.find((c) => c.id === conversationId);
    if (conv) {
      conv.lastMessage = {
        text,
        senderName: current.displayName,
        timestamp: newMessage.createdAt,
      };
      conv.updatedAt = newMessage.createdAt;
      this.setItem(STORAGE_KEYS.CONVERSATIONS, convs);
    }

    return newMessage;
  }

  reactToMessage(conversationId: string, messageId: string, emoji: string): void {
    const current = this.getCurrentUser();
    const all = this.getItem<Record<string, Message[]>>(STORAGE_KEYS.MESSAGES, SEED_MESSAGES);
    const messages = all[conversationId] || [];
    const msg = messages.find((m) => m.id === messageId);
    if (!msg) return;

    msg.reactions = msg.reactions || [];
    const existing = msg.reactions.find((r) => r.emoji === emoji);
    if (existing) {
      if (existing.userIds.includes(current.id)) {
        existing.userIds = existing.userIds.filter((id) => id !== current.id);
        existing.count = existing.userIds.length;
      } else {
        existing.userIds.push(current.id);
        existing.count = existing.userIds.length;
      }
    } else {
      msg.reactions.push({ emoji, count: 1, userIds: [current.id] });
    }

    // clean up 0 count reactions
    msg.reactions = msg.reactions.filter((r) => r.count > 0);
    this.setItem(STORAGE_KEYS.MESSAGES, all);
  }

  // --- Notifications ---
  getNotifications(): NotificationItem[] {
    const current = this.getCurrentUser();
    const notifs = this.getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    return notifs.filter((n) => n.recipientId === current.id);
  }

  createNotification(notif: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>): NotificationItem {
    const notifs = this.getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    const newItem: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, [newItem, ...notifs]);
    return newItem;
  }

  markAllNotificationsRead(): void {
    const current = this.getCurrentUser();
    const notifs = this.getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    const updated = notifs.map((n) => (n.recipientId === current.id ? { ...n, isRead: true } : n));
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, updated);
  }

  // --- Moderation & Reports ---
  getReports(): ReportItem[] {
    return this.getItem<ReportItem[]>(STORAGE_KEYS.REPORTS, SEED_REPORTS);
  }

  submitReport(report: {
    targetType: 'post' | 'user' | 'comment';
    targetId: string;
    targetAuthorName?: string;
    targetContentPreview?: string;
    reason: ReportItem['reason'];
    details?: string;
  }): ReportItem {
    const current = this.getCurrentUser();
    const reports = this.getReports();
    const newReport: ReportItem = {
      id: `rep_${Date.now()}`,
      reporter: current,
      ...report,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this.setItem(STORAGE_KEYS.REPORTS, [newReport, ...reports]);
    return newReport;
  }

  resolveReport(reportId: string, action: 'dismiss' | 'remove_post' | 'ban_user' | 'warn_user', reasonNote: string): void {
    const current = this.getCurrentUser();
    const reports = this.getReports();
    const rep = reports.find((r) => r.id === reportId);
    if (!rep) return;

    rep.status = action === 'dismiss' ? 'dismissed' : 'resolved';
    this.setItem(STORAGE_KEYS.REPORTS, reports);

    // Apply corresponding action
    if (action === 'remove_post') {
      this.deletePost(rep.targetId);
    } else if (action === 'ban_user') {
      this.toggleBlock(rep.targetId);
    }

    // Append to audit log
    const logs = this.getModerationLogs();
    const newLog: ModerationLog = {
      id: `log_${Date.now()}`,
      moderatorName: current.displayName,
      action: action === 'dismiss' ? 'dismiss_report' : action,
      targetId: rep.targetId,
      reason: reasonNote || `Processed report: ${rep.reason}`,
      timestamp: new Date().toISOString(),
    };
    this.setItem(STORAGE_KEYS.MOD_LOGS, [newLog, ...logs]);
  }

  getModerationLogs(): ModerationLog[] {
    return this.getItem<ModerationLog[]>(STORAGE_KEYS.MOD_LOGS, SEED_MOD_LOGS);
  }

  // Reset to seeds if user requests clean restart
  resetToDefaults(): void {
    localStorage.clear();
  }
}

export const storage = new StorageManager();
