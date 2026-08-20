'use client';

import React, { useState, useEffect } from 'react';
import AdminHeader from '@/components/AdminHeader';
import { AdminUser } from '@/lib/types';
import { 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  KeyRound, 
  Save, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Lock,
  Mail,
  UserCheck
} from 'lucide-react';
import { useAdminAuth } from '@/lib/useAdminAuth';

export default function AdminUsersPage() {
  const { user: currentAdmin } = useAdminAuth({ requireAuth: true, requiredRole: 'SUPER_ADMIN' });
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<AdminUser> & { password?: string }>({
    name: '',
    email: '',
    role: 'CONTENT_MANAGER',
    isActive: true,
    password: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to load admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    fetch('/api/admin/users')
      .then(async (res) => {
        if (res.ok && active) {
          const data = await res.json();
          setUsers(data);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser.name || !currentUser.email || !currentUser.role) {
      setMessage({ type: 'error', text: 'Name, email, and role are required.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const isUpdate = !!currentUser.id;
      const url = isUpdate ? `/api/admin/users/${currentUser.id}` : '/api/admin/users';
      const method = isUpdate ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentUser),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save admin user');
      }

      setMessage({ type: 'success', text: `Admin user ${isUpdate ? 'updated' : 'created'} successfully!` });
      setIsEditing(false);
      setCurrentUser({ name: '', email: '', role: 'CONTENT_MANAGER', isActive: true, password: '' });
      fetchUsers();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Save error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, userEmail: string) => {
    if (id === currentAdmin?.id) {
      alert('You cannot delete your own active account.');
      return;
    }
    if (!confirm(`Are you sure you want to delete user account "${userEmail}"?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'User deleted successfully' });
        fetchUsers();
      } else {
        throw new Error(data.error || 'Failed to delete user');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  const getRoleBadge = (role: AdminUser['role']) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">SUPER ADMIN</span>;
      case 'CONTENT_MANAGER':
        return <span className="bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">CONTENT MANAGER</span>;
      case 'SALES_MANAGER':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">SALES LEAD</span>;
      case 'SEO_SPECIALIST':
        return <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono px-2 py-0.5 rounded font-bold">SEO SPECIALIST</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono px-2 py-0.5 rounded font-bold">STAFF</span>;
    }
  };

  const filtered = users.filter((u) => {
    const s = searchTerm.toLowerCase();
    return u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || u.role.toLowerCase().includes(s);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <AdminHeader activeTab="users" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
                <Users className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-white font-serif">Staff User Accounts & Roles (RBAC)</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Configure access roles, permissions, passwords, and active states for factory administrators.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentUser({
                name: '',
                email: '',
                role: 'CONTENT_MANAGER',
                isActive: true,
                password: '',
              });
              setIsEditing(true);
            }}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 text-xs shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Admin User</span>
          </button>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center justify-between gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{message.text}</span>
            </div>
            <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search */}
        <div className="relative bg-slate-900/80 p-3 rounded-xl border border-slate-800">
          <Search className="w-4 h-4 text-slate-500 absolute left-6 top-5" />
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading user directory...
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono text-[11px] border-b border-slate-800 uppercase">
                  <tr>
                    <th className="py-3.5 px-4">User Name & Email</th>
                    <th className="py-3.5 px-4">Role & Scope</th>
                    <th className="py-3.5 px-4">Account Status</th>
                    <th className="py-3.5 px-4">Last Login</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{u.name}</div>
                        <div className="text-slate-400 font-mono text-[11px] flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span>{u.email}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {getRoleBadge(u.role)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          u.isActive
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {u.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleString('en-IN') : 'Never'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setCurrentUser({
                                ...u,
                                password: '',
                              });
                              setIsEditing(true);
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                            title="Edit User & Reset Password"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {u.email !== 'admin@ltsbags.com' && u.id !== currentAdmin?.id && (
                            <button
                              onClick={() => handleDelete(u.id, u.email)}
                              className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-100 rounded-lg transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Edit / Create User Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-white text-base">
                  {currentUser.id ? 'Edit Staff Account' : 'Create New Staff Account'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={currentUser.name || ''}
                  onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                  placeholder="e.g., Ananya Deshmukh"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address (Login ID) *</label>
                <input
                  type="email"
                  required
                  value={currentUser.email || ''}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  placeholder="e.g., content.manager@ltsbags.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Role / Permissions *</label>
                  <select
                    value={currentUser.role || 'CONTENT_MANAGER'}
                    onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="SUPER_ADMIN">SUPER_ADMIN (Full Access)</option>
                    <option value="CONTENT_MANAGER">CONTENT_MANAGER (Catalog/Blog)</option>
                    <option value="SALES_MANAGER">SALES_MANAGER (Enquiries/Quotes)</option>
                    <option value="SEO_SPECIALIST">SEO_SPECIALIST (SEO & Meta)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Account State</label>
                  <select
                    value={currentUser.isActive ? 'ACTIVE' : 'INACTIVE'}
                    onChange={(e) => setCurrentUser({ ...currentUser, isActive: e.target.value === 'ACTIVE' })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="ACTIVE">Active (Allowed to sign in)</option>
                    <option value="INACTIVE">Suspended / Deactivated</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {currentUser.id ? 'Set New Password (leave blank to keep current)' : 'Initial Password (min 8 chars) *'}
                </label>
                <input
                  type="password"
                  required={!currentUser.id}
                  minLength={8}
                  value={currentUser.password || ''}
                  onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                  placeholder={currentUser.id ? '••••••••' : 'Enter strong password (min 8 chars)'}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save User Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
