import React, { ReactNode } from 'react';
import { useApp, NavTab } from '../context/AppContext';
import {
  Home,
  Compass,
  PlusCircle,
  MessageSquare,
  User as UserIcon,
  Wifi,
  Battery,
  Users,
  ShieldCheck,
  Bell,
  Search,
} from 'lucide-react';

interface MobileShellProps {
  children: ReactNode;
}

export function MobileShell({ children }: MobileShellProps) {
  const {
    deviceMode,
    activeTab,
    setActiveTab,
    setIsCreatePostOpen,
    currentUser,
    setViewingUserId,
    unreadNotificationsCount,
  } = useApp();

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const BOTTOM_TABS: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'feed', label: 'Feed', icon: <Home className="w-5 h-5" /> },
    { id: 'search', label: 'Search', icon: <Search className="w-5 h-5" /> },
    { id: 'communities', label: 'Hubs', icon: <Users className="w-5 h-5" /> },
    { id: 'messages', label: 'Chat', icon: <MessageSquare className="w-5 h-5" />, badge: 2 },
    { id: 'notifications', label: 'Alerts', icon: <Bell className="w-5 h-5" />, badge: unreadNotificationsCount },
    { id: 'profile', label: 'Profile', icon: <UserIcon className="w-5 h-5" /> },
  ];

  // Mobile Bottom Tab Bar Component
  const MobileTabBar = () => (
    <nav className="h-16 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-md px-3 flex items-center justify-around shrink-0 z-40">
      {BOTTOM_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === 'profile') setViewingUserId(currentUser.id);
              setActiveTab(tab.id);
            }}
            className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-colors ${
              isActive ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <div className="relative">
              {tab.icon}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-indigo-600 text-white text-[9px] font-bold">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );

  // If mobile simulator frame is active
  if (deviceMode === 'mobile_simulator') {
    return (
      <div className="min-h-screen bg-slate-950/95 flex flex-col items-center justify-center p-2 sm:p-6 overflow-hidden">
        {/* Device frame container */}
        <div className="w-full max-w-[410px] h-[840px] max-h-[96vh] bg-slate-900 border-[10px] border-slate-800 rounded-[50px] shadow-2xl flex flex-col overflow-hidden relative ring-1 ring-slate-700/50">
          {/* Top Notch / Dynamic Island */}
          <div className="h-10 bg-slate-950 flex items-center justify-between px-6 shrink-0 select-none z-50 text-slate-300 text-xs font-semibold">
            <span>{currentTime}</span>
            <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto" />
            <div className="flex items-center gap-1.5 text-slate-300">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Screen Content */}
          <div className="flex-1 overflow-y-auto bg-slate-950/90 relative">
            {children}
          </div>

          {/* Simulated Mobile Floating Post Button */}
          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="absolute bottom-20 right-4 w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/60 z-50 transition-transform active:scale-95"
            title="Create Post"
          >
            <PlusCircle className="w-6 h-6" />
          </button>

          {/* Bottom Native Tab Bar */}
          <MobileTabBar />
        </div>
      </div>
    );
  }

  // Standard responsive web layout
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">{children}</div>

      {/* Visible only on small mobile screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <MobileTabBar />
      </div>
    </div>
  );
}
