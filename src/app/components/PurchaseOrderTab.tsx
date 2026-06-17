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
  AlertCircle,
  Check,
  Copy,
} from 'lucide-react';
import { FilterDropdown } from './FilterDropdown';
import { PurchaseOrder } from '../types';

interface PurchaseOrderTabProps {
  // Data
  paginatedPOs: PurchaseOrder[];
  filteredPurchaseOrders: PurchaseOrder[];
  poTotalPages: number;

  // Filter state
  poSearchQuery: string;
  setPoSearchQuery: (v: string) => void;
  selectedOrderStatus: string;
  setSelectedOrderStatus: (v: string) => void;
  selectedPOCreatedDate: string;
  setSelectedPOCreatedDate: (v: string) => void;
  poSortDirection: 'desc' | 'asc';
  setPoSortDirection: (v: 'desc' | 'asc') => void;

  // Pagination
  poCurrentPage: number;
  setPoCurrentPage: (v: number) => void;
  poPageSize: number;
  setPoPageSize: (v: number) => void;
  isPoPageSizeOpen: boolean;
  setIsPoPageSizeOpen: (v: boolean) => void;

  // Refs
  poDateInputRef: React.RefObject<HTMLInputElement>;

  // Actions
  setSelectedPODetail: (po: PurchaseOrder | null) => void;
  setIsCreatePOOpen: (v: boolean) => void;
  copiedPoId: string | null;
  handleCopyTracking: (id: string, tracking: string) => void;
  triggerToast: (text: string, type?: 'success' | 'info') => void;
}

export function PurchaseOrderTab({
  paginatedPOs,
  filteredPurchaseOrders,
  poTotalPages,
  poSearchQuery,
  setPoSearchQuery,
  selectedOrderStatus,
  setSelectedOrderStatus,
  selectedPOCreatedDate,
  setSelectedPOCreatedDate,
  poSortDirection,
  setPoSortDirection,
  poCurrentPage,
  setPoCurrentPage,
  poPageSize,
  setPoPageSize,
  isPoPageSizeOpen,
  setIsPoPageSizeOpen,
  poDateInputRef,
  setSelectedPODetail,
  setIsCreatePOOpen,
  copiedPoId,
  handleCopyTracking,
  triggerToast,
}: PurchaseOrderTabProps) {
  return (
    <>
      {/* Header context: WRO details */}
      <div className="px-6 pt-6 select-none">
        <h1 className="text-2xl font-bold font-sans text-slate-800 leading-tight">Warehouse Receiving Order</h1>
      </div>

      {/* Combined Filters / Action Buttons Bar */}
      <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between">

        {/* Left aligned Filters block */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">

          {/* Name search input */}
          <div
            className={`relative h-10 transition-all duration-300 ease-in-out ${
              poSearchQuery ? 'w-80' : 'w-[260px] focus-within:w-80'
            }`}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={poSearchQuery}
              onChange={(e) => { setPoSearchQuery(e.target.value); setPoCurrentPage(1); }}
              placeholder="WRO / tracking number"
              className="w-full pl-9 pr-8 h-full text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
            {poSearchQuery && (
              <button
                onClick={() => setPoSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Order Status Filter */}
          <FilterDropdown
            label="Order status"
            options={['All Statuses', 'New', 'Partial Received', 'Completed', 'Verified', 'Cancelled']}
            selected={selectedOrderStatus}
            onSelect={(val) => { setSelectedOrderStatus(val); setPoCurrentPage(1); }}
          />

          {/* Created Date picker */}
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => {
                if (poDateInputRef.current) {
                  try { poDateInputRef.current.showPicker(); } catch { poDateInputRef.current.click(); }
                }
              }}
              className={`
                inline-flex items-center gap-1.5 px-4 h-10 text-sm font-medium rounded-lg border transition-all duration-150 cursor-pointer whitespace-nowrap
                ${selectedPOCreatedDate !== 'All Dates'
                  ? 'border-brand-200 bg-brand-50/50 text-brand-700 hover:bg-brand-50'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Calendar className={`h-4 w-4 shrink-0 ${selectedPOCreatedDate !== 'All Dates' ? 'text-brand-500' : 'text-gray-400'}`} />
              <span>
                {selectedPOCreatedDate !== 'All Dates'
                  ? new Date(selectedPOCreatedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Created date'}
              </span>
              {selectedPOCreatedDate !== 'All Dates' ? (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); e.preventDefault(); setSelectedPOCreatedDate('All Dates'); setPoCurrentPage(1); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); e.preventDefault(); setSelectedPOCreatedDate('All Dates'); setPoCurrentPage(1); } }}
                  className="p-1 hover:bg-brand-100/80 rounded-md text-brand-600 transition duration-150 cursor-pointer flex items-center justify-center shrink-0 -mr-1"
                  title="Clear date"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              ) : (
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              )}
            </button>

            <input
              type="date"
              ref={poDateInputRef}
              value={selectedPOCreatedDate === 'All Dates' ? '' : selectedPOCreatedDate}
              onChange={(e) => { setSelectedPOCreatedDate(e.target.value || 'All Dates'); setPoCurrentPage(1); }}
              className="absolute pointer-events-none opacity-0 w-0 h-0 text-transparent bg-transparent border-0"
              style={{ top: '50%', left: '50%' }}
            />
          </div>

          {/* Reset trigger */}
          {(poSearchQuery || selectedOrderStatus !== 'All Statuses' || selectedPOCreatedDate !== 'All Dates') && (
            <button
              onClick={() => {
                setPoSearchQuery('');
                setSelectedOrderStatus('All Statuses');
                setSelectedPOCreatedDate('All Dates');
                setPoCurrentPage(1);
              }}
              className="inline-flex items-center gap-1.5 h-10 text-xs text-brand-600 hover:text-brand-800 font-semibold px-2 rounded hover:bg-brand-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right aligned Operations & Tools */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Export POs */}
          <button
            type="button"
            onClick={() => {
              try {
                const headers = "WRO number,Customer,Order status,Total qty,Received qty,Incoming qty,Tracking,Created date,Created by\n";
                const rows = filteredPurchaseOrders.map(po =>
                  `"${po.poNumber}","${po.customer}","${po.orderStatus}",${po.totalQty},${po.receivedQty},${po.incomingQty},"${po.tracking}","${po.createdAt}","${po.createdBy}"`
                ).join("\n");
                const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", `SwiftPOD-WROs-${new Date().toISOString().slice(0, 10)}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                triggerToast("WROs exported successfully!", "success");
              } catch {
                triggerToast("Export failed.", "info");
              }
            }}
            className="inline-flex items-center justify-center gap-1.5 px-4 h-10 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 cursor-pointer btn-secondary-sheen"
          >
            <Upload className="h-4 w-4 rotate-180 text-slate-500" />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreatePOOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4.5 h-10 btn-primary-gradient rounded-lg text-sm font-semibold cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create</span>
          </button>
        </div>

      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#F8F9FA] text-slate-500 border-b border-slate-100 text-[11.5px] font-semibold uppercase tracking-wider whitespace-nowrap">
              <th className="py-3 px-6 select-none font-sans">WRO number</th>
              <th className="py-3 px-6 font-sans">Customer</th>
              <th className="py-3 px-6 font-sans">Order status</th>
              <th className="py-3 px-6 font-sans text-right">Total qty</th>
              <th className="py-3 px-6 font-sans text-right">Received qty</th>
              <th className="py-3 px-6 font-sans text-right">Incoming qty</th>
              <th className="py-3 px-6 font-sans">Tracking</th>
              <th
                className="py-3 px-6 font-sans select-none cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => {
                  const nextDir = poSortDirection === 'desc' ? 'asc' : 'desc';
                  setPoSortDirection(nextDir);
                  triggerToast(nextDir === 'desc' ? "Sorted oldest first" : "Sorted newest first", "info");
                }}
              >
                <div className="flex items-center gap-1">
                  <span>Age</span>
                  <span className="text-xs text-slate-400 select-none">{poSortDirection === 'desc' ? '▼' : '▲'}</span>
                </div>
              </th>
              <th className="py-3 px-6 font-sans">Created at</th>
              <th className="py-3 px-6 font-sans">Created by</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100/90 text-[13px] text-slate-600">
            {paginatedPOs.length > 0 ? (
              paginatedPOs.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/40 transition-colors whitespace-nowrap">
                  <td className="py-3 px-6">
                    <button
                      type="button"
                      onClick={() => setSelectedPODetail(po)}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-semibold font-mono text-sm text-left focus:outline-none transition-colors duration-150 cursor-pointer"
                    >
                      {po.poNumber}
                    </button>
                  </td>
                  <td className="py-3 px-6 font-sans font-medium text-slate-700 max-w-[150px] truncate" title={po.customer}>{po.customer}</td>
                  <td className="py-3 px-6 font-sans">
                    {po.orderStatus === 'New' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 border border-rose-100 text-rose-600">New</span>
                    )}
                    {po.orderStatus === 'Partial Received' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 border border-blue-100 text-blue-600">Partial Received</span>
                    )}
                    {po.orderStatus === 'Completed' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 border border-emerald-100 text-emerald-600">Completed</span>
                    )}
                    {po.orderStatus === 'Verified' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 border border-purple-100 text-purple-600">Verified</span>
                    )}
                    {po.orderStatus === 'Cancelled' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 border border-slate-100 text-slate-500">Cancelled</span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-right font-mono font-medium text-slate-700">{po.totalQty}</td>
                  <td className="py-3 px-6 text-right font-mono font-medium text-slate-700">{po.receivedQty}</td>
                  <td className="py-3 px-6 text-right font-mono font-medium text-slate-700">{po.incomingQty}</td>
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-slate-500 select-all max-w-[120px] truncate block" title={po.tracking}>{po.tracking}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyTracking(po.id, po.tracking)}
                        className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded transition cursor-pointer"
                        title="Copy tracking number"
                      >
                        {copiedPoId === po.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-6 font-sans font-medium text-slate-700">{po.ageDays} days</td>
                  <td className="py-3 px-6 font-sans font-medium text-slate-700">{po.createdAt}</td>
                  <td className="py-3 px-6 font-mono text-xs font-medium text-slate-700">{po.createdBy}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="py-16 text-center text-slate-400">
                  <div className="max-w-[280px] mx-auto flex flex-col items-center gap-2">
                    <AlertCircle className="h-8 w-8 text-slate-300" />
                    <span className="font-semibold text-slate-600">No WROs found</span>
                    <p className="text-xs text-slate-400">Try modifying your search criteria or reset filters.</p>
                    <button
                      onClick={() => { setPoSearchQuery(''); setSelectedOrderStatus('All Statuses'); setSelectedPOCreatedDate('All Dates'); setPoCurrentPage(1); }}
                      className="mt-2 text-xs px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-lg transition-colors font-semibold cursor-pointer"
                    >
                      Clear criteria
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer - PO Controls Pagination */}
      <div className="p-4 bg-[#FBFBFD] border-t border-slate-100 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-4 select-none">

        {/* Page size controller & total counts */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsPoPageSizeOpen(!isPoPageSizeOpen)}
              className="inline-flex items-center justify-between gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span>{poPageSize}/page</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {isPoPageSizeOpen && (
              <div className="absolute left-0 bottom-full mb-1.5 w-24 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
                {[5, 10, 15, 20].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setPoPageSize(size);
                      setIsPoPageSizeOpen(false);
                      setPoCurrentPage(1);
                      triggerToast(`Page size updated to ${size}`, 'info');
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-sm transition-colors ${size === poPageSize ? 'bg-brand-50 text-brand-600 font-semibold' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    {size}/page
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-slate-500 font-medium text-xs font-sans">
            of total <strong className="text-slate-800">{filteredPurchaseOrders.length.toLocaleString()}</strong> result{filteredPurchaseOrders.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Numeric and Back/Forward Controls block */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPoCurrentPage(Math.max(1, poCurrentPage - 1))}
            disabled={poCurrentPage === 1}
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>

          <div className="hidden sm:flex items-center gap-1 mx-1.5">
            {Array.from({ length: poTotalPages }).map((_, idx) => {
              const pNum = idx + 1;
              const isCurrent = poCurrentPage === pNum;
              return (
                <button
                  key={pNum}
                  type="button"
                  onClick={() => setPoCurrentPage(pNum)}
                  className={`h-7.5 w-7.5 flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${isCurrent ? 'bg-brand-50 text-brand-600 border border-brand-200 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                >
                  {pNum}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setPoCurrentPage(Math.min(poTotalPages, poCurrentPage + 1))}
            disabled={poCurrentPage === poTotalPages}
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
