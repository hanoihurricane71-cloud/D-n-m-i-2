import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ChevronDown, Shirt, Layers, Coffee, ShoppingBag, GlassWater, Tag,
  BookOpen, Smartphone, Image as ImageIcon, Smile, Home, Gift, Heart, Box, 
  Package, Palette, Wind, Scissors, Sparkles, Crown, Upload, FileImage
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { CUSTOMER_OPTIONS } from '../data';

export const PRESET_TYPES = [
  { label: 'T-Shirt', iconName: 'shirt', icon: Shirt, defaultTypeName: 'T-Shirt' },
  { label: 'Hoodie / Fleece', iconName: 'layers', icon: Layers, defaultTypeName: 'Hoodie' },
  { label: 'Mug', iconName: 'coffee', icon: Coffee, defaultTypeName: 'Mug' },
  { label: 'Tote Bag', iconName: 'shoppingbag', icon: ShoppingBag, defaultTypeName: 'Tote Bag' },
  { label: 'Tumbler', iconName: 'glasswater', icon: GlassWater, defaultTypeName: 'Tumbler' },
  { label: 'Notebook', iconName: 'bookopen', icon: BookOpen, defaultTypeName: 'Notebook' },
  { label: 'Phone Case', iconName: 'smartphone', icon: Smartphone, defaultTypeName: 'Phone Case' },
  { label: 'Poster', iconName: 'image', icon: ImageIcon, defaultTypeName: 'Poster' },
  { label: 'Sticker', iconName: 'smile', icon: Smile, defaultTypeName: 'Sticker' },
  { label: 'Pillow', iconName: 'home', icon: Home, defaultTypeName: 'Pillow' },
  { label: 'Keychain', iconName: 'gift', icon: Gift, defaultTypeName: 'Keychain' },
  { label: 'Greeting Card', iconName: 'heart', icon: Heart, defaultTypeName: 'Greeting Card' },
  { label: 'Socks', iconName: 'box', icon: Box, defaultTypeName: 'Socks' },
  { label: 'Backpack', iconName: 'package', icon: Package, defaultTypeName: 'Backpack' },
  { label: 'Apron', iconName: 'palette', icon: Palette, defaultTypeName: 'Apron' },
  { label: 'Mask', iconName: 'wind', icon: Wind, defaultTypeName: 'Mask' },
  { label: 'DIY Custom', iconName: 'scissors', icon: Scissors, defaultTypeName: 'DIY Custom' },
  { label: 'Cap / Hat', iconName: 'crown', icon: Crown, defaultTypeName: 'Cap' },
  { label: 'Accessory', iconName: 'sparkles', icon: Sparkles, defaultTypeName: 'Accessory' },
  { label: 'Label Tag', iconName: 'tag', icon: Tag, defaultTypeName: 'Label Tag' }
];

export const CUSTOM_ICON_PRESET = { label: 'Upload Custom Icon', iconName: 'custom', icon: Upload, defaultTypeName: 'Custom Product' };

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'Product' | 'Type' | 'Style' | 'Color' | 'Size';
  types?: Array<{ id: string; typeName: string; createdAt: string; createdBy: string; iconName?: string }>;
  styles?: Array<{ id: string; productName: string; productStyle: string; type: string; createdAt: string; createdBy: string }>;
  colors?: Array<{ id: string; colorName: string; colorHexCode: string; colorPreview: string; createdAt: string; createdBy: string }>;
  sizes?: Array<{ id: string; sizeName: string; createdAt: string; createdBy: string }>;
  onCreate: (data: any) => void;
  id?: string;
}

interface SearchableSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  openUp?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  openUp = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSearch('');
    }
  }, [isOpen]);

  const filtered = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 px-3 w-full border border-slate-200 bg-white rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 cursor-pointer flex items-center justify-between gap-1 select-none font-sans"
      >
        <span className={value ? "text-slate-800 font-semibold" : "text-slate-400"}>
          {value || label}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: openUp ? -4 : 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: openUp ? -4 : 4 }}
            transition={{ duration: 0.1 }}
            className={`absolute left-0 w-full bg-white rounded-lg shadow-lg border border-slate-100 z-50 py-1 flex flex-col max-h-56 min-w-[110px] ${
              openUp ? 'bottom-full mb-1' : 'top-full mt-1'
            }`}
          >
            {/* Search Input */}
            <div className="px-2 py-1.5 border-b border-slate-50 flex items-center gap-1.5 bg-slate-50/50">
              <svg className="h-3.5 w-3.5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholder}
                className="w-full text-[11px] bg-transparent border-0 p-0 focus:outline-none focus:ring-0 text-slate-800 placeholder-slate-400 font-sans"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Options List */}
            <div className="overflow-y-auto flex-1 py-0.5">
              {filtered.length === 0 ? (
                <div className="px-3 py-2 text-xs text-slate-400 italic text-center">
                  None matching
                </div>
              ) : (
                filtered.map((opt) => {
                  const isSelected = value === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        onChange(opt);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors block cursor-pointer truncate ${
                        isSelected 
                          ? 'bg-brand-50 text-brand-700 font-semibold' 
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const AVAILABLE_ICONS = [
  { name: 'Shirt', label: 'T-Shirt', icon: Shirt },
  { name: 'Layers', label: 'Fleece', icon: Layers },
  { name: 'Coffee', label: 'Mug', icon: Coffee },
  { name: 'ShoppingBag', label: 'Bag', icon: ShoppingBag },
  { name: 'GlassWater', label: 'Tumbler', icon: GlassWater },
  { name: 'Tag', label: 'Tag', icon: Tag },
];

export const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  types = [],
  styles = [],
  colors = [],
  sizes = [],
  onCreate,
  id
}) => {
  // 1. States for standard 'Product' Creation
  const [name, setName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [skuCode, setSkuCode] = useState('');
  const [weight, setWeight] = useState<string>('');
  const [packagingWeight, setPackagingWeight] = useState<string>('');
  const [productCustomer, setProductCustomer] = useState('');

  // States for Employee Scanning
  const [employeeId, setEmployeeId] = useState('');
  const [tempEmpId, setTempEmpId] = useState('');

  // States for product image upload
  const [productImgData, setProductImgData] = useState<string>('');
  const [productImgError, setProductImgError] = useState<string>('');
  const productFileInputRef = useRef<HTMLInputElement>(null);

  // Reset employee scanning details when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmployeeId('');
      setTempEmpId('');
      setProductImgData('');
      setProductImgError('');
    }
  }, [isOpen]);

  // Weight validation states
  const [weightError, setWeightError] = useState('');
  const [pkgWeightError, setPkgWeightError] = useState('');

  const styleOptions = Array.from(new Set([...styles.map(s => s.productStyle), 'G500', 'C100', 'V200', 'H800', 'P300'])).filter(Boolean);
  const colorOptions = Array.from(new Set([...colors.map(c => c.colorName), 'Dark blue', 'Red', 'White', 'Black', 'Blue'])).filter(Boolean);
  const sizeOptions = Array.from(new Set([...sizes.map(s => s.sizeName), 'S', 'M', 'L', 'XL'])).filter(Boolean);

  // 2. States for 'Type' Creation
  const [typeName, setTypeName] = useState('');
  const [selectedTypeIcon, setSelectedTypeIcon] = useState('shirt');
  const [customIconData, setCustomIconData] = useState<string>('');
  const [customIconError, setCustomIconError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleIconFile = (file: File) => {
    if (!file) return;
    if (!['image/png', 'image/svg+xml', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
      setCustomIconError('Only PNG, SVG, JPG, WEBP formats are supported!');
      return;
    }
    if (file.size > 500 * 1024) {
      setCustomIconError('Maximum file size is 500KB!');
      return;
    }

    setCustomIconError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setCustomIconData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 3. States for 'Style' Creation
  const [productName, setProductName] = useState('');
  const [productStyle, setProductStyle] = useState('');
  const [styleType, setStyleType] = useState('');

  // 4. States for 'Color' Creation
  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState('#843AEC');

  // 5. States for 'Size' Creation
  const [sizeName, setSizeName] = useState('');

  // Sane defaults for missing UI fields to satisfy full format structure of Product
  const incomingStock = 0;
  const stockLimit = 100;
  const customer = 'Olivia Rhye';
  const user = employeeId || 'System';

  // Automatically update SKU field based on style/color/size selectors for Product Tab
  useEffect(() => {
    if (selectedStyle && selectedColor && selectedSize) {
      const genSku = `${selectedStyle.substring(0, 4)}-${selectedColor.substring(0, 4)}-${selectedSize}`.toUpperCase().replace(/\s/g, '');
      setSkuCode(genSku);
    }
  }, [selectedStyle, selectedColor, selectedSize]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'Product') {
      if (!name.trim() || !productCustomer) return;
      if (!productImgData) {
        setProductImgError('Product image is required');
        return;
      }
      if (weightError || pkgWeightError) return;

      const finalSkuSuffix = skuCode.trim() || 'UNGSBHOOS';
      const styleString = `${selectedStyle || 'G500'} / ${selectedColor || 'Dark blue'} / ${selectedSize || 'XL'}`;

      onCreate({
        active: true,
        name: name.trim(),
        sku: `${styleString}\n${finalSkuSuffix}`,
        incomingStock,
        stockQty: `In stock: ${stockLimit}`,
        weight: parseFloat(weight) || 21.3,
        packagingWeight: parseFloat(packagingWeight) || 1.2,
        customer: productCustomer,
        user,
        style: selectedStyle || 'G500',
        color: selectedColor || 'Dark blue',
        size: selectedSize || 'XL',
        image: productImgData
      });

      // Reset Product fields
      setName('');
      setSelectedStyle('');
      setSelectedColor('');
      setSelectedSize('');
      setSkuCode('');
      setWeight('');
      setPackagingWeight('');
      setProductCustomer('');
      setWeightError('');
      setPkgWeightError('');
      setEmployeeId('');
      setTempEmpId('');
      setProductImgData('');
      setProductImgError('');

    } else if (activeTab === 'Type') {
      if (!typeName.trim()) return;
      const iconValue = selectedTypeIcon === 'custom' ? (customIconData || 'tag') : selectedTypeIcon;
      onCreate({ typeName: typeName.trim(), iconName: iconValue });
      setTypeName('');
      setSelectedTypeIcon('shirt');
      setCustomIconData('');
      setCustomIconError('');

    } else if (activeTab === 'Style') {
      if (!productName.trim() || !productStyle.trim()) return;
      onCreate({
        productName: productName.trim(),
        productStyle: productStyle.trim(),
        type: styleType || 'Tee'
      });
      setProductName('');
      setProductStyle('');
      setStyleType('');

    } else if (activeTab === 'Color') {
      if (!colorName.trim()) return;
      onCreate({
        colorName: colorName.trim(),
        colorHexCode: colorHex.toUpperCase(),
        colorPreview: colorHex
      });
      setColorName('');
      setColorHex('#843AEC');

    } else if (activeTab === 'Size') {
      if (!sizeName.trim()) return;
      onCreate({ sizeName: sizeName.trim() });
      setSizeName('');
    }

    onClose();
  };

  const getModalTitle = () => {
    if (activeTab === 'Product') return 'Create product';
    if (activeTab === 'Type') return 'Create product type';
    if (activeTab === 'Style') return 'Create product style';
    if (activeTab === 'Color') return 'Create product color';
    if (activeTab === 'Size') return 'Create product size';
    return 'Create';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" id={id}>
          {/* Backdrop screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
              <h3 className="font-semibold text-lg text-slate-900 font-sans select-none">{getModalTitle()}</h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer outline-none focus:outline-none focus:ring-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
              
              {/* Dynamic inputs rendering base on current tab */}
              {activeTab === 'Product' && (
                <>
                  {/* Common Employee ID Card block */}
                  {employeeId ? (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 flex items-center justify-between mb-5">
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
                          setEmployeeId('');
                          setTempEmpId('');
                        }}
                        className="px-3 h-8 border border-slate-200 hover:bg-slate-100 bg-white text-slate-700 rounded-lg text-xs font-bold transition duration-150 shadow-sm cursor-pointer inline-flex items-center justify-center shrink-0"
                      >
                        Log out
                      </button>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 flex flex-col justify-center space-y-2 mb-5">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                          Employee ID <span className="text-slate-400 font-normal ml-0.5">*</span>
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={tempEmpId}
                            onChange={(e) => setTempEmpId(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && tempEmpId.trim()) {
                                setEmployeeId(tempEmpId);
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
                            if (tempEmpId.trim()) {
                              setEmployeeId(tempEmpId);
                            }
                          }}
                          disabled={!tempEmpId.trim()}
                          className="px-4 h-10 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition duration-150 cursor-pointer shadow-sm shrink-0"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[150px_1fr] items-start gap-y-5 gap-x-4">
                  {/* Name */}
                  <label className="text-sm font-semibold text-slate-650 pt-2 shrink-0">
                    Product name <span className="text-slate-400 font-normal ml-0.5">*</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Tshirt with dragon artwork"
                      className="w-full h-10 px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-medium"
                    />
                  </div>

                  {/* Dropdowns */}
                  <label className="text-sm font-semibold text-slate-650 pt-2 shrink-0">
                    Style / color / size <span className="text-slate-400 font-normal ml-0.5">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Style Searchable Select */}
                    <SearchableSelect 
                      label="Style"
                      placeholder="Search style..."
                      options={styleOptions}
                      value={selectedStyle}
                      onChange={setSelectedStyle}
                    />

                    {/* Color Searchable Select */}
                    <SearchableSelect 
                      label="Color"
                      placeholder="Search color..."
                      options={colorOptions}
                      value={selectedColor}
                      onChange={setSelectedColor}
                    />

                    {/* Size Searchable Select */}
                    <SearchableSelect 
                      label="Size"
                      placeholder="Search size..."
                      options={sizeOptions}
                      value={selectedSize}
                      onChange={setSelectedSize}
                    />
                  </div>

                  {/* Decorative divider Row spanning across the 2 columns layout */}
                  <div className="col-span-2 py-1 flex items-center justify-center">
                    <div className="w-full grid grid-cols-[130px_1fr] sm:grid-cols-[150px_1fr] items-center gap-4">
                      <div />
                      <div className="relative flex items-center w-full">
                        <div className="flex-grow border-t border-slate-100"></div>
                        <span className="flex-shrink mx-4 text-xs font-medium text-slate-400">Or</span>
                        <div className="flex-grow border-t border-slate-100"></div>
                      </div>
                    </div>
                  </div>

                  {/* SKU */}
                  <label className="text-sm font-semibold text-slate-650 pt-2 shrink-0">
                    SKU <span className="text-slate-400 font-normal ml-0.5">*</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      value={skuCode}
                      onChange={(e) => setSkuCode(e.target.value)}
                      placeholder="e.g. UNGSBHOOS"
                      className="w-full h-10 px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>

                  {/* Item weight (oz) */}
                  <label className="text-sm font-semibold text-slate-650 pt-2 shrink-0">
                    Item weight (oz) <span className="text-slate-400 font-normal ml-0.5">*</span>
                  </label>
                  <div>
                    <div className={`relative flex items-center h-10 rounded-lg border focus-within:ring-1 focus-within:ring-brand-500 overflow-hidden bg-white ${weightError ? 'border-rose-400 focus-within:border-rose-500 focus-within:ring-rose-550' : 'border-slate-200 focus-within:border-brand-500'}`}>
                      <input
                        type="text"
                        required
                        value={weight}
                        onChange={(e) => {
                          const val = e.target.value;
                          setWeight(val);
                          if (val && !/^\d*\.?\d*$/.test(val)) {
                            setWeightError('Only numbers are allowed');
                          } else {
                            setWeightError('');
                          }
                        }}
                        placeholder="Enter item weight"
                        className="w-full h-full px-3.5 text-sm text-slate-800 placeholder-slate-400 bg-transparent border-0 focus:outline-none focus:ring-0"
                      />
                      <span className="text-sm font-semibold text-slate-400 pr-3.5 select-none bg-white">
                        oz
                      </span>
                    </div>
                    {weightError && (
                      <p className="text-xs text-rose-500 mt-1 font-semibold">
                        ⚠️ Please enter numbers only (e.g. 21.3)
                      </p>
                    )}
                  </div>

                  {/* Packaging weight (lbs) */}
                  <label className="text-sm font-semibold text-slate-650 pt-2 shrink-0">
                    Packaging weight (lbs) <span className="text-slate-400 font-normal ml-0.5">*</span>
                  </label>
                  <div>
                    <div className={`relative flex items-center h-10 rounded-lg border focus-within:ring-1 focus-within:ring-brand-500 overflow-hidden bg-white ${pkgWeightError ? 'border-rose-400 focus-within:border-rose-500 focus-within:ring-rose-550' : 'border-slate-200 focus-within:border-brand-500'}`}>
                      <input
                        type="text"
                        required
                        value={packagingWeight}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPackagingWeight(val);
                          if (val && !/^\d*\.?\d*$/.test(val)) {
                            setPkgWeightError('Only numbers are allowed');
                          } else {
                            setPkgWeightError('');
                          }
                        }}
                        placeholder="Enter packaging weight"
                        className="w-full h-full px-3.5 text-sm text-slate-800 placeholder-slate-400 bg-transparent border-0 focus:outline-none focus:ring-0"
                      />
                      <span className="text-sm font-semibold text-slate-400 pr-3.5 select-none bg-white">
                        lbs
                      </span>
                    </div>
                    {pkgWeightError && (
                      <p className="text-xs text-rose-500 mt-1 font-semibold">
                        ⚠️ Please enter numbers only (e.g. 1.2)
                      </p>
                    )}
                  </div>

                  {/* Customer */}
                  <label className="text-sm font-semibold text-slate-650 pt-2 shrink-0">
                    Customer <span className="text-slate-400 font-normal ml-0.5">*</span>
                  </label>
                  <div>
                    <SearchableSelect 
                      label="Select customer"
                      placeholder="Search customer..."
                      options={CUSTOMER_OPTIONS.filter(c => c !== 'All Customers')}
                      value={productCustomer}
                      onChange={setProductCustomer}
                      openUp={true}
                    />
                  </div>

                  {/* Required Product Image Upload */}
                  <label className="text-sm font-semibold text-slate-650 pt-2 shrink-0">
                    Product image <span className="text-rose-500 font-bold ml-0.5">*</span>
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={productFileInputRef}
                      className="hidden"
                      accept="image/png, image/svg+xml, image/jpeg, image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (!['image/png', 'image/svg+xml', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type)) {
                            setProductImgError('Only PNG, SVG, JPG, WEBP formats are supported!');
                            return;
                          }
                          if (file.size > 2 * 1024 * 1024) {
                            setProductImgError('Maximum file size is 2MB!');
                            return;
                          }
                          setProductImgError('');
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setProductImgData(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />

                    <div 
                      onClick={() => productFileInputRef.current?.click()}
                      className={`border border-dashed rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center group ${
                        productImgData 
                          ? 'border-emerald-300 bg-emerald-50/10' 
                          : 'border-slate-200 hover:border-brand-400 bg-slate-50/30 hover:bg-slate-50'
                      }`}
                    >
                      {productImgData ? (
                        <div className="relative h-20 w-auto min-w-[80px] max-w-[120px] rounded-lg bg-white border border-slate-200 p-1.5 flex items-center justify-center shadow-xs">
                          <img src={productImgData} alt="Product Preview" className="h-full w-full object-contain rounded-md" referrerPolicy="no-referrer" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setProductImgData('');
                              setProductImgError('');
                              if (productFileInputRef.current) productFileInputRef.current.value = '';
                            }}
                            className="absolute -top-1.5 -right-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 transition-all shadow-md block border-0 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-1">
                          <div className="h-9 w-9 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400 bg-white group-hover:scale-105 transition-all">
                            <Upload className="h-4.5 w-4.5" />
                          </div>
                          <span className="text-xs font-bold text-slate-600 mt-2 hover:text-brand-600 transition-colors">
                            Click to upload product image
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            PNG, JPG, WEBP up to 2MB (Required)
                          </span>
                        </div>
                      )}
                    </div>
                    {productImgError && (
                      <p className="text-xs text-rose-500 mt-1 font-semibold">{productImgError}</p>
                    )}
                  </div>
                </div>
                </>
              )}

              {activeTab === 'Type' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[150px_1fr] items-start gap-x-4">
                    <label className="text-sm font-semibold text-slate-650 pt-2 shrink-0">
                      Name <span className="text-slate-400 font-normal ml-0.5">*</span>
                    </label>
                    <div className="w-full">
                      <input
                        type="text"
                        required
                        value={typeName}
                        onChange={(e) => setTypeName(e.target.value)}
                        placeholder="e.g. Heavyweight Tee"
                        className="w-full h-10 px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 font-sans select-none">
                      Choose Preset Product Icon
                    </label>
                    
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[160px] overflow-y-auto pr-1 bg-slate-50/50 p-2 rounded-xl border border-slate-100/80">
                      {PRESET_TYPES.map((preset) => {
                        const IconComponent = preset.icon;
                        const isSelected = selectedTypeIcon === preset.iconName;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              setSelectedTypeIcon(preset.iconName);
                              // Auto fill type name if empty or is currently set to another preset default name
                              const isCurrentEmptyOrCreateDefault = !typeName.trim() || PRESET_TYPES.some(p => p.defaultTypeName === typeName) || typeName === 'Custom Product';
                              if (isCurrentEmptyOrCreateDefault) {
                                setTypeName(preset.defaultTypeName);
                              }
                            }}
                            className={`flex flex-col items-center justify-center p-1.5 rounded-xl border transition-all duration-150 cursor-pointer text-center h-[64px] ${
                              isSelected
                                ? 'border-brand-500 bg-brand-50/40 text-brand-700 ring-2 ring-brand-500/20 shadow-sm font-semibold text-[10px]'
                                : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80 text-slate-650 font-medium text-[10px]'
                            }`}
                          >
                            <IconComponent className={`h-4.5 w-4.5 mb-1 ${isSelected ? 'text-brand-600 scale-110' : 'text-slate-400'} transition-transform`} />
                            <span className="text-[9px] tracking-tight leading-tight select-none line-clamp-1">
                              {preset.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Highlighted Separate Section for Custom Upload */}
                  <div className="border-t border-slate-100 pt-4 mt-2">
                    <div 
                      onClick={() => {
                        setSelectedTypeIcon('custom');
                        const isCurrentEmptyOrCreateDefault = !typeName.trim() || PRESET_TYPES.some(p => p.defaultTypeName === typeName);
                        if (isCurrentEmptyOrCreateDefault) {
                          setTypeName('Custom Product');
                        }
                        // Instantly trigger the native local file preview loader in 1 click!
                        setTimeout(() => {
                          fileInputRef.current?.click();
                        }, 20);
                      }}
                      className={`p-3.5 rounded-xl border border-dashed transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group relative overflow-hidden ${
                        selectedTypeIcon === 'custom'
                          ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/25 shadow-sm'
                          : 'border-slate-200 hover:border-brand-300 bg-slate-50/20 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg transition-colors ${
                          selectedTypeIcon === 'custom' 
                            ? 'bg-brand-100 text-brand-600' 
                            : 'bg-slate-100 text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-500'
                        }`}>
                          <Upload className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <h4 className={`text-xs font-bold font-sans ${selectedTypeIcon === 'custom' ? 'text-brand-800' : 'text-slate-700'}`}>
                            Upload Custom Icon Instead
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Upload your custom PNG, SVG or WEBP vector design file
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selectedTypeIcon === 'custom' 
                            ? 'border-brand-500 bg-brand-500 text-white' 
                            : 'border-slate-300'
                        }`}>
                          {selectedTypeIcon === 'custom' && (
                            <div className="h-1.5 w-1.5 bg-white rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Custom File Upload Section */}
                  {selectedTypeIcon === 'custom' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-dashed border-brand-200 rounded-xl p-3 bg-brand-50/5 flex flex-col items-center justify-center space-y-2 text-center mt-2 relative"
                    >
                      {customIconData ? (
                        <div className="flex items-center justify-center gap-4 w-full py-1">
                          <div className="relative h-14 w-14 rounded-lg bg-white border border-brand-200 p-2 flex items-center justify-center shadow-md shrink-0 ring-2 ring-brand-500/10">
                            <img src={customIconData} alt="Custom Icon Preview" className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                            <button
                              type="button"
                              onClick={() => {
                                setCustomIconData('');
                                setCustomIconError('');
                              }}
                              className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 hover:bg-rose-600 transition-all shadow-md block border-0 cursor-pointer"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <div className="flex flex-col items-start text-left shrink-0">
                            <span className="text-xs font-bold text-slate-700">Custom Icon Selected</span>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="h-8 px-3 rounded-lg border border-slate-200 hover:border-brand-400 bg-white text-xs font-bold text-slate-755 hover:text-brand-600 shadow-sm transition-all cursor-pointer flex items-center gap-1.5 mt-1.5"
                            >
                              <Upload className="h-3 w-3 text-slate-400" />
                              Change Icon
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-1.5 flex flex-col items-center justify-center cursor-pointer group"
                        >
                          <div className="h-10 w-10 rounded-full border border-dashed border-brand-300 flex items-center justify-center text-brand-500 bg-brand-50 group-hover:bg-brand-100 group-hover:scale-105 transition-all">
                            <FileImage className="h-4.5 w-4.5" />
                          </div>
                          <span className="text-xs font-bold text-brand-700 mt-1.5 hover:text-brand-800 transition-colors">
                            Click to upload PNG or SVG icon
                          </span>
                          <span className="text-[9px] text-slate-400 mt-0.5">
                            Maximum size 500KB
                          </span>
                        </div>
                      )}

                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept=".png,.svg,.jpg,.jpeg,.webp" 
                        className="sr-only hidden" 
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleIconFile(f);
                          e.target.value = ''; // allow uploading same file again
                        }}
                      />

                      {customIconError && (
                        <p className="text-xs text-rose-500 font-semibold mt-1">{customIconError}</p>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {activeTab === 'Style' && (
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[150px_1fr] items-start gap-y-5 gap-x-4">
                  <label className="text-sm font-semibold text-slate-650 pt-2 shrink-0">
                    Product name <span className="text-slate-400 font-normal ml-0.5">*</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      required
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="e.g. T-shirt with rabbit"
                      className="w-full h-10 px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-medium"
                    />
                  </div>

                  <label className="text-sm font-semibold text-slate-650 pt-2 shrink-0">
                    Product style <span className="text-slate-400 font-normal ml-0.5">*</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      required
                      value={productStyle}
                      onChange={(e) => setProductStyle(e.target.value)}
                      placeholder="e.g. G5000"
                      className="w-full h-10 px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-medium"
                    />
                  </div>

                  <label className="text-sm font-semibold text-slate-650 pt-2 shrink-0">
                    Type <span className="text-slate-400 font-normal ml-0.5">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <select
                      value={styleType}
                      onChange={(e) => setStyleType(e.target.value)}
                      required
                      className="h-10 pl-3.5 pr-10 w-full border border-slate-200 bg-white rounded-lg text-xs font-semibold text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 cursor-pointer appearance-none font-medium text-left"
                    >
                      <option value="">Select</option>
                      {types.map((t) => (
                        <option key={t.id} value={t.typeName}>{t.typeName}</option>
                      ))}
                    </select>
                    <ChevronDown className="h-4 w-4 text-slate-400 absolute right-3 pointer-events-none" />
                  </div>
                </div>
              )}

              {activeTab === 'Color' && (
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[150px_1fr] items-start gap-y-5 gap-x-4">
                  <label className="text-sm font-semibold text-slate-650 pt-2 shrink-0">
                    Product name <span className="text-slate-400 font-normal ml-0.5">*</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      required
                      value={colorName}
                      onChange={(e) => setColorName(e.target.value)}
                      placeholder="e.g. Tshirt with dragon artwork"
                      className="w-full h-10 px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-medium"
                    />
                  </div>

                  <label className="text-sm font-semibold text-slate-650 pt-2 shrink-0">
                    Color <span className="text-slate-400 font-normal ml-0.5">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <label htmlFor="native-color-picker" className="flex items-center gap-2.5 h-10 px-3.5 w-full border border-slate-200 bg-white rounded-lg cursor-pointer hover:bg-slate-50 transition-colors select-none">
                      <span 
                        className="h-5 w-5 rounded border border-black/10 shadow-sm shrink-0 block" 
                        style={{ backgroundColor: colorHex }} 
                      />
                      <span className="font-mono text-sm font-semibold text-slate-700 uppercase">{colorHex.toUpperCase().replace('#', '')}</span>
                      <span className="ml-auto inline-flex items-center text-slate-400 pr-1 hover:text-slate-600 transition-colors">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </span>
                    </label>
                    <input 
                      id="native-color-picker"
                      type="color" 
                      value={colorHex} 
                      onChange={(e) => setColorHex(e.target.value)}
                      className="sr-only"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'Size' && (
                <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[150px_1fr] items-start gap-y-5 gap-x-4">
                  <label className="text-sm font-semibold text-slate-650 pt-2 shrink-0">
                    Size name <span className="text-slate-400 font-normal ml-0.5">*</span>
                  </label>
                  <div>
                    <input
                      type="text"
                      required
                      value={sizeName}
                      onChange={(e) => setSizeName(e.target.value)}
                      placeholder="e.g. Extra large"
                      className="w-full h-10 px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Actions Footer row */}
              <div className="pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 h-10 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold cursor-pointer outline-none focus:outline-none focus:ring-0 btn-secondary-sheen"
                >
                  Cancel
                </button>
                 <button
                   type="submit"
                   disabled={activeTab === 'Product' && (!employeeId.trim() || !productImgData)}
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
  );
};
