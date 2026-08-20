'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { AuditLog } from '@/lib/types';
import { 
  History, 
  Search, 
  Filter, 
  ShieldCheck, 
  Clock, 
  RefreshCw, 
  User, 
  Layers, 
  Tag, 
  Activity
} from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState<string>('ALL');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/audit-logs?limit=250');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch('/api/admin/audit-logs')
      .then(async (res) => {
        if (res.ok && active) {
          const data = await res.json();
          setLogs(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const resources = Array.from(new Set(logs.map((l) => l.resource).filter(Boolean)));

  const filteredLogs = logs.filter((log) => {
    const s = searchTerm.toLowerCase();
    const matchesSearch = 
      log.action.toLowerCase().includes(s) ||
      log.userName.toLowerCase().includes(s) ||
      log.userEmail.toLowerCase().includes(s) ||
      (log.resource && log.resource.toLowerCase().includes(s)) ||
      (log.details && JSON.stringify(log.details).toLowerCase().includes(s));
    const matchesResource = selectedResource === 'ALL' || log.resource === selectedResource;
    return matchesSearch && matchesResource;
  });

  const getActionColor = (action: string) => {
    if (action.includes('CREATE')) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    if (action.includes('DELETE')) return 'bg-red-500/20 text-red-300 border-red-500/30';
    if (action.includes('UPDATE')) return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
    if (action.includes('LOGIN')) return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    if (action.includes('BACKUP') || action.includes('RESTORE')) return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AdminHeader activeTab="audit-logs" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
                <History className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-white font-serif">Security & System Audit Logs</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Immutable activity trail tracking staff logins, product edits, enquiry status changes, and schema updates.
            </p>
          </div>

          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2 rounded-xl transition-all border border-slate-700 text-xs shrink-0 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Activity</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by action, admin name, IP address, or JSON details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 outline-none"
            />
          </div>

          <div className="relative">
            <select
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value="ALL">All Event Resources ({logs.length})</option>
              {resources.map((res) => (
                <option key={res} value={res}>
                  {res} ({logs.filter((l) => l.resource === res).length})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading security logs...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-400 space-y-3">
            <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-base font-semibold text-slate-300">No activity logs found</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800 uppercase">
                  <tr>
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4">Action Event</th>
                    <th className="py-3.5 px-4">Admin Operator</th>
                    <th className="py-3.5 px-4">Resource Target</th>
                    <th className="py-3.5 px-4">Details / Metadata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{new Date(log.createdAt).toLocaleDateString('en-IN')}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 pl-5">
                          {new Date(log.createdAt).toLocaleTimeString('en-IN')}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-xs">{log.userName}</div>
                        <div className="text-[10px] text-slate-400">{log.userEmail}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-amber-400 font-bold">{log.resource}</span>
                        {log.resourceId && (
                          <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                            ID: {log.resourceId}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-300 max-w-xs">
                        {log.details ? (
                          <pre className="text-[10px] bg-slate-950 p-1.5 rounded border border-slate-800 overflow-x-auto text-slate-300 max-h-16">
                            {JSON.stringify(log.details, null, 1)}
                          </pre>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
