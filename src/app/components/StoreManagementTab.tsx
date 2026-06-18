import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, X, ChevronDown, Check, Building, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StoreRowItem } from '../types';

interface StoreManagementTabProps {
  stores: StoreRowItem[];
  onCreateStore: (store: Omit<StoreRowItem, 'id' | 'createdAt'>) => void;
  onUpdateStore: (id: string, store: Omit<StoreRowItem, 'id' | 'createdAt'>) => void;
  onDeleteStore: (id: string) => void;
  triggerToast: (msg: string, type: 'success' | 'info') => void;
}

export const StoreManagementTab: React.FC<StoreManagementTabProps> = ({
  stores,
  onCreateStore,
  onUpdateStore,
  onDeleteStore,
  triggerToast
}) => {
  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);

  // Form Field States
  const [integration, setIntegration] = useState<'OrderDesk' | 'SwiftPOD API'>('SwiftPOD API');
  const [storeName, setStoreName] = useState('');
  const [storeCode, setStoreCode] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [returnAddress, setReturnAddress] = useState('');
  const [billingAddress, setBillingAddress] = useState('');

  // Dropdown status within popup
  const [isIntegrationDropdownOpen, setIsIntegrationDropdownOpen] = useState(false);

  // Validation error states
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const integrationDropdownRef = useRef<HTMLDivElement>(null);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (integrationDropdownRef.current && !integrationDropdownRef.current.contains(e.target as Node)) {
        setIsIntegrationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Open modal for Creating
  const handleOpenCreateModal = () => {
    setEditingStoreId(null);
    setIntegration('SwiftPOD API');
    setStoreName('');
    setStoreCode('');
    setStoreAddress('');
    setReturnAddress('');
    setBillingAddress('');
    setValidationErrors({});
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const handleOpenEditModal = (store: StoreRowItem) => {
    setEditingStoreId(store.id);
    setIntegration(store.integration);
    setStoreName(store.storeName);
    setStoreCode(store.storeCode);
    setStoreAddress(store.storeAddress || '');
    setReturnAddress(store.returnAddress);
    setBillingAddress(store.billingAddress || '');
    setValidationErrors({});
    setIsModalOpen(true);
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error state
    const errors: { [key: string]: string } = {};

    if (!storeName.trim()) errors.storeName = 'Store Name is required';
    if (!storeCode.trim()) errors.storeCode = 'Store Code is required';
    if (!returnAddress.trim()) errors.returnAddress = 'Return Address is required';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      triggerToast('Please fill in all required fields.', 'info');
      return;
    }

    const storePayload = {
      integration,
      storeName: storeName.trim(),
      storeCode: storeCode.trim().toUpperCase().replace(/\s+/g, '_'),
      storeAddress: storeAddress.trim() || undefined,
      returnAddress: returnAddress.trim(),
      billingAddress: billingAddress.trim() || undefined
    };

    if (editingStoreId) {
      onUpdateStore(editingStoreId, storePayload);
      triggerToast(`Store "${storeName}" updated successfully!`, 'success');
    } else {
      onCreateStore(storePayload);
      triggerToast(`Store "${storeName}" created successfully!`, 'success');
    }

    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-slate-50/40 rounded-2xl select-none">
      
      {/* HEADER SECTION WITH TITLE & ACTION ONLY */}
      <div className="px-6 pt-6 pb-2 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-t-2xl shrink-0">
        <h1 className="text-2xl font-bold font-sans text-slate-900 leading-tight">
          Store management
        </h1>

        {/* CREATE STORE ACTION BUTTON */}
        <button
          onClick={handleOpenCreateModal}
          className="px-4 h-9 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          <span>Create Store</span>
        </button>
      </div>

      {/* MINIMALIST TABLE BOX */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        {stores.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-white animate-in fade-in duration-200">
            <Building className="h-10 w-10 text-slate-300 mb-2.5 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-700">No stores connected</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm text-center">
              Configure and map your online stores with ease. Touch "Create Store" to launch.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-[0_1px_3px_0_rgba(15,23,42,0.03)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-[10px] uppercase font-bold text-slate-450 tracking-wider">
                    <th className="py-3 px-4.5 font-bold min-w-[200px]">Store Name</th>
                    <th className="py-3 px-4 font-bold">Store Code</th>
                    <th className="py-3 px-4 font-bold">Integration</th>
                    <th className="py-3 px-4 font-bold min-w-[200px]">Return Address</th>
                    <th className="py-3 px-4 font-bold min-w-[150px]">Store Address</th>
                    <th className="py-3 px-4 font-bold text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {stores.map((store) => (
                    <tr 
                      key={store.id} 
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Name */}
                      <td className="py-3.5 px-4.5 font-semibold text-slate-900">
                        {store.storeName}
                      </td>

                      {/* Code */}
                      <td className="py-3.5 px-3">
                        <span className="font-mono text-[10px] font-bold text-slate-500 uppercase px-2 py-0.5 bg-slate-100 rounded">
                          {store.storeCode}
                        </span>
                      </td>

                      {/* Integration Type */}
                      <td className="py-3.5 px-4">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          store.integration === 'SwiftPOD API'
                            ? 'bg-brand-50 border-brand-100 text-brand-700'
                            : 'bg-amber-50 border-amber-100 text-amber-700'
                        }`}>
                          {store.integration}
                        </span>
                      </td>

                      {/* Return Address */}
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate" title={store.returnAddress}>
                        {store.returnAddress}
                      </td>

                      {/* Store Address */}
                      <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate" title={store.storeAddress}>
                        {store.storeAddress || '—'}
                      </td>

                      {/* Action trigger group */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(store)}
                            className="p-1.5 hover:bg-slate-200/70 rounded text-slate-450 hover:text-slate-700 transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete store "${store.storeName}"?`)) {
                                onDeleteStore(store.id);
                              }
                            }}
                            className="p-1.5 hover:bg-rose-50 rounded text-slate-450 hover:text-rose-600 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* CREATE & EDIT STORE PORTAL MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Modal content dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.18 }}
              className="relative w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden flex flex-col border border-slate-100 z-10"
            >
              {/* Modal Banner Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 select-none">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                    {editingStoreId ? 'Edit Store' : 'Create Store'}
                  </h2>
                </div>
                
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-full transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Content body */}
              <form onSubmit={handleSubmit} className="p-5 space-y-4 flex-1 overflow-y-auto max-h-[80vh]">
                
                {/* Integration Dropdown DropSelect */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                    Integration *
                  </label>
                  <div className="relative" ref={integrationDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsIntegrationDropdownOpen(!isIntegrationDropdownOpen)}
                      className="h-10 px-3.5 w-full border border-slate-200 bg-white hover:bg-slate-50/50 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 cursor-pointer flex items-center justify-between gap-1 select-none font-sans"
                    >
                      <span className="text-slate-800 font-bold">{integration}</span>
                      <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    </button>

                    <AnimatePresence>
                      {isIntegrationDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.1 }}
                          className="absolute left-0 w-full bg-white rounded-lg shadow-lg border border-slate-100 z-50 py-1"
                        >
                          {['OrderDesk', 'SwiftPOD API'].map((opt) => {
                            const isSelected = integration === opt;
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  setIntegration(opt as 'OrderDesk' | 'SwiftPOD API');
                                  setIsIntegrationDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                                  isSelected 
                                    ? 'bg-brand-50 text-brand-700 font-bold' 
                                    : 'text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <span>{opt}</span>
                                {isSelected && <Check className="h-3.5 w-3.5 text-brand-700 shrink-0" />}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Store Name & Store Code Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Store Name field */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                      Store Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Olivia Rhye Store"
                      value={storeName}
                      onChange={(e) => {
                        setStoreName(e.target.value);
                        if (e.target.value.trim() && validationErrors.storeName) {
                          setValidationErrors(prev => ({ ...prev, storeName: '' }));
                        }
                      }}
                      className={`h-10 px-3.5 w-full border rounded-lg text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition font-sans ${
                        validationErrors.storeName ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                    {validationErrors.storeName && (
                      <p className="text-[10px] text-rose-500 font-medium pl-0.5 mt-0.5">{validationErrors.storeName}</p>
                    )}
                  </div>

                  {/* Store Code field */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                      Store Code *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. OLIVIA_RHYE_01"
                      value={storeCode}
                      onChange={(e) => {
                        setStoreCode(e.target.value);
                        if (e.target.value.trim() && validationErrors.storeCode) {
                          setValidationErrors(prev => ({ ...prev, storeCode: '' }));
                        }
                      }}
                      className={`h-10 px-3.5 w-full border rounded-lg text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition font-mono ${
                        validationErrors.storeCode ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                    {validationErrors.storeCode && (
                      <p className="text-[10px] text-rose-500 font-medium pl-0.5 mt-0.5">{validationErrors.storeCode}</p>
                    )}
                  </div>
                </div>

                {/* Return Address (Required) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                      Return Address *
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 456 Return Way, Carson, CA 90746"
                    value={returnAddress}
                    onChange={(e) => {
                      setReturnAddress(e.target.value);
                      if (e.target.value.trim() && validationErrors.returnAddress) {
                        setValidationErrors(prev => ({ ...prev, returnAddress: '' }));
                      }
                    }}
                    className={`h-10 px-3.5 w-full border rounded-lg text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition font-sans ${
                      validationErrors.returnAddress ? 'border-rose-400' : 'border-slate-200'
                    }`}
                  />
                  {validationErrors.returnAddress && (
                    <p className="text-[10px] text-rose-500 font-medium pl-0.5 mt-0.5">{validationErrors.returnAddress}</p>
                  )}
                </div>

                {/* Store Address (Optional) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                    Store Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 123 Fashion Blvd, Los Angeles, CA 90015"
                    value={storeAddress}
                    onChange={(e) => setStoreAddress(e.target.value)}
                    className="h-10 px-3.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition font-sans"
                  />
                </div>

                {/* Billing Address (Optional) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                    Billing Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Matching Store Address or custom"
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    className="h-10 px-3.5 w-full border border-slate-200 rounded-lg text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition font-sans"
                  />
                </div>

                {/* Action CTA Group Footer buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 h-9 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold hover:text-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5.5 h-9 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold hover:shadow-sm active:scale-95 transition cursor-pointer"
                  >
                    {editingStoreId ? 'Save Changes' : 'Create Store'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

