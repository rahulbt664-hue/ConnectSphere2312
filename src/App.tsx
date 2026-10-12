import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { RightPanel } from './components/RightPanel';
import { FeedView } from './components/FeedView';
import { ExploreView } from './components/ExploreView';
import { CommunitiesView } from './components/CommunitiesView';
import { ChatView } from './components/ChatView';
import { NotificationsView } from './components/NotificationsView';
import { ProfileView } from './components/ProfileView';
import { ModerationDashboard } from './components/ModerationDashboard';
import { CreatePostModal } from './components/CreatePostModal';
import { CreateCommunityModal } from './components/CreateCommunityModal';
import { EditProfileModal } from './components/EditProfileModal';
import { ReportModal } from './components/ReportModal';
import { UserListModal } from './components/UserListModal';
import { MediaLightbox } from './components/MediaLightbox';
import { ToastContainer } from './components/ToastContainer';
import { MobileShell } from './components/MobileShell';
import { PostCard } from './components/PostCard';
import { GlobalSearchBar } from './components/GlobalSearchBar';
import { GlobalSearchResultsView } from './components/GlobalSearchResultsView';
import { Bookmark, Sparkles } from 'lucide-react';

function BookmarksView() {
  const { posts, setActiveTab } = useApp();
  const bookmarkedPosts = posts.filter((p) => p.isBookmarked);

  return (
    <div className="max-w-2xl mx-auto py-5 px-3 sm:px-4 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
        <Bookmark className="w-5 h-5 text-indigo-400" />
        <div>
          <h1 className="text-xl font-extrabold text-white">Saved Posts</h1>
          <p className="text-xs text-slate-400">All bookmarks are private to your account.</p>
        </div>
      </div>

      {bookmarkedPosts.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8 text-center space-y-2">
          <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No saved posts yet</h3>
          <p className="text-xs text-slate-500">Click the bookmark icon on any post to save it for later review.</p>
          <button
            onClick={() => setActiveTab('feed')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold"
          >
            Browse Feed
          </button>
        </div>
      ) : (
        bookmarkedPosts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}

function MainContent() {
  const { activeTab, deviceMode } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'feed':
        return <FeedView />;
      case 'explore':
        return <ExploreView />;
      case 'communities':
        return <CommunitiesView />;
      case 'messages':
        return <ChatView />;
      case 'notifications':
        return <NotificationsView />;
      case 'bookmarks':
        return <BookmarksView />;
      case 'search':
        return <GlobalSearchResultsView />;
      case 'profile':
        return <ProfileView />;
      case 'moderation':
        return <ModerationDashboard />;
      default:
        return <FeedView />;
    }
  };

  if (deviceMode === 'mobile_simulator') {
    return (
      <div className="min-h-full pb-20">
        <Navbar />
        {activeTab !== 'messages' && (
          <div className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md px-3 py-2 border-b border-slate-800/80">
            <GlobalSearchBar />
          </div>
        )}
        <main>{renderActiveView()}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 md:pb-0">
        {/* Left Desktop Navigation Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Center Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto min-w-0">
          {/* Top Search Bar for Main Content Area */}
          {activeTab !== 'messages' && (
            <div className="sticky top-0 z-20 bg-slate-950/85 backdrop-blur-md px-3 sm:px-6 py-3 border-b border-slate-800/70">
              <div className="max-w-2xl mx-auto">
                <GlobalSearchBar />
              </div>
            </div>
          )}
          {renderActiveView()}
        </main>

        {/* Right Desktop Discovery Sidebar (hidden on messages tab or small screens) */}
        {activeTab !== 'messages' && (
          <div className="hidden lg:block">
            <RightPanel />
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MobileShell>
        <MainContent />
      </MobileShell>

      {/* Global Modals & Notifications */}
      <CreatePostModal />
      <CreateCommunityModal />
      <EditProfileModal />
      <ReportModal />
      <UserListModal />
      <MediaLightbox />
      <ToastContainer />
    </AppProvider>
  );
}
