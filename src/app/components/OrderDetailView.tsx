import React, { useState } from "react";
import { 
  ChevronLeft, ChevronRight, ChevronDown, Copy, Printer, Eye, ShoppingCart, Package, MapPin, FileText, ClipboardList, MessageSquare 
} from "lucide-react";
import { OrderManagementItem } from "../types";

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

interface OrderDetailViewProps {
  selectedOrderDetail: OrderManagementItem;
  setSelectedOrderDetail: React.Dispatch<React.SetStateAction<OrderManagementItem | null>>;
  setIsOrderDetailOpen: (open: boolean) => void;
  setOrders: React.Dispatch<React.SetStateAction<OrderManagementItem[]>>;
  triggerToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  handleUpdateOrderStatus: (id: string, status: any) => void;
  onCreateLabel: (order: OrderManagementItem) => void;
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
  parseUSAddress
}) => {
  const [pendingShippingMethod, setPendingShippingMethod] = useState<string | null>(null);
  const [pendingOrderStatus, setPendingOrderStatus] = useState<string | null>(null);
  const [orderCommentText, setOrderCommentText] = useState("");
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);
  const [isPrintDropdownOpen, setIsPrintDropdownOpen] = useState(false);
  const [submenu, setSubmenu] = useState<'main' | 'status' | 'shipping'>('main');

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
      {/* Breadcrumbs */}
      <div className="text-xs text-slate-400 font-medium mb-3 flex items-center gap-1.5 select-none text-left">
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
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setSubmenu('status')}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-md transition cursor-pointer flex items-center justify-between pointer-events-auto"
                    >
                      <span>Update Order Status</span>
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                        ({selectedOrderDetail.orderStatus || 'New'})
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSubmenu('shipping')}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-md transition cursor-pointer flex items-center justify-between pointer-events-auto"
                    >
                      <span>Change Shipping Method</span>
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                        ({selectedOrderDetail.shippingMethod || 'None'})
                        <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </button>

                    {!selectedOrderDetail.shipmentInfo && (
                      <>
                        <div className="border-t border-slate-100 my-1" />
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
                      </>
                    )}
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
                      selectedOrderDetail.orderItems.map((item, index) => (
                        <tr key={index} className="hover:bg-slate-50/50">
                          <td className="py-4 px-5 font-medium text-slate-800 text-sm">{item.productName}</td>
                          <td className="py-4 px-5 font-mono text-xs text-slate-600">{item.styleColor}</td>
                          <td className="py-4 px-5 font-mono text-xs text-slate-600">{item.sku}</td>
                          <td className="py-4 px-5 text-right font-mono font-medium text-slate-800 text-sm">{item.quantity}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-4 px-5 font-medium text-slate-800 text-sm">Classic Crewneck Apparel</td>
                        <td className="py-4 px-5 font-mono text-xs text-slate-600">Charcoal / M</td>
                        <td className="py-4 px-5 font-mono text-xs text-slate-600">APP-CRW-002</td>
                        <td className="py-4 px-5 text-right font-mono font-medium text-slate-800 text-sm">{selectedOrderDetail.quantity}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: Shipment Card */}
            <div>
              {selectedOrderDetail.shipmentInfo ? (
                <div className="border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden">
                  {/* Card Header exactly matching the screenshot style */}
                  <div className="px-5 py-4 border-b border-slate-100 bg-white flex items-center justify-between select-none">
                    <span className="font-bold text-slate-800 text-sm tracking-wider uppercase select-none">
                      Shipment 1 - {selectedOrderDetail.shipmentInfo.trackingNumber || '12391283912'}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          onClick={() => setIsPrintDropdownOpen(!isPrintDropdownOpen)}
                          className="h-8 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white font-bold rounded-lg text-xs shadow-2xs transition focus:outline-none cursor-pointer inline-flex items-center gap-1 select-none"
                        >
                          <span>Print</span>
                          <ChevronDown className="h-3 w-3 text-slate-500" />
                        </button>

                        {isPrintDropdownOpen && (
                          <div className="absolute right-0 mt-1 w-44 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-50 text-xs animate-in fade-in duration-100">
                            <button
                              type="button"
                              onClick={() => {
                                setIsPrintDropdownOpen(false);
                                const printWindow = window.open('', '_blank');
                                if (printWindow) {
                                  printWindow.document.write(`
                                    <html>
                                      <head>
                                        <title>Print Shipping Label *(1Z) ${selectedOrderDetail.shipmentInfo?.trackingNumber || '1LSDBVU000ZLLNI'}*</title>
                                        <style>
                                          body {
                                            margin: 0;
                                            display: flex;
                                            justify-content: center;
                                            align-items: center;
                                            height: 100vh;
                                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                                            background-color: #f1f5f9;
                                          }
                                          .label-card {
                                            width: 4in;
                                            height: 6in;
                                            border: 3px solid #000;
                                            padding: 20px;
                                            box-sizing: border-box;
                                            display: flex;
                                            flex-direction: column;
                                            justify-content: space-between;
                                            background-color: #fff;
                                          }
                                          .header {
                                            font-size: 22px;
                                            font-weight: 900;
                                            border-bottom: 5px solid #000;
                                            padding-bottom: 6px;
                                            text-transform: uppercase;
                                          }
                                          .address-section {
                                            font-size: 11px;
                                            font-weight: 650;
                                            line-height: 1.4;
                                          }
                                          .barcode {
                                            display: flex;
                                            flex-direction: column;
                                            align-items: center;
                                            border-top: 3px solid #000;
                                            padding-top: 15px;
                                          }
                                          .barcode-lines {
                                            width: 100%;
                                            height: 80px;
                                            background: repeating-linear-gradient(90deg, #000, #000 3px, #fff 3px, #fff 8px);
                                          }
                                          .barcode-text {
                                            font-family: monospace;
                                            font-size: 13px;
                                            font-weight: 900;
                                            margin-top: 5px;
                                            letter-spacing: 2px;
                                          }
                                        </style>
                                      </head>
                                      <body>
                                        <div class="label-card">
                                          <div class="header">
                                            ${selectedOrderDetail.shippingMethod || 'UPS Ground'} / DOMESTIC
                                          </div>
                                          <div class="address-section">
                                            <strong>FROM:</strong><br/>
                                            ${selectedOrderDetail.shipmentInfo?.senderDetails?.company || 'SwiftPOD LLC'}<br/>
                                            ${selectedOrderDetail.shipmentInfo?.senderDetails?.address || '2070 S 7th St. Ste E, San Jose, CA 95112'}
                                          </div>
                                          <div class="address-section">
                                            <strong>TO:</strong><br/>
                                            ${selectedOrderDetail.shipmentInfo?.recipientDetails ? `${selectedOrderDetail.shipmentInfo.recipientDetails.firstName} ${selectedOrderDetail.shipmentInfo.recipientDetails.lastName}` : (selectedOrderDetail.shipAddress?.name || 'Demi Wilkinson')}<br/>
                                            ${selectedOrderDetail.shipmentInfo?.recipientDetails?.company || selectedOrderDetail.shipAddress?.companyLine || ''}<br/>
                                            ${selectedOrderDetail.shipmentInfo?.recipientDetails?.address1 || selectedOrderDetail.shipAddress?.addressLine || ''}<br/>
                                            ${(selectedOrderDetail.shipmentInfo?.recipientDetails?.city || selectedOrderDetail.shipAddress?.city || '').toUpperCase()}, ${selectedOrderDetail.shipmentInfo?.recipientDetails?.zip || selectedOrderDetail.shipAddress?.zip || ''}
                                          </div>
                                          <div class="barcode">
                                            <div class="barcode-lines"></div>
                                            <div class="barcode-text">*(1Z) ${selectedOrderDetail.shipmentInfo?.trackingNumber || '1LSDBVU000ZLLNI'}*</div>
                                          </div>
                                        </div>
                                        <script>
                                          window.onload = function() {
                                            window.print();
                                            setTimeout(function() { window.close(); }, 1500);
                                          };
                                        </script>
                                      </body>
                                    </html>
                                  `);
                                  printWindow.document.close();
                                } else {
                                  triggerToast('Popup blocked! Please allow popups to print.', 'info');
                                }
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 font-semibold text-slate-700 block"
                            >
                              Print Label
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsPrintDropdownOpen(false);
                                triggerToast('Printing packing slip...', 'success');
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 font-semibold text-slate-700 block"
                            >
                              Packing Slip
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsPrintDropdownOpen(false);
                                triggerToast('Printing thank you card...', 'success');
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-slate-50 font-semibold text-slate-700 block"
                            >
                              Thank You Card
                            </button>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsShipmentDetailsModalOpen(true)}
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
                        <span className="text-sm font-semibold text-slate-800 mt-1 block font-mono select-all tracking-tight leading-none">{selectedOrderDetail.shipmentInfo.trackingNumber || '1LSDBVU000ZLLNI'}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-slate-500 font-sans select-none">Status</span>
                        <span className="text-sm font-medium text-slate-800 mt-1 block font-sans leading-none">{selectedOrderDetail.shipmentInfo.shippingMethod || 'FLAT'}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-slate-500 font-sans select-none">Service</span>
                        <span className="text-sm font-medium text-slate-800 mt-1 block font-sans leading-none">{selectedOrderDetail.shipmentInfo.service || 'USPS'}</span>
                      </div>

                      <div>
                        <span className="block text-xs font-semibold text-slate-500 font-sans select-none">Size (inch)</span>
                        <span className="text-sm font-medium font-mono text-slate-800 mt-1 block leading-none">{selectedOrderDetail.shipmentInfo.size || '15 × 12 × 10'}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-slate-500 font-sans select-none">Weight</span>
                        <span className="text-sm font-medium text-slate-800 mt-1 block font-sans leading-none">{selectedOrderDetail.shipmentInfo.weight || '12.4 lbs'}</span>
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-slate-500 font-sans select-none">Price</span>
                        <span className="text-sm font-medium text-slate-800 mt-1 block font-sans leading-none">{selectedOrderDetail.shipmentInfo.price || '$7.22'}</span>
                      </div>
                    </div>

                    {/* Highlighted Number of item section as requested */}
                    <div 
                      onClick={() => setIsShipmentItemsModalOpen(true)}
                      className="md:w-36 border border-slate-200 rounded-xl p-3 bg-slate-50/80 hover:bg-slate-100 transition duration-150 cursor-pointer shadow-2xs relative select-none flex flex-col items-center justify-center min-h-[90px]"
                      title="Click to view items list"
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
              ) : (
                <div className="border border-slate-200 rounded-xl bg-white p-5 space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider select-none">
                    <span>Courier Shipment Label</span>
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    No active shipping label has been generated for this client order in SwiftPOD yet. Click below to configure parameters and register package details to generate a tracking code.
                  </p>
                  <button
                    type="button"
                    onClick={() => onCreateLabel(selectedOrderDetail)}
                    className="w-full h-10 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shadow-brand-100"
                  >
                    Create Shipping Label
                  </button>
                </div>
              )}
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
                <div className="pt-3">
                  <span className="block text-xs font-semibold text-slate-500 mb-4 select-none">Complete History Path</span>
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

              <div className="p-5 space-y-4 divide-y divide-slate-100 text-left">
                {/* Return Address */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-500 font-sans select-none">Return Address</h4>
                  <div className="text-slate-800 space-y-0.5 font-sans leading-relaxed text-sm font-medium">
                    <p className="font-bold text-slate-900">{selectedOrderDetail.returnAddress?.name || 'mytest'}</p>
                    <p>{selectedOrderDetail.returnAddress?.companyLine || 'Company_address-1'}</p>
                    <p>{selectedOrderDetail.returnAddress?.addressLine || '715 Broadway2313, United States,'}</p>
                    <p>{selectedOrderDetail.returnAddress?.cityStateZip || 'NY, 20912, US'}</p>
                  </div>
                </div>

                {/* Ship Address */}
                <div className="pt-3 space-y-2 text-left">
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
                        Edit Address
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
                    <div className="space-y-3 pt-1 font-sans text-left">
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

                      <div className="space-y-2 pb-1 text-xs">
                        <input
                          type="text"
                          value={shipName}
                          placeholder="Name *"
                          onChange={(e) => setShipName(e.target.value)}
                          className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-8 font-sans"
                        />
                        <input
                          type="text"
                          value={shipCompanyLine}
                          placeholder="Company"
                          onChange={(e) => setShipCompanyLine(e.target.value)}
                          className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-8 font-sans"
                        />
                        <input
                          type="text"
                          value={shipAddressLine}
                          placeholder="Address line 1 *"
                          onChange={(e) => setShipAddressLine(e.target.value)}
                          className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-8 font-sans"
                        />
                        <input
                          type="text"
                          value={shipAddress2}
                          placeholder="Address line 2"
                          onChange={(e) => setShipAddress2(e.target.value)}
                          className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-8 font-sans"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={shipCity}
                            placeholder="City *"
                            onChange={(e) => setShipCity(e.target.value)}
                            className="w-1/2 text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-8 font-sans"
                          />
                          <select
                            value={shipState}
                            onChange={(e) => setShipState(e.target.value)}
                            className="w-1/2 text-xs text-slate-700 bg-white border border-slate-200 rounded px-1.5 py-1 h-8 focus:outline-none cursor-pointer text-slate-700 font-sans"
                          >
                            <option value="">Select state</option>
                            {US_STATES.map((stateOption) => (
                              <option key={stateOption.code} value={stateOption.name}>
                                {stateOption.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={shipZip}
                            placeholder="Zipcode *"
                            onChange={(e) => setShipZip(e.target.value)}
                            className="w-1/2 text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-8 text-center font-mono"
                          />
                          <input
                            type="text"
                            value={shipCountry}
                            placeholder="Country *"
                            onChange={(e) => setShipCountry(e.target.value)}
                            className="w-1/2 text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-8 font-sans"
                          />
                        </div>
                        <input
                          type="text"
                          value={shipPhone}
                          placeholder="Phone"
                          onChange={(e) => setShipPhone(e.target.value)}
                          className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded px-2.5 py-1 focus:outline-none focus:border-blue-500 h-8 font-sans"
                        />
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            handleSaveShipAddress();
                          }}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-[11px] cursor-pointer transition focus:outline-none uppercase tracking-wider h-8 font-sans animate-none"
                        >
                          Apply Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
