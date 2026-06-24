import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, ChevronRight, ChevronDown, Copy, Printer, Eye, ShoppingCart, Package, MapPin, FileText, ClipboardList, MessageSquare, ArrowLeft,
  Heart, Gift, Menu, Download, X, RotateCw, Maximize2, Sparkles, ExternalLink
} from "lucide-react";
import { OrderManagementItem, Product } from "../types";

const getTrackingUrl = (trackingNumber: string) => {
  const clean = trackingNumber.trim();
  if (clean.toUpperCase().startsWith('1Z')) {
    return `https://www.ups.com/track?tracknum=${encodeURIComponent(clean)}`;
  }
  if (/^\d{12}$|^\d{15}$|^\d{20}$|^\d{22}$/.test(clean)) {
    if (clean.length === 12 || clean.length === 15) {
      return `https://www.fedex.com/fedextrack/?tracknumbers=${encodeURIComponent(clean)}`;
    }
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(clean)}`;
  }
  return `https://www.google.com/search?q=${encodeURIComponent(clean)}`;
};

const BorderlessCarrierLogo = ({ carrier, className = "" }: { carrier?: string; className?: string }) => {
  const clean = (carrier || '').trim().toUpperCase();
  if (clean === 'USPS' || clean.includes('USPS')) {
    return (
      <svg className={`shrink-0 ${className}`} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 8 H16 L12 28 H0 L2 8 Z" fill="#003366" />
        <path d="M8 8 L22 8 L18 28 L4 28 Z" fill="#E31B23" />
        <text x="26" y="27" fill="#003366" fontSize="23" fontWeight="900" fontStyle="italic" fontFamily='"Inter", sans-serif'>USPS</text>
      </svg>
    );
  }
  if (clean === 'UPS' || clean.includes('UPS')) {
    return (
      <svg className={`shrink-0 ${className}`} viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C17.3 0 21.6 1.7 21.6 8.3C21.6 15.3 16.2 22.8 12 25.6C7.8 22.8 2.4 15.3 2.4 8.3C2.4 1.7 6.7 0 12 0Z" fill="#351C15" />
        <path d="M12 2.2C15.8 2.2 19.4 3.4 19.4 8.3C19.4 13.9 15.2 20.3 12 22.7C8.8 20.3 4.6 13.9 4.6 8.3C4.6 3.4 8.2 2.2 12 2.2Z" fill="#FFC72C" />
        <text x="12" y="14" fill="#351C15" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily='"Inter", sans-serif' letterSpacing="-0.5">ups</text>
      </svg>
    );
  }
  if (clean === 'DHL' || clean.includes('DHL')) {
    return (
      <svg className={`shrink-0 ${className}`} viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="80" height="24" rx="4" fill="#FFCC00" />
        <text x="40" y="17" fill="#D4001A" fontSize="15" fontWeight="900" fontStyle="italic" textAnchor="middle" fontFamily='"Inter", sans-serif' letterSpacing="0.5">DHL</text>
        <line x1="5" y1="8" x2="20" y2="8" stroke="#D4001A" strokeWidth="1.5" />
        <line x1="5" y1="12" x2="20" y2="12" stroke="#D4001A" strokeWidth="1.5" />
        <line x1="5" y1="16" x2="20" y2="16" stroke="#D4001A" strokeWidth="1.5" />
        <line x1="60" y1="8" x2="75" y2="8" stroke="#D4001A" strokeWidth="1.5" />
        <line x1="60" y1="12" x2="75" y2="12" stroke="#D4001A" strokeWidth="1.5" />
        <line x1="60" y1="16" x2="75" y2="16" stroke="#D4001A" strokeWidth="1.5" />
      </svg>
    );
  }
  if (clean === 'FEDEX' || clean.includes('FEDEX')) {
    return (
      <svg className={`shrink-0 ${className}`} viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="4" y="18" fill="#4D148C" fontSize="21" fontWeight="900" fontFamily='"Inter", sans-serif' letterSpacing="-1.5">Fed</text>
        <text x="41" y="18" fill="#FF6600" fontSize="21" fontWeight="900" fontFamily='"Inter", sans-serif' letterSpacing="-1.5">Ex</text>
      </svg>
    );
  }
  return null;
};

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
  isPasteAddressOpen?: boolean;
  setIsPasteAddressOpen?: (val: boolean) => void;
  rawAddressToPaste?: string;
  setRawAddressToPaste?: (val: string) => void;
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
  const actionsDropdownRef = useRef<HTMLDivElement>(null);
  const printDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsDropdownRef.current && !actionsDropdownRef.current.contains(event.target as Node)) {
        setIsActionsDropdownOpen(false);
      }
      if (printDropdownRef.current && !printDropdownRef.current.contains(event.target as Node)) {
        setIsPrintDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [previewDocType, setPreviewDocType] = useState<'Packing Slip' | 'Thank You Card' | 'Gift Message' | 'Shipping Label' | null>(null);
  const [previewShipmentIdx, setPreviewShipmentIdx] = useState<number | undefined>(undefined);
  const [previewZoom, setPreviewZoom] = useState(92);
  const [previewRotation, setPreviewRotation] = useState(0);
  const printIframeRef = useRef<HTMLIFrameElement>(null);
  const [submenu, setSubmenu] = useState<'main' | 'status' | 'shipping'>('main');
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const [voidingIdx, setVoidingIdx] = useState<number | null>(null);

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
      setTimeout(() => {
        commentInputRef.current?.focus();
      }, 500);
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

  const getPrintDocumentHtml = (docType: 'Packing Slip' | 'Thank You Card' | 'Gift Message' | 'Shipping Label', shipmentIdx?: number, forPreview: boolean = false) => {
    if (!selectedOrderDetail) return '';

    const shipmentsList = selectedOrderDetail.shipments && selectedOrderDetail.shipments.length > 0
      ? selectedOrderDetail.shipments
      : (selectedOrderDetail.shipmentInfo ? [selectedOrderDetail.shipmentInfo] : []);
    const shp = shipmentIdx !== undefined && shipmentsList[shipmentIdx] ? shipmentsList[shipmentIdx] : shipmentsList[0];

    if (shp?.status === 'voided') {
      return `
        <html>
          <head>
            <title>Shipment Voided</title>
            <style>
              body { display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; background: #fafafa; color: #e11d48; margin: 0; }
              .card { border: 2px dashed #fca5a5; background: #fff1f2; padding: 40px; border-radius: 12px; text-align: center; max-width: 400px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
              h1 { font-size: 22px; margin: 0 0 10px 0; font-weight: 800; color: #be123c; }
              p { font-size: 14px; color: #4b5563; margin: 0; line-height: 1.5; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>SHIPMENT VOIDED</h1>
              <p>This shipping label has been voided and refund has been requested. Printing is disabled for this shipment.</p>
            </div>
          </body>
        </html>
      `;
    }

    let htmlContent = '';

    if (docType === 'Shipping Label') {
      const trackingNo = shp?.trackingNumber || '1LSDBVU000ZLLNI';
      const carrierName = shp?.carrier || 'UPS';
      const senderName = shp?.senderDetails?.name || 'SwiftPOD LLC';
      const senderComp = shp?.senderDetails?.company || 'Main Depot Terminal';
      const senderAddr = shp?.senderDetails?.address || '2070 S 7th St. Ste E, San Jose, CA 95112';

      const recName = shp?.recipientDetails ? `${shp.recipientDetails.firstName} ${shp.recipientDetails.lastName}` : (selectedOrderDetail.shipAddress?.name || 'Demi Wilkinson');
      const recComp = shp?.recipientDetails?.company || selectedOrderDetail.shipAddress?.companyLine || '';
      const recAddr1 = shp?.recipientDetails?.address1 || selectedOrderDetail.shipAddress?.addressLine || 'Store Boutique (Phoenix)';
      const recCityStateZip = shp?.recipientDetails ? `${shp.recipientDetails.city || ''}, ${shp.recipientDetails.zip || ''}, ${shp.recipientDetails.country || 'United States'}` : (selectedOrderDetail.destination || 'United States');

      htmlContent = `
        <html>
          <head>
            <title>Print Shipping Label</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; background: #fff; }
              .box { width: 4in; height: 6in; border: 3px solid #000; padding: 25px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; }
              .text-bold { font-weight: bold; }
              .title { font-size: 24px; font-weight: 900; border-bottom: 5px solid #000; padding-bottom: 5px; text-transform: uppercase; }
              .barcode { margin-top: 15px; text-align: center; }
              .barcode-lines { height: 65px; background-color: #000; background-image: repeating-linear-gradient(90deg, #fff, #fff 1.5px, #000 1.5px, #000 5.5px); margin: 6px 0; }
              .barcode-text { font-family: monospace; font-size: 11px; font-weight: bold; letter-spacing: 1px; }
            </style>
          </head>
          <body>
            <div class="box">
              <div class="title">${carrierName} GROUND</div>
              <div style="font-size: 11px; margin-top: 15px;">
                <div class="text-bold">SENDER:</div>
                <div>${senderName}</div>
                <div>${senderComp}</div>
                <div>${senderAddr}</div>
              </div>
              <div style="font-size: 11px; margin-top: 20px;">
                <div class="text-bold">SHIP TO:</div>
                <div>${recName}</div>
                <div>${recComp}</div>
                <div>${recAddr1}</div>
                <div>${recCityStateZip}</div>
              </div>
              <div style="border-top: 2px solid #000; padding-top: 15px; margin-top: 30px; font-size: 12px; font-family: monospace; text-align: center;">
                TRACKING #: ${trackingNo}
                <div class="barcode-lines"></div>
                <div class="barcode-text">*(1Z) ${trackingNo}*</div>
              </div>
            </div>
            ${forPreview ? '' : `
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 1000);
              };
            </script>
            `}
          </body>
        </html>
      `;
    } else if (docType === 'Packing Slip') {
      const itemsHtml = (selectedOrderDetail.orderItems || []).map(item => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; font-family: monospace;">${item.sku}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.productName}</td>
          <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        </tr>
      `).join('');

      htmlContent = `
        <html>
          <head>
            <title>Packing Slip - #${selectedOrderDetail.orderNumber}</title>
            <style>
              body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; }
              .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
              .title { font-size: 28px; font-weight: bold; }
              .info-grid { display: flex; justify-content: space-between; margin-bottom: 40px; gap: 40px; }
              .info-section { flex: 1; }
              .info-section h3 { font-size: 12px; font-weight: bold; color: #888; text-transform: uppercase; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
              .info-section p { font-size: 14px; margin: 0; line-height: 1.5; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th { padding: 12px 10px; border-bottom: 2px solid #333; text-align: left; font-size: 12px; text-transform: uppercase; color: #555; }
              .footer { margin-top: 100px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <div class="title">PACKING SLIP</div>
                <div style="font-size: 14px; margin-top: 5px; color: #666;">Order #${selectedOrderDetail.orderNumber}</div>
              </div>
              <div style="text-align: right;">
                <div style="font-weight: bold; font-size: 16px;">SwiftPOD Logistics</div>
                <div style="font-size: 13px; color: #666; margin-top: 4px;">Date: ${new Date().toLocaleDateString()}</div>
              </div>
            </div>

            <div class="info-grid">
              <div class="info-section">
                <h3>Ship From</h3>
                <p><strong>SwiftPOD LLC - Warehouse A</strong></p>
                <p>2070 S 7th St. Ste E</p>
                <p>San Jose, CA 95112</p>
                <p>United States</p>
              </div>
              <div class="info-section">
                <h3>Ship To</h3>
                <p><strong>${selectedOrderDetail.shipAddress?.name || 'Customer'}</strong></p>
                <p>${selectedOrderDetail.shipAddress?.companyLine || ''}</p>
                <p>${selectedOrderDetail.shipAddress?.addressLine || ''}</p>
                <p>${selectedOrderDetail.destination || 'United States'}</p>
              </div>
            </div>

            <h3>Order Items</h3>
            <table>
              <thead>
                <tr>
                  <th style="width: 30%;">SKU</th>
                  <th style="width: 55%;">Product Name</th>
                  <th style="width: 15%; text-align: center;">Quantity</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="footer">
              Thank you for shopping with SwiftPOD Logistics. For questions regarding your order, contact support@swiftpod.com
            </div>

            ${forPreview ? '' : `
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 1000);
              };
            </script>
            `}
          </body>
        </html>
      `;
    } else if (docType === 'Thank You Card') {
      htmlContent = `
        <html>
          <head>
            <title>Thank You Card</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: 'Georgia', serif; background: #fff; }
              .card { width: 6in; height: 4in; border: 1px solid #ccc; box-shadow: 0 4px 10px rgba(0,0,0,0.05); padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; text-align: center; }
              .title { font-size: 32px; font-weight: italic; font-style: italic; color: #2c3e50; font-family: 'Playfair Display', 'Georgia', serif; }
              .message { font-size: 14px; line-height: 1.6; color: #555; font-family: 'Helvetica Neue', sans-serif; }
              .footer { font-size: 12px; color: #888; font-family: 'Helvetica Neue', sans-serif; letter-spacing: 1px; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="title">Thank You!</div>
              <div class="message">
                We hope you absolutely love your purchase. Each of our items is crafted with care and handled to reach you in perfect condition.
                Your business means the world to us!
              </div>
              <div class="footer">
                SWIFTPOD & CO. • SUPPORT@SWIFTPOD.COM
              </div>
            </div>
            ${forPreview ? '' : `
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 1000);
              };
            </script>
            `}
          </body>
        </html>
      `;
    } else if (docType === 'Gift Message') {
      const msg = selectedOrderDetail.internalNotes || (selectedOrderDetail as any).comment || 'Best wishes to you on this special occasion! Hope you enjoy this lovely gift!';
      htmlContent = `
        <html>
          <head>
            <title>Gift Message</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: 'Georgia', serif; background: #fff; }
              .card { width: 6in; height: 4in; border: 2px dashed #999; padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; text-align: center; background: #fffcf9; }
              .title { font-size: 24px; font-weight: bold; color: #7f8c8d; text-transform: uppercase; letter-spacing: 2px; }
              .msg-box { font-size: 16px; font-style: italic; color: #2c3e50; line-height: 1.6; padding: 10px; border-top: 1px solid #eee; border-bottom: 1px solid #eee; margin: 15px 0; }
              .info-box { font-family: 'Helvetica Neue', sans-serif; font-size: 12px; color: #777; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="title">A Gift For You</div>
              <div class="msg-box">
                "${msg}"
              </div>
              <div class="info-box">
                To: ${selectedOrderDetail.shipAddress?.name || 'Valued Recipient'}<br/>
                From: Warmest Regards
              </div>
            </div>
            ${forPreview ? '' : `
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 1000);
              };
            </script>
            `}
          </body>
        </html>
      `;
    }

    return htmlContent;
  };

  const handlePrintDocument = (docType: 'Packing Slip' | 'Thank You Card' | 'Gift Message' | 'Shipping Label', shipmentIdx?: number) => {
    if (!selectedOrderDetail) return;

    if (docType === 'Shipping Label' && shipmentIdx !== undefined) {
      const shipmentsList = selectedOrderDetail.shipments && selectedOrderDetail.shipments.length > 0
        ? selectedOrderDetail.shipments
        : (selectedOrderDetail.shipmentInfo ? [selectedOrderDetail.shipmentInfo] : []);
      const shp = shipmentsList[shipmentIdx];
      if (shp?.status === 'voided') {
        triggerToast('Cannot print a voided shipment.', 'info');
        return;
      }
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      triggerToast('Popup blocked! Please allow popups to launch print jobs.', 'info');
      return;
    }

    const htmlContent = getPrintDocumentHtml(docType, shipmentIdx, false);
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleVoidSpecificShipment = (idx: number) => {
    if (!selectedOrderDetail) return;
    
    const todayTimeStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const trackingNo = (selectedOrderDetail.shipments && selectedOrderDetail.shipments[idx]?.trackingNumber) || selectedOrderDetail.shipmentInfo?.trackingNumber || 'N/A';
    
    const newAct = {
      id: `act_${Date.now()}`,
      date: todayTimeStr,
      action: `Voided Shipping Label / Refund requested for Shipment ${idx + 1} (Tracking: "${trackingNo}")`,
      performedBy: 'Hiep Admin'
    };

    setOrders(prev => prev.map(o => {
      if (o.id === selectedOrderDetail.id) {
        const currentShipments = o.shipments || [];
        const updatedShipments = currentShipments.map((s, i) => i === idx ? { ...s, status: 'voided' } : s);
        const hasActive = updatedShipments.some(s => s.status !== 'voided');
        
        return {
          ...o,
          shipments: updatedShipments,
          orderStatus: hasActive ? o.orderStatus : 'New' as const,
          shippingStatus: hasActive ? o.shippingStatus : undefined,
          trackingNumber: hasActive ? (updatedShipments.find(s => s.status !== 'voided')?.trackingNumber) : undefined,
          shipmentInfo: updatedShipments[0],
          activityHistory: [newAct, ...(o.activityHistory || [])]
        };
      }
      return o;
    }));

    setSelectedOrderDetail(prev => {
      if (!prev) return null;
      const currentShipments = prev.shipments || [];
      const updatedShipments = currentShipments.map((s, i) => i === idx ? { ...s, status: 'voided' } : s);
      const hasActive = updatedShipments.some(s => s.status !== 'voided');
      
      return {
        ...prev,
        shipments: updatedShipments,
        orderStatus: hasActive ? prev.orderStatus : 'New' as const,
        shippingStatus: hasActive ? prev.shippingStatus : undefined,
        trackingNumber: hasActive ? (updatedShipments.find(s => s.status !== 'voided')?.trackingNumber) : undefined,
        shipmentInfo: updatedShipments[0],
        activityHistory: [newAct, ...(prev.activityHistory || [])]
      };
    });

    triggerToast(`Shipment ${idx + 1} voided successfully!`, 'success');
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
          {/* Only show the print button corresponding to the order's specific insertType */}
          {selectedOrderDetail.insertType === 'Packing Slip' && (
            <button
              type="button"
              onClick={() => {
                setPreviewDocType('Packing Slip');
                setPreviewShipmentIdx(undefined);
              }}
              className="h-10 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg inline-flex items-center justify-center font-bold text-xs transition shadow-2xs cursor-pointer select-none gap-1.5 focus:outline-none"
            >
              <Printer className="h-4 w-4 text-slate-500" />
              <span>Print Packing Slip</span>
            </button>
          )}

          {selectedOrderDetail.insertType === 'Thank You Card' && (
            <button
              type="button"
              onClick={() => {
                setPreviewDocType('Thank You Card');
                setPreviewShipmentIdx(undefined);
              }}
              className="h-10 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg inline-flex items-center justify-center font-bold text-xs transition shadow-2xs cursor-pointer select-none gap-1.5 focus:outline-none"
            >
              <Printer className="h-4 w-4 text-slate-500" />
              <span>Print TU Card</span>
            </button>
          )}

          {selectedOrderDetail.insertType === 'Gift Message' && (
            <button
              type="button"
              onClick={() => {
                setPreviewDocType('Gift Message');
                setPreviewShipmentIdx(undefined);
              }}
              className="h-10 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg inline-flex items-center justify-center font-bold text-xs transition shadow-2xs cursor-pointer select-none gap-1.5 focus:outline-none"
            >
              <Printer className="h-4 w-4 text-slate-500" />
              <span>Print Gift Message</span>
            </button>
          )}

          {/* Vertical Separator Gạch */}
          {['Packing Slip', 'Thank You Card', 'Gift Message'].includes(selectedOrderDetail.insertType || '') && (
            <div className="h-6 w-px bg-slate-200 mx-0.5 self-center" />
          )}

          {/* Action Menu Dropdown - clean white border style exactly like screenshot */}
          <div ref={actionsDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setIsActionsDropdownOpen(!isActionsDropdownOpen);
                setIsPrintDropdownOpen(false);
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
              </div>
            )}
          </div>

          {/* Comment action button (icon only) */}
          <button
            type="button"
            onClick={scrollToTimeline}
            className="h-10 w-10 flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg shadow-2xs transition cursor-pointer focus:outline-none"
            title="Scroll to Comments"
          >
            <MessageSquare className="h-4 w-4 text-slate-500" />
          </button>
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
            <div className="space-y-4">
              {(() => {
                const shipmentsList = selectedOrderDetail.shipments && selectedOrderDetail.shipments.length > 0
                  ? selectedOrderDetail.shipments
                  : (selectedOrderDetail.shipmentInfo ? [selectedOrderDetail.shipmentInfo] : []);
                
                return (
                  <>
                    {shipmentsList.length > 0 && (
                      <div className="space-y-4">
                        {shipmentsList.map((shp, idx) => {
                          const isVoided = shp.status === 'voided';
                          return (
                            <div 
                              key={shp.trackingNumber} 
                              className={`border rounded-xl shadow-xs overflow-hidden transition-all duration-200 ${
                                isVoided 
                                  ? 'border-slate-200 bg-slate-50/40 shadow-none' 
                                  : 'border-slate-200 bg-white'
                              }`}
                            >
                              {/* Card Header exactly matching the screenshot style */}
                              <div className={`px-5 py-3.5 border-b flex items-center justify-between select-none ${
                                isVoided ? 'border-slate-100 bg-slate-50/60' : 'border-slate-100 bg-white'
                              }`}>
                                <span className={`font-bold text-sm tracking-wider uppercase select-none flex items-center gap-1.5 ${
                                  isVoided ? 'text-slate-500' : 'text-slate-800'
                                }`}>
                                  Shipment {idx + 1}
                                </span>
                                <div className="flex items-center gap-2">
                                  {!isVoided && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => setVoidingIdx(idx)}
                                        className="h-8 px-3 border border-slate-200 hover:bg-slate-50 text-slate-600 bg-white font-semibold rounded-lg text-xs shadow-2xs transition focus:outline-none cursor-pointer inline-flex items-center select-none"
                                      >
                                        Void
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setPreviewDocType('Shipping Label');
                                          setPreviewShipmentIdx(idx);
                                        }}
                                        className="h-8 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white font-bold rounded-lg text-xs shadow-2xs transition focus:outline-none inline-flex items-center select-none gap-1.5 cursor-pointer"
                                      >
                                        <Printer className="h-3.5 w-3.5 text-slate-500" />
                                        <span>Print</span>
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>

                              {/* Info Grid - Styled exactly as 3 columns layout in the screenshot */}
                              <div className="p-5 flex flex-col md:flex-row md:items-stretch gap-6 text-left">
                                {/* Information Columns */}
                                <div className="flex-1 grid grid-cols-[0.9fr_0.5fr_1.6fr] gap-y-5 gap-x-6">
                                  <div>
                                    <span className="block text-xs font-semibold text-slate-500 font-sans select-none">Tracking</span>
                                    {isVoided ? (
                                      <span className="text-sm font-semibold text-slate-400 line-through mt-1 block font-mono tracking-tight leading-none text-wrap break-all select-all">
                                        {shp.trackingNumber || '1LSDBVU000ZLLNI'}
                                      </span>
                                    ) : (
                                      <a
                                        href={getTrackingUrl(shp.trackingNumber || '1LSDBVU000ZLLNI')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-semibold text-brand-600 hover:text-brand-700 hover:underline mt-1 inline-flex items-center gap-1 font-mono tracking-tight leading-none text-wrap break-all"
                                      >
                                        <span>{shp.trackingNumber || '1LSDBVU000ZLLNI'}</span>
                                        <ExternalLink className="h-3.5 w-3.5 text-brand-500" />
                                      </a>
                                    )}
                                  </div>
                                  <div>
                                    <span className="block text-xs font-semibold text-slate-500 font-sans select-none">Status</span>
                                    <div className="mt-0.5">
                                      {isVoided ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 select-none uppercase">
                                          Voided
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 select-none uppercase">
                                          {shp.status || 'Active'}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="block text-xs font-semibold text-slate-500 font-sans select-none">Service</span>
                                    <div className="flex items-center gap-1.5 mt-1 select-none">
                                      <div className={`px-1.5 py-0.5 border border-slate-200 bg-slate-50/50 rounded flex items-center justify-center h-5.5 shrink-0 ${isVoided ? 'opacity-40 grayscale' : ''}`}>
                                        <BorderlessCarrierLogo 
                                          carrier={shp.carrier || (shp.service?.toLowerCase().includes('fedex') ? 'FEDEX' : shp.service?.toLowerCase().includes('usps') ? 'USPS' : shp.service?.toLowerCase().includes('ups') ? 'UPS' : shp.service?.toLowerCase().includes('dhl') ? 'DHL' : '')} 
                                          className="h-3 w-auto" 
                                        />
                                      </div>
                                      <span className={`text-sm font-medium font-sans leading-none ${isVoided ? 'text-slate-400' : 'text-slate-800'}`}>
                                        {shp.service || 'USPS'}
                                      </span>
                                    </div>
                                  </div>

                                  <div>
                                    <span className="block text-xs font-semibold text-slate-500 font-sans select-none">Size (inch)</span>
                                    <span className={`text-sm font-medium font-mono mt-1 block leading-none ${isVoided ? 'text-slate-400' : 'text-slate-800'}`}>
                                      {shp.size || '15 × 12 × 10'}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="block text-xs font-semibold text-slate-500 font-sans select-none">Weight</span>
                                    <span className={`text-sm font-medium mt-1 block font-sans leading-none ${isVoided ? 'text-slate-400' : 'text-slate-800'}`}>
                                      {shp.weight || '12.4 lbs'}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="block text-xs font-semibold text-slate-500 font-sans select-none">Price</span>
                                    <span className={`text-sm font-medium mt-1 block font-sans leading-none ${isVoided ? 'text-slate-400' : 'text-slate-800'}`}>
                                      {shp.price || '$7.22'}
                                    </span>
                                  </div>
                                </div>

                                {/* Highlighted Number of item section as requested */}
                                <div 
                                  className={`md:w-36 border rounded-xl p-3 shadow-2xs relative select-none flex flex-col items-center justify-center min-h-[90px] ${
                                    isVoided ? 'border-rose-100/70 bg-rose-50/40' : 'border-slate-200 bg-slate-50/80'
                                  }`}
                                >
                                  <span className="block text-xs font-semibold text-slate-500 font-sans leading-none text-center">
                                    Number of items
                                  </span>
                                  <span className={`text-xl font-extrabold mt-2 block font-mono leading-none ${isVoided ? 'text-slate-400' : 'text-slate-800'}`}>
                                    {selectedOrderDetail.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || selectedOrderDetail.quantity}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {shipmentsList.length === 0 && (
                      <div className="border border-slate-200 rounded-xl bg-white p-5 space-y-3">
                        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider select-none">
                          <span>Shipment Actions</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => onCreateLabel(selectedOrderDetail)}
                          className="w-full h-10 btn-primary-gradient text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          Create Shipping Label
                        </button>
                      </div>
                    )}
                  </>
                );
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
                      ref={commentInputRef}
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

      {/* Modern Print Preview Modal */}
      <AnimatePresence>
        {previewDocType && (
          <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs z-[999] flex items-center justify-center p-4 md:p-6 font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#202124] text-white w-full max-w-3xl rounded-xl shadow-2xl flex flex-col h-[94vh] overflow-hidden"
            >
              {/* PDF Viewer Dark Toolbar matching the screenshot style */}
              <div className="bg-[#2f3542] text-[#f1f1f1] h-12 border-b border-[#1c1e22] flex items-center justify-between px-4 font-sans select-none text-xs shrink-0">
                {/* Left Items: Document Name with Ellipsis Truncation */}
                <div className="flex items-center gap-2 truncate max-w-[160px] sm:max-w-[240px]">
                  <span 
                    className="font-semibold text-white/95 tracking-wide truncate text-xs font-sans"
                    title={selectedOrderDetail && previewDocType ? `order-${selectedOrderDetail.orderNumber}-${previewDocType.toLowerCase().replace(/ /g, '-')}.pdf` : 'document.pdf'}
                  >
                    {selectedOrderDetail && previewDocType ? `order-${selectedOrderDetail.orderNumber}-${previewDocType.toLowerCase().replace(/ /g, '-')}.pdf` : 'document.pdf'}
                  </span>
                </div>

                {/* Center Items: Zoom & Rotate */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-[#1a1c1e] px-1 py-0.5 rounded-lg border border-slate-700/40">
                    <button
                      type="button"
                      onClick={() => setPreviewZoom(z => Math.max(50, z - 10))}
                      className="h-6 w-6 flex items-center justify-center hover:bg-white/10 rounded transition text-white/80 hover:text-white cursor-pointer font-bold text-xs select-none focus:outline-none"
                    >
                      -
                    </button>
                    <span className="font-bold text-[10px] font-sans text-white/90 w-10 text-center select-none">{previewZoom}%</span>
                    <button
                      type="button"
                      onClick={() => setPreviewZoom(z => Math.min(200, z + 10))}
                      className="h-6 w-6 flex items-center justify-center hover:bg-white/10 rounded transition text-white/80 hover:text-white cursor-pointer font-bold text-xs select-none focus:outline-none"
                    >
                      +
                    </button>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => setPreviewRotation(r => (r + 90) % 360)}
                    className="h-8 w-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition cursor-pointer focus:outline-none" 
                    title="Rotate Clockwise"
                  >
                    <RotateCw className="h-4 w-4" />
                  </button>
                </div>

                {/* Right Items: Download, Print, and Close */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const html = getPrintDocumentHtml(previewDocType, previewShipmentIdx, true);
                      const blob = new Blob([html], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `order-${selectedOrderDetail.orderNumber}-${previewDocType.toLowerCase().replace(/ /g, '-')}.html`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      triggerToast('Document downloaded successfully!', 'success');
                    }}
                    className="h-8 px-2.5 flex items-center justify-center hover:bg-white/10 rounded-lg text-slate-200 hover:text-white transition cursor-pointer gap-1.5 text-xs font-bold font-sans focus:outline-none"
                    title="Download HTML"
                  >
                    <Download className="h-4 w-4" />
                    <span className="hidden md:inline">Download</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (printIframeRef.current && printIframeRef.current.contentWindow) {
                        printIframeRef.current.contentWindow.focus();
                        printIframeRef.current.contentWindow.print();
                      }
                    }}
                    className="h-8 px-4 bg-[#3b82f6] hover:bg-[#2563eb] rounded-lg text-white font-bold transition cursor-pointer flex items-center gap-1.5 text-xs font-sans shadow-sm focus:outline-none"
                    title="Print Document"
                  >
                    <Printer className="h-4 w-4" />
                    <span>Print</span>
                  </button>
                  
                  <div className="h-5 w-[1px] bg-slate-700 self-center ml-1" />
                  <button
                    type="button"
                    onClick={() => setPreviewDocType(null)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition cursor-pointer focus:outline-none"
                    title="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* PDF Canvas View */}
              <div className="bg-[#525659] flex-1 overflow-y-auto p-6 md:p-10 flex justify-center items-start relative select-none">
                <div 
                  style={{ transform: `scale(${previewZoom / 100}) rotate(${previewRotation}deg)`, transformOrigin: 'top center' }} 
                  className="bg-white shadow-2xl transition-transform duration-150 relative border border-slate-700/30 overflow-hidden"
                >
                  {/* iframe displaying document inside */}
                  <iframe
                    ref={printIframeRef}
                    srcDoc={getPrintDocumentHtml(previewDocType, previewShipmentIdx, true)}
                    className="w-[794px] h-[1123px] bg-white border-0 select-text"
                    title="Print Document Canvas"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Void Confirmation Modal inside OrderDetailView */}
      <AnimatePresence>
        {voidingIdx !== null && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 font-sans">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setVoidingIdx(null)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-150 z-[1001] font-sans flex flex-col text-slate-850"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white select-none">
                <h2 className="text-base font-bold text-slate-950 font-sans">
                  Confirm Refund
                </h2>
                <button
                  type="button"
                  onClick={() => setVoidingIdx(null)}
                  className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 select-none text-left">
                <p className="text-sm text-slate-600 leading-normal font-medium font-sans">
                  Do you want to refund order?
                </p>
              </div>

              {/* Footer Buttons */}
              <div className="px-6 py-3.5 border-t border-slate-100 bg-white flex items-center justify-end gap-3 select-none shrink-0 font-sans">
                <button
                  type="button"
                  onClick={() => setVoidingIdx(null)}
                  className="h-9 px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleVoidSpecificShipment(voidingIdx);
                    setVoidingIdx(null);
                  }}
                  className="h-9 px-5 btn-primary-gradient text-white font-semibold rounded-lg text-xs shadow-xs transition cursor-pointer"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
