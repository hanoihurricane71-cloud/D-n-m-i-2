import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, ChevronRight, ChevronDown, Copy, Printer, Eye, ShoppingCart, Package, MapPin, FileText, ClipboardList, MessageSquare, ArrowLeft
} from "lucide-react";
import { OrderManagementItem, Product } from "../types";

const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' }
];

const itemThumbImg = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MDAgNTAwIj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2YzZjRmNiIgLz48cmVjdCB4PSI3MCIgeT0iMTEwIiB3aWR0aD0iMzYwIiBoZWlnaHQ9IjI4MCIgcng9IjMyIiBmaWxsPSJub25lIiBzdHJva2U9IiM5YmEzYWYiIHN0cm9rZS13aWR0aD0iMjAiIC8+PGNpcmNsZSBjeD0iMzEwIiBjeT0iMTkwIiByPSIzNSIgZmlsbD0iIzliYTNhZiIgLz48cG9seWdvbiBwb2ludHM9IjgwLDM4MCAyMTAsMTk1IDMxNSwzODAiIGZpbGw9IiM5YmEzYWYiIC8+PHBvbHlnb24gcG9pbnRzPSIyMTUsMzgwIDMyNSwyMzAgNDIwLDM4MCIgZmlsbD0iIzliYTNhZiIgLz48L3N2Zz4=";

interface OrderDetailViewProps {
  selectedOrderDetail: OrderManagementItem;
  setSelectedOrderDetail: React.Dispatch<React.SetStateAction<OrderManagementItem | null>>;
  setIsOrderDetailOpen: (open: boolean) => void;
  setOrders: React.Dispatch<React.SetStateAction<OrderManagementItem[]>>;
  triggerToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  handleUpdateOrderStatus: (id: string, status: any) => void;
  onCreateLabel: (order: OrderManagementItem, shipmentActiveIdx?: number) => void;
  setIsVoidConfirmOpen: (open: boolean) => void;
  setIsShipmentDetailsModalOpen: (open: boolean) => void;
  setIsShipmentItemsModalOpen: (open: boolean) => void;

  // Address edit state props passed from parent
  isEditingShipAddress: boolean;
  setIsEditingShipAddress: (val: boolean) => void;
  shipName: string;
  setShipName: (val: string) => void;
  shipCompanyLine: string;
  setShipCompanyLine: (val: string) => void;
  shipAddressLine: string;
  setShipAddressLine: (val: string) => void;
  shipAddress2: string;
  setShipAddress2: (val: string) => void;
  shipCity: string;
  setShipCity: (val: string) => void;
  shipState: string;
  setShipState: (val: string) => void;
  shipZip: string;
  setShipZip: (val: string) => void;
  shipCountry: string;
  setShipCountry: (val: string) => void;
  shipPhone: string;
  setShipPhone: (val: string) => void;
  shipEmail: string;
  setShipEmail: (val: string) => void;
  isPasteAddressOpen: boolean;
  setIsPasteAddressOpen: (val: boolean) => void;
  rawAddressToPaste: string;
  setRawAddressToPaste: (val: string) => void;
  handleSaveShipAddress: () => void;
  parseUSAddress: (text: string) => any;
  products?: Product[];
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({
  selectedOrderDetail,
  setSelectedOrderDetail,
  setIsOrderDetailOpen,
  setOrders,
  triggerToast,
  handleUpdateOrderStatus,
  onCreateLabel,
  setIsVoidConfirmOpen,
  setIsShipmentDetailsModalOpen,
  setIsShipmentItemsModalOpen,

  isEditingShipAddress,
  setIsEditingShipAddress,
  shipName,
  setShipName,
  shipCompanyLine,
  setShipCompanyLine,
  shipAddressLine,
  setShipAddressLine,
  shipAddress2,
  setShipAddress2,
  shipCity,
  setShipCity,
  shipState,
  setShipState,
  shipZip,
  setShipZip,
  shipCountry,
  setShipCountry,
  shipPhone,
  setShipPhone,
  shipEmail,
  setShipEmail,
  isPasteAddressOpen,
  setIsPasteAddressOpen,
  rawAddressToPaste,
  setRawAddressToPaste,
  handleSaveShipAddress,
  parseUSAddress,
  products = []
}) => {
  const [pendingShippingMethod, setPendingShippingMethod] = useState<string | null>(null);
  const [pendingOrderStatus, setPendingOrderStatus] = useState<string | null>(null);
  const [orderCommentText, setOrderCommentText] = useState("");
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);
  const [isPrintDropdownOpen, setIsPrintDropdownOpen] = useState(false);
  const [submenu, setSubmenu] = useState<'main' | 'status' | 'shipping'>('main');

  const [hoveredProductImage, setHoveredProductImage] = useState<{
    src: string;
    name: string;
    x: number;
    y: number;
  } | null>(null);

  // Return Address Editing States
  const [isEditingReturnAddress, setIsEditingReturnAddress] = useState(false);
  const [returnName, setReturnName] = useState("");
  const [returnCompanyLine, setReturnCompanyLine] = useState("");
  const [returnEmail, setReturnEmail] = useState("");
  const [returnPhone, setReturnPhone] = useState("");
  const [returnCountry, setReturnCountry] = useState("United States");
  const [returnAddressLine, setReturnAddressLine] = useState("");
  const [returnAddress2, setReturnAddress2] = useState("");
  const [returnCity, setReturnCity] = useState("");
  const [returnState, setReturnState] = useState("");
  const [returnZip, setReturnZip] = useState("");
  const [returnCityStateZip, setReturnCityStateZip] = useState("");

  const handleSaveReturnAddress = () => {
    if (!selectedOrderDetail) return;
    const updatedReturnAddress = {
      name: returnName,
      companyLine: returnCompanyLine,
      addressLine: returnAddressLine,
      address2: returnAddress2,
      city: returnCity,
      state: returnState,
      zip: returnZip,
      country: returnCountry,
      cityStateZip: `${returnState ? returnState + ', ' : ''}${returnZip || ''}${returnCountry ? ', ' + returnCountry : ''}`,
      phone: returnPhone,
      email: returnEmail
    };

    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const newAct = {
      id: `act_${Date.now()}`,
      date: nowStr,
      action: `Return address updated to "${returnName}, ${returnAddressLine}"`,
      performedBy: 'Hiep Admin'
    };

    setOrders(prev => prev.map(o => {
      if (o.id === selectedOrderDetail.id) {
        return {
          ...o,
          returnAddress: updatedReturnAddress,
          activityHistory: [newAct, ...(o.activityHistory || [])]
        };
      }
      return o;
    }));

    setSelectedOrderDetail(prev => prev ? {
      ...prev,
      returnAddress: updatedReturnAddress,
      activityHistory: [newAct, ...(prev.activityHistory || [])]
    } : null);

    setIsEditingReturnAddress(false);
    triggerToast('Return address updated successfully!', 'success');
  };

  const scrollToTimeline = () => {
    const el = document.getElementById("order-timeline-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'new':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'prepared':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'shipped':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'canceled':
      case 'rejected':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-[600px] w-full font-sans">
      {/* Breadcrumbs & Back Button */}
      <div className="flex items-center gap-3 mb-3 text-left">
        <button
          type="button"
          onClick={() => setIsOrderDetailOpen(false)}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 rounded-lg transition-all cursor-pointer shadow-3xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back</span>
        </button>
        <span className="text-slate-200">|</span>
        <div className="text-xs text-slate-400 font-medium flex items-baseline gap-1.5 select-none">
          <button
            type="button"
            onClick={() => {
              setIsOrderDetailOpen(false);
            }}
            className="hover:text-slate-700 transition font-semibold"
          >
            Manage orders
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-slate-600 font-semibold">Order details</span>
        </div>
      </div>

      {/* Top Header Row with status & destination badges */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-slate-900 select-all tracking-tight font-mono">
            #{selectedOrderDetail.orderNumber}
          </h1>
          
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border select-none ${getStatusBadgeStyle(selectedOrderDetail.orderStatus || 'New')}`}>
            {selectedOrderDetail.orderStatus || 'New'}
          </span>

          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border select-none ${
            selectedOrderDetail.destinationType === 'International'
              ? 'bg-amber-100 text-amber-800 border border-amber-200'
              : 'bg-slate-100 text-slate-800 border border-slate-200'
          }`}>
            {selectedOrderDetail.destinationType || 'Domestic'}
          </span>

          {selectedOrderDetail.insertType && (
            <>
              <div className="h-4 w-[1px] bg-slate-300 self-center mx-1" />
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border select-none ${
                selectedOrderDetail.insertType === 'Thank You Card'
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : selectedOrderDetail.insertType === 'Gift Message'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {selectedOrderDetail.insertType}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Scroll to comment section button as a clean circular/rounded-square button containing MessageSquare icon */}
          <button
            type="button"
            onClick={scrollToTimeline}
            className="h-10 w-10 flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg shadow-2xs transition cursor-pointer"
            title="Scroll to Comments"
          >
            <MessageSquare className="h-4 w-4 text-slate-600" />
          </button>

          {/* Action Menu Dropdown - clean white border style exactly like screenshot */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsActionsDropdownOpen(!isActionsDropdownOpen);
                setSubmenu('main');
              }}
              className="h-10 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg inline-flex items-center justify-center font-bold text-xs transition shadow-2xs cursor-pointer select-none gap-1.5 focus:outline-none"
            >
              <span>Actions</span>
              <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-150 ${isActionsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isActionsDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 px-2 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                {submenu === 'main' && (
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => setSubmenu('status')}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-md transition cursor-pointer flex items-center justify-between pointer-events-auto"
                    >
                      <span>Update Order Status</span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    </button>

                    <div className="border-t border-slate-100 my-1.5" />
                    <button
                      type="button"
                      onClick={() => {
                        setIsActionsDropdownOpen(false);
                        onCreateLabel(selectedOrderDetail);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-brand-600 hover:bg-brand-50 rounded-md transition cursor-pointer pointer-events-auto"
                    >
                      Create Shipping Label
                    </button>
                  </div>
                )}

                {submenu === 'status' && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setSubmenu('main')}
                      className="w-full text-left px-3 py-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 select-none border-b border-slate-100 mb-1.5 cursor-pointer"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span>Back to Actions</span>
                    </button>
                    <div className="space-y-0.5">
                      {['New', 'Prepared', 'Shipped'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => {
                            handleUpdateOrderStatus(selectedOrderDetail.id, status);
                            triggerToast(`Order status updated to ${status}`, 'success');
                            setIsActionsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer flex items-center justify-between ${
                            selectedOrderDetail.orderStatus === status 
                              ? 'bg-slate-100 text-slate-800 font-bold' 
                              : 'hover:bg-slate-50 text-slate-650'
                          }`}
                        >
                          <span>{status}</span>
                          {selectedOrderDetail.orderStatus === status && <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {submenu === 'shipping' && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setSubmenu('main')}
                      className="w-full text-left px-3 py-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 select-none border-b border-slate-100 mb-1.5 cursor-pointer"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span>Back to Actions</span>
                    </button>
                    <div className="space-y-0.5">
                      {['UPS Ground', 'FedEx Express', 'DHL Worldwide', 'USPS Priority'].map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => {
                            const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                            const newAct = {
                              id: `act_${Date.now()}`,
                              date: nowStr,
                              action: `Shipping method updated to ${method}`,
                              performedBy: 'Hiep Admin'
                            };

                            setOrders(prev => prev.map(o => {
                              if (o.id === selectedOrderDetail.id) {
                                return { 
                                  ...o, 
                                  shippingMethod: method,
                                  activityHistory: [newAct, ...(o.activityHistory || [])]
                                };
                              }
                              return o;
                            }));

                            setSelectedOrderDetail(prev => prev ? { 
                              ...prev, 
                              shippingMethod: method,
                              activityHistory: [newAct, ...(prev.activityHistory || [])]
                            } : null);

                            triggerToast(`Shipping method updated to ${method}`, 'success');
                            setIsActionsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer flex items-center justify-between ${
                            selectedOrderDetail.shippingMethod === method
                              ? 'bg-slate-100 text-slate-800 font-bold'
                              : 'hover:bg-slate-50 text-slate-650'
                          }`}
                        >
                          <span>{method}</span>
                          {selectedOrderDetail.shippingMethod === method && <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="space-y-6 text-left">
        {/* Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT COLUMN: Order items -> Shipment -> Timeline */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Section 1: Order items (No Collapsible anymore) */}
            <div className="border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white select-none">
                <span className="text-sm font-bold text-slate-800 uppercase tracking-wider select-none">
                  ORDER ITEMS
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#f8fafc]/80 text-[#64748b] border-b border-slate-100 select-none">
                    <tr>
                      <th className="py-3 px-5 text-left font-semibold text-slate-500 text-xs">Product</th>
                      <th className="py-3 px-5 text-left font-semibold text-slate-500 text-xs">Style / Color / Size</th>
                      <th className="py-3 px-5 text-left font-semibold text-slate-500 text-xs">SKU</th>
                      <th className="py-3 px-5 text-right font-semibold text-slate-500 text-xs">Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {selectedOrderDetail.orderItems && selectedOrderDetail.orderItems.length > 0 ? (
                      selectedOrderDetail.orderItems.map((item, index) => {
                        const productImg = (() => {
                          const matched = products.find(p => {
                            if (p.sku && item.sku) {
                              const pSkuUpper = p.sku.toUpperCase();
                              const itemSkuUpper = item.sku.toUpperCase();
                              if (pSkuUpper.includes(itemSkuUpper) || itemSkuUpper.includes(pSkuUpper)) {
                                return true;
                              }
                            }
                            if (p.name && item.productName) {
                              if (p.name.trim().toUpperCase() === item.productName.trim().toUpperCase()) {
                                return true;
                              }
                            }
                            return false;
                          });
                          return matched?.image || itemThumbImg;
                        })();

                        return (
                          <tr key={index} className="hover:bg-slate-50/50">
                            <td className="py-3 px-5 font-medium text-slate-800 text-sm">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="h-10 w-10 flex-shrink-0 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center cursor-zoom-in transition-transform duration-200 hover:scale-105"
                                  onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const previewHeight = 240;
                                    const previewWidth = 240;
                                    const space = 12;
                                    let x = rect.right + space;
                                    let y = rect.top + rect.height / 2 - previewHeight / 2;
                                    if (x + previewWidth > window.innerWidth) {
                                      x = rect.left - previewWidth - space;
                                    }
                                    y = Math.max(10, Math.min(window.innerHeight - previewHeight - 10, y));
                                    setHoveredProductImage({
                                      src: productImg,
                                      name: item.productName,
                                      x,
                                      y
                                    });
                                  }}
                                  onMouseLeave={() => setHoveredProductImage(null)}
                                >
                                  <img 
                                    src={productImg} 
                                    alt={item.productName} 
                                    className="h-full w-full object-cover" 
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <span>{item.productName}</span>
                              </div>
                            </td>
                            <td className="py-4 px-5 font-mono text-xs text-slate-600">{item.styleColor}</td>
                            <td className="py-4 px-5 font-mono text-xs text-slate-600">{item.sku}</td>
                            <td className="py-4 px-5 text-right font-mono font-medium text-slate-800 text-sm">{item.quantity}</td>
                          </tr>
                        );
                      })
                    ) : (
                      (() => {
                        const productImg = (() => {
                          const matched = products.find(p => {
                            if (p.sku) {
                              const pSkuUpper = p.sku.toUpperCase();
                              if (pSkuUpper.includes('APP-CRW-002') || 'APP-CRW-002'.includes(pSkuUpper)) {
                                return true;
                              }
                            }
                            if (p.name) {
                              if (p.name.trim().toUpperCase() === 'CLASSIC CREWNECK APPAREL') {
                                return true;
                              }
                            }
                            return false;
                          });
                          return matched?.image || itemThumbImg;
                        })();

                        return (
                          <tr className="hover:bg-slate-50/50">
                            <td className="py-3 px-5 font-medium text-slate-800 text-sm">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="h-10 w-10 flex-shrink-0 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center cursor-zoom-in transition-transform duration-200 hover:scale-105"
                                  onMouseEnter={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const previewHeight = 240;
                                    const previewWidth = 240;
                                    const space = 12;
                                    let x = rect.right + space;
                                    let y = rect.top + rect.height / 2 - previewHeight / 2;
                                    if (x + previewWidth > window.innerWidth) {
                                      x = rect.left - previewWidth - space;
                                    }
                                    y = Math.max(10, Math.min(window.innerHeight - previewHeight - 10, y));
                                    setHoveredProductImage({
                                      src: productImg,
                                      name: "Classic Crewneck Apparel",
                                      x,
                                      y
                                    });
                                  }}
                                  onMouseLeave={() => setHoveredProductImage(null)}
                                >
                                  <img 
                                    src={productImg} 
                                    alt="Classic Crewneck Apparel" 
                                    className="h-full w-full object-cover" 
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <span>Classic Crewneck Apparel</span>
                              </div>
                            </td>
                            <td className="py-4 px-5 font-mono text-xs text-slate-600">Charcoal / M</td>
                            <td className="py-4 px-5 font-mono text-xs text-slate-600">APP-CRW-002</td>
                            <td className="py-4 px-5 text-right font-mono font-medium text-slate-800 text-sm">{selectedOrderDetail.quantity}</td>
                          </tr>
                        );
                      })()
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: Shipment Card */}
            <div>
              {(() => {
                const shipmentsList = selectedOrderDetail.shipments && selectedOrderDetail.shipments.length > 0
                  ? selectedOrderDetail.shipments
                  : (selectedOrderDetail.shipmentInfo ? [selectedOrderDetail.shipmentInfo] : []);
                
                if (shipmentsList.length > 0) {
                  return (
                    <div className="space-y-4">
                      {shipmentsList.map((shp, idx) => (
                        <div key={shp.trackingNumber} className="border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden">
                          {/* Card Header exactly matching the screenshot style */}
                          <div className="px-5 py-3.5 border-b border-slate-100 bg-white flex items-center justify-between select-none">
                            <span className="font-bold text-slate-800 text-sm tracking-wider uppercase select-none">
                              Shipment {idx + 1} - {shp.trackingNumber || '12391283912'}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => onCreateLabel(selectedOrderDetail, idx)}
                                className="h-8 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white font-bold rounded-lg text-xs shadow-2xs transition focus:outline-none cursor-pointer inline-flex items-center select-none"
                              >
                                View details
                              </button>
                            </div>
                          </div>

                          {/* Info Grid - Styled exactly as 3 columns layout in the screenshot */}
                          <div className="p-5 flex flex-col md:flex-row md:items-stretch gap-6 text-left">
                            {/* Information Columns */}
                            <div className="flex-1 grid grid-cols-3 gap-y-5 gap-x-6">
                              <div>
                                <span className="block text-xs font-semibold text-slate-500 font-sans select-none">Tracking</span>
                                <span className="text-sm font-semibold text-slate-800 mt-1 block font-mono select-all tracking-tight leading-none text-wrap break-all">{shp.trackingNumber || '1LSDBVU000ZLLNI'}</span>
                              </div>
                              <div>
                                <span className="block text-xs font-semibold text-slate-500 font-sans select-none">Status</span>
                                <span className="text-sm font-medium text-slate-800 mt-1 block font-sans leading-none">{shp.shippingMethod || 'FLAT'}</span>
                              </div>
                              <div>
                                <span className="block text-xs font-semibold text-slate-500 font-sans select-none">Service</span>
                                <span className="text-sm font-medium text-slate-800 mt-1 block font-sans leading-none">{shp.service || 'USPS'}</span>
                              </div>

                              <div>
                                <span className="block text-xs font-semibold text-slate-500 font-sans select-none">Size (inch)</span>
                                <span className="text-sm font-medium font-mono text-slate-800 mt-1 block leading-none">{shp.size || '15 × 12 × 10'}</span>
                              </div>
                              <div>
                                <span className="block text-xs font-semibold text-slate-500 font-sans select-none">Weight</span>
                                <span className="text-sm font-medium text-slate-800 mt-1 block font-sans leading-none">{shp.weight || '12.4 lbs'}</span>
                              </div>
                              <div>
                                <span className="block text-xs font-semibold text-slate-500 font-sans select-none">Price</span>
                                <span className="text-sm font-medium text-slate-800 mt-1 block font-sans leading-none">{shp.price || '$7.22'}</span>
                              </div>
                            </div>

                            {/* Highlighted Number of item section as requested */}
                            <div 
                              className="md:w-36 border border-slate-200 rounded-xl p-3 bg-slate-50/80 shadow-2xs relative select-none flex flex-col items-center justify-center min-h-[90px]"
                            >
                              <span className="block text-xs font-semibold text-slate-500 font-sans leading-none text-center">
                                Number of items
                              </span>
                              <span className="text-xl font-extrabold text-slate-800 mt-2 block font-mono leading-none">
                                {selectedOrderDetail.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || selectedOrderDetail.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                } else {
                  return (
                    <div className="border border-slate-200 rounded-xl bg-white p-5 space-y-3">
                      <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider select-none">
                        <span>Shipment</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => onCreateLabel(selectedOrderDetail)}
                        className="w-full h-10 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shadow-brand-100"
                      >
                        Create Shipping Label
                      </button>
                    </div>
                  );
                }
              })()}
            </div>

            {/* Section 3: Notes & Timeline */}
            <div id="order-timeline-section" className="border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden font-sans">
              <div className="px-5 py-4 border-b border-slate-100 bg-white flex items-center justify-between select-none">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider select-none">
                  TIMELINE
                </h4>
              </div>

              <div className="p-5 space-y-4">
                {/* Note area */}
                <div className="space-y-3">
                  <div className="relative">
                    <textarea
                      value={orderCommentText}
                      onChange={(e) => setOrderCommentText(e.target.value)}
                      placeholder="Type comment here and press Enter to append to log..."
                      rows={3}
                      className="w-full text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition bg-slate-50/40 border border-slate-200 rounded-lg px-3 py-2.5 resize-none font-sans"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          const trimmedVal = orderCommentText.trim();
                          if (!trimmedVal) return;
                          const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                          const newAct = {
                            id: `act_${Date.now()}`,
                            date: nowStr,
                            action: `Internal note: "${trimmedVal}"`,
                            performedBy: 'Hiep Admin'
                          };

                          setOrders(prev => prev.map(o => {
                            if (o.id === selectedOrderDetail.id) {
                                return {
                                  ...o,
                                  internalNotes: trimmedVal,
                                  activityHistory: [newAct, ...(o.activityHistory || [])]
                                };
                            }
                            return o;
                          }));

                          setSelectedOrderDetail(prev => prev ? {
                            ...prev,
                            internalNotes: trimmedVal,
                            activityHistory: [newAct, ...(prev.activityHistory || [])]
                          } : null);

                          setOrderCommentText('');
                          triggerToast('Internal note saved!', 'success');
                        }
                      }}
                    />
                    <div className="absolute bottom-2.5 right-2 text-[10px] text-slate-400 font-medium select-none">
                      Press Enter to add
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="pt-1">
                  <div className="relative border-l-2 border-slate-100 ml-2 pl-4 space-y-4 py-1 text-left">
                    {selectedOrderDetail.activityHistory && selectedOrderDetail.activityHistory.length > 0 ? (
                      selectedOrderDetail.activityHistory.map((act) => (
                        <div key={act.id} className="relative">
                          {/* Dot */}
                          <span className="absolute -left-[21px] top-[4px] h-2.5 w-2.5 rounded-full border border-slate-200 bg-white flex items-center justify-center">
                            <span className="h-1 w-1 rounded-full bg-slate-400" />
                          </span>
                          <div>
                            <p className="text-xs font-medium text-slate-800 leading-normal">{act.action}</p>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1 font-sans">
                              <span className="font-semibold text-slate-500">{act.performedBy}</span>
                              <span>•</span>
                              <span>{act.date}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="relative">
                        <span className="absolute -left-[21px] top-[4px] h-2.5 w-2.5 rounded-full border border-brand-500 bg-white flex items-center justify-center">
                          <span className="h-1 w-1 rounded-full bg-brand-505" />
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-slate-800 leading-normal">Order Registered</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1 font-sans">
                            <span className="font-semibold text-slate-500 font-sans">Client Integration API</span>
                            <span>•</span>
                            <span>{selectedOrderDetail.orderDate}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Order Information -> Shipment Addresses */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Section 1: Order Information (General Info & Method) */}
            <div className="border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-white select-none">
                <span className="text-sm font-bold text-slate-800 uppercase tracking-wider select-none">
                  ORDER INFORMATION
                </span>
              </div>

              <div className="p-5 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs font-semibold text-slate-500 font-sans select-none">Store Name</span>
                    <span className="text-sm font-medium text-slate-800 mt-1 block font-sans">{selectedOrderDetail.customerStore || 'Olivia Rhye'}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-500 font-sans select-none">Order Status</span>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border select-none ${getStatusBadgeStyle(selectedOrderDetail.orderStatus || 'New')}`}>
                        {selectedOrderDetail.orderStatus || 'New'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                  <div>
                    <span className="block text-xs font-semibold text-slate-500 font-sans select-none">Order Date</span>
                    <span className="text-sm font-medium text-slate-800 mt-1 block font-sans">{selectedOrderDetail.orderDate}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-slate-500 font-sans select-none">Total Qty</span>
                    <span className="text-sm font-medium text-slate-800 mt-1 block font-sans">{selectedOrderDetail.quantity}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Shipment address card */}
            <div className="border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-white select-none">
                <span className="text-sm font-bold text-slate-800 uppercase tracking-wider select-none">
                  SHIPMENT ADDRESSES
                </span>
              </div>

              <div className="p-5 text-left">
                {/* Return Address */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-sans">
                    <h4 className="text-xs font-semibold text-slate-500 font-sans select-none">Return Address</h4>
                    {!isEditingReturnAddress ? (
                      <button
                        type="button"
                        onClick={() => {
                          const rAddr: any = selectedOrderDetail.returnAddress || {};
                          setReturnName(rAddr.name || 'mytest');
                          setReturnCompanyLine(rAddr.companyLine || 'Company_address-1');
                          setReturnAddressLine((rAddr.addressLine || '715 Broadway2313').replace(/,\s*$/, ''));
                          setReturnAddress2(rAddr.address2 || '');
                          setReturnCity(rAddr.city || 'New York');
                          setReturnState(rAddr.state || 'New York');
                          setReturnZip(rAddr.zip || '20912');
                          setReturnCountry(rAddr.country || 'United States');
                          setReturnPhone(rAddr.phone || '');
                          setReturnEmail(rAddr.email || '');
                          setIsEditingReturnAddress(true);
                        }}
                        className="text-xs font-semibold text-brand-650 hover:text-brand-850 transition cursor-pointer"
                      >
                        Edit
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingReturnAddress(false)}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-705 transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <span className="text-slate-300 text-xs">|</span>
                        <button
                          type="button"
                          onClick={handleSaveReturnAddress}
                          className="text-xs font-bold text-brand-650 hover:text-brand-700 transition cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>

                  {!isEditingReturnAddress ? (
                    <div className="text-slate-800 space-y-0.5 font-sans leading-relaxed pb-1 text-left text-sm font-medium">
                      <p className="font-bold text-slate-900">{selectedOrderDetail.returnAddress?.name || 'mytest'}</p>
                      {selectedOrderDetail.returnAddress?.companyLine ? <p>{selectedOrderDetail.returnAddress.companyLine}</p> : null}
                      <p>
                        {selectedOrderDetail.returnAddress?.addressLine || '715 Broadway2313'}
                        {selectedOrderDetail.returnAddress?.address2 ? `, ${selectedOrderDetail.returnAddress.address2}` : ''}
                      </p>
                      <p>
                        {selectedOrderDetail.returnAddress?.city || 'New York'}
                        {selectedOrderDetail.returnAddress?.state ? `, ${selectedOrderDetail.returnAddress.state}` : ''}
                        {selectedOrderDetail.returnAddress?.zip ? ` ${selectedOrderDetail.returnAddress.zip}` : ''}
                        {selectedOrderDetail.returnAddress?.country ? `, ${selectedOrderDetail.returnAddress.country}` : ''}
                      </p>
                      {selectedOrderDetail.returnAddress?.phone ? <p>{selectedOrderDetail.returnAddress.phone}</p> : null}
                      {selectedOrderDetail.returnAddress?.email ? <p>{selectedOrderDetail.returnAddress.email}</p> : null}
                    </div>
                  ) : (
                    <div className="space-y-3 pb-1 text-xs">
                      {/* Name Field */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={returnName}
                          placeholder="Name"
                          onChange={(e) => setReturnName(e.target.value)}
                          className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-9 font-sans font-medium"
                        />
                      </div>

                      {/* Company & Email row */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Company</label>
                          <input
                            type="text"
                            value={returnCompanyLine}
                            placeholder="Company"
                            onChange={(e) => setReturnCompanyLine(e.target.value)}
                            className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-9 font-sans font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label>
                          <input
                            type="text"
                            value={returnEmail}
                            placeholder="Email"
                            onChange={(e) => setReturnEmail(e.target.value)}
                            className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-9 font-sans font-medium"
                          />
                        </div>
                      </div>

                      {/* Phone & Country row */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Phone</label>
                          <input
                            type="text"
                            value={returnPhone}
                            placeholder="Phone"
                            onChange={(e) => setReturnPhone(e.target.value)}
                            className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-9 font-sans font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Country <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={returnCountry}
                            placeholder="Country"
                            onChange={(e) => setReturnCountry(e.target.value)}
                            className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-9 font-sans font-medium"
                          />
                        </div>
                      </div>

                      {/* Address Line 1 */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Address line 1 <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={returnAddressLine}
                          placeholder="Address line 1"
                          onChange={(e) => setReturnAddressLine(e.target.value)}
                          className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-9 font-sans font-medium"
                        />
                      </div>

                      {/* Address Line 2 */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Address line 2</label>
                        <input
                          type="text"
                          value={returnAddress2}
                          placeholder="Address line 2"
                          onChange={(e) => setReturnAddress2(e.target.value)}
                          className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-9 font-sans font-medium"
                        />
                      </div>

                      {/* City & State row */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">City <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={returnCity}
                            placeholder="City"
                            onChange={(e) => setReturnCity(e.target.value)}
                            className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-9 font-sans font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">ZIP / Postcode <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={returnZip}
                            placeholder="ZIP / Postcode"
                            onChange={(e) => setReturnZip(e.target.value)}
                            className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-9 font-sans font-medium text-left"
                          />
                        </div>
                      </div>

                      {/* State selector */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">State / Province / Region</label>
                        <select
                          value={returnState}
                          onChange={(e) => setReturnState(e.target.value)}
                          className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2 py-1 h-9 focus:outline-none cursor-pointer text-slate-700 font-sans font-medium"
                        >
                          <option value="">Select state / province / region</option>
                          {US_STATES.map((stateOption) => (
                            <option key={stateOption.code} value={stateOption.name}>
                              {stateOption.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 my-4" />

                {/* Ship Address */}
                <div className="space-y-2 text-left">
                  <div className="flex items-center justify-between font-sans">
                    <h4 className="text-xs font-semibold text-slate-500 font-sans select-none">Ship Address</h4>
                    {!isEditingShipAddress ? (
                      <button
                        type="button"
                        onClick={() => {
                          const sAddr = selectedOrderDetail.shipAddress || {
                            name: 'Auo Tivi',
                            companyLine: '',
                            addressLine: '3002 WOLF LAKE BLVD',
                            address2: '',
                            city: 'NEW ALBANY',
                            state: 'Indiana',
                            zip: '80201',
                            country: 'United States',
                            phone: '9734508586',
                            email: ''
                          };
                          setShipName(sAddr.name || '');
                          setShipCompanyLine(sAddr.companyLine || '');
                          setShipAddressLine(sAddr.addressLine ? sAddr.addressLine.replace(/,\s*$/, '') : '');
                          setShipAddress2(sAddr.address2 || '');
                          setShipCity(sAddr.city || 'NEW ALBANY');
                          setShipState(sAddr.state || 'Indiana');
                          setShipZip(sAddr.zip || '80201');
                          setShipCountry(sAddr.country || 'United States');
                          setShipPhone(sAddr.phone || '');
                          setShipEmail(sAddr.email || '');
                          setIsEditingShipAddress(true);
                        }}
                        className="text-xs font-semibold text-brand-650 hover:text-brand-850 transition cursor-pointer"
                      >
                        Edit
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingShipAddress(false)}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-705 transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <span className="text-slate-300 text-xs">|</span>
                        <button
                          type="button"
                          onClick={handleSaveShipAddress}
                          className="text-xs font-bold text-brand-650 hover:text-brand-700 transition cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>

                  {!isEditingShipAddress ? (
                    <div className="text-slate-800 space-y-0.5 font-sans leading-relaxed pb-1 text-left text-sm font-medium">
                      <p className="font-bold text-slate-900">{selectedOrderDetail.shipAddress?.name || 'Auo Tivi'}</p>
                      {selectedOrderDetail.shipAddress?.companyLine ? <p>{selectedOrderDetail.shipAddress.companyLine}</p> : null}
                      <p>
                        {selectedOrderDetail.shipAddress?.addressLine || '3002 WOLF LAKE BLVD'}
                        {selectedOrderDetail.shipAddress?.address2 ? `, ${selectedOrderDetail.shipAddress.address2}` : ''}
                      </p>
                      <p>
                        {selectedOrderDetail.shipAddress?.city || 'NEW ALBANY'}
                        {selectedOrderDetail.shipAddress?.state ? `, ${selectedOrderDetail.shipAddress.state}` : ''}
                        {selectedOrderDetail.shipAddress?.zip ? ` ${selectedOrderDetail.shipAddress.zip}` : ''}
                        {selectedOrderDetail.shipAddress?.country ? `, ${selectedOrderDetail.shipAddress.country}` : ''}
                      </p>
                      <p>{selectedOrderDetail.shipAddress?.phone || '9734508586'}</p>
                      {selectedOrderDetail.shipAddress?.email ? <p>{selectedOrderDetail.shipAddress.email}</p> : null}
                    </div>
                  ) : (
                    <div className="space-y-4 pt-1 font-sans text-left">
                      {isPasteAddressOpen ? (
                        <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-2.5 space-y-2">
                          <h5 className="text-xs font-bold text-blue-800">Paste Address Block</h5>
                          <textarea
                            value={rawAddressToPaste}
                            onChange={(e) => setRawAddressToPaste(e.target.value)}
                            placeholder="Paste here..."
                            className="w-full h-20 p-2 bg-white border border-blue-200 rounded text-xs focus:outline-none"
                          />
                          <div className="flex justify-end gap-1.5 text-[10px]">
                            <button
                              type="button"
                              onClick={() => setIsPasteAddressOpen(false)}
                              className="px-2 py-1 text-slate-500 hover:text-slate-700 bg-slate-100 rounded cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const parsed = parseUSAddress(rawAddressToPaste);
                                if (parsed) {
                                  if (parsed.name) setShipName(parsed.name);
                                  if (parsed.company) setShipCompanyLine(parsed.company);
                                  if (parsed.address1) setShipAddressLine(parsed.address1);
                                  if (parsed.address2) setShipAddress2(parsed.address2);
                                  if (parsed.city) setShipCity(parsed.city);
                                  if (parsed.state) setShipState(parsed.state);
                                  if (parsed.zip) setShipZip(parsed.zip);
                                  if (parsed.country) setShipCountry(parsed.country);
                                  if (parsed.phone) setShipPhone(parsed.phone);
                                  if (parsed.email) setShipEmail(parsed.email);
                                  triggerToast('Address parsed successfully!', 'success');
                                  setIsPasteAddressOpen(false);
                                } else {
                                  triggerToast('Could not parse address text.', 'info');
                                }
                              }}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold cursor-pointer"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-md p-1.5 px-3">
                          <span className="text-[11px] text-slate-500">Need to auto-paste?</span>
                          <button
                            type="button"
                            onClick={() => setIsPasteAddressOpen(true)}
                            className="text-[11px] font-semibold text-blue-650 hover:text-blue-805 hover:underline cursor-pointer"
                          >
                            Paste Address Block
                          </button>
                        </div>
                      )}

                      <div className="space-y-3 pb-1 text-xs">
                        {/* Name Field */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Name <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={shipName}
                            placeholder="Name"
                            onChange={(e) => setShipName(e.target.value)}
                            className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-9 font-sans font-medium"
                          />
                        </div>

                        {/* Company & Email row */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Company</label>
                            <input
                              type="text"
                              value={shipCompanyLine}
                              placeholder="Company"
                              onChange={(e) => setShipCompanyLine(e.target.value)}
                              className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-9 font-sans font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email</label>
                            <input
                              type="text"
                              value={shipEmail}
                              placeholder="Email"
                              onChange={(e) => setShipEmail(e.target.value)}
                              className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-9 font-sans font-medium"
                            />
                          </div>
                        </div>

                        {/* Phone & Country row */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Phone</label>
                            <input
                              type="text"
                              value={shipPhone}
                              placeholder="Phone"
                              onChange={(e) => setShipPhone(e.target.value)}
                              className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-9 font-sans font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Country <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              value={shipCountry}
                              placeholder="Country"
                              onChange={(e) => setShipCountry(e.target.value)}
                              className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-9 font-sans font-medium"
                            />
                          </div>
                        </div>

                        {/* Address Line 1 */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Address line 1 <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={shipAddressLine}
                            placeholder="Address line 1"
                            onChange={(e) => setShipAddressLine(e.target.value)}
                            className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-9 font-sans font-medium"
                          />
                        </div>

                        {/* Address Line 2 */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Address line 2</label>
                          <input
                            type="text"
                            value={shipAddress2}
                            placeholder="Address line 2"
                            onChange={(e) => setShipAddress2(e.target.value)}
                            className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-9 font-sans font-medium"
                          />
                        </div>

                        {/* City & State row */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">City <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              value={shipCity}
                              placeholder="City"
                              onChange={(e) => setShipCity(e.target.value)}
                              className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-9 font-sans font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">ZIP / Postcode <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              value={shipZip}
                              placeholder="ZIP / Postcode"
                              onChange={(e) => setShipZip(e.target.value)}
                              className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-9 font-sans font-medium text-left"
                            />
                          </div>
                        </div>

                        {/* State selector */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">State / Province / Region</label>
                          <select
                            value={shipState}
                            onChange={(e) => setShipState(e.target.value)}
                            className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2 py-1 h-9 focus:outline-none cursor-pointer text-slate-700 font-sans font-medium"
                          >
                            <option value="">Select state / province / region</option>
                            {US_STATES.map((stateOption) => (
                              <option key={stateOption.code} value={stateOption.name}>
                                {stateOption.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <AnimatePresence>
        {hoveredProductImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: "fixed",
              left: hoveredProductImage.x,
              top: hoveredProductImage.y,
              zIndex: 9999,
              pointerEvents: "none",
            }}
            className="w-60 h-60 bg-white rounded-xl shadow-2xl border border-slate-200/85 p-1.5 overflow-hidden flex items-center justify-center select-none"
          >
            <div className="w-full h-full rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-100">
              <img
                src={hoveredProductImage.src}
                alt={hoveredProductImage.name}
                className="max-h-full max-w-full object-contain p-2"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
