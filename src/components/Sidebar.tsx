import React, { useState } from 'react';
import { useApp, NavTab } from '../context/AppContext';
import {
  Home,
  Compass,
  Users,
  MessageSquare,
  Bell,
  Bookmark,
  User as UserIcon,
  ShieldCheck,
  PlusCircle,
  Sparkles,
  ChevronDown,
  Layers,
  Smartphone,
  Monitor,
  Search,
} from 'lucide-react';

export function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    currentUser,
    allUsers,
    switchUser,
    setIsCreatePostOpen,
    unreadNotificationsCount,
    unreadMessagesCount = 0,
    reports,
    setViewingUserId,
    deviceMode,
    setDeviceMode,
  } = useApp();

  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;

  const NAV_ITEMS: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'feed', label: 'Home Feed', icon: <Home className="w-5 h-5" /> },
    { id: 'search', label: 'Global Search', icon: <Search className="w-5 h-5" /> },
    { id: 'explore', label: 'Explore & Tags', icon: <Compass className="w-5 h-5" /> },
    { id: 'communities', label: 'Communities', icon: <Users className="w-5 h-5" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" />, badge: 2 },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" />, badge: unreadNotificationsCount },
    { id: 'bookmarks', label: 'Saved Posts', icon: <Bookmark className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <UserIcon className="w-5 h-5" /> },
  ];

  // If user is admin or moderator, add moderation dashboard tab
  if (currentUser.role === 'admin' || currentUser.role === 'moderator') {
    NAV_ITEMS.push({
      id: 'moderation',
      label: 'Safety & Moderation',
      icon: <ShieldCheck className="w-5 h-5 text-rose-400" />,
      badge: pendingReportsCount,
    });
  }

  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between h-full p-4 border-r border-slate-800/80 bg-slate-950/70 select-none">
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-400 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white font-black text-xl tracking-tight">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-slate-100 tracking-tight leading-none">
              Connect<span className="text-indigo-400">Sphere</span>
            </h1>
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Social • Communities • Chat
            </span>
          </div>
        </div>

        {/* Primary Navigation Links */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'profile') {
                    setViewingUserId(currentUser.id);
                  }
                  setActiveTab(item.id);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-indigo-400' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      item.id === 'moderation'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* New Post Primary Action */}
        <div className="pt-2 px-1">
          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/40 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Post</span>
          </button>
        </div>
      </div>

      {/* Footer Area: Platform Persona Switcher & Device Frame Toggle */}
      <div className="space-y-3 pt-4 border-t border-slate-800/80">
        {/* Device Mode Switcher (Web vs. Mobile Simulator) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-1.5 flex items-center justify-between text-xs">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition-colors ${
              deviceMode === 'desktop' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setDeviceMode('mobile_simulator')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition-colors ${
              deviceMode === 'mobile_simulator' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile App</span>
          </button>
        </div>

        {/* Persona Switcher Card */}
        <div className="relative">
          <button
            onClick={() => setShowPersonaMenu(!showPersonaMenu)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 text-left transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-200 truncate flex items-center gap-1">
                  <span>{currentUser.displayName}</span>
                  {currentUser.role === 'admin' && (
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1 rounded font-bold">Admin</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 truncate">@{currentUser.handle}</div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          </button>

          {showPersonaMenu && (
            <div
              className="absolute bottom-14 left-0 w-full bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-2 z-40 space-y-1 animate-in fade-in zoom-in-95"
              onClick={() => setShowPersonaMenu(false)}
            >
              <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch Test Persona
              </div>
              {allUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => switchUser(u.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left transition-colors ${
                    u.id === currentUser.id
                      ? 'bg-indigo-600/20 text-indigo-300 font-semibold'
                      : 'hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <img src={u.avatar} alt={u.displayName} className="w-7 h-7 rounded-full object-cover shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-medium truncate flex items-center gap-1">
                      <span>{u.displayName}</span>
                      {u.role === 'admin' && <span className="text-[9px] bg-rose-900/60 text-rose-300 px-1 rounded">Admin</span>}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">@{u.handle}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
