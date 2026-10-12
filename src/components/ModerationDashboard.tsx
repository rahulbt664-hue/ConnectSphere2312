import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  XCircle,
  UserX,
  Trash2,
  Clock,
  History,
  Lock,
} from 'lucide-react';

export function ModerationDashboard() {
  const { reports, moderationLogs, resolveReport, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<'pending' | 'audit_log'>('pending');
  const [actionReason, setActionReason] = useState('');

  const pendingReports = reports.filter((r) => r.status === 'pending');

  const handleAction = (
    reportId: string,
    action: 'dismiss' | 'remove_post' | 'ban_user' | 'warn_user'
  ) => {
    resolveReport(reportId, action, actionReason.trim() || `Moderation action taken by ${currentUser.displayName}`);
    setActionReason('');
  };

  return (
    <div className="max-w-4xl mx-auto py-5 px-3 sm:px-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/40 border border-rose-500/30 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Trust & Safety Operations Console</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Platform Moderation Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Logged in as <b className="text-white">{currentUser.displayName}</b> ({currentUser.role}). Review reports, maintain guidelines, and audit safety records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
              <div className="text-lg font-bold text-rose-400">{pendingReports.length}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Pending Queue</div>
            </div>
            <div className="px-4 py-2 bg-slate-950/80 rounded-xl border border-slate-800 text-center">
              <div className="text-lg font-bold text-emerald-400">{moderationLogs.length}</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Audited Actions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'pending'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-950/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Pending Reports ({pendingReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_log')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'audit_log'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Log History ({moderationLogs.length})</span>
        </button>
      </div>

      {/* Tab 1: Pending Reports */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingReports.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-12 text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-200">Moderation Queue is Clean!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No open reports or violations pending review. All recent community content complies with safety policies.
              </p>
            </div>
          ) : (
            pendingReports.map((report) => (
              <div
                key={report.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold uppercase tracking-wider">
                      {report.reason.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400">
                      Reported by <b className="text-slate-200">{report.reporter.displayName}</b>
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(report.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* Target Content */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-slate-400">
                    Target {report.targetType} by {report.targetAuthorName || 'User'} (ID: {report.targetId}):
                  </div>
                  <p className="italic text-slate-200 text-sm">
                    "{report.targetContentPreview || 'No preview provided'}"
                  </p>
                  {report.details && (
                    <div className="pt-2 text-slate-400 border-t border-slate-800/60 mt-2">
                      <b className="text-slate-300">Reporter comment:</b> {report.details}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <button
                    onClick={() => handleAction(report.id, 'dismiss')}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Dismiss (No Violation)</span>
                  </button>

                  <button
                    onClick={() => handleAction(report.id, 'warn_user')}
                    className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Issue Warning</span>
                  </button>

                  {report.targetType === 'post' && (
                    <button
                      onClick={() => handleAction(report.id, 'remove_post')}
                      className="px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Remove Post</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleAction(report.id, 'ban_user')}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-rose-950/50"
                  >
                    <UserX className="w-4 h-4" />
                    <span>Suspend / Ban User</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Audit Log History */}
      {activeTab === 'audit_log' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              <span>Immutable Safety Audit Trail</span>
            </h3>
            <span className="text-xs text-slate-500">{moderationLogs.length} events logged</span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {moderationLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{log.moderatorName}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-semibold text-indigo-300 uppercase">
                      {log.action.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-slate-400">
                    <b className="text-slate-300">Reason:</b> {log.reason}
                  </p>
                  <p className="text-[11px] text-slate-500">Target Resource ID: {log.targetId}</p>
                </div>

                <span className="text-[11px] text-slate-500 shrink-0">
                  {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
