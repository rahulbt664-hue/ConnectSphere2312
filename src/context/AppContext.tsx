import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
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
import { storage } from '../services/storage';

export type NavTab =
  | 'feed'
  | 'explore'
  | 'communities'
  | 'messages'
  | 'notifications'
  | 'bookmarks'
  | 'profile'
  | 'moderation'
  | 'search';

export type DeviceMode = 'desktop' | 'mobile_simulator';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  currentUser: User;
  allUsers: User[];
  switchUser: (userId: string) => void;
  updateProfile: (data: Partial<User>) => void;
  toggleFollow: (targetUserId: string) => void;
  toggleBlock: (targetUserId: string) => void;

  posts: Post[];
  refreshPosts: () => void;
  createPost: (data: { content: string; mediaUrls?: string[]; tags?: string[]; communityId?: string }) => Post;
  deletePost: (postId: string) => void;
  reactToPost: (postId: string, reaction: ReactionType) => void;
  toggleBookmark: (postId: string) => void;

  getComments: (postId: string) => Comment[];
  addComment: (postId: string, content: string, parentId?: string) => Comment;
  toggleCommentLike: (postId: string, commentId: string) => void;

  communities: Community[];
  activeCommunitySlug: string | null;
  setActiveCommunitySlug: (slug: string | null) => void;
  toggleJoinCommunity: (communityId: string) => void;
  createCommunity: (data: Parameters<typeof storage.createCommunity>[0]) => Community;

  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  getMessages: (convId: string) => Message[];
  sendMessage: (convId: string, text: string, attachmentUrl?: string) => void;
  reactToMessage: (convId: string, messageId: string, emoji: string) => void;
  startDirectMessage: (user: User) => void;

  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
  markNotificationsRead: () => void;

  reports: ReportItem[];
  moderationLogs: ModerationLog[];
  submitReport: (data: Parameters<typeof storage.submitReport>[0]) => void;
  resolveReport: (reportId: string, action: 'dismiss' | 'remove_post' | 'ban_user' | 'warn_user', reasonNote: string) => void;

  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  viewingUserId: string | null;
  setViewingUserId: (id: string | null) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchFilter: 'all' | 'users' | 'posts' | 'communities';
  setSearchFilter: (filter: 'all' | 'users' | 'posts' | 'communities') => void;
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  executeGlobalSearch: (query: string) => void;

  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;

  isCreatePostOpen: boolean;
  setIsCreatePostOpen: (open: boolean) => void;
  isCreateCommunityOpen: boolean;
  setIsCreateCommunityOpen: (open: boolean) => void;
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: (open: boolean) => void;

  reportingTarget: {
    targetType: 'post' | 'user' | 'comment';
    targetId: string;
    targetAuthorName?: string;
    targetContentPreview?: string;
  } | null;
  setReportingTarget: (target: AppContextType['reportingTarget']) => void;

  activeLightboxMedia: { url: string; caption?: string } | null;
  setActiveLightboxMedia: (media: { url: string; caption?: string } | null) => void;

  userListModal: { title: string; users: User[] } | null;
  setUserListModal: (data: { title: string; users: User[] } | null) => void;

  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(() => storage.getCurrentUser());
  const [allUsers, setAllUsers] = useState<User[]>(() => storage.getUsers());
  const [posts, setPosts] = useState<Post[]>(() => storage.getPosts());
  const [communities, setCommunities] = useState<Community[]>(() => storage.getCommunities());
  const [conversations, setConversations] = useState<Conversation[]>(() => storage.getConversations());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => storage.getNotifications());
  const [reports, setReports] = useState<ReportItem[]>(() => storage.getReports());
  const [moderationLogs, setModerationLogs] = useState<ModerationLog[]>(() => storage.getModerationLogs());

  const [activeTab, setActiveTab] = useState<NavTab>('feed');
  const [activeCommunitySlug, setActiveCommunitySlug] = useState<string | null>(null);
  const [viewingUserId, setViewingUserId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<'all' | 'users' | 'posts' | 'communities'>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('connectsphere_recent_searches_v1');
      return saved ? JSON.parse(saved) : ['Berlin', 'Architecture', 'TypeScript', 'c/techpulse'];
    } catch {
      return ['Berlin', 'Architecture', 'TypeScript', 'c/techpulse'];
    }
  });

  const addRecentSearch = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const next = [trimmed, ...prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, 8);
      try {
        localStorage.setItem('connectsphere_recent_searches_v1', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('connectsphere_recent_searches_v1');
    } catch {}
  }, []);

  const executeGlobalSearch = useCallback((q: string) => {
    setSearchQuery(q);
    addRecentSearch(q);
    setActiveTab('search');
  }, [addRecentSearch]);

  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateCommunityOpen, setIsCreateCommunityOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [reportingTarget, setReportingTarget] = useState<AppContextType['reportingTarget']>(null);
  const [activeLightboxMedia, setActiveLightboxMedia] = useState<{ url: string; caption?: string } | null>(null);
  const [userListModal, setUserListModal] = useState<{ title: string; users: User[] } | null>(null);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const refreshPosts = useCallback(() => {
    setPosts(storage.getPosts());
  }, []);

  const switchUser = useCallback(
    (userId: string) => {
      const u = storage.switchUser(userId);
      setCurrentUser(u);
      setNotifications(storage.getNotifications());
      setConversations(storage.getConversations());
      refreshPosts();
      showToast(`Switched persona to ${u.displayName}`, 'info');
    },
    [refreshPosts, showToast]
  );

  const updateProfile = useCallback(
    (data: Partial<User>) => {
      const updated = storage.updateProfile(data);
      setCurrentUser(updated);
      setAllUsers(storage.getUsers());
      refreshPosts();
      showToast('Profile updated successfully', 'success');
    },
    [refreshPosts, showToast]
  );

  const toggleFollow = useCallback(
    (targetUserId: string) => {
      const res = storage.toggleFollow(targetUserId);
      setAllUsers(storage.getUsers());
      setCurrentUser(storage.getCurrentUser());
      refreshPosts();
      showToast(
        res.isFollowing
          ? `Now following ${res.targetUser.displayName}`
          : `Unfollowed ${res.targetUser.displayName}`,
        'info'
      );
    },
    [refreshPosts, showToast]
  );

  const toggleBlock = useCallback(
    (targetUserId: string) => {
      const isBlocked = storage.toggleBlock(targetUserId);
      refreshPosts();
      showToast(isBlocked ? 'User blocked. Posts hidden.' : 'User unblocked', 'info');
    },
    [refreshPosts, showToast]
  );

  const createPost = useCallback(
    (data: { content: string; mediaUrls?: string[]; tags?: string[]; communityId?: string }) => {
      const newPost = storage.createPost(data);
      setPosts(storage.getPosts());
      setCurrentUser(storage.getCurrentUser());
      showToast('Post published to ConnectSphere feed!', 'success');
      return newPost;
    },
    [showToast]
  );

  const deletePost = useCallback(
    (postId: string) => {
      storage.deletePost(postId);
      setPosts(storage.getPosts());
      showToast('Post removed', 'info');
    },
    [showToast]
  );

  const reactToPost = useCallback((postId: string, reaction: ReactionType) => {
    const updated = storage.reactToPost(postId, reaction);
    setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
    setNotifications(storage.getNotifications());
  }, []);

  const toggleBookmark = useCallback(
    (postId: string) => {
      const isBookmarked = storage.toggleBookmark(postId);
      setPosts(storage.getPosts());
      showToast(isBookmarked ? 'Post saved to Bookmarks' : 'Removed from Bookmarks', 'info');
    },
    [showToast]
  );

  const getComments = useCallback((postId: string) => {
    return storage.getComments(postId);
  }, []);

  const addComment = useCallback(
    (postId: string, content: string, parentId?: string) => {
      const comment = storage.addComment(postId, content, parentId);
      setPosts(storage.getPosts());
      setNotifications(storage.getNotifications());
      showToast('Comment posted', 'success');
      return comment;
    },
    [showToast]
  );

  const toggleCommentLike = useCallback((postId: string, commentId: string) => {
    storage.toggleCommentLike(postId, commentId);
  }, []);

  const toggleJoinCommunity = useCallback(
    (communityId: string) => {
      const comm = storage.toggleJoinCommunity(communityId);
      setCommunities(storage.getCommunities());
      showToast(
        comm.isMember ? `Joined c/${comm.slug}` : `Left c/${comm.slug}`,
        'info'
      );
    },
    [showToast]
  );

  const createCommunity = useCallback(
    (data: Parameters<typeof storage.createCommunity>[0]) => {
      const comm = storage.createCommunity(data);
      setCommunities(storage.getCommunities());
      showToast(`Created community c/${comm.slug}!`, 'success');
      return comm;
    },
    [showToast]
  );

  const getMessages = useCallback((convId: string) => {
    return storage.getMessages(convId);
  }, []);

  const sendMessage = useCallback(
    (convId: string, text: string, attachmentUrl?: string) => {
      storage.sendMessage(convId, text, attachmentUrl);
      setConversations(storage.getConversations());
    },
    []
  );

  const reactToMessage = useCallback((convId: string, messageId: string, emoji: string) => {
    storage.reactToMessage(convId, messageId, emoji);
  }, []);

  const startDirectMessage = useCallback(
    (targetUser: User) => {
      const convs = storage.getConversations();
      let conv = convs.find(
        (c) =>
          c.type === 'direct' &&
          c.participants.some((p) => p.id === targetUser.id) &&
          c.participants.some((p) => p.id === currentUser.id)
      );

      if (!conv) {
        // create new conversation
        const newConv: Conversation = {
          id: `conv_${Date.now()}`,
          type: 'direct',
          participants: [currentUser, targetUser],
          unreadCount: 0,
          updatedAt: new Date().toISOString(),
        };
        const allConvs = [newConv, ...convs];
        localStorage.setItem('connectsphere_conversations_v1', JSON.stringify(allConvs));
        conv = newConv;
        setConversations(allConvs);
      }

      setActiveConversationId(conv.id);
      setActiveTab('messages');
    },
    [currentUser]
  );

  const markNotificationsRead = useCallback(() => {
    storage.markAllNotificationsRead();
    setNotifications(storage.getNotifications());
    showToast('All notifications marked as read', 'info');
  }, [showToast]);

  const submitReport = useCallback(
    (data: Parameters<typeof storage.submitReport>[0]) => {
      storage.submitReport(data);
      setReports(storage.getReports());
      showToast('Report submitted for moderator review. Thank you for keeping ConnectSphere safe.', 'success');
      setReportingTarget(null);
    },
    [showToast]
  );

  const resolveReport = useCallback(
    (reportId: string, action: 'dismiss' | 'remove_post' | 'ban_user' | 'warn_user', reasonNote: string) => {
      storage.resolveReport(reportId, action, reasonNote);
      setReports(storage.getReports());
      setModerationLogs(storage.getModerationLogs());
      refreshPosts();
      showToast(`Report action executed: ${action}`, 'success');
    },
    [refreshPosts, showToast]
  );

  const resetAllData = useCallback(() => {
    storage.resetToDefaults();
    setCurrentUser(storage.getCurrentUser());
    setAllUsers(storage.getUsers());
    setPosts(storage.getPosts());
    setCommunities(storage.getCommunities());
    setConversations(storage.getConversations());
    setNotifications(storage.getNotifications());
    setReports(storage.getReports());
    setModerationLogs(storage.getModerationLogs());
    showToast('Platform reset to initial seed state', 'info');
  }, [showToast]);

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        switchUser,
        updateProfile,
        toggleFollow,
        toggleBlock,

        posts,
        refreshPosts,
        createPost,
        deletePost,
        reactToPost,
        toggleBookmark,

        getComments,
        addComment,
        toggleCommentLike,

        communities,
        activeCommunitySlug,
        setActiveCommunitySlug,
        toggleJoinCommunity,
        createCommunity,

        conversations,
        activeConversationId,
        setActiveConversationId,
        getMessages,
        sendMessage,
        reactToMessage,
        startDirectMessage,

        notifications,
        unreadNotificationsCount,
        unreadMessagesCount,
        markNotificationsRead,

        reports,
        moderationLogs,
        submitReport,
        resolveReport,

        activeTab,
        setActiveTab,
        viewingUserId,
        setViewingUserId,

        searchQuery,
        setSearchQuery,
        searchFilter,
        setSearchFilter,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        executeGlobalSearch,

        deviceMode,
        setDeviceMode,

        isCreatePostOpen,
        setIsCreatePostOpen,
        isCreateCommunityOpen,
        setIsCreateCommunityOpen,
        isEditProfileOpen,
        setIsEditProfileOpen,

        reportingTarget,
        setReportingTarget,

        activeLightboxMedia,
        setActiveLightboxMedia,

        userListModal,
        setUserListModal,

        toasts,
        showToast,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
