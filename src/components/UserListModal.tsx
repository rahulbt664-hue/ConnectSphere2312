import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Check, UserPlus, MessageSquare } from 'lucide-react';

export function UserListModal() {
  const { userListModal, setUserListModal, currentUser, toggleFollow, startDirectMessage, setViewingUserId } = useApp();

  if (!userListModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h3 className="font-semibold text-slate-100 text-base">{userListModal.title}</h3>
          <button
            onClick={() => setUserListModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 max-h-96 overflow-y-auto space-y-2 divide-y divide-slate-800/40">
          {userListModal.users.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">No users found.</div>
          ) : (
            userListModal.users.map((user) => {
              const isSelf = user.id === currentUser.id;

              return (
                <div key={user.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3">
                  <div
                    className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
                    onClick={() => {
                      setViewingUserId(user.id);
                      setUserListModal(null);
                    }}
                  >
                    <img
                      src={user.avatar}
                      alt={user.displayName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700/60 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors truncate">
                        {user.displayName}
                      </div>
                      <div className="text-xs text-slate-400 truncate">@{user.handle}</div>
                    </div>
                  </div>

                  {!isSelf && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          startDirectMessage(user);
                          setUserListModal(null);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Send Message"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => toggleFollow(user.id)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          user.isFollowing
                            ? 'bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 border border-slate-700'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950/40'
                        }`}
                      >
                        {user.isFollowing ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            Follow
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
