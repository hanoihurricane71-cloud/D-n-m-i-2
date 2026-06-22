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
  MessageSquarePlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Product, TabType, PurchaseOrder, PurchaseOrderItem, AdditionItem, LocationItem, LocationHistoryItem, OrderManagementItem } from './types';
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

  // Active Navigation item
  const [activeNavItem, setActiveNavItem] = useState<'Order' | 'Product' | 'Purchase order' | 'WIP printing' | 'Addition' | 'Location'>('Product');

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
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [orderRejectReasonText, setOrderRejectReasonText] = useState('');
  const [isRejectingOrder, setIsRejectingOrder] = useState(false);
  const [pendingShippingMethod, setPendingShippingMethod] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<OrderManagementItem | null>(null);
  const [orderCommentText, setOrderCommentText] = useState('');
  const [initialInternalNote, setInitialInternalNote] = useState('');
  const [internalNoteDraft, setInternalNoteDraft] = useState('');

  useEffect(() => {
    setPendingShippingMethod(null);
    setOrderCommentText('');
    setInternalNoteDraft('');
    setInitialInternalNote(selectedOrderDetail?.internalNotes || '');
  }, [selectedOrderDetail?.id]);

  const [isDetailActionsOpen, setIsDetailActionsOpen] = useState(false);
  const [detailMenuTab, setDetailMenuTab] = useState<'main' | 'status' | 'shipping'>('main');

  useEffect(() => {
    setIsDetailActionsOpen(false);
    setDetailMenuTab('main');
  }, [selectedOrderDetail?.id]);

  const handleUpdateShippingMethod = (newMethod: string) => {
    if (!selectedOrderDetail) return;
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
  };

  const handleUpdateOrderStatus = (newStatus: string) => {
    if (!selectedOrderDetail) return;
    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const newAct = {
      id: `act_${Date.now()}`,
      date: nowStr,
      action: `Order status updated to ${newStatus}`,
      performedBy: 'Hiep Admin'
    };

    setOrders(prev => prev.map(o => {
      if (o.id === selectedOrderDetail.id) {
        return { 
          ...o, 
          orderStatus: newStatus as any,
          activityHistory: [newAct, ...(o.activityHistory || [])]
        };
      }
      return o;
    }));

    setSelectedOrderDetail(prev => prev ? { 
      ...prev, 
      orderStatus: newStatus as any,
      activityHistory: [newAct, ...(prev.activityHistory || [])]
    } : null);

    triggerToast(`Order status updated to ${newStatus}`, 'success');
  };

  const handleUpdateShippingLabel = () => {
    if (!selectedOrderDetail) return;
    const labelLink = "https://www.orimi.com/pdf-test.pdf";
    const service = selectedOrderDetail.shippingMethod || 'UPS Ground';
    const trackingNumber = `1Z${Math.floor(100000 + Math.random() * 900000)}Y${Math.floor(100000 + Math.random() * 900000)}`;
    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const newAct = {
      id: `act_${Date.now()}`,
      date: nowStr,
      action: `Created Shipping Label (Carrier: UPS, Tracking: ${trackingNumber})`,
      performedBy: 'Hiep Admin'
    };

    setOrders(prev => prev.map(o => {
      if (o.id === selectedOrderDetail.id) {
        return { 
          ...o, 
          trackingNumber,
          shipmentInfo: {
            trackingNumber,
            carrier: 'UPS',
            service,
            shipDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            weight: '1.2 lbs',
            size: '12x9x3 in',
            price: '$12.50',
            labelLink
          },
          activityHistory: [newAct, ...(o.activityHistory || [])]
        };
      }
      return o;
    }));

    setSelectedOrderDetail(prev => prev ? { 
      ...prev, 
      trackingNumber,
      shipmentInfo: {
        trackingNumber,
        carrier: 'UPS',
        service,
        shipDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        weight: '1.2 lbs',
        size: '12x9x3 in',
        price: '$12.50',
        labelLink
      },
      activityHistory: [newAct, ...(prev.activityHistory || [])]
    } : null);

    triggerToast(`Shipping Label generated successfully!`, 'success');
  };

  const [isEditingShipAddress, setIsEditingShipAddress] = useState(false);
  const [shipName, setShipName] = useState('');
  const [shipCompanyLine, setShipCompanyLine] = useState('');
  const [shipAddressLine, setShipAddressLine] = useState('');
  const [shipCityStateZip, setShipCityStateZip] = useState('');
  const [shipPhone, setShipPhone] = useState('');

  useEffect(() => {
    if (selectedOrderDetail) {
      const sAddr = selectedOrderDetail.shipAddress || {
        name: 'Auo Tivi',
        companyLine: '123',
        addressLine: '3002 WOLF LAKE BLVD, NEW ALBANY,',
        cityStateZip: 'Indiana, 80201, US',
        phone: '9734508586'
      };
      setShipName(sAddr.name);
      setShipCompanyLine(sAddr.companyLine);
      setShipAddressLine(sAddr.addressLine);
      setShipCityStateZip(sAddr.cityStateZip);
      setShipPhone(sAddr.phone);
      setIsEditingShipAddress(false);
    }
  }, [selectedOrderDetail?.id]);

  const handleSaveShipAddress = () => {
    if (!selectedOrderDetail) return;
    const updatedShipAddress = {
      name: shipName,
      companyLine: shipCompanyLine,
      addressLine: shipAddressLine,
      cityStateZip: shipCityStateZip,
      phone: shipPhone
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
      selectedStyle !== 'All Styles' ||
      selectedColor !== 'All Colors' ||
      selectedSize !== 'All Sizes' ||
      selectedStock !== 'All Statuses' ||
      selectedCustomer !== 'All Customers' ||
      createdDateFilter !== 'All Dates' ||
      selectedStyleTypeFilter !== 'All Types'
    );
  }, [searchQuery, selectedStyle, selectedColor, selectedSize, selectedStock, selectedCustomer, createdDateFilter, selectedStyleTypeFilter]);

  // Handle Filtering Math
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesSku = product.sku.toLowerCase().includes(query);
        const matchesCustomer = product.customer.toLowerCase().includes(query);
        const matchesUser = product.user.toLowerCase().includes(query);
        if (!matchesName && !matchesSku && !matchesCustomer && !matchesUser) {
          return false;
        }
      }

      // 2. Style Filter
      if (selectedStyle !== 'All Styles') {
        const filterStr = selectedStyle.toLowerCase();
        if (!product.sku.toLowerCase().includes(filterStr)) return false;
      }

      // 3. Color Filter
      if (selectedColor !== 'All Colors') {
        const filterStr = selectedColor.toLowerCase();
        if (!product.sku.toLowerCase().includes(filterStr)) return false;
      }

      // 4. Size Filter
      if (selectedSize !== 'All Sizes') {
        const filterStr = selectedSize.toLowerCase();
        // Look for boundaries style e.g. " / XL"
        if (!product.sku.toLowerCase().includes(`/ ${filterStr.toLowerCase()}`) && 
            !product.sku.toLowerCase().endsWith(filterStr.toLowerCase())) return false;
      }

      // 5. Stock Status Filter
      if (selectedStock !== 'All Statuses') {
        if (selectedStock === 'In stock') {
          if (!product.stockQty.toLowerCase().includes('in stock')) return false;
        } else if (selectedStock === 'Out of stock') {
          if (!product.stockQty.toLowerCase().includes('out of stock')) return false;
        }
      }

      // 6. Customer Filter
      if (selectedCustomer !== 'All Customers') {
        if (product.customer !== selectedCustomer) return false;
      }

      // 7. Created Date Picker Filter
      if (createdDateFilter !== 'All Dates') {
        const productDateStr = parseDateString(product.createdAt);
        if (productDateStr !== createdDateFilter) return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedStyle, selectedColor, selectedSize, selectedStock, selectedCustomer, createdDateFilter]);

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
        return 'Product name';
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
    <div className="min-h-screen bg-[#F4F5F7] font-sans text-slate-800 flex flex-col md:flex-row antialiased">
      
      {/* LEFT SIDEBAR - Desktop and dynamic responsive overlay */}
      <aside className="w-full md:w-64 md:h-screen md:sticky md:top-0 bg-white border-b md:border-b-0 md:border-r border-slate-200/80 flex flex-col justify-between shrink-0">
        <div className="p-5 flex flex-col gap-6">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 group logo-group select-none">
            <div className="h-9 w-9 logo-gradient rounded-xl flex items-center justify-center text-white font-extrabold shadow-sm relative overflow-hidden">
              <span className="relative z-10 text-base font-display">S</span>
            </div>
            <div>
              <span className="font-display font-bold text-lg tracking-tight logo-text-gradient block leading-none">SwiftPOD</span>
            </div>
          </div>

          {/* Navigation group */}
          <nav className="space-y-1.5" id="sidebar-navigation">
            <button
              onClick={() => setActiveNavItem('Order')}
              className={`
                w-full flex items-center gap-3 px-3.5 py-2.5 text-left text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer
                ${activeNavItem === 'Order' 
                  ? 'bg-slate-100/90 text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              <ClipboardList className={`h-5 w-5 ${activeNavItem === 'Order' ? 'text-brand-600' : 'text-slate-400'}`} />
              <span>Order</span>
              {activeNavItem === 'Order' && (
                <span className="ml-auto block h-1.5 w-1.5 rounded-full bg-brand-600" />
              )}
            </button>

            <button
              onClick={() => setActiveNavItem('Product')}
              className={`
                w-full flex items-center gap-3 px-3.5 py-2.5 text-left text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer
                ${activeNavItem === 'Product' 
                  ? 'bg-slate-100/90 text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              <Shirt className={`h-5 w-5 ${activeNavItem === 'Product' ? 'text-brand-600' : 'text-slate-400'}`} />
              <span>Product</span>
              {activeNavItem === 'Product' && (
                <span className="ml-auto block h-1.5 w-1.5 rounded-full bg-brand-600" />
              )}
            </button>

            <button
              onClick={() => {
                setActiveNavItem('Purchase order');
              }}
              className={`
                w-full flex items-center gap-3 px-3.5 py-2.5 text-left text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer
                ${activeNavItem === 'Purchase order' 
                  ? 'bg-slate-100/90 text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              <ShoppingCart className={`h-5 w-5 ${activeNavItem === 'Purchase order' ? 'text-brand-600' : 'text-slate-400'}`} />
              <span>WRO</span>
              {activeNavItem === 'Purchase order' && (
                <span className="ml-auto block h-1.5 w-1.5 rounded-full bg-brand-600" />
              )}
            </button>

            <button
              onClick={() => {
                setActiveNavItem('WIP printing');
              }}
              className={`
                w-full flex items-center gap-3 px-3.5 py-2.5 text-left text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer
                ${activeNavItem === 'WIP printing' 
                  ? 'bg-slate-100/90 text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              <QrCode className={`h-5 w-5 ${activeNavItem === 'WIP printing' ? 'text-brand-600' : 'text-slate-400'}`} />
              <span className="truncate">WIP printing</span>
              {activeNavItem === 'WIP printing' && (
                <span className="ml-auto block h-1.5 w-1.5 rounded-full bg-brand-600 shrink-0" />
              )}
            </button>

            <button
              onClick={() => {
                setActiveNavItem('Addition');
              }}
              className={`
                w-full flex items-center gap-3 px-3.5 py-2.5 text-left text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer
                ${activeNavItem === 'Addition' 
                  ? 'bg-slate-100/90 text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              <PackagePlus className={`h-5 w-5 ${activeNavItem === 'Addition' ? 'text-brand-600' : 'text-slate-400'}`} />
              <span>Addition</span>
              {activeNavItem === 'Addition' && (
                <span className="ml-auto block h-1.5 w-1.5 rounded-full bg-brand-600" />
              )}
            </button>

            <button
              onClick={() => {
                setActiveNavItem('Location');
              }}
              className={`
                w-full flex items-center gap-3 px-3.5 py-2.5 text-left text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer
                ${activeNavItem === 'Location' 
                  ? 'bg-slate-100/90 text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              <div className="relative h-5 w-5 shrink-0 flex items-center justify-center">
                <Package className={`h-5 w-5 ${activeNavItem === 'Location' ? 'text-brand-600' : 'text-slate-400'}`} />
                <div className={`absolute -bottom-1 -right-1 rounded-full p-[1px] border border-white/60 shadow-xs flex items-center justify-center ${activeNavItem === 'Location' ? 'bg-slate-100' : 'bg-white'}`}>
                  <MapPin className={`h-2.5 w-2.5 ${activeNavItem === 'Location' ? 'text-brand-600' : 'text-slate-400'}`} />
                </div>
              </div>
              <span>Location</span>
              {activeNavItem === 'Location' && (
                <span className="ml-auto block h-1.5 w-1.5 rounded-full bg-brand-600" />
              )}
            </button>
          </nav>

        </div>

        {/* User Profile Info Card & Footer bottom-left */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors group relative">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120"
              alt="Hiep Tran avatar"
              referrerPolicy="no-referrer"
              className="h-10 w-10 rounded-full object-cover border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-slate-800 block truncate leading-tight">
                Hiep Tran
              </span>
              <span className="text-xs text-slate-500 block truncate">
                hiep@readulikeabook.com
              </span>
            </div>
            <button 
              type="button" 
              onClick={(e) => {
                e.stopPropagation();
                triggerToast('User Profile action menu triggers', 'info');
              }}
              className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {/* Micro developer reference notice popped on hover */}
            <div className="absolute bottom-12 left-2 right-2 bg-slate-900 text-slate-200 text-[11px] p-2 rounded-lg opacity-0 transition-opacity pointer-events-none group-hover:opacity-100 shadow-lg border border-slate-700 font-mono z-50">
              Dev Admin Acc: <strong>admin123</strong>
            </div>
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN PANEL - Floating style container inside matching light gray canvas */}
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
        <div id="main-content-card" className="bg-white rounded-2xl shadow-sm border border-slate-100/90 flex flex-col">
          
          {activeNavItem === 'Order' ? (
            <>
              {/* Header context */}
              <div className="px-6 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold font-sans text-slate-800 leading-tight">Order</h1>
                </div>
              </div>

              {/* Filters Area */}
              <div className="px-6 pt-5 pb-2 flex flex-wrap items-center gap-2.5 justify-start">
                {/* Search Bar - expands transitionally on focus */}
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
                    
                    {/* From Date trigger button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (orderDateFromRef.current) {
                          try {
                            orderDateFromRef.current.showPicker();
                          } catch (err) {
                            orderDateFromRef.current.click();
                          }
                        }
                      }}
                      className="hover:text-brand-600 transition cursor-pointer font-semibold outline-none"
                    >
                      {orderDateFrom 
                        ? new Date(orderDateFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
                        : 'From date'
                      }
                    </button>
                    
                    {orderDateFrom && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOrderDateFrom('');
                          setOrderCurrentPage(1);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation();
                            setOrderDateFrom('');
                            setOrderCurrentPage(1);
                          }
                        }}
                        className="p-1 hover:bg-brand-100/80 rounded-md text-brand-600 transition duration-150 cursor-pointer flex items-center justify-center shrink-0 ml-1 mr-0.5"
                        title="Clear from date"
                      >
                        <X className="h-3 w-3" />
                      </span>
                    )}

                    <span className="text-slate-400 mx-2 select-none font-normal">—</span>

                    {/* To Date trigger button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (orderDateToRef.current) {
                          try {
                            orderDateToRef.current.showPicker();
                          } catch (err) {
                            orderDateToRef.current.click();
                          }
                        }
                      }}
                      className="hover:text-brand-600 transition cursor-pointer font-semibold outline-none"
                    >
                      {orderDateTo 
                        ? new Date(orderDateTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
                        : 'To date'
                      }
                    </button>

                    {orderDateTo && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOrderDateTo('');
                          setOrderCurrentPage(1);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation();
                            setOrderDateTo('');
                            setOrderCurrentPage(1);
                          }
                        }}
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
                    onChange={(e) => {
                      const val = e.target.value;
                      setOrderDateFrom(val || '');
                      setOrderCurrentPage(1);
                    }}
                    className="absolute pointer-events-none opacity-0 w-0 h-0 text-transparent bg-transparent border-0"
                    style={{ top: '50%', left: '25%' }}
                  />
                  <input
                    type="date"
                    ref={orderDateToRef}
                    value={orderDateTo}
                    onChange={(e) => {
                      const val = e.target.value;
                      setOrderDateTo(val || '');
                      setOrderCurrentPage(1);
                    }}
                    className="absolute pointer-events-none opacity-0 w-0 h-0 text-transparent bg-transparent border-0"
                    style={{ top: '50%', left: '75%' }}
                  />
                </div>

                {/* Reset Filters */}
                {(orderSearchQuery || orderProductQuery || orderStyleFilter !== 'All Styles' || orderColorFilter !== 'All Colors' || orderSizeFilter !== 'All Sizes' || orderStatusFilter !== 'All statuses' || orderCustomerFilter !== 'All Customers' || orderShippingStatusFilter !== 'All shipping statuses' || orderShipMethodFilter !== 'All methods' || orderDateFrom || orderDateTo) && (
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
                      orderPagedItems.map((order) => {
                        return (
                          <tr key={order.id} className="border-b border-slate-100/70 hover:bg-slate-50/40 transition-colors group">
                            {/* Order Number (clickable) */}
                            <td className="py-3 px-6 font-semibold font-mono text-slate-900 select-all whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrderDetail(order);
                                  setIsOrderDetailOpen(true);
                                }}
                                className="text-brand-600 hover:text-brand-700 underline decoration-dashed decoration-brand-300 underline-offset-4 hover:decoration-solid font-medium font-mono text-left focus:outline-none cursor-pointer transition-colors"
                              >
                                {order.orderNumber}
                              </button>
                            </td>
                            {/* Ref Number (clickable) */}
                            <td className="py-3 px-6 font-semibold font-mono text-slate-900 select-all whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrderDetail(order);
                                  setIsOrderDetailOpen(true);
                                }}
                                className="text-brand-600 hover:text-brand-700 underline decoration-dashed decoration-brand-300 underline-offset-4 hover:decoration-solid font-medium font-mono text-left focus:outline-none cursor-pointer transition-colors"
                              >
                                {order.refNumber || 'REF-N/A'}
                              </button>
                            </td>
                            {/* Order Date */}
                            <td className="py-3 px-6 text-slate-600 whitespace-nowrap font-normal">
                              {order.orderDate}
                            </td>
                            {/* Store Name / Customer */}
                            <td className="py-3 px-6 text-slate-800 font-semibold font-sans whitespace-nowrap truncate max-w-[180px]" title={order.customerStore}>
                              {order.customerStore}
                            </td>
                            {/* Qty */}
                            <td className="py-3 px-6 text-right text-slate-600 font-mono font-normal whitespace-nowrap">
                              {order.quantity.toLocaleString('en-US')}
                            </td>
                            {/* Order Status badge (Preview Only) */}
                            <td className="py-3 px-6 font-normal whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border ${
                                order.orderStatus === 'New'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : order.orderStatus === 'In Production'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : order.orderStatus === 'Shipped'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : order.orderStatus === 'On Hold'
                                  ? 'bg-slate-100 text-slate-700 border-slate-200'
                                  : order.orderStatus === 'Rejected'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                              }`}>
                                {order.orderStatus}
                              </span>
                            </td>
                            {/* Shipping Status */}
                            <td className="py-3 px-6 font-normal whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border ${
                                order.shippingStatus === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : order.shippingStatus === 'In Transit'
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : order.shippingStatus === 'Out for Delivery'
                                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                  : order.shippingStatus === 'Pre Transit'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : order.shippingStatus === 'Available For Pickup'
                                  ? 'bg-teal-50 text-teal-700 border-teal-200'
                                  : order.shippingStatus === 'Return To Sender'
                                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                                  : order.shippingStatus === 'Failure'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : order.shippingStatus === 'Cancelled'
                                  ? 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                                  : 'bg-slate-100 text-slate-700 border-slate-200 font-sans'
                              }`}>
                                {order.shippingStatus || 'Unknown'}
                              </span>
                            </td>
                            {/* Shipping Method */}
                            <td className="py-3 px-6 text-slate-600 whitespace-nowrap font-normal">
                              {order.shippingMethod || '—'}
                            </td>
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
                                      triggerToast(`Copied tracking number to clipboard.`, 'success');
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
                            {/* Destination (Domestic / International) */}
                            <td className="py-3 px-6 font-normal font-sans whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {order.destinationType === 'International' ? (
                                  <Globe className="h-4 w-4 text-amber-500 shrink-0" />
                                ) : (
                                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                                )}{' '}
                                <div className="flex flex-col">
                                  <span className="text-slate-800 font-semibold text-xs leading-none">
                                    {order.destination || '—'}
                                  </span>
                                  <span className={`text-[9px] font-bold tracking-wider leading-none mt-1 ${
                                    order.destinationType === 'International' ? 'text-amber-600' : 'text-slate-400'
                                  }`}>
                                    {order.destinationType === 'International' ? 'INTERNATIONAL' : 'DOMESTIC'}
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })
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
                    onClick={() => setOrderCurrentPage(prev => Math.max(1, prev - 1))}
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
                    onClick={() => setOrderCurrentPage(prev => Math.min(orderTotalPages, prev + 1))}
                    className="h-8 px-3 text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none rounded-lg inline-flex items-center gap-1 cursor-pointer text-slate-600"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </>
          ) : activeNavItem === 'Product' ? (
            <>
              {/* Header context: Product details */}
              <div className="px-6 pt-6">
            <h1 className="text-2xl font-bold font-sans text-slate-800 leading-tight">Product</h1>
            
            {/* Primary category subtabs with blue highlights */}
            <div className="flex items-center gap-6 mt-4 border-b border-slate-100 overflow-x-auto scrollbar-none" id="product-category-tabs">
              {(['Product', 'Type', 'Style', 'Color', 'Size'] as TabType[]).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                    }}
                    className={`
                      pb-3 font-semibold text-sm transition-all duration-150 relative cursor-pointer block whitespace-nowrap
                      ${isActive 
                        ? 'text-brand-600 font-bold' 
                        : 'text-slate-400 hover:text-slate-700'
                      }
                    `}
                  >
                    <span>{tab}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeTabUnderbar" 
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
              
              {/* Name search input - Compact by default, expands beautifully on focus or when search query is active */}
              <div 
                className={`relative h-10 transition-all duration-300 ease-in-out ${
                  searchQuery ? 'w-64' : 'w-52 focus-within:w-64'
                }`}
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={searchPlaceholder}
                  className="w-full pl-9 pr-8 h-full text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 truncate"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Advanced Custom Dropdown selections */}
              {activeTab === 'Product' && (
                <>
                  <FilterDropdown 
                    label="Style" 
                    options={STYLE_OPTIONS} 
                    selected={selectedStyle} 
                    onSelect={(val) => { setSelectedStyle(val); setCurrentPage(1); }} 
                    showSearch={true}
                  />
                  
                  <FilterDropdown 
                    label="Color" 
                    options={COLOR_OPTIONS} 
                    selected={selectedColor} 
                    onSelect={(val) => { setSelectedColor(val); setCurrentPage(1); }} 
                    showSearch={true}
                  />
                  
                  <FilterDropdown 
                    label="Size" 
                    options={SIZE_OPTIONS} 
                    selected={selectedSize} 
                    onSelect={(val) => { setSelectedSize(val); setCurrentPage(1); }} 
                    showSearch={true}
                  />
                  
                  <FilterDropdown 
                    label="Stock status" 
                    options={STOCK_OPTIONS} 
                    selected={selectedStock} 
                    onSelect={(val) => { setSelectedStock(val); setCurrentPage(1); }} 
                  />

                  {/* Created Date programmatically activated picker button */}
                  <div className="relative inline-block">
                    <button
                      type="button"
                      onClick={() => {
                        if (dateInputRef.current) {
                          try {
                            dateInputRef.current.showPicker();
                          } catch (err) {
                            dateInputRef.current.click();
                          }
                        }
                      }}
                      className={`
                        inline-flex items-center gap-1.5 px-4 h-10 text-sm font-semibold rounded-lg border transition-all duration-150 cursor-pointer whitespace-nowrap
                        ${createdDateFilter !== 'All Dates' 
                          ? 'border-brand-200 bg-brand-50/50 text-brand-700 hover:bg-brand-50' 
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Calendar className={`h-4 w-4 shrink-0 ${createdDateFilter !== 'All Dates' ? 'text-brand-500' : 'text-gray-400'}`} />
                      <span>
                        {createdDateFilter !== 'All Dates' 
                          ? new Date(createdDateFilter).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                          : 'Created date'
                        }
                      </span>
                      {createdDateFilter !== 'All Dates' ? (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setCreatedDateFilter('All Dates');
                            setCurrentPage(1);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.stopPropagation();
                              e.preventDefault();
                              setCreatedDateFilter('All Dates');
                              setCurrentPage(1);
                            }
                          }}
                          className="p-1 hover:bg-brand-100/80 rounded-md text-brand-600 transition duration-150 cursor-pointer flex items-center justify-center shrink-0 -mr-1"
                          title="Clear date"
                        >
                          <X className="h-3.5 w-3.5" />
                        </span>
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      )}
                    </button>

                    {/* Hidden native input date type without any placeholder in UI */}
                    <input
                      type="date"
                      ref={dateInputRef}
                      value={createdDateFilter === 'All Dates' ? '' : createdDateFilter}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCreatedDateFilter(val || 'All Dates');
                        setCurrentPage(1);
                      }}
                      className="absolute pointer-events-none opacity-0 w-0 h-0 text-transparent bg-transparent border-0"
                      style={{
                        top: '50%',
                        left: '50%',
                      }}
                    />
                  </div>

                  <FilterDropdown 
                    label="Customer" 
                    options={CUSTOMER_OPTIONS} 
                    selected={selectedCustomer} 
                    onSelect={(val) => { setSelectedCustomer(val); setCurrentPage(1); }} 
                    showSearch={true}
                  />
                </>
              )}

              {activeTab === 'Style' && (
                <FilterDropdown 
                  label="Type" 
                  options={['All Types', ...Array.from(new Set(types.map(t => t.typeName)))]} 
                  selected={selectedStyleTypeFilter} 
                  onSelect={(val) => { setSelectedStyleTypeFilter(val); setCurrentPage(1); }} 
                  showSearch={true}
                />
              )}

              {/* Reset trigger helper */}
              {isFilterActive && (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1.5 h-10 text-xs text-brand-600 hover:text-brand-800 font-semibold px-2 rounded hover:bg-brand-50 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Right aligned Operations & Tools */}
            <div className="flex items-center gap-2.5 shrink-0">
              
              {/* Import options */}
              {activeTab === 'Product' && (
                <button
                  type="button"
                  onClick={() => triggerToast('Import feature is under design. Coming soon!', 'info')}
                  className="inline-flex items-center justify-center gap-1.5 px-4 h-10 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 cursor-pointer btn-secondary-sheen"
                >
                  <Upload className="h-4 w-4 text-slate-500" />
                  <span>Import</span>
                </button>
              )}

              {/* + Create trigger */}
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 px-4.5 h-10 btn-primary-gradient rounded-lg text-sm font-semibold cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Create</span>
              </button>
            </div>
            
          </div>

          {/* Table Container - responsive horizontally scrollable outer shell */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              
              {/* Header row */}
              <thead>
                <tr className="bg-[#F8F9FA] text-slate-500 border-b border-slate-100 text-[11.5px] font-semibold uppercase tracking-wider whitespace-nowrap">
                  {activeTab === 'Product' && (
                    <>
                      <th className="py-3 px-6 select-none font-sans">Name</th>
                      <th className="py-3 px-6 font-sans">Product style / SKU</th>
                      <th className="py-3 px-6 font-sans text-right">Stock qty</th>
                      <th className="py-3 px-6 font-sans">Status</th>
                      <th className="py-3 px-6 font-sans text-right">Item weight (oz)</th>
                      <th className="py-3 px-6 font-sans text-right">Packaging weight (lbs)</th>
                      <th className="py-3 px-6 font-sans">Customer</th>
                      <th className="py-3 px-6 font-sans">Created date</th>
                      <th className="py-3 px-6 font-sans">Last updated</th>
                      <th className="py-3 px-6 font-sans">User</th>
                    </>
                  )}
                  {activeTab === 'Type' && (
                    <>
                      <th className="py-3 px-6 select-none font-sans w-[15%]">ID</th>
                      <th className="py-3 px-6 font-sans w-[15%]">Icon</th>
                      <th className="py-3 px-6 font-sans w-[25%]">Type name</th>
                      <th className="py-3 px-6 font-sans w-[25%]">Created at</th>
                      <th className="py-3 px-6 font-sans w-[20%]">Created by</th>
                    </>
                  )}
                  {activeTab === 'Style' && (
                    <>
                      <th className="py-3 px-6 select-none font-sans">ID</th>
                      <th className="py-3 px-6 font-sans">Product name</th>
                      <th className="py-3 px-6 font-sans">Product style</th>
                      <th className="py-3 px-6 font-sans">Type</th>
                      <th className="py-3 px-6 font-sans">Created at</th>
                      <th className="py-3 px-6 font-sans">Created by</th>
                    </>
                  )}
                  {activeTab === 'Color' && (
                    <>
                      <th className="py-3 px-6 select-none font-sans">ID</th>
                      <th className="py-3 px-6 font-sans">Color name</th>
                      <th className="py-3 px-6 font-sans">Color Hex code</th>
                      <th className="py-3 px-6 font-sans">Created at</th>
                      <th className="py-3 px-6 font-sans">Created by</th>
                    </>
                  )}
                  {activeTab === 'Size' && (
                    <>
                      <th className="py-3 px-6 select-none font-sans">ID</th>
                      <th className="py-3 px-6 font-sans">Size name</th>
                      <th className="py-3 px-6 font-sans">Created at</th>
                      <th className="py-3 px-6 font-sans">Created by</th>
                    </>
                  )}
                </tr>
              </thead>

              {/* Body Rows */}
              <tbody className="divide-y divide-slate-100/90 text-[13px] text-slate-600">
                {activeTab === 'Product' && (
                  paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => {
                      return (
                        <tr 
                          key={product.id}
                          className={`hover:bg-slate-50/70 transition-colors duration-100 ${!product.active ? 'opacity-80 bg-slate-50/20' : ''}`}
                        >
                          {/* Name (Includes toggle right next to text) */}
                          <td className="py-4 px-6 font-sans whitespace-nowrap">
                            <div className="flex items-center gap-4">
                              <Toggle 
                                checked={product.active} 
                                onChange={() => handleToggleActive(product.id, product.active)} 
                              />
                              <div className="flex items-center gap-2">
                                <span className={`font-semibold text-slate-800 tracking-tight text-sm ${!product.active ? 'text-slate-500/80' : ''}`}>
                                  {product.name}
                                </span>
                                {product.user === 'editor123' && (
                                  <span className="text-[10px] text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 whitespace-nowrap">Flagged Item</span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Product style / SKU */}
                          <td className="py-4 px-6 font-sans leading-relaxed whitespace-nowrap">
                            <div className="flex flex-col max-w-[240px]">
                              <span 
                                className={`font-medium truncate block transition-colors ${product.active ? 'text-slate-700' : 'text-slate-500'}`} 
                                title={product.sku.split('\n')[0]}
                              >
                                {product.sku.split('\n')[0]}
                              </span>
                              <span 
                                className="text-xs text-slate-400 font-mono tracking-wider mt-0.5 truncate block"
                                title={product.sku.split('\n')[1]}
                              >
                                {product.sku.split('\n')[1]}
                              </span>
                            </div>
                          </td>

                          {/* Incoming stock */}
                          <td className={`py-4 px-6 font-mono font-medium text-right whitespace-nowrap transition-colors ${product.active ? 'text-slate-700' : 'text-slate-500'}`}>
                            {product.stockQty.replace(/[^0-9]/g, '') || '0'}
                          </td>

                          {/* Stock qty */}
                          <td className="py-4 px-6 font-sans whitespace-nowrap">
                            {product.stockQty.toLowerCase().includes('out of stock') ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100 whitespace-nowrap">
                                Out of stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 whitespace-nowrap">
                                In stock
                              </span>
                            )}
                          </td>

                          {/* Item weight (oz) */}
                          <td className={`py-4 px-6 font-mono font-medium text-right whitespace-nowrap transition-colors ${product.active ? 'text-slate-700' : 'text-slate-500'}`}>
                            {product.weight.toFixed(1)}
                          </td>

                          {/* Packaging weight (lbs) */}
                          <td className={`py-4 px-6 font-mono font-medium text-right whitespace-nowrap transition-colors ${product.active ? 'text-slate-700' : 'text-slate-500'}`}>
                            {(product.packagingWeight ?? 1.2).toFixed(1)}
                          </td>

                          {/* Customer */}
                          <td className={`py-4 px-6 font-sans font-medium whitespace-nowrap transition-colors ${product.active ? 'text-slate-700' : 'text-slate-500'}`}>
                            {product.customer}
                          </td>

                          {/* Created date */}
                          <td className={`py-4 px-6 font-sans font-medium whitespace-nowrap transition-colors ${product.active ? 'text-slate-700' : 'text-slate-500'}`}>
                            {product.createdAt}
                          </td>

                          {/* Last updated */}
                          <td className={`py-4 px-6 font-sans font-medium whitespace-nowrap transition-colors ${product.active ? 'text-slate-700' : 'text-slate-500'}`}>
                            {product.lastUpdated}
                          </td>

                          {/* User */}
                          <td className={`py-4 px-6 font-mono text-xs font-medium whitespace-nowrap transition-colors ${product.active ? 'text-slate-700' : 'text-slate-500'}`}>
                            {product.user}
                          </td>

                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-400 text-sm font-sans">
                        <div className="max-w-[280px] mx-auto flex flex-col items-center gap-2">
                          <AlertCircle className="h-8 w-8 text-slate-300" />
                          <span className="font-semibold text-slate-600">No matching products found</span>
                          <p className="text-xs text-slate-400">
                            Try modifying your search query or reset the drop-down filters above.
                          </p>
                          <button
                            onClick={handleClearFilters}
                            className="mt-2 text-xs px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-lg transition-colors font-semibold cursor-pointer"
                          >
                            Clear criteria
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}

                {activeTab === 'Type' && (
                  filteredTypeItems.length > 0 ? (
                    filteredTypeItems.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors duration-100">
                        <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.id}</td>
                        <td className="py-4 px-6 font-sans text-slate-700 whitespace-nowrap">
                          <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-slate-50 border border-slate-100">
                            {getTypeIcon(item.typeName, item.iconName)}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-sans font-semibold text-slate-700 whitespace-nowrap">{item.typeName}</td>
                        <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.createdAt}</td>
                        <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.createdBy}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 text-sm font-sans">
                        <div className="max-w-[280px] mx-auto flex flex-col items-center gap-2">
                          <AlertCircle className="h-8 w-8 text-slate-300" />
                          <span className="font-semibold text-slate-600">No matching types found</span>
                          <p className="text-xs text-slate-400">
                            Try modifying your search query or reset filters.
                          </p>
                          <button
                            onClick={handleClearFilters}
                            className="mt-2 text-xs px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-lg transition-colors font-semibold cursor-pointer"
                          >
                            Clear criteria
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}

                {activeTab === 'Style' && (
                  filteredStyleItems.length > 0 ? (
                    filteredStyleItems.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors duration-100">
                        <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.id}</td>
                        <td className="py-4 px-6 font-sans font-semibold text-slate-700 whitespace-nowrap">{item.productName}</td>
                        <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.productStyle}</td>
                        <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.type}</td>
                        <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.createdAt}</td>
                        <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.createdBy}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 text-sm font-sans">
                        <div className="max-w-[280px] mx-auto flex flex-col items-center gap-2">
                          <AlertCircle className="h-8 w-8 text-slate-300" />
                          <span className="font-semibold text-slate-600">No matching styles found</span>
                          <p className="text-xs text-slate-400">
                            Try modifying your search query or reset filters.
                          </p>
                          <button
                            onClick={handleClearFilters}
                            className="mt-2 text-xs px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-lg transition-colors font-semibold cursor-pointer"
                          >
                            Clear criteria
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}

                {activeTab === 'Color' && (
                  filteredColorItems.length > 0 ? (
                    filteredColorItems.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors duration-100">
                        <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.id}</td>
                        <td className="py-4 px-6 font-sans font-semibold text-slate-700 whitespace-nowrap">{item.colorName}</td>
                        <td className="py-4 px-6 font-sans whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span 
                              className="h-4 w-4 rounded shadow-sm border border-black/5 block shrink-0" 
                              style={{ backgroundColor: item.colorHexCode }} 
                            />
                            <span className="font-mono text-slate-700 text-xs font-medium">{item.colorHexCode}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.createdAt}</td>
                        <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.createdBy}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 text-sm font-sans">
                        <div className="max-w-[280px] mx-auto flex flex-col items-center gap-2">
                          <AlertCircle className="h-8 w-8 text-slate-300" />
                          <span className="font-semibold text-slate-650">No matching colors found</span>
                          <p className="text-xs text-slate-400">
                            Try modifying your search query or reset filters.
                          </p>
                          <button
                            onClick={handleClearFilters}
                            className="mt-2 text-xs px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-lg transition-colors font-semibold cursor-pointer"
                          >
                            Clear criteria
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}

                {activeTab === 'Size' && (
                  filteredSizeItems.length > 0 ? (
                    filteredSizeItems.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors duration-100">
                        <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.id}</td>
                        <td className="py-4 px-6 font-sans font-semibold text-slate-700 whitespace-nowrap">{item.sizeName}</td>
                        <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.createdAt}</td>
                        <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.createdBy}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400 text-sm font-sans">
                        <div className="max-w-[280px] mx-auto flex flex-col items-center gap-2">
                          <AlertCircle className="h-8 w-8 text-slate-300" />
                          <span className="font-semibold text-slate-600">No matching sizes found</span>
                          <p className="text-xs text-slate-400">
                            Try modifying your search query or reset filters.
                          </p>
                          <button
                            onClick={handleClearFilters}
                            className="mt-2 text-xs px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-600 rounded-lg transition-colors font-semibold cursor-pointer"
                          >
                            Clear criteria
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
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
                  onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
                  className="inline-flex items-center justify-between gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{pageSize}/page</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {isPageSizeOpen && (
                  <div className="absolute left-0 bottom-full mb-1.5 w-24 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    {[5, 10, 15, 20].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setPageSize(size);
                          setIsPageSizeOpen(false);
                          setCurrentPage(1);
                          triggerToast(`Page size updated to ${size}`, 'info');
                        }}
                        className={`w-full text-left px-3.5 py-1.5 text-sm transition-colors ${size === pageSize ? 'bg-brand-50 text-brand-600 font-semibold' : 'hover:bg-slate-50 text-slate-700'}`}
                      >
                        {size}/page
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-slate-500 font-medium text-xs font-sans">
                of total <strong className="text-slate-800">{activeFilteredCount.toLocaleString()}</strong> result{activeFilteredCount !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Numeric and Back/Forward Controls block */}
            <div className="flex items-center gap-1">
              
              {/* Previous button */}
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>

              {/* Page Numbering elements */}
              <div className="hidden sm:flex items-center gap-1 mx-1.5">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  const isCurrent = currentPage === pageNum;
                  
                  // Simple paging windowing helper (useful for massive simulated datasets)
                  if (totalPages > 6) {
                    if (pageNum !== 1 && pageNum !== totalPages && Math.abs(pageNum - currentPage) > 1) {
                      if (pageNum === 2 && currentPage > 3) {
                        return <span key="ellipsis-start" className="text-slate-400 text-xs px-1 select-none">...</span>;
                      }
                      if (pageNum === totalPages - 1 && currentPage < totalPages - 2) {
                        return <span key="ellipsis-end" className="text-slate-400 text-xs px-1 select-none">...</span>;
                      }
                      return null;
                    }
                  }

                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`
                        h-7.5 w-7.5 flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer
                        ${isCurrent 
                          ? 'bg-brand-50 text-brand-600 border border-brand-200 shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }
                      `}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next button */}
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>

            </div>

          </div>
        </>
      ) : activeNavItem === 'Purchase order' ? (
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
                  onChange={(e) => {
                    setPoSearchQuery(e.target.value);
                    setPoCurrentPage(1);
                  }}
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

              {/* Order Status Custom Filter Dropdown */}
              <FilterDropdown 
                label="Order status" 
                options={['All Statuses', 'New', 'Partial Received', 'Completed', 'Verified', 'Cancelled']} 
                selected={selectedOrderStatus} 
                onSelect={(val) => { setSelectedOrderStatus(val); setPoCurrentPage(1); }} 
              />

              {/* Created Date programmatically activated picker button */}
              <div className="relative inline-block">
                <button
                  type="button"
                  onClick={() => {
                    if (poDateInputRef.current) {
                      try {
                        poDateInputRef.current.showPicker();
                      } catch (err) {
                        poDateInputRef.current.click();
                      }
                    }
                  }}
                  className={`
                    inline-flex items-center gap-1.5 px-4 h-10 text-sm font-semibold rounded-lg border transition-all duration-150 cursor-pointer whitespace-nowrap
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
                      : 'Created date'
                    }
                  </span>
                  {selectedPOCreatedDate !== 'All Dates' ? (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setSelectedPOCreatedDate('All Dates');
                        setPoCurrentPage(1);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.stopPropagation();
                          e.preventDefault();
                          setSelectedPOCreatedDate('All Dates');
                          setPoCurrentPage(1);
                        }
                      }}
                      className="p-1 hover:bg-brand-100/80 rounded-md text-brand-600 transition duration-150 cursor-pointer flex items-center justify-center shrink-0 -mr-1"
                      title="Clear date"
                    >
                      <X className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  )}
                </button>

                {/* Hidden native input date type */}
                <input
                  type="date"
                  ref={poDateInputRef}
                  value={selectedPOCreatedDate === 'All Dates' ? '' : selectedPOCreatedDate}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedPOCreatedDate(val || 'All Dates');
                    setPoCurrentPage(1);
                  }}
                  className="absolute pointer-events-none opacity-0 w-0 h-0 text-transparent bg-transparent border-0"
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
                />
              </div>

              {/* Reset trigger helper */}
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
                    link.setAttribute("download", `SwiftPOD-WROs-${new Date().toISOString().slice(0,10)}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    triggerToast("WROs exported successfully!", "success");
                  } catch (e) {
                    triggerToast("Export failed.", "info");
                  }
                }}
                className="inline-flex items-center justify-center gap-1.5 px-4 h-10 border border-slate-200 bg-white rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 cursor-pointer btn-secondary-sheen"
              >
                <Upload className="h-4 w-4 rotate-180 text-slate-500" />
                <span>Export</span>
              </button>

              {/* + Create trigger */}
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
                      <span className="text-xs text-slate-400 select-none">
                        {poSortDirection === 'desc' ? '▼' : '▲'}
                      </span>
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
                      <td className="py-3 px-6 font-sans font-medium text-slate-700 max-w-[150px] truncate" title={po.customer}>
                        {po.customer}
                      </td>
                      <td className="py-3 px-6 font-sans">
                        {po.orderStatus === 'New' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 border border-rose-100 text-rose-600">
                            New
                          </span>
                        )}
                        {po.orderStatus === 'Partial Received' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 border border-blue-100 text-blue-600">
                            Partial Received
                          </span>
                        )}
                        {po.orderStatus === 'Completed' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 border border-emerald-100 text-emerald-600">
                            Completed
                          </span>
                        )}
                        {po.orderStatus === 'Verified' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 border border-purple-100 text-purple-600">
                            Verified
                          </span>
                        )}
                        {po.orderStatus === 'Cancelled' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 border border-slate-100 text-slate-500">
                            Cancelled
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-6 text-right font-mono font-medium text-slate-700">
                        {po.totalQty}
                      </td>
                      <td className="py-3 px-6 text-right font-mono font-medium text-slate-700">
                        {po.receivedQty}
                      </td>
                      <td className="py-3 px-6 text-right font-mono font-medium text-slate-700">
                        {po.incomingQty}
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-slate-500 select-all max-w-[120px] truncate block" title={po.tracking}>
                            {po.tracking}
                          </span>
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
                      <td className="py-3 px-6 font-sans font-medium text-slate-700">
                        {po.ageDays} days
                      </td>
                      <td className="py-3 px-6 font-sans font-medium text-slate-700">
                        {po.createdAt}
                      </td>
                      <td className="py-3 px-6 font-mono text-xs font-medium text-slate-700">
                        {po.createdBy}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="py-16 text-center text-slate-400">
                      <div className="max-w-[280px] mx-auto flex flex-col items-center gap-2">
                        <AlertCircle className="h-8 w-8 text-slate-300" />
                        <span className="font-semibold text-slate-600">No WROs found</span>
                        <p className="text-xs text-slate-400">
                          Try modifying your search criteria or reset filters.
                        </p>
                        <button
                          onClick={() => {
                            setPoSearchQuery('');
                            setSelectedOrderStatus('All Statuses');
                            setSelectedPOCreatedDate('All Dates');
                            setPoCurrentPage(1);
                          }}
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
              
              {/* Previous button */}
              <button
                type="button"
                onClick={() => setPoCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={poCurrentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>

              {/* Page Numbering elements */}
              <div className="hidden sm:flex items-center gap-1 mx-1.5">
                {Array.from({ length: poTotalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  const isCurrent = poCurrentPage === pNum;
                  
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => setPoCurrentPage(pNum)}
                      className={`
                        h-7.5 w-7.5 flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer
                        ${isCurrent 
                          ? 'bg-brand-50 text-brand-600 border border-brand-200 shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
                onClick={() => setPoCurrentPage(prev => Math.min(poTotalPages, prev + 1))}
                disabled={poCurrentPage === poTotalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>

            </div>

          </div>
        </>
      ) : activeNavItem === 'Addition' ? (
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
                  onChange={(e) => {
                    setAdditionSearchProdTrack(e.target.value);
                    setAdditionCurrentPage(1);
                  }}
                  placeholder="Search product / SKU / WRO #"
                  className="w-full pl-9 pr-8 h-full text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
                {additionSearchProdTrack && (
                  <button 
                    onClick={() => {
                      setAdditionSearchProdTrack('');
                      setAdditionCurrentPage(1);
                    }}
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
                  onChange={(e) => {
                    setAdditionSearchBoxLoc(e.target.value);
                    setAdditionCurrentPage(1);
                  }}
                  placeholder="Location, box ID"
                  className="w-full pl-9 pr-8 h-full text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
                {additionSearchBoxLoc && (
                  <button 
                    onClick={() => {
                      setAdditionSearchBoxLoc('');
                      setAdditionCurrentPage(1);
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Created Date / Receiving Date Filter */}
              <div className="relative inline-block">
                <button
                  type="button"
                  onClick={() => {
                    if (additionDateInputRef.current) {
                      try {
                        additionDateInputRef.current.showPicker();
                      } catch (err) {
                        additionDateInputRef.current.click();
                      }
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
                      : 'Receiving Date'
                    }
                  </span>
                  {additionDateFilter !== 'All Dates' && (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setAdditionDateFilter('All Dates');
                        setAdditionCurrentPage(1);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.stopPropagation();
                          e.preventDefault();
                          setAdditionDateFilter('All Dates');
                          setAdditionCurrentPage(1);
                        }
                      }}
                      className="p-1 hover:bg-brand-100/80 rounded-md text-brand-600 transition duration-150 cursor-pointer flex items-center justify-center shrink-0 -mr-1"
                      title="Clear date"
                    >
                      <X className="h-3.5 w-3.5" />
                    </span>
                  )}
                </button>

                {/* Hidden native input date type */}
                <input
                  type="date"
                  ref={additionDateInputRef}
                  value={additionDateFilter === 'All Dates' ? '' : additionDateFilter}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAdditionDateFilter(val || 'All Dates');
                    setAdditionCurrentPage(1);
                  }}
                  className="absolute pointer-events-none opacity-0 w-0 h-0 text-transparent bg-transparent border-0"
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
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
                    link.setAttribute("download", `SwiftPOD-InventoryAdditions-${new Date().toISOString().slice(0,10)}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    triggerToast("Inventory additions exported successfully!", "success");
                  } catch (e) {
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
                        <span 
                          className="font-medium text-slate-700 text-sm truncate block animate-fade-in-down" 
                          title={item.product}
                        >
                          {item.product}
                        </span>
                        <span 
                          className="text-xs text-slate-400 font-mono tracking-wider mt-0.5 truncate block"
                          title={item.product.replace(/\s+/g, '').replace(/\//g, '-')}
                        >
                          {item.product.replace(/\s+/g, '').replace(/\//g, '-')}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-slate-700 font-sans font-medium truncate w-[10%]" title={item.boxId || `BOX-${item.id.toUpperCase()}`}>
                      {item.boxId || `BOX-${item.id.toUpperCase()}`}
                    </td>
                    <td className="py-3 px-6 text-slate-700 font-sans font-medium truncate w-[11%]">
                      {item.poNumber}
                    </td>
                    <td className="py-3 px-6 text-slate-700 font-sans font-medium text-right w-[8%]">
                      {item.qty}
                    </td>
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
                    <td className="py-3 px-6 text-slate-700 font-sans font-medium truncate w-[15%]">
                      {item.receivingDate}
                    </td>
                    <td className="py-3 px-6 text-slate-700 font-sans font-medium truncate w-[10%]">
                      {item.user}
                    </td>
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
              
              {/* Previous button */}
              <button
                type="button"
                onClick={() => setAdditionCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={additionCurrentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>

              {/* Page Numbering elements */}
              <div className="hidden sm:flex items-center gap-1 mx-1.5">
                {Array.from({ length: additionTotalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  const isCurrent = additionCurrentPage === pNum;
                  
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => setAdditionCurrentPage(pNum)}
                      className={`
                        h-7.5 w-7.5 flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer
                        ${isCurrent 
                          ? 'bg-brand-50 text-brand-600 border border-brand-200 shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
                onClick={() => setAdditionCurrentPage(prev => Math.min(additionTotalPages, prev + 1))}
                disabled={additionCurrentPage === additionTotalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>

            </div>

          </div>
        </>
      ) : activeNavItem === 'Location' ? (
        <>
          {/* Header context: Locations details */}
          <div className="px-6 pt-6">
            <div className="flex items-center justify-between select-none">
              <h1 className="text-2xl font-bold font-sans text-slate-800 leading-tight">Locations</h1>
            </div>

            {/* Primary category subtabs with blue highlights */}
            <div className="flex items-center gap-6 mt-4 border-b border-slate-100 overflow-x-auto scrollbar-none" id="location-category-tabs">
              {(['Locations', 'History'] as const).map((tab) => {
                const isActive = locationActiveTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setLocationActiveTab(tab);
                    }}
                    className={`
                      pb-3 font-semibold text-sm transition-all duration-150 relative cursor-pointer block whitespace-nowrap
                      ${isActive 
                        ? 'text-brand-600 font-bold' 
                        : 'text-slate-400 hover:text-slate-700'
                      }
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
                  <div 
                    className={`relative h-10 transition-all duration-300 ease-in-out ${
                      searchLocationId ? 'w-64' : 'w-52 focus-within:w-64'
                    }`}
                  >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchLocationId}
                      onChange={(e) => {
                        setSearchLocationId(e.target.value);
                        setLocationCurrentPage(1);
                        setHistoryCurrentPage(1);
                      }}
                      placeholder="Search location id"
                      className="w-full pl-9 pr-8 h-full text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                    {searchLocationId && (
                      <button 
                        onClick={() => {
                          setSearchLocationId('');
                          setLocationCurrentPage(1);
                          setHistoryCurrentPage(1);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Search product sku */}
                  <div 
                    className={`relative h-10 transition-all duration-300 ease-in-out ${
                      searchProductSku ? 'w-64' : 'w-36 focus-within:w-64'
                    }`}
                  >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchProductSku}
                      onChange={(e) => {
                        setSearchProductSku(e.target.value);
                        setLocationCurrentPage(1);
                        setHistoryCurrentPage(1);
                      }}
                      placeholder="Search SKU"
                      className="w-full pl-9 pr-8 h-full text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                    {searchProductSku && (
                      <button 
                        onClick={() => {
                          setSearchProductSku('');
                          setLocationCurrentPage(1);
                          setHistoryCurrentPage(1);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Status Select dropdown */}
                  <FilterDropdown 
                    label="Status" 
                    options={['All', 'Return', 'Not return']} 
                    selected={selectedLocationStatus} 
                    onSelect={(val) => { setSelectedLocationStatus(val); setLocationCurrentPage(1); }} 
                  />

                  {/* Clear filters trigger */}
                  {(searchLocationId || searchProductSku || selectedLocationStatus !== 'All') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchLocationId('');
                        setSearchProductSku('');
                        setSelectedLocationStatus('All');
                        setLocationCurrentPage(1);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition duration-150 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Clear filters</span>
                    </button>
                  )}
                </>
              ) : (
                <>
                  {/* History filter: Dropdown select location with internal search */}
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
                        ${(historyDateFrom || historyDateTo) 
                          ? 'border-brand-200 bg-brand-50/50 text-brand-700' 
                          : 'border-slate-200 text-slate-700'
                        }
                      `}
                    >
                      <Calendar className={`h-4 w-4 shrink-0 mr-2 ${(historyDateFrom || historyDateTo) ? 'text-brand-500' : 'text-slate-400'}`} />
                      
                      {/* From Date trigger button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (historyDateFromRef.current) {
                            try {
                              historyDateFromRef.current.showPicker();
                            } catch (err) {
                              historyDateFromRef.current.click();
                            }
                          }
                        }}
                        className="hover:text-brand-600 transition cursor-pointer font-semibold outline-none"
                      >
                        {historyDateFrom 
                          ? new Date(historyDateFrom).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                          : 'From date'
                        }
                      </button>
                      
                      {historyDateFrom && (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setHistoryDateFrom('');
                            setHistoryCurrentPage(1);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.stopPropagation();
                              setHistoryDateFrom('');
                              setHistoryCurrentPage(1);
                            }
                          }}
                          className="p-1 hover:bg-brand-100/80 rounded-md text-brand-600 transition duration-150 cursor-pointer flex items-center justify-center shrink-0 ml-1 mr-0.5"
                          title="Clear from date"
                        >
                          <X className="h-3 w-3" />
                        </span>
                      )}

                      <span className="text-slate-400 mx-2 select-none font-normal">—</span>

                      {/* To Date trigger button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (historyDateToRef.current) {
                            try {
                              historyDateToRef.current.showPicker();
                            } catch (err) {
                              historyDateToRef.current.click();
                            }
                          }
                        }}
                        className="hover:text-brand-600 transition cursor-pointer font-semibold outline-none"
                      >
                        {historyDateTo 
                          ? new Date(historyDateTo).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                          : 'To date'
                        }
                      </button>

                      {historyDateTo && (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setHistoryDateTo('');
                            setHistoryCurrentPage(1);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.stopPropagation();
                              setHistoryDateTo('');
                              setHistoryCurrentPage(1);
                            }
                          }}
                          className="p-1 hover:bg-brand-100/80 rounded-md text-brand-600 transition duration-150 cursor-pointer flex items-center justify-center shrink-0 ml-1"
                          title="Clear to date"
                        >
                          <X className="h-3 w-3" />
                        </span>
                      )}
                    </div>

                    {/* Hidden actual native inputs */}
                    <input
                      type="date"
                      ref={historyDateFromRef}
                      value={historyDateFrom}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHistoryDateFrom(val || '');
                        setHistoryCurrentPage(1);
                      }}
                      className="absolute pointer-events-none opacity-0 w-0 h-0 text-transparent bg-transparent border-0"
                      style={{
                        top: '50%',
                        left: '25%',
                      }}
                    />
                    <input
                      type="date"
                      ref={historyDateToRef}
                      value={historyDateTo}
                      onChange={(e) => {
                        const val = e.target.value;
                        setHistoryDateTo(val || '');
                        setHistoryCurrentPage(1);
                      }}
                      className="absolute pointer-events-none opacity-0 w-0 h-0 text-transparent bg-transparent border-0"
                      style={{
                        top: '50%',
                        left: '75%',
                      }}
                    />
                  </div>

                  {/* History filter: Search SKU box */}
                  <div className={`relative h-10 transition-all duration-300 ease-in-out ${
                    historySearchSku ? 'w-64' : 'w-36 focus-within:w-64'
                  }`}>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={historySearchSku}
                      onChange={(e) => {
                        setHistorySearchSku(e.target.value);
                        setHistoryCurrentPage(1);
                      }}
                      placeholder="Search SKU"
                      className="w-full pl-9 pr-8 h-full text-sm bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                    {historySearchSku && (
                      <button 
                        onClick={() => {
                          setHistorySearchSku('');
                          setHistoryCurrentPage(1);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Clear history filters trigger */}
                  {(historyLocationFilter !== 'All locations' || historyDateFrom || historyDateTo || historySearchSku) && (
                    <button
                      type="button"
                      onClick={() => {
                        setHistoryLocationFilter('All locations');
                        setHistoryDateFrom('');
                        setHistoryDateTo('');
                        setHistorySearchSku('');
                        setHistoryCurrentPage(1);
                      }}
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
                        
                        {/* Inline editable name of location */}
                        <td className="py-4 px-6 font-sans whitespace-nowrap">
                          {editingLocationId === item.id ? (
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                value={editingLocationValue}
                                onChange={(e) => setEditingLocationValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSaveInlineLocationName(item.id, editingLocationValue);
                                  } else if (e.key === 'Escape') {
                                    setEditingLocationId(null);
                                  }
                                }}
                                className="px-2.5 py-1 text-xs font-sans font-semibold bg-white border border-brand-500 rounded-lg text-slate-800 outline-none focus:ring-2 focus:ring-brand-500/20 max-w-[160px]"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveInlineLocationName(item.id, editingLocationValue)}
                                className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 transition cursor-pointer"
                                title="Save"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingLocationId(null)}
                                className="p-1 rounded-md text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                                title="Cancel"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-850 font-sans tracking-tight text-sm">
                                {item.location}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingLocationId(item.id);
                                  setEditingLocationValue(item.location);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-md transition duration-150 cursor-pointer"
                                title="Edit Location Name"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </td>

                        {/* Box ID */}
                        <td className="py-4 px-6 text-right font-sans font-medium text-slate-700 whitespace-nowrap">
                          {item.boxId || '—'}
                        </td>

                        {/* Product Qty */}
                        <td className="py-4 px-6 text-right font-sans font-medium text-slate-700 whitespace-nowrap">
                          {item.productQty.toLocaleString()}
                        </td>

                        {/* Created At */}
                        <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.createdAt || '—'}</td>
                        
                        {/* Updated At */}
                        <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.updatedAt || '—'}</td>
                        
                        {/* Last Returned At */}
                        <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">{item.lastReturnedAt || '—'}</td>
                        
                        {/* Last Returned By */}
                        <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">
                          {item.lastReturnedBy || '—'}
                        </td>

                        {/* Actions (Popover sticky at end) */}
                        <td className={`py-4 px-6 text-right whitespace-nowrap sticky right-0 group-hover:bg-slate-50 transition-colors border-l border-slate-100 shadow-[-6px_0_12px_-4px_rgba(0,0,0,0.12)] ${
                          openActionMenuId === item.id ? 'z-30 bg-slate-50' : 'z-10 bg-white'
                        }`}>
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
                                {/* Backdrop to close dropdown on outer click */}
                                <div 
                                  className="fixed inset-0 z-30 cursor-default" 
                                  onClick={() => setOpenActionMenuId(null)} 
                                />
                                
                                {/* Dropdown menu */}
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
                                      onClick={() => {
                                        setOpenActionMenuId(null);
                                        setLocationToDelete(item);
                                      }}
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
                      <td colSpan={8} className="py-16 text-center text-slate-400 font-sans">
                        No matching locations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              /* Global Return history list directly inline! */
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

                      // Check if the productInfo is split by " / "
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
                        // fallback compute if not set
                        if (evt.productInfo === 'Location Registered' || evt.productInfo === 'CSV Bulk Import') {
                          style = 'G500';
                          color = 'Dark blue';
                          size = 'XL';
                          sku = 'UNGSBHOOS';
                          valueStr = `$${(evt.qty * 6.5).toFixed(2)}`;
                        } else if (style !== '—') {
                          sku = 'SKU-' + style;
                          valueStr = `$${(evt.qty * 5).toFixed(2)}`;
                        }
                      }

                      return (
                        <tr key={evt.id} className="hover:bg-slate-50/70 transition-colors duration-100">
                          {/* ID */}
                          <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">
                            {displayId}
                          </td>
                          {/* Location */}
                          <td className="py-4 px-6 text-slate-800 font-bold font-sans whitespace-nowrap">
                            {evt.locationName}
                          </td>
                          {/* Box ID */}
                          <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">
                            {evt.boxId || '—'}
                          </td>
                          {/* Product style / SKU */}
                          <td className="py-4 px-6 font-sans leading-relaxed whitespace-nowrap">
                            <div className="flex flex-col max-w-[240px]">
                              <span 
                                className="font-medium text-slate-700 truncate block transition-colors" 
                                title={`${style} / ${color} / ${size}`}
                              >
                                {style} / {color} / {size}
                              </span>
                              <span 
                                className="text-xs text-slate-400 font-mono tracking-wider mt-0.5 truncate block"
                                title={sku}
                              >
                                {sku}
                              </span>
                            </div>
                          </td>
                          {/* Quantity */}
                          <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap text-right">
                            {evt.qty.toLocaleString()}
                          </td>
                          {/* Value */}
                          <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap text-right">
                            {valueStr}
                          </td>
                          {/* Returned by */}
                          <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap font-sans">
                            {evt.performedBy}
                          </td>
                          {/* Returned at */}
                          <td className="py-4 px-6 font-sans font-medium text-slate-700 whitespace-nowrap">
                            {evt.timestamp}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-slate-400 font-sans">
                        No return event logs found matching criteria.
                      </td>
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
              
              {/* Pagination Page Limits */}
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
                        onClick={() => {
                          setLocationPageSize(size);
                          setIsLocationPageSizeOpen(false);
                          setLocationCurrentPage(1);
                          setHistoryCurrentPage(1);
                        }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 font-semibold ${locationPageSize === size ? 'text-brand-600 bg-brand-50/30' : 'text-slate-600'}`}
                      >
                        {size} items
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Informational counter */}
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
                  if (locationActiveTab === 'Locations') {
                    setLocationCurrentPage(prev => Math.max(1, prev - 1));
                  } else {
                    setHistoryCurrentPage(prev => Math.max(1, prev - 1));
                  }
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
                  const isCurrent = locationActiveTab === 'Locations' 
                    ? locationCurrentPage === pNum 
                    : historyCurrentPage === pNum;
                  
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => {
                        if (locationActiveTab === 'Locations') {
                          setLocationCurrentPage(pNum);
                        } else {
                          setHistoryCurrentPage(pNum);
                        }
                      }}
                      className={`
                        h-7.5 w-7.5 flex items-center justify-center rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer
                        ${isCurrent 
                          ? 'bg-brand-50 text-brand-600 border border-brand-200 shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }
                      `}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (locationActiveTab === 'Locations') {
                    setLocationCurrentPage(prev => Math.min(locationTotalPages, prev + 1));
                  } else {
                    setHistoryCurrentPage(prev => Math.min(historyTotalPages, prev + 1));
                  }
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
        {isOrderDetailOpen && selectedOrderDetail && (
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
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <div className="flex items-baseline gap-1.5 text-xs text-slate-500">
                      <button 
                        type="button"
                        onClick={() => setIsOrderDetailOpen(false)}
                        className="font-medium hover:text-brand-600 transition cursor-pointer self-baseline"
                      >
                        Manage orders
                      </button>
                      <span className="text-slate-300 select-none">/</span>
                      <span className="font-semibold text-slate-800">Order details</span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ml-1 self-center ${
                      selectedOrderDetail.destinationType === 'International'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}>
                      {selectedOrderDetail.destinationType || 'Domestic'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <h2 className="text-xl font-bold font-sans text-slate-850 font-mono select-all truncate max-w-[200px]" title={selectedOrderDetail.orderNumber}>
                      {selectedOrderDetail.orderNumber}
                    </h2>
                    <span className="text-slate-300">|</span>
                    <span className="text-sm text-slate-500 font-medium font-mono select-all truncate max-w-[200px]" title={selectedOrderDetail.refNumber}>
                      {selectedOrderDetail.refNumber || 'REF-N/A'}
                    </span>
                  </div>
                </div>

                {/* Right side controls: Comment & Actions dropdown & Close button */}
                <div className="flex items-center gap-3">
                  {/* Speech Bubble Comment with + (Scrolls to comment section) */}
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById('timeline-comment-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="h-9 w-9 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-full flex items-center justify-center transition duration-155 cursor-pointer shadow-xs focus:outline-none"
                    title="Scroll to Timeline & Comments"
                  >
                    <MessageSquarePlus className="h-4 w-4 text-slate-600" />
                  </button>

                  {/* Actions Dropdown */}
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      onClick={() => setIsDetailActionsOpen(!isDetailActionsOpen)}
                      className="px-4 h-9 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-full text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition shadow-xs focus:outline-none"
                    >
                      <span>Actions</span>
                      <ChevronDown className="h-3 w-3 text-slate-500" />
                    </button>

                    {isDetailActionsOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-30 cursor-default animate-none" 
                          onClick={() => setIsDetailActionsOpen(false)} 
                        />
                        <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-100 rounded-xl shadow-xl z-40 py-2 text-left font-sans animate-fade-in divide-y divide-slate-100/60 max-h-[70vh] overflow-y-auto">
                          {detailMenuTab === 'main' && (
                            <>
                              {/* Update Order Status */}
                              <button
                                type="button"
                                onClick={() => setDetailMenuTab('status')}
                                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition border-b border-slate-100/60"
                              >
                                <div className="flex flex-col text-left">
                                  <span className="text-xs font-bold text-slate-800">Update order status</span>
                                  <span className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">Current: <span className="text-brand-600 font-semibold">{selectedOrderDetail.orderStatus}</span></span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                              </button>

                              {/* Change Shipping Method */}
                              <button
                                type="button"
                                onClick={() => setDetailMenuTab('shipping')}
                                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition border-b border-slate-100/60"
                              >
                                <div className="flex flex-col text-left">
                                  <span className="text-xs font-bold text-slate-800">Change shipping method</span>
                                  <span className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">Current: <span className="text-slate-600 font-semibold">{selectedOrderDetail.shippingMethod}</span></span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                              </button>

                              {/* Generate Shipping Label */}
                              <button
                                type="button"
                                onClick={() => {
                                  setIsDetailActionsOpen(false);
                                  triggerToast('Generating label for order...', 'info');
                                  setTimeout(() => {
                                    handleUpdateShippingLabel();
                                  }, 1000);
                                }}
                                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition border-b border-slate-100/60"
                              >
                                <div className="flex flex-col text-left">
                                  <span className="text-xs font-bold text-slate-800">Generate Shipping Label</span>
                                  <span className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">Register shipment & build sticker</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Printer className="h-3.5 w-3.5 text-slate-550 shrink-0" />
                                  <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                                </div>
                              </button>

                              {/* Delete Order */}
                              <button
                                type="button"
                                onClick={() => {
                                  setIsDetailActionsOpen(false);
                                  setOrderToDelete(selectedOrderDetail);
                                }}
                                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-rose-50/70 transition"
                              >
                                <div className="flex flex-col text-left">
                                  <span className="text-xs font-bold text-rose-600">Delete Order</span>
                                  <span className="text-[10px] text-rose-450 font-medium leading-tight mt-0.5">Permanently purge tracking history</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Trash2 className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                                  <ChevronRight className="h-4 w-4 text-rose-400 shrink-0" />
                                </div>
                              </button>
                            </>
                          )}

                          {detailMenuTab === 'status' && (
                            <div className="flex flex-col">
                              <button
                                type="button"
                                onClick={() => setDetailMenuTab('main')}
                                className="w-full flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-brand-700 hover:bg-brand-50/40 transition cursor-pointer sticky top-0"
                              >
                                <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
                                <span>Back to Main Options</span>
                              </button>
                              
                              <div className="py-1">
                                {[
                                  { name: 'New', desc: 'Set order as newly registered' },
                                  { name: 'In Production', desc: 'Move to packing & manufacturing' },
                                  { name: 'Shipped', desc: 'Mark package as handed off' },
                                  { name: 'On Hold', desc: 'Put under temporary review hold' },
                                  { name: 'Rejected', desc: 'Reject due to item error' },
                                  { name: 'Cancelled', desc: 'Cancel order permanently' }
                                ].map((item) => (
                                  <button
                                    key={item.name}
                                    type="button"
                                    onClick={() => {
                                      setIsDetailActionsOpen(false);
                                      setDetailMenuTab('main');
                                      handleUpdateOrderStatus(item.name);
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors border-b border-slate-100/50 last:border-b-0 ${
                                      selectedOrderDetail.orderStatus === item.name 
                                        ? 'bg-brand-50/70 text-brand-850' 
                                        : 'text-slate-705 hover:bg-slate-50'
                                    }`}
                                  >
                                    <div className="flex flex-col text-left">
                                      <span className={`text-xs font-bold ${selectedOrderDetail.orderStatus === item.name ? 'text-brand-800' : 'text-slate-800'}`}>{item.name}</span>
                                      <span className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">{item.desc}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      {selectedOrderDetail.orderStatus === item.name && <Check className="h-3.5 w-3.5 text-brand-600 mr-1" />}
                                      <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {detailMenuTab === 'shipping' && (
                            <div className="flex flex-col">
                              <button
                                type="button"
                                onClick={() => setDetailMenuTab('main')}
                                className="w-full flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-brand-700 hover:bg-brand-50/40 transition cursor-pointer sticky top-0"
                              >
                                <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
                                <span>Back to Main Options</span>
                              </button>
                              
                              <div className="py-1">
                                {[
                                  { name: 'UPS Ground', desc: 'Deliver using UPS Ground standard' },
                                  { name: 'FedEx Express', desc: 'Deliver using FedEx fast option' },
                                  { name: 'DHL Worldwide', desc: 'Deliver using supreme DHL parcel' },
                                  { name: 'USPS Priority', desc: 'Deliver using local priority option' }
                                ].map((item) => (
                                  <button
                                    key={item.name}
                                    type="button"
                                    onClick={() => {
                                      setIsDetailActionsOpen(false);
                                      setDetailMenuTab('main');
                                      handleUpdateShippingMethod(item.name);
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors border-b border-slate-100/50 last:border-b-0 ${
                                      selectedOrderDetail.shippingMethod === item.name 
                                        ? 'bg-brand-50/70 text-brand-850' 
                                        : 'text-slate-705 hover:bg-slate-50'
                                    }`}
                                  >
                                    <div className="flex flex-col text-left">
                                      <span className={`text-xs font-bold ${selectedOrderDetail.shippingMethod === item.name ? 'text-brand-800' : 'text-slate-800'}`}>{item.name}</span>
                                      <span className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">{item.desc}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      {selectedOrderDetail.shippingMethod === item.name && <Check className="h-3.5 w-3.5 text-brand-600 mr-1" />}
                                      <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

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
              <div className="flex-1 overflow-y-auto p-6 animate-none">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  {/* Left Column (2/3 width on md+) */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Unified Order Details section */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Order Details</h4>
                      <div className="border border-slate-200/65 rounded-xl bg-white overflow-hidden shadow-xs divide-y divide-slate-100">
                        {/* Meta Grid (Top part) */}
                        <div className="p-4 bg-slate-50/50 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">Store Name</span>
                            <span className="text-sm font-semibold text-slate-850 mt-1 block font-sans">{selectedOrderDetail.customerStore}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">Order Date</span>
                            <span className="text-sm font-normal text-slate-700 mt-1 block font-sans">{selectedOrderDetail.orderDate}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">Shipping Method</span>
                            <span className="text-sm font-semibold text-slate-850 mt-1 block font-sans">{selectedOrderDetail.shippingMethod || '—'}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">Total Quantity</span>
                            <span className="text-sm font-semibold text-slate-800 mt-1 block font-mono">{selectedOrderDetail.quantity}</span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">Order Status</span>
                            <div className="flex flex-col gap-1 mt-1 font-sans">
                              <span className={`inline-flex w-fit items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                selectedOrderDetail.orderStatus === 'New'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : selectedOrderDetail.orderStatus === 'In Production'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : selectedOrderDetail.orderStatus === 'Shipped'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : selectedOrderDetail.orderStatus === 'On Hold'
                                  ? 'bg-slate-100 text-slate-700 border-slate-200'
                                  : selectedOrderDetail.orderStatus === 'Rejected'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                              }`}>
                                {selectedOrderDetail.orderStatus}
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans">Shipping Status</span>
                            <div className="flex flex-col gap-1 mt-1 font-sans">
                              <span className={`inline-flex w-fit items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                selectedOrderDetail.shippingStatus === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : selectedOrderDetail.shippingStatus === 'In Transit'
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : selectedOrderDetail.shippingStatus === 'Out for Delivery'
                                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                  : selectedOrderDetail.shippingStatus === 'Pre Transit'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : selectedOrderDetail.shippingStatus === 'Available For Pickup'
                                  ? 'bg-teal-50 text-teal-700 border-teal-200'
                                  : selectedOrderDetail.shippingStatus === 'Return To Sender'
                                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                                  : selectedOrderDetail.shippingStatus === 'Failure'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : selectedOrderDetail.shippingStatus === 'Cancelled'
                                  ? 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}>
                                {selectedOrderDetail.shippingStatus || 'Unknown'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Addresses row (Bottom part) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 font-sans">
                          {/* Return Address */}
                          <div className="p-4 space-y-3 font-sans">
                            <h4 className="text-xs font-bold text-slate-800 tracking-wide uppercase">Return Address</h4>
                            <div className="text-xs text-slate-600 space-y-1 font-sans leading-relaxed">
                              <p className="font-bold text-slate-800 text-sm">
                                {selectedOrderDetail.returnAddress?.name || 'mytest'}
                              </p>
                              {selectedOrderDetail.returnAddress?.companyLine && <p>{selectedOrderDetail.returnAddress.companyLine}</p>}
                              <p>{selectedOrderDetail.returnAddress?.addressLine || '715 Broadway2313, United States,'}</p>
                              <p>{selectedOrderDetail.returnAddress?.cityStateZip || 'NY, 20912, US'}</p>
                            </div>
                          </div>

                          {/* Ship Address */}
                          <div className="p-4 space-y-3 font-sans">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-slate-800 tracking-wide uppercase">Ship Address</h4>
                              {!isEditingShipAddress ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const sAddr = selectedOrderDetail.shipAddress || {
                                      name: 'Auo Tivi',
                                      companyLine: '123',
                                      addressLine: '3002 WOLF LAKE BLVD, NEW ALBANY,',
                                      cityStateZip: 'Indiana, 80201, US',
                                      phone: '9734508586'
                                    };
                                    setShipName(sAddr.name);
                                    setShipCompanyLine(sAddr.companyLine);
                                    setShipAddressLine(sAddr.addressLine);
                                    setShipCityStateZip(sAddr.cityStateZip);
                                    setShipPhone(sAddr.phone);
                                    setIsEditingShipAddress(true);
                                  }}
                                  className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-slate-350 rounded-md text-[10px] font-bold text-slate-600 hover:bg-slate-50 cursor-pointer transition flex items-center gap-1 shadow-2xs focus:outline-none"
                                >
                                  <Edit className="h-3 w-3 text-slate-400" />
                                  <span>Edit Address</span>
                                </button>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setIsEditingShipAddress(false)}
                                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px] font-semibold cursor-pointer transition focus:outline-none"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleSaveShipAddress}
                                    className="px-2 py-1 bg-brand-500 hover:bg-brand-600 text-white rounded text-[10px] font-semibold cursor-pointer transition focus:outline-none"
                                  >
                                    Save
                                  </button>
                                </div>
                              )}
                            </div>

                            {!isEditingShipAddress ? (
                              <div className="text-xs text-slate-600 space-y-1 font-sans leading-relaxed">
                                <p className="font-bold text-slate-800 text-sm">
                                  {selectedOrderDetail.shipAddress?.name || 'Auo Tivi'}
                                </p>
                                {selectedOrderDetail.shipAddress?.companyLine && <p>{selectedOrderDetail.shipAddress.companyLine}</p>}
                                <p>{selectedOrderDetail.shipAddress?.addressLine || '3002 WOLF LAKE BLVD, NEW ALBANY,'}</p>
                                <p>{selectedOrderDetail.shipAddress?.cityStateZip || 'Indiana, 80201, US'}</p>
                                {selectedOrderDetail.shipAddress?.phone && (
                                  <p className="text-slate-500 font-mono text-[11px] mt-1">
                                    <span className="font-sans text-slate-400 font-bold text-[9px] uppercase tracking-wider mr-1">Phone:</span>
                                    {selectedOrderDetail.shipAddress.phone}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-2 pt-1 font-sans">
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Name / Recipient</label>
                                  <input
                                    type="text"
                                    value={shipName}
                                    onChange={(e) => setShipName(e.target.value)}
                                    className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-md px-2 py-1 h-7 focus:outline-none focus:border-brand-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Company Address Detail</label>
                                  <input
                                    type="text"
                                    value={shipCompanyLine}
                                    onChange={(e) => setShipCompanyLine(e.target.value)}
                                    className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-md px-2 py-1 h-7 focus:outline-none focus:border-brand-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Street Address</label>
                                  <input
                                    type="text"
                                    value={shipAddressLine}
                                    onChange={(e) => setShipAddressLine(e.target.value)}
                                    className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-md px-2 py-1 h-7 focus:outline-none focus:border-brand-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-0.5">City, State, Zip, Country</label>
                                  <input
                                    type="text"
                                    value={shipCityStateZip}
                                    onChange={(e) => setShipCityStateZip(e.target.value)}
                                    className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-md px-2 py-1 h-7 focus:outline-none focus:border-brand-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Phone Number</label>
                                  <input
                                    type="text"
                                    value={shipPhone}
                                    onChange={(e) => setShipPhone(e.target.value)}
                                    className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-md px-2 py-1 h-7 focus:outline-none focus:border-brand-500"
                                  />
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
                                  <td className="py-3 px-4 font-semibold text-slate-800">{item.productName}</td>
                                  <td className="py-3 px-4 text-xs font-mono font-medium text-slate-600">{item.styleColor}</td>
                                  <td className="py-3 px-4 text-xs font-mono font-medium text-slate-600">{item.sku}</td>
                                  <td className="py-3 px-4 text-right text-xs font-mono font-medium text-slate-600">{item.quantity}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td className="py-3 px-4 font-semibold text-slate-800">Classic Crewneck Apparel</td>
                                <td className="py-3 px-4 text-xs font-mono font-medium text-slate-600">Charcoal / M</td>
                                <td className="py-3 px-4 text-xs font-mono font-medium text-slate-600">APP-CRW-002</td>
                                <td className="py-3 px-4 text-right text-xs font-mono font-medium text-slate-600">{selectedOrderDetail.quantity}</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Shipment Information section */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Shipment Information</h4>
                      <div className="border border-slate-200/65 rounded-xl bg-white overflow-hidden shadow-xs divide-y divide-slate-100">
                        {/* Meta Specifications (Top part) */}
                        <div className="p-4 bg-slate-50/50 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          <div>
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">Carrier & Service Level</span>
                            <span className="text-sm font-semibold text-slate-850 mt-1 block font-sans">
                              {selectedOrderDetail.shipmentInfo?.carrier || '—'} {selectedOrderDetail.shipmentInfo?.service ? `(${selectedOrderDetail.shipmentInfo.service})` : ''}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">Ship Date</span>
                            <span className="text-sm font-normal text-slate-700 mt-1 block font-sans">
                              {selectedOrderDetail.shipmentInfo?.shipDate || '—'}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">Weight / Dimensions</span>
                            <span className="text-sm font-normal text-slate-700 mt-1 block font-sans">
                              {selectedOrderDetail.shipmentInfo?.weight || '—'} / {selectedOrderDetail.shipmentInfo?.size || '—'}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">Fulfillment Cost</span>
                            <span className="text-sm font-semibold text-slate-800 mt-1 block font-mono">
                              {selectedOrderDetail.shipmentInfo?.price || '—'}
                            </span>
                          </div>
                        </div>

                        {/* Addresses / Info Splitting (Bottom part) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                          {/* Left Column: Tracking info */}
                          <div className="p-4 space-y-3 font-sans">
                            <h4 className="text-xs font-bold text-slate-800 tracking-wide uppercase">Tracking Information</h4>
                            <div className="space-y-2">
                              <div>
                                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Tracking Number</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-sm font-mono font-bold text-slate-700 select-all block">
                                    {selectedOrderDetail.trackingNumber || 'Awaiting Shipment'}
                                  </span>
                                  {selectedOrderDetail.trackingNumber && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(selectedOrderDetail.trackingNumber || '');
                                        triggerToast('Tracking number copied!', 'success');
                                      }}
                                      className="p-1 text-slate-400 hover:text-slate-600 rounded transition hover:bg-slate-50 cursor-pointer inline-flex focus:outline-none"
                                      title="Copy Tracking Number"
                                    >
                                      <Copy className="h-3.5 w-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div>
                                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Courier Status</span>
                                <p className="text-xs text-slate-600 mt-0.5">
                                  {selectedOrderDetail.trackingNumber 
                                    ? "Tracking history registered on remote API. Delivery is expected within 3 business days." 
                                    : "Fulfillment transit information will be parsed upon shipping labels print/confirmation."}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Label detail button and Memo */}
                          <div className="p-4 space-y-3 font-sans">
                            <h4 className="text-xs font-bold text-slate-800 tracking-wide uppercase">Shipping Label & Verification</h4>
                            <div className="space-y-2.5">
                              <div>
                                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Fulfillment Document</span>
                                {selectedOrderDetail.shipmentInfo?.labelLink ? (
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(selectedOrderDetail.shipmentInfo?.labelLink || '');
                                        triggerToast('Label link copied!', 'success');
                                      }}
                                      className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-350 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer transition flex items-center gap-1.5 shadow-2xs focus:outline-none"
                                      title="Copy Label Link"
                                    >
                                      <Copy className="h-3.5 w-3.5 text-slate-400" />
                                      <span>Copy Link</span>
                                    </button>
                                    <a
                                      href={selectedOrderDetail.shipmentInfo.labelLink}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-750 border border-brand-100 rounded-lg text-xs font-bold cursor-pointer transition flex items-center gap-1.5 shadow-2xs focus:outline-none"
                                      title="Open Label"
                                    >
                                      <ExternalLink className="h-3.5 w-3.5 text-brand-600" />
                                      <span>Open Label</span>
                                    </a>
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-401 italic block mt-0.5">Not generated yet. Trigger action from top bar dropdown.</span>
                                )}
                              </div>
                              <div>
                                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Internal Note / Barcode status</span>
                                <p className="text-xs text-slate-550 leading-relaxed mt-0.5">
                                  Our conveyor belt matches barcodes automatically with dimensions. Contact supervisor if measurements are incorrect.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Right Column (1/3 width on md+): Internal Notes & Timeline */}
                  <div id="timeline-comment-section" className="border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6 flex flex-col h-full self-stretch min-h-0">
                    
                    {/* Timeline & Notes section */}
                    <div className="flex flex-col flex-1 min-h-0 space-y-3.5 pt-1">
                      <h4 className="text-sm font-bold text-slate-800">Timeline & Notes</h4>
                      
                      <div className="max-h-[360px] overflow-y-auto flex-1 scrollbar-thin pl-0 pr-1">
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

                      {/* Unified Notes Input */}
                      <div className="flex gap-2 items-center border-t border-slate-100 pt-3 mt-auto">
                        <input
                          type="text"
                          value={orderCommentText}
                          onChange={(e) => setOrderCommentText(e.target.value)}
                          placeholder="Enter internal note / comment..."
                          className="flex-1 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition bg-white border border-slate-200 rounded-lg px-3 py-1.5 h-8"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              // trigger comment submission on Enter key
                              const triggerCommentBtn = document.getElementById('add-comment-btn');
                              if (triggerCommentBtn) triggerCommentBtn.click();
                            }
                          }}
                        />
                        <button
                          id="add-comment-btn"
                          type="button"
                          onClick={() => {
                            if (!orderCommentText.trim()) return;
                            const val = orderCommentText.trim();
                            const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                            const newAct = {
                              id: `act_${Date.now()}`,
                              date: nowStr,
                              action: `Internal note: "${val}"`,
                              performedBy: 'Hiep Admin'
                            };

                            setOrders(prev => prev.map(o => {
                              if (o.id === selectedOrderDetail.id) {
                                  return { 
                                    ...o, 
                                    internalNotes: val,
                                    activityHistory: [newAct, ...(o.activityHistory || [])]
                                  };
                              }
                              return o;
                            }));

                            setSelectedOrderDetail(prev => prev ? { 
                              ...prev, 
                              internalNotes: val,
                              activityHistory: [newAct, ...(prev.activityHistory || [])]
                            } : null);

                            setOrderCommentText('');
                            triggerToast('Internal note saved!', 'success');
                          }}
                          className="h-8 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer shrink-0"
                        >
                          Save
                        </button>
                      </div>

                    </div>
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
              className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden border border-slate-100 z-50 text-xs font-sans"
            >
              <div className="px-5 py-5 bg-white border-b border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
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

              <div className="p-5 space-y-4">
                {/* Information cards group */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                    <span className="block text-xs font-medium text-slate-400">Customer</span>
                    <span className="text-sm font-semibold text-slate-800 block mt-1.5 text-ellipsis overflow-hidden">{selectedPODetail.customer || 'No customer'}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                    <span className="block text-xs font-medium text-slate-400">Total quantity</span>
                    <span className="text-sm font-semibold text-slate-800 block mt-1.5 font-mono">
                      {selectedPODetail.items ? selectedPODetail.items.reduce((sum, item) => sum + item.qty, 0) : 0} items
                    </span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                    <span className="block text-xs font-medium text-slate-400">Shipping carrier</span>
                    <span className="text-sm font-semibold text-slate-800 block mt-1.5 text-ellipsis overflow-hidden">{selectedPODetail.shippingCarrier}</span>
                  </div>
                  <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                    <span className="block text-xs font-medium text-slate-400">Status</span>
                    <div className="mt-1.5">
                      {selectedPODetail.orderStatus === 'New' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 border border-rose-100 text-rose-600">
                          New
                        </span>
                      )}
                      {selectedPODetail.orderStatus === 'Partial Received' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 border border-blue-100 text-blue-600">
                          Partial Received
                        </span>
                      )}
                      {selectedPODetail.orderStatus === 'Completed' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 border border-emerald-100 text-emerald-600">
                          Completed
                        </span>
                      )}
                      {selectedPODetail.orderStatus === 'Verified' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 border border-purple-100 text-purple-600">
                          Verified
                        </span>
                      )}
                      {selectedPODetail.orderStatus === 'Cancelled' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 border border-slate-100 text-slate-500">
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tracking input visual detail */}
                <div className="p-3 bg-slate-50/30 border border-slate-100 rounded-lg flex items-center justify-between text-xs font-sans">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <span className="text-xs font-medium text-slate-400">Tracking:</span>
                    <span className="font-mono text-xs font-semibold text-slate-750 select-all ml-1">{selectedPODetail.tracking}</span>
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
                        <Check className="h-3.5 w-3.5 text-emerald-600 animate-in fade-in zoom-in duration-200" />
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
                <div className="space-y-2">
                  <span className="block text-xs font-medium text-slate-405">
                    Items list
                  </span>
                  
                  <div className="border border-slate-100 rounded-lg overflow-hidden bg-white max-h-[180px] overflow-y-auto shadow-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-550 border-b border-slate-100 font-semibold text-[11px] uppercase tracking-wide select-none">
                          <th className="py-2.5 px-4 font-semibold uppercase">Product info</th>
                          <th className="py-2.5 px-4 font-semibold uppercase">SKU</th>
                          <th className="py-2.5 px-4 font-semibold uppercase text-right">Qty</th>
                          <th className="py-2.5 px-4 font-semibold uppercase text-right">Received Qty</th>
                          <th className="py-2.5 px-4 font-semibold uppercase text-right">Incoming Qty</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {selectedPODetail.items && selectedPODetail.items.length > 0 ? (
                          selectedPODetail.items.map((item, id) => (
                            <tr key={id} className="hover:bg-slate-50/50">
                              <td className="py-2.5 px-4 font-bold text-slate-800">{item.productInfo}</td>
                              <td className="py-2.5 px-4 text-slate-700 font-mono text-[11px] font-medium">{item.sku}</td>
                              <td className="py-2.5 px-4 text-right font-medium text-slate-700 font-mono">{item.qty}</td>
                              <td className="py-2.5 px-4 text-right font-medium text-slate-700 font-mono">{item.receivedQty ?? item.qty}</td>
                              <td className="py-2.5 px-4 text-right font-medium text-slate-700 font-mono">{item.incomingQty ?? item.qty}</td>
                            </tr>
                          ))
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

              <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPODetail(null);
                    setIsEditingWroNo(false);
                  }}
                  className="px-5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer outline-none md:btn-secondary-sheen"
                >
                  Close
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

    </div>
  );
}
