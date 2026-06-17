import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Calendar, LucideIcon, Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface FilterDropdownProps {
  label: string;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  icon?: LucideIcon;
  id?: string;
  showSearch?: boolean;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  selected,
  onSelect,
  icon: Icon,
  id,
  showSearch = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset filter search query when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchVal('');
    }
  }, [isOpen]);

  const hasValueSelected = selected && !selected.startsWith('All');

  // Helper function to map option string to styles for triggers, dots, and tags
  const getStatusStyle = (opt: string) => {
    const normalized = opt.toLowerCase().trim();
    
    // NEW / PENDING / PRE TRANSIT (Amber)
    if (
      normalized === 'new' ||
      normalized === 'pending' ||
      normalized === 'pre transit'
    ) {
      return {
        btn: 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100/70',
        dot: 'bg-amber-600',
        badge: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-700 shadow-xs'
      };
    }

    // IN PRODUCTION / PROCESSING / PARTIAL RECEIVED (Blue)
    if (
      normalized === 'in production' ||
      normalized === 'processing' ||
      normalized === 'partial received'
    ) {
      return {
        btn: 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100/70',
        dot: 'bg-blue-600',
        badge: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 border border-blue-200 text-blue-700 shadow-xs'
      };
    }

    // SHIPPED / DELIVERED / IN STOCK / COMPLETED / RETURN (Emerald/Green)
    if (
      normalized === 'shipped' ||
      normalized === 'delivered' ||
      normalized === 'in stock' || 
      normalized === 'completed' || 
      normalized === 'return'
    ) {
      return {
        btn: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70',
        dot: 'bg-emerald-600',
        badge: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-xs'
      };
    }

    // ON HOLD / UNSHIPPED / NOT RETURN / UNKNOWN (Slate)
    if (
      normalized === 'on hold' ||
      normalized === 'unshipped' ||
      normalized === 'not return' ||
      normalized === 'unknown'
    ) {
      return {
        btn: 'border-slate-205 bg-slate-100 text-slate-700 hover:bg-slate-150',
        dot: 'bg-slate-500',
        badge: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 border border-slate-200 text-slate-700 shadow-xs'
      };
    }

    // REJECTED / OUT OF STOCK / EXCEPTION / FAILURE (Rose)
    if (
      normalized === 'rejected' ||
      normalized === 'out of stock' ||
      normalized === 'new order' ||
      normalized === 'exception' ||
      normalized === 'failure'
    ) {
      return {
        btn: 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100/70',
        dot: 'bg-rose-600',
        badge: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 border border-rose-250 text-rose-700 shadow-xs'
      };
    }

    // CANCELLED (Muted slate with line-though)
    if (normalized === 'cancelled') {
      return {
        btn: 'border-slate-200 bg-slate-50 text-slate-400 line-through hover:bg-slate-100',
        dot: 'bg-slate-400',
        badge: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 border border-slate-200 text-slate-400 line-through shadow-xs'
      };
    }
    
    // VERIFIED / IN TRANSIT / OUT FOR DELIVERY (Purple/Indigo)
    if (
      normalized === 'verified' || 
      normalized === 'in transit' ||
      normalized === 'out for delivery'
    ) {
      return {
        btn: 'border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100/70',
        dot: 'bg-purple-600',
        badge: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 border border-purple-200 text-purple-700 shadow-xs'
      };
    }

    // AVAILABLE FOR PICKUP (Teal)
    if (normalized === 'available for pickup') {
      return {
        btn: 'border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100/70',
        dot: 'bg-teal-600',
        badge: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 border border-teal-200 text-teal-700 shadow-xs'
      };
    }

    // RETURN TO SENDER (Orange)
    if (normalized === 'return to sender') {
      return {
        btn: 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100/70',
        dot: 'bg-orange-600',
        badge: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 border border-orange-200 text-orange-700 shadow-xs'
      };
    }

    return null;
  };

  const selectedStatusStyle = getStatusStyle(selected);

  // Filter options based on local search input
  const filteredOptions = options.filter((option) => {
    if (!searchVal.trim()) return true;
    return option.toLowerCase().includes(searchVal.toLowerCase());
  });

  return (
    <div className="relative inline-block text-left" ref={containerRef} id={id}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center gap-1.5 px-4 h-10 text-sm font-medium rounded-lg border transition-all duration-150 cursor-pointer
          ${hasValueSelected 
            ? (selectedStatusStyle?.btn || 'border-brand-200 bg-brand-50/50 text-brand-700 hover:bg-brand-50') 
            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
          }
        `}
      >
        {Icon && <Icon className={`h-4 w-4 ${hasValueSelected ? (selectedStatusStyle ? 'text-current' : 'text-brand-500') : 'text-gray-400'}`} />}
        <span>{hasValueSelected ? selected : label}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${hasValueSelected ? (selectedStatusStyle ? 'text-current' : 'text-brand-500') : 'text-gray-400'}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="absolute left-0 mt-1.5 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-1 overflow-hidden focus:outline-none"
          >
            <div className="px-3 py-2 text-xs font-semibold text-gray-400 border-b border-gray-50 uppercase tracking-wider">
              Filter by {label}
            </div>

            {/* Embedded filter search field inside dropdown */}
            {showSearch && (
              <div className="px-2.5 py-1.5 border-b border-gray-50 bg-slate-50/50">
                <div className="relative flex items-center">
                  <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-8 pr-7 h-8 text-xs border border-gray-200 bg-white rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    onClick={(e) => e.stopPropagation()} // Prevent closing dropdown on input click
                  />
                  {searchVal && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchVal('');
                      }}
                      className="absolute right-2 h-5 w-5 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="max-h-60 overflow-y-auto py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3.5 py-3 text-xs text-slate-400 italic text-center select-none">
                  No matches found
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = selected === option;
                  const optionStatusStyle = getStatusStyle(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        onSelect(option);
                        setIsOpen(false);
                      }}
                      className={`
                        w-full text-left px-3.5 py-2.5 text-sm transition-colors duration-150 flex items-center justify-between cursor-pointer
                        ${isSelected 
                          ? 'bg-brand-50 font-semibold' 
                          : 'text-gray-750 hover:bg-gray-50'
                        }
                      `}
                    >
                      {optionStatusStyle ? (
                        <span className={optionStatusStyle.badge}>
                          {option}
                        </span>
                      ) : (
                        <span className="text-slate-700 font-medium">{option}</span>
                      )}
                      
                      {isSelected && (
                        <span className={`h-1.5 w-1.5 rounded-full ${optionStatusStyle ? optionStatusStyle.dot : 'bg-brand-600'}`} />
                      )}
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
