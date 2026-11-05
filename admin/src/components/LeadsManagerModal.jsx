import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Search,
  MessageCircle,
  Phone,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  Filter,
  RefreshCw,
  Download,
  Trash2,
  Edit3,
  User,
  Tag,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Sliders,
  Store,
  Megaphone,
  Building2,
  Send,
} from 'lucide-react';
import { getLeads, updateLead, deleteLead } from '../utils/api';

export function OriginalWhatsAppIcon({ className = "w-4 h-4", size = 16 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.04 4.5C7.88 4.5 4.5 7.88 4.5 12.04c0 1.33.35 2.62 1.01 3.76L4.5 19.5l3.8-1c1.1.6 2.34.92 3.74.92 4.16 0 7.54-3.38 7.54-7.54 0-2.02-.79-3.91-2.21-5.33A7.48 7.48 0 0 0 12.04 4.5zm4.41 10.37c-.18.51-.71.93-1.2.99-.32.05-.74.1-2.16-.49-1.81-.75-2.98-2.58-3.07-2.7-.09-.12-.73-.97-.73-1.84 0-.87.45-1.3.62-1.48.18-.19.39-.23.51-.23.13 0 .25 0 .36.01.14.01.25-.02.36.24.12.3.42 1.03.46 1.11.04.08.07.17.01.28-.06.11-.1.17-.18.26-.08.09-.16.16-.23.25-.08.09-.17.18-.08.35.1.17.44.73.95 1.18.65.58 1.19.78 1.37.86.18.08.28.07.39-.05.11-.12.45-.53.58-.7.12-.17.25-.15.41-.09.17.06 1.08.51 1.27.6.18.09.31.14.35.22.05.08.05.48-.14.99z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

const STATUS_COLORS = {
  New: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
  Contacted: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  'Showroom Visit Scheduled': 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  Converted: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  Archived: 'bg-slate-700/40 text-slate-400 border-slate-600/40',
};

/**
 * Classifies lead into 'retailer', 'support', or 'inquiry'
 */
export const getLeadCategory = (lead) => {
  if (lead?.leadType === 'retailer' || lead?.category === 'retailer') return 'retailer';
  if (lead?.leadType === 'support' || lead?.category === 'support') return 'support';
  const inq = (lead?.inquiryType || '').toLowerCase();
  const src = (lead?.source || '').toLowerCase();
  const msg = (lead?.message || '').toLowerCase();
  if (inq.includes('retailer') || src.includes('retailer') || msg.includes('[retailer')) return 'retailer';
  if (inq.includes('support') || inq.includes('advertising') || src.includes('support') || msg.includes('[advertising')) return 'support';
  return 'inquiry';
};

export default function LeadsManagerModal({ isOpen, onClose, showToast, onOpenFormEditor }) {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedShowroom, setSelectedShowroom] = useState('ALL');
  const [activeNotesId, setActiveNotesId] = useState(null);
  const [editingNotes, setEditingNotes] = useState('');

  // Fetch leads
  const fetchAllLeads = async () => {
    try {
      setIsLoading(true);
      const data = await getLeads();
      setLeads(data || []);
    } catch (err) {
      console.error('Failed to load leads:', err);
      showToast && showToast({ type: 'error', title: 'Error', message: 'Could not load leads' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAllLeads();
    }
  }, [isOpen]);

  // Listen for real-time leads from customer storefront
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;
    const channel = new BroadcastChannel('fossil_store_realtime_sync');
    channel.onmessage = (event) => {
      if (event.data?.type === 'NEW_LEAD' && event.data.lead) {
        setLeads((prev) => [event.data.lead, ...prev]);
        const cat = getLeadCategory(event.data.lead);
        const catTitle =
          cat === 'retailer'
            ? 'New Retailer Application!'
            : cat === 'support'
            ? 'New Advertising & Support Request!'
            : 'New Customer Lead!';
        showToast &&
          showToast({
            type: 'info',
            title: catTitle,
            message: `${event.data.lead.name} submitted: ${event.data.lead.storeLocation || 'Showroom Inquiry'}`,
          });
      }
    };
    return () => channel.close();
  }, [showToast]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { ALL: leads.length, retailer: 0, support: 0, inquiry: 0 };
    leads.forEach((l) => {
      const cat = getLeadCategory(l);
      if (counts[cat] !== undefined) counts[cat]++;
      else counts.inquiry++;
    });
    return counts;
  }, [leads]);

  // Status statistics
  const stats = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === 'New').length;
    const contactedCount = leads.filter((l) => l.status === 'Contacted').length;
    const scheduledCount = leads.filter((l) => l.status === 'Showroom Visit Scheduled').length;
    const convertedCount = leads.filter((l) => l.status === 'Converted').length;
    return { total, newCount, contactedCount, scheduledCount, convertedCount };
  }, [leads]);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (selectedCategory !== 'ALL' && getLeadCategory(lead) !== selectedCategory) {
        return false;
      }

      if (selectedStatus !== 'ALL' && lead.status !== selectedStatus) return false;

      if (selectedShowroom !== 'ALL') {
        const sr = selectedShowroom.toLowerCase();
        if (!lead.storeLocation?.toLowerCase().includes(sr)) return false;
      }

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      const customMatch =
        lead.customFields &&
        Object.entries(lead.customFields).some(
          ([k, v]) => k.toLowerCase().includes(q) || String(v).toLowerCase().includes(q)
        );

      return (
        lead.name?.toLowerCase().includes(q) ||
        lead.phone?.toLowerCase().includes(q) ||
        lead.storeLocation?.toLowerCase().includes(q) ||
        lead.inquiryType?.toLowerCase().includes(q) ||
        lead.message?.toLowerCase().includes(q) ||
        lead.adminNotes?.toLowerCase().includes(q) ||
        customMatch
      );
    });
  }, [leads, selectedCategory, selectedStatus, selectedShowroom, searchQuery]);

  // Handle status update
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await updateLead(leadId, { status: newStatus });
      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? { ...l, status: newStatus } : l))
      );
      showToast &&
        showToast({
          type: 'success',
          title: 'Status Updated',
          message: `Lead updated to "${newStatus}"`,
        });
    } catch (err) {
      console.error(err);
      showToast && showToast({ type: 'error', title: 'Update Failed', message: err.message });
    }
  };

  // Handle saving admin private notes
  const handleSaveNotes = async (leadId) => {
    try {
      await updateLead(leadId, { adminNotes: editingNotes });
      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? { ...l, adminNotes: editingNotes } : l))
      );
      setActiveNotesId(null);
      showToast &&
        showToast({
          type: 'success',
          title: 'Notes Saved',
          message: 'Agency private note saved.',
        });
    } catch (err) {
      console.error(err);
      showToast && showToast({ type: 'error', title: 'Error', message: 'Failed to save notes' });
    }
  };

  // Handle delete lead
  const handleDeleteLead = async (leadId, name) => {
    if (!window.confirm(`Are you sure you want to delete lead from ${name || 'this customer'}?`)) {
      return;
    }
    try {
      await deleteLead(leadId);
      setLeads((prev) => prev.filter((l) => l._id !== leadId));
      showToast &&
        showToast({
          type: 'info',
          title: 'Lead Deleted',
          message: `Removed inquiry for ${name}`,
        });
    } catch (err) {
      console.error(err);
      showToast && showToast({ type: 'error', title: 'Error', message: 'Failed to delete' });
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = [
      'Date',
      'Category',
      'Name',
      'Phone',
      'Email',
      'Showroom / Business',
      'Inquiry Type',
      'Message / Details',
      'Status',
      'Staff Notes',
    ];
    const rows = leads.map((l) => {
      const cat = getLeadCategory(l);
      const catLabel =
        cat === 'retailer'
          ? 'Retailer Application'
          : cat === 'support'
          ? 'Advertising & Support'
          : 'Customer Watch Inquiry';
      return [
        `"${new Date(l.createdAt || Date.now()).toLocaleString('en-IN')}"`,
        `"${catLabel}"`,
        `"${(l.name || '').replace(/"/g, '""')}"`,
        `"${(l.phone || '').replace(/"/g, '""')}"`,
        `"${(l.email || '').replace(/"/g, '""')}"`,
        `"${(l.storeLocation || '').replace(/"/g, '""')}"`,
        `"${(l.inquiryType || '').replace(/"/g, '""')}"`,
        `"${(l.message || '').replace(/"/g, '""')}"`,
        `"${l.status || 'New'}"`,
        `"${(l.adminNotes || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `RPA_Customer_Leads_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-[#141416] border border-brass-600/40 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-[#1B1B1E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brass-500 to-amber-700 flex items-center justify-center text-charcoal-950 font-bold shadow-md">
              <Sparkles className="w-5 h-5 text-charcoal-950" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                  Agency Inquiries, Retailer & Support Leads Desk
                </h2>
                {stats.newCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 animate-pulse">
                    ● {stats.newCount} New
                  </span>
                )}
              </div>
              <p className="text-xs text-cream-300">
                Track customer watch inquiries, authorized retailer partnership applications & showroom support requests
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenFormEditor && (
              <button
                onClick={() => {
                  onClose();
                  onOpenFormEditor();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-brass-600 hover:bg-brass-500 shadow-md transition-all"
                title="Customize storefront form labels, options, and add new input fields"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Configure Form & Inputs</span>
              </button>
            )}

            <button
              onClick={handleExportCSV}
              disabled={leads.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-cream-200 bg-[#242428] hover:bg-[#2F2F35] border border-white/10 transition-all disabled:opacity-40"
              title="Download customer leads as CSV for spreadsheet or CRM"
            >
              <Download className="w-3.5 h-3.5 text-brass-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={fetchAllLeads}
              className="p-2 text-cream-300 hover:text-white rounded-xl bg-[#242428] hover:bg-[#2F2F35] border border-white/10 transition-all"
              title="Refresh leads list"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brass-400' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-cream-400 hover:text-white rounded-xl bg-[#242428] hover:bg-rose-500/20 hover:text-rose-300 border border-white/10 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lead Category Filter Strip (Separate Lead Categorization) */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#0F0F11] border-b border-white/10 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cream-500 mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3 text-brass-400" />
              <span>Lead Category:</span>
            </span>

            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                selectedCategory === 'ALL'
                  ? 'bg-brass-600 text-white shadow-sm ring-1 ring-brass-400/50'
                  : 'text-cream-300 hover:text-white bg-white/5 hover:bg-white/10'
              }`}
            >
              <span>All Leads</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 font-mono">
                {categoryCounts.ALL}
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('retailer')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                selectedCategory === 'retailer'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm ring-1 ring-amber-400/50'
                  : 'text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Retailer Applications</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
                {categoryCounts.retailer}
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('support')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                selectedCategory === 'support'
                  ? 'bg-sky-500 text-slate-950 font-black shadow-sm ring-1 ring-sky-400/50'
                  : 'text-sky-400 hover:text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Advertising & Support</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
                {categoryCounts.support}
              </span>
            </button>

            <button
              onClick={() => setSelectedCategory('inquiry')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                selectedCategory === 'inquiry'
                  ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/50'
                  : 'text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Watch Inquiries</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
                {categoryCounts.inquiry}
              </span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="px-4 sm:px-6 py-3 bg-[#111113] border-b border-white/5 flex items-center gap-2 sm:gap-4 overflow-x-auto text-xs scrollbar-none">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-cream-300 shrink-0">
            <span className="text-cream-400">Total Filtered:</span>
            <strong className="text-white font-bold">{filteredLeads.length}</strong>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
            <span>New:</span>
            <strong className="font-bold">{stats.newCount}</strong>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 shrink-0">
            <span>Contacted:</span>
            <strong className="font-bold">{stats.contactedCount}</strong>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 shrink-0">
            <span>Visit Scheduled:</span>
            <strong className="font-bold">{stats.scheduledCount}</strong>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 shrink-0">
            <span>Converted / Sold:</span>
            <strong className="font-bold">{stats.convertedCount}</strong>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:px-6 py-3 border-b border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#18181B]">
          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-cream-400" />
            <input
              type="text"
              placeholder="Search by name, phone, store, brand focus, GSTIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#101012] border border-white/15 focus:border-brass-400 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-cream-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2 text-xs text-cream-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Showroom Destination Filter */}
            <div className="flex items-center gap-1.5 bg-[#222225] border border-white/10 rounded-xl px-2.5 py-1">
              <Store className="w-3.5 h-3.5 text-brass-400 shrink-0" />
              <select
                value={selectedShowroom}
                onChange={(e) => setSelectedShowroom(e.target.value)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer pr-1"
                title="Filter leads by showroom location"
              >
                <option value="ALL" className="bg-[#18181B]">All Locations</option>
                <option value="Baldev Plaza" className="bg-[#18181B]">Baldev Plaza Flagship</option>
                <option value="JalKal" className="bg-[#18181B]">Shop No. 1, JalKal Building</option>
              </select>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {['ALL', 'New', 'Contacted', 'Showroom Visit Scheduled', 'Converted', 'Archived'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    selectedStatus === status
                      ? 'bg-brass-500 text-charcoal-950 shadow-md font-extrabold'
                      : 'bg-[#222225] text-cream-400 hover:text-white hover:bg-[#2b2b30] border border-white/5'
                  }`}
                >
                  {status === 'ALL' ? 'All Statuses' : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Leads Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#121214]">
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-brass-400 animate-spin mx-auto" />
              <p className="text-xs text-cream-400">Loading incoming agency inquiries & applications...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="py-20 text-center space-y-3 bg-[#18181A] rounded-2xl border border-white/5">
              <div className="w-12 h-12 rounded-full bg-brass-500/10 text-brass-400 flex items-center justify-center mx-auto border border-brass-500/20">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-white">No Leads Found</h3>
              <p className="text-xs text-cream-400 max-w-sm mx-auto">
                {searchQuery || selectedStatus !== 'ALL' || selectedCategory !== 'ALL'
                  ? 'No leads match your current filter or search criteria. Try clearing or expanding your selection.'
                  : 'All caught up! When a customer or business submits a form on the storefront, it will instantly appear here.'}
              </p>
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const cat = getLeadCategory(lead);
              const isRetailer = cat === 'retailer';
              const isSupport = cat === 'support';
              const isInquiry = cat === 'inquiry';

              const cleanPhone = String(lead.phone || '').replace(/[^0-9]/g, '');
              let waDialNumber = cleanPhone;
              if (cleanPhone.length === 10) {
                waDialNumber = `91${cleanPhone}`;
              } else if (cleanPhone.startsWith('0')) {
                waDialNumber = `91${cleanPhone.slice(1)}`;
              }

              let waText = '';
              let waBtnLabel = 'WhatsApp Customer';

              if (isRetailer) {
                const storeName =
                  lead.customFields?.storeName || lead.storeLocation || 'Your Showroom';
                waText = `Hello ${lead.name || 'Partner'}, thank you for submitting your Retailer Partnership Application with Ram Prasad Agencies for "${storeName}". We have received your wholesale application and would like to connect regarding terms and allocations.`;
                waBtnLabel = 'WhatsApp Retailer';
              } else if (isSupport) {
                const showroomName =
                  lead.customFields?.showroomName || lead.storeLocation || 'Your Showroom';
                const supportType =
                  lead.customFields?.supportType || lead.inquiryType || 'Marketing Support';
                waText = `Hello ${lead.name || 'Representative'}, thank you for your Advertising & Sales Support request with Ram Prasad Agencies for "${showroomName}". Regarding your requirement for "${supportType}", our dealer marketing desk is ready to assist you.`;
                waBtnLabel = 'WhatsApp Showroom';
              } else {
                waText = `Hello ${lead.name || 'Valued Customer'}, thank you for contacting Ram Prasad Agencies regarding your inquiry on "${lead.inquiryType || 'Luxury Timepieces'}" at our ${lead.storeLocation || 'Golghar'} showroom. We are pleased to assist you with current availability, pricing, and scheduling your in-store viewing.`;
                waBtnLabel = 'WhatsApp Customer';
              }

              const waUrl = `https://wa.me/${waDialNumber}?text=${encodeURIComponent(waText)}`;
              const isEditingNotes = activeNotesId === lead._id;

              return (
                <div
                  key={lead._id}
                  className={`p-4 sm:p-5 rounded-2xl bg-[#1A1A1D] transition-all shadow-md space-y-3.5 border ${
                    isRetailer
                      ? 'border-amber-500/35 hover:border-amber-500/70 ring-1 ring-amber-500/10'
                      : isSupport
                      ? 'border-sky-500/35 hover:border-sky-500/70 ring-1 ring-sky-500/10'
                      : 'border-white/10 hover:border-brass-600/50'
                  }`}
                >
                  {/* Card Header Row: Customer Name, Phone, Category Badge, Status & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                          isRetailer
                            ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                            : isSupport
                            ? 'bg-sky-500/15 border-sky-500/30 text-sky-300'
                            : 'bg-brass-500/15 border-brass-600/30 text-brass-300'
                        }`}
                      >
                        {isRetailer ? (
                          <Store className="w-5 h-5 text-amber-400" />
                        ) : isSupport ? (
                          <Megaphone className="w-5 h-5 text-sky-400" />
                        ) : lead.name ? (
                          lead.name.charAt(0).toUpperCase()
                        ) : (
                          'C'
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-serif text-sm sm:text-base font-bold text-white">
                            {lead.name}
                          </h4>

                          {/* Category Badge */}
                          {isRetailer && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs">
                              <Store className="w-3 h-3 text-amber-400" />
                              <span>Retailer Application</span>
                            </span>
                          )}
                          {isSupport && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-xs">
                              <Megaphone className="w-3 h-3 text-sky-400" />
                              <span>Advertising & Support</span>
                            </span>
                          )}
                          {isInquiry && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs">
                              <Clock className="w-3 h-3 text-emerald-400" />
                              <span>Watch Inquiry</span>
                            </span>
                          )}

                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                              STATUS_COLORS[lead.status] || STATUS_COLORS.New
                            }`}
                          >
                            {lead.status || 'New'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-cream-400 font-mono mt-0.5 flex-wrap">
                          <span className="flex items-center gap-1 text-white font-semibold">
                            <Phone className="w-3 h-3 text-brass-400" />
                            {lead.phone}
                          </span>
                          {lead.email && <span className="text-cream-400">({lead.email})</span>}
                          <span className="text-[10px] text-cream-500 flex items-center gap-1 font-sans">
                            <Clock className="w-3 h-3 text-cream-500" />
                            {new Date(lead.createdAt || Date.now()).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick 1-Click Agency WhatsApp & Call Buttons */}
                    <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba59] shadow-md shadow-[#25D366]/20 transition-all active:scale-95 border border-white/10"
                        title="Open WhatsApp chat with tailored reply"
                      >
                        <OriginalWhatsAppIcon className="w-3.5 h-3.5 shrink-0" size={15} />
                        <span>{waBtnLabel}</span>
                      </a>

                      <a
                        href={`tel:${cleanPhone}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#29292E] hover:bg-[#34343B] text-cream-200 border border-white/10 transition-all"
                        title="Call contact directly"
                      >
                        <Phone className="w-3.5 h-3.5 text-brass-400" />
                        <span>Call</span>
                      </a>

                      {/* Status Selector */}
                      <select
                        value={lead.status || 'New'}
                        onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                        className="bg-[#242428] border border-white/15 focus:border-brass-400 text-xs text-white rounded-xl px-2.5 py-1.5 focus:outline-none cursor-pointer"
                        title="Update lead progress"
                      >
                        <option value="New">Status: New</option>
                        <option value="Contacted">Status: Contacted</option>
                        <option value="Showroom Visit Scheduled">Status: Visit Scheduled</option>
                        <option value="Converted">Status: Converted</option>
                        <option value="Archived">Status: Archived</option>
                      </select>

                      <button
                        onClick={() => handleDeleteLead(lead._id, lead.name)}
                        className="p-1.5 text-cream-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Inquiry Details Grid */}
                  <div className="p-3.5 rounded-xl bg-[#111113] border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-cream-500 tracking-wider block">
                        {isRetailer
                          ? 'Business / Showroom Location'
                          : isSupport
                          ? 'Showroom & Location'
                          : 'Preferred Showroom'}
                      </span>
                      <p className="text-white font-medium flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-brass-400 shrink-0" />
                        <span>{lead.storeLocation || 'Baldev Plaza & JalKal Building'}</span>
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-cream-500 tracking-wider block">
                        {isRetailer
                          ? 'Application Format'
                          : isSupport
                          ? 'Support Category'
                          : 'Nature of Inquiry'}
                      </span>
                      <p
                        className={`font-semibold mt-0.5 ${
                          isRetailer
                            ? 'text-amber-300'
                            : isSupport
                            ? 'text-sky-300'
                            : 'text-brass-300'
                        }`}
                      >
                        {lead.inquiryType || 'General Inquiry'}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-cream-500 tracking-wider block">
                        Source Portal
                      </span>
                      <p className="text-cream-300 font-mono text-[11px] mt-0.5">
                        {lead.source || 'Storefront Website'}
                      </p>
                    </div>
                  </div>

                  {/* Customer Notes / Raw Message */}
                  {lead.message && (
                    <div className="p-3 rounded-xl bg-[#202024] border border-white/5 text-xs">
                      <span className="text-[10px] uppercase font-bold text-brass-400 tracking-wider block mb-1">
                        {isRetailer
                          ? 'Application Details & Notes:'
                          : isSupport
                          ? 'Support Details & Specifications:'
                          : "Customer's Message / Specific Model Requested:"}
                      </span>
                      <p className="text-cream-200 leading-relaxed whitespace-pre-line font-mono text-[11px]">
                        {lead.message}
                      </p>
                    </div>
                  )}

                  {/* Custom Form Answers (Dynamic Inputs & Structured Lead Payload) */}
                  {lead.customFields && Object.keys(lead.customFields).length > 0 && (
                    <div
                      className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                        isRetailer
                          ? 'bg-[#1C1A14] border-amber-500/30'
                          : isSupport
                          ? 'bg-[#141A20] border-sky-500/30'
                          : 'bg-[#202024] border-brass-600/30'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider">
                        <Sparkles
                          className={`w-3.5 h-3.5 ${
                            isRetailer
                              ? 'text-amber-400'
                              : isSupport
                              ? 'text-sky-400'
                              : 'text-brass-400'
                          }`}
                        />
                        <span
                          className={
                            isRetailer
                              ? 'text-amber-300'
                              : isSupport
                              ? 'text-sky-300'
                              : 'text-brass-400'
                          }
                        >
                          {isRetailer
                            ? 'Retailer Business Profile Breakdown'
                            : isSupport
                            ? 'Marketing & Merchandising Request Specifications'
                            : `Form Data (${Object.keys(lead.customFields).length} Fields Answered)`}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                        {Object.entries(lead.customFields).map(([label, val]) => (
                          <div
                            key={label}
                            className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-0.5"
                          >
                            <span className="text-[10px] text-cream-400 font-semibold uppercase tracking-wider block">
                              {label.replace(/([A-Z])/g, ' $1')}:
                            </span>
                            <span className="text-white font-medium text-xs break-words">
                              {String(val || '—')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Internal Agency Staff Notes */}
                  <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    {isEditingNotes ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Type internal staff notes (e.g. Discussed wholesale allocation terms)..."
                          value={editingNotes}
                          onChange={(e) => setEditingNotes(e.target.value)}
                          className="flex-1 bg-[#101012] border border-brass-500/50 rounded-xl px-3 py-1.5 text-xs text-white placeholder-cream-500 focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveNotes(lead._id)}
                          className="px-3 py-1.5 rounded-xl bg-brass-600 hover:bg-brass-500 text-charcoal-950 font-bold text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setActiveNotesId(null)}
                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-cream-300 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center gap-2 text-cream-400">
                        <span className="text-[11px] font-bold text-cream-500">Staff Notes:</span>
                        <span className="text-cream-300 text-[11px] truncate">
                          {lead.adminNotes || 'No notes added yet.'}
                        </span>
                        <button
                          onClick={() => {
                            setActiveNotesId(lead._id);
                            setEditingNotes(lead.adminNotes || '');
                          }}
                          className="p-1 text-brass-400 hover:text-white rounded hover:bg-white/5"
                          title="Edit staff notes"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Bottom Status Footer */}
        <div className="p-3 sm:px-6 bg-[#161619] border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-cream-400">
          <span>
            Displaying <strong className="text-white">{filteredLeads.length}</strong> of{' '}
            {leads.length} total agency leads
          </span>
          <span className="text-[11px] text-cream-500">
            Ram Prasad Agencies • Real-time Lead Dispatch Desk
          </span>
        </div>
      </div>
    </div>
  );
}
