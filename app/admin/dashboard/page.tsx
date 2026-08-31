'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/AdminHeader';
import { 
  Package, 
  Layers, 
  FileText, 
  MessageSquare, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  FileSpreadsheet, 
  CreditCard, 
  Globe, 
  Settings, 
  Users, 
  ShieldCheck, 
  Building2, 
  TrendingUp, 
  AlertCircle, 
  Calendar, 
  CalendarCheck, 
  Factory, 
  PhoneCall, 
  Share2, 
  Filter, 
  RefreshCw, 
  Check, 
  X, 
  Briefcase, 
  IndianRupee, 
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { useAdminAuth } from '@/lib/useAdminAuth';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

type DateFilterOption = 'all' | 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth' | 'custom';

export default function AdminDashboardPage() {
  const { user } = useAdminAuth({ requireAuth: true });
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fetchDashboardStats = async (filter = dateFilter, start = customStart, end = customEnd) => {
    try {
      setRefreshing(true);
      const params = new URLSearchParams();
      params.set('filter', filter);
      if (filter === 'custom' && start && end) {
        params.set('start', start);
        params.set('end', end);
      }
      const res = await fetch(`/api/admin/stats?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [dateFilter]);

  const handleApplyCustomFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (customStart && customEnd) {
      setDateFilter('custom');
      fetchDashboardStats('custom', customStart, customEnd);
    }
  };

  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 font-sans selection:bg-amber-500 selection:text-slate-950">
      <AdminHeader activeTab="dashboard" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Top Header & Date Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                B2B EXECUTIVE CONTROL PANEL
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              LTS BAGS Enterprise Management Dashboard
            </h1>
            <p className="text-xs text-slate-400">
              Real-time B2B metrics, pipeline analytics, RFQ conversion, and manufacturing capacity.
            </p>
          </div>

          {/* Date Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1 shrink-0" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as DateFilterOption)}
                className="bg-transparent text-slate-200 font-semibold focus:outline-none pr-2 py-1 cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-slate-200">All Time Data</option>
                <option value="today" className="bg-slate-900 text-slate-200">Today</option>
                <option value="yesterday" className="bg-slate-900 text-slate-200">Yesterday</option>
                <option value="last7days" className="bg-slate-900 text-slate-200">Last 7 Days</option>
                <option value="last30days" className="bg-slate-900 text-slate-200">Last 30 Days</option>
                <option value="thisMonth" className="bg-slate-900 text-slate-200">This Month</option>
                <option value="lastMonth" className="bg-slate-900 text-slate-200">Last Month</option>
                <option value="custom" className="bg-slate-900 text-slate-200">Custom Date Range...</option>
              </select>
            </div>

            {dateFilter === 'custom' && (
              <form onSubmit={handleApplyCustomFilter} className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs">
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-[11px]"
                  required
                />
                <span className="text-slate-500">to</span>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-[11px]"
                  required
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2 py-1 rounded text-[11px] cursor-pointer"
                >
                  Apply
                </button>
              </form>
            )}

            <button
              onClick={() => fetchDashboardStats()}
              disabled={refreshing}
              className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
              title="Refresh Dashboard Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>
          </div>
        </div>

        {/* Quick Action Shortcuts Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          <Link
            href="/admin/products?action=new"
            className="flex items-center gap-2 p-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 rounded-xl transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-200 group-hover:text-amber-400">Add Product</div>
              <div className="text-[10px] text-slate-400">New bag SKU</div>
            </div>
          </Link>

          <Link
            href="/admin/enquiries"
            className="flex items-center gap-2 p-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/50 rounded-xl transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-200 group-hover:text-sky-400">RFQ Pipeline</div>
              <div className="text-[10px] text-slate-400">Track buyers</div>
            </div>
          </Link>

          <Link
            href="/admin/quotations?action=new"
            className="flex items-center gap-2 p-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-xl transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400">Create Quote</div>
              <div className="text-[10px] text-slate-400">PDF & GST ready</div>
            </div>
          </Link>

          <Link
            href="/admin/customers?action=new"
            className="flex items-center gap-2 p-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 rounded-xl transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-200 group-hover:text-purple-400">Customer CRM</div>
              <div className="text-[10px] text-slate-400">Lead accounts</div>
            </div>
          </Link>

          <Link
            href="/admin/follow-ups?action=new"
            className="flex items-center gap-2 p-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-pink-500/50 rounded-xl transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-200 group-hover:text-pink-400">Log Follow-up</div>
              <div className="text-[10px] text-slate-400">Sales cadence</div>
            </div>
          </Link>

          <Link
            href="/admin/manufacturing"
            className="flex items-center gap-2 p-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 rounded-xl transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Factory className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-200 group-hover:text-amber-400">Factory Specs</div>
              <div className="text-[10px] text-slate-400">Daily capacity</div>
            </div>
          </Link>
        </div>

        {/* Primary KPI Grid (8 Core B2B Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: RFQ Pipeline Activity */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Total B2B Enquiries</span>
              <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{stats?.totalEnquiries ?? 0}</span>
              <span className="text-xs text-sky-300 font-semibold">
                {stats?.newEnquiriesCount ?? 0} new
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
              <span>In Progress: <b className="text-slate-200">{stats?.inProgressEnquiriesCount ?? 0}</b></span>
              <span>Completed: <b className="text-emerald-400">{stats?.completedEnquiriesCount ?? 0}</b></span>
            </div>
          </div>

          {/* Card 2: Quotations & Deal Pipeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Quotation Pipeline</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{stats?.totalQuotations ?? 0}</span>
              <span className="text-xs text-emerald-400 font-bold">
                ₹{Number(stats?.totalQuotationValue ?? 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
              <span>Accepted: <b className="text-emerald-400">{stats?.acceptedQuotations ?? 0}</b></span>
              <span>Win Rate: <b className="text-amber-400">{stats?.quotationConversionRate ?? 0}%</b></span>
            </div>
          </div>

          {/* Card 3: Products Catalog & SKUs */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Active Bag Catalog</span>
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{stats?.totalProducts ?? 0}</span>
              <span className="text-xs text-amber-300 font-semibold">
                {stats?.totalCategories ?? 0} Categories
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
              <span>Published: <b className="text-slate-200">{stats?.publishedProducts ?? 0}</b></span>
              <span>Drafts: <b className="text-slate-400">{stats?.draftProducts ?? 0}</b></span>
            </div>
          </div>

          {/* Card 4: CRM Leads & Urgent Follow-ups */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">CRM & Sales Cadence</span>
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{stats?.totalCustomers ?? 0}</span>
              <span className="text-xs text-purple-300 font-semibold">Accounts</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
              <span>Due Today: <b className="text-amber-400">{stats?.dueFollowUpsCount ?? 0}</b></span>
              <span>Overdue: <b className={stats?.overdueFollowUpsCount > 0 ? 'text-red-400 font-bold' : 'text-slate-400'}>{stats?.overdueFollowUpsCount ?? 0}</b></span>
            </div>
          </div>

        </div>

        {/* Second Metric Row: Manufacturing Health & Capacity */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                <Factory className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  LTS Factory Manufacturing Status
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    OPERATIONAL (3 SHIFTS)
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Primary Unit: B-42 Okhla Phase II, New Delhi • ISO 9001:2015 Certified
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-950/80 border border-slate-800 px-3 py-2 rounded-xl">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Daily Capacity</div>
                <div className="text-base font-bold text-amber-400">{stats?.manufacturingCapacityPerDay ?? 5000} pcs/day</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 px-3 py-2 rounded-xl">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Active Lines</div>
                <div className="text-base font-bold text-sky-400">{stats?.manufacturingActiveLines ?? 8} Assembly Lines</div>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 px-3 py-2 rounded-xl">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Factory Load</div>
                <div className="text-base font-bold text-emerald-400">{stats?.manufacturingUtilizationRate ?? 82}% Loaded</div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart 1: Monthly RFQ Volume & Quotation Value (Area Chart) */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  Monthly RFQ Influx & Quotation Revenue Trend
                </h3>
                <p className="text-[11px] text-slate-400">Total B2B demand volume and quotation values over the past 6 months</p>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full pt-2">
              {stats?.monthlyTrends?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.monthlyTrends}>
                    <defs>
                      <linearGradient id="rfqGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis yAxisId="left" stroke="#64748b" fontSize={11} />
                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(val: any, name: string) => {
                        if (name === 'Quotation Value') return [`₹${Number(val).toLocaleString('en-IN')}`, name];
                        return [val, name];
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Area yAxisId="left" type="monotone" dataKey="rfqs" name="RFQs Received" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#rfqGrad)" />
                    <Area yAxisId="right" type="monotone" dataKey="quotationValue" name="Quotation Value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#valGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                  No historical trend points available for this period.
                </div>
              )}
            </div>
          </div>

          {/* Chart 2: RFQ Pipeline Stage Breakdown (Donut/Pie Chart) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-sky-400" />
                  RFQ Pipeline Stages
                </h3>
                <p className="text-[11px] text-slate-400">Distribution by current workflow status</p>
              </div>
            </div>

            <div className="h-56 w-full flex items-center justify-center">
              {stats?.pipeline?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.pipeline}
                      dataKey="count"
                      nameKey="stage"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                    >
                      {stats.pipeline.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-slate-500 text-xs">No pipeline entries</div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {stats?.pipeline?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-1.5 truncate">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color || PIE_COLORS[idx % PIE_COLORS.length] }} />
                    <span className="text-slate-300 truncate">{item.stage}</span>
                  </div>
                  <span className="font-mono font-bold text-white">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Actionable Two-Column Section: Urgent Follow-ups & Recent High-Value RFQs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Section A: Due & Overdue Follow-ups */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-pink-400" />
                <h3 className="font-bold text-white text-sm">Actionable Follow-ups & Tasks</h3>
              </div>
              <Link href="/admin/follow-ups" className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
                View All ({stats?.totalFollowUps ?? 0}) <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {stats?.dueFollowUps?.length > 0 ? (
                stats.dueFollowUps.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-0.5 min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          item.status === 'OVERDUE' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          item.status === 'DUE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        }`}>
                          {item.status}
                        </span>
                        <span className="font-bold text-slate-200 text-xs truncate">{item.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {item.customerName} {item.companyName ? `(${item.companyName})` : ''} • Rep: {item.assignedEmployee}
                      </div>
                    </div>

                    <Link
                      href={`/admin/follow-ups`}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold shrink-0"
                    >
                      Action
                    </Link>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No urgent follow-up tasks due today. All caught up!
                </div>
              )}
            </div>
          </div>

          {/* Section B: Recent RFQ Inquiries with Pipeline Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-white text-sm">Recent B2B RFQ Inquiries</h3>
              </div>
              <Link href="/admin/enquiries" className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1">
                Full Pipeline <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {stats?.recentRfqs?.length > 0 ? (
                stats.recentRfqs.map((rfq: any) => (
                  <div
                    key={rfq.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="space-y-0.5 min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200 text-xs truncate">{rfq.name}</span>
                        {rfq.company && (
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded truncate">
                            {rfq.company}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {rfq.productRequirement} • Qty: <b className="text-amber-400">{rfq.quantity} pcs</b> • {new Date(rfq.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        rfq.status === 'NEW' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                        rfq.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        rfq.status === 'QUOTED' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {rfq.status}
                      </span>
                      <Link
                        href={`/admin/quotations?action=convert&rfqId=${rfq.id}`}
                        className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold"
                        title="Create Quotation from RFQ"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No RFQs found in the selected date range.
                </div>
              )}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
