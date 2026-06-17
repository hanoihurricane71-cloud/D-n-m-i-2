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
  Trash2,
  Check,
  Copy,
} from 'lucide-react';
import { AdditionItem } from '../types';

interface AdditionTabProps {
  // Data
  additionPagedItems: AdditionItem[];
  filteredAdditions: AdditionItem[];
  additionTotalPages: number;

  // Filter state
  additionSearchProdTrack: string;
  setAdditionSearchProdTrack: (v: string) => void;
  additionSearchBoxLoc: string;
  setAdditionSearchBoxLoc: (v: string) => void;
  additionDateFilter: string;
  setAdditionDateFilter: (v: string) => void;

  // Pagination
  additionCurrentPage: number;
  setAdditionCurrentPage: (v: number) => void;
  additionPageSize: number;
  setAdditionPageSize: (v: number) => void;
  isAdditionPageSizeOpen: boolean;
  setIsAdditionPageSizeOpen: (v: boolean) => void;

  // Refs
  additionDateInputRef: React.RefObject<HTMLInputElement>;

  // Actions
  setIsCreateAdditionOpen: (v: boolean) => void;
  setAdditionToDelete: (id: string | null) => void;
  copiedPoId: string | null;
  handleCopyTracking: (id: string, tracking: string) => void;
  triggerToast: (text: string, type?: 'success' | 'info') => void;
}

export function AdditionTab({
  additionPagedItems,
  filteredAdditions,
  additionTotalPages,
  additionSearchProdTrack,
  setAdditionSearchProdTrack,
  additionSearchBoxLoc,
  setAdditionSearchBoxLoc,
  additionDateFilter,
  setAdditionDateFilter,
  additionCurrentPage,
  setAdditionCurrentPage,
  additionPageSize,
  setAdditionPageSize,
  isAdditionPageSizeOpen,
  setIsAdditionPageSizeOpen,
  additionDateInputRef,
  setIsCreateAdditionOpen,
  setAdditionToDelete,
  copiedPoId,
  handleCopyTracking,
  triggerToast,
}: AdditionTabProps) {
  return (
    <>
      {/* Header context: Addition details */}
      <div className="px-6 pt-6 select-none">
        <h1 className="text-2xl font-bold font-sans text-slate-800 leading-tight">Inventory Addition</h1>
      </div>

      {/* Combined Filters / Action Buttons Bar */}
      <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between">
        {/* Left aligned Filters block */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">

          {/* Search Product / SKU / WRO # */}
          <div
            className={`relative h-10 transition-all duration-300 ease-in-out ${
              additionSearchProdTrack ? 'w-[320px]' : 'w-[290px] focus-within:w-[320px]'
            }`}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={additionSearchProdTrack}
              onChange={(e) => { setAdditionSearchProdTrack(e.target.value); setAdditionCurrentPage(1); }}
              placeholder="Search product / SKU / WRO #"
              className="w-full pl-9 pr-8 h-full text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
            {additionSearchProdTrack && (
              <button
                onClick={() => { setAdditionSearchProdTrack(''); setAdditionCurrentPage(1); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Search Location, Box ID */}
          <div
            className={`relative h-10 transition-all duration-300 ease-in-out ${
              additionSearchBoxLoc ? 'w-[240px]' : 'w-[210px] focus-within:w-[240px]'
            }`}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={additionSearchBoxLoc}
              onChange={(e) => { setAdditionSearchBoxLoc(e.target.value); setAdditionCurrentPage(1); }}
              placeholder="Location, box ID"
              className="w-full pl-9 pr-8 h-full text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
            {additionSearchBoxLoc && (
              <button
                onClick={() => { setAdditionSearchBoxLoc(''); setAdditionCurrentPage(1); }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Created / Receiving Date Filter */}
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => {
                if (additionDateInputRef.current) {
                  try { additionDateInputRef.current.showPicker(); } catch { additionDateInputRef.current.click(); }
                }
              }}
              className={`
                inline-flex items-center gap-1.5 px-4 h-10 text-sm font-semibold rounded-lg border transition-all duration-150 cursor-pointer whitespace-nowrap
                ${additionDateFilter !== 'All Dates'
                  ? 'border-brand-200 bg-brand-50/50 text-brand-700 hover:bg-brand-50'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }
              `}
            >
              <Calendar className={`h-4 w-4 shrink-0 ${additionDateFilter !== 'All Dates' ? 'text-brand-500' : 'text-slate-400'}`} />
              <span>
                {additionDateFilter !== 'All Dates'
                  ? new Date(additionDateFilter).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'Receiving Date'}
              </span>
              {additionDateFilter !== 'All Dates' && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); e.preventDefault(); setAdditionDateFilter('All Dates'); setAdditionCurrentPage(1); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); e.preventDefault(); setAdditionDateFilter('All Dates'); setAdditionCurrentPage(1); } }}
                  className="p-1 hover:bg-brand-100/80 rounded-md text-brand-600 transition duration-150 cursor-pointer flex items-center justify-center shrink-0 -mr-1"
                  title="Clear date"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              )}
            </button>

            <input
              type="date"
              ref={additionDateInputRef}
              value={additionDateFilter === 'All Dates' ? '' : additionDateFilter}
              onChange={(e) => { setAdditionDateFilter(e.target.value || 'All Dates'); setAdditionCurrentPage(1); }}
              className="absolute pointer-events-none opacity-0 w-0 h-0 text-transparent bg-transparent border-0"
              style={{ top: '50%', left: '50%' }}
            />
          </div>

          {(additionSearchProdTrack || additionSearchBoxLoc || additionDateFilter !== 'All Dates') && (
            <button
              onClick={() => {
                setAdditionSearchProdTrack('');
                setAdditionSearchBoxLoc('');
                setAdditionDateFilter('All Dates');
                setAdditionCurrentPage(1);
              }}
              className="inline-flex items-center gap-1.5 h-10 text-xs text-brand-600 hover:text-brand-800 font-semibold px-2 rounded hover:bg-brand-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right aligned Operations */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              try {
                const headers = "WRO number,Box ID,Product,Qty,Tracking number,Location,Receiving date,User\n";
                const rows = filteredAdditions.map(item =>
                  `"${item.poNumber}","${item.boxId || ''}","${item.product}",${item.qty},"${item.tracking}","${item.location}","${item.receivingDate}","${item.user}"`
                ).join("\n");
                const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", `SwiftPOD-InventoryAdditions-${new Date().toISOString().slice(0, 10)}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                triggerToast("Inventory additions exported successfully!", "success");
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
            onClick={() => setIsCreateAdditionOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4.5 h-10 btn-primary-gradient rounded-lg text-sm font-semibold cursor-pointer shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px] table-fixed">
          <thead>
            <tr className="bg-[#F8F9FA] text-slate-500 border-b border-slate-100 text-xs font-semibold whitespace-nowrap">
              <th className="py-3 px-6 font-sans w-[20%] pb-3.5 pt-3.5">Product style / SKU</th>
              <th className="py-3 px-6 font-sans w-[10%]">Box ID</th>
              <th className="py-3 px-6 select-none font-sans w-[11%]">WRO number</th>
              <th className="py-3 px-6 font-sans text-right w-[8%]">Qty</th>
              <th className="py-3 px-6 font-sans w-[13%]">Tracking number</th>
              <th className="py-3 px-6 font-sans w-[13%]">Location</th>
              <th className="py-3 px-6 font-sans w-[15%]">Receiving date</th>
              <th className="py-3 px-6 font-sans w-[10%]">User</th>
              <th className="py-3 px-6 font-sans w-[10%] text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 select-none text-sm">
            {additionPagedItems.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50">
                <td className="py-3 px-6 text-slate-800 font-sans w-[20%]">
                  <div className="flex flex-col max-w-[240px]">
                    <span className="font-medium text-slate-700 text-sm truncate block animate-fade-in-down" title={item.product}>
                      {item.product}
                    </span>
                    <span className="text-xs text-slate-400 font-mono tracking-wider mt-0.5 truncate block" title={item.product.replace(/\s+/g, '').replace(/\//g, '-')}>
                      {item.product.replace(/\s+/g, '').replace(/\//g, '-')}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-6 text-slate-700 font-sans font-medium truncate w-[10%]" title={item.boxId || `BOX-${item.id.toUpperCase()}`}>
                  {item.boxId || `BOX-${item.id.toUpperCase()}`}
                </td>
                <td className="py-3 px-6 text-slate-700 font-sans font-medium truncate w-[11%]">{item.poNumber}</td>
                <td className="py-3 px-6 text-slate-700 font-sans font-medium text-right w-[8%]">{item.qty}</td>
                <td className="py-3 px-6 text-slate-700 w-[13%]">
                  {item.tracking === 'N/A' ? (
                    <span className="text-slate-400 font-normal">N/A</span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-slate-500 select-all max-w-[120px] truncate block" title={item.tracking}>
                        {item.tracking}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyTracking(item.id, item.tracking)}
                        className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded transition cursor-pointer"
                        title="Copy tracking number"
                      >
                        {copiedPoId === item.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </td>
                <td className="py-3 px-6 text-slate-600 font-sans w-[13%]" title={item.location}>
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold inline-block truncate max-w-full cursor-help">
                    {item.location}
                  </span>
                </td>
                <td className="py-3 px-6 text-slate-700 font-sans font-medium truncate w-[15%]">{item.receivingDate}</td>
                <td className="py-3 px-6 text-slate-700 font-sans font-medium truncate w-[10%]">{item.user}</td>
                <td className="py-3 px-6 w-[10%]">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setAdditionToDelete(item.id)}
                      className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer inline-flex items-center justify-center font-sans tracking-wide"
                      title="Delete record"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {additionPagedItems.length === 0 && (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400 font-medium">
                  No additions found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer - Page Controls Pagination */}
      <div className="p-4 bg-[#FBFBFD] border-t border-slate-100 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-4 select-none">

        {/* Page size controller & total counts */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsAdditionPageSizeOpen(!isAdditionPageSizeOpen)}
              className="inline-flex items-center justify-between gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span>{additionPageSize}/page</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {isAdditionPageSizeOpen && (
              <div className="absolute left-0 bottom-full mb-1.5 w-24 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
                {[5, 10, 15, 20].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setAdditionPageSize(size);
                      setIsAdditionPageSizeOpen(false);
                      setAdditionCurrentPage(1);
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-sm transition-colors ${size === additionPageSize ? 'bg-brand-50 text-brand-600 font-semibold' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    {size}/page
                  </button>
                ))}
              </div>
            )}
          </div>

          <span className="text-slate-500 font-medium text-xs font-sans">
            of total <strong className="text-slate-800">{filteredAdditions.length.toLocaleString()}</strong> result{filteredAdditions.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Numeric and Back/Forward Controls block */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setAdditionCurrentPage(Math.max(1, additionCurrentPage - 1))}
            disabled={additionCurrentPage === 1}
            className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>Previous</span>
          </button>

          <div className="hidden sm:flex items-center gap-1 mx-1.5">
            {Array.from({ length: additionTotalPages }).map((_, idx) => {
              const pNum = idx + 1;
              const isCurrent = additionCurrentPage === pNum;
              return (
                <button
                  key={pNum}
                  type="button"
                  onClick={() => setAdditionCurrentPage(pNum)}
                  className={`h-7.5 w-7.5 flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${isCurrent ? 'bg-brand-50 text-brand-600 border border-brand-200 shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                >
                  {pNum}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setAdditionCurrentPage(Math.min(additionTotalPages, additionCurrentPage + 1))}
            disabled={additionCurrentPage === additionTotalPages}
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
