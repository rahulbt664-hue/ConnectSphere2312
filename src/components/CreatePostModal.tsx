import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Image, Hash, Users, Sparkles, Send, Trash2, Plus } from 'lucide-react';

const SAMPLE_PHOTO_PRESETS = [
  { url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1000&auto=format&fit=crop&q=80', label: 'Surreal Art' },
  { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80', label: 'Circuit Tech' },
  { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&auto=format&fit=crop&q=80', label: 'Gaming Setup' },
  { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80', label: 'Landscape' },
  { url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1000&auto=format&fit=crop&q=80', label: 'Cyberpunk Neon' },
];

export function CreatePostModal() {
  const { isCreatePostOpen, setIsCreatePostOpen, currentUser, communities, createPost } = useApp();

  const [content, setContent] = useState('');
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  if (!isCreatePostOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaUrls.length === 0) return;

    createPost({
      content: content.trim(),
      mediaUrls: mediaUrls.length > 0 ? mediaUrls : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      communityId: selectedCommunityId || undefined,
    });

    // reset
    setContent('');
    setMediaUrls([]);
    setSelectedTags([]);
    setSelectedCommunityId('');
    setIsCreatePostOpen(false);
  };

  const handleAddPreset = (url: string) => {
    if (mediaUrls.length >= 4) return;
    if (!mediaUrls.includes(url)) {
      setMediaUrls([...mediaUrls, url]);
    }
  };

  const handleAddCustomImage = () => {
    if (!customImageUrl.trim()) return;
    if (mediaUrls.length < 4 && !mediaUrls.includes(customImageUrl.trim())) {
      setMediaUrls([...mediaUrls, customImageUrl.trim()]);
    }
    setCustomImageUrl('');
    setShowImageInput(false);
  };

  const handleRemoveMedia = (index: number) => {
    setMediaUrls(mediaUrls.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    const clean = newTagInput.trim().replace(/^#/, '');
    if (clean && !selectedTags.includes(clean)) {
      setSelectedTags([...selectedTags, clean]);
      setNewTagInput('');
    }
  };

  const POPULAR_TAGS = ['Design', 'Engineering', 'Photography', 'Gaming', 'Web3', 'SoundDesign', 'CreativeCoding'];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              className="w-9 h-9 rounded-full object-cover border border-slate-700"
            />
            <div>
              <div className="text-sm font-semibold text-slate-100">{currentUser.displayName}</div>
              <div className="text-xs text-slate-400">@{currentUser.handle}</div>
            </div>
          </div>
          <button
            onClick={() => setIsCreatePostOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Target Destination: Personal Feed vs. Community */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedCommunityId}
              onChange={(e) => setSelectedCommunityId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="">Post to Personal Feed (Public)</option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  Post to c/{c.slug} ({c.name})
                </option>
              ))}
            </select>
          </div>

          {/* Text Area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share an insight, showcase a visual project, or start a community debate..."
            rows={4}
            className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 resize-none leading-relaxed"
            autoFocus
          />

          {/* Attached Media Previews */}
          {mediaUrls.length > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Attached Media ({mediaUrls.length}/4)</span>
              </div>
              <div className={`grid gap-2 ${mediaUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {mediaUrls.map((url, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-800 aspect-video">
                    <img src={url} alt={`upload-${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(i)}
                      className="absolute top-2 right-2 p-1.5 bg-slate-950/80 hover:bg-rose-600 rounded-lg text-white transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preset Photo Suggestions or Custom URL */}
          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5 text-indigo-400" /> Attach High-Res Image
              </span>
              <button
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                className="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {showImageInput ? 'Cancel URL' : '+ Custom URL'}
              </button>
            </div>

            {showImageInput ? (
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="Paste image URL (https://...)"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomImage}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white"
                >
                  Add
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {SAMPLE_PHOTO_PRESETS.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAddPreset(preset.url)}
                    className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/60 text-xs text-slate-300 transition-colors"
                  >
                    <Plus className="w-3 h-3 text-indigo-400" />
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 font-semibold">
                <Hash className="w-3.5 h-3.5 text-indigo-400" /> Tags
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
                    className="hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Add tag..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300 w-24 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-500">
              <span>Suggestions:</span>
              {POPULAR_TAGS.slice(0, 5).map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => {
                    if (!selectedTags.includes(sug)) setSelectedTags([...selectedTags, sug]);
                  }}
                  className="hover:text-indigo-400 text-slate-400"
                >
                  #{sug}
                </button>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80 shrink-0">
            <button
              type="button"
              onClick={() => setIsCreatePostOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim() && mediaUrls.length === 0}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white transition-colors shadow-lg shadow-indigo-950/50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
