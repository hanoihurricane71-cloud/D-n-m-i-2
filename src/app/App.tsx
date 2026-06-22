import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Calendar, 
  Upload, 
  Shirt, 
  Layers, 
  PackagePlus,
  Check, 
  X, 
  FileText, 
  MoreHorizontal,
  MoreVertical, 
  LogOut,
  HelpCircle, 
  SlidersHorizontal, 
  RotateCcw,
  Sparkles,
  Github,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ShoppingCart,
  Copy,
  Coffee,
  ShoppingBag,
  GlassWater,
  Tag,
  BookOpen,
  Smartphone,
  Image as ImageIcon,
  Smile,
  Home,
  Gift,
  Heart,
  Box,
  Package,
  Palette,
  Wind,
  Scissors,
  Crown,
  Trash2,
  Edit,
  MapPin,
  History,
  ClipboardList,
  Globe,
  Printer,
  QrCode,
  RefreshCw,
  UserCheck,
  Inbox,
  Store,
  Building,
  Download,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const itemThumbImg = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MDAgNTAwIj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2YzZjRmNiIgLz48cmVjdCB4PSI3MCIgeT0iMTEwIiB3aWR0aD0iMzYwIiBoZWlnaHQ9IjI4MCIgcng9IjMyIiBmaWxsPSJub25lIiBzdHJva2U9IiM5YmEzYWYiIHN0cm9rZS13aWR0aD0iMjAiIC8+PGNpcmNsZSBjeD0iMzEwIiBjeT0iMTkwIiByPSIzNSIgZmlsbD0iIzliYTNhZiIgLz48cG9seWdvbiBwb2ludHM9IjgwLDM4MCAyMTAsMTk1IDMxNSwzODAiIGZpbGw9IiM5YmEzYWYiIC8+PHBvbHlnb24gcG9pbnRzPSIyMTUsMzgwIDMyNSwyMzAgNDIwLDM4MCIgZmlsbD0iIzliYTNhZiIgLz48L3N2Zz4=";

import { Product, TabType, PurchaseOrder, PurchaseOrderItem, AdditionItem, LocationItem, LocationHistoryItem, OrderManagementItem, StoreRowItem } from './types';
import { 
  INITIAL_PRODUCTS, 
  STYLE_OPTIONS, 
  COLOR_OPTIONS, 
  SIZE_OPTIONS, 
  STOCK_OPTIONS, 
  CUSTOMER_OPTIONS,
  INITIAL_PURCHASE_ORDERS,
  VENDOR_OPTIONS,
  CARRIER_OPTIONS,
  INITIAL_ADDITIONS,
  INITIAL_LOCATIONS,
  INITIAL_LOCATION_HISTORY,
  INITIAL_ORDERS
} from './data';
import { Toggle } from './components/Toggle';
import { FilterDropdown } from './components/FilterDropdown';
import { CreateModal } from './components/CreateModal';
import { CreatePurchaseOrderModal } from './components/CreatePurchaseOrderModal';
import { CreateInventoryAdditionModal } from './components/CreateInventoryAdditionModal';
import { LabelTab } from './components/LabelTab';
import { OrderManagementTab } from './components/OrderManagementTab';
import { OrderDetailView } from './components/OrderDetailView';
import { ProductTab } from './components/ProductTab';
import { PurchaseOrderTab } from './components/PurchaseOrderTab';
import { AdditionTab } from './components/AdditionTab';
import { LocationTab } from './components/LocationTab';
import { StoreManagementTab } from './components/StoreManagementTab';

export const getServicesList = (weight: number, l: number, w: number, h: number, carrier: string = 'ALL') => {
  const scale = (weight / 47.92) * 0.4 + ((l * w * h) / (7 * 5 * 14)) * 0.6;
  const safeScale = Number.isFinite(scale) && scale > 0.05 ? scale : 1.0;

  const usps1 = (8.61 * safeScale).toFixed(2);
  const usps2 = (13.67 * safeScale).toFixed(2);
  const dhl1 = (44.50 * safeScale).toFixed(2);
  const ups1 = (11.20 * safeScale).toFixed(2);
  const ups2 = (32.80 * safeScale).toFixed(2);
  const fedex1 = (12.40 * safeScale).toFixed(2);
  const fedex2 = (24.90 * safeScale).toFixed(2);

  const cleanCarrier = (carrier || 'ALL').trim().toUpperCase();

  if (cleanCarrier === 'USPS') {
    return [
      { name: 'USPS GroundAdvantage - NSA Account', est: 'Est delivery 3 days', price: `$${usps1}`, carrier: 'USPS' },
      { name: 'USPS Priority - NSA Account', est: 'Est delivery 2 days', price: `$${usps2}`, carrier: 'USPS' }
    ];
  } else if (cleanCarrier === 'DHL') {
    return [
      { name: 'DHL Express Worldwide', est: 'Est delivery 2-3 days', price: `$${dhl1}`, carrier: 'DHL' }
    ];
  } else if (cleanCarrier === 'UPS') {
    return [
      { name: 'UPS Ground - NSA Account', est: 'Est delivery 3 days', price: `$${ups1}`, carrier: 'UPS' },
      { name: 'UPS Next Day Air Saver', est: 'Est delivery 1 day', price: `$${ups2}`, carrier: 'UPS' }
    ];
  } else if (cleanCarrier === 'FEDEX') {
    return [
      { name: 'FedEx Home Delivery', est: 'Est delivery 3 days', price: `$${fedex1}`, carrier: 'FedEx' },
      { name: 'FedEx 2Day', est: 'Est delivery 2 days', price: `$${fedex2}`, carrier: 'FedEx' }
    ];
  } else {
    return [
      { name: 'USPS GroundAdvantage - NSA Account', est: 'Est delivery 3 days', price: `$${usps1}`, carrier: 'USPS' },
      { name: 'UPS Ground - NSA Account', est: 'Est delivery 3 days', price: `$${ups1}`, carrier: 'UPS' },
      { name: 'DHL Express Worldwide', est: 'Est delivery 2-3 days', price: `$${dhl1}`, carrier: 'DHL' }
    ];
  }
};


interface TypeRowItem {
  id: string;
  typeName: string;
  createdAt: string;
  createdBy: string;
  iconName?: string;
}

interface StyleRowItem {
  id: string;
  productName: string;
  productStyle: string;
  type: string;
  createdAt: string;
  createdBy: string;
}

interface ColorRowItem {
  id: string;
  colorName: string;
  colorHexCode: string;
  colorPreview: string;
  createdAt: string;
  createdBy: string;
}

interface SizeRowItem {
  id: string;
  sizeName: string;
  createdAt: string;
  createdBy: string;
}

const TYPE_ITEMS: TypeRowItem[] = [
  { id: '1123', typeName: 'Tee', createdAt: 'Jan 3, 2024', createdBy: 'Olivia Rhye', iconName: 'Shirt' },
  { id: '1234', typeName: 'Fleece', createdAt: 'Jan 3, 2024', createdBy: 'Olivia Rhye', iconName: 'Layers' },
  { id: '1235', typeName: 'Mug', createdAt: 'Jan 3, 2024', createdBy: 'Olivia Rhye', iconName: 'Coffee' },
  { id: '1236', typeName: 'Bags', createdAt: 'Jan 3, 2024', createdBy: 'Olivia Rhye', iconName: 'ShoppingBag' },
  { id: '1237', typeName: 'Tumbler', createdAt: 'Jan 3, 2024', createdBy: 'Olivia Rhye', iconName: 'GlassWater' }
];

const STYLE_ITEMS: StyleRowItem[] = [
  { id: '1123', productName: 'Comfortable 100% cotton tee', productStyle: 'GG500', type: 'Tee', createdAt: 'Jan 3, 2024', createdBy: 'Olivia Rhye' },
  { id: '1234', productName: 'Warm fleece with front poclet', productStyle: 'G12000', type: 'Fleece', createdAt: 'Jan 3, 2024', createdBy: 'Olivia Rhye' },
  { id: '1235', productName: 'Warm fleece with front poclet', productStyle: 'G15000', type: 'Mugs', createdAt: 'Jan 3, 2024', createdBy: 'Olivia Rhye' },
  { id: '1236', productName: 'Warm fleece with front poclet', productStyle: 'G20000', type: 'Dog leash', createdAt: 'Jan 3, 2024', createdBy: 'Olivia Rhye' },
  { id: '1237', productName: 'Warm fleece with front poclet', productStyle: 'G30000', type: 'Tote bag', createdAt: 'Jan 3, 2024', createdBy: 'Olivia Rhye' }
];

const COLOR_ITEMS: ColorRowItem[] = [
  { id: '1123', colorName: 'Ocean blue', colorHexCode: '#0076Be', colorPreview: '#E15A5A', createdAt: 'Jan 3, 2024', createdBy: 'Olivia Rhye' },
  { id: '1234', colorName: 'Sunset orange', colorHexCode: '#0076Be', colorPreview: '#4ADE80', createdAt: 'Jan 3, 2024', createdBy: 'Olivia Rhye' },
  { id: '1235', colorName: 'Cherry red', colorHexCode: '#0076Be', colorPreview: '#5C6BC0', createdAt: 'Jan 3, 2024', createdBy: 'Olivia Rhye' },
  { id: '1236', colorName: 'Pearl white', colorHexCode: '#0076Be', colorPreview: '#FFB74D', createdAt: 'Jan 3, 2024', createdBy: 'Olivia Rhye' },
  { id: '1237', colorName: 'Sky blue', colorHexCode: '#0076Be', colorPreview: '#F06292', createdAt: 'Jan 3, 2024', createdBy: 'Olivia Rhye' }
];

const SIZE_ITEMS: SizeRowItem[] = [
  { id: '1123', sizeName: 'Small', createdAt: 'Jan 3, 2024', createdBy: 'Olivia Rhye' },
  { id: '1234', sizeName: 'Medium', createdAt: 'Jan 3, 2024', createdBy: 'Olivia Rhye' },
  { id: '1235', sizeName: 'Large', createdAt: 'Jan 3, 2024', createdBy: 'Olivia Rhye' },
  { id: '1236', sizeName: 'Extra large', createdAt: 'Jan 3, 2024', createdBy: 'Olivia Rhye' },
  { id: '1237', sizeName: 'XX large', createdAt: 'Jan 3, 2024', createdBy: 'Olivia Rhye' }
];

function parseDateString(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  } catch (e) {
    return "";
  }
}

const getTypeIcon = (typeName: string, iconName?: string) => {
  const normIcon = (iconName || '').toLowerCase().trim();

  // Handle custom uploaded PNG/SVG/JPG/WEBP base64 encoded strings
  if (iconName && (iconName.startsWith('data:image/') || iconName.startsWith('blob:') || iconName.startsWith('http://') || iconName.startsWith('https://'))) {
    return <img src={iconName} alt="" className="h-4.5 w-4.5 object-contain select-none" referrerPolicy="no-referrer" />;
  }

  // Preloaded Icons matching presets
  if (normIcon === 'shirt') return <Shirt className="h-4.5 w-4.5 text-indigo-500" />;
  if (normIcon === 'layers') return <Layers className="h-4.5 w-4.5 text-sky-500" />;
  if (normIcon === 'coffee') return <Coffee className="h-4.5 w-4.5 text-amber-500" />;
  if (normIcon === 'shoppingbag') return <ShoppingBag className="h-4.5 w-4.5 text-rose-500" />;
  if (normIcon === 'glasswater') return <GlassWater className="h-4.5 w-4.5 text-emerald-500" />;
  if (normIcon === 'tag') return <Tag className="h-4.5 w-4.5 text-slate-400" />;
  if (normIcon === 'bookopen') return <BookOpen className="h-4.5 w-4.5 text-orange-500" />;
  if (normIcon === 'smartphone') return <Smartphone className="h-4.5 w-4.5 text-teal-400" />;
  if (normIcon === 'image') return <ImageIcon className="h-4.5 w-4.5 text-pink-500" />;
  if (normIcon === 'smile') return <Smile className="h-4.5 w-4.5 text-yellow-500" />;
  if (normIcon === 'home') return <Home className="h-4.5 w-4.5 text-violet-500" />;
  if (normIcon === 'gift') return <Gift className="h-4.5 w-4.5 text-rose-400" />;
  if (normIcon === 'heart') return <Heart className="h-4.5 w-4.5 text-red-500" />;
  if (normIcon === 'box') return <Box className="h-4.5 w-4.5 text-amber-600" />;
  if (normIcon === 'package') return <Package className="h-4.5 w-4.5 text-stone-500" />;
  if (normIcon === 'palette') return <Palette className="h-4.5 w-4.5 text-purple-500" />;
  if (normIcon === 'wind') return <Wind className="h-4.5 w-4.5 text-cyan-500" />;
  if (normIcon === 'scissors') return <Scissors className="h-4.5 w-4.5 text-slate-500" />;
  if (normIcon === 'sparkles') return <Sparkles className="h-4.5 w-4.5 text-amber-400" />;
  if (normIcon === 'crown') return <Crown className="h-4.5 w-4.5 text-amber-500" />;

  const norm = typeName.toLowerCase();
  if (norm.includes('tee') || norm.includes('shirt')) return <Shirt className="h-4.5 w-4.5 text-indigo-500" />;
  if (norm.includes('fleece') || norm.includes('hoodie')) return <Layers className="h-4.5 w-4.5 text-sky-500" />;
  if (norm.includes('mug')) return <Coffee className="h-4.5 w-4.5 text-amber-500" />;
  if (norm.includes('bag') || norm.includes('tote')) return <ShoppingBag className="h-4.5 w-4.5 text-rose-500" />;
  if (norm.includes('tumbler') || norm.includes('bottle')) return <GlassWater className="h-4.5 w-4.5 text-emerald-500" />;
  return <Tag className="h-4.5 w-4.5 text-slate-400" />;
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

const parseUSAddress = (rawText: string) => {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  let parsed = {
    name: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    phone: '',
    email: '',
  };

  if (lines.length > 0) parsed.name = lines[0];

  let addressLines: string[] = [];
  for (let i = 1; i < lines.length; i++) {
    const l = lines[i];
    const lower = l.toLowerCase();
    if (lower.startsWith('phone:') || lower.startsWith('t:') || lower.startsWith('tel:')) {
      parsed.phone = l.replace(/^(phone|t|tel):/i, '').trim();
    } else if (lower.startsWith('email:') || lower.includes('@')) {
      parsed.email = l.replace(/^email:/i, '').trim();
    } else if (/\d{10,}/.test(l.replace(/[-() ]/g, '')) && !parsed.phone) {
      parsed.phone = l.trim();
    } else {
      addressLines.push(l);
    }
  }

  if (addressLines.length > 0) {
    const lastLine = addressLines[addressLines.length - 1].toLowerCase();
    if (lastLine === 'us' || lastLine === 'usa' || lastLine === 'united states' || lastLine === 'america') {
      parsed.country = 'United States';
      addressLines.pop();
    }
  }

  if (addressLines.length > 0) {
    const cityStateZipLine = addressLines[addressLines.length - 1];
    const match = cityStateZipLine.match(/^([^,]+),\s*([A-Za-z\s]{2,})\s+(\d{5}(-\d{4})?|\d{5,9})$/);
    if (match) {
      parsed.city = match[1].trim();
      parsed.state = match[2].trim();
      parsed.zip = match[3].trim();
      addressLines.pop();
    } else {
      const parts = cityStateZipLine.split(',');
      if (parts.length >= 2) {
        parsed.city = parts[0].trim();
        const stateZipStr = parts[1].trim();
        const zipMatch = stateZipStr.match(/\d{5}(-\d{4})?/);
        if (zipMatch) {
          parsed.zip = zipMatch[0];
          parsed.state = stateZipStr.replace(zipMatch[0], '').trim();
        } else {
          parsed.state = stateZipStr;
        }
        addressLines.pop();
      }
    }
  }

  if (addressLines.length === 1) {
    parsed.address1 = addressLines[0];
  } else if (addressLines.length === 2) {
    parsed.company = addressLines[0];
    parsed.address1 = addressLines[1];
  } else if (addressLines.length >= 3) {
    parsed.company = addressLines[0];
    parsed.address1 = addressLines[1];
    parsed.address2 = addressLines[2];
  }

  return parsed;
};

const WAREHOUSE_PRESETS = [
  {
    name: 'Warehouse A',
    company: 'SwiftPOD LLC - Warehouse A',
    firstName: 'Hiep',
    lastName: 'Admin',
    email: 'warehouse-a@swiftpod.live',
    phone: '408-555-0199',
    country: 'United States',
    address1: '2070 S 7th St. Ste E',
    address2: '',
    city: 'San Jose',
    zip: '95112'
  },
  {
    name: 'Warehouse B',
    company: 'SwiftPOD LLC - Warehouse B',
    firstName: 'Warehouse B',
    lastName: 'Team',
    email: 'warehouse-b@swiftpod.live',
    phone: '201-555-0144',
    country: 'United States',
    address1: '1000 Logistics Blvd Suite 4',
    address2: 'Dock 12A',
    city: 'Keasbey',
    zip: '08832'
  }
];

export default function App() {
  // Master data states
  const [types, setTypes] = useState<TypeRowItem[]>(TYPE_ITEMS);
  const [styles, setStyles] = useState<StyleRowItem[]>(STYLE_ITEMS);
  const [colors, setColors] = useState<ColorRowItem[]>(COLOR_ITEMS);
  const [sizes, setSizes] = useState<SizeRowItem[]>(SIZE_ITEMS);

  // Application State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activeTab, setActiveTab] = useState<TabType>('Product');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filtering States
  const [selectedStyle, setSelectedStyle] = useState('All Styles');
  const [selectedColor, setSelectedColor] = useState('All Colors');
  const [selectedSize, setSelectedSize] = useState('All Sizes');
  const [selectedStock, setSelectedStock] = useState('All Statuses');
  const [selectedCustomer, setSelectedCustomer] = useState('All Customers');
  const [createdDateFilter, setCreatedDateFilter] = useState('All Dates');
  const [selectedStyleTypeFilter, setSelectedStyleTypeFilter] = useState('All Types');

  const dateInputRef = useRef<HTMLInputElement>(null);
  const historyDateFromRef = useRef<HTMLInputElement>(null);
  const historyDateToRef = useRef<HTMLInputElement>(null);

  // Pagination & Layout Settings
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);

  // Modals & Banners Control
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info'; text: string } | null>(null);

  // --- Shipping Label and Shipment Info Custom States ---
  const [labelFormOrderNo, setLabelFormOrderNo] = useState('');
  const [labelFormClient, setLabelFormClient] = useState('');
  const [labelFormCurrency, setLabelFormCurrency] = useState('USD');
  const [labelFormFirstName, setLabelFormFirstName] = useState('');
  const [labelFormLastName, setLabelFormLastName] = useState('');
  const [labelFormCompany, setLabelFormCompany] = useState('');
  const [labelFormEmail, setLabelFormEmail] = useState('');
  const [labelFormPhone, setLabelFormPhone] = useState('');
  const [labelFormCountry, setLabelFormCountry] = useState('United States');
  const [labelFormHsCode, setLabelFormHsCode] = useState('');
  const [labelFormCustomsRefId, setLabelFormCustomsRefId] = useState('');
  const [labelFormCustomsCountry, setLabelFormCustomsCountry] = useState('United States');
  const [labelFormCustomsHsCode, setLabelFormCustomsHsCode] = useState('');
  const [labelFormCustomsNetWeight, setLabelFormCustomsNetWeight] = useState('6.2');
  const [labelFormCustomsPrice, setLabelFormCustomsPrice] = useState('14.50');
  const [labelFormCustomsQty, setLabelFormCustomsQty] = useState('1');
  const [labelFormCustomsDesc, setLabelFormCustomsDesc] = useState('');
  const [isCustomsFormCollapsed, setIsCustomsFormCollapsed] = useState(false);
  const [isCustomsFormActive, setIsCustomsFormActive] = useState(true);
  const isInternationalCountry = (countryStr: string) => {
    const c = (countryStr || '').toLowerCase().trim();
    return c !== '' && c !== 'united states' && c !== 'us' && c !== 'usa' && c !== 'united states of america';
  };
  const getProductItemImage = (sku: string = '', name: string = '', styleColor: string = '') => {
    const normSku = (sku || '').toLowerCase();
    const normName = (name || '').toLowerCase();
    const normStyle = (styleColor || '').toLowerCase();

    // Default premium male model in burgundy t-shirt (as requested and illustrated in mockup)
    const defaultImage = "https://images.unsplash.com/photo-1562572159-4ebcd318f4dd?auto=format&fit=crop&q=80&w=400";

    if (normStyle.includes('maroon') || normName.includes('polo') || normSku.includes('char') || normStyle.includes('charcoal')) {
      return "https://images.unsplash.com/photo-1562572159-4ebcd318f4dd?auto=format&fit=crop&q=80&w=400";
    }
    if (normStyle.includes('black') || normSku.includes('blk') || normName.includes('black')) {
      return "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=400";
    }
    if (normStyle.includes('white') || normSku.includes('wht') || normName.includes('white')) {
      return "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400";
    }
    if (normName.includes('sweatshirt') || normName.includes('hoodie') || normSku.includes('hd-nvy') || normStyle.includes('navy')) {
      return "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=400";
    }
    
    return defaultImage;
  };
  const [labelFormAddress1, setLabelFormAddress1] = useState('');
  const [labelFormAddress2, setLabelFormAddress2] = useState('');
  const [labelFormCity, setLabelFormCity] = useState('');
  const [labelFormZip, setLabelFormZip] = useState('');
  const [labelFormDimUnit, setLabelFormDimUnit] = useState('Inches (in)');
  const [labelFormWeightUnit, setLabelFormWeightUnit] = useState('Ounces (oz)');
  const [labelFormPackages, setLabelFormPackages] = useState<Array<{
    index: number;
    refId: string;
    savedPkg: string;
    weight: string;
    length: string;
    width: string;
    height: string;
    items?: string[];
  }>>([]);
  const [labelFormShipOption, setLabelFormShipOption] = useState<'tier' | 'carrier'>('carrier');
  const [labelFormSelectedCarrier, setLabelFormSelectedCarrier] = useState('UPS Ground');
  const [labelFormCarrierPackage, setLabelFormCarrierPackage] = useState('ALL');
  const [labelFormGetRateClicked, setLabelFormGetRateClicked] = useState(false);
  const [labelFormLoadingRates, setLabelFormLoadingRates] = useState(false);
  const [labelFormSelectedRateIndex, setLabelFormSelectedRateIndex] = useState(-1);
  const [showAddressDetails, setShowAddressDetails] = useState(false);
  const [labelFormNewSku, setLabelFormNewSku] = useState('');
  const [labelFormNewSkuName, setLabelFormNewSkuName] = useState('');
  const [labelFormNewSkuQty, setLabelFormNewSkuQty] = useState(1);
  const [isShipmentViewModalOpen, setIsShipmentViewModalOpen] = useState(false);
  const [selectedShipmentForView, setSelectedShipmentForView] = useState<any>(null);
  const [shipmentPreviewFormat, setShipmentPreviewFormat] = useState<string>('PDF');
  const [senderName, setSenderName] = useState('SwiftPOD LLC');
  const [senderAddress, setSenderAddress] = useState('2070 S 7th St. Ste E , San Jose, CA 95112');
  const [senderFirstName, setSenderFirstName] = useState('Hiep');
  const [senderLastName, setSenderLastName] = useState('Admin');
  const [senderCompany, setSenderCompany] = useState('SwiftPOD LLC');
  const [senderEmail, setSenderEmail] = useState('admin@swiftpod.com');
  const [senderPhone, setSenderPhone] = useState('408-555-0199');
  const [senderCountry, setSenderCountry] = useState('United States');
  const [senderAddress1, setSenderAddress1] = useState('2070 S 7th St. Ste E');
  const [senderAddress2, setSenderAddress2] = useState('');
  const [senderCity, setSenderCity] = useState('San Jose');
  const [senderZip, setSenderZip] = useState('95112');
  const [labelFormDestinationType, setLabelFormDestinationType] = useState<'Domestic' | 'International'>('Domestic');
  const [selectedWarehouseForLabel, setSelectedWarehouseForLabel] = useState('Warehouse A');
  const [warehousePresets, setWarehousePresets] = useState<Array<{
    name: string;
    company: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    address1: string;
    address2: string;
    city: string;
    zip: string;
  }>>(() => {
    const saved = localStorage.getItem('label_warehouse_presets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return WAREHOUSE_PRESETS;
  });

  useEffect(() => {
    localStorage.setItem('label_warehouse_presets', JSON.stringify(warehousePresets));
  }, [warehousePresets]);

  const [isAddingNewWarehouse, setIsAddingNewWarehouse] = useState(false);
  const [newWhName, setNewWhName] = useState('');
  const [newWhCompany, setNewWhCompany] = useState('');
  const [newWhFirstName, setNewWhFirstName] = useState('');
  const [newWhLastName, setNewWhLastName] = useState('');
  const [newWhEmail, setNewWhEmail] = useState('');
  const [newWhPhone, setNewWhPhone] = useState('');
  const [newWhCountry, setNewWhCountry] = useState('United States');
  const [newWhAddress1, setNewWhAddress1] = useState('');
  const [newWhAddress2, setNewWhAddress2] = useState('');
  const [newWhCity, setNewWhCity] = useState('');
  const [newWhZip, setNewWhZip] = useState('');

  const [isSenderEditing, setIsSenderEditing] = useState(false);

  // Active Navigation item
  const [activeNavItem, setActiveNavItem] = useState<'Order' | 'Product' | 'Purchase order' | 'WIP printing' | 'Addition' | 'Location' | 'Store'>('Product');

  // User Profile Dropdown state
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  // Connection Stores State
  const [stores, setStores] = useState<StoreRowItem[]>([
    {
      id: 'store-1',
      active: true,
      integration: 'SwiftPOD API',
      storeName: 'Olivia Rhye Store',
      storeCode: 'OLIVIA_RHYE_01',
      returnAddress: '456 Return Way, Carson, CA 90746',
      createdAt: '2026-05-12',
      createdBy: 'Olivia Rhye'
    },
    {
      id: 'store-2',
      active: true,
      integration: 'OrderDesk',
      storeName: 'Acme Corp Merch',
      storeCode: 'ACME_CORP_MERCH',
      returnAddress: '456 Return Way, Carson, CA 90746',
      createdAt: '2026-05-20',
      createdBy: 'Hiep Tran'
    },
    {
      id: 'store-3',
      active: false,
      integration: 'SwiftPOD API',
      storeName: 'Phoenix Baker Apparel',
      storeCode: 'PHOENIX_BAKER_AP',
      returnAddress: '456 Return Way, Carson, CA 90746',
      createdAt: '2026-06-01',
      createdBy: 'Sarah Lee'
    }
  ]);

  const handleCreateStore = (newStore: Omit<StoreRowItem, 'id' | 'createdAt'>) => {
    const store: StoreRowItem = {
      ...newStore,
      id: `store-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setStores(prev => [store, ...prev]);
  };

  const handleUpdateStore = (id: string, updatedFields: Omit<StoreRowItem, 'id' | 'createdAt'>) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));
  };

  const handleDeleteStore = (id: string) => {
    setStores(prev => prev.filter(s => s.id !== id));
    triggerToast('Store connection deleted successfully', 'success');
  };

  // WIP printing (PAP) custom list and states
  const [papSelectedChannel, setPapSelectedChannel] = useState<string>('RBBL');
  const [papThirdOptionId, setPapThirdOptionId] = useState<string>('MYYM');
  const [isPapChannelDropdownOpen, setIsPapChannelDropdownOpen] = useState<boolean>(false);
  const [papSelectedAccount, setPapSelectedAccount] = useState<string>('Select Account');
  const [papDateFrom, setPapDateFrom] = useState<string>('2026-05-01');
  const [papDateTo, setPapDateTo] = useState<string>('2026-06-30');
  const [papPretreatment, setPapPretreatment] = useState<string>('Pretreatment');
  const [papColorInput, setPapColorInput] = useState<string>('Color');
  const [papInkIndicator, setPapInkIndicator] = useState<string>('Ink Indicator');
  const [papCounterValue, setPapCounterValue] = useState<number>(0);
  const [papSelectedStyleFilter, setPapSelectedStyleFilter] = useState<string>('18000');
  const [papSelectedTechFilter, setPapSelectedTechFilter] = useState<string>('ALL');
  const [papHistoryTypeFilter, setPapHistoryTypeFilter] = useState<string>('Filter by Type');
  const [papHistorySearchSku, setPapHistorySearchSku] = useState<string>('');

  const [papPrintingCurrentPage, setPapPrintingCurrentPage] = useState<number>(1);
  const [papPrintingPageSize, setPapPrintingPageSize] = useState<number>(10);
  const [isPapPrintingPageSizeOpen, setIsPapPrintingPageSizeOpen] = useState<boolean>(false);

  const [papHistoryCurrentPage, setPapHistoryCurrentPage] = useState<number>(1);
  const [papHistoryPageSize, setPapHistoryPageSize] = useState<number>(10);
  const [isPapHistoryPageSizeOpen, setIsPapHistoryPageSizeOpen] = useState<boolean>(false);

  // PAP WIP Label Management states
  interface PAPProductStyle {
    id: string;
    name: string;
    pendingLabels: number;
    lastPrinted: string;
  }

  interface PAPPrintingItem {
    id: string;
    createdAt: string;
    style: string;
    user: string;
    empId: string;
    quantity: number;
    status: 'Pending' | 'Completed';
    labelIds: string[];
    color: string;
    size: string;
    tags?: string[];
  }

  interface PAPHistoryItem {
    id: string;
    createdAt: string;
    style: string;
    user: string;
    empId: string;
    quantity: number;
    status: 'Completed';
    printedAt: string;
    labelIds: string[];
    color: string;
    size: string;
    tags?: string[];
  }

  const [papStyles, setPapStyles] = useState<PAPProductStyle[]>([
    { id: '18000', name: '18000', pendingLabels: 6, lastPrinted: 'Jul 28, 2025 2:22 PM' },
    { id: '5000', name: '5000', pendingLabels: 9, lastPrinted: 'Dec 17, 2025 10:05 AM' },
    { id: '1468', name: '1468', pendingLabels: 2, lastPrinted: 'May 28, 2026 9:33 AM' },
    { id: '1469', name: '1469', pendingLabels: 4, lastPrinted: 'May 28, 2026 10:53 AM' },
    { id: '3001', name: '3001', pendingLabels: 26, lastPrinted: 'Jun 11, 2026 2:11 PM' }
  ]);

  const [papPrintingQueue, setPapPrintingQueue] = useState<PAPPrintingItem[]>([
    {
      id: '149504',
      createdAt: '2026-06-16 14:00',
      style: '18000',
      user: 'Tech',
      empId: 'EMP001',
      quantity: 1,
      status: 'Completed',
      labelIds: ['061626-PAP-S-149504-1'],
      color: 'White',
      size: 'S',
      tags: ['Reprint', 'PTFY-API']
    },
    {
      id: '149501',
      createdAt: '2026-06-16 13:54',
      style: '18000',
      user: 'Tech',
      empId: 'EMP001',
      quantity: 2,
      status: 'Completed',
      labelIds: ['061626-PAP-M-149501-1', '061626-PAP-M-149501-2'],
      color: 'White',
      size: 'M',
      tags: ['Manual', 'DTrang']
    },
    {
      id: '149495',
      createdAt: '2026-06-16 13:49',
      style: '18000',
      user: 'Tech',
      empId: 'EMP001',
      quantity: 3,
      status: 'Completed',
      labelIds: ['061626-PAP-L-149495-1', '061626-PAP-L-149495-2', '061626-PAP-L-149495-3'],
      color: 'Black',
      size: 'L',
      tags: ['DTrang', '18000']
    },
    {
      id: '149486',
      createdAt: '2026-06-16 13:40',
      style: '5000',
      user: 'Mytest',
      empId: 'EMP003',
      quantity: 1,
      status: 'Completed',
      labelIds: ['061626-PAP-XL-149486-1'],
      color: 'Gray',
      size: 'XL',
      tags: ['Tiktok', 'MYYM_2', 'RBT']
    },
    {
      id: '149485',
      createdAt: '2026-06-16 13:39',
      style: '5000',
      user: 'Mytest',
      empId: 'EMP003',
      quantity: 1,
      status: 'Completed',
      labelIds: ['061626-PAP-M-149485-1'],
      color: 'Gray',
      size: 'M',
      tags: ['Tiktok', 'RBT']
    },
    {
      id: '149479',
      createdAt: '2026-06-16 13:34',
      style: '18000',
      user: 'Tech',
      empId: 'EMP001',
      quantity: 1,
      status: 'Pending',
      labelIds: ['061626-PAP-S-149479-1'],
      color: 'Black',
      size: 'S',
      tags: ['Manual', 'DTrang']
    },
    {
      id: '149476',
      createdAt: '2026-06-16 13:26',
      style: '1468',
      user: 'Mytest',
      empId: 'EMP003',
      quantity: 1,
      status: 'Completed',
      labelIds: ['061626-PAP-XL-149476-1'],
      color: 'Navy',
      size: 'XL',
      tags: ['Manual', 'MYYM_2', 'RBT']
    },
    {
      id: '149480',
      createdAt: '2026-06-16 13:35',
      style: '3001',
      user: 'John Smith',
      empId: 'EMP001',
      quantity: 26,
      status: 'Completed',
      labelIds: Array.from({ length: 26 }, (_, i) => `061626-PAP-M-149480-${i + 1}`),
      color: 'Red',
      size: 'M',
      tags: ['WIP', '3001']
    }
  ]);

  const [papHistory, setPapHistory] = useState<PAPHistoryItem[]>([
    {
      id: '149475',
      createdAt: '2026-06-16 13:25',
      style: '1468',
      user: 'Mytest',
      empId: 'EMP003',
      quantity: 1,
      status: 'Completed',
      printedAt: '2026-06-16 13:30',
      labelIds: ['061626-PAP-L-149475-1'],
      color: 'Navy',
      size: 'L',
      tags: ['Reprint', 'MYYM_2', 'RBT']
    },
    {
      id: '149474',
      createdAt: '2026-06-16 13:23',
      style: '1469',
      user: 'Mytest',
      empId: 'EMP003',
      quantity: 1,
      status: 'Completed',
      printedAt: '2026-06-16 13:24',
      labelIds: ['061626-PAP-S-149474-1'],
      color: 'White',
      size: 'S',
      tags: ['Reprint', 'RBT']
    },
    {
      id: '149473',
      createdAt: '2026-06-16 13:21',
      style: '1469',
      user: 'Tech',
      empId: 'EMP001',
      quantity: 1,
      status: 'Completed',
      printedAt: '2026-06-16 13:22',
      labelIds: ['061626-PAP-M-149473-1'],
      color: 'White',
      size: 'M',
      tags: ['Tiktok', 'RBT']
    },
    {
      id: '149470',
      createdAt: '2026-06-16 13:19',
      style: '1469',
      user: 'Mytest',
      empId: 'EMP003',
      quantity: 1,
      status: 'Completed',
      printedAt: '2026-06-16 13:20',
      labelIds: ['061626-PAP-S-149470-1'],
      color: 'White',
      size: 'S',
      tags: ['Tiktok', 'MYYM_2', 'RBT']
    }
  ]);

  const [papActiveTab, setPapActiveTab] = useState<'Printing' | 'History'>('Printing');
  const [papGeneratedToday, setPapGeneratedToday] = useState(980);
  const [papPrintedToday, setPapPrintedToday] = useState(750);

  // Selected item for the right-side thermal label preview panel
  const [selectedPreviewItem, setSelectedPreviewItem] = useState<{
    id: string;
    style: string;
    labelId: string;
    createdAt: string;
    color: string;
    size: string;
  } | null>({
    id: '1054',
    style: 'T-Shirt',
    labelId: '061626-PAP-S-001054-1',
    createdAt: '2026-06-16 09:42',
    color: 'Black',
    size: 'S'
  });

  // Print Modal states
  const [isPrintConfirmModalOpen, setIsPrintConfirmModalOpen] = useState(false);
  const [printTargetItem, setPrintTargetItem] = useState<PAPPrintingItem | null>(null);
  const [firstLabelScanned, setFirstLabelScanned] = useState<string>('');
  const [lastLabelScanned, setLastLabelScanned] = useState<string>('');

  // Reprint Modal states
  const [isReprintModalOpen, setIsReprintModalOpen] = useState(false);
  const [reprintTargetItem, setReprintTargetItem] = useState<PAPHistoryItem | null>(null);
  const [reprintLeaderId, setReprintLeaderId] = useState<string>('');

  // Reconvert Modal states
  const [isReconvertModalOpen, setIsReconvertModalOpen] = useState(false);
  const [reconvertTargetItem, setReconvertTargetItem] = useState<PAPHistoryItem | null>(null);
  const [reconvertLeaderId, setReconvertLeaderId] = useState<string>('');

  // YYYY-MM-DD HH:MM DateTime Helper
  const getYYYYMMDDHHMM = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const date = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${date} ${hours}:${minutes}`;
  };

  // PST Time Helper
  const getPSTTimeString = () => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    return new Intl.DateTimeFormat('en-US', options).format(new Date()) + ' PST';
  };

  // PST Date-only helper
  const getPSTDateOnlyString = () => {
    const d = new Date();
    const pstDateStr = d.toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' });
    const parts = pstDateStr.split('/');
    const m = parts[0].padStart(2, '0');
    const day = parts[1].padStart(2, '0');
    const y = parts[2].substring(2);
    return {
      mmddyy: `${m}${day}${y}`,
      fullDate: d.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/Los_Angeles' }).replace(/\//g, '-')
    };
  };

  const getEmployeeName = (empId: string) => {
    const up = empId.toUpperCase().trim();
    if (up === 'EMP001') return 'John Smith';
    if (up === 'EMP002') return 'Sarah Lee';
    if (up === 'EMP003') return 'Michael Chen';
    if (up.startsWith('EMP')) {
      return `Operator ${up.substring(3)}`;
    }
    return up || 'Unknown Employee';
  };



  // Order Management states
  const [orders, setOrders] = useState<OrderManagementItem[]>(INITIAL_ORDERS);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderProductQuery, setOrderProductQuery] = useState('');
  const [orderStyleFilter, setOrderStyleFilter] = useState('All Styles');
  const [orderColorFilter, setOrderColorFilter] = useState('All Colors');
  const [orderSizeFilter, setOrderSizeFilter] = useState('All Sizes');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All statuses');
  const [orderCustomerFilter, setOrderCustomerFilter] = useState('All Customers');
  const [orderShipMethodFilter, setOrderShipMethodFilter] = useState('All methods');
  const [orderShippingStatusFilter, setOrderShippingStatusFilter] = useState('All shipping statuses');
  const [orderDateFrom, setOrderDateFrom] = useState('');
  const [orderDateTo, setOrderDateTo] = useState('');
  const [orderCurrentPage, setOrderCurrentPage] = useState(1);
  const [orderPageSize, setOrderPageSize] = useState(10);
  const [isOrderPageSizeOpen, setIsOrderPageSizeOpen] = useState(false);
  const orderDateFromRef = useRef<HTMLInputElement>(null);
  const orderDateToRef = useRef<HTMLInputElement>(null);

  // Selected Order Detail for Drawer
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<OrderManagementItem | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [isAddressesExpanded, setIsAddressesExpanded] = useState(true);
  const [isItemsExpanded, setIsItemsExpanded] = useState(true);
  const [isShipmentExpanded, setIsShipmentExpanded] = useState(true);
  const [isLabelPopupOpen, setIsLabelPopupOpen] = useState(false);
  const [shipmentItemQuantities, setShipmentItemQuantities] = useState<Record<string, number>>({});
  const [shipmentItemQuantitiesByTab, setShipmentItemQuantitiesByTab] = useState<Record<number, Record<string, number>>>({});
  const [customShipmentItems, setCustomShipmentItems] = useState<Array<{ sku: string; qty: number; name: string }>>([]);
  const [isHeaderPrintDropdownOpen, setIsHeaderPrintDropdownOpen] = useState(false);
  const [headerPrintSelection, setHeaderPrintSelection] = useState<'Shipping Label' | 'Packing Slip' | 'Thank You Card' | 'Gift Message'>('Shipping Label');
  const [shipmentTabs, setShipmentTabs] = useState<string[]>(['Shipment 1']);
  const [activeShipmentTabIdx, setActiveShipmentTabIdx] = useState<number>(0);
  const [isVoidConfirmOpen, setIsVoidConfirmOpen] = useState(false);
  const [isShipmentItemsModalOpen, setIsShipmentItemsModalOpen] = useState(false);
  const [isShipmentDetailsModalOpen, setIsShipmentDetailsModalOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [orderRejectReasonText, setOrderRejectReasonText] = useState('');
  const [isRejectingOrder, setIsRejectingOrder] = useState(false);
  const [pendingShippingMethod, setPendingShippingMethod] = useState<string | null>(null);
  const [pendingOrderStatus, setPendingOrderStatus] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<OrderManagementItem | null>(null);
  const [orderCommentText, setOrderCommentText] = useState('');
  const [initialInternalNote, setInitialInternalNote] = useState('');
  const [internalNoteDraft, setInternalNoteDraft] = useState('');
  const [hoveredProductImage, setHoveredProductImage] = useState<{ url: string; x: number; y: number } | null>(null);

  const modalExistingShipments = selectedOrderDetail
    ? (selectedOrderDetail.shipments && selectedOrderDetail.shipments.length > 0
      ? selectedOrderDetail.shipments
      : (selectedOrderDetail.shipmentInfo ? [selectedOrderDetail.shipmentInfo] : []))
    : [];
  const isCurrentTabSaved = activeShipmentTabIdx < modalExistingShipments.length;

  useEffect(() => {
    setPendingShippingMethod(null);
    setPendingOrderStatus(null);
    setOrderCommentText('');
    setInternalNoteDraft('');
    setInitialInternalNote(selectedOrderDetail?.internalNotes || '');
  }, [selectedOrderDetail?.id]);

  useEffect(() => {
    if (isLabelPopupOpen) {
      setShowAddressDetails(false);
    }
  }, [isLabelPopupOpen]);

  const loadShipmentFields = (order: OrderManagementItem | null, activeIdx: number) => {
    if (!order) return;
    const existingShipments = order.shipments && order.shipments.length > 0
      ? order.shipments
      : (order.shipmentInfo ? [order.shipmentInfo] : []);
    
    if (activeIdx < existingShipments.length) {
      const shp = existingShipments[activeIdx];
      // Recipient Details
      if (shp.recipientDetails) {
        setLabelFormFirstName(shp.recipientDetails.firstName || '');
        setLabelFormLastName(shp.recipientDetails.lastName || '');
        setLabelFormCompany(shp.recipientDetails.company || '');
        setLabelFormEmail(shp.recipientDetails.email || '');
        setLabelFormPhone(shp.recipientDetails.phone || '');
        setLabelFormCountry(shp.recipientDetails.country || 'United States');
        setLabelFormAddress1(shp.recipientDetails.address1 || '');
        setLabelFormAddress2(shp.recipientDetails.address2 || '');
        setLabelFormCity(shp.recipientDetails.city || '');
        setLabelFormZip(shp.recipientDetails.zip || '');
      }
      // Sender Details
      if (shp.senderDetails) {
        const partsName = (shp.senderDetails.name || 'Hiep Admin').split(' ');
        setSenderFirstName(partsName[0] || 'Hiep');
        setSenderLastName(partsName.slice(1).join(' ') || 'Admin');
        setSenderCompany(shp.senderDetails.company || 'SwiftPOD LLC - Warehouse A');
        setSenderAddress1(shp.senderDetails.address || '2070 S 7th St. Ste E, San Jose, CA 95112');
      }
      // Package details
      if (shp.size) {
        const cleanSize = shp.size.replace(/×/g, 'x').replace(/X/g, 'x').replace(/in\b/gi, '').trim();
        const parts = cleanSize.split('x');
        const length = parts[0]?.trim() || '7.00';
        const width = parts[1]?.trim() || '5.00';
        const height = parts[2]?.trim() || '14.00';
        const weightPart = shp.weight?.replace(' lbs', '')?.trim() || '47.92';
        
        setLabelFormPackages([{
          index: 1,
          refId: `PKG-${order.orderNumber}-${Math.floor(1000 + Math.random() * 9000)}`,
          savedPkg: 'Custom',
          weight: weightPart,
          length: length,
          width: width,
          height: height,
          items: order.orderItems?.map(item => `${item.productName} (Qty: ${item.quantity})`) || [`Classic Crewneck Hoodie (Qty: ${order.quantity})`]
        }]);
      }
      // Service details
      setLabelFormSelectedCarrier(shp.service || 'UPS Ground - NSA Account');
      setLabelFormGetRateClicked(true);
      setLabelFormSelectedRateIndex(0);
      setLabelFormLoadingRates(false);
    } else {
      // New shipment, load default/order fields
      setLabelFormFirstName(order.customerStore?.split(' ')[0] || 'Olivia');
      setLabelFormLastName(order.customerStore?.split(' ').slice(1).join(' ') || 'Rhye');
      setLabelFormCompany(order.customerStore || 'Acme Corp');
      setLabelFormEmail(`${order.customerStore?.toLowerCase().replace(/\s+/g, '') || 'customer'}@example.com`);
      setLabelFormPhone('555-019-2834');
      
      setSelectedWarehouseForLabel('Warehouse A');
      setSenderFirstName('Hiep');
      setSenderLastName('Admin');
      setSenderCompany('SwiftPOD LLC - Warehouse A');
      setSenderEmail('warehouse-a@swiftpod.live');
      setSenderPhone('408-555-0199');
      setSenderCountry('United States');
      setSenderAddress1('2070 S 7th St. Ste E');
      setSenderAddress2('');
      setSenderCity('San Jose');
      setSenderZip('95112');

      const isIntl = order.destinationType === 'International' || order.destination?.toLowerCase().includes('tokyo');
      setLabelFormCountry(isIntl ? 'Japan' : 'United States');
      setLabelFormDestinationType(isIntl ? 'International' : 'Domestic');
      setLabelFormHsCode('');
      setLabelFormAddress1(order.destination || '2070 S 7th St. Ste E');
      setLabelFormAddress2('');
      setLabelFormCity(isIntl ? 'Tokyo' : 'San Jose');
      setLabelFormZip(isIntl ? '100-0001' : '95112');

      const itemsDesc = order.orderItems && order.orderItems.length > 0 
        ? order.orderItems.map(it => `${it.productName || 'Premium Organic Tee'} (${it.quantity}pcs)`).join(', ')
        : 'Premium Organic Tee';
      setLabelFormCustomsRefId('REF-' + order.orderNumber + '-01');
      setLabelFormCustomsCountry(isIntl ? 'Japan' : 'United States');
      setLabelFormCustomsHsCode('6109.10');
      setLabelFormCustomsNetWeight('6.2');
      setLabelFormCustomsPrice('14.50');
      setLabelFormCustomsQty('1');
      setLabelFormCustomsDesc(itemsDesc);
      setIsCustomsFormCollapsed(false);
      setIsCustomsFormActive(true);
      
      setLabelFormGetRateClicked(false);
      setLabelFormLoadingRates(false);
      setLabelFormSelectedRateIndex(-1);
      setLabelFormCarrierPackage('Package');
      
      const qtys: Record<string, number> = {};
      if (order.orderItems && order.orderItems.length > 0) {
        order.orderItems.forEach(item => {
          qtys[item.sku] = item.quantity;
        });
      } else {
        qtys['SKU-G640-BLK-S-01'] = order.quantity || 1;
      }
      setShipmentItemQuantities(qtys);
      setShipmentItemQuantitiesByTab({ 0: qtys });
      setCustomShipmentItems([]);

      setLabelFormPackages([{
        index: 1,
        refId: `PKG-${order.orderNumber}-${Math.floor(1000 + Math.random() * 9000)}`,
        savedPkg: 'Custom',
        weight: '47.92',
        length: '7.00',
        width: '5.05',
        height: '14.00',
        items: order.orderItems?.map(item => `${item.productName} (Qty: ${item.quantity})`) || [`Classic Crewneck Hoodie (Qty: ${order.quantity})`]
      }]);
    }
  };

  useEffect(() => {
    if (isLabelPopupOpen && selectedOrderDetail) {
      loadShipmentFields(selectedOrderDetail, activeShipmentTabIdx);
    }
  }, [activeShipmentTabIdx, isLabelPopupOpen, selectedOrderDetail]);

  useEffect(() => {
    if (!isLabelPopupOpen) {
      setShipmentItemQuantitiesByTab({});
      setShipmentTabs(['Shipment 1']);
      setActiveShipmentTabIdx(0);
    }
  }, [isLabelPopupOpen]);

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const newAct = {
      id: `act_${Date.now()}`,
      date: nowStr,
      action: `Order status updated to ${newStatus}`,
      performedBy: 'Hiep Admin'
    };

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { 
          ...o, 
          orderStatus: newStatus as any,
          activityHistory: [newAct, ...(o.activityHistory || [])]
        };
      }
      return o;
    }));

    setSelectedOrderDetail(prev => {
      if (prev && prev.id === orderId) {
        return {
          ...prev,
          orderStatus: newStatus as any,
          activityHistory: [newAct, ...(prev.activityHistory || [])]
        };
      }
      return prev;
    });
  };

  const [isEditingShipAddress, setIsEditingShipAddress] = useState(false);
  const [shipName, setShipName] = useState('');
  const [shipCompanyLine, setShipCompanyLine] = useState('');
  const [shipAddressLine, setShipAddressLine] = useState('');
  const [shipAddress2, setShipAddress2] = useState('');
  const [shipCity, setShipCity] = useState('');
  const [shipState, setShipState] = useState('');
  const [shipZip, setShipZip] = useState('');
  const [shipCountry, setShipCountry] = useState('United States');
  const [shipPhone, setShipPhone] = useState('');
  const [shipEmail, setShipEmail] = useState('');

  const [isPasteAddressOpen, setIsPasteAddressOpen] = useState(false);
  const [rawAddressToPaste, setRawAddressToPaste] = useState('');

  useEffect(() => {
    if (selectedOrderDetail) {
      const sAddr = selectedOrderDetail.shipAddress || {
        name: 'Auo Tivi',
        companyLine: '123',
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
      
      // Clean up legacy commas if any
      const cleanedAddr1 = sAddr.addressLine ? sAddr.addressLine.replace(/,\s*$/, '') : '';
      setShipAddressLine(cleanedAddr1);
      setShipAddress2(sAddr.address2 || '');
      
      // Smart parsing of City, State, Zip, Country if nested fields are missing
      if (sAddr.city) {
        setShipCity(sAddr.city);
        setShipState(sAddr.state || '');
        setShipZip(sAddr.zip || '');
        setShipCountry(sAddr.country || 'United States');
      } else {
        // Fallback parsers for old data formats
        let cityVal = '';
        let stateVal = '';
        let zipVal = '';
        let countryVal = 'United States';

        if (cleanedAddr1.toUpperCase().includes('NEW ALBANY')) {
          cityVal = 'NEW ALBANY';
        }
        
        const locPart = (sAddr as any).cityStateZip || '';
        if (locPart) {
          const parts = locPart.split(',').map(p => p.trim());
          if (parts[0] && parts[0].toLowerCase().includes('indiana')) {
            stateVal = 'Indiana';
          } else {
            stateVal = parts[0] || '';
          }
          const zipMatch = locPart.match(/\b\d{5}\b/);
          if (zipMatch) zipVal = zipMatch[0];
          if (locPart.toUpperCase().includes('US') || locPart.toUpperCase().includes('USA') || locPart.toUpperCase().includes('UNITED STATES')) {
            countryVal = 'United States';
          }
        }
        
        setShipCity(cityVal || 'NEW ALBANY');
        setShipState(stateVal || 'Indiana');
        setShipZip(zipVal || '80201');
        setShipCountry(countryVal);
      }

      setShipPhone(sAddr.phone || '');
      setShipEmail(sAddr.email || '');
      setIsEditingShipAddress(false);
      setIsPasteAddressOpen(false);
      setRawAddressToPaste('');
    }
  }, [selectedOrderDetail?.id]);

  const handleSaveShipAddress = () => {
    if (!selectedOrderDetail) return;
    const updatedShipAddress = {
      name: shipName,
      companyLine: shipCompanyLine,
      addressLine: shipAddressLine,
      address2: shipAddress2,
      city: shipCity,
      state: shipState,
      zip: shipZip,
      country: shipCountry,
      cityStateZip: `${shipState ? shipState + ', ' : ''}${shipZip || ''}${shipCountry ? ', ' + shipCountry : ''}`,
      phone: shipPhone,
      email: shipEmail
    };

    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const newAct = {
      id: `act_${Date.now()}`,
      date: nowStr,
      action: `Shipping address updated to "${shipName}, ${shipAddressLine}"`,
      performedBy: 'Hiep Admin'
    };

    setOrders(prev => prev.map(o => {
      if (o.id === selectedOrderDetail.id) {
        return {
          ...o,
          shipAddress: updatedShipAddress,
          activityHistory: [newAct, ...(o.activityHistory || [])]
        };
      }
      return o;
    }));

    setSelectedOrderDetail(prev => prev ? {
      ...prev,
      shipAddress: updatedShipAddress,
      activityHistory: [newAct, ...(prev.activityHistory || [])]
    } : null);

    setIsEditingShipAddress(false);
    triggerToast('Shipping address updated successfully!', 'success');
  };

  const handleVoidShipment = () => {
    setIsVoidConfirmOpen(false);
    if (!selectedOrderDetail) return;

    const todayTimeStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const newAct = {
      id: `act_${Date.now()}`,
      date: todayTimeStr,
      action: `Voided Shipping Label / Refund requested for Tracking: "${selectedOrderDetail.shipmentInfo?.trackingNumber || ''}"`,
      performedBy: 'Hiep Admin'
    };

    // Update in master orders array
    setOrders(prev => prev.map(o => {
      if (o.id === selectedOrderDetail.id) {
        return {
          ...o,
          orderStatus: 'New' as const,
          shippingStatus: undefined,
          trackingNumber: undefined,
          shipmentInfo: undefined,
          shipments: [] as any[],
          activityHistory: [newAct, ...(o.activityHistory || [])]
        };
      }
      return o;
    }));

    // Update current detail state
    setSelectedOrderDetail(prev => {
      if (!prev) return null;
      return {
        ...prev,
        orderStatus: 'New' as const,
        shippingStatus: undefined,
        trackingNumber: undefined,
        shipmentInfo: undefined,
        shipments: [] as any[],
        activityHistory: [newAct, ...(prev.activityHistory || [])]
      };
    });

    triggerToast('Shipping label voided & refund requested successfully!', 'success');
  };
  
  // Create Order modal state
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [newOrderNum, setNewOrderNum] = useState('');
  const [newOrderRefNum, setNewOrderRefNum] = useState('');
  const [newOrderCustomer, setNewOrderCustomer] = useState('');
  const [newOrderQty, setNewOrderQty] = useState('');
  const [newOrderShipMethod, setNewOrderShipMethod] = useState('UPS Ground');
  const [newOrderDest, setNewOrderDest] = useState('');
  const [newOrderWarehouse, setNewOrderWarehouse] = useState('Warehouse A');
  const [newOrderDestinationType, setNewOrderDestinationType] = useState<'Domestic' | 'International'>('Domestic');
  const [newOrderTrackingNumber, setNewOrderTrackingNumber] = useState('');
  const [newOrderShippingStatus, setNewOrderShippingStatus] = useState<'Unshipped' | 'Shipped' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Exception'>('Unshipped');

  // Location states
  const [locations, setLocations] = useState<LocationItem[]>(INITIAL_LOCATIONS);
  const [locationHistory, setLocationHistory] = useState<LocationHistoryItem[]>(INITIAL_LOCATION_HISTORY);
  const [searchLocationId, setSearchLocationId] = useState('');
  const [searchProductSku, setSearchProductSku] = useState('');
  const [selectedLocationStatus, setSelectedLocationStatus] = useState('All');
  const [locationCurrentPage, setLocationCurrentPage] = useState(1);
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1);
  const [locationPageSize, setLocationPageSize] = useState(25);
  const [isLocationPageSizeOpen, setIsLocationPageSizeOpen] = useState(false);

  // History tab filtering states
  const [historyLocationFilter, setHistoryLocationFilter] = useState('All locations');
  const [historyDateFrom, setHistoryDateFrom] = useState('');
  const [historyDateTo, setHistoryDateTo] = useState('');
  const [historySearchSku, setHistorySearchSku] = useState('');
  
  // Specific action modals and detail drawers
  const [selectedLocationForHistory, setSelectedLocationForHistory] = useState<LocationItem | null>(null);
  const [selectedLocationForReturn, setSelectedLocationForReturn] = useState<LocationItem | null>(null);
  const [isMainHistoryOpen, setIsMainHistoryOpen] = useState(false);
  const [isCreateLocationOpen, setIsCreateLocationOpen] = useState(false);
  const [isImportLocationOpen, setIsImportLocationOpen] = useState(false);
  const [importLocationText, setImportLocationText] = useState('');
  const [locationActiveTab, setLocationActiveTab] = useState<'Locations' | 'History'>('Locations');
  const [locationToDelete, setLocationToDelete] = useState<LocationItem | null>(null);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [editingLocationValue, setEditingLocationValue] = useState<string>('');
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Form states for manual Return/Restock action
  const [returnProductInfo, setReturnProductInfo] = useState('');
  const [returnQty, setReturnQty] = useState(1);
  const [returnPerformedBy, setReturnPerformedBy] = useState('Tech');
  const [returnNotes, setReturnNotes] = useState('');

  // Form states for Create Location
  const [newLocName, setNewLocName] = useState('');
  const [newLocBox, setNewLocBox] = useState('');
  const [newLocProductQty, setNewLocProductQty] = useState(0);

  // Form states for Create Location Employee Scanning
  const [locationEmployeeId, setLocationEmployeeId] = useState('');
  const [locationTempEmpId, setLocationTempEmpId] = useState('');

  // Order Management helper calculations
  const filteredOrders = useMemo(() => {
    let result = orders;

    // 1. Search Query (Order Number, Ref Number, Tracking Number)
    if (orderSearchQuery.trim()) {
      const search = orderSearchQuery.toLowerCase().trim();
      result = result.filter(item => 
        item.orderNumber.toLowerCase().includes(search) ||
        (item.refNumber && item.refNumber.toLowerCase().includes(search)) ||
        (item.trackingNumber && item.trackingNumber.toLowerCase().includes(search)) ||
        item.customerStore.toLowerCase().includes(search)
      );
    }

    // 1b. Product/SKU filter
    if (orderProductQuery.trim()) {
      const pSearch = orderProductQuery.toLowerCase().trim();
      result = result.filter(item => {
        if (!item.orderItems || item.orderItems.length === 0) return false;
        return item.orderItems.some(oi => 
          (oi.productName && oi.productName.toLowerCase().includes(pSearch)) ||
          (oi.sku && oi.sku.toLowerCase().includes(pSearch))
        );
      });
    }

    // 1c. Style Filter (like product screen)
    if (orderStyleFilter !== 'All Styles') {
      const styleLower = orderStyleFilter.toLowerCase();
      result = result.filter(item => {
        if (!item.orderItems || item.orderItems.length === 0) return false;
        return item.orderItems.some(oi => {
          const styleCol = (oi.styleColor || '').toLowerCase();
          const pSku = (oi.sku || '').toLowerCase();
          const pName = (oi.productName || '').toLowerCase();
          return styleCol.includes(styleLower) || pSku.includes(styleLower) || pName.includes(styleLower);
        });
      });
    }

    // 1d. Color Filter (like product screen)
    if (orderColorFilter !== 'All Colors') {
      const colorLower = orderColorFilter.toLowerCase();
      result = result.filter(item => {
        if (!item.orderItems || item.orderItems.length === 0) return false;
        return item.orderItems.some(oi => {
          const styleCol = (oi.styleColor || '').toLowerCase();
          const pSku = (oi.sku || '').toLowerCase();
          const pName = (oi.productName || '').toLowerCase();
          return styleCol.includes(colorLower) || pSku.includes(colorLower) || pName.includes(colorLower);
        });
      });
    }

    // 1e. Size Filter (like product screen)
    if (orderSizeFilter !== 'All Sizes') {
      const sizeLower = orderSizeFilter.toLowerCase();
      result = result.filter(item => {
        if (!item.orderItems || item.orderItems.length === 0) return false;
        return item.orderItems.some(oi => {
          const styleCol = (oi.styleColor || '').toLowerCase();
          const pSku = (oi.sku || '').toLowerCase();
          const lastSkuPart = pSku.split('-').pop() || '';
          const lastSkuUnderscore = pSku.split('_').pop() || '';
          const lastStyleColPart = styleCol.split('/').pop() || '';
          return (
            lastSkuPart === sizeLower ||
            lastSkuUnderscore === sizeLower ||
            lastStyleColPart.trim() === sizeLower ||
            pSku.endsWith(sizeLower) || 
            styleCol.includes(` / ${sizeLower}`) ||
            pSku.includes(`/${sizeLower}`) ||
            pSku.includes(`-${sizeLower}`)
          );
        });
      });
    }

    // 2. Status Filter
    if (orderStatusFilter !== 'All statuses') {
      result = result.filter(item => item.orderStatus === orderStatusFilter);
    }

    // 3. Customer Filter
    if (orderCustomerFilter !== 'All Customers') {
      result = result.filter(item => item.customerStore === orderCustomerFilter);
    }

    // 4. Shipping Status Filter
    if (orderShippingStatusFilter !== 'All shipping statuses') {
      result = result.filter(item => item.shippingStatus === orderShippingStatusFilter);
    }

    // 5. Shipping Method Filter
    if (orderShipMethodFilter !== 'All methods') {
      result = result.filter(item => item.shippingMethod === orderShipMethodFilter);
    }

    // 6. Date Filter
    if (orderDateFrom) {
      result = result.filter(o => {
        const oDate = parseDateString(o.orderDate);
        return oDate && oDate >= orderDateFrom;
      });
    }
    if (orderDateTo) {
      result = result.filter(o => {
        const oDate = parseDateString(o.orderDate);
        return oDate && oDate <= orderDateTo;
      });
    }

    return result;
  }, [orders, orderSearchQuery, orderProductQuery, orderStyleFilter, orderColorFilter, orderSizeFilter, orderStatusFilter, orderCustomerFilter, orderShippingStatusFilter, orderShipMethodFilter, orderDateFrom, orderDateTo]);

  const orderTotalPages = Math.ceil(filteredOrders.length / orderPageSize) || 1;
  const orderPagedItems = useMemo(() => {
    const startIndex = (orderCurrentPage - 1) * orderPageSize;
    return filteredOrders.slice(startIndex, startIndex + orderPageSize);
  }, [filteredOrders, orderCurrentPage, orderPageSize]);

  // Addition states
  const [additions, setAdditions] = useState<AdditionItem[]>(INITIAL_ADDITIONS);
  const [isCreateAdditionOpen, setIsCreateAdditionOpen] = useState(false);
  const [additionToDelete, setAdditionToDelete] = useState<string | null>(null);
  const [additionSearchProdTrack, setAdditionSearchProdTrack] = useState('');
  const [additionSearchBoxLoc, setAdditionSearchBoxLoc] = useState('');
  const [additionDateFilter, setAdditionDateFilter] = useState('All Dates');
  const additionDateInputRef = useRef<HTMLInputElement>(null);
  const [additionCurrentPage, setAdditionCurrentPage] = useState(1);
  const [additionPageSize, setAdditionPageSize] = useState(10);
  const [isAdditionPageSizeOpen, setIsAdditionPageSizeOpen] = useState(false);

  const filteredAdditions = useMemo(() => {
    let result = additions;
    
    // 1. Search product / SKU / WRO #
    if (additionSearchProdTrack.trim()) {
      const search = additionSearchProdTrack.toLowerCase();
      result = result.filter(item => 
        item.product.toLowerCase().includes(search) ||
        item.poNumber.toLowerCase().includes(search) ||
        item.tracking.toLowerCase().includes(search)
      );
    }
    
    // 2. Search location, box ID
    if (additionSearchBoxLoc.trim()) {
      const search = additionSearchBoxLoc.toLowerCase();
      result = result.filter(item => 
        (item.boxId && item.boxId.toLowerCase().includes(search)) ||
        item.location.toLowerCase().includes(search)
      );
    }

    // 3. Created / Receiving Date Filter Like product page
    if (additionDateFilter !== 'All Dates') {
      result = result.filter(item => {
        try {
          const d = new Date(item.receivingDate);
          if (isNaN(d.getTime())) return false;
          const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          return dateStr === additionDateFilter;
        } catch (e) {
          return false;
        }
      });
    }

    return result;
  }, [additions, additionSearchProdTrack, additionSearchBoxLoc, additionDateFilter]);

  const additionTotalPages = Math.ceil(filteredAdditions.length / additionPageSize) || 1;
  const additionPagedItems = useMemo(() => {
    const startIndex = (additionCurrentPage - 1) * additionPageSize;
    return filteredAdditions.slice(startIndex, startIndex + additionPageSize);
  }, [filteredAdditions, additionCurrentPage, additionPageSize]);

  // Location filter & memoization
  const filteredLocations = useMemo(() => {
    let result = locations;
    
    // 1. Filter by Location ID / Name
    if (searchLocationId.trim()) {
      const search = searchLocationId.toLowerCase();
      result = result.filter(item => 
        item.location.toLowerCase().includes(search)
      );
    }
    
    // 2. Filter by Product SKU/Name
    if (searchProductSku.trim()) {
      const search = searchProductSku.toLowerCase();
      result = result.filter(locItem => {
        // match by name in additions containing the search text
        const matchesInAdditions = additions.some(add => 
          add.location.toLowerCase() === locItem.location.toLowerCase() && 
          add.product.toLowerCase().includes(search)
        );
        return matchesInAdditions;
      });
    }

    // 3. Dropdown filter: All, Return, Not return
    if (selectedLocationStatus === 'Return') {
      result = result.filter(item => item.productQty > 0);
    } else if (selectedLocationStatus === 'Not return') {
      result = result.filter(item => item.productQty === 0);
    }

    return result;
  }, [locations, searchLocationId, searchProductSku, selectedLocationStatus, additions]);

  const locationTotalPages = Math.ceil(filteredLocations.length / locationPageSize) || 1;
  
  const locationPagedItems = useMemo(() => {
    const startIndex = (locationCurrentPage - 1) * locationPageSize;
    return filteredLocations.slice(startIndex, startIndex + locationPageSize);
  }, [filteredLocations, locationCurrentPage, locationPageSize]);

  const historyLocationOptions = useMemo(() => {
    const names = Array.from(new Set(locations.map(loc => loc.location))).sort();
    return ['All locations', ...names];
  }, [locations]);

  const filteredLocationHistory = useMemo(() => {
    let result = locationHistory;

    // 1. Filter by location
    if (historyLocationFilter !== 'All locations') {
      result = result.filter(h => h.locationName === historyLocationFilter);
    }

    // 2. Filter by date-range From - To
    if (historyDateFrom) {
      result = result.filter(h => {
        const itemDate = parseDateString(h.timestamp);
        return itemDate && itemDate >= historyDateFrom;
      });
    }
    if (historyDateTo) {
      result = result.filter(h => {
        const itemDate = parseDateString(h.timestamp);
        return itemDate && itemDate <= historyDateTo;
      });
    }

    // 3. Filter by search SKU
    if (historySearchSku.trim()) {
      const search = historySearchSku.toLowerCase();
      result = result.filter(h => {
        const productInfoLower = (h.productInfo || '').toLowerCase();
        const skuLower = (h.sku || '').toLowerCase();
        const styleLower = (h.style || '').toLowerCase();
        
        return productInfoLower.includes(search) || skuLower.includes(search) || styleLower.includes(search);
      });
    }

    return result;
  }, [locationHistory, historyLocationFilter, historyDateFrom, historyDateTo, historySearchSku]);

  const historyTotalPages = Math.ceil(filteredLocationHistory.length / locationPageSize) || 1;
  const historyPagedItems = useMemo(() => {
    const startIndex = (historyCurrentPage - 1) * locationPageSize;
    return filteredLocationHistory.slice(startIndex, startIndex + locationPageSize);
  }, [filteredLocationHistory, historyCurrentPage, locationPageSize]);

  // WIP printing computed lists & pagination
  const filteredPapPrintingQueue = useMemo(() => {
    return papPrintingQueue.filter((item) => {
      // Channel filter
      if (papSelectedChannel !== 'All') {
        const matched = item.tags?.includes(papSelectedChannel) || 
                        (papSelectedChannel === 'RBBL' && (item.tags?.includes('RBBL') || item.tags?.includes('RBT')));
        if (!matched) return false;
      }
      // Style filter
      if (papSelectedStyleFilter !== 'ALL' && item.style !== papSelectedStyleFilter) return false;
      // Tech filter
      if (papSelectedTechFilter !== 'ALL') {
        if (papSelectedTechFilter === 'DTG' && item.style !== '64000' && item.style !== '5000') return false;
        if (papSelectedTechFilter === 'DTF' && item.style !== '3000') return false;
      }
      // Color filter
      if (papColorInput !== 'Color' && papColorInput !== 'All') {
        if (item.color.toLowerCase() !== papColorInput.toLowerCase()) return false;
      }
      // Pretreatment filter
      if (papPretreatment !== 'Pretreatment' && papPretreatment !== 'All') {
        const hasPretreatment = item.style === '64000'; // Gildan 64000 has pretreatment
        const wantsPretreatment = papPretreatment === 'Yes';
        if (hasPretreatment !== wantsPretreatment) return false;
      }
      return true;
    });
  }, [papPrintingQueue, papSelectedChannel, papSelectedStyleFilter, papSelectedTechFilter, papColorInput, papPretreatment]);

  const papPrintingTotalPages = Math.ceil(filteredPapPrintingQueue.length / papPrintingPageSize) || 1;
  const papPrintingPagedItems = useMemo(() => {
    const startIndex = (papPrintingCurrentPage - 1) * papPrintingPageSize;
    return filteredPapPrintingQueue.slice(startIndex, startIndex + papPrintingPageSize);
  }, [filteredPapPrintingQueue, papPrintingCurrentPage, papPrintingPageSize]);

  const filteredPapHistory = useMemo(() => {
    return papHistory.filter((item) => {
      // Style filter
      if (papSelectedStyleFilter !== 'ALL' && item.style !== papSelectedStyleFilter) return false;
      // Tech filter
      if (papSelectedTechFilter !== 'ALL') {
        if (papSelectedTechFilter === 'DTG' && item.style !== '64000' && item.style !== '5000') return false;
        if (papSelectedTechFilter === 'DTF' && item.style !== '3000') return false;
      }
      // Type tag filter
      if (papHistoryTypeFilter !== 'Filter by Type' && papHistoryTypeFilter !== 'All') {
        if (!item.tags?.includes(papHistoryTypeFilter)) return false;
      }
      // SKU search
      if (papHistorySearchSku.trim() !== '') {
        const token = papHistorySearchSku.toLowerCase().trim();
        const matchId = item.id.toLowerCase().includes(token);
        const matchColor = item.color.toLowerCase().includes(token);
        const matchStyle = item.style.toLowerCase().includes(token);
        if (!matchId && !matchColor && !matchStyle) return false;
      }
      return true;
    });
  }, [papHistory, papSelectedStyleFilter, papSelectedTechFilter, papHistoryTypeFilter, papHistorySearchSku]);

  const papHistoryTotalPages = Math.ceil(filteredPapHistory.length / papHistoryPageSize) || 1;
  const papHistoryPagedItems = useMemo(() => {
    const startIndex = (papHistoryCurrentPage - 1) * papHistoryPageSize;
    return filteredPapHistory.slice(startIndex, startIndex + papHistoryPageSize);
  }, [filteredPapHistory, papHistoryCurrentPage, papHistoryPageSize]);

  // Purchase Order States
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [isCreatePOOpen, setIsCreatePOOpen] = useState(false);
  const [poSearchQuery, setPoSearchQuery] = useState('');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('All Statuses');
  const [selectedPOCreatedDate, setSelectedPOCreatedDate] = useState('All Dates');
  const [poSortDirection, setPoSortDirection] = useState<'desc' | 'asc'>('desc');
  
  const [copiedPoId, setCopiedPoId] = useState<string | null>(null);
  const [selectedPODetail, setSelectedPODetail] = useState<PurchaseOrder | null>(null);
  const [isEditingWroNo, setIsEditingWroNo] = useState(false);
  const [tempWroNo, setTempWroNo] = useState('');

  const [draftReceivedQtys, setDraftReceivedQtys] = useState<Record<string, number>>({});

  useEffect(() => {
    if (selectedPODetail) {
      const initialQtys: Record<string, number> = {};
      selectedPODetail.items?.forEach(item => {
        initialQtys[item.sku] = item.receivedQty ?? 0;
      });
      setDraftReceivedQtys(initialQtys);
    } else {
      setDraftReceivedQtys({});
    }
  }, [selectedPODetail]);

  const handleUpdateWRO = () => {
    if (!selectedPODetail) return;

    for (const item of selectedPODetail.items) {
      const val = draftReceivedQtys[item.sku];
      if (val === undefined || val < 0) {
        triggerToast('Received quantity cannot be negative', 'info');
        return;
      }
    }

    const updatedItems = selectedPODetail.items.map(item => {
      const rec = draftReceivedQtys[item.sku] ?? 0;
      return {
        ...item,
        receivedQty: rec,
        incomingQty: Math.max(0, item.qty - rec)
      };
    });

    const computedTotalReceived = updatedItems.reduce((sum, item) => sum + item.receivedQty, 0);
    const computedTotalIncoming = Math.max(0, selectedPODetail.totalQty - computedTotalReceived);
    const nextStatus = computedTotalReceived >= selectedPODetail.totalQty ? 'Received' : 'Pending';

    setPurchaseOrders(prev => prev.map(po => {
      if (po.id === selectedPODetail.id) {
        return {
          ...po,
          items: updatedItems,
          receivedQty: computedTotalReceived,
          incomingQty: computedTotalIncoming,
          orderStatus: nextStatus
        };
      }
      return po;
    }));

    setSelectedPODetail(prev => {
      if (prev && prev.id === selectedPODetail.id) {
        return {
          ...prev,
          items: updatedItems,
          receivedQty: computedTotalReceived,
          incomingQty: computedTotalIncoming,
          orderStatus: nextStatus
        };
      }
      return prev;
    });

    setSelectedPODetail(null);
    setIsEditingWroNo(false);

    triggerToast(`WRO ${selectedPODetail.poNumber} updated successfully!`, 'success');
  };

  // WRO Verify and Comments States
  const [verifyingPO, setVerifyingPO] = useState<PurchaseOrder | null>(null);
  const [verifiedQtyInput, setVerifiedQtyInput] = useState<number>(0);
  const [wroCommentText, setWroCommentText] = useState('');

  const handleInitVerify = (po: PurchaseOrder) => {
    setVerifyingPO(po);
    setVerifiedQtyInput(po.receivedQty ?? 0);
  };

  const handleConfirmVerify = () => {
    if (!verifyingPO) return;
    const qty = verifiedQtyInput;
    if (qty < 0) {
      triggerToast('Received quantity cannot be negative', 'info');
      return;
    }
    
    setPurchaseOrders(prev => prev.map(po => {
      if (po.id === verifyingPO.id) {
        const nextStatus: PurchaseOrder['orderStatus'] = qty >= po.totalQty ? 'Received' : 'Pending';
        return {
          ...po,
          receivedQty: qty,
          incomingQty: Math.max(0, po.totalQty - qty),
          orderStatus: nextStatus
        };
      }
      return po;
    }));

    // Update selectedPODetail too if same ID is open
    setSelectedPODetail(prev => {
      if (prev && prev.id === verifyingPO.id) {
        const nextStatus: PurchaseOrder['orderStatus'] = qty >= prev.totalQty ? 'Received' : 'Pending';
        return {
          ...prev,
          receivedQty: qty,
          incomingQty: Math.max(0, prev.totalQty - qty),
          orderStatus: nextStatus
        };
      }
      return prev;
    });

    triggerToast(`WRO ${verifyingPO.poNumber} verified with received qty ${qty}/${verifyingPO.totalQty}!`, 'success');
    setVerifyingPO(null);
  };

  const handleAddWroComment = () => {
    if (!selectedPODetail || !wroCommentText.trim()) return;
    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const newComment = {
      id: `co_${Date.now()}`,
      text: wroCommentText.trim(),
      createdAt: nowStr,
      createdBy: 'Hiep Admin'
    };
    
    setPurchaseOrders(prev => prev.map(po => {
      if (po.id === selectedPODetail.id) {
        return {
          ...po,
          comments: [newComment, ...(po.comments || [])]
        };
      }
      return po;
    }));
    
    setSelectedPODetail(prev => prev ? {
      ...prev,
      comments: [newComment, ...(prev.comments || [])]
    } : null);
    
    setWroCommentText('');
    triggerToast('Comment added successfully!', 'success');
  };

  const handleUpdateWroNumber = (newWroNo: string) => {
    if (!selectedPODetail) return;
    const oldWroNo = selectedPODetail.poNumber;
    
    // 1. Update purchaseOrders state
    setPurchaseOrders(prev => prev.map(po => po.id === selectedPODetail.id ? { ...po, poNumber: newWroNo } : po));
    
    // 2. Update additions state so matching PO updates to the new WRO number
    setAdditions(prev => prev.map(item => item.poNumber === oldWroNo ? { ...item, poNumber: newWroNo } : item));
    
    // 3. Update the modal detail display state container
    setSelectedPODetail(prev => prev ? { ...prev, poNumber: newWroNo } : null);
    
    triggerToast(`WRO number updated to ${newWroNo}`, 'success');
  };
  
  // PO Pagination
  const [poCurrentPage, setPoCurrentPage] = useState(1);
  const [poPageSize, setPoPageSize] = useState(10);
  const [isPoPageSizeOpen, setIsPoPageSizeOpen] = useState(false);
  const poDateInputRef = useRef<HTMLInputElement>(null);

  const handleCopyTracking = (id: string, tracking: string) => {
    navigator.clipboard.writeText(tracking);
    setCopiedPoId(id);
    triggerToast(`Copied tracking number to clipboard.`, 'success');
    setTimeout(() => {
      setCopiedPoId(null);
    }, 2000);
  };

  const handleCreatePO = (data: Omit<PurchaseOrder, 'id' | 'createdAt'>) => {
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    const newPO: PurchaseOrder = {
      ...data,
      id: `po-${Date.now()}`,
      createdAt: formattedDate
    };
    
    setPurchaseOrders(prev => [newPO, ...prev]);
    triggerToast(`WRO ${data.poNumber} created successfully!`, 'success');
  };

  const handleCreateAddition = (newAddition: AdditionItem) => {
    setAdditions(prev => [newAddition, ...prev]);
    triggerToast(`Inventory addition for WRO ${newAddition.poNumber} created successfully!`, 'success');
  };

  const handleDeleteAddition = (id: string) => {
    setAdditions(prev => prev.filter(item => item.id !== id));
    triggerToast("Inventory addition record deleted successfully!", "success");
  };

  const handleCreateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim() || !newLocBox.trim()) {
      triggerToast('Please fill in both Location Name and Box ID', 'info');
      return;
    }
    if (!locationEmployeeId.trim()) {
      triggerToast('Please confirm your Employee ID card before registering a location', 'info');
      return;
    }
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' ' + new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newLoc: LocationItem = {
      id: 'loc_' + Date.now(),
      location: newLocName.trim(),
      boxId: newLocBox.trim(),
      productQty: Number(newLocProductQty) || 0,
      createdAt: formattedDate
    };

    setLocations(prev => [newLoc, ...prev]);

    // Create history event
    const newHist: LocationHistoryItem = {
      id: 'hist_' + Date.now(),
      locationId: newLoc.id,
      locationName: newLoc.location,
      boxId: newLoc.boxId,
      action: 'Create',
      productInfo: 'Location Registered',
      qty: newLoc.productQty,
      timestamp: formattedDate,
      performedBy: locationEmployeeId || 'Admin',
      notes: `Location registered with box ${newLoc.boxId}`
    };
    setLocationHistory(prev => [newHist, ...prev]);

    setNewLocName('');
    setNewLocBox('');
    setNewLocProductQty(0);
    setIsCreateLocationOpen(false);
    triggerToast(`Location ${newLoc.location} registered successfully!`, 'success');
  };

  const handleImportLocations = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importLocationText.trim()) return;
    
    const lines = importLocationText.split('\n');
    let importedCount = 0;
    const nowStr = new Date().toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    }) + ' ' + new Date().toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    });
    
    const newLocs: LocationItem[] = [];
    const newHists: LocationHistoryItem[] = [];

    lines.forEach((line, idx) => {
      if (!line.trim()) return;
      const parts = line.split(',');
      if (parts.length >= 2) {
        const name = parts[0].trim();
        const box = parts[1].trim();
        const qty = parts[2] ? parseInt(parts[2].trim(), 10) : 0;
        if (name && box) {
          const id = 'loc_imp_' + Date.now() + '_' + idx;
          newLocs.push({
            id,
            location: name,
            boxId: box,
            productQty: isNaN(qty) ? 0 : qty,
            createdAt: nowStr
          });

          newHists.push({
            id: 'hist_imp_' + Date.now() + '_' + idx,
            locationId: id,
            locationName: name,
            boxId: box,
            action: 'Import',
            productInfo: 'CSV Bulk Import',
            qty: isNaN(qty) ? 0 : qty,
            timestamp: nowStr,
            performedBy: 'Admin',
            notes: 'Imported via CSV helper tool'
          });
          importedCount++;
        }
      }
    });

    if (importedCount > 0) {
      setLocations(prev => [...newLocs, ...prev]);
      setLocationHistory(prev => [...newHists, ...prev]);
      setImportLocationText('');
      setIsImportLocationOpen(false);
      triggerToast(`Imported ${importedCount} locations successfully!`, 'success');
    } else {
      triggerToast('No valid lines found. Use commas: LocationName, BoxID, Qty', 'info');
    }
  };

  const handleConfirmReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocationForReturn) return;
    
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' ' + new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const incrementQty = Number(returnQty);

    setLocations(prev => prev.map(loc => {
      if (loc.id === selectedLocationForReturn.id) {
        return {
          ...loc,
          productQty: loc.productQty + incrementQty,
          updatedAt: formattedDate,
          lastReturnedAt: formattedDate,
          lastReturnedBy: returnPerformedBy
        };
      }
      return loc;
    }));

    const newHistItem: LocationHistoryItem = {
      id: 'hist_' + Date.now(),
      locationId: selectedLocationForReturn.id,
      locationName: selectedLocationForReturn.location,
      boxId: selectedLocationForReturn.boxId,
      action: 'Return',
      productInfo: returnProductInfo || 'G500 / Red / L',
      qty: incrementQty,
      timestamp: formattedDate,
      performedBy: returnPerformedBy,
      notes: returnNotes || 'Returned to warehouse location'
    };

    setLocationHistory(prev => [newHistItem, ...prev]);
    
    setSelectedLocationForReturn(null);
    triggerToast(`Returned ${incrementQty} items to ${selectedLocationForReturn.location} successfully!`, 'success');
  };

  const handleSaveInlineLocationName = (id: string, newName: string) => {
    if (!newName.trim()) {
      triggerToast('Location name cannot be empty', 'info');
      return;
    }
    setLocations(prev => prev.map(loc => {
      if (loc.id === id) {
        return {
          ...loc,
          location: newName.trim(),
          updatedAt: new Date().toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          }) + ' ' + new Date().toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit'
          })
        };
      }
      return loc;
    }));
    
    // Also optional: update history events
    setLocationHistory(prev => prev.map(hist => {
      if (hist.locationId === id) {
        return { ...hist, locationName: newName.trim() };
      }
      return hist;
    }));

    setEditingLocationId(null);
    triggerToast('Location name updated successfully!', 'success');
  };

  const handleDeleteLocation = (id: string) => {
    const loc = locations.find(l => l.id === id);
    if (!loc) return;
    setLocations(prev => prev.filter(l => l.id !== id));
    triggerToast(`Location "${loc.location}" deleted successfully!`, 'success');
  };

  // Filter Purchase Orders
  const filteredPurchaseOrders = useMemo(() => {
    const list = purchaseOrders.filter(po => {
      if (selectedOrderStatus !== 'All Statuses' && po.orderStatus !== selectedOrderStatus) {
        return false;
      }
      if (selectedPOCreatedDate !== 'All Dates') {
        const poDate = parseDateString(po.createdAt);
        if (poDate !== selectedPOCreatedDate) return false;
      }
      if (poSearchQuery) {
        const search = poSearchQuery.toLowerCase();
        return (
          po.poNumber.toLowerCase().includes(search) ||
          po.tracking.toLowerCase().includes(search)
        );
      }
      return true;
    });

    // Sort by ageDays
    return [...list].sort((a, b) => {
      if (poSortDirection === 'desc') {
        return b.ageDays - a.ageDays; // Oldest first (high ageDays/oldest)
      } else {
        return a.ageDays - b.ageDays; // Newest first (low ageDays/newest)
      }
    });
  }, [purchaseOrders, selectedOrderStatus, selectedPOCreatedDate, poSearchQuery, poSortDirection]);

  // Paginate Purchase Orders
  const paginatedPOs = useMemo(() => {
    const startIndex = (poCurrentPage - 1) * poPageSize;
    return filteredPurchaseOrders.slice(startIndex, startIndex + poPageSize);
  }, [filteredPurchaseOrders, poCurrentPage, poPageSize]);

  const poTotalPages = Math.ceil(filteredPurchaseOrders.length / poPageSize) || 1;


  // Triggering visual notice toast
  const triggerToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Toggle active status for any item
  const handleToggleActive = (id: string, currentStatus: boolean) => {
    setProducts(prev => 
      prev.map(p => p.id === id ? { ...p, active: !p.active } : p)
    );
    triggerToast(
      `Product is now ${!currentStatus ? 'Active' : 'Inactive'}`, 
      !currentStatus ? 'success' : 'info'
    );
  };

  // Dynamic tab entity creator
  const handleCreate = (type: TabType, data: any) => {
    const formattedDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const currentUserName = 'Olivia Rhye';

    if (type === 'Product') {
      const newProduct: Product = {
        ...data,
        id: String(products.length + 1),
        createdAt: formattedDate,
        lastUpdated: formattedDate
      };
      setProducts(prev => [newProduct, ...prev]);
      triggerToast(`"${newProduct.name}" created successfully!`);
    } else if (type === 'Type') {
      const newTypeItem: TypeRowItem = {
        id: String(1000 + Math.floor(Math.random() * 9000)),
        typeName: data.typeName,
        iconName: data.iconName,
        createdAt: formattedDate,
        createdBy: currentUserName
      };
      setTypes(prev => [newTypeItem, ...prev]);
      triggerToast(`Product type "${data.typeName}" created successfully!`);
    } else if (type === 'Style') {
      const newStyleItem: StyleRowItem = {
        id: String(1000 + Math.floor(Math.random() * 9000)),
        productName: data.productName,
        productStyle: data.productStyle,
        type: data.type,
        createdAt: formattedDate,
        createdBy: currentUserName
      };
      setStyles(prev => [newStyleItem, ...prev]);
      triggerToast(`Product style "${data.productStyle}" created successfully!`);
    } else if (type === 'Color') {
      const newColorItem: ColorRowItem = {
        id: String(1000 + Math.floor(Math.random() * 9000)),
        colorName: data.colorName,
        colorHexCode: data.colorHexCode,
        colorPreview: data.colorPreview,
        createdAt: formattedDate,
        createdBy: currentUserName
      };
      setColors(prev => [newColorItem, ...prev]);
      triggerToast(`Color "${data.colorName}" created successfully!`);
    } else if (type === 'Size') {
      const newSizeItem: SizeRowItem = {
        id: String(1000 + Math.floor(Math.random() * 9000)),
        sizeName: data.sizeName,
        createdAt: formattedDate,
        createdBy: currentUserName
      };
      setSizes(prev => [newSizeItem, ...prev]);
      triggerToast(`Size "${data.sizeName}" created successfully!`);
    }
    
    setCurrentPage(1); // Back to page 1
  };

  // Demo CSV/JSON importer helper
  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;

    try {
      // Attempt simplified JSON import or standard multi-format parsing
      const cleanInput = importText.trim();
      let importedCount = 0;

      if (cleanInput.startsWith('[') || cleanInput.startsWith('{')) {
        const parsed = JSON.parse(cleanInput);
        const parsedArray = Array.isArray(parsed) ? parsed : [parsed];
        
        const validated: Product[] = parsedArray.map((item, idx) => {
          const name = item.name || `Imported t-shirt ${idx + 1}`;
          const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          return {
            id: String(products.length + idx + 1),
            active: item.active !== undefined ? item.active : true,
            name,
            sku: item.sku || 'G500 / Dark blue / XL\nUNGSBHOOS',
            incomingStock: Number(item.incomingStock) || 20,
            stockQty: item.stockQty || 'In stock: 100',
            weight: Number(item.weight) || 21.3,
            customer: item.customer || 'Alexandra San',
            createdAt: formattedDate,
            lastUpdated: formattedDate,
            user: item.user || 'admin123'
          };
        });

        setProducts(prev => [...validated, ...prev]);
        importedCount = validated.length;
      } else {
        // Fallback newline string line-by-line format
        const lines = cleanInput.split('\n').filter(l => l.trim().length > 3);
        const dateNow = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        const validated: Product[] = lines.map((name, idx) => ({
          id: String(products.length + idx + 1),
          active: true,
          name: name.trim(),
          sku: 'G500 / Dark blue / XL\nUNGSBHOOS',
          incomingStock: 15,
          stockQty: 'In stock: 100',
          weight: 21.3,
          customer: 'Alexandra San',
          createdAt: dateNow,
          lastUpdated: dateNow,
          user: 'admin123'
        }));

        setProducts(prev => [...validated, ...prev]);
        importedCount = validated.length;
      }

      triggerToast(`Successfully imported ${importedCount} items!`);
      setImportText('');
      setIsImportModalOpen(false);
      setCurrentPage(1);
    } catch (err) {
      triggerToast('Failed to parse input. Ensure valid names list or JSON array format.', 'info');
    }
  };

  // Mass toggle all on/off on active page
  const handleToggleAllOnPage = (turnOn: boolean) => {
    const pageItemIds = paginatedProducts.map(p => p.id);
    setProducts(prev =>
      prev.map(p => pageItemIds.includes(p.id) ? { ...p, active: turnOn } : p)
    );
    triggerToast(`Turned ${turnOn ? 'ON' : 'OFF'} switches for current page items.`);
  };

  // Clearing all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStyle('All Styles');
    setSelectedColor('All Colors');
    setSelectedSize('All Sizes');
    setSelectedStock('All Statuses');
    setSelectedCustomer('All Customers');
    setCreatedDateFilter('All Dates');
    setSelectedStyleTypeFilter('All Types');
    setCurrentPage(1);
    triggerToast('All search criteria reset.', 'info');
  };

  // Check if any filter is active
  const isFilterActive = useMemo(() => {
    return (
      searchQuery !== '' ||
      selectedStock !== 'All Statuses' ||
      selectedCustomer !== 'All Customers' ||
      createdDateFilter !== 'All Dates' ||
      selectedStyleTypeFilter !== 'All Types'
    );
  }, [searchQuery, selectedStock, selectedCustomer, createdDateFilter, selectedStyleTypeFilter]);

  // Handle Filtering Math
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Search Query (Name or SKU only)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesSku = product.sku.toLowerCase().includes(query);
        if (!matchesName && !matchesSku) {
          return false;
        }
      }

      // 2. Stock Status Filter
      if (selectedStock !== 'All Statuses') {
        if (selectedStock === 'In stock') {
          if (!product.stockQty.toLowerCase().includes('in stock')) return false;
        } else if (selectedStock === 'Out of stock') {
          if (!product.stockQty.toLowerCase().includes('out of stock')) return false;
        }
      }

      // 3. Customer Filter
      if (selectedCustomer !== 'All Customers') {
        if (product.customer !== selectedCustomer) return false;
      }

      // 4. Created Date Picker Filter
      if (createdDateFilter !== 'All Dates') {
        const productDateStr = parseDateString(product.createdAt);
        if (productDateStr !== createdDateFilter) return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedStock, selectedCustomer, createdDateFilter]);

  // Filtered views for secondary tabs based on Search Query and Master States
  const filteredTypeItems = useMemo(() => {
    return types.filter(item => 
      !searchQuery || 
      item.typeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, types]);

  const filteredStyleItems = useMemo(() => {
    return styles.filter(item => {
      // Filter by type dropdown
      if (selectedStyleTypeFilter !== 'All Types' && item.type !== selectedStyleTypeFilter) {
        return false;
      }
      // Filter by search name (product style or product name)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.productName.toLowerCase().includes(query) ||
          item.productStyle.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [searchQuery, styles, selectedStyleTypeFilter]);

  const filteredColorItems = useMemo(() => {
    return colors.filter(item => 
      !searchQuery || 
      item.colorName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, colors]);

  const filteredSizeItems = useMemo(() => {
    return sizes.filter(item => 
      !searchQuery || 
      item.sizeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, sizes]);

  // Active filtered count based on selected tab
  const activeFilteredCount = useMemo(() => {
    if (activeTab === 'Product') return filteredProducts.length;
    if (activeTab === 'Type') return filteredTypeItems.length;
    if (activeTab === 'Style') return filteredStyleItems.length;
    if (activeTab === 'Color') return filteredColorItems.length;
    if (activeTab === 'Size') return filteredSizeItems.length;
    return 0;
  }, [activeTab, filteredProducts.length, filteredTypeItems.length, filteredStyleItems.length, filteredColorItems.length, filteredSizeItems.length]);

  // Paginated outputs for main product tab
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Total pages calculation based on active selection
  const totalPages = Math.ceil(activeFilteredCount / pageSize) || 1;

  const searchPlaceholder = useMemo(() => {
    switch (activeTab) {
      case 'Product':
        return 'Product name / SKU';
      case 'Type':
        return 'Type name';
      case 'Style':
        return 'Style name';
      case 'Color':
        return 'Color name';
      case 'Size':
        return 'Size name';
      default:
        return 'Search...';
    }
  }, [activeTab]);

  // Ensure current page is inside range bounds if dataset size updates
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [activeFilteredCount, totalPages, currentPage]);

  return (
    <div className="min-h-screen bg-[#F4F5F7] font-sans text-slate-800 flex flex-col antialiased">
      
      {/* TOP HEADER NAVIGATION - Landing / Modern web style header */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 select-none shadow-xs">
        <div className="px-4 lg:px-6 h-16 flex items-center justify-between">
          
          {/* Left side: Logo & Navigation items */}
          <div className="flex items-center gap-6 lg:gap-8">
            {/* Logo & Platform Name */}
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 logo-gradient rounded-xl flex items-center justify-center text-white font-extrabold shadow-sm relative overflow-hidden shrink-0">
                <span className="relative z-10 text-base font-display">P</span>
              </div>
              <div>
                <span className="font-display font-bold text-lg tracking-tight logo-text-gradient block leading-none">PAP system</span>
              </div>
            </div>

            {/* Navigation links - Desktop without Icons */}
            <nav className="hidden md:flex items-center gap-1.5" id="top-navigation">
              <button
                onClick={() => setActiveNavItem('Order')}
                className={`
                  px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer
                  ${activeNavItem === 'Order' 
                    ? 'bg-slate-100 text-slate-900 shadow-3xs' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                Order
              </button>

              <button
                onClick={() => setActiveNavItem('Purchase order')}
                className={`
                  px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer flex items-center gap-1.5
                  ${activeNavItem === 'Purchase order'
                    ? 'bg-slate-100 text-slate-900 shadow-3xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <span>WRO</span>
              </button>

              <button
                onClick={() => setActiveNavItem('Product')}
                className={`
                  px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer
                  ${activeNavItem === 'Product'
                    ? 'bg-slate-100 text-slate-900 shadow-3xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                Product
              </button>
            </nav>
          </div>

          {/* Right side: Avatar dropdown clicker */}
          <div className="flex items-center gap-3 relative">
            {/* User Profile Info Card inside a round or pill button with border & chevron */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center h-[42px] gap-3 pl-[6px] pr-4 rounded-full bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition-all duration-150 cursor-pointer select-none"
                title="Account menu"
              >
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120"
                  alt="Hiep Tran avatar"
                  referrerPolicy="no-referrer"
                  className="h-8 w-8 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-[12.5px] font-bold text-slate-700 font-sans leading-tight">
                    Hiep Tran
                  </div>
                  <div className="text-[10.5px] text-slate-400 font-sans leading-none mt-0.5">
                    max@work.com
                  </div>
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-all duration-200 ${isUserDropdownOpen ? 'rotate-180' : 'rotate-0'} shrink-0`} />
              </button>

              {/* Custom User Dropdown Menu with fade list */}
              <AnimatePresence>
                {isUserDropdownOpen && (
                  <>
                    {/* Backdrop cover for easy click to dismiss */}
                    <div 
                      className="fixed inset-0 z-40 cursor-default" 
                      onClick={() => setIsUserDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 text-left overflow-hidden"
                    >
                      <div className="p-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserDropdownOpen(false);
                            setIsLogoutConfirmOpen(true);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer text-left font-sans"
                        >
                          <LogOut className="h-4 w-4 shrink-0" />
                          <span>Log out</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden border-t border-slate-100 px-4 py-2.5 bg-slate-50/95 flex items-center justify-around">
          <button
            onClick={() => setActiveNavItem('Order')}
            className={`
              flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all duration-150 cursor-pointer text-[10px] font-bold
              ${activeNavItem === 'Order' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'}
            `}
          >
            <ClipboardList className="h-5 w-5" />
            <span>Order</span>
          </button>
          <button
            onClick={() => setActiveNavItem('Purchase order')}
            className={`
              flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all duration-150 cursor-pointer text-[10px] font-bold relative
              ${activeNavItem === 'Purchase order' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'}
            `}
          >
            <Inbox className="h-5 w-5" />
            <span className="flex items-center gap-1.5">
              <span>WRO</span>
            </span>
          </button>
          <button
            onClick={() => setActiveNavItem('Product')}
            className={`
              flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all duration-150 cursor-pointer text-[10px] font-bold
              ${activeNavItem === 'Product' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-800'}
            `}
          >
            <Shirt className="h-5 w-5" />
            <span>Product</span>
          </button>
        </div>
      </header>

      {/* MAIN PANEL - Full width content container inside matching light gray canvas */}
      <main className="flex-1 p-4 lg:p-6 flex flex-col gap-6 overflow-hidden max-w-full w-full">
        
        {/* Soft Toast Notification Animation Handler */}
        <div className="fixed top-4 right-4 z-50 pointer-events-none space-y-2">
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`
                  pointer-events-auto p-4 rounded-xl shadow-lg border flex items-center gap-3 max-w-sm
                  ${toastMessage.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-brand-50 border-brand-200 text-brand-900'
                  }
                `}
              >
                <div className={`
                  h-8 w-8 rounded-full flex items-center justify-center shrink-0
                  ${toastMessage.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-100 text-brand-600'}
                `}>
                  {toastMessage.type === 'success' ? <Check className="h-4.5 w-4.5" /> : <Sparkles className="h-4.5 w-4.5" />}
                </div>
                <div className="flex-1 text-sm font-medium">
                  {toastMessage.text}
                </div>
                <button
                  onClick={() => setToastMessage(null)}
                  className="text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating rounded central board */}
        <div 
          id="main-content-card" 
          className={
            activeNavItem === 'Order' && isOrderDetailOpen && selectedOrderDetail 
              ? "flex flex-col w-full" 
              : "bg-white rounded-2xl shadow-sm border border-slate-100/90 flex flex-col"
          }
        >
          
          {activeNavItem === 'Store' ? (
            <StoreManagementTab
              stores={stores}
              onCreateStore={handleCreateStore}
              onUpdateStore={handleUpdateStore}
              onDeleteStore={handleDeleteStore}
              triggerToast={triggerToast}
            />
          ) : activeNavItem === 'Order' ? (
            isOrderDetailOpen && selectedOrderDetail ? (
              <OrderDetailView
                selectedOrderDetail={selectedOrderDetail}
                setSelectedOrderDetail={setSelectedOrderDetail}
                setIsOrderDetailOpen={setIsOrderDetailOpen}
                setOrders={setOrders}
                products={products}
                triggerToast={triggerToast}
                handleUpdateOrderStatus={handleUpdateOrderStatus}
                onCreateLabel={(order, shipmentActiveIdx) => {
                  setLabelFormOrderNo(order.orderNumber || '');
                  setLabelFormClient(order.customerStore || 'Olivia Rhye Store');
                  setLabelFormCurrency('USD');
                  
                  const existingShipments = order.shipments && order.shipments.length > 0
                    ? order.shipments
                    : (order.shipmentInfo ? [order.shipmentInfo] : []);
                  
                  const tabs = existingShipments.length > 0
                    ? existingShipments.map((_, index) => `Shipment ${index + 1}`)
                    : ['Shipment 1'];
                  
                  setShipmentTabs(tabs);
                  const activeIdx = shipmentActiveIdx !== undefined && shipmentActiveIdx >= 0 && shipmentActiveIdx < tabs.length
                    ? shipmentActiveIdx
                    : 0;
                  setActiveShipmentTabIdx(activeIdx);
                  
                  loadShipmentFields(order, activeIdx);
                  setIsLabelPopupOpen(true);
                }}
                setIsVoidConfirmOpen={setIsVoidConfirmOpen}
                setIsShipmentDetailsModalOpen={setIsShipmentDetailsModalOpen}
                setIsShipmentItemsModalOpen={setIsShipmentItemsModalOpen}
                isEditingShipAddress={isEditingShipAddress}
                setIsEditingShipAddress={setIsEditingShipAddress}
                shipName={shipName}
                setShipName={setShipName}
                shipCompanyLine={shipCompanyLine}
                setShipCompanyLine={setShipCompanyLine}
                shipAddressLine={shipAddressLine}
                setShipAddressLine={setShipAddressLine}
                shipAddress2={shipAddress2}
                setShipAddress2={setShipAddress2}
                shipCity={shipCity}
                setShipCity={setShipCity}
                shipState={shipState}
                setShipState={setShipState}
                shipZip={shipZip}
                setShipZip={setShipZip}
                shipCountry={shipCountry}
                setShipCountry={setShipCountry}
                shipPhone={shipPhone}
                setShipPhone={setShipPhone}
                shipEmail={shipEmail}
                setShipEmail={setShipEmail}
                isPasteAddressOpen={isPasteAddressOpen}
                setIsPasteAddressOpen={setIsPasteAddressOpen}
                rawAddressToPaste={rawAddressToPaste}
                setRawAddressToPaste={setRawAddressToPaste}
                handleSaveShipAddress={handleSaveShipAddress}
                parseUSAddress={parseUSAddress}
              />
            ) : (
              <OrderManagementTab
                orderPagedItems={orderPagedItems}
                orderTotalPages={orderTotalPages}
                filteredOrders={filteredOrders}
                orderSearchQuery={orderSearchQuery}
                setOrderSearchQuery={setOrderSearchQuery}
                orderProductQuery={orderProductQuery}
                setOrderProductQuery={setOrderProductQuery}
                orderStatusFilter={orderStatusFilter}
                setOrderStatusFilter={setOrderStatusFilter}
                orderShippingStatusFilter={orderShippingStatusFilter}
                setOrderShippingStatusFilter={setOrderShippingStatusFilter}
                orderShipMethodFilter={orderShipMethodFilter}
                setOrderShipMethodFilter={setOrderShipMethodFilter}
                orderCustomerFilter={orderCustomerFilter}
                setOrderCustomerFilter={setOrderCustomerFilter}
                orderDateFrom={orderDateFrom}
                setOrderDateFrom={setOrderDateFrom}
                orderDateTo={orderDateTo}
                setOrderDateTo={setOrderDateTo}
                orderStyleFilter={orderStyleFilter}
                setOrderStyleFilter={setOrderStyleFilter}
                orderColorFilter={orderColorFilter}
                setOrderColorFilter={setOrderColorFilter}
                orderSizeFilter={orderSizeFilter}
                setOrderSizeFilter={setOrderSizeFilter}
                orderCurrentPage={orderCurrentPage}
                setOrderCurrentPage={setOrderCurrentPage}
                orderPageSize={orderPageSize}
                setOrderPageSize={setOrderPageSize}
                isOrderPageSizeOpen={isOrderPageSizeOpen}
                setIsOrderPageSizeOpen={setIsOrderPageSizeOpen}
                orderDateFromRef={orderDateFromRef}
                orderDateToRef={orderDateToRef}
                setSelectedOrderDetail={setSelectedOrderDetail}
                setIsOrderDetailOpen={setIsOrderDetailOpen}
                copiedOrderId={copiedOrderId}
                setCopiedOrderId={setCopiedOrderId}
                triggerToast={triggerToast}
                onUpdateOrderStatus={handleUpdateOrderStatus}
              />
            )
          ) : activeNavItem === 'Product' ? (
            <ProductTab
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              paginatedProducts={paginatedProducts}
              filteredProducts={filteredProducts}
              filteredTypeItems={filteredTypeItems}
              filteredStyleItems={filteredStyleItems}
              filteredColorItems={filteredColorItems}
              filteredSizeItems={filteredSizeItems}
              types={types}
              activeFilteredCount={activeFilteredCount}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchPlaceholder={searchPlaceholder}
              selectedStyle={selectedStyle}
              setSelectedStyle={setSelectedStyle}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              selectedStock={selectedStock}
              setSelectedStock={setSelectedStock}
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
              createdDateFilter={createdDateFilter}
              setCreatedDateFilter={setCreatedDateFilter}
              selectedStyleTypeFilter={selectedStyleTypeFilter}
              setSelectedStyleTypeFilter={setSelectedStyleTypeFilter}
              isFilterActive={isFilterActive}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalPages={totalPages}
              isPageSizeOpen={isPageSizeOpen}
              setIsPageSizeOpen={setIsPageSizeOpen}
              dateInputRef={dateInputRef}
              handleToggleActive={handleToggleActive}
              handleClearFilters={handleClearFilters}
              setIsCreateModalOpen={setIsCreateModalOpen}
              triggerToast={triggerToast}
            />
      ) : activeNavItem === 'Purchase order' ? (
        <div className="flex-1 min-h-[480px] flex flex-col items-center justify-center p-8 bg-white border border-slate-200 rounded-2xl shadow-3xs text-center font-sans">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-6 text-amber-500 animate-pulse">
            <Inbox className="h-8 w-8" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-widest mb-4 select-none">
            ⏳ Coming Soon
          </span>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight mb-2">
            Warehouse Receipt Order (WRO)
          </h2>
          <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
            This feature will be released in the near future.
          </p>
        </div>
      ) : activeNavItem === 'Addition' ? (
        <AdditionTab
          additionPagedItems={additionPagedItems}
          filteredAdditions={filteredAdditions}
          additionTotalPages={additionTotalPages}
          additionSearchProdTrack={additionSearchProdTrack}
          setAdditionSearchProdTrack={setAdditionSearchProdTrack}
          additionSearchBoxLoc={additionSearchBoxLoc}
          setAdditionSearchBoxLoc={setAdditionSearchBoxLoc}
          additionDateFilter={additionDateFilter}
          setAdditionDateFilter={setAdditionDateFilter}
          additionCurrentPage={additionCurrentPage}
          setAdditionCurrentPage={setAdditionCurrentPage}
          additionPageSize={additionPageSize}
          setAdditionPageSize={setAdditionPageSize}
          isAdditionPageSizeOpen={isAdditionPageSizeOpen}
          setIsAdditionPageSizeOpen={setIsAdditionPageSizeOpen}
          additionDateInputRef={additionDateInputRef}
          setIsCreateAdditionOpen={setIsCreateAdditionOpen}
          setAdditionToDelete={setAdditionToDelete}
          copiedPoId={copiedPoId}
          handleCopyTracking={handleCopyTracking}
          triggerToast={triggerToast}
        />
      ) : activeNavItem === 'Location' ? (
        <LocationTab
          locationActiveTab={locationActiveTab}
          setLocationActiveTab={setLocationActiveTab}
          locationPagedItems={locationPagedItems}
          historyPagedItems={historyPagedItems}
          filteredLocations={filteredLocations}
          filteredLocationHistory={filteredLocationHistory}
          locationTotalPages={locationTotalPages}
          historyTotalPages={historyTotalPages}
          historyLocationOptions={historyLocationOptions}
          searchLocationId={searchLocationId}
          setSearchLocationId={setSearchLocationId}
          searchProductSku={searchProductSku}
          setSearchProductSku={setSearchProductSku}
          selectedLocationStatus={selectedLocationStatus}
          setSelectedLocationStatus={setSelectedLocationStatus}
          historyLocationFilter={historyLocationFilter}
          setHistoryLocationFilter={setHistoryLocationFilter}
          historyDateFrom={historyDateFrom}
          setHistoryDateFrom={setHistoryDateFrom}
          historyDateTo={historyDateTo}
          setHistoryDateTo={setHistoryDateTo}
          historySearchSku={historySearchSku}
          setHistorySearchSku={setHistorySearchSku}
          locationCurrentPage={locationCurrentPage}
          setLocationCurrentPage={setLocationCurrentPage}
          historyCurrentPage={historyCurrentPage}
          setHistoryCurrentPage={setHistoryCurrentPage}
          locationPageSize={locationPageSize}
          setLocationPageSize={setLocationPageSize}
          isLocationPageSizeOpen={isLocationPageSizeOpen}
          setIsLocationPageSizeOpen={setIsLocationPageSizeOpen}
          editingLocationId={editingLocationId}
          setEditingLocationId={setEditingLocationId}
          editingLocationValue={editingLocationValue}
          setEditingLocationValue={setEditingLocationValue}
          openActionMenuId={openActionMenuId}
          setOpenActionMenuId={setOpenActionMenuId}
          historyDateFromRef={historyDateFromRef}
          historyDateToRef={historyDateToRef}
          setIsCreateLocationOpen={setIsCreateLocationOpen}
          setSelectedLocationForReturn={setSelectedLocationForReturn}
          setReturnProductInfo={setReturnProductInfo}
          setReturnQty={setReturnQty}
          setReturnPerformedBy={setReturnPerformedBy}
          setReturnNotes={setReturnNotes}
          setLocationToDelete={setLocationToDelete}
          handleSaveInlineLocationName={handleSaveInlineLocationName}
          triggerToast={triggerToast}
        />
      ) : activeNavItem === 'WIP printing' ? (
        <>
          {/* Header context */}
          <div className="px-6 py-4 bg-white border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 select-none">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <h1 className="text-xl font-bold font-sans text-slate-900 tracking-tight leading-none">Print WIP</h1>
              </div>

              {/* Radio-Style Bullet Channels Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {(() => {
                  const channelPool = [
                    { id: 'All', label: 'ALL', count: 416 },
                    { id: 'PTFY-API', label: 'PTFY-API', count: 343 },
                    { id: 'MYYM', label: 'MYYM', count: 64 },
                    { id: 'RBBL', label: 'RBBL', count: 4 },
                    { id: 'MYYM_2', label: 'MYYM_2', count: 1 },
                    { id: 'DTrang', label: 'DTrang', count: 1 }
                  ];

                  const item1 = channelPool.find(ch => ch.id === 'All')!;
                  const item2 = channelPool.find(ch => ch.id === 'PTFY-API')!;
                  const item3 = channelPool.find(ch => ch.id === papThirdOptionId) || channelPool.find(ch => ch.id === 'MYYM')!;

                  const activeShortlist = [item1, item2, item3];
                  const remainingChannels = channelPool.filter(ch => ch.id !== 'All' && ch.id !== 'PTFY-API' && ch.id !== papThirdOptionId);

                  return (
                    <>
                      {activeShortlist.map((ch) => {
                        const isChecked = papSelectedChannel === ch.id;
                        return (
                          <button
                            key={ch.id}
                            type="button"
                            onClick={() => {
                              setPapSelectedChannel(ch.id);
                            }}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all text-xs font-bold border cursor-pointer ${
                              isChecked 
                                ? 'bg-blue-50/40 text-blue-600 border-blue-500 shadow-3xs' 
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {/* Radio dot */}
                            <span className={`h-3 w-3 rounded-full flex items-center justify-center border-2 ${
                              isChecked ? 'border-blue-600 bg-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isChecked && <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                            </span>
                            <span>{ch.label}({ch.count})</span>
                          </button>
                        );
                      })}

                      {/* Dynamic More Dropdown */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsPapChannelDropdownOpen(!isPapChannelDropdownOpen)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs font-bold border cursor-pointer select-none ${
                            remainingChannels.some(rc => papSelectedChannel === rc.id)
                              ? 'bg-blue-50/40 text-blue-600 border-blue-500 shadow-3xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <span>More</span>
                          <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isPapChannelDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isPapChannelDropdownOpen && (
                          <>
                            {/* Invisible backdrop to dismiss the dropdown */}
                            <div 
                              className="fixed inset-0 z-40" 
                              onClick={() => setIsPapChannelDropdownOpen(false)} 
                            />
                            <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 text-left font-sans animate-fade-in divide-y divide-slate-100">
                              {remainingChannels.map((ch) => (
                                <button
                                  key={ch.id}
                                  type="button"
                                  onClick={() => {
                                    setPapThirdOptionId(ch.id);
                                    setPapSelectedChannel(ch.id);
                                    setIsPapChannelDropdownOpen(false);
                                  }}
                                  className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition text-left flex justify-between items-center cursor-pointer"
                                >
                                  <span>{ch.label}</span>
                                  <span className="text-[10px] font-mono text-slate-400">({ch.count})</span>
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>

            </div>

            {/* Total Pending Flag - LIGHT VERSION */}
            <div className="flex items-center gap-1.5 text-slate-700 text-sm font-semibold select-none">
              <span>Total Pending:</span>
              <strong className="text-slate-900 font-extrabold text-lg">
                {papSelectedChannel === 'RBBL' ? 4 : papSelectedChannel === 'PTFY-API' ? 343 : papSelectedChannel === 'MYYM' ? 64 : papSelectedChannel === 'DTrang' ? 1 : papSelectedChannel === 'MYYM_2' ? 1 : 416}
              </strong>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              
              {/* Left Column blocks: Style (Vietnam Requirement) */}
              <div className="xl:col-span-3 space-y-4">
                
                {/* Date range selection */}
                <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-2.5 shadow-3xs">
                  <div className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 select-none">
                    <Calendar className="h-3.5 w-3.5 text-brand-500" />
                    <span>Date Filter</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <input
                      type="date"
                      value={papDateFrom}
                      onChange={(e) => setPapDateFrom(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-bold focus:outline-none focus:border-brand-300 cursor-pointer"
                    />
                    <div className="text-center text-slate-400 font-extrabold text-[10px] select-none">—</div>
                    <input
                      type="date"
                      value={papDateTo}
                      onChange={(e) => setPapDateTo(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-bold focus:outline-none focus:border-brand-300 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Style list selector */}
                <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-2.5 shadow-3xs">
                  <div className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest select-none">
                    Select Product Style
                  </div>
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                    {papStyles.map((st) => {
                      const isSelected = papSelectedStyleFilter === st.id;
                      const pendingCount = st.pendingLabels;
                      const lastPrintedStr = st.lastPrinted || 'not yet';
                      
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            setPapSelectedStyleFilter(st.id);
                            setPapCounterValue(st.pendingLabels);
                          }}
                          className={`w-full text-center rounded-xl p-3 border transition-all duration-300 relative overflow-hidden flex flex-col justify-center items-center cursor-pointer min-h-[96px] ${
                            isSelected
                              ? 'wip-style-card-active border-sky-600 ring-4 ring-sky-100 border-2 shadow-sm'
                              : 'wip-style-card-inactive hover:brightness-95 text-slate-800 border-slate-200 shadow-3xs'
                          }`}
                        >
                          <div className="text-xl font-black font-sans tracking-tight text-slate-950">
                            {st.name}
                          </div>
                          
                          <div className="mt-2 space-y-0.5 text-center text-slate-900 font-sans">
                            <div className="text-[11px] font-semibold text-slate-800">
                              Pending Label: <span className="font-extrabold text-slate-950 font-mono text-xs">{pendingCount}</span>
                            </div>
                            <div className="text-[9.5px] font-medium text-slate-500">
                              Last Printed: {lastPrintedStr}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Confirm quantity panel */}
                <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-2.5 shadow-3xs">
                  <div className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between select-none">
                    <span>Confirm Qty</span>
                    <span className="font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold text-[9px]">
                      style {papSelectedStyleFilter}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50/50 rounded-lg border border-slate-200 p-1 bg-white">
                    <button
                      type="button"
                      onClick={() => setPapCounterValue(prev => Math.max(0, prev - 1))}
                      className="h-7 w-7 bg-slate-50 hover:bg-slate-100 text-slate-750 font-black rounded-md border border-slate-200 shadow-3xs flex items-center justify-center text-xs cursor-pointer transition select-none"
                    >
                      —
                    </button>

                    <div className="text-xs font-black font-mono text-slate-800">
                      {papCounterValue}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const maxPending = papStyles.find(st => st.id === papSelectedStyleFilter)?.pendingLabels ?? 0;
                        setPapCounterValue(prev => Math.min(maxPending, prev + 1));
                      }}
                      className="h-7 w-7 bg-slate-50 hover:bg-slate-100 text-slate-750 font-black rounded-md border border-slate-200 shadow-3xs flex items-center justify-center text-xs cursor-pointer transition select-none"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const styleToGen = papSelectedStyleFilter === 'ALL' ? '64000' : papSelectedStyleFilter;
                        const code = styleToGen === '5000' ? 'M' : 'S';
                        const color = styleToGen === '5000' ? 'Gray' : 'White';
                        
                        const maxPending = papStyles.find(st => st.id === styleToGen)?.pendingLabels ?? 0;
                        const finalCount = Math.min(maxPending, papCounterValue);
                        if (finalCount <= 0) {
                          triggerToast('Please select quantity greater than 0!', 'info');
                          return;
                        }

                        const dateInfo = getPSTDateOnlyString();
                        const nextQueueId = (Math.max(...papPrintingQueue.map(q => parseInt(q.id) || 100000)) + 1).toString();
                        const generatedLabelIds = Array.from({ length: finalCount }).map((_, idx) => (
                          `${dateInfo.mmddyy}-PAP-${code}-${nextQueueId}-${idx + 1}`
                        ));

                        const newItem: PAPPrintingItem = {
                          id: nextQueueId,
                          createdAt: getYYYYMMDDHHMM(),
                          style: styleToGen,
                          user: 'Tech',
                          empId: 'EMP001',
                          quantity: finalCount,
                          status: 'Completed',
                          labelIds: generatedLabelIds,
                          color: color,
                          size: code,
                          tags: ['Manual', papSelectedChannel]
                        };

                        setPapPrintingQueue(prev => [newItem, ...prev]);
                        setPapGeneratedToday(prev => prev + finalCount);
                        
                        // Decrement the pending count of that style in state
                        setPapStyles(prevStyles => {
                          return prevStyles.map(s => {
                            if (s.id === styleToGen) {
                              const nextPending = Math.max(0, s.pendingLabels - finalCount);
                              setPapCounterValue(nextPending);
                              return { ...s, pendingLabels: nextPending };
                            }
                            return s;
                          });
                        });

                        triggerToast(`Successfully created ${finalCount} WIP sheet label requests!`, 'success');
                      }}
                      className="flex-1 h-8 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-lg shadow-3xs transition cursor-pointer flex items-center justify-center"
                    >
                      Confirm
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPapCounterValue(0);
                        setPapPretreatment('Pretreatment');
                        setPapColorInput('Color');
                        setPapInkIndicator('Ink Indicator');
                        setPapSelectedStyleFilter('18000');
                        setPapSelectedTechFilter('ALL');
                        triggerToast('Controls successfully reset', 'info');
                      }}
                      className="h-8 w-8 px-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 rounded-lg transition cursor-pointer flex items-center justify-center"
                      title="Reset parameters"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Tabs & Table only */}
              <div className="xl:col-span-9 space-y-5 w-full">
                
                {/* Tables desk containing Printing and History tabs */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-3xs overflow-hidden flex flex-col">
                  
                  {/* Tabs select bar - NOW AT THE VERY TOP OF THE CARD CONTAINER */}
                  <div className="px-6 pt-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 select-none">
                    <div className="flex items-center gap-6">
                      {(['Printing', 'History'] as const).map((tab) => {
                        const isActive = papActiveTab === tab;
                        return (
                          <button
                            key={tab}
                            onClick={() => setPapActiveTab(tab)}
                            className={`
                              pb-3 font-semibold text-sm transition-all duration-150 relative cursor-pointer block whitespace-nowrap
                              ${isActive 
                                ? 'text-brand-600 font-bold' 
                                : 'text-slate-400 hover:text-slate-700'
                              }
                            `}
                          >
                            <span className="flex items-center gap-1.5">
                              {tab === 'Printing' ? <Printer className="h-4 w-4" /> : <History className="h-4 w-4" />}
                              {tab}
                            </span>
                            {isActive && (
                              <motion.div 
                                layoutId="papTabBarUnderline" 
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full"
                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Filter segment, shown only for History tab */}
                  {papActiveTab === 'History' && (
                    <div className="p-4 border-b border-slate-100 bg-white">
                      <div className="flex flex-wrap items-center gap-3">
                        <select
                          value={papHistoryTypeFilter}
                          onChange={(e) => setPapHistoryTypeFilter(e.target.value)}
                          className="h-8.5 px-3 text-xs bg-white border border-slate-200 rounded-lg text-slate-600 font-semibold focus:outline-none focus:border-slate-350 hover:bg-slate-50 transition cursor-pointer"
                        >
                          <option value="Filter by Type">Filter by Type</option>
                          <option value="All">All Types</option>
                          <option value="Reprint">Reprint</option>
                          <option value="Manual">Manual</option>
                          <option value="Tiktok">TikTok</option>
                          <option value="PTFY-API">PTFY-API</option>
                        </select>

                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search SKU..."
                            value={papHistorySearchSku}
                            onChange={(e) => setPapHistorySearchSku(e.target.value)}
                            className="h-8.5 min-w-[200px] px-3.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-slate-350 transition font-medium"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            triggerToast(`Searching history for "${papHistorySearchSku}"...`, 'info');
                          }}
                          className="h-8.5 px-5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-lg shadow-3xs transition cursor-pointer"
                        >
                          Search
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setPapHistoryTypeFilter('Filter by Type');
                            setPapHistorySearchSku('');
                            triggerToast('History search parameters reset', 'info');
                          }}
                          className="inline-flex items-center gap-1.5 h-8.5 text-xs text-brand-600 hover:text-brand-800 font-semibold px-2 rounded hover:bg-brand-50 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Reset</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Table area */}
                  <div className="overflow-x-auto min-h-[360px]">
                    {papActiveTab === 'Printing' ? (
                      <table className="w-full text-xs text-slate-600 border-collapse">
                        <thead className="bg-slate-50 text-[10px] text-slate-400 font-extrabold uppercase tracking-widest border-b border-slate-100">
                          <tr>
                            <th className="py-3 px-4 text-left font-sans">ID</th>
                            <th className="py-3 px-4 text-left font-sans">Created At</th>
                            <th className="py-3 px-4 text-left font-sans">Style</th>
                            <th className="py-3 px-4 text-left font-sans">User</th>
                            <th className="py-3 px-4 text-right font-sans">Qty</th>
                            <th className="py-3 px-5 text-left font-sans">Status</th>
                            <th className="py-3 px-4 text-center font-sans"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {filteredPapPrintingQueue.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-16 text-center select-none">
                                <div className="flex flex-col items-center justify-center gap-2">
                                  <Inbox className="h-10 w-10 text-slate-300" strokeWidth={1.5} />
                                  <p className="text-slate-400 font-bold text-xs">No active queue</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            papPrintingPagedItems.map((item) => {
                                const isSelected = selectedPreviewItem?.id === item.id;
                                const isCompleted = item.status === 'Completed';

                                return (
                                  <tr
                                    key={item.id}
                                    onClick={() => setSelectedPreviewItem({
                                      id: item.id,
                                      style: item.style,
                                      labelId: item.labelIds[0] || `061626-PAP-S-${item.id}-1`,
                                      createdAt: item.createdAt,
                                      color: item.color,
                                      size: item.size
                                    })}
                                    className={`border-b border-slate-100 hover:bg-slate-50/50 transition cursor-pointer ${isSelected ? 'bg-indigo-50/10' : ''}`}
                                  >
                                    <td className="py-3 px-4 text-slate-800 font-semibold font-mono">
                                      {item.id}
                                    </td>
                                    
                                    <td className="py-3 px-4 text-slate-700 font-normal font-sans">
                                      {item.createdAt}
                                    </td>
                                    
                                    <td className="py-3 px-4 text-slate-800 font-semibold font-sans">
                                      {item.style}
                                    </td>
                                    
                                    <td className="py-3 px-4 text-slate-800 font-semibold font-sans">
                                      {item.user}
                                    </td>
                                    
                                    <td className="py-3 px-4 text-right text-slate-800 font-semibold font-sans">
                                      {item.quantity}
                                    </td>
                                    
                                    <td className="py-3 px-5">
                                      {isCompleted ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100/70">
                                          Completed
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/70">
                                          Pending
                                        </span>
                                      )}
                                    </td>
                                    
                                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                      <button
                                        type="button"
                                        disabled={!isCompleted}
                                        onClick={() => {
                                          setPrintTargetItem(item);
                                          setFirstLabelScanned('');
                                          setLastLabelScanned('');
                                          setIsPrintConfirmModalOpen(true);
                                        }}
                                        className={`h-7.5 px-4 font-extrabold text-[11px] uppercase tracking-wide rounded-lg shadow-3xs transition cursor-pointer ${
                                          isCompleted 
                                            ? 'bg-brand-600 hover:bg-brand-700 text-white' 
                                            : 'bg-slate-100 text-slate-400 border border-slate-250 cursor-not-allowed opacity-70 pointer-events-none'
                                        }`}
                                      >
                                        Print
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })
                          )}
                        </tbody>
                      </table>
                    ) : (
                      <table className="w-full text-xs text-slate-600 border-collapse">
                        <thead className="bg-slate-50 text-[10px] text-slate-400 font-extrabold uppercase tracking-widest border-b border-slate-100">
                          <tr>
                            <th className="py-3 px-4 text-left font-sans">ID</th>
                            <th className="py-3 px-4 text-left font-sans">Created At</th>
                            <th className="py-3 px-4 text-left font-sans">Style</th>
                            <th className="py-3 px-4 text-left font-sans">User</th>
                            <th className="py-3 px-4 text-right font-sans">Qty</th>
                            <th className="py-3 px-5 text-left font-sans">Status</th>
                            <th className="py-3 px-4 text-center font-sans"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {filteredPapHistory.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-16 text-center select-none">
                                <div className="flex flex-col items-center justify-center gap-2">
                                  <Inbox className="h-10 w-10 text-slate-300" strokeWidth={1.5} />
                                  <p className="text-slate-400 font-bold text-xs">No print history</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            papHistoryPagedItems.map((item) => {
                                const isSelected = selectedPreviewItem?.id === item.id;

                                return (
                                  <tr
                                    key={item.id}
                                    onClick={() => setSelectedPreviewItem({
                                      id: item.id,
                                      style: item.style,
                                      labelId: item.labelIds[0] || `061626-PAP-S-${item.id}-1`,
                                      createdAt: item.createdAt,
                                      color: item.color,
                                      size: item.size
                                    })}
                                    className={`border-b border-slate-100 hover:bg-slate-50/50 transition cursor-pointer ${isSelected ? 'bg-indigo-50/20' : ''}`}
                                  >
                                    <td className="py-3 px-4 text-slate-800 font-semibold font-mono">{item.id}</td>
                                    
                                    <td className="py-3 px-4 text-slate-700 font-normal font-sans">
                                      <div>{item.createdAt}</div>
                                      <div className="text-[10px] text-emerald-600 font-bold font-sans mt-0.5">Printed: {item.printedAt}</div>
                                    </td>

                                    <td className="py-3 px-4 text-slate-800 font-semibold font-sans">
                                      {item.style}
                                    </td>

                                    <td className="py-3 px-4 text-slate-800 font-semibold font-sans">{item.user}</td>
                                    
                                    <td className="py-3 px-4 text-right text-slate-800 font-semibold font-sans">{item.quantity}</td>
                                    
                                    <td className="py-3 px-5">
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100/70">
                                        Completed
                                      </span>
                                    </td>

                                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                      <div className="flex justify-center items-center gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setReprintTargetItem(item);
                                            setReprintLeaderId('');
                                            setIsReprintModalOpen(true);
                                          }}
                                          className="h-7 px-2.5 text-[9px] font-bold uppercase tracking-wide border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 rounded-md shadow-3xs cursor-pointer"
                                        >
                                          Reprint
                                        </button>
                                        
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setReconvertTargetItem(item);
                                            setReconvertLeaderId('');
                                            setIsReconvertModalOpen(true);
                                          }}
                                          className="h-7 px-2.5 text-[9px] font-bold uppercase tracking-wide border border-indigo-200 hover:border-indigo-350 bg-indigo-50/50 hover:bg-indigo-100/50 text-indigo-700 rounded-md cursor-pointer"
                                        >
                                          Reconvert
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Table Footer Pagination Controls */}
                  <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-450 font-bold select-none rounded-b-xl">
                    {papActiveTab === 'Printing' ? (
                      <>
                        {/* Page size controller & total counts */}
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setIsPapPrintingPageSizeOpen(!isPapPrintingPageSizeOpen)}
                              className="inline-flex items-center justify-between gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <span>{papPrintingPageSize}/page</span>
                              <ChevronDown className="h-3 w-3 text-slate-400" />
                            </button>

                            {isPapPrintingPageSizeOpen && (
                              <div className="absolute left-0 bottom-full mb-1.5 w-24 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
                                {[5, 10, 15, 20].map((size) => (
                                  <button
                                    key={size}
                                    type="button"
                                    onClick={() => {
                                      setPapPrintingPageSize(size);
                                      setIsPapPrintingPageSizeOpen(false);
                                      setPapPrintingCurrentPage(1);
                                    }}
                                    className={`w-full text-left px-3.5 py-1.5 text-xs transition-colors ${size === papPrintingPageSize ? 'bg-brand-50 text-brand-600 font-semibold' : 'hover:bg-slate-50 text-slate-700'}`}
                                  >
                                    {size}/page
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          <span className="text-slate-500 font-medium text-xs font-sans">
                            of total <strong className="text-slate-800">{filteredPapPrintingQueue.length.toLocaleString()}</strong> request{filteredPapPrintingQueue.length !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* Numeric and Back/Forward Controls block */}
                        <div className="flex items-center gap-1">
                          {/* Previous button */}
                          <button
                            type="button"
                            onClick={() => setPapPrintingCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={papPrintingCurrentPage === 1}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-[11px] font-semibold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                          >
                            <ChevronLeft className="h-3 w-3" />
                            <span>Previous</span>
                          </button>

                          {/* Page Numbering elements */}
                          <div className="hidden sm:flex items-center gap-1 mx-1.5">
                            {Array.from({ length: papPrintingTotalPages }).map((_, idx) => {
                              const pNum = idx + 1;
                              const isCurrent = papPrintingCurrentPage === pNum;
                              
                              return (
                                <button
                                  key={pNum}
                                  type="button"
                                  onClick={() => setPapPrintingCurrentPage(pNum)}
                                  className={`
                                    h-7.5 w-7.5 flex items-center justify-center rounded-lg text-[11px] font-bold transition-all duration-150 cursor-pointer
                                    ${isCurrent 
                                      ? 'bg-brand-50 text-brand-600 border border-brand-200 shadow-sm' 
                                      : 'text-slate-600 hover:bg-slate-100/60 hover:text-slate-900'
                                    }
                                  `}
                                >
                                  {pNum}
                                </button>
                              );
                            })}
                          </div>

                          {/* Next button */}
                          <button
                            type="button"
                            onClick={() => setPapPrintingCurrentPage(prev => Math.min(papPrintingTotalPages, prev + 1))}
                            disabled={papPrintingCurrentPage === papPrintingTotalPages}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-[11px] font-semibold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                          >
                            <span>Next</span>
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Page size controller & total counts */}
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setIsPapHistoryPageSizeOpen(!isPapHistoryPageSizeOpen)}
                              className="inline-flex items-center justify-between gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <span>{papHistoryPageSize}/page</span>
                              <ChevronDown className="h-3 w-3 text-slate-400" />
                            </button>

                            {isPapHistoryPageSizeOpen && (
                              <div className="absolute left-0 bottom-full mb-1.5 w-24 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
                                {[5, 10, 15, 20].map((size) => (
                                  <button
                                    key={size}
                                    type="button"
                                    onClick={() => {
                                      setPapHistoryPageSize(size);
                                      setIsPapHistoryPageSizeOpen(false);
                                      setPapHistoryCurrentPage(1);
                                    }}
                                    className={`w-full text-left px-3.5 py-1.5 text-xs transition-colors ${size === papHistoryPageSize ? 'bg-brand-50 text-brand-600 font-semibold' : 'hover:bg-slate-50 text-slate-700'}`}
                                  >
                                    {size}/page
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          <span className="text-slate-500 font-medium text-xs font-sans">
                            of total <strong className="text-slate-800">{filteredPapHistory.length.toLocaleString()}</strong> history record{filteredPapHistory.length !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {/* Numeric and Back/Forward Controls block */}
                        <div className="flex items-center gap-1">
                          {/* Previous button */}
                          <button
                            type="button"
                            onClick={() => setPapHistoryCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={papHistoryCurrentPage === 1}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-[11px] font-semibold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                          >
                            <ChevronLeft className="h-3 w-3" />
                            <span>Previous</span>
                          </button>

                          {/* Page Numbering elements */}
                          <div className="hidden sm:flex items-center gap-1 mx-1.5">
                            {Array.from({ length: papHistoryTotalPages }).map((_, idx) => {
                              const pNum = idx + 1;
                              const isCurrent = papHistoryCurrentPage === pNum;
                              
                              return (
                                <button
                                  key={pNum}
                                  type="button"
                                  onClick={() => setPapHistoryCurrentPage(pNum)}
                                  className={`
                                    h-7.5 w-7.5 flex items-center justify-center rounded-lg text-[11px] font-bold transition-all duration-150 cursor-pointer
                                    ${isCurrent 
                                      ? 'bg-brand-50 text-brand-600 border border-brand-200 shadow-sm' 
                                      : 'text-slate-600 hover:bg-slate-100/60 hover:text-slate-900'
                                    }
                                  `}
                                >
                                  {pNum}
                                </button>
                              );
                            })}
                          </div>

                          {/* Next button */}
                          <button
                            type="button"
                            onClick={() => setPapHistoryCurrentPage(prev => Math.min(papHistoryTotalPages, prev + 1))}
                            disabled={papHistoryCurrentPage === papHistoryTotalPages}
                            className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-[11px] font-semibold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
                          >
                            <span>Next</span>
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}

        </div>

      </main>

      {/* CREATE ORDER MODAL */}
      <AnimatePresence>
        {isCreateOrderOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-lg overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-base font-bold text-slate-800 font-sans">Create NEW Order</h3>
                <button
                  type="button"
                  onClick={() => setIsCreateOrderOpen(false)}
                  className="p-1.5 hover:bg-slate-200/50 rounded-lg text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  
                  if (!newOrderNum.trim()) {
                    triggerToast("Please enter an Order Number.", "info");
                    return;
                  }
                  if (!newOrderCustomer.trim()) {
                    triggerToast("Please enter or select a customer.", "info");
                    return;
                  }
                  const qty = parseInt(newOrderQty);
                  if (isNaN(qty) || qty <= 0) {
                    triggerToast("Please enter a valid positive quantity.", "info");
                    return;
                  }
                  if (!newOrderDest.trim()) {
                    triggerToast("Please enter a destination.", "info");
                    return;
                  }

                  const newOrder: OrderManagementItem = {
                    id: `ord_${Date.now()}`,
                    warehouse: newOrderWarehouse,
                    orderNumber: newOrderNum,
                    refNumber: `REF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                    orderDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    customerStore: newOrderCustomer,
                    orderStatus: 'New',
                    shippingStatus: 'Pre Transit',
                    quantity: qty,
                    shippingMethod: newOrderShipMethod,
                    destination: newOrderDest,
                    destinationType: newOrderDest.toLowerCase().includes('international') || newOrderDest.toLowerCase().includes('vietnam') || newOrderDest.toLowerCase().includes('uk') || newOrderDest.toLowerCase().includes('germany') || newOrderDest.toLowerCase().includes('canada') ? 'International' : 'Domestic',
                    trackingNumber: '',
                    orderItems: [
                      {
                        productName: "Classic Crewneck Apparel",
                        styleColor: "Charcoal / M",
                        sku: "APP-CRW-002",
                        quantity: qty
                      }
                    ],
                    shipmentInfo: {
                      trackingNumber: '',
                      carrier: '—',
                      service: newOrderShipMethod,
                      shipDate: '—'
                    },
                    internalNotes: '',
                    activityHistory: [
                      {
                        id: `act_${Date.now()}`,
                        action: 'Order Created',
                        performedBy: 'CS Staff Member',
                        date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                        notes: 'Manual entry created from order workspace.'
                      }
                    ]
                  };

                  setOrders(prev => [newOrder, ...prev]);
                  setIsCreateOrderOpen(false);
                  triggerToast(`Order ${newOrderNum} created successfully!`, 'success');
                }}
                className="p-6 space-y-4 text-left"
              >
                {/* Order Number */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Order Number <span className="text-rose-500 font-normal">*</span>
                  </label>
                  <input
                    type="text"
                    value={newOrderNum}
                    onChange={(e) => setNewOrderNum(e.target.value)}
                    className="w-full px-3.5 h-10 text-sm border border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg outline-none transition uppercase font-mono"
                    placeholder="e.g. ORD-2026-008"
                    required
                  />
                </div>

                {/* Customer Store */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Customer / Store <span className="text-rose-500 font-normal">*</span>
                  </label>
                  <select
                    value={newOrderCustomer}
                    onChange={(e) => setNewOrderCustomer(e.target.value)}
                    className="w-full px-3.5 h-10 text-sm border border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg outline-none bg-white transition"
                    required
                  >
                    {['Olivia Rhye', 'Acme Corp', 'Phoenix Baker', 'Lana Steiner', 'Demi Wilkinson'].map(cust => (
                      <option key={cust} value={cust}>{cust}</option>
                    ))}
                  </select>
                </div>

                {/* Quantity & Shipping Method (Cols) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Quantity <span className="text-rose-500 font-normal">*</span>
                    </label>
                    <input
                      type="number"
                      value={newOrderQty}
                      onChange={(e) => setNewOrderQty(e.target.value)}
                      className="w-full px-3.5 h-10 text-sm border border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg outline-none transition font-mono"
                      placeholder="e.g. 150"
                      min="1"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Shipping Method
                    </label>
                    <select
                      value={newOrderShipMethod}
                      onChange={(e) => setNewOrderShipMethod(e.target.value)}
                      className="w-full px-3.5 h-10 text-sm border border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg outline-none bg-white transition"
                    >
                      {['UPS Ground', 'FedEx Express', 'DHL Worldwide', 'USPS Priority'].map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Warehouse */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Warehouse <span className="text-rose-500 font-normal">*</span>
                  </label>
                  <select
                    value={newOrderWarehouse}
                    onChange={(e) => setNewOrderWarehouse(e.target.value)}
                    className="w-full px-3.5 h-10 text-sm border border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg outline-none bg-white transition"
                    required
                  >
                    <option value="Warehouse A">Warehouse A</option>
                    <option value="Warehouse B">Warehouse B</option>
                  </select>
                </div>

                {/* Destination */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Destination <span className="text-rose-500 font-normal">*</span>
                  </label>
                  <input
                    type="text"
                    value={newOrderDest}
                    onChange={(e) => setNewOrderDest(e.target.value)}
                    className="w-full px-3.5 h-10 text-sm border border-slate-200 hover:border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-lg outline-none transition"
                    placeholder="Warehouse A / Store #15 / Los Angeles Main Hub"
                    required
                  />
                </div>

                {/* Form Buttons */}
                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateOrderOpen(false)}
                    className="px-4 h-10 text-sm border border-slate-200 bg-white hover:bg-slate-50 rounded-lg font-semibold text-slate-700 cursor-pointer transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 h-10 text-sm text-white bg-brand-600 hover:bg-brand-700 rounded-lg font-semibold cursor-pointer transition shadow-sm"
                  >
                    Submit Order
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ORDER DETAIL DRAWER */}
      <AnimatePresence>
        {false && isOrderDetailOpen && selectedOrderDetail && (
          <div 
            onClick={() => {
              setIsOrderDetailOpen(false);
              setIsRejectingOrder(false);
              setOrderRejectReasonText('');
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[1200px] bg-white rounded-2xl border border-slate-100 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Order Details</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedOrderDetail.destinationType === 'International'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}>
                      {selectedOrderDetail.destinationType || 'Domestic'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <h2 className="text-xl font-bold font-sans text-slate-850 font-mono select-all truncate max-w-[200px]">
                      {selectedOrderDetail.orderNumber}
                    </h2>
                    <span className="text-slate-300">|</span>
                    <span className="text-sm text-slate-500 font-medium font-mono select-all truncate max-w-[200px]">
                      {selectedOrderDetail.refNumber || 'REF-N/A'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOrderDetailOpen(false);
                      setIsRejectingOrder(false);
                      setOrderRejectReasonText('');
                    }}
                    className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  
                  {/* Left Column (2/3 width on md+) */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Unified Order Details section */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Order Details</h4>
                      <div className="border border-slate-200/65 rounded-xl bg-white overflow-hidden shadow-xs divide-y divide-slate-100">
                        {/* Meta Grid (Top part) */}
                        <div className="p-4 bg-slate-50/50 grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">Store Name</span>
                            <span className="text-sm font-semibold text-slate-850 mt-1 block font-sans">{selectedOrderDetail.customerStore}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">Order Date</span>
                            <span className="text-sm font-normal text-slate-700 mt-1 block font-sans">{selectedOrderDetail.orderDate}</span>
                          </div>
                          <div className="relative">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">Shipping Method</span>
                            <select
                              value={pendingShippingMethod !== null ? pendingShippingMethod : (selectedOrderDetail.shippingMethod || 'UPS Ground')}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === (selectedOrderDetail.shippingMethod || 'UPS Ground')) {
                                  setPendingShippingMethod(null);
                                } else {
                                  setPendingShippingMethod(val);
                                }
                              }}
                              className={`mt-1 block w-36 text-xs font-semibold text-slate-700 bg-white border rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer h-7 transition ${
                                pendingShippingMethod !== null ? 'border-amber-400 ring-1 ring-amber-100 bg-amber-50/10' : 'border-slate-200 hover:border-slate-350'
                              }`}
                            >
                              <option value="UPS Ground">UPS Ground</option>
                              <option value="FedEx Express">FedEx Express</option>
                              <option value="DHL Worldwide">DHL Worldwide</option>
                              <option value="USPS Priority">USPS Priority</option>
                            </select>
                            {pendingShippingMethod !== null && (
                              <div className="absolute left-0 right-0 top-full mt-2 z-[60] w-56 bg-white border border-slate-200 text-slate-800 rounded-xl shadow-xl p-3 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                                <div className="absolute -top-1 left-6 w-2.5 h-2.5 bg-white border-t border-l border-slate-200 rotate-45" />
                                <p className="text-[11px] font-medium text-slate-700 leading-normal font-sans">
                                  Change shipping method to <span className="font-bold text-brand-600">{pendingShippingMethod}</span>?
                                </p>
                                <div className="flex gap-2 justify-end mt-2.5">
                                  <button
                                    type="button"
                                    onClick={() => setPendingShippingMethod(null)}
                                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 font-bold rounded text-[10px] cursor-pointer transition focus:outline-none"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newMethod = pendingShippingMethod;
                                      const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                                      const newAct = {
                                        id: `act_${Date.now()}`,
                                        date: nowStr,
                                        action: `Shipping method updated to ${newMethod}`,
                                        performedBy: 'Hiep Admin'
                                      };

                                      setOrders(prev => prev.map(o => {
                                        if (o.id === selectedOrderDetail.id) {
                                          return { 
                                            ...o, 
                                            shippingMethod: newMethod,
                                            activityHistory: [newAct, ...(o.activityHistory || [])]
                                          };
                                        }
                                        return o;
                                      }));

                                      setSelectedOrderDetail(prev => prev ? { 
                                        ...prev, 
                                        shippingMethod: newMethod,
                                        activityHistory: [newAct, ...(prev.activityHistory || [])]
                                      } : null);

                                      triggerToast(`Shipping method updated to ${newMethod}`, 'success');
                                      setPendingShippingMethod(null);
                                    }}
                                    className="px-2 py-0.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded text-[10px] cursor-pointer transition focus:outline-none"
                                  >
                                    Confirm
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="relative">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">Order Status</span>
                            <select
                              value={pendingOrderStatus !== null ? pendingOrderStatus : (selectedOrderDetail.orderStatus || 'New')}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === (selectedOrderDetail.orderStatus || 'New')) {
                                  setPendingOrderStatus(null);
                                } else {
                                  setPendingOrderStatus(val);
                                }
                              }}
                              className={`mt-1 block w-36 text-xs font-semibold text-slate-700 bg-white border rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-brand-500 cursor-pointer h-7 transition ${
                                pendingOrderStatus !== null ? 'border-amber-400 ring-1 ring-amber-100 bg-amber-50/10' : 'border-slate-200 hover:border-slate-350'
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="Prepared">Prepared</option>
                              <option value="Shipped">Shipped</option>
                            </select>
                            {pendingOrderStatus !== null && (
                              <div className="absolute left-0 right-0 top-full mt-2 z-[60] w-56 bg-white border border-slate-200 text-slate-800 rounded-xl shadow-xl p-3 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                                <div className="absolute -top-1 left-6 w-2.5 h-2.5 bg-white border-t border-l border-slate-200 rotate-45" />
                                <p className="text-[11px] font-medium text-slate-700 leading-normal font-sans">
                                  Change order status to <span className="font-bold text-brand-600">{pendingOrderStatus}</span>?
                                </p>
                                <div className="flex gap-2 justify-end mt-2.5">
                                  <button
                                    type="button"
                                    onClick={() => setPendingOrderStatus(null)}
                                    className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 font-bold rounded text-[10px] cursor-pointer transition focus:outline-none"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newStatus = pendingOrderStatus;
                                      handleUpdateOrderStatus(selectedOrderDetail.id, newStatus);
                                      triggerToast(`Order status updated to ${newStatus}`, 'success');
                                      setPendingOrderStatus(null);
                                    }}
                                    className="px-2 py-0.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded text-[10px] cursor-pointer transition focus:outline-none"
                                  >
                                    Confirm
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">Total Quantity</span>
                            <span className="text-sm font-semibold text-slate-800 mt-1 block font-mono">{selectedOrderDetail.quantity}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">Tracking Number</span>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-sm font-semibold font-mono text-slate-800 select-all block">
                                {selectedOrderDetail.trackingNumber || 'Awaiting Shipment'}
                              </span>
                              {selectedOrderDetail.trackingNumber && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(selectedOrderDetail.trackingNumber || '');
                                    triggerToast('Tracking number copied!', 'success');
                                  }}
                                  className="p-1 text-slate-400 hover:text-slate-650 rounded transition hover:bg-slate-50 cursor-pointer inline-flex focus:outline-none animate-in fade-in"
                                  title="Copy Tracking Number"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Addresses row (Bottom part) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                          {/* Return Address */}
                          <div className="p-4 space-y-2">
                            <h4 className="text-xs font-bold text-slate-800 tracking-wide uppercase font-sans">Return Address</h4>
                            <div className="text-xs text-slate-600 space-y-0.5 font-sans leading-relaxed">
                              <p className="font-bold text-slate-800 text-sm">
                                {selectedOrderDetail.returnAddress?.name || 'mytest'}
                              </p>
                              <p>{selectedOrderDetail.returnAddress?.companyLine || 'Company_address-1'}</p>
                              <p>{selectedOrderDetail.returnAddress?.addressLine || '715 Broadway2313, United States,'}</p>
                              <p>{selectedOrderDetail.returnAddress?.cityStateZip || 'NY, 20912, US'}</p>
                            </div>
                          </div>

                           {/* Ship Address */}
                           <div className="p-4 space-y-2">
                             <div className="flex items-center justify-between font-sans">
                               <h4 className="text-xs font-bold text-slate-800 tracking-wide uppercase">Ship Address</h4>
                               {!isEditingShipAddress ? (
                                 <button
                                   type="button"
                                   onClick={() => {
                                     const sAddr = selectedOrderDetail.shipAddress || {
                                       name: 'Auo Tivi',
                                       companyLine: '123',
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
                                   className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition cursor-pointer"
                                 >
                                   Edit
                                 </button>
                               ) : (
                                 <div className="flex items-center gap-2">
                                   <button
                                     type="button"
                                     onClick={() => setIsEditingShipAddress(false)}
                                     className="text-xs font-medium text-slate-500 hover:text-slate-700 transition cursor-pointer"
                                   >
                                     Cancel
                                   </button>
                                   <span className="text-slate-300 text-xs">|</span>
                                   <button
                                     type="button"
                                     onClick={handleSaveShipAddress}
                                     className="text-xs font-bold text-brand-600 hover:text-brand-700 transition cursor-pointer"
                                   >
                                     Save
                                   </button>
                                 </div>
                               )}
                             </div>
 
                             {!isEditingShipAddress ? (
                               <div className="text-xs text-slate-600 space-y-0.5 font-sans leading-relaxed">
                                 <p className="font-bold text-slate-800 text-sm">
                                   {selectedOrderDetail.shipAddress?.name || 'Auo Tivi'}
                                 </p>
                                 {selectedOrderDetail.shipAddress?.companyLine ? (
                                   <p>{selectedOrderDetail.shipAddress.companyLine}</p>
                                 ) : null}
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
                                 {selectedOrderDetail.shipAddress?.email ? (
                                   <p>{selectedOrderDetail.shipAddress.email}</p>
                                 ) : null}
                               </div>
                             ) : (
                               <div className="space-y-4 pt-1 font-sans">
                                 {isPasteAddressOpen ? (
                                   <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 space-y-2">
                                     <h5 className="text-xs font-bold text-blue-800">Paste Full US Address Block</h5>
                                     <textarea
                                       value={rawAddressToPaste}
                                       onChange={(e) => setRawAddressToPaste(e.target.value)}
                                       placeholder="Example:&#10;Auo Tivi&#10;123&#10;3002 WOLF LAKE BLVD&#10;NEW ALBANY, IN 80201&#10;United States&#10;Phone: 9734508586"
                                       className="w-full h-24 p-2 bg-white border border-blue-200 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                                     />
                                     <div className="flex justify-end gap-2 text-[10px]">
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
                                     <span className="text-[11px] text-slate-500">Need to copy-paste the whole address?</span>
                                     <button
                                       type="button"
                                       onClick={() => setIsPasteAddressOpen(true)}
                                       className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                                     >
                                       Paste US Address
                                     </button>
                                   </div>
                                 )}

                                 <div className="space-y-3">
                                   {/* Name Row */}
                                   <div className="flex items-center gap-3">
                                     <label className="w-16 text-[11px] font-semibold text-slate-705 shrink-0">Name <span className="text-red-500">*</span></label>
                                     <input
                                       type="text"
                                       value={shipName}
                                       onChange={(e) => setShipName(e.target.value)}
                                       className="flex-1 text-xs text-slate-700 bg-white border border-slate-200 rounded-[4px] px-2.5 py-1 focus:outline-none focus:border-blue-500 h-8"
                                       placeholder="Name"
                                     />
                                   </div>

                                   {/* Company Row */}
                                   <div className="flex items-center gap-3">
                                     <label className="w-16 text-[11px] font-semibold text-slate-705 shrink-0">Company</label>
                                     <input
                                       type="text"
                                       value={shipCompanyLine}
                                       onChange={(e) => setShipCompanyLine(e.target.value)}
                                       className="flex-1 text-xs text-slate-700 bg-white border border-slate-200 rounded-[4px] px-2.5 py-1 focus:outline-none focus:border-blue-500 h-8"
                                       placeholder="Company Name"
                                     />
                                   </div>

                                   {/* Country Row */}
                                   <div className="flex items-center gap-3">
                                     <label className="w-16 text-[11px] font-semibold text-slate-705 shrink-0">Country <span className="text-red-500">*</span></label>
                                     <input
                                       type="text"
                                       value={shipCountry}
                                       onChange={(e) => setShipCountry(e.target.value)}
                                       className="flex-1 text-xs text-slate-700 bg-white border border-slate-200 rounded-[4px] px-2.5 py-1 focus:outline-none focus:border-blue-500 h-8"
                                       placeholder="Country"
                                     />
                                   </div>

                                   {/* Address Row */}
                                   <div className="flex items-start gap-3">
                                     <label className="w-16 text-[11px] font-semibold text-slate-705 shrink-0 mt-1.5 animate-pulse-none">Address <span className="text-red-500">*</span></label>
                                     <div className="flex-1 space-y-1.5 animate-pulse-none">
                                       <input
                                         type="text"
                                         value={shipAddressLine}
                                         onChange={(e) => setShipAddressLine(e.target.value)}
                                         className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-[4px] px-2.5 py-1 focus:outline-none focus:border-blue-500 h-8"
                                         placeholder="Street Address"
                                       />
                                       <input
                                         type="text"
                                         value={shipAddress2}
                                         onChange={(e) => setShipAddress2(e.target.value)}
                                         className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-[4px] px-2.5 py-1 focus:outline-none focus:border-blue-500 h-8"
                                         placeholder="Address2"
                                       />
                                     </div>
                                   </div>

                                   {/* City Row */}
                                   <div className="flex items-center gap-3">
                                     <label className="w-16 text-[11px] font-semibold text-slate-705 shrink-0">City <span className="text-red-500">*</span></label>
                                     <input
                                       type="text"
                                       value={shipCity}
                                       onChange={(e) => setShipCity(e.target.value)}
                                       className="flex-1 text-xs text-slate-700 bg-white border border-slate-200 rounded-[4px] px-2.5 py-1 focus:outline-none focus:border-blue-500 h-8"
                                       placeholder="City"
                                     />
                                   </div>

                                   {/* State & Zip Row */}
                                   <div className="flex items-center gap-3">
                                     <label className="w-16 text-[11px] font-semibold text-slate-705 shrink-0">State</label>
                                     <div className="flex-1 flex gap-2">
                                       <select
                                         value={shipState}
                                         onChange={(e) => setShipState(e.target.value)}
                                         className="w-1/2 text-xs text-slate-700 bg-white border border-slate-200 rounded-[4px] px-1.5 py-1 h-8 focus:outline-none focus:border-blue-500 cursor-pointer"
                                       >
                                         <option value="">Select state</option>
                                         {US_STATES.map((stateOption) => (
                                           <option key={stateOption.code} value={stateOption.name}>
                                             {stateOption.name}
                                           </option>
                                         ))}
                                       </select>
                                       
                                       <div className="w-1/2 flex items-center gap-1.5">
                                         <label className="text-[11px] font-semibold text-slate-705 shrink-0">Zip code <span className="text-red-500">*</span></label>
                                         <input
                                           type="text"
                                           value={shipZip}
                                           onChange={(e) => setShipZip(e.target.value)}
                                           className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-[4px] px-2 py-1 h-8 focus:outline-none focus:border-blue-500 text-center"
                                           placeholder="ZIP"
                                         />
                                       </div>
                                     </div>
                                   </div>

                                   {/* Phone Row */}
                                   <div className="flex items-center gap-3">
                                     <label className="w-16 text-[11px] font-semibold text-slate-705 shrink-0">Phone</label>
                                     <input
                                       type="text"
                                       value={shipPhone}
                                       onChange={(e) => setShipPhone(e.target.value)}
                                       className="flex-1 text-xs text-slate-700 bg-white border border-slate-200 rounded-[4px] px-2.5 py-1 focus:outline-none focus:border-blue-500 h-8"
                                       placeholder="Phone Number"
                                     />
                                   </div>

                                   {/* Email Row */}
                                   <div className="flex items-center gap-3">
                                     <label className="w-16 text-[11px] font-semibold text-slate-705 shrink-0">Email</label>
                                     <input
                                       type="text"
                                       value={shipEmail}
                                       onChange={(e) => setShipEmail(e.target.value)}
                                       className="flex-1 text-xs text-slate-700 bg-white border border-slate-200 rounded-[4px] px-2.5 py-1 focus:outline-none focus:border-blue-500 h-8"
                                       placeholder="Email"
                                     />
                                   </div>
                                 </div>

                                 <div className="flex justify-end pt-1">
                                   <button
                                     type="button"
                                     onClick={handleSaveShipAddress}
                                     className="px-4 py-1.5 bg-blue-600 hover:bg-blue-750 text-white font-bold rounded text-xs cursor-pointer transition focus:outline-none shadow-xs uppercase tracking-wider text-[10px]"
                                   >
                                     Save
                                   </button>
                                 </div>
                               </div>
                             )}
                           </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Table section */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-705 uppercase tracking-widest">Order Items</h4>
                      <div className="border border-slate-200/60 rounded-xl overflow-hidden shadow-xs">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100 select-none">
                            <tr>
                              <th className="py-2.5 px-4 font-sans justify-start text-left">Product Name</th>
                              <th className="py-2.5 px-4 font-sans justify-start text-left">Style / Color / Size</th>
                              <th className="py-2.5 px-4 font-sans justify-start text-left">SKU</th>
                              <th className="py-2.5 px-4 font-sans text-right">Qty</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
                             {selectedOrderDetail.orderItems && selectedOrderDetail.orderItems.length > 0 ? (
                               selectedOrderDetail.orderItems.map((item, index) => (
                                 <tr key={index} className="hover:bg-slate-50/20">
                                   <td className="py-2 px-4 font-semibold text-slate-800">
                                     <div className="flex items-center gap-3">
                                       <div 
                                         className="relative shrink-0 cursor-zoom-in group/thumb"
                                         onMouseEnter={(e) => {
                                           const rect = e.currentTarget.getBoundingClientRect();
                                           const imgUrl = getProductItemImage(item.sku, item.productName, item.styleColor);
                                           setHoveredProductImage({
                                             url: imgUrl,
                                             x: rect.right + 12,
                                             y: rect.top - 80
                                           });
                                         }}
                                         onMouseMove={(e) => {
                                           const rect = e.currentTarget.getBoundingClientRect();
                                           const imgUrl = getProductItemImage(item.sku, item.productName, item.styleColor);
                                           setHoveredProductImage({
                                             url: imgUrl,
                                             x: rect.right + 12,
                                             y: rect.top - 80
                                           });
                                         }}
                                         onMouseLeave={() => setHoveredProductImage(null)}
                                       >
                                         <img
                                           src={getProductItemImage(item.sku, item.productName, item.styleColor)}
                                           alt={item.productName}
                                           className="h-10 w-10 object-cover rounded-lg border border-slate-200 shadow-3xs bg-slate-50 transition hover:scale-105 active:scale-95"
                                           referrerPolicy="no-referrer"
                                         />
                                       </div>
                                       <span className="text-slate-800 font-sans text-xs font-semibold leading-tight">{item.productName}</span>
                                     </div>
                                   </td>
                                   <td className="py-2 px-4 text-xs font-mono font-medium text-slate-600">{item.styleColor}</td>
                                   <td className="py-2 px-4 text-xs font-mono font-medium text-slate-600">{item.sku}</td>
                                   <td className="py-2 px-4 text-right text-xs font-mono font-medium text-slate-600">{item.quantity}</td>
                                 </tr>
                               ))
                             ) : (
                               <tr>
                                 <td className="py-2 px-4 font-semibold text-slate-800">
                                   <div className="flex items-center gap-3">
                                     <div 
                                       className="relative shrink-0 cursor-zoom-in group/thumb"
                                       onMouseEnter={(e) => {
                                         const rect = e.currentTarget.getBoundingClientRect();
                                         const imgUrl = getProductItemImage('APP-CRW-002', 'Classic Crewneck Apparel', 'Charcoal / M');
                                         setHoveredProductImage({
                                           url: imgUrl,
                                           x: rect.right + 12,
                                           y: rect.top - 80
                                         });
                                       }}
                                       onMouseMove={(e) => {
                                         const rect = e.currentTarget.getBoundingClientRect();
                                         const imgUrl = getProductItemImage('APP-CRW-002', 'Classic Crewneck Apparel', 'Charcoal / M');
                                         setHoveredProductImage({
                                           url: imgUrl,
                                           x: rect.right + 12,
                                           y: rect.top - 80
                                         });
                                       }}
                                       onMouseLeave={() => setHoveredProductImage(null)}
                                     >
                                       <img
                                         src={getProductItemImage('APP-CRW-002', 'Classic Crewneck Apparel', 'Charcoal / M')}
                                         alt="Classic Crewneck Apparel"
                                         className="h-10 w-10 object-cover rounded-lg border border-slate-200 shadow-3xs bg-slate-50 transition hover:scale-105 active:scale-95"
                                         referrerPolicy="no-referrer"
                                       />
                                     </div>
                                     <span className="text-slate-800 font-sans text-xs font-semibold leading-tight">Classic Crewneck Apparel</span>
                                   </div>
                                 </td>
                                 <td className="py-2 px-4 text-xs font-mono font-medium text-slate-600">Charcoal / M</td>
                                 <td className="py-2 px-4 text-xs font-mono font-medium text-slate-600">APP-CRW-002</td>
                                 <td className="py-2 px-4 text-right text-xs font-mono font-medium text-slate-600">{selectedOrderDetail.quantity}</td>
                               </tr>
                             )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>

                  {/* Right Column (1/3 width on md+): Internal Notes & Timeline */}
                  <div className="border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6 flex flex-col h-full self-stretch min-h-0">

                    {/* Timeline & Notes section — Boxed/Framed */}
                    <div className="border border-slate-200 rounded-xl bg-slate-50/50 p-4 space-y-3 flex flex-col min-h-0">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest shrink-0">Timeline & Notes</h4>

                      {/* Unified Notes Input */}
                      <div className="shrink-0 w-full animate-in fade-in duration-200">
                        <textarea
                          value={orderCommentText}
                          onChange={(e) => setOrderCommentText(e.target.value)}
                          placeholder="Comment & press Enter to save..."
                          rows={2}
                          className="w-full text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition bg-white border border-slate-200 rounded-lg px-3 py-2 resize-none"
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
                      </div>

                      <div className="overflow-y-auto max-h-[140px] scrollbar-thin pl-0 pr-1 flex-1">
                        <div className="relative border-l-2 border-slate-100 ml-2 pl-3.5 space-y-4 py-1">
                          {selectedOrderDetail.activityHistory && selectedOrderDetail.activityHistory.length > 0 ? (
                            selectedOrderDetail.activityHistory.map((act) => (
                              <div key={act.id} className="relative animate-in fade-in slide-in-from-top-1 duration-150">
                                {/* Dot icon */}
                                <span className="absolute -left-[20px] top-[3px] h-3 w-3 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center">
                                  <span className="h-1 w-1 rounded-full bg-slate-350" />
                                </span>
                                <div>
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-xs font-normal text-slate-800">{act.action}</span>
                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5 font-sans">
                                      <span className="font-semibold text-slate-500">{act.performedBy}</span>
                                      <span>•</span>
                                      <span>{act.date}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="relative">
                              <span className="absolute -left-[20px] top-[3px] h-3 w-3 rounded-full border-2 border-brand-500 bg-white flex items-center justify-center">
                                <span className="h-1 w-1 rounded-full bg-brand-500" />
                              </span>
                              <div>
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-xs font-normal text-slate-800">Order Registered</span>
                                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5 font-sans">
                                    <span className="font-semibold text-slate-500">Client Integration API</span>
                                    <span>•</span>
                                    <span>{selectedOrderDetail.orderDate}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                     {/* Shipment Information section (High-Fidelity Shipping Label with Barcode, and Void button with custom popup) */}
                    {selectedOrderDetail.shipmentInfo ? (
                      <div className="space-y-4 mt-4 text-left font-sans flex flex-col items-stretch w-full">
                        
                        {/* Premium Royal Solid Shipment Status Card - High Legibility (Deep Blue Gradient) */}
                        <div className="w-full bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 rounded-2xl shadow-lg border border-indigo-500/35 p-5 text-white overflow-hidden animate-in fade-in duration-300">
                          {/* Card Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-white/10 select-none">
                            <span className="font-extrabold text-white tracking-tight text-xs md:text-sm">Shipment 1 - #8243790</span>
                            <div className="flex items-center gap-2.5">
                              <button
                                type="button"
                                onClick={() => setIsShipmentDetailsModalOpen(true)}
                                className="text-xs font-bold text-indigo-150 hover:text-white transition duration-150 uppercase tracking-widest cursor-pointer hover:underline underline-offset-2 flex items-center gap-1"
                                title="Click to view all selected shipping label details"
                              >
                                <Eye className="h-3 w-3 inline-block" />
                                <span>Details</span>
                              </button>
                              <span className="text-white/20 select-none">|</span>
                              <button
                                type="button"
                                onClick={() => setIsVoidConfirmOpen(true)}
                                className="text-xs font-bold text-rose-300 hover:text-rose-200 transition duration-150 uppercase tracking-widest cursor-pointer hover:underline underline-offset-2"
                              >
                                Void
                              </button>
                            </div>
                          </div>

                          {/* Info Fields Grid */}
                          <div className="grid grid-cols-[85px_1fr] gap-y-2.5 text-xs font-sans mt-3.5 leading-relaxed">
                            <div className="text-blue-100/70 font-semibold uppercase tracking-wider text-[10px]">Tracking:</div>
                            <div className="text-white font-mono font-bold select-all tracking-wide text-xs">{selectedOrderDetail.shipmentInfo.trackingNumber || '1LSDBVU000ZLLNI'}</div>

                            <div className="text-blue-100/70 font-semibold uppercase tracking-wider text-[10px]">Status:</div>
                            <div>
                              <span className="inline-flex items-center gap-1.5 text-yellow-300 font-extrabold tracking-wide text-xs">
                                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
                                Unknown
                              </span>
                            </div>

                            <div className="text-blue-100/70 font-semibold uppercase tracking-wider text-[10px]">Service:</div>
                            <div className="text-white font-extrabold uppercase select-none tracking-tight">{selectedOrderDetail.shipmentInfo.service || selectedOrderDetail.shipmentInfo.shippingMethod || 'GRND'}</div>

                            <div className="text-blue-100/70 font-semibold uppercase tracking-wider text-[10px]">D/W:</div>
                            <div className="text-white font-semibold font-mono">{selectedOrderDetail.shipmentInfo.size ? `(${selectedOrderDetail.shipmentInfo.size})` : '(12.00x3.00x15.00) in'} / {selectedOrderDetail.shipmentInfo.weight || '47.72 oz'}</div>

                            <div className="text-blue-100/70 font-semibold uppercase tracking-wider text-[10px]">Price:</div>
                            <div className="text-white font-black text-sm tracking-tight">{selectedOrderDetail.shipmentInfo.price || '$7.21'}</div>
                          </div>

                          {/* Number of Items: Horizontal row separated at the bottom (clickable to open items detail modal) */}
                          <div 
                            onClick={() => setIsShipmentItemsModalOpen(true)}
                            className="border-t border-white/10 pt-3.5 mt-3.5 flex items-center justify-between cursor-pointer hover:bg-white/10 p-1.5 -mx-1.5 rounded-lg transition duration-150 group"
                            title="Click to view items list"
                          >
                            <span className="text-[10px] font-semibold text-blue-100/70 uppercase tracking-widest group-hover:text-white transition">Number of items</span>
                            <span className="text-sm font-black font-mono bg-white/15 px-2.5 py-0.5 rounded text-center text-white group-hover:bg-white/25 transition">
                              {selectedOrderDetail.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || selectedOrderDetail.quantity}
                            </span>
                          </div>
                        </div>

                        {/* Print only action below status card, physical sticker image has been completely removed to make it fit beautifully */}
                        <div className="w-full">
                          <button
                            type="button"
                            onClick={() => {
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
                                          letter-spacing: -1px;
                                        }
                                        .section {
                                          border-top: 1.5px solid #000;
                                          padding-top: 6px;
                                          font-size: 11px;
                                          line-height: 1.35;
                                        }
                                        .section-title {
                                          font-weight: 905;
                                          font-size: 9px;
                                          text-transform: uppercase;
                                          letter-spacing: 0.5px;
                                          display: block;
                                          margin-bottom: 2px;
                                        }
                                        .barcode {
                                          margin-top: 15px;
                                          text-align: center;
                                        }
                                        .barcode-lines {
                                          height: 65px;
                                          background-color: #000;
                                          background-image: repeating-linear-gradient(90deg, #fff, #fff 1.5px, #000 1.5px, #000 5.5px);
                                          margin: 6px 0;
                                        }
                                        .barcode-text {
                                          font-family: monospace;
                                          font-size: 11px;
                                          font-weight: bold;
                                          letter-spacing: 1px;
                                        }
                                      </style>
                                    </head>
                                    <body>
                                      <div class="label-card">
                                        <div class="header">
                                          ${selectedOrderDetail.shipmentInfo?.carrier || 'UPS'} GROUND
                                        </div>
                                        <div class="section">
                                          <span class="section-title">SHIP FROM:</span>
                                          <strong>${selectedOrderDetail.shipmentInfo?.senderDetails?.name || 'SwiftPOD LLC'}</strong><br/>
                                          ${selectedOrderDetail.shipmentInfo?.senderDetails?.company || 'Main Depot Terminal'}<br/>
                                          ${selectedOrderDetail.shipmentInfo?.senderDetails?.address || '2070 S 7th St. Ste E, San Jose, CA 95112'}
                                        </div>
                                        <div class="section">
                                          <span class="section-title">SHIP TO:</span>
                                          <strong>${selectedOrderDetail.shipmentInfo?.recipientDetails?.firstName || selectedOrderDetail.shipAddress?.name || 'Auo Tivi'} ${selectedOrderDetail.shipmentInfo?.recipientDetails?.lastName || ''}</strong><br/>
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
                                triggerToast('Popup blocked! Please allow popups to launch print jobs.', 'info');
                              }
                            }}
                            className="w-full py-2 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold cursor-pointer transition duration-150 text-center font-sans tracking-wide shadow-xs flex items-center justify-center gap-1.5 h-9"
                          >
                            <Printer className="h-3.5 w-3.5" />
                            <span>Print Label</span>
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {/* Action Button - Create Shipping Label */}
                    {!selectedOrderDetail.shipmentInfo && (
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setLabelFormOrderNo(selectedOrderDetail.orderNumber || '');
                            setLabelFormClient(selectedOrderDetail.customerStore || 'Olivia Rhye Store');
                            setLabelFormCurrency('USD');
                            setLabelFormFirstName(selectedOrderDetail.customerStore?.split(' ')[0] || 'Olivia');
                            setLabelFormLastName(selectedOrderDetail.customerStore?.split(' ').slice(1).join(' ') || 'Rhye');
                            setLabelFormCompany(selectedOrderDetail.customerStore || 'Acme Corp');
                            setLabelFormEmail(`${selectedOrderDetail.customerStore?.toLowerCase().replace(/\s+/g, '') || 'customer'}@example.com`);
                            setLabelFormPhone('555-019-2834');
                            
                            // Initialize sender details to Warehouse A
                            setSelectedWarehouseForLabel('Warehouse A');
                            setSenderFirstName('Hiep');
                            setSenderLastName('Admin');
                            setSenderCompany('SwiftPOD LLC - Warehouse A');
                            setSenderEmail('warehouse-a@swiftpod.live');
                            setSenderPhone('408-555-0199');
                            setSenderCountry('United States');
                            setSenderAddress1('2070 S 7th St. Ste E');
                            setSenderAddress2('');
                            setSenderCity('San Jose');
                            setSenderZip('95112');

                            const isIntl = selectedOrderDetail.destinationType === 'International' || selectedOrderDetail.destination?.toLowerCase().includes('tokyo');
                            setLabelFormCountry(isIntl ? 'Japan' : 'United States');
                            setLabelFormDestinationType(isIntl ? 'International' : 'Domestic');
                            setLabelFormHsCode('');
                            setLabelFormAddress1(selectedOrderDetail.destination || '2070 S 7th St. Ste E');
                            setLabelFormAddress2('');
                            setLabelFormCity(isIntl ? 'Tokyo' : 'San Jose');
                            setLabelFormZip(isIntl ? '100-0001' : '95112');

                            const itemsDesc = selectedOrderDetail.orderItems && selectedOrderDetail.orderItems.length > 0 
                              ? selectedOrderDetail.orderItems.map(it => `${it.productName || 'Premium Organic Tee'} (${it.quantity}pcs)`).join(', ')
                              : 'Premium Organic Tee';
                            setLabelFormCustomsRefId('REF-' + selectedOrderDetail.orderNumber + '-01');
                            setLabelFormCustomsCountry(isIntl ? 'Japan' : 'United States');
                            setLabelFormCustomsHsCode('6109.10');
                            setLabelFormCustomsNetWeight('6.2');
                            setLabelFormCustomsPrice('14.50');
                            setLabelFormCustomsQty('1');
                            setLabelFormCustomsDesc(itemsDesc);
                            setIsCustomsFormCollapsed(false);
                            setIsCustomsFormActive(true);
                            
                            // Initialize package
                            setLabelFormGetRateClicked(false);
                            setLabelFormLoadingRates(false);
                            setLabelFormSelectedRateIndex(-1);
                            setLabelFormCarrierPackage('Package');

                            const qtys: Record<string, number> = {};
                            if (selectedOrderDetail.orderItems && selectedOrderDetail.orderItems.length > 0) {
                              selectedOrderDetail.orderItems.forEach(item => {
                                qtys[item.sku] = item.quantity;
                              });
                            } else {
                              qtys['SKU-G640-BLK-S-01'] = selectedOrderDetail.quantity || 1;
                            }
                            setShipmentItemQuantities(qtys);
                            setCustomShipmentItems([]);

                            setLabelFormPackages([{
                              index: 1,
                              refId: `PKG-${selectedOrderDetail.orderNumber}-${Math.floor(1000 + Math.random() * 9000)}`,
                              savedPkg: 'Custom',
                              weight: '47.92',
                              length: '7.00',
                              width: '5.00',
                              height: '14.00',
                              items: selectedOrderDetail.orderItems?.map(item => `${item.productName} (Qty: ${item.quantity})`) || [`Classic Crewneck Hoodie (Qty: ${selectedOrderDetail.quantity})`]
                            }]);
                            
                            setIsLabelPopupOpen(true);
                          }}
                          className="w-full h-10 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-brand-100"
                        >
                          Create Shipping Label
                        </button>
                      </div>
                    )}

                  </div>

                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs font-semibold uppercase tracking-wide">
                <div className="flex items-center gap-1.5 text-slate-400">
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsOrderDetailOpen(false);
                    setIsRejectingOrder(false);
                    setOrderRejectReasonText('');
                  }}
                  className="px-5 h-9 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-350 rounded-lg inline-flex items-center justify-center font-bold text-xs transition cursor-pointer shadow-xs"
                >
                  Close Detail
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE DIALOG MODAL PORTAL */}
      <CreateModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        activeTab={activeTab}
        types={types}
        styles={styles}
        colors={colors}
        sizes={sizes}
        onCreate={(data) => handleCreate(activeTab, data)} 
      />

      {/* CUSTOM CONFIRM REFUND / VOID SHIPMENT MODAL */}
      <AnimatePresence>
        {isVoidConfirmOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsVoidConfirmOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-150 z-[101] font-sans flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <span className="text-[13px] font-bold text-slate-805 select-none tracking-tight">Confirm Refund</span>
                <button
                  type="button"
                  onClick={() => setIsVoidConfirmOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 select-none text-left">
                <p className="text-[11.5px] text-slate-705 leading-normal font-medium">
                  Do you want to refund order?
                </p>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-2 px-5 py-3 border-t border-slate-50 bg-slate-50/50 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setIsVoidConfirmOpen(false)}
                  className="px-4 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-md transition cursor-pointer flex items-center justify-center font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleVoidShipment}
                  className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition cursor-pointer flex items-center justify-center font-semibold shadow-xs"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {orderToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOrderToDelete(null)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-100 z-[101] p-6 flex flex-col items-center text-center font-sans"
            >
              <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100/50">
                <Trash2 className="h-6 w-6" />
              </div>

              <h2 className="text-base font-bold text-slate-800 leading-tight">Delete Order Confirmation</h2>
              <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                Are you sure you want to delete order <span className="font-bold text-slate-700 font-mono">{orderToDelete.orderNumber}</span>? 
                This action is permanent and will remove all internal tracking reference history associated with store <span className="font-semibold text-slate-700">{orderToDelete.customerStore}</span>.
              </p>

              <div className="flex gap-3 w-full mt-6">
                <button
                  type="button"
                  onClick={() => setOrderToDelete(null)}
                  className="flex-1 h-9 bg-white border border-slate-250 hover:bg-slate-50 hover:border-slate-350 text-slate-700 rounded-lg inline-flex items-center justify-center font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const orderNum = orderToDelete.orderNumber;
                    setOrders(prev => prev.filter(o => o.id !== orderToDelete.id));
                    triggerToast(`Deleted order ${orderNum}`, 'success');
                    if (selectedOrderDetail?.id === orderToDelete.id) {
                      setIsOrderDetailOpen(false);
                    }
                    setOrderToDelete(null);
                  }}
                  className="flex-1 h-9 bg-rose-600 hover:bg-rose-700 text-white rounded-lg inline-flex items-center justify-center font-bold text-xs transition cursor-pointer shadow-sm shadow-rose-100"
                >
                  Delete Order
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE PURCHASE ORDER MODAL PORTAL */}
      <CreatePurchaseOrderModal 
        isOpen={isCreatePOOpen}
        onClose={() => setIsCreatePOOpen(false)}
        onCreate={(newPO) => handleCreatePO(newPO)}
      />

      {/* CREATE INVENTORY ADDITION MODAL PORTAL */}
      <CreateInventoryAdditionModal
        isOpen={isCreateAdditionOpen}
        onClose={() => setIsCreateAdditionOpen(false)}
        onAdd={(newAddition) => handleCreateAddition(newAddition)}
        onDelete={(id) => handleDeleteAddition(id)}
        additions={additions}
      />

      {/* DETAIL VIEW PURCHASE ORDER MODAL PORTAL */}
      <AnimatePresence>
        {selectedPODetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedPODetail(null);
                setIsEditingWroNo(false);
              }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full flex flex-col overflow-hidden border border-slate-100 z-50 text-xs font-sans"
            >
              <div className="px-5 py-5 bg-white border-b border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left duration-200">
                    <h3 className="text-base font-bold text-slate-800 tracking-tight">
                      WRO: <span className="font-mono text-blue-600 select-all font-semibold ml-1">{selectedPODetail.poNumber}</span>
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Created on {selectedPODetail.createdAt} by {selectedPODetail.createdBy}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPODetail(null);
                    setIsEditingWroNo(false);
                  }}
                  className="rounded-full hover:bg-slate-100 p-2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Single Column Layout container */}
              <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Information cards group */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-100/60 p-3 rounded-lg border border-slate-200">
                    <span className="block text-xs font-semibold text-slate-500">Customer</span>
                    <span className="text-sm font-bold text-slate-900 block mt-1.5 text-ellipsis overflow-hidden">{selectedPODetail.customer || 'No customer'}</span>
                  </div>
                  <div className="bg-slate-100/60 p-3 rounded-lg border border-slate-200">
                    <span className="block text-xs font-semibold text-slate-500">Total quantity</span>
                    <span className="text-sm font-bold text-slate-900 block mt-1.5 font-mono">
                      {selectedPODetail.items ? selectedPODetail.items.reduce((sum, item) => sum + item.qty, 0) : 0} items
                    </span>
                  </div>
                  <div className="bg-slate-100/60 p-3 rounded-lg border border-slate-200">
                    <span className="block text-xs font-semibold text-slate-500">Shipping carrier</span>
                    <span className="text-sm font-bold text-slate-900 block mt-1.5 text-ellipsis overflow-hidden">{selectedPODetail.shippingCarrier}</span>
                  </div>
                  <div className="bg-slate-100/60 p-3 rounded-lg border border-slate-200">
                    <span className="block text-xs font-semibold text-slate-500">Status</span>
                    <div className="mt-1.5">
                      {selectedPODetail.orderStatus === 'Pending' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-700 animate-in fade-in zoom-in duration-200">
                          Pending
                        </span>
                      )}
                      {selectedPODetail.orderStatus === 'Received' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 animate-in fade-in zoom-in duration-200">
                          Received
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tracking input visual detail */}
                <div className="p-3 bg-slate-100/60 border border-slate-200 rounded-lg flex items-center justify-between text-xs font-sans animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="text-xs font-semibold text-slate-500">Tracking:</span>
                    <span className="font-mono text-xs font-bold text-slate-800 select-all ml-1">{selectedPODetail.tracking}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyTracking(selectedPODetail.id, selectedPODetail.tracking)}
                    className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 border rounded-md transition cursor-pointer font-medium ${
                      copiedPoId === selectedPODetail.id
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {copiedPoId === selectedPODetail.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Items detail list inside this PO */}
                <div className="space-y-2 animate-in duration-200">
                  <span className="block text-xs font-semibold text-slate-500">
                    Items list
                  </span>
                  
                  <div className="border border-slate-100 rounded-lg overflow-hidden bg-white max-h-[300px] overflow-y-auto shadow-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-550 border-b border-slate-100 font-semibold text-[11px] uppercase tracking-wide select-none">
                          <th className="py-2.5 px-4 font-semibold uppercase">Product info</th>
                          <th className="py-2.5 px-4 font-semibold uppercase">SKU</th>
                          <th className="py-2.5 px-4 font-semibold uppercase text-right">Total Qty</th>
                          <th className="py-2.5 px-4 font-semibold uppercase text-right">Received Qty</th>
                          <th className="py-2.5 px-4 font-semibold uppercase text-right">Incoming Qty</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {selectedPODetail.items && selectedPODetail.items.length > 0 ? (
                          selectedPODetail.items.map((item, id) => {
                            const totalQtyFieldValue = item.qty;
                            const currentRecQty = draftReceivedQtys[item.sku] ?? 0;
                            const currentIncomingQty = Math.max(0, totalQtyFieldValue - currentRecQty);
                            return (
                              <tr key={id} className="hover:bg-slate-50/50">
                                <td className="py-2.5 px-4 font-bold text-slate-800">{item.productInfo}</td>
                                <td className="py-2.5 px-4 text-slate-700 font-mono text-[11px] font-medium">{item.sku}</td>
                                <td className="py-2.5 px-4 text-right font-medium text-slate-705 font-mono">{totalQtyFieldValue}</td>
                                <td className="py-1 px-4 text-right">
                                  <input
                                    type="number"
                                    min={0}
                                    value={currentRecQty}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value);
                                      const safeVal = isNaN(val) ? 0 : Math.max(0, val);
                                      setDraftReceivedQtys(prev => ({
                                        ...prev,
                                        [item.sku]: safeVal
                                      }));
                                    }}
                                    className="w-20 px-2 py-1 text-right border border-slate-200 rounded-lg focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-mono text-xs text-slate-800 bg-white shadow-xs"
                                  />
                                </td>
                                <td className="py-2.5 px-4 text-right font-medium text-slate-705 font-mono">{currentIncomingQty}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={5} className="py-6 text-center text-slate-400">
                              No item details attached.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPODetail(null);
                    setIsEditingWroNo(false);
                  }}
                  className="px-4.5 h-9 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold transition duration-150 cursor-pointer font-sans"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleUpdateWRO}
                  className="px-5.5 h-9 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold hover:shadow-sm active:scale-95 transition cursor-pointer font-sans"
                >
                  Update
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VERIFY WRO CONFIRMATION POPUP MODAL */}
      <AnimatePresence>
        {verifyingPO && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto font-sans">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setVerifyingPO(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-100 z-[60] text-xs"
            >
              <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-slate-800 text-sm">Verify Received Quantity</span>
                <button
                  type="button"
                  onClick={() => setVerifyingPO(null)}
                  className="rounded hover:bg-slate-200 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-left">
                <p className="text-slate-500 text-xs">
                  Please confirm the actual physical quantity received for WRO <strong className="text-slate-800 font-mono text-sm">{verifyingPO.poNumber}</strong>.
                </p>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Total Quantity:</span>
                    <span className="font-mono font-bold text-slate-850 text-sm">{verifyingPO.totalQty} units</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Currently Received:</span>
                    <span className="font-mono font-bold text-slate-600">{verifyingPO.receivedQty} units</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Received quantity</label>
                  <div className="relative rounded-lg shadow-xs">
                    <input
                      type="number"
                      min={0}
                      max={verifyingPO.totalQty}
                      value={verifiedQtyInput}
                      onChange={(e) => {
                        const parsed = parseInt(e.target.value, 10);
                        setVerifiedQtyInput(isNaN(parsed) ? 0 : parsed);
                      }}
                      className="w-full pl-3 pr-[110px] h-10 text-sm border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-mono font-semibold"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <button
                        type="button"
                        onClick={() => setVerifiedQtyInput(0)}
                        className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded transition font-bold uppercase cursor-pointer"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        onClick={() => setVerifiedQtyInput(verifyingPO.totalQty)}
                        className="text-[10px] px-2 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded transition font-bold uppercase cursor-pointer"
                      >
                        Max ({verifyingPO.totalQty})
                      </button>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    If received quantity ({verifiedQtyInput}) equals the total ({verifyingPO.totalQty}), status automatically becomes Received.
                  </p>
                </div>
              </div>

              <div className="px-5 py-4.5 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setVerifyingPO(null)}
                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmVerify}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Confirm Verify
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DEMO RAW INPUT IMPORT DIALOG MODAL */}
      <AnimatePresence>
        {isImportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsImportModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100 z-50"
            >
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="h-4.5 w-4.5 text-brand-600" />
                  <span className="font-semibold text-slate-800">Quick-Import Products</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="rounded hover:bg-slate-200 p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleImportSubmit} className="p-6 space-y-4">
                <div className="text-xs text-slate-500 leading-relaxed">
                  Enter product names (one per line) or paste a JSON array string matching the <strong className="text-brand-600">Product</strong> structure:
                </div>

                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  rows={6}
                  placeholder={`Example lines:\nPremium organic tee\nHiep's custom polo shirt\n\nOr paste JSON array of products...`}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 font-mono placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  required
                />

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsImportModalOpen(false)}
                    className="px-3.5 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 btn-secondary-sheen"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 btn-primary-gradient rounded-lg text-sm font-semibold cursor-pointer"
                  >
                    Run Import
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM DELETE INVENTORY ADDITION MODAL */}
      <AnimatePresence>
        {additionToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAdditionToDelete(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden border border-slate-100 z-50 p-5 text-center"
            >
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-50 text-rose-600 mb-4 animate-bounce">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Confirm Deletion</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Are you sure you want to delete this inventory addition record? This action is permanent and cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-2.5 mt-6 pt-3 border-t border-slate-100 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setAdditionToDelete(null)}
                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (additionToDelete) {
                      handleDeleteAddition(additionToDelete);
                      setAdditionToDelete(null);
                    }
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer transition shadow-xs"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM LOCATION DELETION MODAL */}
      <AnimatePresence>
        {locationToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLocationToDelete(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden border border-slate-100 z-50 p-5 text-center"
            >
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-50 text-rose-600 mb-4 animate-bounce">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Confirm Location Deletion</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Are you sure you want to delete location <strong className="text-slate-800">"{locationToDelete.location}"</strong>? This action is permanent and cannot be undone.
              </p>

              <div className="flex items-center justify-end gap-2.5 mt-6 pt-3 border-t border-slate-100 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setLocationToDelete(null)}
                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteLocation(locationToDelete.id);
                    setLocationToDelete(null);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer transition shadow-xs"
                >
                  Delete Location
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RETURN STOCK TO LOCATION MODAL */}
      <AnimatePresence>
        {selectedLocationForReturn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLocationForReturn(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100 z-50 p-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 animate-pulse">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 leading-tight">Return Stock</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Restock inventory to location</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLocationForReturn(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmReturn} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1 uppercase tracking-wider text-[10px]">Location Target</label>
                  <input
                    type="text"
                    value={`${selectedLocationForReturn.location} (Box ID: ${selectedLocationForReturn.boxId})`}
                    disabled
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-655 rounded-lg font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1 uppercase tracking-wider text-[10px]">Product / Sku Details</label>
                  <input
                    type="text"
                    value={returnProductInfo}
                    onChange={(e) => setReturnProductInfo(e.target.value)}
                    placeholder="e.g. 5000 / BLACK / L"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1 uppercase tracking-wider text-[10px]">Qty to Restock (pcs)</label>
                    <input
                      type="number"
                      min={1}
                      step="1"
                      value={returnQty}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setReturnQty(isNaN(val) ? 1 : Math.max(1, val));
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1 uppercase tracking-wider text-[10px]">Performed By</label>
                    <input
                      type="text"
                      value={returnPerformedBy}
                      onChange={(e) => setReturnPerformedBy(e.target.value)}
                      placeholder="e.g. Tech"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1 uppercase tracking-wider text-[10px]">Reason / Notes</label>
                  <textarea
                    value={returnNotes}
                    onChange={(e) => setReturnNotes(e.target.value)}
                    placeholder="e.g. Restocked excess client sample"
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 font-bold">
                  <button
                    type="button"
                    onClick={() => setSelectedLocationForReturn(null)}
                    className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg cursor-pointer transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer transition shadow-xs"
                  >
                    Confirm Return
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SINGLE LOCATION HISTORY / DETAILS DRAW */}
      <AnimatePresence>
        {selectedLocationForHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLocationForHistory(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-100 z-50 p-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                    <History className="h-5 w-5 animate-spin-reverse" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 leading-tight">{selectedLocationForHistory.location} History</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Box Associated: {selectedLocationForHistory.boxId}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLocationForHistory(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Timber Timeline Events */}
              <div className="max-h-[350px] overflow-y-auto space-y-4 pr-1 scrollbar-thin">
                {locationHistory.filter(h => h.locationId === selectedLocationForHistory.id).length > 0 ? (
                  locationHistory
                    .filter(h => h.locationId === selectedLocationForHistory.id)
                    .map((evt, idx) => (
                      <div key={evt.id} className="flex gap-3 text-xs">
                        <div className="relative flex flex-col items-center">
                          <div className={`h-7 w-7 rounded-full flex items-center justify-center border shrink-0 ${
                            evt.action === 'Return' 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                              : evt.action === 'Create'
                              ? 'bg-purple-50 border-purple-200 text-purple-600'
                              : evt.action === 'Update'
                              ? 'bg-blue-50 border-blue-200 text-blue-600'
                              : 'bg-amber-50 border-amber-200 text-amber-600'
                          }`}>
                            <Sparkles className="h-3.5 w-3.5" />
                          </div>
                          {idx !== locationHistory.filter(h => h.locationId === selectedLocationForHistory.id).length - 1 && (
                            <div className="w-0.5 bg-slate-100 flex-1 min-h-[20px] mt-1" />
                          )}
                        </div>
                        <div className="flex-1 bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                          <div className="flex items-center justify-between font-semibold mb-1">
                            <span className="text-slate-800">{evt.action} Event</span>
                            <span className="text-[10px] text-slate-400 font-normal">{evt.timestamp}</span>
                          </div>
                          <p className="font-bold text-slate-700 leading-tight font-sans mb-1">{evt.productInfo}</p>
                          <div className="flex items-center justify-between text-slate-500 text-[10px]">
                            <span>Quantity: <strong className="text-slate-800">+{evt.qty} pcs</strong></span>
                            <span>By: <strong className="text-slate-800">{evt.performedBy}</strong></span>
                          </div>
                          {evt.notes && (
                            <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-500 italic">
                              Note: {evt.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="py-12 text-center text-slate-400 font-sans text-xs">
                    No timeline history recorded for this location.
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3.5 mt-4 border-t border-slate-100 font-bold text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedLocationForHistory(null)}
                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-750 rounded-lg cursor-pointer transition font-semibold"
                >
                  Close History
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOTAL COMBINED GLOBAL RECEIVING & RETURN TIMELINE DIALOG */}
      <AnimatePresence>
        {isMainHistoryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMainHistoryOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-100 z-50 p-6 flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <History className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 leading-tight">Master Return & Inventory History</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Complete trace logs across all warehouse points</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMainHistoryOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Table of full systemic logs */}
              <div className="overflow-auto border border-slate-100 rounded-lg flex-1 min-h-0 select-none">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold uppercase tracking-wider text-[10px] sticky top-0 bg-slate-50 z-10">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Date/Time</th>
                      <th className="py-2.5 px-4 font-semibold">Location</th>
                      <th className="py-2.5 px-4 font-semibold">Box Associated</th>
                      <th className="py-2.5 px-4 font-semibold">Action</th>
                      <th className="py-2.5 px-4 font-semibold">Product Info</th>
                      <th className="py-2.5 px-4 text-right font-semibold">Quantity</th>
                      <th className="py-2.5 px-4 font-semibold">Personnel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {locationHistory.map((evt) => (
                      <tr key={evt.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-2.5 px-4 text-slate-400 font-medium font-mono text-[10px]">{evt.timestamp}</td>
                        <td className="py-2.5 px-4 text-slate-800 font-bold font-sans">{evt.locationName}</td>
                        <td className="py-2.5 px-4 font-semibold text-brand-600">{evt.boxId}</td>
                        <td className="py-2.5 px-4">
                          <span className={`inline-flex px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                            evt.action === 'Return' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                              : evt.action === 'Create'
                              ? 'bg-purple-50 text-purple-700 border border-purple-100'
                              : evt.action === 'Update'
                              ? 'bg-blue-50 text-blue-700 border border-blue-100'
                              : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {evt.action}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-700 font-sans">{evt.productInfo}</td>
                        <td className="py-2.5 px-4 text-right font-bold text-slate-900 font-mono">+{evt.qty} pcs</td>
                        <td className="py-2.5 px-4 text-slate-505 font-semibold text-xs">{evt.performedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-3.5 mt-4 border-t border-slate-100 text-xs text-slate-505 font-medium shrink-0">
                <span>Total log count: <strong className="text-slate-800 font-bold">{locationHistory.length} events</strong></span>
                <button
                  type="button"
                  onClick={() => setIsMainHistoryOpen(false)}
                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg cursor-pointer transition font-semibold"
                >
                  Close Logs
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REGISTER NEW LOCATION MODAL */}
      <AnimatePresence>
        {isCreateLocationOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop screen */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateLocationOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Modal box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative bg-white rounded-2xl shadow-xl max-w-xl w-full overflow-visible border border-slate-100 z-50 text-slate-800 outline-none focus:outline-none"
            >
              {/* Header */}
              <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
                <h3 className="font-semibold text-lg text-slate-900 font-sans select-none">Create Location</h3>
                <button
                  type="button"
                  onClick={() => setIsCreateLocationOpen(false)}
                  className="rounded-lg p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer outline-none focus:outline-none focus:ring-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateLocation} className="px-6 py-6 space-y-5">
                {/* Common Employee ID Card block */}
                {locationEmployeeId ? (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="text-[11px] text-emerald-600 font-semibold font-sans mb-1">
                        Have a good day!
                      </p>
                      <h4 className="text-sm font-bold text-slate-800 leading-tight">Hiep Tran</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">Inventory Specialist</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setLocationEmployeeId('');
                        setLocationTempEmpId('');
                      }}
                      className="px-3 h-8 border border-slate-200 hover:bg-slate-100 bg-white text-slate-700 rounded-lg text-xs font-bold transition duration-150 shadow-sm cursor-pointer inline-flex items-center justify-center shrink-0"
                    >
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 flex flex-col justify-center space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                        Employee ID <span className="text-slate-400 font-normal ml-0.5">*</span>
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={locationTempEmpId}
                          onChange={(e) => setLocationTempEmpId(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && locationTempEmpId.trim()) {
                              setLocationEmployeeId(locationTempEmpId);
                            }
                          }}
                          placeholder="Enter Employee ID"
                          className="w-full h-10 px-3.5 border border-slate-200 bg-white rounded-lg text-xs text-slate-800 font-semibold focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (locationTempEmpId.trim()) {
                            setLocationEmployeeId(locationTempEmpId);
                          }
                        }}
                        disabled={!locationTempEmpId.trim()}
                        className="px-4 h-10 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition duration-150 cursor-pointer shadow-sm shrink-0"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[150px_1fr] items-start gap-y-5 gap-x-4">
                  {/* Location name */}
                  <label className="text-sm font-semibold text-slate-650 pt-2 shrink-0">
                    Location name <span className="text-slate-400 font-normal ml-0.5">*</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      required
                      value={newLocName}
                      onChange={(e) => setNewLocName(e.target.value)}
                      placeholder="e.g. Container 105"
                      className="w-full h-10 px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-medium"
                    />
                  </div>

                  {/* Box */}
                  <label className="text-sm font-semibold text-slate-650 pt-2 shrink-0">
                    Box <span className="text-slate-400 font-normal ml-0.5">*</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      required
                      value={newLocBox}
                      onChange={(e) => setNewLocBox(e.target.value)}
                      placeholder="e.g. 195"
                      className="w-full h-10 px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-medium"
                    />
                  </div>

                  {/* Initial Product Qty */}
                  <label className="text-sm font-semibold text-slate-650 pt-2 shrink-0">
                    Initial product qty <span className="text-slate-400 font-normal ml-0.5">*</span>
                  </label>
                  <div>
                    <input
                      type="number"
                      min={0}
                      step="1"
                      required
                      value={newLocProductQty}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setNewLocProductQty(isNaN(val) ? 0 : Math.max(0, val));
                      }}
                      placeholder="e.g. 100"
                      className="w-full h-10 px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-medium"
                    />
                  </div>
                </div>

                {/* Actions Footer row */}
                <div className="pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCreateLocationOpen(false)}
                    className="px-5 h-10 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold cursor-pointer outline-none focus:outline-none focus:ring-0 btn-secondary-sheen"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!locationEmployeeId.trim()}
                    className="px-5 h-10 btn-primary-gradient rounded-lg text-sm font-semibold cursor-pointer outline-none focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none transition-all"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BULK IMPORT LOCATIONS MODAL */}
      <AnimatePresence>
        {isImportLocationOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsImportLocationOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100 z-50 p-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 leading-tight">Bulk Import Locations</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Add multiple locations using CSV style lists</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsImportLocationOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleImportLocations} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-500 font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                    Paste CSV Data Lines
                  </label>
                  <textarea
                    value={importLocationText}
                    onChange={(e) => setImportLocationText(e.target.value)}
                    rows={6}
                    placeholder={`Format: LocationName, BoxID, Qty\n\nExample:\nContainer 112, 18, 450\nContainer 115, 6, 120`}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-mono placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    required
                  />
                  <p className="text-[10px] text-slate-400 font-normal mt-2 leading-relaxed">
                    * Make sure to write exactly one comma between the Location, Box ID, and initial Item Quantity values. Unspecified quantities default to 0.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 font-bold">
                  <button
                    type="button"
                    onClick={() => setIsImportLocationOpen(false)}
                    className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg cursor-pointer transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg cursor-pointer transition shadow-xs"
                  >
                    Run Location Import
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}



        {/* PRINT CONFIRMATION MODAL */}
        {isPrintConfirmModalOpen && printTargetItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrintConfirmModalOpen(false)}
              className="fixed inset-0 bg-slate-900/10"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100 z-50 text-slate-800"
            >
              <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                    <Printer className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 font-sans">Verify & Print PAP WIP</h3>
                    <p className="text-[11px] text-slate-500 font-medium font-sans">Scan labels to authorize physical printing</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPrintConfirmModalOpen(false)}
                  className="rounded-lg p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-5 text-left font-sans">
                {/* Batch stats card */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-205 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Label Batch Key:</span>
                    <strong className="text-slate-900 font-black font-mono">#{printTargetItem.id}</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Product Style:</span>
                    <strong className="text-slate-900 font-black">Style {printTargetItem.style}</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Total Quantity:</span>
                    <strong className="text-slate-900 font-black font-mono">{printTargetItem.quantity} labels</strong>
                  </div>
                </div>

                {(() => {
                  const expectedFirst = printTargetItem.labelIds[0] || `061626-PAP-S-${printTargetItem.id}-1`;
                  const expectedLast = printTargetItem.labelIds[printTargetItem.labelIds.length - 1] || `061626-PAP-S-${printTargetItem.id}-1`;
                  
                  const isFirstValid = firstLabelScanned.trim() === expectedFirst;
                  const isLastValid = lastLabelScanned.trim() === expectedLast;
                  const canConfirm = isFirstValid && isLastValid;

                  return (
                    <div className="space-y-4">
                      {/* First Label Scan Input */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-slate-700">First Label Barcode Scan</label>
                          <button
                            type="button"
                            onClick={() => setFirstLabelScanned(expectedFirst)}
                            className="text-[10px] text-brand-600 hover:text-brand-700 font-bold hover:underline cursor-pointer"
                          >
                            Simulate Scan
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Scan or enter first label barcode..."
                            value={firstLabelScanned}
                            onChange={(e) => setFirstLabelScanned(e.target.value)}
                            className={`w-full h-10 px-3.5 pr-24 text-xs font-mono border rounded-lg focus:outline-none transition ${
                              firstLabelScanned === ''
                                ? 'border-slate-200 focus:border-brand-500'
                                : isFirstValid
                                ? 'border-emerald-550 bg-emerald-50/20 text-emerald-900 focus:border-emerald-600'
                                : 'border-rose-350 bg-rose-50/20 text-rose-900 focus:border-rose-500'
                            }`}
                          />
                          <div className="absolute right-2.5 top-2 flex items-center gap-1.5 select-none pointer-events-none">
                            {firstLabelScanned === '' ? (
                              <span className="text-[10px] bg-slate-100 text-slate-400 font-black px-1.5 py-0.5 rounded uppercase tracking-wide">Empty</span>
                            ) : isFirstValid ? (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide">Valid Match</span>
                            ) : (
                              <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide">Mismatch</span>
                            )}
                          </div>
                        </div>
                        <div className="text-[10.5px] text-slate-400 leading-snug">
                          Expected barcode format: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-slate-600">{expectedFirst}</code>
                        </div>
                      </div>

                      {/* Last Label Scan Input */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold text-slate-700">Last Label Barcode Scan</label>
                          <button
                            type="button"
                            onClick={() => setLastLabelScanned(expectedLast)}
                            className="text-[10px] text-brand-600 hover:text-brand-700 font-bold hover:underline cursor-pointer"
                          >
                            Simulate Scan
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Scan or enter last label barcode..."
                            value={lastLabelScanned}
                            onChange={(e) => setLastLabelScanned(e.target.value)}
                            className={`w-full h-10 px-3.5 pr-24 text-xs font-mono border rounded-lg focus:outline-none transition ${
                              lastLabelScanned === ''
                                ? 'border-slate-200 focus:border-brand-500'
                                : isLastValid
                                ? 'border-emerald-555 bg-emerald-50/20 text-emerald-900 focus:border-emerald-600'
                                : 'border-rose-350 bg-rose-50/20 text-rose-900 focus:border-rose-500'
                            }`}
                          />
                          <div className="absolute right-2.5 top-2 flex items-center gap-1.5 select-none pointer-events-none">
                            {lastLabelScanned === '' ? (
                              <span className="text-[10px] bg-slate-100 text-slate-400 font-black px-1.5 py-0.5 rounded uppercase tracking-wide">Empty</span>
                            ) : isLastValid ? (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide">Valid Match</span>
                            ) : (
                              <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide">Mismatch</span>
                            )}
                          </div>
                        </div>
                        <div className="text-[10.5px] text-slate-400 leading-snug">
                          Expected barcode format: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-slate-600">{expectedLast}</code>
                        </div>
                      </div>

                      {/* Modal Actions */}
                      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 font-bold">
                        <button
                          type="button"
                          onClick={() => {
                            setIsPrintConfirmModalOpen(false);
                            setFirstLabelScanned('');
                            setLastLabelScanned('');
                          }}
                          className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg cursor-pointer transition font-semibold text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={!canConfirm}
                          onClick={() => {
                            // Move from printing queue to history
                            setPapPrintingQueue(prev => prev.filter(q => q.id !== printTargetItem.id));
                            
                            const newHistItem: PAPHistoryItem = {
                              id: printTargetItem.id,
                              createdAt: printTargetItem.createdAt,
                              style: printTargetItem.style,
                              user: printTargetItem.user,
                              empId: printTargetItem.empId,
                              quantity: printTargetItem.quantity,
                              status: 'Completed',
                              printedAt: getYYYYMMDDHHMM(),
                              labelIds: printTargetItem.labelIds,
                              color: printTargetItem.color,
                              size: printTargetItem.size,
                              tags: printTargetItem.tags
                            };

                            setPapHistory(prev => [newHistItem, ...prev]);
                            setPapPrintedToday(prev => prev + printTargetItem.quantity);
                            setIsPrintConfirmModalOpen(false);
                            setFirstLabelScanned('');
                            setLastLabelScanned('');
                            triggerToast(`Thermal printing process triggered for WIP Batch #${printTargetItem.id}!`, 'success');
                          }}
                          className={`px-5 py-2 font-bold rounded-lg transition shadow-xs text-xs ${
                            canConfirm
                              ? 'bg-brand-600 hover:bg-brand-700 text-white cursor-pointer'
                              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-80 pointer-events-none'
                          }`}
                        >
                          Confirm & Print
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}

        {/* REPRINT PAP LABELS MODAL */}
        {isReprintModalOpen && reprintTargetItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReprintModalOpen(false)}
              className="fixed inset-0 bg-slate-900/10"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100 z-50 text-slate-800"
            >
              <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-900 font-sans">Reprint Authorization</h3>
                <button
                  type="button"
                  onClick={() => setIsReprintModalOpen(false)}
                  className="rounded-lg p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-5 text-left font-sans">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Reprint Target Batch:</span>
                    <strong className="text-slate-900 font-extrabold font-mono">#{reprintTargetItem.id}</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Style & Qty:</span>
                    <strong className="text-slate-900 font-extrabold">Style {reprintTargetItem.style} (Qty {reprintTargetItem.quantity})</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                  Reprinting labels from the completed history list requires a Shift Leader's signature/scan to proceed.
                </p>

                {/* Team Leader ID Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Shift Leader ID</label>
                    <button
                      type="button"
                      onClick={() => setReprintLeaderId('EMP002')}
                      className="text-[10px] text-brand-600 hover:text-brand-700 font-bold hover:underline cursor-pointer"
                    >
                      Simulate Scan (Sarah)
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Scan or type Leader ID..."
                      value={reprintLeaderId}
                      onChange={(e) => setReprintLeaderId(e.target.value)}
                      className={`w-full h-10 px-3.5 pr-24 text-xs font-mono border rounded-lg focus:outline-none transition ${
                        reprintLeaderId === ''
                          ? 'border-slate-200 focus:border-brand-500'
                          : (reprintLeaderId.toUpperCase().trim() === 'EMP002' || reprintLeaderId.toUpperCase().trim() === 'EMP009')
                          ? 'border-emerald-550 bg-emerald-50/20 text-emerald-900 focus:border-emerald-600'
                          : 'border-rose-350 bg-rose-50/20 text-rose-900 focus:border-rose-500'
                      }`}
                    />
                    <div className="absolute right-2.5 top-2 flex items-center gap-1.5 select-none pointer-events-none">
                      {reprintLeaderId === '' ? (
                        <span className="text-[10px] bg-slate-100 text-slate-400 font-black px-1.5 py-0.5 rounded uppercase tracking-wide">Empty</span>
                      ) : (reprintLeaderId.toUpperCase().trim() === 'EMP002' || reprintLeaderId.toUpperCase().trim() === 'EMP009') ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide font-sans">Valid Lead</span>
                      ) : (
                        <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide font-sans">Mismatch</span>
                      )}
                    </div>
                  </div>
                  <div className="text-[10.5px] text-slate-400">
                    Leader accounts: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-slate-500">EMP002</code> (Sarah Lee) or <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-slate-500">EMP009</code> (David Miller)
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 font-bold text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setIsReprintModalOpen(false);
                      setReprintLeaderId('');
                    }}
                    className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg cursor-pointer transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!(reprintLeaderId.toUpperCase().trim() === 'EMP002' || reprintLeaderId.toUpperCase().trim() === 'EMP009')}
                    onClick={() => {
                      const leadName = getEmployeeName(reprintLeaderId);
                      setIsReprintModalOpen(false);
                      setReprintLeaderId('');
                      triggerToast(`Reprint authorized by shift leader ${leadName}. Labels sent to thermal printer successfully.`, 'success');
                    }}
                    className={`px-5 py-2 font-bold rounded-lg transition shadow-xs ${
                      (reprintLeaderId.toUpperCase().trim() === 'EMP002' || reprintLeaderId.toUpperCase().trim() === 'EMP009')
                        ? 'bg-brand-600 hover:bg-brand-700 text-white cursor-pointer'
                        : 'bg-slate-100 text-slate-400 border border-slate-205 cursor-not-allowed opacity-80 pointer-events-none'
                    }`}
                  >
                    Authorize & Reprint
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* RECONVERT PAP LABELS MODAL */}
        {isReconvertModalOpen && reconvertTargetItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReconvertModalOpen(false)}
              className="fixed inset-0 bg-slate-900/10"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100 z-50 text-slate-800"
            >
              <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
                <h3 className="font-bold text-lg text-slate-900 font-sans">Reconvert Authorization</h3>
                <button
                  type="button"
                  onClick={() => setIsReconvertModalOpen(false)}
                  className="rounded-lg p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-5 text-left font-sans">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Reconvert Target Batch:</span>
                    <strong className="text-slate-900 font-extrabold font-mono">#{reconvertTargetItem.id}</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Action Detail:</span>
                    <strong className="text-rose-600 font-extrabold">Return to active printing queue</strong>
                  </div>
                </div>

                <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                  This action moves the label batch out of History and rolls it back into the active "Printing" queue for editing or physical processing. This process requires Leader authorization.
                </p>

                {/* Team Leader ID Input */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">Shift Leader ID</label>
                    <button
                      type="button"
                      onClick={() => setReconvertLeaderId('EMP002')}
                      className="text-[10px] text-brand-600 hover:text-brand-700 font-bold hover:underline cursor-pointer"
                    >
                      Simulate Scan (Sarah)
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Scan or type Leader ID..."
                      value={reconvertLeaderId}
                      onChange={(e) => setReconvertLeaderId(e.target.value)}
                      className={`w-full h-10 px-3.5 pr-24 text-xs font-mono border rounded-lg focus:outline-none transition ${
                        reconvertLeaderId === ''
                          ? 'border-slate-200 focus:border-brand-500'
                          : (reconvertLeaderId.toUpperCase().trim() === 'EMP002' || reconvertLeaderId.toUpperCase().trim() === 'EMP009')
                          ? 'border-emerald-550 bg-emerald-50/20 text-emerald-900 focus:border-emerald-600'
                          : 'border-rose-350 bg-rose-50/20 text-rose-900 focus:border-rose-500'
                      }`}
                    />
                    <div className="absolute right-2.5 top-2 flex items-center gap-1.5 select-none pointer-events-none">
                      {reconvertLeaderId === '' ? (
                        <span className="text-[10px] bg-slate-100 text-slate-400 font-black px-1.5 py-0.5 rounded uppercase tracking-wide">Empty</span>
                      ) : (reconvertLeaderId.toUpperCase().trim() === 'EMP002' || reconvertLeaderId.toUpperCase().trim() === 'EMP009') ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide font-sans">Valid Lead</span>
                      ) : (
                        <span className="text-[10px] bg-rose-100 text-rose-800 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wide font-sans">Mismatch</span>
                      )}
                    </div>
                  </div>
                  <div className="text-[10.5px] text-slate-400">
                    Leader accounts: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-slate-500">EMP002</code> (Sarah Lee) or <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold text-slate-500">EMP009</code> (David Miller)
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 font-bold text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setIsReconvertModalOpen(false);
                      setReconvertLeaderId('');
                    }}
                    className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg cursor-pointer transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!(reconvertLeaderId.toUpperCase().trim() === 'EMP002' || reconvertLeaderId.toUpperCase().trim() === 'EMP009')}
                    onClick={() => {
                      const leadName = getEmployeeName(reconvertLeaderId);
                      
                      // Roll back from history to active queue
                      setPapHistory(prev => prev.filter(h => h.id !== reconvertTargetItem.id));
                      
                      const restoredQueueItem: PAPPrintingItem = {
                        id: reconvertTargetItem.id,
                        createdAt: reconvertTargetItem.createdAt,
                        style: reconvertTargetItem.style,
                        user: reconvertTargetItem.user,
                        empId: reconvertTargetItem.empId,
                        quantity: reconvertTargetItem.quantity,
                        status: 'Completed',
                        labelIds: reconvertTargetItem.labelIds,
                        color: reconvertTargetItem.color,
                        size: reconvertTargetItem.size,
                        tags: reconvertTargetItem.tags
                      };

                      setPapPrintingQueue(prev => [restoredQueueItem, ...prev]);
                      setPapPrintedToday(prev => Math.max(0, prev - reconvertTargetItem.quantity));
                      setIsReconvertModalOpen(false);
                      setReconvertLeaderId('');
                      triggerToast(`Label batch #${reconvertTargetItem.id} authorized by shift leader ${leadName} and returned to the queue.`, 'success');
                    }}
                    className={`px-5 py-2 font-bold rounded-lg transition shadow-xs ${
                      (reconvertLeaderId.toUpperCase().trim() === 'EMP002' || reconvertLeaderId.toUpperCase().trim() === 'EMP009')
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                        : 'bg-slate-100 text-slate-400 border border-slate-205 cursor-not-allowed opacity-80 pointer-events-none'
                    }`}
                  >
                    Authorize & Reconvert
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SHIPPING LABEL CREATION MODAL */}
      <AnimatePresence>
        {isLabelPopupOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center select-none overflow-hidden">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLabelPopupOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
 
            {/* Elevated Full Width Bottom Sheet content panel */}
            <motion.div
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className={`relative w-full ${showAddressDetails ? 'max-w-7xl' : 'max-w-3xl'} h-[94vh] bg-white rounded-t-2xl shadow-2xl overflow-hidden flex flex-col border-t border-x border-slate-200 z-50 mx-auto font-sans text-xs transition-all duration-300`}
            >
              {/* Sheet Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white select-none">
                <div className="text-left">
                  <h2 className="text-base font-bold text-slate-950">
                    Shipping label
                  </h2>
                  <div className="flex items-center gap-1 mt-0.5">
                    <p className="text-xs text-slate-500 font-medium">Order: #{labelFormOrderNo}</p>
                    {selectedOrderDetail?.insertType && (
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold tracking-tight border ${
                        selectedOrderDetail.insertType === 'Thank You Card'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : selectedOrderDetail.insertType === 'Gift Message'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {selectedOrderDetail.insertType}
                      </span>
                    )}
                  </div>
                </div>

                {/* Header Actions: Print toggle dropdown & Close button */}
                <div className="flex items-center gap-3">
                  {/* Print Selector Dropdown (Shown only when order has an insert) */}
                  {selectedOrderDetail?.insertType && (
                    <div className="relative inline-block text-left">
                      <button
                        type="button"
                        onClick={() => setIsHeaderPrintDropdownOpen(!isHeaderPrintDropdownOpen)}
                        className="h-9 px-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white font-semibold rounded-lg text-xs shadow-2xs transition focus:outline-none cursor-pointer inline-flex items-center gap-1.5 select-none"
                      >
                        <span>Print insert(s)</span>
                        <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                      </button>

                      {isHeaderPrintDropdownOpen && (
                        <div className="absolute right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-[110] text-[10px] animate-in fade-in duration-100 font-sans">
                          <div className="px-3.5 pb-1 mb-1 border-b border-slate-50">
                            <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">Select Insert</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setHeaderPrintSelection('Packing Slip');
                              setIsHeaderPrintDropdownOpen(false);
                              triggerToast('Preparing Packing Slip for print...', 'info');
                              setTimeout(() => {
                                window.print();
                              }, 300);
                            }}
                            className={`w-full text-left px-3.5 py-1.5 hover:bg-slate-50 font-medium flex items-center justify-between cursor-pointer ${headerPrintSelection === 'Packing Slip' ? 'text-brand-600 bg-brand-50/50 font-semibold text-brand-600' : 'text-slate-700'}`}
                          >
                            <span>Packing Slip</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setHeaderPrintSelection('Thank You Card');
                              setIsHeaderPrintDropdownOpen(false);
                              triggerToast('Preparing Thank You Card for print...', 'info');
                              setTimeout(() => {
                                window.print();
                              }, 300);
                            }}
                            className={`w-full text-left px-3.5 py-1.5 hover:bg-slate-50 font-medium flex items-center justify-between cursor-pointer ${headerPrintSelection === 'Thank You Card' ? 'text-brand-600 bg-brand-50/50 font-semibold text-brand-600' : 'text-slate-700'}`}
                          >
                            <span>Thank You Card</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setHeaderPrintSelection('Gift Message');
                              setIsHeaderPrintDropdownOpen(false);
                              triggerToast('Preparing Gift Message for print...', 'info');
                              setTimeout(() => {
                                window.print();
                              }, 300);
                            }}
                            className={`w-full text-left px-3.5 py-1.5 hover:bg-slate-50 font-medium flex items-center justify-between cursor-pointer ${headerPrintSelection === 'Gift Message' ? 'text-brand-600 bg-brand-50/50 font-semibold text-brand-600' : 'text-slate-700'}`}
                          >
                            <span>Gift Message</span>
                          </button>

                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsLabelPopupOpen(false)}
                    className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* SHEET WORKSPACE: Side Panel & Scrollable details */}
              <div className="flex-1 min-h-0 flex flex-row overflow-hidden">
                
                {/* INTERACTIVE LEFT SIDEBAR: Shipments Tracker */}
                <div className="w-[180px] border-r border-slate-100 flex flex-col bg-slate-50/50 py-4 h-full select-none">
                  <div className="px-4 pb-2 flex items-center justify-between border-b border-slate-200/60 mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shipments</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (shipmentTabs.length >= 5) {
                          triggerToast('Maximum 5 shipments allowed per layout constraints', 'info');
                          return;
                        }
                        const nextTabIdx = shipmentTabs.length;
                        const newTab = `Shipment ${nextTabIdx + 1}`;
                        
                        // Dynamically compute remaining quantities for new tab
                        const newTabQtys: Record<string, number> = {};
                        const orderSKUsToCalc = selectedOrderDetail 
                          ? (selectedOrderDetail.orderItems && selectedOrderDetail.orderItems.length > 0 
                              ? selectedOrderDetail.orderItems 
                              : [{ productName: 'Classic Crewneck Hoodie', sku: 'SKU-G640-BLK-S-01', quantity: selectedOrderDetail.quantity || 1 }])
                          : [];

                        orderSKUsToCalc.forEach(item => {
                          let alreadyPacked = 0;
                          for (let i = 0; i < nextTabIdx; i++) {
                            const tabQtys = shipmentItemQuantitiesByTab[i] || {};
                            alreadyPacked += tabQtys[item.sku] !== undefined ? tabQtys[item.sku] : 0;
                          }
                          newTabQtys[item.sku] = Math.max(0, item.quantity - alreadyPacked);
                        });

                        setShipmentItemQuantitiesByTab(prev => ({
                          ...prev,
                          [nextTabIdx]: newTabQtys
                        }));

                        setShipmentTabs(prev => [...prev, newTab]);
                        setActiveShipmentTabIdx(nextTabIdx);
                        triggerToast(`Created new workspace draft: ${newTab} with remaining items allocated`, 'success');
                      }}
                      className="p-1 hover:bg-slate-200 text-brand-600 hover:text-brand-700 rounded-full cursor-pointer transition-all"
                      title="Add Shipment"
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto px-2.5 space-y-1">
                    {shipmentTabs.map((tab, idx) => (
                      <div
                        key={tab}
                        onClick={() => {
                          setActiveShipmentTabIdx(idx);
                          triggerToast(`Switched fields to ${tab}`, 'info');
                        }}
                        className={`group px-3 py-2 rounded-lg font-medium text-xs transition-all duration-150 cursor-pointer flex items-center justify-between ${
                          idx === activeShipmentTabIdx
                            ? 'bg-brand-50 text-brand-700 font-bold shadow-3xs'
                            : 'text-slate-650 hover:bg-slate-100/80 hover:text-slate-900'
                        }`}
                      >
                        <span className="truncate">{tab}</span>
                        {shipmentTabs.length > 1 && idx >= modalExistingShipments.length && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const updated = shipmentTabs.filter((_, i) => i !== idx);
                              setShipmentTabs(updated);
                              if (activeShipmentTabIdx >= updated.length) {
                                setActiveShipmentTabIdx(Math.max(0, updated.length - 1));
                              }
                              triggerToast(`Discarded ${tab} parameters`, 'info');
                            }}
                            className="hidden group-hover:flex p-0.5 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded transition"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* SCROLLABLE INNER SECTION: Form grids */}
                <div className="flex-1 bg-slate-50/50 p-6 overflow-y-auto h-full text-slate-700 text-xs">
                {/* Main 2-Column Split with adjusted width: 5/12 left, 7/12 right */}
                <div className={showAddressDetails ? "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" : "max-w-2xl mx-auto space-y-6 w-full"}>
                  
                  {showAddressDetails && (
                    <div className="space-y-6 lg:col-span-5 animate-in fade-in duration-250">
                    {/* Warehouse selection (Sender details renamed) */}
                    <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/50 relative">
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">SENDER</span>
                      </div>
                      
                      <div className="space-y-3">
                        <select
                          value={selectedWarehouseForLabel}
                          disabled={isCurrentTabSaved}
                          onChange={(e) => {
                            const wName = e.target.value;
                            setSelectedWarehouseForLabel(wName);
                            const found = warehousePresets.find(w => w.name === wName);
                            if (found) {
                              setSenderFirstName(found.firstName);
                              setSenderLastName(found.lastName);
                              setSenderCompany(found.company);
                              setSenderEmail(found.email);
                              setSenderPhone(found.phone);
                              setSenderCountry(found.country);
                              setSenderAddress1(found.address1);
                              setSenderAddress2(found.address2);
                              setSenderCity(found.city);
                              setSenderZip(found.zip);
                              triggerToast(`Switched sender to ${wName}`, 'success');
                            }
                          }}
                          className="w-full h-9 px-3 border border-slate-200 hover:border-slate-350 focus:border-brand-500 rounded-lg text-xs bg-white outline-none font-bold text-slate-800 cursor-pointer disabled:bg-slate-50/70 disabled:text-slate-500 disabled:cursor-not-allowed"
                        >
                          {warehousePresets.map((w) => (
                            <option key={w.name} value={w.name}>{w.name}</option>
                          ))}
                        </select>

                        <div className="mt-1 font-sans text-xs text-slate-600 space-y-1 leading-relaxed pl-1 pt-1">
                          <p className="font-extrabold text-slate-800">{senderCompany}</p>
                          <p className="text-slate-500 font-medium">Contact: {senderFirstName} {senderLastName} ({senderPhone})</p>
                          <p className="text-slate-600">
                            {senderAddress1} {senderAddress2 && `, ${senderAddress2}`}
                            <br />
                            {senderCity}, {senderZip}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Recipient Details */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-slate-800 tracking-tight uppercase tracking-wider pl-0.5">Recipient details</h3>
                      <div className="grid grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-1">First name *</label>
                          <input
                            type="text"
                            value={labelFormFirstName}
                            disabled={isCurrentTabSaved}
                            onChange={(e) => setLabelFormFirstName(e.target.value)}
                            className="w-full h-8 px-3 border border-slate-200 rounded-lg text-xs disabled:bg-slate-50/70 disabled:text-slate-500 disabled:border-slate-150 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Last name *</label>
                          <input
                            type="text"
                            value={labelFormLastName}
                            disabled={isCurrentTabSaved}
                            onChange={(e) => setLabelFormLastName(e.target.value)}
                            className="w-full h-8 px-3 border border-slate-200 rounded-lg text-xs disabled:bg-slate-50/70 disabled:text-slate-500 disabled:border-slate-150 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Company</label>
                          <input
                            type="text"
                            value={labelFormCompany}
                            disabled={isCurrentTabSaved}
                            onChange={(e) => setLabelFormCompany(e.target.value)}
                            className="w-full h-8 px-3 border border-slate-200 rounded-lg text-xs disabled:bg-slate-50/70 disabled:text-slate-500 disabled:border-slate-150 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Email</label>
                          <input
                            type="email"
                            value={labelFormEmail}
                            disabled={isCurrentTabSaved}
                            onChange={(e) => setLabelFormEmail(e.target.value)}
                            className="w-full h-8 px-3 border border-slate-200 rounded-lg text-xs disabled:bg-slate-50/70 disabled:text-slate-500 disabled:border-slate-150 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Phone</label>
                          <input
                            type="text"
                            value={labelFormPhone}
                            disabled={isCurrentTabSaved}
                            onChange={(e) => setLabelFormPhone(e.target.value)}
                            className="w-full h-8 px-3 border border-slate-200 rounded-lg text-xs disabled:bg-slate-50/70 disabled:text-slate-500 disabled:border-slate-150 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Country *</label>
                          <input
                            type="text"
                            value={labelFormCountry}
                            disabled={isCurrentTabSaved}
                            onChange={(e) => {
                              const val = e.target.value;
                              setLabelFormCountry(val);
                              setLabelFormDestinationType(isInternationalCountry(val) ? 'International' : 'Domestic');
                            }}
                            className="w-full h-8 px-3 border border-slate-200 rounded-lg text-xs disabled:bg-slate-50/70 disabled:text-slate-500 disabled:border-slate-150 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Address Line 1</label>
                          <input
                            type="text"
                            value={labelFormAddress1}
                            disabled={isCurrentTabSaved}
                            onChange={(e) => setLabelFormAddress1(e.target.value)}
                            className="w-full h-8 px-3 border border-slate-200 rounded-lg text-xs disabled:bg-slate-50/70 disabled:text-slate-500 disabled:border-slate-150 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-[10px] font-semibold text-slate-500 mb-1">Address Line 2 (Optional)</label>
                          <input
                            type="text"
                            value={labelFormAddress2}
                            disabled={isCurrentTabSaved}
                            onChange={(e) => setLabelFormAddress2(e.target.value)}
                            className="w-full h-8 px-3 border border-slate-200 rounded-lg text-xs disabled:bg-slate-50/70 disabled:text-slate-500 disabled:border-slate-150 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-1">City *</label>
                          <input
                            type="text"
                            value={labelFormCity}
                            disabled={isCurrentTabSaved}
                            onChange={(e) => setLabelFormCity(e.target.value)}
                            className="w-full h-8 px-3 border border-slate-200 rounded-lg text-xs disabled:bg-slate-50/70 disabled:text-slate-500 disabled:border-slate-150 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-1">ZIP / Postcode *</label>
                          <input
                            type="text"
                            value={labelFormZip}
                            disabled={isCurrentTabSaved}
                            onChange={(e) => setLabelFormZip(e.target.value)}
                            className="w-full h-8 px-3 border border-slate-200 rounded-lg text-xs disabled:bg-slate-50/70 disabled:text-slate-500 disabled:border-slate-150 disabled:cursor-not-allowed"
                          />
                        </div>

                        {isInternationalCountry(labelFormCountry) && (
                          <div className="col-span-2">
                            <label className="block text-[10px] font-semibold text-slate-500 mb-1">HS Code *</label>
                            <input
                              type="text"
                              placeholder="e.g. 6109.10"
                              value={labelFormHsCode}
                              disabled={isCurrentTabSaved}
                              onChange={(e) => setLabelFormHsCode(e.target.value)}
                              className="w-full h-8 px-3 border border-slate-200 rounded-lg text-xs disabled:bg-slate-50/70 disabled:text-slate-500 disabled:border-slate-150 disabled:cursor-not-allowed"
                            />
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                  )}
                                          {/* Right Column: Packages & Carrier Selection - col-span-7 */}
                  <div className={showAddressDetails ? "space-y-3 lg:col-span-7" : "space-y-3 w-full"}>
                    {(() => {
                      const activePkg = labelFormPackages[0] || { weight: '47.92', length: '7.00', width: '5.00', height: '14.00' };
                      
                      const updateActivePkg = (updates: any) => {
                        setLabelFormPackages(prev => {
                          if (prev.length === 0) {
                            return [{
                              index: 1,
                              refId: `PKG-${labelFormOrderNo}-${Math.floor(1000 + Math.random() * 9000)}`,
                              savedPkg: 'Custom',
                              weight: '47.92',
                              length: '7.00',
                              width: '5.00',
                              height: '14.00',
                              ...updates
                            }];
                          }
                           return prev.map((p, idx) => idx === 0 ? { ...p, ...updates } : p);
                        });
                      };

                      const handleIncrement = (field: 'weight' | 'length' | 'width' | 'height', amount: number) => {
                        const currentVal = parseFloat(activePkg[field] || '0');
                        const nextVal = Math.max(0, currentVal + amount);
                        updateActivePkg({ [field]: nextVal.toFixed(2) });
                      };

                      const orderSKUs = selectedOrderDetail?.orderItems || [
                        { productName: 'Classic Crewneck Hoodie', styleColor: 'Black / S', sku: 'SKU-G640-BLK-S-01', quantity: selectedOrderDetail?.quantity || 1 }
                      ];

                      const handleGetRate = () => {
                        setLabelFormLoadingRates(true);
                        setLabelFormSelectedRateIndex(-1);
                        setTimeout(() => {
                          const services = getServicesList(
                            parseFloat(activePkg.weight || '47.72'),
                            parseFloat(activePkg.length || '7.00'),
                            parseFloat(activePkg.width || '5.00'),
                            parseFloat(activePkg.height || '14.00'),
                            labelFormCarrierPackage
                          );
                          const firstService = services[0] ? services[0].name : 'USPS GroundAdvantage - NSA Account';
                          
                          setLabelFormLoadingRates(false);
                          setLabelFormGetRateClicked(true);
                          setLabelFormSelectedRateIndex(0);
                          setLabelFormSelectedCarrier(firstService);
                          triggerToast('Calculated live carrier rates successfully!', 'success');
                        }, 500);
                      };

                      return (
                        <div className="py-1 space-y-3 font-sans">
                          
                          {/* Dedicated Print Shipping Label Button Displayed Above The Carrier */}
                          <div className="flex justify-end select-none">
                            <button
                              type="button"
                              onClick={() => {
                                setHeaderPrintSelection('Shipping Label');
                                triggerToast('Preparing Shipping Label for print...', 'info');
                                setTimeout(() => {
                                  window.print();
                                }, 300);
                              }}
                              className="w-full h-10 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-brand-100 transition-all focus:outline-none"
                            >
                              <Printer className="h-4 w-4" />
                              <span>Print Shipping Label</span>
                            </button>
                          </div>

                          {/* 1. CARRIER & PACKAGE SPECIFICATION MODULE */}
                          <div className="border border-slate-200 bg-white rounded-xl p-3 space-y-2 shadow-2xs">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block pb-1 border-b border-slate-50 font-sans">
                              Carrier
                            </span>
                            <div className="text-xs font-sans">
                              <div className="relative">
                                <select
                                  value={labelFormCarrierPackage}
                                  disabled={isCurrentTabSaved}
                                  onChange={(e) => {
                                    setLabelFormCarrierPackage(e.target.value);
                                    setLabelFormGetRateClicked(false);
                                    setLabelFormSelectedRateIndex(-1);
                                  }}
                                  className="w-full h-9 pl-3 pr-10 border border-slate-205 hover:border-slate-350 focus:border-brand-500 rounded-lg text-xs font-semibold bg-white text-slate-800 outline-none cursor-pointer appearance-none transition disabled:bg-slate-50/70 disabled:text-slate-500 disabled:cursor-not-allowed"
                                >
                                  <option value="ALL">ALL</option>
                                  <option value="USPS">USPS</option>
                                  <option value="DHL">DHL</option>
                                  <option value="UPS">UPS</option>
                                  <option value="FedEx">FedEx</option>
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                  <ChevronDown className="h-4 w-4" />
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* 2. SHIPMENT ITEMS / SKUS SELECTION MODULE */}
                          <div className="border border-slate-200 bg-white rounded-xl p-3 space-y-2.5 shadow-2xs">
                            <div className="flex justify-between items-center pb-1 border-b border-slate-50 font-sans">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                                Items / SKU in shipment
                              </span>
                            </div>

                            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                              {orderSKUs.map((item) => {
                                // Calculate how many are packed in OTHER tabs
                                let packedInOtherTabs = 0;
                                for (let i = 0; i < shipmentTabs.length; i++) {
                                  if (i === activeShipmentTabIdx) continue;
                                  const tabQtys = shipmentItemQuantitiesByTab[i] || {};
                                  packedInOtherTabs += tabQtys[item.sku] !== undefined ? tabQtys[item.sku] : 0;
                                }

                                const maxAllowed = Math.max(0, item.quantity - packedInOtherTabs);

                                const currentTabQtys = shipmentItemQuantitiesByTab[activeShipmentTabIdx] || {};
                                const packedQty = currentTabQtys[item.sku] !== undefined ? currentTabQtys[item.sku] : maxAllowed;

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
                                  <div key={item.sku} className="p-2 px-3 bg-slate-50/80 rounded-lg border border-slate-150 flex items-center justify-between gap-4 text-xs font-sans">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                      {/* Small Image Thumbnail */}
                                      <div 
                                        className="h-10 w-10 flex-shrink-0 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center cursor-zoom-in transition-transform duration-200 hover:scale-105"
                                        onMouseEnter={(e) => {
                                          const rect = e.currentTarget.getBoundingClientRect();
                                          setHoveredProductImage({
                                            url: productImg,
                                            x: rect.right + 12,
                                            y: rect.top + rect.height / 2 - 120
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
                                      <div className="min-w-0 flex-1">
                                        <div className="text-slate-800 font-extrabold text-[13px] leading-snug">
                                          {item.productName}
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase mt-0.5">
                                          {item.styleColor || 'Standard'} ({item.sku})
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0 font-sans">
                                      <span className="text-[10px] text-slate-550 font-semibold">Packed Qty:</span>
                                      <input
                                        type="number"
                                        min="0"
                                        max={maxAllowed}
                                        value={packedQty}
                                        disabled={isCurrentTabSaved}
                                        onChange={(e) => {
                                          const val = Math.min(maxAllowed, Math.max(0, parseInt(e.target.value) || 0));
                                          
                                          // Update tab state
                                          setShipmentItemQuantitiesByTab(prev => {
                                            const tabQtys = prev[activeShipmentTabIdx] || {};
                                            return {
                                              ...prev,
                                              [activeShipmentTabIdx]: {
                                                ...tabQtys,
                                                [item.sku]: val
                                              }
                                            };
                                          });

                                          // Backwards compatibility for single state
                                          setShipmentItemQuantities(prev => ({
                                            ...prev,
                                            [item.sku]: val
                                          }));

                                          setLabelFormGetRateClicked(false);
                                          setLabelFormSelectedRateIndex(-1);
                                        }}
                                        className="w-14 h-8 text-center font-bold text-slate-800 border border-slate-200 hover:border-slate-300 rounded bg-white outline-none disabled:bg-slate-50/70 disabled:text-slate-500 disabled:cursor-not-allowed"
                                      />
                                      <span className="text-xs text-slate-400 font-bold select-none whitespace-nowrap">
                                        / {item.quantity}
                                      </span>
                                      {packedInOtherTabs > 0 && (
                                        <span className="text-[9px] text-brand-650 bg-brand-50/80 border border-brand-100 px-1 py-0.5 rounded font-extrabold" title="Quantity packed in other shipments of this order">
                                          Packed other: {packedInOtherTabs}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* 3. Package specifications (Weight, Dimensions & presets) */}
                          <div className="border border-slate-200 bg-white rounded-xl p-3 space-y-2.5 shadow-2xs">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block pb-1 border-b border-slate-50 font-sans">
                              Package Specifications
                            </span>

                            <div className="space-y-2.5 text-xs font-sans">
                              {/* Weight Row */}
                              <div className="grid grid-cols-[110px_1fr] items-center gap-x-4">
                                <span className="text-xs font-semibold text-slate-500">Weight</span>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center border border-slate-200 rounded-lg bg-white h-9 w-28 overflow-hidden pr-0.5 shadow-3xs">
                                    <input
                                      type="text"
                                      value={activePkg.weight}
                                      disabled={isCurrentTabSaved}
                                      onChange={(e) => {
                                        updateActivePkg({ weight: e.target.value });
                                        setLabelFormGetRateClicked(false);
                                        setLabelFormSelectedRateIndex(-1);
                                      }}
                                      className="w-full text-center text-xs font-semibold px-2 h-full outline-none text-slate-800 disabled:bg-slate-50/70 disabled:text-slate-500 disabled:cursor-not-allowed"
                                    />
                                    <div className="flex flex-col h-7 w-5 divide-y divide-slate-100 border-l border-slate-100 select-none">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (isCurrentTabSaved) return;
                                          handleIncrement('weight', 1);
                                          setLabelFormGetRateClicked(false);
                                        }}
                                        className="flex-1 flex items-center justify-center hover:bg-slate-50 text-[7px] text-slate-400 outline-none cursor-pointer disabled:cursor-not-allowed"
                                      >
                                        ▲
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (isCurrentTabSaved) return;
                                          handleIncrement('weight', -1);
                                          setLabelFormGetRateClicked(false);
                                        }}
                                        className="flex-1 flex items-center justify-center hover:bg-slate-50 text-[7px] text-slate-400 outline-none cursor-pointer disabled:cursor-not-allowed"
                                      >
                                        ▼
                                      </button>
                                    </div>
                                  </div>

                                  <div className="relative">
                                    <select
                                      value={labelFormWeightUnit.includes('oz') ? 'oz' : 'lbs'}
                                      disabled={isCurrentTabSaved}
                                      onChange={(e) => {
                                        const u = e.target.value;
                                        setLabelFormWeightUnit(u === 'oz' ? 'Ounces (oz)' : 'Pounds (lbs)');
                                        setLabelFormGetRateClicked(false);
                                        setLabelFormSelectedRateIndex(-1);
                                      }}
                                      className="h-9 px-3.5 pr-8 border border-slate-205 bg-white rounded-lg text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer appearance-none transition disabled:bg-slate-50/70 disabled:text-slate-500 disabled:cursor-not-allowed"
                                    >
                                      <option value="oz">oz</option>
                                      <option value="lbs">lbs</option>
                                    </select>
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                      <ChevronDown className="h-3.5 w-3.5" />
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Size Inputs Row */}
                              <div className="grid grid-cols-[110px_1fr] items-center gap-x-4">
                                <span className="text-xs font-semibold text-slate-500">Dimensions</span>
                                <div className="grid grid-cols-3 gap-3 w-full max-w-xl text-xs">
                                  <div className="flex items-center gap-1.5 w-full">
                                    <div className="flex items-center border border-slate-200 rounded-lg bg-white h-9 w-full overflow-hidden pr-0.5 shadow-3xs">
                                      <input
                                        type="text"
                                        value={activePkg.length}
                                        disabled={isCurrentTabSaved}
                                        onChange={(e) => {
                                          updateActivePkg({ length: e.target.value });
                                          setLabelFormGetRateClicked(false);
                                        }}
                                        className="w-full text-center text-xs font-semibold h-full outline-none text-slate-800 disabled:bg-slate-50/70 disabled:text-slate-500 disabled:cursor-not-allowed"
                                      />
                                      <div className="flex flex-col h-7 w-5 divide-y divide-slate-100 border-l border-slate-100 select-none">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (isCurrentTabSaved) return;
                                            handleIncrement('length', 1);
                                            setLabelFormGetRateClicked(false);
                                          }}
                                          className="flex-1 flex items-center justify-center hover:bg-slate-50 text-[7px] text-slate-400 outline-none cursor-pointer disabled:cursor-not-allowed"
                                        >
                                          ▲
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (isCurrentTabSaved) return;
                                            handleIncrement('length', -1);
                                            setLabelFormGetRateClicked(false);
                                          }}
                                          className="flex-1 flex items-center justify-center hover:bg-slate-50 text-[7px] text-slate-400 outline-none cursor-pointer disabled:cursor-not-allowed"
                                        >
                                          ▼
                                        </button>
                                      </div>
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-bold select-none">(L)</span>
                                  </div>

                                  <div className="flex items-center gap-1.5 w-full">
                                    <div className="flex items-center border border-slate-200 rounded-lg bg-white h-9 w-full overflow-hidden pr-0.5 shadow-3xs">
                                      <input
                                        type="text"
                                        value={activePkg.width}
                                        disabled={isCurrentTabSaved}
                                        onChange={(e) => {
                                          updateActivePkg({ width: e.target.value });
                                          setLabelFormGetRateClicked(false);
                                        }}
                                        className="w-full text-center text-xs font-semibold h-full outline-none text-slate-805 disabled:bg-slate-50/70 disabled:text-slate-500 disabled:cursor-not-allowed"
                                      />
                                      <div className="flex flex-col h-7 w-5 divide-y divide-slate-100 border-l border-slate-100 select-none">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (isCurrentTabSaved) return;
                                            handleIncrement('width', 1);
                                            setLabelFormGetRateClicked(false);
                                          }}
                                          className="flex-1 flex items-center justify-center hover:bg-slate-50 text-[7px] text-slate-400 outline-none cursor-pointer disabled:cursor-not-allowed"
                                        >
                                          ▲
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (isCurrentTabSaved) return;
                                            handleIncrement('width', -1);
                                            setLabelFormGetRateClicked(false);
                                          }}
                                          className="flex-1 flex items-center justify-center hover:bg-slate-50 text-[7px] text-slate-400 outline-none cursor-pointer disabled:cursor-not-allowed"
                                        >
                                          ▼
                                        </button>
                                      </div>
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-bold select-none">(W)</span>
                                  </div>

                                  <div className="flex items-center gap-1.5 w-full">
                                    <div className="flex items-center border border-slate-200 rounded-lg bg-white h-9 w-full overflow-hidden pr-0.5 shadow-3xs">
                                      <input
                                        type="text"
                                        value={activePkg.height}
                                        disabled={isCurrentTabSaved}
                                        onChange={(e) => {
                                          updateActivePkg({ height: e.target.value });
                                          setLabelFormGetRateClicked(false);
                                        }}
                                        className="w-full text-center text-xs font-semibold h-full outline-none text-slate-800 disabled:bg-slate-50/70 disabled:text-slate-500 disabled:cursor-not-allowed"
                                      />
                                      <div className="flex flex-col h-7 w-5 divide-y divide-slate-100 border-l border-slate-100 select-none">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (isCurrentTabSaved) return;
                                            handleIncrement('height', 1);
                                            setLabelFormGetRateClicked(false);
                                          }}
                                          className="flex-1 flex items-center justify-center hover:bg-slate-50 text-[7px] text-slate-400 outline-none cursor-pointer disabled:cursor-not-allowed"
                                        >
                                          ▲
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            if (isCurrentTabSaved) return;
                                            handleIncrement('height', -1);
                                            setLabelFormGetRateClicked(false);
                                          }}
                                          className="flex-1 flex items-center justify-center hover:bg-slate-50 text-[7px] text-slate-400 outline-none cursor-pointer disabled:cursor-not-allowed"
                                        >
                                          ▼
                                        </button>
                                      </div>
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-bold select-none">(H)</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* INTERNATIONAL CUSTOMS DECLARATION BLOCK */}
                          {(labelFormDestinationType === 'International' || isInternationalCountry(labelFormCountry)) && (
                            <div className="border border-slate-200 bg-white rounded-xl p-3.5 space-y-3.5 shadow-2xs">
                              <div className="space-y-3.5 text-slate-800">
                                {/* Item Reference ID Row */}
                                <div className="space-y-1">
                                  <label className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1 font-sans">
                                    Item Reference ID <span className="text-rose-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={labelFormCustomsRefId}
                                    disabled={isCurrentTabSaved}
                                    onChange={(e) => setLabelFormCustomsRefId(e.target.value)}
                                    placeholder="Enter Item Reference ID (e.g. SKU, order item ID)"
                                    className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs font-semibold focus:border-brand-500 focus:outline-none transition bg-white text-slate-900 disabled:bg-slate-50/70 disabled:text-slate-500 disabled:cursor-not-allowed"
                                  />
                                </div>

                                {/* Middle Row with 5 columns: Country of origin, HS Code, Net weight, Price, Qty */}
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-sans">
                                  {/* Country of Origin */}
                                  <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-500 block truncate">
                                      Country of origin <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      value={labelFormCustomsCountry}
                                      disabled={isCurrentTabSaved}
                                      onChange={(e) => setLabelFormCustomsCountry(e.target.value)}
                                      placeholder="e.g. Japan"
                                      className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs font-semibold focus:border-brand-500 focus:outline-none bg-white text-slate-900 transition disabled:bg-slate-50/70 disabled:text-slate-500 disabled:cursor-not-allowed"
                                    />
                                  </div>

                                  {/* HS Code */}
                                  <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1 truncate">
                                      <span>HS Code</span> <span className="text-rose-500">*</span>
                                      <span className="text-slate-400 hover:text-slate-600 block pl-0.5 cursor-help" title="Harmonized System tariff code">
                                        <HelpCircle className="h-3 w-3 inline" />
                                      </span>
                                    </label>
                                    <input
                                      type="text"
                                      value={labelFormCustomsHsCode}
                                      disabled={isCurrentTabSaved}
                                      onChange={(e) => setLabelFormCustomsHsCode(e.target.value)}
                                      placeholder="e.g. 6109.10"
                                      className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs font-semibold focus:border-brand-500 focus:outline-none bg-white text-slate-900 transition disabled:bg-slate-50/70 disabled:text-slate-500 disabled:cursor-not-allowed"
                                    />
                                  </div>

                                  {/* Net weight (oz) */}
                                  <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-500 block truncate">
                                      Net weight <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative flex items-center">
                                      <input
                                        type="text"
                                        value={labelFormCustomsNetWeight}
                                        disabled={isCurrentTabSaved}
                                        onChange={(e) => setLabelFormCustomsNetWeight(e.target.value)}
                                        className="w-full h-9 pl-3 pr-8 border border-slate-200 rounded-lg text-xs font-semibold focus:border-brand-500 focus:outline-none bg-white text-slate-900 text-left transition disabled:bg-slate-50/70 disabled:text-slate-500 disabled:cursor-not-allowed"
                                      />
                                      <span className="absolute right-3 text-[10px] font-bold text-slate-400 select-none pointer-events-none">
                                        oz
                                      </span>
                                    </div>
                                  </div>

                                  {/* Price (value) */}
                                  <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-500 block truncate">
                                      Price (value) <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative flex items-center">
                                      <input
                                        type="text"
                                        value={labelFormCustomsPrice}
                                        disabled={isCurrentTabSaved}
                                        onChange={(e) => setLabelFormCustomsPrice(e.target.value)}
                                        className="w-full h-9 pl-3 pr-10 border border-slate-200 rounded-lg text-xs font-semibold focus:border-brand-500 focus:outline-none bg-white text-slate-900 text-left transition disabled:bg-slate-50/70 disabled:text-slate-500 disabled:cursor-not-allowed"
                                      />
                                      <span className="absolute right-3 text-[10px] font-bold text-slate-400 select-none pointer-events-none">
                                        USD
                                      </span>
                                    </div>
                                  </div>

                                  {/* Quantity */}
                                  <div className="col-span-2 md:col-span-1 space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-500 block truncate">
                                      Quantity <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={labelFormCustomsQty}
                                      disabled={isCurrentTabSaved}
                                      onChange={(e) => setLabelFormCustomsQty(e.target.value)}
                                      className="w-full h-9 px-3 border border-slate-200 rounded-lg text-xs font-semibold focus:border-brand-500 focus:outline-none bg-white text-slate-900 transition disabled:bg-slate-50/70 disabled:text-slate-500 disabled:cursor-not-allowed"
                                    />
                                  </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-1">
                                  <label className="text-[10px] uppercase font-bold text-slate-500 block font-sans">
                                    Description <span className="text-rose-500">*</span>
                                  </label>
                                  <textarea
                                    value={labelFormCustomsDesc}
                                    disabled={isCurrentTabSaved}
                                    onChange={(e) => setLabelFormCustomsDesc(e.target.value)}
                                    rows={2}
                                    placeholder="Item detailed description for customs clearance..."
                                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-semibold focus:border-brand-500 focus:outline-none bg-white text-slate-900 transition disabled:bg-slate-50/70 disabled:text-slate-500 disabled:cursor-not-allowed"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 4. SERVICE CARRIER RATES SECTION */}
                          <div className="border border-slate-200 bg-white rounded-xl p-3 space-y-2 shadow-2xs">
                            <div className="flex items-center justify-between pb-1 border-b border-slate-50 font-sans">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-sans">
                                Service
                              </span>
                            </div>

                            {isCurrentTabSaved ? (
                              <div className="space-y-1.5 font-sans animate-fade-in">
                                <div className="p-2 px-3 rounded-lg border border-brand-500 bg-brand-50/10 shadow-3xs font-semibold flex items-center justify-between select-none">
                                  <div className="flex items-center gap-2.5">
                                    <div className="h-4 w-4 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
                                      <Check className="h-2.5 w-2.5 text-white stroke-[3.5]" strokeWidth={3.5} />
                                    </div>
                                    <div className="leading-tight text-left">
                                      <div className="text-xs text-brand-700 font-extrabold font-sans">
                                        {labelFormSelectedCarrier}
                                      </div>
                                      <div className="text-[10px] text-slate-400 mt-0.5 font-medium normal-case font-sans">
                                        Postage purchased & printed
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-xs font-black tracking-tight text-brand-600 font-mono">
                                    {modalExistingShipments[activeShipmentTabIdx]?.price || '$8.61'}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                {/* 1. Get rates action button (shown only when not clicked and not loading) */}
                                {!labelFormGetRateClicked && !labelFormLoadingRates && (
                                  <div className="flex justify-start">
                                    <button
                                      type="button"
                                      onClick={handleGetRate}
                                      className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black rounded-lg text-xs transition cursor-pointer shadow-sm flex items-center justify-center select-none"
                                    >
                                      Get rates
                                    </button>
                                  </div>
                                )}

                                {/* 2. Loading state */}
                                {labelFormLoadingRates && (
                                  <div className="border border-dashed border-slate-150 rounded-xl py-8 px-4 text-center text-xs text-slate-400 font-semibold space-y-2 font-sans">
                                    <div className="h-6 w-6 border-3 border-slate-200 border-t-emerald-600 rounded-full animate-spin mx-auto" />
                                    <p>Calculating live carrier rates...</p>
                                  </div>
                                )}

                                {/* 3. Rates options presentation (Get rates button is hidden) */}
                                {!labelFormLoadingRates && labelFormGetRateClicked && (
                                  <div className="space-y-1.5 font-sans animate-fade-in">
                                    {getServicesList(
                                      parseFloat(activePkg.weight || '47.72'),
                                      parseFloat(activePkg.length || '7.00'),
                                      parseFloat(activePkg.width || '5.00'),
                                      parseFloat(activePkg.height || '14.00'),
                                      labelFormCarrierPackage
                                    ).map((srv, sIdx) => {
                                      const isSelected = labelFormSelectedRateIndex === sIdx;
                                      return (
                                        <div
                                          key={srv.name}
                                          className={`p-2 px-3 rounded-lg border transition flex items-center justify-between select-none ${
                                            isSelected
                                              ? 'border-brand-500 bg-brand-50/10 shadow-3xs font-semibold'
                                              : 'border-slate-100 bg-slate-50/40 opacity-70'
                                          }`}
                                        >
                                          <div className="flex items-center gap-2.5">
                                            {isSelected ? (
                                              <div className="h-4 w-4 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
                                                <Check className="h-2.5 w-2.5 text-white stroke-[3.5]" />
                                              </div>
                                            ) : (
                                              <div className="h-4 w-4 rounded-full border border-slate-200 bg-slate-50 shrink-0" />
                                            )}
                                            <div className="leading-tight">
                                              <div className={`text-xs ${isSelected ? 'text-brand-700 font-extrabold' : 'text-slate-500 font-semibold'}`}>
                                                {srv.name}
                                              </div>
                                              <div className="text-[10px] text-slate-400 mt-0.5 font-medium normal-case">
                                                {srv.est}
                                              </div>
                                            </div>
                                          </div>
                                          <div className={`text-xs font-black tracking-tight ${isSelected ? 'text-brand-600' : 'text-slate-550'}`}>
                                            {srv.price}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                        </div>
                      );
                    })()}
                  </div>

                </div>
              </div>

              </div>

              {/* Persistent Footer */}
              <div className="px-6 py-3.5 border-t border-slate-100 bg-white flex items-center justify-end gap-3 select-none shrink-0">
                <button
                  type="button"
                  onClick={() => setIsLabelPopupOpen(false)}
                  className="h-9 px-4 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-xs transition cursor-pointer"
                >
                  {isCurrentTabSaved ? 'Close' : 'Cancel'}
                </button>
                {!isCurrentTabSaved && (
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedOrderDetail) {
                        const compiledAddress = `${labelFormAddress1}${labelFormAddress2 ? ', ' + labelFormAddress2 : ''}, ${labelFormCity}, ${labelFormZip}, ${labelFormCountry}`;
                        const nameStr = `${labelFormFirstName} ${labelFormLastName}`;

                        // Extract package info
                        const activePkg = labelFormPackages && labelFormPackages[0] ? labelFormPackages[0] : { weight: '47.92', length: '7.00', width: '5.00', height: '14.00' };
                        const sizeStr = `${activePkg.length || '7.00'} × ${activePkg.width || '5.00'} × ${activePkg.height || '14.00'}`;
                        const weightStr = `${activePkg.weight || '47.92'} lbs`;

                        const services = getServicesList(
                          parseFloat(activePkg.weight || '47.92'),
                          parseFloat(activePkg.length || '7.00'),
                          parseFloat(activePkg.width || '5.00'),
                          parseFloat(activePkg.height || '14.00'),
                          labelFormCarrierPackage
                        );
                        const matchedService: any = services.find(s => s.name === labelFormSelectedCarrier) || services[0] || { name: 'UPS Ground - NSA Account', price: '$8.61' };
                        const carrierName = matchedService.carrier || (labelFormSelectedCarrier.includes('USPS') ? 'USPS' : labelFormSelectedCarrier.includes('UPS') ? 'UPS' : labelFormSelectedCarrier.includes('DHL') ? 'DHL' : 'FedEx');
                        const ratePrice = matchedService.price || '$8.61';

                        const randTracking = '1LSDBVU' + Math.floor(100000 + Math.random() * 900000) + 'NI';

                        // Calculate current packed items for the shipment
                        const orderSKUs = selectedOrderDetail.orderItems && selectedOrderDetail.orderItems.length > 0 
                          ? selectedOrderDetail.orderItems 
                          : [{ productName: 'Classic Crewneck Hoodie', styleColor: 'Black / S', sku: 'SKU-G640-BLK-S-01', quantity: selectedOrderDetail.quantity || 1 }];

                        const currentTabQtys = shipmentItemQuantitiesByTab[activeShipmentTabIdx] || {};
                        const packedItems = orderSKUs.map(item => {
                          let packedInOtherTabs = 0;
                          for (let i = 0; i < shipmentTabs.length; i++) {
                            if (i === activeShipmentTabIdx) continue;
                            const tabQtys = shipmentItemQuantitiesByTab[i] || {};
                            packedInOtherTabs += tabQtys[item.sku] !== undefined ? tabQtys[item.sku] : 0;
                          }
                          const maxAllowed = Math.max(0, item.quantity - packedInOtherTabs);
                          const qty = currentTabQtys[item.sku] !== undefined ? currentTabQtys[item.sku] : maxAllowed;
                          return { sku: item.sku, qty, productName: item.productName };
                        });

                        const newShipment = {
                          trackingNumber: randTracking,
                          carrier: carrierName,
                          service: matchedService.name,
                          shipDate: new Date().toLocaleDateString('en-US'),
                          shippingMethod: 'FLAT',
                          size: sizeStr,
                          weight: weightStr,
                          price: ratePrice,
                          packedItems: packedItems.map(p => ({ sku: p.sku, qty: p.qty })),
                          senderDetails: {
                            name: 'Hiep Admin',
                            company: 'SwiftPOD LLC - Warehouse A',
                            address: '2070 S 7th St. Ste E, San Jose, CA 95112'
                          },
                          recipientDetails: {
                            firstName: labelFormFirstName,
                            lastName: labelFormLastName,
                            company: labelFormCompany,
                            email: labelFormEmail,
                            phone: labelFormPhone,
                            country: labelFormCountry,
                            address1: labelFormAddress1,
                            address2: labelFormAddress2,
                            city: labelFormCity,
                            zip: labelFormZip
                          }
                        };

                        // Decrement the physical product warehouse stock quantity in real-time
                        packedItems.forEach(p => {
                          if (p.qty <= 0) return;
                          setProducts(prevProducts => prevProducts.map(prod => {
                            // Compare SKU substring match or name match
                            const isMatch = (prod.sku?.toLowerCase().includes(p.sku.toLowerCase())) ||
                                            (prod.name?.toLowerCase() === p.productName.toLowerCase());
                            if (isMatch) {
                              const currentStockMatch = prod.stockQty.match(/\d+/);
                              if (currentStockMatch) {
                                const oldStock = parseInt(currentStockMatch[0]);
                                const newStock = Math.max(0, oldStock - p.qty);
                                return {
                                  ...prod,
                                  stockQty: `In stock: ${newStock}`
                                };
                              }
                            }
                            return prod;
                          }));
                        });

                        setOrders(prev => prev.map(o => {
                          if (o.id === selectedOrderDetail.id) {
                            const hasExisting = !!o.shipmentInfo;
                            if (!hasExisting) {
                              return {
                                ...o,
                                customerStore: nameStr,
                                destination: compiledAddress,
                                destinationType: labelFormDestinationType,
                                shipmentInfo: newShipment,
                                shipments: [newShipment],
                                orderStatus: 'Shipped',
                                shippingStatus: 'In Transit'
                              };
                            } else {
                              const updatedShipments = [...(o.shipments || [o.shipmentInfo]), newShipment];
                              return {
                                ...o,
                                shipments: updatedShipments
                              };
                            }
                          }
                          return o;
                        }));

                        setSelectedOrderDetail(prev => {
                          if (!prev) return null;
                          const hasExisting = !!prev.shipmentInfo;
                          if (!hasExisting) {
                            return {
                              ...prev,
                              customerStore: nameStr,
                              destination: compiledAddress,
                              destinationType: labelFormDestinationType,
                              shipmentInfo: newShipment,
                              shipments: [newShipment],
                              orderStatus: 'Shipped',
                              shippingStatus: 'In Transit'
                            };
                          } else {
                            const updatedShipments = [...(prev.shipments || [prev.shipmentInfo]), newShipment];
                            return {
                              ...prev,
                              shipments: updatedShipments
                            };
                          }
                        });
                      }
                      setIsLabelPopupOpen(false);
                      triggerToast('Shipping label generated, shipment registered, and inventory count decremented successfully!', 'success');
                    }}
                    className="h-9 px-5 bg-brand-600 hover:bg-brand-750 active:bg-brand-800 text-white font-semibold rounded-lg text-xs shadow-xs transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ITEMS IN THIS SHIPMENT MODAL */}
      <AnimatePresence>
        {isShipmentItemsModalOpen && selectedOrderDetail && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShipmentItemsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl p-6 border border-slate-150 z-[130] space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold font-sans text-slate-900 tracking-tight text-left">
                  Items in this shipment
                </h3>
                <span className="text-base font-bold font-sans text-slate-900">
                  Total: {selectedOrderDetail.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || selectedOrderDetail.quantity || 3}
                </span>
              </div>

              {/* Items List / Table */}
              <div className="font-sans text-xs text-left">
                {/* Table Header */}
                <div className="grid grid-cols-[1.5fr_1fr_1.2fr] pb-2 border-b border-slate-200 text-slate-800 font-bold text-[13px]">
                  <div>Label ID</div>
                  <div>Employee</div>
                  <div>Time</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-slate-100 text-slate-800 text-[12px] text-left">
                  {(() => {
                    const totalItemsCount = selectedOrderDetail.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || selectedOrderDetail.quantity || 3;
                    return Array.from({ length: totalItemsCount }).map((_, index) => {
                      const num = totalItemsCount - index;
                      const batchIdStr = String(selectedOrderDetail.id || '27').padStart(6, '0');
                      const labelId = `061826-SJ-M-0000${batchIdStr}-${num}`;
                      return (
                        <div key={labelId} className="grid grid-cols-[1.5fr_1fr_1.2fr] py-3.5 select-all font-sans text-[12px] text-slate-800 hover:bg-slate-50 transition px-0.5 rounded">
                          <div className="font-sans tracking-tight text-slate-900">{labelId}</div>
                          <div className="font-sans text-slate-600">Tech</div>
                          <div className="font-sans text-slate-600">2026-06-18 03:37:13</div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsShipmentItemsModalOpen(false)}
                  className="px-5 py-2 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-semibold hover:text-slate-900 transition flex items-center justify-center cursor-pointer shadow-sm font-sans"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SHIPMENT DETAILS REVIEW MODAL */}
      <AnimatePresence>
        {isShipmentDetailsModalOpen && selectedOrderDetail?.shipmentInfo && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShipmentDetailsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-150 z-[130] flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="text-left">
                  <h3 className="text-base font-bold font-sans text-slate-900 tracking-tight">
                    Shipment Label Details
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Order ID: {selectedOrderDetail.orderNumber || '#ORD'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsShipmentDetailsModalOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-150 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 space-y-5 overflow-y-auto text-left font-sans text-xs">
                
                {/* Visual Tracking & Status Header */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Tracking Number</div>
                    <div className="font-mono text-sm font-bold text-slate-800 select-all tracking-wide">
                      {selectedOrderDetail.shipmentInfo.trackingNumber || '1LSDBVU000ZLLNI'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Postage Price</div>
                    <div className="font-sans text-sm font-extrabold text-slate-900 leading-none">
                      {selectedOrderDetail.shipmentInfo.price || '$8.61'}
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Status</div>
                    <div className="inline-flex items-center gap-1 text-yellow-650 font-extrabold tracking-wide text-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
                      Pre-Transit
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column: Warehouse & Recipient Addresses */}
                  <div className="space-y-4">
                    {/* Warehouse Sender Card */}
                    <div className="border border-slate-100 rounded-xl p-4 bg-white shadow-2xs space-y-3">
                      <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-50">
                        <Building className="h-3.5 w-3.5 text-slate-400" />
                        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Warehouse / Sender</h4>
                      </div>
                      <div className="space-y-1 text-[12px] leading-relaxed">
                        <div className="font-bold text-slate-800">
                          {selectedOrderDetail.shipmentInfo.senderDetails?.name || 'Hiep Admin'}
                        </div>
                        <div className="text-slate-500 font-semibold">
                          {selectedOrderDetail.shipmentInfo.senderDetails?.company || 'SwiftPOD LLC - Warehouse A'}
                        </div>
                        <div className="text-slate-500">
                          {selectedOrderDetail.shipmentInfo.senderDetails?.address || '2070 S 7th St. Ste E, San Jose, CA 95112'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono pt-1">
                          Contact: 408-555-0199
                        </div>
                      </div>
                    </div>

                    {/* Recipient Details Card */}
                    <div className="border border-slate-100 rounded-xl p-4 bg-white shadow-2xs space-y-3">
                      <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-50">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Recipient Details</h4>
                      </div>
                      <div className="space-y-1 text-[12px] leading-relaxed">
                        <div className="font-bold text-slate-800">
                          {selectedOrderDetail.shipmentInfo.recipientDetails 
                            ? `${selectedOrderDetail.shipmentInfo.recipientDetails.firstName} ${selectedOrderDetail.shipmentInfo.recipientDetails.lastName}`
                            : (selectedOrderDetail.shipAddress?.name || 'Demi Wilkinson')
                          }
                        </div>
                        {(selectedOrderDetail.shipmentInfo.recipientDetails?.company || selectedOrderDetail.shipAddress?.companyLine) && (
                          <div className="text-slate-500 font-semibold">
                            {selectedOrderDetail.shipmentInfo.recipientDetails?.company || selectedOrderDetail.shipAddress?.companyLine}
                          </div>
                        )}
                        <div className="text-slate-500">
                          {selectedOrderDetail.shipmentInfo.recipientDetails?.address1 || selectedOrderDetail.shipAddress?.addressLine || 'Store Boutique (Phoenix)'}
                          {selectedOrderDetail.shipmentInfo.recipientDetails?.address2 ? `, ${selectedOrderDetail.shipmentInfo.recipientDetails.address2}` : ''}
                        </div>
                        <div className="text-slate-500 font-medium">
                          {selectedOrderDetail.shipmentInfo.recipientDetails 
                            ? `${selectedOrderDetail.shipmentInfo.recipientDetails.city || ''}, ${selectedOrderDetail.shipmentInfo.recipientDetails.zip || ''}, ${selectedOrderDetail.shipmentInfo.recipientDetails.country || 'United States'}`
                            : (selectedOrderDetail.destination || 'United States')
                          }
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono pt-1.5 border-t border-slate-50 space-y-0.5">
                          <div className="truncate">Email: {selectedOrderDetail.shipmentInfo.recipientDetails?.email || 'demiwilkinson@example.com'}</div>
                          <div>Phone: {selectedOrderDetail.shipmentInfo.recipientDetails?.phone || '555-019-2834'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Packaging, Size, Service Details */}
                  <div className="space-y-4">
                    {/* Packages & Measurements */}
                    <div className="border border-slate-100 rounded-xl p-4 bg-white shadow-2xs space-y-3">
                      <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-50">
                        <Box className="h-3.5 w-3.5 text-slate-405" />
                        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Package Specification</h4>
                      </div>
                      <div className="space-y-2 text-[12px]">
                        <div className="grid grid-cols-[85px_1fr] gap-x-2">
                          <span className="text-slate-400">Carrier Unit:</span>
                          <span className="font-bold text-slate-700">
                            {selectedOrderDetail.shipmentInfo.carrier || 'UPS'}
                          </span>
                        </div>
                        <div className="grid grid-cols-[85px_1fr] gap-x-2">
                          <span className="text-slate-400">Poly Mailer:</span>
                          <span className="font-semibold text-slate-700">
                            Large Poly Mailer
                          </span>
                        </div>
                        <div className="grid grid-cols-[85px_1fr] gap-x-2">
                          <span className="text-slate-400">Weight:</span>
                          <span className="font-mono text-slate-700 font-bold">
                            {selectedOrderDetail.shipmentInfo.weight || '47.92 oz'}
                          </span>
                        </div>
                        <div className="grid grid-cols-[85px_1fr] gap-x-2">
                          <span className="text-slate-400">Dimensions:</span>
                          <span className="font-mono text-slate-700 font-bold">
                            {selectedOrderDetail.shipmentInfo.size ? `${selectedOrderDetail.shipmentInfo.size}` : '12.00 x 3.00 x 15.00 in'}
                          </span>
                        </div>
                        <div className="grid grid-cols-[85px_1fr] gap-x-2">
                          <span className="text-slate-400">Cubic Tier:</span>
                          <span className="font-semibold text-slate-700">
                            {(() => {
                              const sz = selectedOrderDetail.shipmentInfo.size || '';
                              if (sz.includes('15 x 11') || sz.includes('15x11')) return 'Cubic 10 (15x11x1)';
                              if (sz.includes('7 x 5') || sz.includes('7x5')) return 'Cubic 30 (7x5x14)';
                              return 'Cubic 40 (12x3x15)';
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Postal Service Specifications */}
                    <div className="border border-slate-100 rounded-xl p-4 bg-white shadow-2xs space-y-3">
                      <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-50">
                        <Globe className="h-3.5 w-3.5 text-slate-405" />
                        <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Service Selected</h4>
                      </div>
                      <div className="space-y-2 text-[12px]">
                        <div className="grid grid-cols-[85px_1fr] gap-x-2">
                          <span className="text-slate-400">Mail Class:</span>
                          <span className="font-extrabold text-slate-800 break-words leading-tight">
                            {selectedOrderDetail.shipmentInfo.service || selectedOrderDetail.shipmentInfo.shippingMethod || 'USPS GroundAdvantage - NSA Account'}
                          </span>
                        </div>
                        <div className="grid grid-cols-[85px_1fr] gap-x-2">
                          <span className="text-slate-400">Label Link:</span>
                          <span className="text-blue-600 underline font-semibold select-all break-all text-left">
                            <a 
                              href={selectedOrderDetail.shipmentInfo.labelLink || '#'} 
                              target="_blank" 
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 hover:text-blue-700"
                            >
                              Open Sample Label
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          </span>
                        </div>
                        <div className="grid grid-cols-[85px_1fr] gap-x-2">
                          <span className="text-slate-400">Printed on:</span>
                          <span className="text-slate-500 font-mono">
                            {selectedOrderDetail.shipmentInfo.printedDate || selectedOrderDetail.shipmentInfo.shipDate || '2026-06-18 03:37:13'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
                <button
                  type="button"
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>Print Label</title>
                            <style>
                              body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif; background: #fff; }
                              .box { width: 4in; height: 6in; border: 3px solid #000; padding: 25px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; }
                              .text-bold { font-weight: bold; }
                              .title { font-size: 24px; font-weight: 900; border-bottom: 5px solid #000; padding-bottom: 5px; text-transform: uppercase; }
                            </style>
                          </head>
                          <body>
                            <div class="box">
                              <div class="title">\${selectedOrderDetail.shipmentInfo?.carrier || 'UPS'} GROUND</div>
                              <div style="font-size: 11px; margin-top: 15px;">
                                <div class="text-bold">SENDER:</div>
                                <div>\${selectedOrderDetail.shipmentInfo?.senderDetails?.name || 'Hiep Admin'}</div>
                                <div>\${selectedOrderDetail.shipmentInfo?.senderDetails?.company || 'SwiftPOD LLC - Warehouse A'}</div>
                                <div>\${selectedOrderDetail.shipmentInfo?.senderDetails?.address || '2070 S 7th St. Ste E, San Jose, CA 95112'}</div>
                              </div>
                              <div style="font-size: 11px; margin-top: 20px;">
                                <div class="text-bold">SHIP TO:</div>
                                <div>\${selectedOrderDetail.shipmentInfo?.recipientDetails ? \`\${selectedOrderDetail.shipmentInfo.recipientDetails.firstName} \${selectedOrderDetail.shipmentInfo.recipientDetails.lastName}\` : (selectedOrderDetail.shipAddress?.name || 'Demi Wilkinson')}</div>
                                <div>\${selectedOrderDetail.shipmentInfo?.recipientDetails?.company || selectedOrderDetail.shipAddress?.companyLine || ''}</div>
                                <div>\${selectedOrderDetail.shipmentInfo?.recipientDetails?.address1 || selectedOrderDetail.shipAddress?.addressLine || 'Store Boutique (Phoenix)'}</div>
                                <div>\${selectedOrderDetail.shipmentInfo?.recipientDetails ? \`\${selectedOrderDetail.shipmentInfo.recipientDetails.city || ''}, \${selectedOrderDetail.shipmentInfo.recipientDetails.zip || ''}, \${selectedOrderDetail.shipmentInfo.recipientDetails.country || 'United States'}\` : (selectedOrderDetail.destination || 'United States')}</div>
                              </div>
                              <div style="border-top: 2px solid #000; padding-top: 15px; margin-top: 30px; font-size: 12px; font-family: monospace; text-align: center;">
                                TRACKING #: \${selectedOrderDetail.shipmentInfo?.trackingNumber || '1LSDBVU000ZLLNI'}
                                <div style="background: #000; height: 45px; margin-top: 5px; width: 100%;"></div>
                              </div>
                            </div>
                            <script>window.print();<\/script>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                    }
                  }}
                  className="px-4 py-2 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold hover:text-slate-900 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>Reprint Sticker</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsShipmentDetailsModalOpen(false)}
                  className="px-5 py-2 border border-slate-200 hover:border-slate-350 bg-white hover:bg-slate-50 text-slate-800 rounded-lg text-xs font-semibold hover:text-slate-900 transition flex items-center justify-center cursor-pointer shadow-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE NEW WAREHOUSE SUB-MODAL (SHIPPING CREATION OVERLAY) */}
      <AnimatePresence>
        {isAddingNewWarehouse && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingNewWarehouse(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl p-6 border border-slate-150 z-[130] space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-sans text-left">
                  Create New Warehouse
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddingNewWarehouse(false)}
                  className="p-1 hover:bg-slate-100 rounded-full transition cursor-pointer text-slate-400 hover:text-slate-600 outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Six row high-fidelity form layout */}
              <div className="space-y-3 font-sans text-xs text-left">
                {/* Display Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Warehouse Name *
                  </label>
                  <input
                    type="text"
                    value={newWhName}
                    onChange={(e) => setNewWhName(e.target.value)}
                    placeholder="Warehouse C"
                    className="h-10 px-3.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
                  />
                </div>

                {/* Row 1: First name * & Last name * */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      First name *
                    </label>
                    <input
                      type="text"
                      value={newWhFirstName}
                      onChange={(e) => setNewWhFirstName(e.target.value)}
                      placeholder="Jane"
                      className="h-10 px-3.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Last name *
                    </label>
                    <input
                      type="text"
                      value={newWhLastName}
                      onChange={(e) => setNewWhLastName(e.target.value)}
                      placeholder="Doe"
                      className="h-10 px-3.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
                    />
                  </div>
                </div>

                {/* Row 2: Company & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Company
                    </label>
                    <input
                      type="text"
                      value={newWhCompany}
                      onChange={(e) => setNewWhCompany(e.target.value)}
                      placeholder="SwiftPOD LLC - Warehouse C"
                      className="h-10 px-3.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newWhEmail}
                      onChange={(e) => setNewWhEmail(e.target.value)}
                      placeholder="warehouse-c@swiftpod.live"
                      className="h-10 px-3.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
                    />
                  </div>
                </div>

                {/* Row 3: Phone & Country * */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={newWhPhone}
                      onChange={(e) => setNewWhPhone(e.target.value)}
                      placeholder="408-555-0200"
                      className="h-10 px-3.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Country *
                    </label>
                    <input
                      type="text"
                      value={newWhCountry}
                      onChange={(e) => setNewWhCountry(e.target.value)}
                      placeholder="United States"
                      className="h-10 px-3.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
                    />
                  </div>
                </div>

                {/* Row 4: Address Line 1 */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    value={newWhAddress1}
                    onChange={(e) => setNewWhAddress1(e.target.value)}
                    placeholder="123 Shipping Lane"
                    className="h-10 px-3.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
                  />
                </div>

                {/* Row 5: Address Line 2 (Optional) */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    value={newWhAddress2}
                    onChange={(e) => setNewWhAddress2(e.target.value)}
                    placeholder="Suite 200 or Bldg 2"
                    className="h-10 px-3.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
                  />
                </div>

                {/* Row 6: City * & ZIP / Postcode * */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      City *
                    </label>
                    <input
                      type="text"
                      value={newWhCity}
                      onChange={(e) => setNewWhCity(e.target.value)}
                      placeholder="San Jose"
                      className="h-10 px-3.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      ZIP / Postcode *
                    </label>
                    <input
                      type="text"
                      value={newWhZip}
                      onChange={(e) => setNewWhZip(e.target.value)}
                      placeholder="95112"
                      className="h-10 px-3.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setIsAddingNewWarehouse(false)}
                  className="px-4.5 h-9 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-bold transition duration-150 cursor-pointer shadow-sm font-sans outline-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!newWhName.trim() || !newWhFirstName.trim() || !newWhLastName.trim() || !newWhCountry.trim() || !newWhAddress1.trim() || !newWhCity.trim() || !newWhZip.trim()) {
                      triggerToast('Name, First name, Last name, Country, Address Line 1, City, and ZIP/Postcode are required.', 'info');
                      return;
                    }
                    
                    const finalWh = {
                      name: newWhName.trim(),
                      company: newWhCompany.trim() || `${newWhFirstName.trim()} ${newWhLastName.trim()}`,
                      firstName: newWhFirstName.trim(),
                      lastName: newWhLastName.trim(),
                      email: newWhEmail.trim() || 'warehouse@swiftpod.live',
                      phone: newWhPhone.trim() || '408-555-0199',
                      country: newWhCountry.trim(),
                      address1: newWhAddress1.trim(),
                      address2: newWhAddress2.trim(),
                      city: newWhCity.trim(),
                      zip: newWhZip.trim(),
                    };

                    setWarehousePresets((prev) => [...prev, finalWh]);
                    setSelectedWarehouseForLabel(finalWh.name);
                    
                    // Directly switch form fields of sender to this new warehouse!
                    setSenderFirstName(finalWh.firstName);
                    setSenderLastName(finalWh.lastName);
                    setSenderCompany(finalWh.company);
                    setSenderEmail(finalWh.email);
                    setSenderPhone(finalWh.phone);
                    setSenderCountry(finalWh.country);
                    setSenderAddress1(finalWh.address1);
                    setSenderAddress2(finalWh.address2);
                    setSenderCity(finalWh.city);
                    setSenderZip(finalWh.zip);

                    // Reset form fields
                    setNewWhName('');
                    setNewWhCompany('');
                    setNewWhFirstName('');
                    setNewWhLastName('');
                    setNewWhEmail('');
                    setNewWhPhone('');
                    setNewWhCountry('United States');
                    setNewWhAddress1('');
                    setNewWhAddress2('');
                    setNewWhCity('');
                    setNewWhZip('');

                    setIsAddingNewWarehouse(false);
                    triggerToast(`New warehouse "${finalWh.name}" created and selected!`, 'success');
                  }}
                  className="px-4.5 h-9 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold transition duration-150 cursor-pointer shadow-sm font-sans outline-none"
                >
                  Create & Select
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SHIPMENT VIEW MODAL (VIEW DETAIL OF CREATED SHIPMENT) */}
      <AnimatePresence>
        {isShipmentViewModalOpen && selectedShipmentForView && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShipmentViewModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal Dialog container - Clean White Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.18 }}
              className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 z-50 my-8 mx-auto text-slate-800 animate-in fade-in zoom-in-95 duration-100 font-sans"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex flex-col gap-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 tracking-tight text-sm">Print Shipment Label</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded font-mono uppercase">{selectedShipmentForView.carrier}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Tracking: <code className="bg-slate-50 px-1 py-0.5 rounded border border-slate-100 text-brand-600 font-mono font-bold select-all">{selectedShipmentForView.trackingNumber}</code>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Select format dropdown */}
                  <div className="flex items-center gap-1.5">
                    <select
                      value={shipmentPreviewFormat}
                      onChange={(e) => {
                        setShipmentPreviewFormat(e.target.value);
                        triggerToast(`Switched preview to ${e.target.value} format`, 'info');
                      }}
                      className="bg-slate-50 border border-slate-200 text-slate-705 text-xs rounded-lg px-2 py-1 font-semibold focus:outline-none focus:border-brand-500 hover:bg-slate-100 transition cursor-pointer"
                    >
                      <option value="PDF">PDF (.pdf)</option>
                      <option value="ZPL">ZPL (.zpl)</option>
                      <option value="EPL">EPL (.epl)</option>
                      <option value="PNG">Image (.png)</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsShipmentViewModalOpen(false)}
                    className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body - Framed Gray Print Preview Area */}
              <div className="p-6 bg-slate-200 border-b border-slate-150 flex flex-col items-center justify-center relative min-h-[440px]">
                
                {/* Print Layout Overlay markings to mimic standard Ctrl+P layout */}
                <div className="absolute top-2 left-4 text-[9px] font-mono text-slate-400 uppercase select-none tracking-wider">
                  Target: 4.00" x 6.00" ({shipmentPreviewFormat} format)
                </div>
                <div className="absolute bottom-2 right-4 text-[9px] font-mono text-slate-400 select-none">
                  Scale: 100% Fit
                </div>

                {/* Printable High-Fidelity Sticker centered on simulated gray printer canvas */}
                <div className="w-full max-w-[280px] bg-white border border-slate-350 rounded-xs p-4 text-slate-950 font-sans shadow-lg select-all relative overflow-hidden transition-transform duration-200">
                  
                  {/* Watermark badge for raw ZPL/EPL if selected */}
                  {(shipmentPreviewFormat === 'ZPL' || shipmentPreviewFormat === 'EPL') && (
                    <div className="absolute top-12 -right-10 bg-amber-500 text-white text-[7px] font-black py-0.5 px-10 rotate-45 select-none text-center shadow-xs">
                      {shipmentPreviewFormat} CORE STRIP
                    </div>
                  )}

                  {/* Header carrier routing */}
                  <div className="flex justify-between items-start border-b-2 border-slate-900 pb-2 mb-2 font-black leading-none tracking-tighter">
                    <div className="text-[17px]">
                      {selectedShipmentForView.carrier === 'UPS' ? 'UPS GROUND' :
                       selectedShipmentForView.carrier === 'FedEx' ? 'FEDEX PRIORITY' :
                       selectedShipmentForView.carrier === 'USPS' ? 'USPS FIRST-CLASS' : 'DHL AIR'}
                    </div>
                  </div>

                  {/* From address block */}
                  <div className="text-[8.5px] font-bold leading-tight scale-y-95 transform origin-top mb-1.5 text-left">
                    <span className="block font-black text-[6.5px] uppercase tracking-wide">SHIP FROM:</span>
                    {selectedShipmentForView.senderDetails?.name || 'SwiftPOD LLC'}
                    <br />
                    {selectedShipmentForView.senderDetails?.address || '2070 S 7th St. Ste E , San Jose'}
                  </div>

                  {/* Ship To address block */}
                  <div className="border-t border-slate-400 pt-1.5 mb-2 text-left">
                    <span className="block font-black text-[6.5px] uppercase tracking-wide">SHIP TO:</span>
                    <p className="text-[10.5px] font-extrabold leading-tight">
                      {selectedShipmentForView.recipientDetails?.firstName} {selectedShipmentForView.recipientDetails?.lastName}
                    </p>
                    <p className="text-[8.5px] font-semibold leading-tight mt-0.5">
                      {selectedShipmentForView.recipientDetails?.company || 'Acme Group Hub'}
                      <br />
                      {selectedShipmentForView.recipientDetails?.address1}
                      {selectedShipmentForView.recipientDetails?.address2 && `, ${selectedShipmentForView.recipientDetails.address2}`}
                      <br />
                      <span className="font-extrabold text-[9.5px]">{selectedShipmentForView.recipientDetails?.city?.toUpperCase()}, {selectedShipmentForView.recipientDetails?.zip}</span>
                    </p>
                  </div>

                  {/* BARCODE GRAPHIC */}
                  <div className="flex flex-col items-center justify-center py-2 space-y-1 select-none border-t border-slate-400">
                    <div className="w-full h-11 flex items-stretch gap-[1.5px] scale-x-95">
                      {[1, 3, 1, 1, 4, 1, 2, 1, 3, 1, 2, 4, 1, 1, 3, 2, 1, 1, 4, 1, 2, 1, 3, 1, 2, 4, 1, 1, 3, 2, 1, 4, 1, 2, 1, 3, 1, 2, 4].map((width, barIdx) => (
                        <div
                          key={barIdx}
                          className={`flex-1 ${barIdx % 2 === 0 ? 'bg-slate-950' : 'bg-transparent'}`}
                          style={{ flexGrow: width }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[8.5px] font-black tracking-widest mt-0.5 text-center block">
                      *(1Z) {selectedShipmentForView.trackingNumber}*
                    </span>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-slate-50 flex items-center justify-end gap-2.5 font-semibold text-xs rounded-b-xl border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsShipmentViewModalOpen(false)}
                  className="px-4 h-9 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg transition font-bold cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerToast(`Downloaded ${shipmentPreviewFormat} payload package successfully.`, "success");
                  }}
                  className="px-4 h-9 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg transition font-bold cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download {shipmentPreviewFormat}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerToast("Sent print job to local thermo printer spooler.", "success");
                    setIsShipmentViewModalOpen(false);
                  }}
                  className="px-5 h-9 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition font-bold cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Label</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LOGOUT CONFIRMATION MODAL */}
      <AnimatePresence>
        {isLogoutConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogoutConfirmOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal Dialog container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.18 }}
              className="relative w-full max-w-sm bg-white rounded-xl shadow-xl overflow-hidden flex flex-col border border-slate-100 z-10"
            >
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 select-none">
                <h2 className="text-base font-bold text-slate-900 tracking-tight font-sans">
                  Confirm Log Out
                </h2>
                <button
                  type="button"
                  onClick={() => setIsLogoutConfirmOpen(false)}
                  className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-full transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600 font-sans leading-relaxed">
                  Are you sure you want to log out of your session? Any unsaved changes in current entries will be dismissed.
                </p>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsLogoutConfirmOpen(false)}
                    className="px-4 h-9 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold hover:text-slate-900 transition cursor-pointer font-sans"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogoutConfirmOpen(false);
                      triggerToast('Logged out successfully', 'success');
                    }}
                    className="px-5 h-9 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold hover:shadow-sm transition cursor-pointer font-sans"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {hoveredProductImage && (() => {
        const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
        const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
        let displayX = hoveredProductImage.x;
        let displayY = hoveredProductImage.y;
        
        if (displayX + 260 > screenWidth) {
          displayX = Math.max(10, displayX - 320);
        }
        if (displayY + 260 > screenHeight) {
          displayY = Math.max(10, screenHeight - 260);
        }
        if (displayY < 10) {
          displayY = 10;
        }
        
        return (
          <div 
            className="fixed z-[9999] p-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-2xl pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95 ease-out"
            style={{
              left: `${displayX}px`,
              top: `${displayY}px`,
              width: '240px',
              height: '240px'
            }}
          >
            <div className="w-full h-full rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-100">
              <img 
                src={hoveredProductImage.url} 
                alt="Product Preview" 
                className="max-h-full max-w-full object-contain p-2"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        );
      })()}

    </div>
  );
}
