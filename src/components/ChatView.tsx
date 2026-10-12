import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Send,
  Image,
  Smile,
  Search,
  MoreVertical,
  CheckCheck,
  Hash,
  Sparkles,
  Paperclip,
} from 'lucide-react';

export function ChatView() {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    getMessages,
    sendMessage,
    reactToMessage,
    currentUser,
    allUsers,
    startDirectMessage,
    setActiveLightboxMedia,
  } = useApp();

  const [messageText, setMessageText] = useState('');
  const [searchConv, setSearchConv] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // default to first conversation if none selected
  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [activeConversationId, conversations, setActiveConversationId]);

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const activeMessages = activeConv ? getMessages(activeConv.id) : [];

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, activeConversationId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConv) return;
    sendMessage(activeConv.id, messageText.trim());
    setMessageText('');
  };

  const handleQuickImageSend = () => {
    if (!activeConv) return;
    const sampleImg = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80';
    sendMessage(activeConv.id, 'Sharing screenshot from the latest workstation build:', sampleImg);
  };

  const QUICK_EMOJIS = ['❤️', '🔥', '👍', '🚀', '😂', '🎉'];

  // Other participant in 1-on-1 DM
  const getOtherParticipant = (conv: typeof conversations[0]) => {
    return conv.participants.find((p) => p.id !== currentUser.id) || conv.participants[0];
  };

  return (
    <div className="h-[calc(100vh-4rem)] max-w-6xl mx-auto flex overflow-hidden border-x border-slate-800/80 bg-slate-950">
      {/* Left Conversations Sidebar */}
      <div className="w-80 shrink-0 border-r border-slate-800/80 bg-slate-950/60 flex flex-col">
        {/* Search & Header */}
        <div className="p-3.5 border-b border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Direct & Channels</span>
            </h2>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Online
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchConv}
              onChange={(e) => setSearchConv(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-850">
          {conversations.map((conv) => {
            const isSelected = conv.id === activeConversationId;
            const otherUser = getOtherParticipant(conv);
            const isChannel = conv.type === 'community_channel';

            return (
              <button
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`w-full p-3 flex items-start gap-3 text-left transition-colors ${
                  isSelected ? 'bg-indigo-600/15 border-l-2 border-indigo-500' : 'hover:bg-slate-900/60'
                }`}
              >
                <div className="relative shrink-0">
                  {isChannel ? (
                    <div className="w-10 h-10 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                      <Hash className="w-5 h-5" />
                    </div>
                  ) : (
                    <>
                      <img
                        src={otherUser.avatar}
                        alt={otherUser.displayName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                    </>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-semibold text-xs text-slate-200 truncate">
                      {isChannel ? conv.name : otherUser.displayName}
                    </span>
                    {conv.lastMessage && (
                      <span className="text-[10px] text-slate-500 shrink-0">
                        {new Date(conv.lastMessage.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 truncate">
                    {conv.lastMessage?.text || 'No messages yet'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Chat Panel */}
      {activeConv ? (
        <div className="flex-1 flex flex-col bg-slate-900/40">
          {/* Active Chat Header */}
          <div className="p-3.5 border-b border-slate-800/80 bg-slate-950/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {activeConv.type === 'community_channel' ? (
                <div className="w-9 h-9 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                  <Hash className="w-5 h-5" />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={getOtherParticipant(activeConv).avatar}
                    alt={getOtherParticipant(activeConv).displayName}
                    className="w-9 h-9 rounded-full object-cover border border-slate-700"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                </div>
              )}

              <div>
                <h3 className="font-bold text-sm text-slate-100">
                  {activeConv.type === 'community_channel'
                    ? activeConv.name
                    : getOtherParticipant(activeConv).displayName}
                </h3>
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active now • End-to-end simulated session
                </span>
              </div>
            </div>

            <button
              onClick={handleQuickImageSend}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Paperclip className="w-3.5 h-3.5 text-indigo-400" />
              <span>Share Image</span>
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;

              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <img
                      src={msg.sender.avatar}
                      alt={msg.sender.displayName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0 mb-1"
                    />

                    <div
                      className={`rounded-2xl p-3 shadow-md text-xs sm:text-sm space-y-2 ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-slate-800/90 text-slate-200 border border-slate-750 rounded-bl-none'
                      }`}
                    >
                      {!isMe && activeConv.type === 'community_channel' && (
                        <div className="text-[11px] font-bold text-indigo-300 mb-0.5">
                          {msg.sender.displayName}
                        </div>
                      )}

                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                      {/* Attachment if present */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="rounded-xl overflow-hidden cursor-pointer border border-black/20">
                          <img
                            src={msg.attachments[0].url}
                            alt="Attachment"
                            onClick={() => setActiveLightboxMedia({ url: msg.attachments![0].url })}
                            className="max-h-48 w-full object-cover rounded-lg hover:opacity-95 transition-opacity"
                          />
                        </div>
                      )}

                      {/* Timestamp & read receipt */}
                      <div className={`text-[10px] flex items-center gap-1 ${isMe ? 'text-indigo-200 justify-end' : 'text-slate-400'}`}>
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && <CheckCheck className="w-3 h-3 text-indigo-200" />}
                      </div>
                    </div>
                  </div>

                  {/* Message Reactions */}
                  <div className="flex items-center gap-1 mt-1 px-8">
                    {msg.reactions &&
                      msg.reactions.map((r, i) => (
                        <button
                          key={i}
                          onClick={() => reactToMessage(activeConv.id, msg.id, r.emoji)}
                          className="px-2 py-0.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-xs flex items-center gap-1 border border-slate-700/60"
                        >
                          <span>{r.emoji}</span>
                          <span className="text-[10px] text-slate-300 font-semibold">{r.count}</span>
                        </button>
                      ))}

                    {/* Quick emoji add */}
                    <button
                      onClick={() => reactToMessage(activeConv.id, msg.id, '❤️')}
                      className="p-1 rounded-full text-slate-500 hover:text-rose-400 hover:bg-slate-800 text-[10px] opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity"
                      title="Quick Heart"
                    >
                      ❤️
                    </button>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Composer */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            {/* Quick Emoji Toolbar */}
            {showEmojiBar && (
              <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-800">
                {QUICK_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setMessageText((prev) => prev + emoji);
                      setShowEmojiBar(false);
                    }}
                    className="text-base p-1 hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSend} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEmojiBar(!showEmojiBar)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Insert Emoji"
              >
                <Smile className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleQuickImageSend}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Send Image Demo"
              >
                <Image className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message or reaction..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />

              <button
                type="submit"
                disabled={!messageText.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-950/40"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
          <MessageSquare className="w-12 h-12 mb-3 text-slate-600" />
          <h3 className="font-semibold text-slate-300">Select a conversation</h3>
          <p className="text-xs max-w-xs mt-1">
            Choose a direct message or community channel to start chatting.
          </p>
        </div>
      )}
    </div>
  );
}
