import React from 'react';
import {
  Search,
  Calendar,
  X,
  RotateCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Upload,
  Plus,
  MoreHorizontal,
  Check,
  Edit,
  Trash2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { FilterDropdown } from './FilterDropdown';
import { LocationItem, LocationHistoryItem } from '../types';

interface LocationTabProps {
  // Tab state
  locationActiveTab: 'Locations' | 'History';
  setLocationActiveTab: (tab: 'Locations' | 'History') => void;

  // Data
  locationPagedItems: LocationItem[];
  historyPagedItems: LocationHistoryItem[];
  filteredLocations: LocationItem[];
  filteredLocationHistory: LocationHistoryItem[];
  locationTotalPages: number;
  historyTotalPages: number;
  historyLocationOptions: string[];

  // Location filter state
  searchLocationId: string;
  setSearchLocationId: (v: string) => void;
  searchProductSku: string;
  setSearchProductSku: (v: string) => void;
  selectedLocationStatus: string;
  setSelectedLocationStatus: (v: string) => void;

  // History filter state
  historyLocationFilter: string;
  setHistoryLocationFilter: (v: string) => void;
  historyDateFrom: string;
  setHistoryDateFrom: (v: string) => void;
  historyDateTo: string;
  setHistoryDateTo: (v: string) => void;
  historySearchSku: string;
  setHistorySearchSku: (v: string) => void;

  // Pagination
  locationCurrentPage: number;
  setLocationCurrentPage: (v: number) => void;
  historyCurrentPage: number;
  setHistoryCurrentPage: (v: number) => void;
  locationPageSize: number;
  setLocationPageSize: (v: number) => void;
  isLocationPageSizeOpen: boolean;
  setIsLocationPageSizeOpen: (v: boolean) => void;

  // Inline edit state
  editingLocationId: string | null;
  setEditingLocationId: (v: string | null) => void;
  editingLocationValue: string;
  setEditingLocationValue: (v: string) => void;

  // Action menu state
  openActionMenuId: string | null;
  setOpenActionMenuId: (v: string | null) => void;

  // Refs
  historyDateFromRef: React.RefObject<HTMLInputElement>;
  historyDateToRef: React.RefObject<HTMLInputElement>;

  // Actions
  setIsCreateLocationOpen: (v: boolean) => void;
  setSelectedLocationForReturn: (loc: LocationItem | null) => void;
  setReturnProductInfo: (v: string) => void;
  setReturnQty: (v: number) => void;
  setReturnPerformedBy: (v: string) => void;
  setReturnNotes: (v: string) => void;
  setLocationToDelete: (loc: LocationItem | null) => void;
  handleSaveInlineLocationName: (id: string, newName: string) => void;
  triggerToast: (text: string, type?: 'success' | 'info') => void;
}

export function LocationTab({
  locationActiveTab,
  setLocationActiveTab,
  locationPagedItems,
  historyPagedItems,
  filteredLocations,
  filteredLocationHistory,
  locationTotalPages,
  historyTotalPages,
  historyLocationOptions,
  searchLocationId,
  setSearchLocationId,
  searchProductSku,
  setSearchProductSku,
  selectedLocationStatus,
  setSelectedLocationStatus,
  historyLocationFilter,
  setHistoryLocationFilter,
  historyDateFrom,
  setHistoryDateFrom,
  historyDateTo,
  setHistoryDateTo,
  historySearchSku,
  setHistorySearchSku,
  locationCurrentPage,
  setLocationCurrentPage,
  historyCurrentPage,
  setHistoryCurrentPage,
  locationPageSize,
  setLocationPageSize,
  isLocationPageSizeOpen,
  setIsLocationPageSizeOpen,
  editingLocationId,
  setEditingLocationId,
  editingLocationValue,
  setEditingLocationValue,
  openActionMenuId,
  setOpenActionMenuId,
  historyDateFromRef,
  historyDateToRef,
  setIsCreateLocationOpen,
  setSelectedLocationForReturn,
  setReturnProductInfo,
  setReturnQty,
  setReturnPerformedBy,
  setReturnNotes,
  setLocationToDelete,
  handleSaveInlineLocationName,
  triggerToast,
}: LocationTabProps) {
  return (
    <>
      {/* Header context: Locations details */}
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between select-none">
          <h1 className="text-2xl font-bold font-sans text-slate-800 leading-tight">Locations</h1>
        </div>

        {/* Primary category subtabs */}
        <div className="flex items-center gap-6 mt-4 border-b border-slate-100 overflow-x-auto scrollbar-none" id="location-category-tabs">
          {(['Locations', 'History'] as const).map((tab) => {
            const isActive = locationActiveTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setLocationActiveTab(tab)}
                className={`
                  pb-3 font-semibold text-sm transition-all duration-150 relative cursor-pointer block whitespace-nowrap
                  ${isActive ? 'text-brand-600 font-bold' : 'text-slate-400 hover:text-slate-700'}
                `}
              >
                <span>{tab === 'Locations' ? 'List' : 'History'}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeLocationTabUnderbar"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Combined Filters / Action Buttons Bar */}
      <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between">

        {/* Left aligned Filters block */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">

          {locationActiveTab === 'Locations' ? (
            <>
              {/* Search location id */}
              <div className={`relative h-10 transition-all duration-300 ease-in-out ${searchLocationId ? 'w-64' : 'w-52 focus-within:w-64'}`}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchLocationId}
                  onChange={(e) => { setSearchLocationId(e.target.value); setLocationCurrentPage(1); setHistoryCurrentPage(1); }}
                  placeholder="Search location id"
                  className="w-full pl-9 pr-8 h-full text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
                {searchLocationId && (
                  <button onClick={() => { setSearchLocationId(''); setLocationCurrentPage(1); setHistoryCurrentPage(1); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Search product sku */}
              <div className={`relative h-10 transition-all duration-300 ease-in-out ${searchProductSku ? 'w-64' : 'w-36 focus-within:w-64'}`}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchProductSku}
                  onChange={(e) => { setSearchProductSku(e.target.value); setLocationCurrentPage(1); setHistoryCurrentPage(1); }}
                  placeholder="Search SKU"
                  className="w-full pl-9 pr-8 h-full text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
                {searchProductSku && (
                  <button onClick={() => { setSearchProductSku(''); setLocationCurrentPage(1); setHistoryCurrentPage(1); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Status Select dropdown */}
              <FilterDropdown label="Status" options={['All', 'Return', 'Not return']} selected={selectedLocationStatus} onSelect={(val) => { setSelectedLocationStatus(val); setLocationCurrentPage(1); }} />

              {/* Clear filters trigger */}
              {(searchLocationId || searchProductSku || selectedLocationStatus !== 'All') && (
                <button
                  type="button"
                  onClick={() => { setSearchLocationId(''); setSearchProductSku(''); setSelectedLocationStatus('All'); setLocationCurrentPage(1); }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition duration-150 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Clear filters</span>
                </button>
              )}
            </>
          ) : (
            <>
              {/* History filter: Dropdown select location */}
              <FilterDropdown
                label="Location"
                options={historyLocationOptions}
                selected={historyLocationFilter}
                onSelect={(val) => { setHistoryLocationFilter(val); setHistoryCurrentPage(1); }}
                showSearch={true}
              />

              {/* Unified Date range picker */}
              <div className="relative">
                <div
                  className={`
                    inline-flex items-center h-10 px-4 text-sm font-semibold rounded-lg border transition-all duration-150 bg-white
                    ${(historyDateFrom || historyDateTo) ? 'border-brand-200 bg-brand-50/50 text-brand-700' : 'border-slate-200 text-slate-700'}
                  `}
                >
                  <Calendar className={`h-4 w-4 shrink-0 mr-2 ${(historyDateFrom || historyDateTo) ? 'text-brand-500' : 'text-slate-400'}`} />

                  <button
                    type="button"
                    onClick={() => { if (historyDateFromRef.current) { try { historyDateFromRef.current.showPicker(); } catch { historyDateFromRef.current.click(); } } }}
                    className="hover:text-brand-600 transition cursor-pointer font-semibold outline-none"
                  >
                    {historyDateFrom ? new Date(historyDateFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'From date'}
                  </button>

                  {historyDateFrom && (
                    <span role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); setHistoryDateFrom(''); setHistoryCurrentPage(1); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setHistoryDateFrom(''); setHistoryCurrentPage(1); } }} className="p-1 hover:bg-brand-100/80 rounded-md text-brand-600 transition duration-150 cursor-pointer flex items-center justify-center shrink-0 ml-1 mr-0.5" title="Clear from date">
                      <X className="h-3 w-3" />
                    </span>
                  )}

                  <span className="text-slate-400 mx-2 select-none font-normal">—</span>

                  <button
                    type="button"
                    onClick={() => { if (historyDateToRef.current) { try { historyDateToRef.current.showPicker(); } catch { historyDateToRef.current.click(); } } }}
                    className="hover:text-brand-600 transition cursor-pointer font-semibold outline-none"
                  >
                    {historyDateTo ? new Date(historyDateTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'To date'}
                  </button>

                  {historyDateTo && (
                    <span role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); setHistoryDateTo(''); setHistoryCurrentPage(1); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setHistoryDateTo(''); setHistoryCurrentPage(1); } }} className="p-1 hover:bg-brand-100/80 rounded-md text-brand-600 transition duration-150 cursor-pointer flex items-center justify-center shrink-0 ml-1" title="Clear to date">
                      <X className="h-3 w-3" />
                    </span>
                  )}
                </div>

                <input type="date" ref={historyDateFromRef} value={historyDateFrom} onChange={(e) => { setHistoryDateFrom(e.target.value || ''); setHistoryCurrentPage(1); }} className="absolute pointer-events-none opacity-0 w-0 h-0 text-transparent bg-transparent border-0" style={{ top: '50%', left: '25%' }} />
                <input type="date" ref={historyDateToRef} value={historyDateTo} onChange={(e) => { setHistoryDateTo(e.target.value || ''); setHistoryCurrentPage(1); }} className="absolute pointer-events-none opacity-0 w-0 h-0 text-transparent bg-transparent border-0" style={{ top: '50%', left: '75%' }} />
              </div>

              {/* History SKU search */}
              <div className={`relative h-10 transition-all duration-300 ease-in-out ${historySearchSku ? 'w-64' : 'w-36 focus-within:w-64'}`}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={historySearchSku}
                  onChange={(e) => { setHistorySearchSku(e.target.value); setHistoryCurrentPage(1); }}
                  placeholder="Search SKU"
                  className="w-full pl-9 pr-8 h-full text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
                {historySearchSku && (
                  <button onClick={() => { setHistorySearchSku(''); setHistoryCurrentPage(1); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Clear history filters trigger */}
              {(historyLocationFilter !== 'All locations' || historyDateFrom || historyDateTo || historySearchSku) && (
                <button
                  type="button"
                  onClick={() => { setHistoryLocationFilter('All locations'); setHistoryDateFrom(''); setHistoryDateTo(''); setHistorySearchSku(''); setHistoryCurrentPage(1); }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition duration-150 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Clear filters</span>
                </button>
              )}
            </>
          )}
        </div>

        {/* Right aligned Operations & Tools */}
        <div className="flex items-center gap-2.5 shrink-0">
          {locationActiveTab === 'Locations' && (
            <>
              <button
                type="button"
                onClick={() => triggerToast('Import feature is under design. Coming soon!', 'info')}
                className="inline-flex items-center justify-center gap-1.5 px-4 h-10 border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 rounded-lg text-sm font-semibold text-slate-700 cursor-pointer transition shadow-sm btn-secondary-sheen"
              >
                <Upload className="h-4 w-4 text-slate-500" />
                <span>Import</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCreateLocationOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 px-4.5 h-10 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-semibold cursor-pointer transition shadow-sm btn-primary-gradient"
              >
                <Plus className="h-4 w-4" />
                <span>Create Location</span>
              </button>
            </>
          )}
        </div>

      </div>

      {/* Tables Layout */}
      <div className="overflow-x-auto">
        {locationActiveTab === 'Locations' ? (
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#F8F9FA] text-slate-500 border-b border-slate-100 text-[11.5px] font-semibold uppercase tracking-wider whitespace-nowrap">
                <th className="py-3 px-6 select-none font-sans text-left">Location</th>
                <th className="py-3 px-6 select-none font-sans text-right">Box</th>
                <th className="py-3 px-6 select-none font-sans text-right">Product Qty</th>
                <th className="py-3 px-6 select-none font-sans text-left">Created At</th>
                <th className="py-3 px-6 select-none font-sans text-left">Updated At</th>
                <th className="py-3 px-6 select-none font-sans text-left">Last Returned At</th>
                <th className="py-3 px-6 select-none font-sans text-left">Last Returned By</th>
                <th className="py-3 px-6 select-none font-sans text-right sticky right-0 bg-[#F8F9FA] border-l border-b border-slate-100 z-10 w-[80px] shadow-[-6px_0_12px_-4px_rgba(0,0,0,0.12)]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/90 text-[13px] text-slate-600 bg-white">
              {locationPagedItems.length > 0 ? (
                locationPagedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors duration-100 group">

                    {/* Inline editable location name */}
                    <td className="py-4 px-6 font-sans whitespace-nowrap">
                      {editingLocationId === item.id ? (
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editingLocationValue}
                            onChange={(e) => setEditingLocationValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveInlineLocationName(item.id, editingLocationValue);
                              else if (e.key === 'Escape') setEditingLocationId(null);
                            }}
                            className="px-2.5 py-1 text-xs font-sans font-semibold bg-white border border-brand-500 rounded-lg text-slate-800 outline-none focus:ring-2 focus:ring-brand-500/20 max-w-[160px]"
                            autoFocus
                          />
                          <button type="button" onClick={() => handleSaveInlineLocationName(item.id, editingLocationValue)} className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 transition cursor-pointer" title="Save">
                            <Check className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={() => setEditingLocationId(null)} className="p-1 rounded-md text-rose-500 hover:bg-rose-50 transition cursor-pointer" title="Cancel">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-850 font-sans tracking-tight text-sm">{item.location}</span>
                          <button
                            type="button"
                            onClick={() => { setEditingLocationId(item.id); setEditingLocationValue(item.location); }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-md transition duration-150 cursor-pointer"
                            title="Edit Location Name"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right font-sans font-medium text-slate-700 whitespace-nowrap">{item.boxId || '—'}</td>
                    <td className="py-4 px-6 text-right font-sans font-medium text-slate-700 whitespace-nowrap">{item.productQty.toLocaleString()}</td>
                    <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.createdAt || '—'}</td>
                    <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.updatedAt || '—'}</td>
                    <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.lastReturnedAt || '—'}</td>
                    <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.lastReturnedBy || '—'}</td>

                    {/* Actions (Popover sticky at end) */}
                    <td className={`py-4 px-6 text-right whitespace-nowrap sticky right-0 group-hover:bg-slate-50 transition-colors border-l border-slate-100 shadow-[-6px_0_12px_-4px_rgba(0,0,0,0.12)] ${openActionMenuId === item.id ? 'z-30 bg-slate-50' : 'z-10 bg-white'}`}>
                      <div className="relative inline-block text-left" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setOpenActionMenuId(openActionMenuId === item.id ? null : item.id)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 hover:border-slate-200 transition cursor-pointer flex items-center justify-center border border-transparent"
                          title="More Options"
                        >
                          <MoreHorizontal className="h-4.5 w-4.5" />
                        </button>

                        {openActionMenuId === item.id && (
                          <>
                            <div className="fixed inset-0 z-30 cursor-default" onClick={() => setOpenActionMenuId(null)} />
                            <div className="absolute right-0 mt-1.5 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-40 py-1.5 text-left font-sans animate-fade-in divide-y divide-slate-50">
                              <div className="py-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenActionMenuId(null);
                                    setReturnProductInfo('');
                                    setReturnQty(1);
                                    setReturnPerformedBy('Tech');
                                    setReturnNotes('');
                                    setSelectedLocationForReturn(item);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                                >
                                  <RotateCcw className="h-3.5 w-3.5 text-emerald-600" />
                                  <span>Convert to return</span>
                                </button>
                              </div>
                              <div className="py-1">
                                <button
                                  type="button"
                                  onClick={() => { setOpenActionMenuId(null); setLocationToDelete(item); }}
                                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400 font-sans">No matching locations found.</td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          /* Global Return history list */
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#F8F9FA] text-slate-500 border-b border-slate-100 text-[11.5px] font-semibold uppercase tracking-wider whitespace-nowrap">
                <th className="py-3 px-6 select-none font-sans text-left">ID</th>
                <th className="py-3 px-6 select-none font-sans text-left">Location</th>
                <th className="py-3 px-6 select-none font-sans text-left">Box ID</th>
                <th className="py-3 px-6 select-none font-sans text-left">Product style / SKU</th>
                <th className="py-3 px-6 select-none font-sans text-right">Qty</th>
                <th className="py-3 px-6 select-none font-sans text-right">Value</th>
                <th className="py-3 px-6 select-none font-sans text-left">Returned by</th>
                <th className="py-3 px-6 select-none font-sans text-left">Returned at</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/90 text-[13px] text-slate-600 bg-white">
              {historyPagedItems.length > 0 ? (
                historyPagedItems.map((evt) => {
                  const displayId = evt.id.replace('hist_', '').substring(0, 4);
                  const parts = (evt.productInfo || '').split('/').map(p => p.trim());
                  let style = evt.style || '—';
                  let color = evt.color || '—';
                  let size = evt.size || '—';
                  let sku = evt.sku || '—';
                  let valueStr = '—';

                  if (parts.length >= 3) {
                    if (parts.length === 4) {
                      sku = parts[0];
                      style = parts[1];
                      color = parts[2];
                      size = parts[3];
                    } else {
                      style = parts[0];
                      color = parts[1];
                      size = parts[2];
                      sku = evt.sku || 'SKU-' + style;
                    }
                  }

                  if (evt.value !== undefined) {
                    valueStr = evt.value === 0 ? '$0' : `$${evt.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                  } else {
                    if (evt.productInfo === 'Location Registered' || evt.productInfo === 'CSV Bulk Import') {
                      style = 'G500'; color = 'Dark blue'; size = 'XL'; sku = 'UNGSBHOOS';
                      valueStr = `$${(evt.qty * 6.5).toFixed(2)}`;
                    } else if (style !== '—') {
                      sku = 'SKU-' + style;
                      valueStr = `$${(evt.qty * 5).toFixed(2)}`;
                    }
                  }

                  return (
                    <tr key={evt.id} className="hover:bg-slate-50/70 transition-colors duration-100">
                      <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{displayId}</td>
                      <td className="py-4 px-6 text-slate-800 font-bold font-sans whitespace-nowrap">{evt.locationName}</td>
                      <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{evt.boxId || '—'}</td>
                      <td className="py-4 px-6 font-sans leading-relaxed whitespace-nowrap">
                        <div className="flex flex-col max-w-[240px]">
                          <span className="font-medium text-slate-700 truncate block transition-colors" title={`${style} / ${color} / ${size}`}>{style} / {color} / {size}</span>
                          <span className="text-xs text-slate-400 font-mono tracking-wider mt-0.5 truncate block" title={sku}>{sku}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap text-right">{evt.qty.toLocaleString()}</td>
                      <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap text-right">{valueStr}</td>
                      <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{evt.performedBy}</td>
                      <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{evt.timestamp}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400 font-sans">No return event logs found matching criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Pagination Controls */}
      <div className="p-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">

        {/* Left side: Results Count info & Page limits */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsLocationPageSizeOpen(!isLocationPageSizeOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition"
            >
              <span>Show {locationPageSize} items</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {isLocationPageSizeOpen && (
              <div className="absolute bottom-full left-0 mb-1 w-32 bg-white border border-slate-100 rounded-lg shadow-xl py-1 z-50 text-xs font-sans">
                {[10, 25, 50, 100].map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => { setLocationPageSize(size); setIsLocationPageSizeOpen(false); setLocationCurrentPage(1); setHistoryCurrentPage(1); }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 font-semibold ${locationPageSize === size ? 'text-brand-600 bg-brand-50/30' : 'text-slate-600'}`}
                  >
                    {size} items
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-xs text-slate-500 font-sans font-medium">
            {locationActiveTab === 'Locations' ? (
              <>Total: <strong className="text-slate-800 font-bold">{filteredLocations.length.toLocaleString()}</strong> rows</>
            ) : (
              <>Total logs: <strong className="text-slate-800 font-bold">{filteredLocationHistory.length.toLocaleString()}</strong> events</>
            )}
          </span>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              if (locationActiveTab === 'Locations') setLocationCurrentPage(Math.max(1, locationCurrentPage - 1));
              else setHistoryCurrentPage(Math.max(1, historyCurrentPage - 1));
            }}
            disabled={locationActiveTab === 'Locations' ? locationCurrentPage === 1 : historyCurrentPage === 1}
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>

          <div className="hidden sm:flex items-center gap-1 mx-1.5">
            {Array.from({ length: locationActiveTab === 'Locations' ? locationTotalPages : historyTotalPages }).map((_, idx) => {
              const pNum = idx + 1;
              const isCurrent = locationActiveTab === 'Locations' ? locationCurrentPage === pNum : historyCurrentPage === pNum;
              return (
                <button
                  key={pNum}
                  type="button"
                  onClick={() => {
                    if (locationActiveTab === 'Locations') setLocationCurrentPage(pNum);
                    else setHistoryCurrentPage(pNum);
                  }}
                  className={`h-7.5 w-7.5 flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${isCurrent ? 'bg-brand-50 text-brand-600 border border-brand-200 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                >
                  {pNum}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              if (locationActiveTab === 'Locations') setLocationCurrentPage(Math.min(locationTotalPages, locationCurrentPage + 1));
              else setHistoryCurrentPage(Math.min(historyTotalPages, historyCurrentPage + 1));
            }}
            disabled={locationActiveTab === 'Locations' ? locationCurrentPage === locationTotalPages : historyCurrentPage === historyTotalPages}
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </>
  );
}
