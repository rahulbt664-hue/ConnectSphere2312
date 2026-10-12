import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, ZoomIn, Download, Share2 } from 'lucide-react';

export function MediaLightbox() {
  const { activeLightboxMedia, setActiveLightboxMedia, showToast } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveLightboxMedia(null);
    };
    if (activeLightboxMedia) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxMedia, setActiveLightboxMedia]);

  if (!activeLightboxMedia) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
      onClick={() => setActiveLightboxMedia(null)}
    >
      <div className="absolute top-4 right-4 flex items-center gap-3 z-10" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => {
            navigator.clipboard.writeText(activeLightboxMedia.url);
            showToast('Image URL copied to clipboard', 'info');
          }}
          className="p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors"
          title="Copy Link"
        >
          <Share2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => setActiveLightboxMedia(null)}
          className="p-2.5 rounded-full bg-slate-800/80 hover:bg-rose-900/80 text-slate-200 hover:text-white transition-colors"
          title="Close (Esc)"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div
        className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={activeLightboxMedia.url}
          alt={activeLightboxMedia.caption || 'Expanded image'}
          className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-slate-800"
        />
        {activeLightboxMedia.caption && (
          <div className="mt-3 px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-lg text-slate-300 text-sm max-w-xl text-center">
            {activeLightboxMedia.caption}
          </div>
        )}
      </div>
    </div>
  );
}
