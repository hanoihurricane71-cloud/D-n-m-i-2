import React, { useState, useRef, useEffect } from 'react';
import {
  Tag, Search, User, CheckCircle2, Circle, Printer,
  Edit, X, Check, AlertCircle, FileText, Gift,
  Loader2, Plus, Trash2, Clock, Activity, Package,
  MapPin, ChevronDown, Shirt, Layers, Coffee
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import labelPlaceholderImg from '../../imports/image-6.png';
import labelSampleImg from '../../imports/image-17.png';
import itemThumbImg from '../../imports/image-16.png';

// ── Types ──────────────────────────────────────────────────────────────────

interface OrderItem {
  id: string;
  productName: string;
  style: string;
  color: string;
  size: string;
  qty: number;
  verifiedQty: number;
  status: 'pending' | 'ok' | 'failed';
}

interface ShipmentLabelItem {
  labelId: string;
  employee: string;
  time: string;
}

interface ShipmentCard {
  id: string;
  tracking: string;
  status: string;
  service: string;
  dimensions: string;
  price: string;
  itemCount: number;
  labelItems: ShipmentLabelItem[];
}

interface LabelOrder {
  labelId: string;
  orderNumber: string;
  refNumber: string;
  storeName: string;
  shippingStatus: string;
  returnAddress: Record<string, string>;
  shipAddress: Record<string, string>;
  items: OrderItem[];
  shipments: ShipmentCard[];
}

interface ShippingRate {
  carrier: string;
  service: string;
  price: number;
  days: string;
}

// ── Mock data ──────────────────────────────────────────────────────────────

const MOCK_ORDERS: Record<string, LabelOrder> = {
  'LBL-001054': {
    labelId: 'LBL-001054',
    orderNumber: '061626-SJ-M-000025',
    refNumber: 'MM2_A4257',
    storeName: 'MYYM_2',
    shippingStatus: 'Shipped',
    returnAddress: {
      name: 'John Smith',
      company: 'T-SHIRT COMPANY #1',
      address: '1234 address1 line, EXAMPLE, NY, 31345, US',
      phone: '6512312231',
    },
    shipAddress: {
      name: 'Auo Tivi',
      address: '3002 WOLF LAKE BLVD, NEW ALBANY, Indiana, 80201, US',
    },
    items: [
      { id: 'i1', productName: '3001', style: '3001', color: 'MILITARY GREEN', size: 'S', qty: 1, verifiedQty: 0, status: 'pending' },
      { id: 'i2', productName: 'DTF F', style: '3001', color: 'BLACK HEATHER', size: 'L', qty: 1, verifiedQty: 0, status: 'pending' },
      { id: 'i3', productName: 'INNER NECK LABEL', style: '6051', color: 'HEATHER WHITE/ENVY', size: 'XS', qty: 1, verifiedQty: 0, status: 'pending' },
    ],
    shipments: [
      {
        id: 'shp1',
        tracking: '9400100105660109469042',
        status: 'Unknown',
        service: 'GroundAdvantage',
        dimensions: '(9.00x2.00x6.00 in) / 13.99 oz',
        price: '$6.81',
        itemCount: 3,
        labelItems: [
          { labelId: '061626-SJ-M-000025-2/2', employee: 'Tech', time: '2026-06-17 00:25:56' },
          { labelId: '061626-SJ-M-000025-1/2', employee: 'Tech', time: '2026-06-17 00:25:56' },
          { labelId: '061626-SJ-M-000025-3',   employee: 'Tech', time: '2026-06-17 00:25:56' },
        ],
      },
    ],
  },
  'LBL-002388': {
    labelId: 'LBL-002388',
    orderNumber: 'ORD-2026-003',
    refNumber: 'REF-30911-M',
    storeName: 'Phoenix Baker',
    shippingStatus: 'Prepared',
    returnAddress: {
      name: 'mytest',
      company: 'SwiftPOD',
      address: '715 Broadway 2313, New York, NY, 20912, US',
      phone: '2129990000',
    },
    shipAddress: {
      name: 'John Doe',
      address: '100 Main St, Austin, TX, 78701, US',
    },
    items: [
      { id: 'i4', productName: 'Classic Fleece Hoodie', style: 'G185', color: 'Navy', size: 'L', qty: 3, verifiedQty: 0, status: 'pending' },
    ],
    shipments: [],
  },
};

const MOCK_RATES: ShippingRate[] = [
  { carrier: 'USPS', service: 'Priority Mail', price: 8.45, days: '2–3 days' },
  { carrier: 'USPS', service: 'Ground Advantage', price: 5.20, days: '5–8 days' },
  { carrier: 'UPS', service: 'UPS Ground', price: 9.80, days: '3–5 days' },
  { carrier: 'FedEx', service: 'FedEx Home Delivery', price: 11.30, days: '2–4 days' },
  { carrier: 'FedEx', service: 'FedEx SmartPost', price: 6.10, days: '5–7 days' },
];

function getPSTNow() {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).format(new Date()) + ' PST';
}

const STATUS_COLORS: Record<string, string> = {
  Shipped: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Prepared: 'bg-blue-50 text-blue-700 border-blue-200',
  New: 'bg-amber-50 text-amber-700 border-amber-200',
  Canceled: 'bg-slate-100 text-slate-400 border-slate-200',
  Unknown: 'bg-slate-100 text-slate-500 border-slate-200',
};

// ── Edit Address Modal ─────────────────────────────────────────────────────

function EditAddressModal({ title, fields, values, onChange, onSave, onClose }: {
  title: string;
  fields: { key: string; label: string }[];
  values: Record<string, string>;
  onChange: (k: string, v: string) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ type: 'spring', duration: 0.35 }}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 z-50">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 text-sm">Edit {title}</h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"><X className="h-4 w-4" /></button>
        </div>
        <div className="px-6 py-5 space-y-3">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">{f.label}</label>
              <input type="text" value={values[f.key] || ''} onChange={e => onChange(f.key, e.target.value)}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 h-9 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">Cancel</button>
          <button type="button" onClick={onSave} className="px-4 h-9 btn-primary-gradient rounded-lg text-sm font-semibold cursor-pointer">Save</button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Print Preview Component ────────────────────────────────────────────────

function PrintPreview({ src, alt }: { src: string; alt: string }) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  return (
    <div className="flex flex-col" style={{ height: 340 }}>
      {/* Fixed-size dark canvas — never resizes */}
      <div className="bg-[#404040] flex-1 overflow-auto flex items-center justify-center">
        <div
          className="shadow-2xl bg-white shrink-0"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 0.3s ease',
          }}
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            style={{
              width: zoom * 2,
              display: 'block',
              maxWidth: 'none',
            }}
          />
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-[#323232] flex items-center justify-center gap-3 px-4 py-2 shrink-0">
        <button type="button" onClick={() => setZoom(z => Math.max(z - 10, 20))} disabled={zoom <= 20}
          className="h-7 w-7 flex items-center justify-center rounded text-white/70 hover:text-white hover:bg-white/10 cursor-pointer disabled:opacity-30 transition text-lg font-bold select-none">
          −
        </button>
        <span className="text-white/80 text-xs font-mono w-10 text-center">{zoom}%</span>
        <button type="button" onClick={() => setZoom(z => Math.min(z + 10, 200))} disabled={zoom >= 200}
          className="h-7 w-7 flex items-center justify-center rounded text-white/70 hover:text-white hover:bg-white/10 cursor-pointer disabled:opacity-30 transition text-lg font-bold select-none">
          +
        </button>
        <div className="w-px h-4 bg-white/20" />
        <button type="button" onClick={() => setRotation(r => (r + 90) % 360)}
          className="h-7 px-2.5 flex items-center gap-1.5 rounded text-white/70 hover:text-white hover:bg-white/10 cursor-pointer transition text-xs font-semibold select-none">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38"/>
          </svg>
          Rotate
        </button>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export function LabelTab() {
  const [employeeId, setEmployeeId] = useState('');
  const [tempEmpId, setTempEmpId] = useState('');
  const [showEmpInput, setShowEmpInput] = useState(false);

  const [labelInput, setLabelInput] = useState('');
  const [order, setOrder] = useState<LabelOrder | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [pstTime, setPstTime] = useState(getPSTNow());

  const [outputCount] = useState(0);
  const [sessionStart] = useState(Date.now());
  const [elapsed, setElapsed] = useState('00:00');

  const [shipmentItemsModal, setShipmentItemsModal] = useState<ShipmentCard | null>(null);
  const [voidTarget, setVoidTarget] = useState<ShipmentCard | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [isAddMorePassOpen, setIsAddMorePassOpen] = useState(false);
  const [addMorePass, setAddMorePass] = useState('');
  const [addMorePassError, setAddMorePassError] = useState(false);

  const [returnAddrDraft, setReturnAddrDraft] = useState<Record<string, string>>({});
  const [shipAddrDraft, setShipAddrDraft] = useState<Record<string, string>>({});
  const [editingAddr, setEditingAddr] = useState<'return' | 'ship' | null>(null);

  const [selectedFormat, setSelectedFormat] = useState('ZPL');
  const [selectedPrinter, setSelectedPrinter] = useState('Select Printer');
  const [isPrinterOpen, setIsPrinterOpen] = useState(false);
  const PRINTERS = ['Zebra ZP450', 'Zebra ZD420', 'Dymo LabelWriter 450'];

  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [generatedLabel, setGeneratedLabel] = useState<string | null>(null);

  const [isInsertOpen, setIsInsertOpen] = useState(false);
  const [insertType, setInsertType] = useState('Thank You Card');
  const [insertMsg, setInsertMsg] = useState('');
  const [insertLabels, setInsertLabels] = useState<{ abbr: string; label: string }[]>([]);
  const [activePreviewTab, setActivePreviewTab] = useState('Label');
  const [verifyScan, setVerifyScan] = useState('');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const backlogCount = 12;

  // Mock print areas per item id
  const PRINT_AREAS: Record<string, string> = {
    i1: 'EMB FRONT LARGE',
    i2: 'INNER NECK LABEL',
    i3: 'FRONT',
    i4: 'DTG BACK FULL',
  };

  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);
  const showToast = (text: string, ok = true) => { setToast({ text, ok }); setTimeout(() => setToast(null), 3000); };

  const labelRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setInterval(() => setPstTime(getPSTNow()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      const s = Math.floor((Date.now() - sessionStart) / 1000);
      setElapsed(`${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(t);
  }, [sessionStart]);

  useEffect(() => {
    if (order) setItems(order.items.map(i => ({ ...i })));
  }, [order]);

  const handleScan = () => {
    const raw = labelInput.trim();
    const key = raw.toUpperCase();

    if (!/^LBL-\d{6}$/.test(key)) {
      showToast('Invalid format. Use LBL-XXXXXX (e.g. LBL-001054)', false);
      return;
    }

    const found = MOCK_ORDERS[key];
    if (!found) {
      showToast(`Label ID "${raw}" not found.`, false);
      setOrder(null);
      return;
    }

    setOrder(found);
    setReturnAddrDraft({ ...found.returnAddress });
    setShipAddrDraft({ ...found.shipAddress });
    setGeneratedLabel(null);
  };

  const cycleItem = (id: string) => {
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      const next: OrderItem['status'] = i.status === 'pending' ? 'ok' : i.status === 'ok' ? 'failed' : 'pending';
      return { ...i, status: next, verifiedQty: next === 'ok' ? i.qty : 0 };
    }));
  };

  const verifiedCount = items.filter(i => i.status === 'ok').length;
  const allOk = items.length > 0 && items.every(i => i.status === 'ok');

  const handleGenerateLabel = () => {
    setIsRateModalOpen(true);
    setIsLoadingRates(true);
    setRates([]);
    setSelectedRate(null);
    setTimeout(() => { setRates(MOCK_RATES); setIsLoadingRates(false); }, 1200);
  };

  const handleConfirmRate = () => {
    if (!selectedRate) return;
    setGeneratedLabel(`SHP-${Date.now().toString().slice(-8)}`);
    setIsRateModalOpen(false);
    showToast('Shipping label generated!');
  };

  const empName = employeeId ? `Hi ${employeeId}!` : '';

  // ── Compact login bar (no full-screen takeover) ────────────────────────
  const renderEmpBar = () => (
    <div className="shrink-0 px-4 border-b border-slate-100 bg-slate-50/60 flex items-center gap-3 h-14">
      {/* Left: employee info OR login form — always same height */}
      <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />

      {employeeId ? (
        /* Logged in: info + logout inline */
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1 shrink-0">
            <span className="text-xs font-bold text-emerald-700">{empName}</span>
            <span className="text-slate-300 select-none">·</span>
            <span className="text-xs text-emerald-500 font-medium">Inventory Specialist</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Output: <b className="text-slate-700">{outputCount} item</b></span>
          <span className="text-xs text-slate-500 font-medium">Time: <b className="text-slate-700">{elapsed}</b></span>
          <span className="text-xs text-slate-500 font-medium">Backlog: <b className="text-rose-600">{backlogCount}</b></span>
          <button
            type="button"
            onClick={() => { setEmployeeId(''); setTempEmpId(''); setOrder(null); setLabelInput(''); }}
            className="h-8 px-3.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer transition shrink-0"
          >
            Log out
          </button>
        </div>
      ) : (
        /* Not logged in: login form */
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Employee ID</span>
          <input
            type="text"
            value={tempEmpId}
            onChange={e => setTempEmpId(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && tempEmpId.trim()) setEmployeeId(tempEmpId.trim()); }}
            placeholder="Enter and press Enter"
            autoFocus
            className="h-7 px-2.5 border border-slate-200 rounded-lg text-xs text-slate-800 font-semibold focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 w-44"
          />
          <button type="button" disabled={!tempEmpId.trim()} onClick={() => setEmployeeId(tempEmpId.trim())}
            className="h-7 px-3 btn-primary-gradient rounded-lg text-xs font-bold cursor-pointer disabled:opacity-40 disabled:pointer-events-none">
            Confirm
          </button>
        </div>
      )}

      {/* Right: F2/F8 guide — always visible */}
      <span className="ml-auto text-xs text-slate-500 font-mono hidden md:block whitespace-nowrap shrink-0">
        F2: Create Label &nbsp;·&nbsp; F8: Print Label
      </span>
    </div>
  );

  return (
    <div className="flex flex-col flex-1 min-h-0 rounded-2xl overflow-hidden">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold text-white ${toast.ok ? 'bg-emerald-500' : 'bg-rose-500'}`}>
            <Check className="h-4 w-4" />{toast.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page title */}
      <div className="shrink-0 px-6 pt-5 pb-3">
        <h1 className="text-2xl font-bold text-slate-900">Create shipping label</h1>
      </div>

      {/* Employee bar */}
      {renderEmpBar()}

      {/* Scan bar */}
      <div className="shrink-0 px-4 py-2.5 border-b border-slate-100 bg-white flex items-center gap-2">
        <Search className="h-4 w-4 text-slate-400 shrink-0" />
        <input
          ref={labelRef}
          type="text"
          value={labelInput}
          onChange={e => { setLabelInput(e.target.value); }}
          onKeyDown={e => { if (e.key === 'Enter') handleScan(); }}
          placeholder="Scan Label ID… (e.g. LBL-001054)"
          disabled={!employeeId}
          className="flex-1 h-8 px-2 text-sm text-slate-800 bg-transparent border-0 focus:outline-none focus:ring-0 placeholder-slate-400 disabled:opacity-40"
        />

        <button type="button" onClick={handleScan} disabled={!employeeId || !labelInput.trim()}
          className="h-10 btn-primary-gradient rounded-lg text-sm font-semibold cursor-pointer disabled:opacity-40 disabled:pointer-events-none shrink-0"
          style={{ width: 120 }}>
          Enter
        </button>
      </div>

      {/* 3-column layout */}
      {!order ? (
        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-5 py-10">
            <img
              src={labelPlaceholderImg}
              alt="Label placeholder"
              className="h-28 w-auto object-contain"
            />
            <p className="text-sm font-semibold text-slate-400 tracking-wide">
              Scan Label ID to start
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex min-h-0 overflow-hidden">

          {/* ── LEFT: Shipment card ──────────────────────────────── */}
          <div className="w-1/4 shrink-0 border-r border-slate-100 flex flex-col overflow-y-auto bg-slate-50/40">
            <div className="p-3 space-y-2">
              {order.shipments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <Package className="h-5 w-5 text-slate-300" />
                  </div>
                  <p className="text-xs font-semibold text-slate-400">No shipment yet</p>
                  <p className="text-xs text-slate-300">Generate a label to create one</p>
                </div>
              ) : (
                order.shipments.map((shp, idx) => (
                  <div key={shp.id} className="bg-brand-600 text-white rounded-xl overflow-hidden text-xs">
                    {/* Header row */}
                    <div className="flex items-center justify-between px-3 py-2.5">
                      <span className="font-bold text-xs uppercase tracking-wide">Shipment {idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => setVoidTarget(shp)}
                        className="text-xs font-semibold px-2 py-1 rounded-md bg-white/15 hover:bg-white/30 transition cursor-pointer"
                      >
                        Void
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/20" />

                    {/* Info rows */}
                    <div className="px-3 py-3 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="opacity-70 shrink-0">Tracking:</span>
                        <span className="font-mono font-semibold text-right break-all">{shp.tracking}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="opacity-70">Status:</span>
                        <span className="font-semibold">{shp.status}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="opacity-70">Service:</span>
                        <span className="font-semibold">{shp.service}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="opacity-70">D/W:</span>
                        <span className="font-semibold">{shp.dimensions}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="opacity-70">Price:</span>
                        <span className="font-bold">{shp.price}</span>
                      </div>
                    </div>

                    {/* Number of items — highlighted + clickable */}
                    <button
                      type="button"
                      onClick={() => setShipmentItemsModal(shp)}
                      className="w-full flex items-center justify-between bg-white/15 hover:bg-white/25 px-3 py-2.5 cursor-pointer transition border-t border-white/20"
                    >
                      <span className="font-semibold">Number of items</span>
                      <span className="font-black text-lg leading-none underline underline-offset-2 decoration-white/50">{shp.itemCount}</span>
                    </button>
                  </div>
                ))
              )}
              <button type="button" onClick={() => { setAddMorePass(''); setAddMorePassError(false); setIsAddMorePassOpen(true); }}
                className="w-full flex items-center justify-center gap-1.5 h-8 border border-dashed border-brand-300 text-brand-600 hover:bg-brand-50 rounded-xl text-xs font-bold cursor-pointer transition">
                <Plus className="h-3.5 w-3.5" /> Add more
              </button>
            </div>
          </div>

          {/* ── CENTER: Order info + label ───────────────────────── */}
          <div className="w-1/2 flex flex-col overflow-y-auto min-w-0">
            <div className="p-4 space-y-4">

              {/* Order header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-brand-100 flex items-center justify-center shrink-0">
                    <Tag className="h-3.5 w-3.5 text-brand-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{order.storeName}</span>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold border ${STATUS_COLORS[order.shippingStatus] || STATUS_COLORS.Unknown}`}>
                        {order.shippingStatus}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      {order.orderNumber} &nbsp;·&nbsp; {order.refNumber}
                    </div>
                  </div>
                </div>
                <button type="button" onClick={() => setIsOrderDetailOpen(true)} className="text-xs text-brand-600 hover:text-brand-800 font-semibold cursor-pointer flex items-center gap-1">
                  <Edit className="h-3 w-3" /> Edit
                </button>
              </div>

              {/* Addresses */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'return' as const, label: 'Return Address', data: returnAddrDraft },
                  { key: 'ship' as const, label: 'Ship Address', data: shipAddrDraft },
                ].map(({ key, label, data }) => (
                  <div key={key} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">{label}</span>
                    {Object.values(data).filter(Boolean).map((v, i) => (
                      <p key={i} className="text-xs text-slate-700 font-medium leading-snug">{v}</p>
                    ))}
                  </div>
                ))}
              </div>

              {/* Label card: controls bar + preview in one bordered container */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                {/* Controls bar */}
                <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200">
                  {insertLabels.length > 0 ? (
                    <div className="flex gap-1">
                      {[{ abbr: 'Label' }, ...insertLabels].map(tab => (
                        <button key={tab.abbr} type="button"
                          onClick={() => setActivePreviewTab(tab.abbr)}
                          className={`h-8 px-4 rounded-lg text-sm font-semibold cursor-pointer transition ${
                            activePreviewTab === tab.abbr
                              ? 'bg-brand-600 text-white'
                              : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}>
                          {tab.abbr}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm font-semibold text-slate-700 px-1">Label</span>
                  )}

                  <div className="flex items-center gap-2 ml-auto">
                    {/* Format dropdown — same text style as Printer */}
                    <div className="relative h-8">
                      <div className="h-8 px-3 border border-slate-200 bg-white rounded-lg text-xs font-medium text-slate-600 flex items-center gap-1.5 pointer-events-none min-w-[72px] justify-between">
                        <span>{selectedFormat}</span>
                        <ChevronDown className="h-3 w-3 text-slate-400" />
                      </div>
                      <select value={selectedFormat} onChange={e => setSelectedFormat(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full text-xs">
                        {['ZPL', 'PDF', 'PNG'].map(f => <option key={f} className="text-xs">{f}</option>)}
                      </select>
                    </div>

                    {/* Printer dropdown */}
                    <div className="relative">
                      <button type="button" onClick={() => setIsPrinterOpen(p => !p)}
                        className="h-8 px-3 border border-slate-200 bg-white rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer flex items-center gap-1.5 transition min-w-[130px] justify-between">
                        <span className="truncate">{selectedPrinter}</span>
                        <ChevronDown className="h-3 w-3 text-slate-400 shrink-0" />
                      </button>
                      <AnimatePresence>
                        {isPrinterOpen && (
                          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                            className="absolute top-full mt-1 right-0 bg-white border border-slate-100 rounded-xl shadow-lg z-20 py-1 min-w-[160px]">
                            {PRINTERS.map(p => (
                              <button key={p} type="button" onClick={() => { setSelectedPrinter(p); setIsPrinterOpen(false); }}
                                className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer">
                                {p}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button type="button"
                      onClick={() => generatedLabel ? showToast('Sent to printer!') : handleGenerateLabel()}
                      className="h-8 px-4 btn-primary-gradient rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5">
                      <Printer className="h-3.5 w-3.5" /> Print
                    </button>
                  </div>
                </div>

                {/* Preview inside same card */}
                {!order.shipments[0] ? (
                  <div className="bg-slate-50 h-36 flex flex-col items-center justify-center text-slate-400 gap-2 text-xs">
                    <FileText className="h-7 w-7 text-slate-300" />
                    Generate a label to preview
                  </div>
                ) : (
                  <PrintPreview src={labelSampleImg} alt={activePreviewTab === 'Label' ? 'Shipping label' : insertLabels.find(l => l.abbr === activePreviewTab)?.label || 'Insert'} />
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Item verification ─────────────────────────── */}
          <div className="w-1/4 shrink-0 border-l border-slate-100 flex flex-col bg-white">

            {/* Scan to verify */}
            <div className="px-3 pt-3 pb-2 shrink-0">
              <input
                type="text"
                value={verifyScan}
                onChange={e => setVerifyScan(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && verifyScan.trim()) {
                    // Find first unverified item and mark ok
                    const idx = items.findIndex(i => i.status !== 'ok');
                    if (idx !== -1) {
                      setItems(prev => prev.map((it, i) =>
                        i === idx ? { ...it, status: 'ok', verifiedQty: it.qty } : it
                      ));
                    }
                    setVerifyScan('');
                  }
                }}
                placeholder="Scan Label ID to verify"
                className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Header */}
            <div className="px-3 py-2 flex items-center justify-between border-b border-slate-100 shrink-0">
              <span className="text-sm font-bold text-slate-800">Items</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-semibold text-slate-500">TOTAL:</span>
                <span className="text-2xl font-black text-emerald-600 leading-none">{verifiedCount}/{items.length}</span>
              </div>
            </div>

            {/* Item list */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {items.map(item => (
                <div key={item.id} className="px-3 py-3">
                  {/* Style / Color / Size */}
                  <p className="text-xs text-slate-500 mb-2 leading-none">
                    {item.style} / {item.color} / {item.size}
                  </p>
                  {/* Thumbnail + print area link + qty */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col gap-1 min-w-0">
                      {/* Image — click to lightbox */}
                      <img
                        src={itemThumbImg}
                        alt={item.productName}
                        onClick={() => setLightboxImg(itemThumbImg)}
                        className="h-16 w-16 object-contain rounded cursor-zoom-in hover:opacity-80 transition"
                      />
                      {/* Hyperlink — print area name, opens original in new tab */}
                      <a
                        href={itemThumbImg}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 truncate block max-w-[110px]"
                        title={PRINT_AREAS[item.id] || item.productName}
                      >
                        {PRINT_AREAS[item.id] || item.productName}
                      </a>
                    </div>
                    <span className={`text-2xl font-black leading-none shrink-0 ${item.status === 'ok' ? 'text-emerald-600' : 'text-slate-300'}`}>
                      {item.verifiedQty}/{item.qty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Image lightbox */}
      <AnimatePresence>
        {lightboxImg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={() => setLightboxImg(null)}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={lightboxImg}
              alt="Preview"
              className="relative z-10 max-h-[85vh] max-w-[85vw] object-contain rounded-xl shadow-2xl cursor-zoom-out"
              onClick={() => setLightboxImg(null)}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Shipment items detail modal */}
      <AnimatePresence>
        {shipmentItemsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShipmentItemsModal(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ type: 'spring', duration: 0.3 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl border border-slate-100 z-50">

              {/* Header */}
              <div className="px-6 py-5 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Items in this shipment</h3>
                <span className="font-bold text-slate-900">Total: {shipmentItemsModal.itemCount}</span>
              </div>

              {/* Table */}
              <div className="border-t border-slate-100">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F8F9FA] text-slate-500 text-[11.5px] font-semibold uppercase tracking-wider border-b border-slate-100">
                      <th className="py-3 px-6 text-left">Label ID</th>
                      <th className="py-3 px-6 text-left">Employee</th>
                      <th className="py-3 px-6 text-left">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipmentItemsModal.labelItems.map((item, i) => (
                      <tr key={i} className="border-b border-slate-100/70 last:border-0">
                        <td className="py-3.5 px-6 text-sm font-medium text-slate-800 font-mono">{item.labelId}</td>
                        <td className="py-3.5 px-6 text-sm font-medium text-slate-700">{item.employee}</td>
                        <td className="py-3.5 px-6 text-sm font-medium text-slate-700 font-mono">{item.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 flex justify-end">
                <button type="button" onClick={() => setShipmentItemsModal(null)}
                  className="px-5 h-9 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer btn-secondary-sheen">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Detail modal */}
      <AnimatePresence>
        {isOrderDetailOpen && order && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOrderDetailOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ type: 'spring', duration: 0.35 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl border border-slate-100 z-50 max-h-[90vh] overflow-y-auto">

              {/* Header */}
              <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 sticky top-0 bg-white z-10">
                <h3 className="font-bold text-slate-900">Order detail</h3>
                <button type="button" onClick={() => setIsOrderDetailOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"><X className="h-4 w-4" /></button>
              </div>

              {/* Order meta */}
              <div className="px-6 py-4 border-b border-slate-100">
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-bold text-slate-500 mb-1">Order Number</p>
                    <p className="text-sm font-semibold text-slate-900 font-mono">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 mb-1">Ref Number</p>
                    <p className="text-sm font-semibold text-slate-900 font-mono">{order.refNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 mb-1">Order Date</p>
                    <p className="text-sm font-semibold text-slate-900">{new Date().toISOString().slice(0, 10)}</p>
                  </div>
                </div>
              </div>

              {/* Two-column address form */}
              <div className="px-6 py-5 grid grid-cols-2 gap-8">
                {/* Return Address */}
                {([
                  { side: 'return' as const, title: 'Return Address', draft: returnAddrDraft, setDraft: setReturnAddrDraft },
                  { side: 'ship' as const, title: 'Ship Address', draft: shipAddrDraft, setDraft: setShipAddrDraft },
                ] as const).map(({ side, title, draft, setDraft }) => (
                  <div key={side}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
                      <button type="button" className="text-xs text-brand-600 hover:text-brand-800 font-semibold cursor-pointer">Paste US Address</button>
                    </div>
                    <div className="space-y-3">
                      {[
                        { key: 'name', label: 'Name', required: true },
                        { key: 'company', label: 'Company', required: false },
                        { key: 'country', label: 'Country', required: true },
                        { key: 'address', label: 'Address', required: true },
                        { key: 'address2', label: 'Address2', required: false },
                        { key: 'city', label: 'City', required: true },
                        { key: 'zip', label: 'Zip code', required: true },
                        { key: 'phone', label: 'Phone', required: false },
                        { key: 'email', label: 'Email', required: false },
                      ].map(f => (
                        <div key={f.key} className="flex items-center gap-3">
                          <label className="text-xs font-medium text-slate-600 w-16 shrink-0 text-right">
                            {f.label}{f.required && <span className="text-rose-400 ml-0.5">*</span>}
                          </label>
                          <input
                            type="text"
                            value={draft[f.key] || ''}
                            onChange={e => setDraft((p: Record<string,string>) => ({ ...p, [f.key]: e.target.value }))}
                            placeholder={f.label}
                            className="flex-1 h-9 px-3 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder-slate-300"
                          />
                        </div>
                      ))}
                      <div className="flex justify-end pt-1">
                        <button type="button"
                          onClick={() => { setIsOrderDetailOpen(false); showToast(`${title} saved`); }}
                          className="px-5 h-9 btn-primary-gradient rounded-lg text-sm font-bold cursor-pointer">
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Void confirm modal */}
      <AnimatePresence>
        {voidTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setVoidTarget(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ type: 'spring', duration: 0.3 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm border border-slate-100 z-50">
              <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Confirm Refund</h3>
                <button type="button" onClick={() => setVoidTarget(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="px-6 py-6">
                <p className="text-sm text-slate-700">Do you want to refund order?</p>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setVoidTarget(null)}
                  className="px-5 h-9 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer btn-secondary-sheen">
                  Cancel
                </button>
                <button type="button" onClick={() => { setVoidTarget(null); showToast('Shipment voided successfully'); }}
                  className="px-5 h-9 btn-primary-gradient rounded-lg text-sm font-bold cursor-pointer">
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add more — password modal */}
      <AnimatePresence>
        {isAddMorePassOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddMorePassOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ type: 'spring', duration: 0.3 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-xs border border-slate-100 z-50">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Authorization required</h3>
                <button type="button" onClick={() => setIsAddMorePassOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"><X className="h-4 w-4" /></button>
              </div>
              <div className="px-6 py-5 space-y-3">
                <input
                  type="password"
                  value={addMorePass}
                  onChange={e => { setAddMorePass(e.target.value); setAddMorePassError(false); }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const expected = String(new Date().getDate()).padStart(2, '0');
                      if (addMorePass === expected) {
                        setIsAddMorePassOpen(false);
                        handleGenerateLabel();
                      } else {
                        setAddMorePassError(true);
                      }
                    }
                  }}
                  placeholder="Password"
                  autoFocus
                  className={`w-full h-10 px-3 border rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-1 transition ${addMorePassError ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200' : 'border-slate-200 focus:border-brand-500 focus:ring-brand-200'}`}
                />
                {addMorePassError && (
                  <p className="text-xs text-rose-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> Incorrect password
                  </p>
                )}
              </div>
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddMorePassOpen(false)}
                  className="px-4 h-9 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
                  Cancel
                </button>
                <button type="button"
                  onClick={() => {
                    const expected = String(new Date().getDate()).padStart(2, '0');
                    if (addMorePass === expected) {
                      setIsAddMorePassOpen(false);
                      handleGenerateLabel();
                    } else {
                      setAddMorePassError(true);
                    }
                  }}
                  className="px-4 h-9 btn-primary-gradient rounded-lg text-sm font-bold cursor-pointer">
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rate modal */}
      <AnimatePresence>
        {isRateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsRateModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ type: 'spring', duration: 0.35 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-100 z-50">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Create Shipment Label</h3>
                <button type="button" onClick={() => setIsRateModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"><X className="h-4 w-4" /></button>
              </div>
              <div className="px-6 py-5">
                {isLoadingRates ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3 text-slate-400">
                    <Loader2 className="h-7 w-7 animate-spin text-brand-500" />
                    <p className="text-sm font-medium">Retrieving rates…</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 font-medium mb-3">Select a shipping service:</p>
                    {rates.map((r, i) => (
                      <button key={i} type="button" onClick={() => setSelectedRate(r)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition cursor-pointer ${selectedRate === r ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                        <div className="text-left">
                          <p className="text-sm font-bold text-slate-800">{r.carrier} — {r.service}</p>
                          <p className="text-xs text-slate-400">{r.days}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-slate-900">${r.price.toFixed(2)}</span>
                          {selectedRate === r && <Check className="h-4 w-4 text-brand-600" />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setIsRateModalOpen(false)} className="px-4 h-9 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="button" onClick={handleConfirmRate} disabled={!selectedRate || isLoadingRates}
                  className="px-4 h-9 btn-primary-gradient rounded-lg text-sm font-bold cursor-pointer disabled:opacity-40 disabled:pointer-events-none">
                  Confirm & Generate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Insert modal */}
      <AnimatePresence>
        {isInsertOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsInsertOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ type: 'spring', duration: 0.35 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 z-50">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Insert Printing</h3>
                <button type="button" onClick={() => setIsInsertOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer"><X className="h-4 w-4" /></button>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {['Thank You Card', 'Gift Message', 'Promo Insert'].map(t => (
                    <button key={t} type="button" onClick={() => setInsertType(t)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition ${insertType === t ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      {t}
                    </button>
                  ))}
                </div>
                <textarea value={insertMsg} onChange={e => setInsertMsg(e.target.value)} rows={4}
                  placeholder={insertType === 'Thank You Card' ? 'Thank you for your order!' : insertType === 'Gift Message' ? 'Wishing you joy…' : 'Use code SAVE10 for 10% off!'}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none" />
              </div>
              <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
                <button type="button" onClick={() => setIsInsertOpen(false)} className="px-4 h-9 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="button" disabled={!insertMsg.trim()} onClick={() => {
                  const abbr = insertType === 'Thank You Card' ? 'TU' : insertType === 'Gift Message' ? 'GM' : 'PI';
                  setInsertLabels(prev => prev.find(l => l.abbr === abbr) ? prev : [...prev, { abbr, label: insertType }]);
                  showToast('Insert saved!');
                  setIsInsertOpen(false);
                }}
                  className="px-4 h-9 btn-primary-gradient rounded-lg text-sm font-bold cursor-pointer disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5">
                  <Printer className="h-3.5 w-3.5" /> Print Insert
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Address edit modals */}
      <AnimatePresence>
        {editingAddr === 'return' && (
          <EditAddressModal title="Return Address"
            fields={[{ key: 'name', label: 'Name' }, { key: 'company', label: 'Company' }, { key: 'address', label: 'Address' }, { key: 'phone', label: 'Phone' }]}
            values={returnAddrDraft} onChange={(k, v) => setReturnAddrDraft(p => ({ ...p, [k]: v }))}
            onSave={() => { setEditingAddr(null); showToast('Return address updated'); }} onClose={() => setEditingAddr(null)} />
        )}
        {editingAddr === 'ship' && (
          <EditAddressModal title="Ship Address"
            fields={[{ key: 'name', label: 'Name' }, { key: 'address', label: 'Address' }, { key: 'phone', label: 'Phone' }]}
            values={shipAddrDraft} onChange={(k, v) => setShipAddrDraft(p => ({ ...p, [k]: v }))}
            onSave={() => { setEditingAddr(null); showToast('Ship address updated'); }} onClose={() => setEditingAddr(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
