'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { FollowUp } from '@/lib/types';
import { 
  CalendarCheck, 
  Plus, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  Phone, 
  Mail, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  Calendar,
  AlertCircle,
  FileText,
  PhoneCall,
  Share2
} from 'lucide-react';
import { useAdminAuth } from '@/lib/useAdminAuth';

export default function AdminFollowUpsPage() {
  const { user } = useAdminAuth({ requireAuth: true });
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [employeeFilter, setEmployeeFilter] = useState('ALL');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<FollowUp> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchFollowUps = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (employeeFilter !== 'ALL') params.set('employee', employeeFilter);

      const res = await fetch(`/api/admin/follow-ups?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setFollowUps(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, [statusFilter, employeeFilter]);

  const handleOpenAddModal = () => {
    const today = new Date().toISOString().split('T')[0];
    setEditingItem({
      title: '',
      customerName: '',
      companyName: '',
      phone: '',
      email: '',
      followUpDate: today,
      followUpTime: '11:00',
      assignedEmployee: user?.name || 'Sales Desk',
      priority: 'MEDIUM',
      status: 'DUE',
      notes: '',
    });
    setError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (item: FollowUp) => {
    setEditingItem({ ...item });
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem?.title || !editingItem?.customerName || !editingItem?.followUpDate) {
      setError('Title, customer name, and follow-up date are required.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      const res = await fetch('/api/admin/follow-ups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save follow-up');
      }

      setShowModal(false);
      setEditingItem(null);
      fetchFollowUps();
    } catch (err: any) {
      setError(err.message || 'Error saving follow-up');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleComplete = async (item: FollowUp) => {
    try {
      const newStatus = item.status === 'COMPLETED' ? 'DUE' : 'COMPLETED';
      await fetch('/api/admin/follow-ups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, status: newStatus }),
      });
      fetchFollowUps();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this follow-up task?')) return;
    try {
      await fetch(`/api/admin/follow-ups/${id}`, { method: 'DELETE' });
      fetchFollowUps();
    } catch (err) {
      console.error(err);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 font-sans">
      <AdminHeader activeTab="follow-ups" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                SALES CADENCE & TASK SCHEDULER
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
              B2B Follow-ups & Reminders
            </h1>
            <p className="text-xs text-slate-400">
              Ensure 100% quotation follow-through, buyer callback commitments, and order status checks.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Follow-up</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 font-semibold">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="OVERDUE">Overdue (Urgent)</option>
                <option value="DUE">Due Today</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            Showing {followUps.length} follow-up tasks
          </div>
        </div>

        {/* Follow-ups List */}
        <div className="space-y-3">
          {loading ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-xs font-mono">
              Loading follow-up tasks...
            </div>
          ) : followUps.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <CalendarCheck className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-slate-300">No Follow-ups Found</div>
              <p className="text-xs text-slate-500">Schedule calls, quote follow-throughs, or sample confirmations.</p>
              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" /> Schedule Follow-up
              </button>
            </div>
          ) : (
            followUps.map((item) => {
              const isCompleted = item.status === 'COMPLETED';
              const isOverdue = item.status === 'OVERDUE' || (!isCompleted && item.followUpDate < todayStr);
              const isDueToday = !isCompleted && item.followUpDate === todayStr;

              return (
                <div
                  key={item.id}
                  className={`p-4 bg-slate-900 border rounded-2xl transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isCompleted ? 'border-slate-800/60 opacity-60 bg-slate-950' :
                    isOverdue ? 'border-red-500/50 bg-red-950/10' :
                    isDueToday ? 'border-amber-500/50 bg-amber-950/10' :
                    'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => handleToggleComplete(item)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                          : 'border-slate-700 hover:border-amber-500 text-transparent'
                      }`}
                      title={isCompleted ? 'Mark Pending' : 'Mark Completed'}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-sm font-bold ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                          {item.title}
                        </span>

                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          isCompleted ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          isOverdue ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          isDueToday ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        }`}>
                          {isCompleted ? 'COMPLETED' : isOverdue ? 'OVERDUE' : isDueToday ? 'DUE TODAY' : 'UPCOMING'}
                        </span>

                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          item.priority === 'HIGH' ? 'bg-red-500/10 text-red-400 border border-red-500/20 font-bold' :
                          item.priority === 'LOW' ? 'bg-slate-800 text-slate-400' :
                          'bg-amber-500/10 text-amber-400'
                        }`}>
                          {item.priority}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span>Customer: <b className="text-slate-200">{item.customerName}</b> {item.companyName ? `(${item.companyName})` : ''}</span>
                        {item.phone && (
                          <a href={`tel:${item.phone}`} className="flex items-center gap-1 text-sky-400 hover:underline">
                            <Phone className="w-3 h-3" /> {item.phone}
                          </a>
                        )}
                        <span>Due: <b className="text-amber-400">{item.followUpDate}</b> at {item.followUpTime || '11:00'}</span>
                        <span>Assignee: <b className="text-slate-300">{item.assignedEmployee}</b></span>
                      </div>

                      {item.notes && (
                        <p className="text-xs text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800/80 mt-1">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {item.phone && (
                      <a
                        href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${item.customerName}, following up from LTS Bags regarding your bag requirement.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-800/40 rounded-xl text-xs flex items-center gap-1 font-semibold"
                        title="WhatsApp Buyer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </a>
                    )}
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
                      title="Edit Follow-up"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-xl text-xs"
                      title="Delete Task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </main>

      {/* Modal */}
      {showModal && editingItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">
                  {editingItem.id ? 'Edit Follow-up Task' : 'Schedule Sales Follow-up'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Follow-up Task Title *</label>
                <input
                  type="text"
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. Call Rajesh for 5,000 Pcs Laptop Backpack Quote feedback"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Customer / Contact Name *</label>
                  <input
                    type="text"
                    value={editingItem.customerName || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, customerName: e.target.value })}
                    placeholder="Rajesh Sharma"
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Company Name</label>
                  <input
                    type="text"
                    value={editingItem.companyName || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, companyName: e.target.value })}
                    placeholder="Reliance Retail"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={editingItem.phone || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })}
                    placeholder="+91 98110 00000"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={editingItem.email || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, email: e.target.value })}
                    placeholder="buyer@company.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Due Date *</label>
                  <input
                    type="date"
                    value={editingItem.followUpDate || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, followUpDate: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time</label>
                  <input
                    type="time"
                    value={editingItem.followUpTime || '11:00'}
                    onChange={(e) => setEditingItem({ ...editingItem, followUpTime: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={editingItem.priority || 'MEDIUM'}
                    onChange={(e) => setEditingItem({ ...editingItem, priority: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High (Urgent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assigned Sales Executive</label>
                <input
                  type="text"
                  value={editingItem.assignedEmployee || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, assignedEmployee: e.target.value })}
                  placeholder="Sales Representative"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Discussion Points & Notes</label>
                <textarea
                  value={editingItem.notes || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                  rows={3}
                  placeholder="Price negotiation points, sample delivery courier tracking, client specifications..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
