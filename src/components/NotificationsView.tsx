import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  Heart,
  MessageSquare,
  UserPlus,
  ShieldAlert,
  CheckCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { NotificationType } from '../types';

export function NotificationsView() {
  const {
    notifications,
    markNotificationsRead,
    setViewingUserId,
    setActiveTab,
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'reactions' | 'comments' | 'follows'>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'reactions') return n.type === 'reaction';
    if (filter === 'comments') return n.type === 'comment';
    if (filter === 'follows') return n.type === 'follow';
    return true;
  });

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'reaction':
        return <Heart className="w-4 h-4 fill-current text-rose-400" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-indigo-400" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-emerald-400" />;
      case 'mod_alert':
        return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-5 px-3 sm:px-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-400" />
            <span>Notifications Hub</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Stay updated with creator reactions, comments, and follows</p>
        </div>

        <button
          onClick={markNotificationsRead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
        >
          <CheckCheck className="w-4 h-4 text-indigo-400" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['all', 'reactions', 'comments', 'follows'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
              filter === tab
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notification list */}
      {filteredNotifs.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8 text-center space-y-2">
          <Bell className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No notifications in this filter</h3>
          <p className="text-xs text-slate-500">When people interact with your posts or profile, you will see alerts here.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                notif.isRead
                  ? 'bg-slate-900/50 border-slate-800/60'
                  : 'bg-slate-900/90 border-indigo-500/30 shadow-md'
              }`}
            >
              <div className="relative shrink-0 mt-0.5">
                <img
                  src={notif.actor.avatar}
                  alt={notif.actor.displayName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-950 border border-slate-800">
                  {getIcon(notif.type)}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-slate-200 leading-snug">
                  <button
                    onClick={() => {
                      setViewingUserId(notif.actor.id);
                      setActiveTab('profile');
                    }}
                    className="font-bold text-white hover:text-indigo-400 transition-colors mr-1"
                  >
                    {notif.actor.displayName}
                  </button>
                  <span className="text-slate-300">{notif.message}</span>
                </p>

                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500">
                  <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {!notif.isRead && (
                <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
