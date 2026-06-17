import React from 'react';
import {
  Search,
  Package,
  Calendar,
  X,
  RotateCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Copy,
  Globe,
  MapPin,
  ClipboardList,
} from 'lucide-react';
import { FilterDropdown } from './FilterDropdown';
import { OrderManagementItem } from '../types';

interface OrderManagementTabProps {
  // Data
  orderPagedItems: OrderManagementItem[];
  orderTotalPages: number;
  filteredOrders: OrderManagementItem[];

  // Filter state
  orderSearchQuery: string;
  setOrderSearchQuery: (v: string) => void;
  orderProductQuery: string;
  setOrderProductQuery: (v: string) => void;
  orderStatusFilter: string;
  setOrderStatusFilter: (v: string) => void;
  orderShippingStatusFilter: string;
  setOrderShippingStatusFilter: (v: string) => void;
  orderShipMethodFilter: string;
  setOrderShipMethodFilter: (v: string) => void;
  orderCustomerFilter: string;
  setOrderCustomerFilter: (v: string) => void;
  orderDateFrom: string;
  setOrderDateFrom: (v: string) => void;
  orderDateTo: string;
  setOrderDateTo: (v: string) => void;
  orderStyleFilter: string;
  setOrderStyleFilter: (v: string) => void;
  orderColorFilter: string;
  setOrderColorFilter: (v: string) => void;
  orderSizeFilter: string;
  setOrderSizeFilter: (v: string) => void;

  // Pagination
  orderCurrentPage: number;
  setOrderCurrentPage: (v: number) => void;
  orderPageSize: number;
  setOrderPageSize: (v: number) => void;
  isOrderPageSizeOpen: boolean;
  setIsOrderPageSizeOpen: (v: boolean) => void;

  // Refs
  orderDateFromRef: React.RefObject<HTMLInputElement>;
  orderDateToRef: React.RefObject<HTMLInputElement>;

  // Actions
  setSelectedOrderDetail: (order: OrderManagementItem | null) => void;
  setIsOrderDetailOpen: (v: boolean) => void;
  copiedOrderId: string | null;
  setCopiedOrderId: (v: string | null) => void;
  triggerToast: (text: string, type?: 'success' | 'info') => void;
}

export function OrderManagementTab({
  orderPagedItems,
  orderTotalPages,
  filteredOrders,
  orderSearchQuery,
  setOrderSearchQuery,
  orderProductQuery,
  setOrderProductQuery,
  orderStatusFilter,
  setOrderStatusFilter,
  orderShippingStatusFilter,
  setOrderShippingStatusFilter,
  orderShipMethodFilter,
  setOrderShipMethodFilter,
  orderCustomerFilter,
  setOrderCustomerFilter,
  orderDateFrom,
  setOrderDateFrom,
  orderDateTo,
  setOrderDateTo,
  orderStyleFilter,
  setOrderStyleFilter,
  orderColorFilter,
  setOrderColorFilter,
  orderSizeFilter,
  setOrderSizeFilter,
  orderCurrentPage,
  setOrderCurrentPage,
  orderPageSize,
  setOrderPageSize,
  isOrderPageSizeOpen,
  setIsOrderPageSizeOpen,
  orderDateFromRef,
  orderDateToRef,
  setSelectedOrderDetail,
  setIsOrderDetailOpen,
  copiedOrderId,
  setCopiedOrderId,
  triggerToast,
}: OrderManagementTabProps) {
  const hasActiveFilters =
    orderSearchQuery ||
    orderProductQuery ||
    orderStyleFilter !== 'All Styles' ||
    orderColorFilter !== 'All Colors' ||
    orderSizeFilter !== 'All Sizes' ||
    orderStatusFilter !== 'All statuses' ||
    orderCustomerFilter !== 'All Customers' ||
    orderShippingStatusFilter !== 'All shipping statuses' ||
    orderShipMethodFilter !== 'All methods' ||
    orderDateFrom ||
    orderDateTo;

  return (
    <>
      {/* Header context */}
      <div className="px-6 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-sans text-slate-800 leading-tight">Order management</h1>
        </div>
      </div>

      {/* Filters Area */}
      <div className="px-6 pt-5 pb-2 flex flex-wrap items-center gap-2.5 justify-start">
        {/* Search Bar */}
        <div
          className={`relative h-10 transition-all duration-300 ease-in-out ${
            orderSearchQuery ? 'w-96' : 'w-[280px] focus-within:w-96'
          }`}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={orderSearchQuery}
            onChange={(e) => {
              setOrderSearchQuery(e.target.value);
              setOrderCurrentPage(1);
            }}
            placeholder="Order, ref, tracking number"
            className="w-full pl-9 pr-8 h-full text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 truncate transition-shadow"
          />
          {orderSearchQuery && (
            <button
              type="button"
              onClick={() => {
                setOrderSearchQuery('');
                setOrderCurrentPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Product/SKU Search */}
        <div
          className={`relative h-10 transition-all duration-300 ease-in-out ${
            orderProductQuery ? 'w-80' : 'w-56 focus-within:w-80'
          }`}
        >
          <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={orderProductQuery}
            onChange={(e) => {
              setOrderProductQuery(e.target.value);
              setOrderCurrentPage(1);
            }}
            placeholder="SKU or Product Style"
            className="w-full pl-9 pr-8 h-full text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 truncate transition-shadow"
          />
          {orderProductQuery && (
            <button
              type="button"
              onClick={() => {
                setOrderProductQuery('');
                setOrderCurrentPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <FilterDropdown
          label="Order Status"
          selected={orderStatusFilter}
          options={['All statuses', 'New', 'In Production', 'Shipped', 'On Hold', 'Rejected', 'Cancelled']}
          onSelect={(val) => {
            setOrderStatusFilter(val);
            setOrderCurrentPage(1);
          }}
        />

        {/* Shipping Status Filter */}
        <FilterDropdown
          label="Shipping Status"
          selected={orderShippingStatusFilter}
          options={['All shipping statuses', 'Unknown', 'Pre Transit', 'In Transit', 'Out for Delivery', 'Delivered', 'Available For Pickup', 'Return To Sender', 'Failure', 'Cancelled']}
          onSelect={(val) => {
            setOrderShippingStatusFilter(val);
            setOrderCurrentPage(1);
          }}
        />

        {/* Shipping Method Filter */}
        <FilterDropdown
          label="Shipping Method"
          selected={orderShipMethodFilter}
          options={['All methods', 'UPS Ground', 'FedEx Express', 'DHL Worldwide', 'USPS Priority']}
          onSelect={(val) => {
            setOrderShipMethodFilter(val);
            setOrderCurrentPage(1);
          }}
        />

        {/* Customer Filter */}
        <FilterDropdown
          label="Customer"
          selected={orderCustomerFilter}
          options={['All Customers', 'Olivia Rhye', 'Acme Corp', 'Phoenix Baker', 'Lana Steiner', 'Demi Wilkinson']}
          onSelect={(val) => {
            setOrderCustomerFilter(val);
            setOrderCurrentPage(1);
          }}
          showSearch={true}
        />

        {/* Unified Date Range Picker */}
        <div className="relative">
          <div
            className={`
              inline-flex items-center h-10 px-3.5 text-sm font-semibold rounded-lg border transition-all duration-150 bg-white
              ${(orderDateFrom || orderDateTo)
                ? 'border-brand-200 bg-brand-50/50 text-brand-700'
                : 'border-slate-200 text-slate-700'
              }
            `}
          >
            <Calendar className={`h-4 w-4 shrink-0 mr-2 ${(orderDateFrom || orderDateTo) ? 'text-brand-500' : 'text-slate-400'}`} />

            <button
              type="button"
              onClick={() => {
                if (orderDateFromRef.current) {
                  try { orderDateFromRef.current.showPicker(); } catch { orderDateFromRef.current.click(); }
                }
              }}
              className="hover:text-brand-600 transition cursor-pointer font-semibold outline-none"
            >
              {orderDateFrom
                ? new Date(orderDateFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : 'From date'}
            </button>

            {orderDateFrom && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); setOrderDateFrom(''); setOrderCurrentPage(1); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setOrderDateFrom(''); setOrderCurrentPage(1); } }}
                className="p-1 hover:bg-brand-100/80 rounded-md text-brand-600 transition duration-150 cursor-pointer flex items-center justify-center shrink-0 ml-1 mr-0.5"
                title="Clear from date"
              >
                <X className="h-3 w-3" />
              </span>
            )}

            <span className="text-slate-400 mx-2 select-none font-normal">—</span>

            <button
              type="button"
              onClick={() => {
                if (orderDateToRef.current) {
                  try { orderDateToRef.current.showPicker(); } catch { orderDateToRef.current.click(); }
                }
              }}
              className="hover:text-brand-600 transition cursor-pointer font-semibold outline-none"
            >
              {orderDateTo
                ? new Date(orderDateTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : 'To date'}
            </button>

            {orderDateTo && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); setOrderDateTo(''); setOrderCurrentPage(1); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setOrderDateTo(''); setOrderCurrentPage(1); } }}
                className="p-1 hover:bg-brand-100/80 rounded-md text-brand-600 transition duration-150 cursor-pointer flex items-center justify-center shrink-0 ml-1"
                title="Clear to date"
              >
                <X className="h-3 w-3" />
              </span>
            )}
          </div>

          {/* Hidden inputs */}
          <input
            type="date"
            ref={orderDateFromRef}
            value={orderDateFrom}
            onChange={(e) => { setOrderDateFrom(e.target.value || ''); setOrderCurrentPage(1); }}
            className="absolute pointer-events-none opacity-0 w-0 h-0 text-transparent bg-transparent border-0"
            style={{ top: '50%', left: '25%' }}
          />
          <input
            type="date"
            ref={orderDateToRef}
            value={orderDateTo}
            onChange={(e) => { setOrderDateTo(e.target.value || ''); setOrderCurrentPage(1); }}
            className="absolute pointer-events-none opacity-0 w-0 h-0 text-transparent bg-transparent border-0"
            style={{ top: '50%', left: '75%' }}
          />
        </div>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => {
              setOrderSearchQuery('');
              setOrderProductQuery('');
              setOrderStyleFilter('All Styles');
              setOrderColorFilter('All Colors');
              setOrderSizeFilter('All Sizes');
              setOrderStatusFilter('All statuses');
              setOrderCustomerFilter('All Customers');
              setOrderShippingStatusFilter('All shipping statuses');
              setOrderShipMethodFilter('All methods');
              setOrderDateFrom('');
              setOrderDateTo('');
              setOrderCurrentPage(1);
            }}
            className="inline-flex items-center gap-1.5 h-10 text-xs text-brand-600 hover:text-brand-800 font-semibold px-2 rounded hover:bg-brand-50 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Table / List Area */}
      <div className="flex-1 overflow-x-auto min-h-[300px] border-t border-slate-100 relative">
        <table className="w-full text-sm text-left text-slate-500 border-collapse min-w-[1240px]">
          <thead className="text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 select-none border-b border-slate-100">
            <tr className="whitespace-nowrap">
              <th className="py-3 px-6 font-sans">Order Number</th>
              <th className="py-3 px-6 font-sans">Ref Number</th>
              <th className="py-3 px-6 font-sans">Order Date</th>
              <th className="py-3 px-6 font-sans">Customer / Store Name</th>
              <th className="py-3 px-6 font-sans text-right">Qty</th>
              <th className="py-3 px-6 font-sans">Order Status</th>
              <th className="py-3 px-6 font-sans">Shipping Status</th>
              <th className="py-3 px-6 font-sans">Shipping Method</th>
              <th className="py-3 px-6 font-sans">Tracking</th>
              <th className="py-3 px-6 font-sans">Destination</th>
            </tr>
          </thead>
          <tbody>
            {orderPagedItems.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-slate-400 font-medium">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <ClipboardList className="h-8 w-8 text-slate-300" />
                    <p>No orders found matching your filters.</p>
                  </div>
                </td>
              </tr>
            ) : (
              orderPagedItems.map((order) => (
                <tr key={order.id} className="border-b border-slate-100/70 hover:bg-slate-50/40 transition-colors group">
                  {/* Order Number */}
                  <td className="py-3 px-6 font-semibold font-mono text-slate-900 select-all whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => { setSelectedOrderDetail(order); setIsOrderDetailOpen(true); }}
                      className="text-brand-600 hover:text-brand-700 underline decoration-dashed decoration-brand-300 underline-offset-4 hover:decoration-solid font-medium font-mono text-left focus:outline-none cursor-pointer transition-colors"
                    >
                      {order.orderNumber}
                    </button>
                  </td>
                  {/* Ref Number */}
                  <td className="py-3 px-6 font-semibold font-mono text-slate-900 select-all whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => { setSelectedOrderDetail(order); setIsOrderDetailOpen(true); }}
                      className="text-brand-600 hover:text-brand-700 underline decoration-dashed decoration-brand-300 underline-offset-4 hover:decoration-solid font-medium font-mono text-left focus:outline-none cursor-pointer transition-colors"
                    >
                      {order.refNumber || 'REF-N/A'}
                    </button>
                  </td>
                  {/* Order Date */}
                  <td className="py-3 px-6 text-slate-600 whitespace-nowrap font-normal">{order.orderDate}</td>
                  {/* Store Name / Customer */}
                  <td className="py-3 px-6 text-slate-800 font-semibold font-sans whitespace-nowrap truncate max-w-[180px]" title={order.customerStore}>
                    {order.customerStore}
                  </td>
                  {/* Qty */}
                  <td className="py-3 px-6 text-right text-slate-600 font-mono font-normal whitespace-nowrap">
                    {order.quantity.toLocaleString('en-US')}
                  </td>
                  {/* Order Status */}
                  <td className="py-3 px-6 font-normal whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border ${
                      order.orderStatus === 'New' ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : order.orderStatus === 'In Production' ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : order.orderStatus === 'Shipped' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : order.orderStatus === 'On Hold' ? 'bg-slate-100 text-slate-700 border-slate-200'
                      : order.orderStatus === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  {/* Shipping Status */}
                  <td className="py-3 px-6 font-normal whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border ${
                      order.shippingStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : order.shippingStatus === 'In Transit' ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : order.shippingStatus === 'Out for Delivery' ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : order.shippingStatus === 'Pre Transit' ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : order.shippingStatus === 'Available For Pickup' ? 'bg-teal-50 text-teal-700 border-teal-200'
                      : order.shippingStatus === 'Return To Sender' ? 'bg-orange-50 text-orange-700 border-orange-200'
                      : order.shippingStatus === 'Failure' ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : order.shippingStatus === 'Cancelled' ? 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                      : 'bg-slate-100 text-slate-700 border-slate-200 font-sans'
                    }`}>
                      {order.shippingStatus || 'Unknown'}
                    </span>
                  </td>
                  {/* Shipping Method */}
                  <td className="py-3 px-6 text-slate-600 whitespace-nowrap font-normal">{order.shippingMethod || '—'}</td>
                  {/* Tracking */}
                  <td className="py-3 px-6 font-normal whitespace-nowrap">
                    {order.trackingNumber ? (
                      <div className="flex items-center gap-1.5 font-mono text-slate-600">
                        <span className="select-all tracking-wide font-mono text-xs w-[82px] block truncate" title={order.trackingNumber}>
                          {order.trackingNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(order.trackingNumber || '');
                            setCopiedOrderId(order.id);
                            triggerToast('Copied tracking number to clipboard.', 'success');
                            setTimeout(() => setCopiedOrderId(null), 2000);
                          }}
                          className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded transition cursor-pointer"
                          title="Copy tracking number"
                        >
                          {copiedOrderId === order.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 font-mono text-xs block w-[120px]">—</span>
                    )}
                  </td>
                  {/* Destination */}
                  <td className="py-3 px-6 font-normal font-sans whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {order.destinationType === 'International' ? (
                        <Globe className="h-4 w-4 text-amber-500 shrink-0" />
                      ) : (
                        <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                      )}
                      <div className="flex flex-col">
                        <span className="text-slate-800 font-semibold text-xs leading-none">{order.destination || '—'}</span>
                        <span className={`text-[9px] font-bold tracking-wider leading-none mt-1 ${
                          order.destinationType === 'International' ? 'text-amber-600' : 'text-slate-400'
                        }`}>
                          {order.destinationType === 'International' ? 'INTERNATIONAL' : 'DOMESTIC'}
                        </span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4 rounded-b-2xl">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Entries per page:</span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOrderPageSizeOpen(!isOrderPageSizeOpen)}
              className="h-8 px-3 text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 rounded-lg inline-flex items-center gap-1 cursor-pointer text-slate-700"
            >
              <span>{orderPageSize}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
            {isOrderPageSizeOpen && (
              <div className="absolute left-0 bottom-full mb-1 z-30 bg-white border border-slate-200 rounded-lg shadow-lg py-1 min-w-[70px] flex flex-col">
                {[5, 10, 25, 50].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setOrderPageSize(size);
                      setOrderCurrentPage(1);
                      setIsOrderPageSizeOpen(false);
                    }}
                    className={`px-3 py-1.5 text-xs text-left font-semibold cursor-pointer ${orderPageSize === size ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 list-none">
          <button
            type="button"
            disabled={orderCurrentPage === 1}
            onClick={() => setOrderCurrentPage(Math.max(1, orderCurrentPage - 1))}
            className="h-8 px-3 text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none rounded-lg inline-flex items-center gap-1 cursor-pointer text-slate-600"
          >
            <ChevronLeft className="h-3 w-3" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: orderTotalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setOrderCurrentPage(pageNum)}
                  className={`h-8 w-8 text-xs font-bold rounded-lg cursor-pointer flex items-center justify-center transition-all ${orderCurrentPage === pageNum ? 'bg-brand-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={orderCurrentPage === orderTotalPages}
            onClick={() => setOrderCurrentPage(Math.min(orderTotalPages, orderCurrentPage + 1))}
            className="h-8 px-3 text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none rounded-lg inline-flex items-center gap-1 cursor-pointer text-slate-600"
          >
            <span>Next</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </>
  );
}
