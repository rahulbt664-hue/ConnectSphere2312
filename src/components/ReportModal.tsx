import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, X, AlertTriangle, Send } from 'lucide-react';
import { ReportItem } from '../types';

export function ReportModal() {
  const { reportingTarget, setReportingTarget, submitReport } = useApp();
  const [reason, setReason] = useState<ReportItem['reason']>('spam');
  const [details, setDetails] = useState('');

  if (!reportingTarget) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport({
      targetType: reportingTarget.targetType,
      targetId: reportingTarget.targetId,
      targetAuthorName: reportingTarget.targetAuthorName,
      targetContentPreview: reportingTarget.targetContentPreview,
      reason,
      details: details.trim() || undefined,
    });
  };

  const REASON_OPTIONS: { id: ReportItem['reason']; label: string; desc: string }[] = [
    { id: 'spam', label: 'Spam or Commercial Bot', desc: 'Repetitive advertising, affiliate links, or phishing attempts' },
    { id: 'harassment', label: 'Harassment & Bullying', desc: 'Targeted hostility, threats, or personal intimidation' },
    { id: 'hate_speech', label: 'Hate Speech & Discrimination', desc: 'Attacking protected identity characteristics' },
    { id: 'inappropriate', label: 'Inappropriate or NSFW Content', desc: 'Explicit sexual or excessively graphic media without warning' },
    { id: 'misinformation', label: 'Harmful Misinformation', desc: 'Conspiratorial, fabricated, or demonstrably false claims' },
    { id: 'other', label: 'Other Community Guideline Violation', desc: 'Breaks local community rules or general safety standards' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-semibold text-slate-100 text-lg">Report Content</h3>
          </div>
          <button
            onClick={() => setReportingTarget(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {reportingTarget.targetContentPreview && (
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400">
              <span className="font-semibold text-slate-300 block mb-1">
                Reported {reportingTarget.targetType} by {reportingTarget.targetAuthorName || 'User'}:
              </span>
              <p className="italic line-clamp-2">"{reportingTarget.targetContentPreview}"</p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Primary Reason
            </label>
            <div className="space-y-2">
              {REASON_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                    reason === opt.id
                      ? 'border-rose-500/50 bg-rose-500/10 text-slate-100'
                      : 'border-slate-800/80 bg-slate-950/40 hover:bg-slate-800/50 text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="report_reason"
                    value={opt.id}
                    checked={reason === opt.id}
                    onChange={() => setReason(opt.id)}
                    className="mt-1 text-rose-500 focus:ring-rose-500 bg-slate-900 border-slate-700"
                  />
                  <div>
                    <div className="text-sm font-medium">{opt.label}</div>
                    <div className="text-xs text-slate-400">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Additional Context (Optional)
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide extra details for the moderation review team..."
              rows={3}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500/60 focus:ring-1 focus:ring-rose-500/40 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setReportingTarget(null)}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors shadow-lg shadow-rose-950/50"
            >
              <Send className="w-4 h-4" />
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
