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
} from 'lucide-react';
import { getLeads, updateLead, deleteLead } from '../utils/api';

const STATUS_COLORS = {
  New: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
  Contacted: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  'Showroom Visit Scheduled': 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  Converted: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  Archived: 'bg-slate-700/40 text-slate-400 border-slate-600/40',
};

export default function LeadsManagerModal({ isOpen, onClose, showToast, onOpenFormEditor }) {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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
        showToast &&
          showToast({
            type: 'info',
            title: 'New Customer Lead!',
            message: `${event.data.lead.name} submitted an inquiry for ${event.data.lead.storeLocation}`,
          });
      }
    };
    return () => channel.close();
  }, [showToast]);

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
  }, [leads, selectedStatus, selectedShowroom, searchQuery]);

  // Handle status update
  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const updated = await updateLead(leadId, { status: newStatus });
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
    const headers = ['Date', 'Name', 'Phone', 'Email', 'Showroom', 'Inquiry Type', 'Message', 'Status', 'Staff Notes'];
    const rows = leads.map((l) => [
      `"${new Date(l.createdAt || Date.now()).toLocaleString('en-IN')}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.storeLocation || '').replace(/"/g, '""')}"`,
      `"${(l.inquiryType || '').replace(/"/g, '""')}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      `"${l.status || 'New'}"`,
      `"${(l.adminNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RPA_Customer_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
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
                  Agency Customer Inquiries & Leads Desk
                </h2>
                {stats.newCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 animate-pulse">
                    ● {stats.newCount} New
                  </span>
                )}
              </div>
              <p className="text-xs text-cream-300">
                Incoming customer requests from website inquiry form, showroom visits & watch consultations
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

        {/* Stats Strip */}
        <div className="px-4 sm:px-6 py-3 bg-[#111113] border-b border-white/5 flex items-center gap-2 sm:gap-4 overflow-x-auto text-xs scrollbar-none">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-cream-300 shrink-0">
            <span className="text-cream-400">Total:</span>
            <strong className="text-white font-bold">{stats.total}</strong>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
            <span>New Inquiries:</span>
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
              placeholder="Search by name, phone, showroom, question answers..."
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
                <option value="ALL" className="bg-[#18181B]">All Showrooms (Golghar)</option>
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
                  {status === 'ALL' ? 'All Leads' : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Leads Cards List Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-brass-400 animate-spin mx-auto" />
              <p className="text-xs text-cream-400">Loading customer inquiries...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="py-20 text-center space-y-3 bg-[#18181A] rounded-2xl border border-white/5">
              <div className="w-12 h-12 rounded-full bg-brass-500/10 text-brass-400 flex items-center justify-center mx-auto border border-brass-500/20">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-white">No Inquiries Found</h3>
              <p className="text-xs text-cream-400 max-w-sm mx-auto">
                {searchQuery || selectedStatus !== 'ALL'
                  ? 'No leads match your current search or status filter. Try clearing the filters.'
                  : 'All caught up! When a customer fills the showroom inquiry form on the website, it will immediately appear here.'}
              </p>
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const cleanPhone = String(lead.phone || '').replace(/[^0-9]/g, '');
              let waDialNumber = cleanPhone;
              if (cleanPhone.length === 10) {
                waDialNumber = `91${cleanPhone}`;
              } else if (cleanPhone.startsWith('0')) {
                waDialNumber = `91${cleanPhone.slice(1)}`;
              }
              const waText = `Hello ${lead.name || 'Valued Customer'}, thank you for contacting Ram Prasad Agencies regarding your inquiry on "${lead.inquiryType || 'Luxury Timepieces'}" at our ${lead.storeLocation || 'Golghar'} showroom. We are pleased to assist you with current availability, pricing, and scheduling your in-store viewing.`;
              const waUrl = `https://wa.me/${waDialNumber}?text=${encodeURIComponent(waText)}`;
              const isEditingNotes = activeNotesId === lead._id;

              return (
                <div
                  key={lead._id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#1A1A1D] border border-white/10 hover:border-brass-600/50 transition-all shadow-md space-y-3.5"
                >
                  {/* Card Header Row: Customer Name, Phone, Status & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brass-500/15 border border-brass-600/30 text-brass-300 flex items-center justify-center font-bold text-sm shrink-0">
                        {lead.name ? lead.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-serif text-sm sm:text-base font-bold text-white">
                            {lead.name}
                          </h4>
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
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all active:scale-95"
                        title="Open WhatsApp chat with prefilled customer reply"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Customer</span>
                      </a>

                      <a
                        href={`tel:${cleanPhone}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#29292E] hover:bg-[#34343B] text-cream-200 border border-white/10 transition-all"
                        title="Call customer directly"
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

                  {/* Inquiry Details Details Grid */}
                  <div className="p-3.5 rounded-xl bg-[#111113] border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-cream-500 tracking-wider block">
                        Preferred Showroom
                      </span>
                      <p className="text-white font-medium flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-brass-400 shrink-0" />
                        <span>{lead.storeLocation || 'Baldev Plaza & JalKal Building'}</span>
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-cream-500 tracking-wider block">
                        Nature of Inquiry
                      </span>
                      <p className="text-brass-300 font-semibold mt-0.5">
                        {lead.inquiryType || 'General Watch Inquiry'}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-cream-500 tracking-wider block">
                        Source
                      </span>
                      <p className="text-cream-300 font-mono text-[11px] mt-0.5">
                        {lead.source || 'Storefront Website'}
                      </p>
                    </div>
                  </div>

                  {/* Customer Notes / Message */}
                  {lead.message && (
                    <div className="p-3 rounded-xl bg-[#202024] border border-white/5 text-xs">
                      <span className="text-[10px] uppercase font-bold text-brass-400 tracking-wider block mb-1">
                        Customer's Message / Specific Model Requested:
                      </span>
                      <p className="text-cream-200 leading-relaxed italic">
                        "{lead.message}"
                      </p>
                    </div>
                  )}

                  {/* Custom Form Answers (Dynamic Inputs added by Admin) */}
                  {lead.customFields && Object.keys(lead.customFields).length > 0 && (
                    <div className="p-3.5 rounded-xl bg-[#202024] border border-brass-600/30 text-xs space-y-2">
                      <div className="flex items-center gap-1.5 text-brass-400 font-bold text-[10px] uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-brass-400" />
                        <span>Custom Form Answers ({Object.keys(lead.customFields).length} Fields Answered)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                        {Object.entries(lead.customFields).map(([label, val]) => (
                          <div key={label} className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-0.5">
                            <span className="text-[10px] text-cream-400 font-semibold uppercase tracking-wider block">
                              {label}:
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
                          placeholder="Type internal staff notes (e.g. Coming Saturday 4pm for Titan Edge)..."
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
            Displaying <strong className="text-white">{filteredLeads.length}</strong> of {leads.length} total customer leads
          </span>
          <span className="text-[11px] text-cream-500">
            Ram Prasad Agencies • Real-time Lead Dispatch Desk
          </span>
        </div>
      </div>
    </div>
  );
}
