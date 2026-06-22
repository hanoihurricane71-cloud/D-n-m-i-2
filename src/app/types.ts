export interface Product {
  id: string;
  active: boolean;
  name: string;
  sku: string;
  incomingStock: number;
  stockQty: string; // e.g. "In stock: 100" or "Out of stock"
  weight: number;
  packagingWeight?: number;
  customer: string;
  createdAt: string;
  lastUpdated: string;
  user: string;
  style?: string;
  color?: string;
  size?: string;
  image?: string;
}

export type TabType = 'Product' | 'Type' | 'Style' | 'Color' | 'Size';

export interface PurchaseOrderItem {
  productInfo: string; // e.g., "102 / WHITE / S"
  sku: string;
  qty: number;
  receivedQty?: number;
  incomingQty?: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  orderStatus: 'Pending' | 'Received';
  totalQty: number;
  receivedQty: number;
  incomingQty: number;
  tracking: string;
  ageDays: number;
  createdAt: string;
  createdBy: string;
  vendor: string;
  shippingCarrier: string;
  customer: string;
  items: PurchaseOrderItem[];
  comments?: {
    id: string;
    text: string;
    createdAt: string;
    createdBy: string;
  }[];
}

export interface AdditionItem {
  id: string;
  poNumber: string;
  boxId: string;
  product: string;
  qty: number;
  tracking: string;
  location: string;
  receivingDate: string;
  user: string;
}

export interface LocationItem {
  id: string;
  location: string;
  boxId: string;
  productQty: number; // count of products/qty stored
  createdAt: string;
  updatedAt?: string;
  lastReturnedAt?: string;
  lastReturnedBy?: string;
}

export interface LocationHistoryItem {
  id: string;
  locationId: string;
  locationName: string;
  boxId: string;
  action: 'Return' | 'Create' | 'Update' | 'Import';
  productInfo: string;
  qty: number;
  timestamp: string;
  performedBy: string;
  notes?: string;
  sku?: string;
  style?: string;
  color?: string;
  size?: string;
  value?: number;
}

export interface OrderManagementItem {
  id: string;
  warehouse: string;
  orderNumber: string;
  refNumber: string;
  orderDate: string;
  customerStore: string;
  orderStatus: 'New' | 'In Production' | 'Shipped' | 'On Hold' | 'Rejected' | 'Cancelled' | 'Prepared' | 'Canceled';
  rejectionReason?: string;
  shippingStatus: 'Unknown' | 'Pre Transit' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Available For Pickup' | 'Return To Sender' | 'Failure' | 'Cancelled';
  quantity: number;
  shippingMethod: string;
  destination: string; // text address or value
  destinationType: 'Domestic' | 'International';
  trackingNumber: string;
  orderItems?: Array<{
    productName: string;
    styleColor: string;
    sku: string;
    quantity: number;
  }>;
  shipmentInfo?: {
    trackingNumber: string;
    carrier: string;
    service: string;
    shipDate: string;
    shippingMethod?: string;
    weight?: string;
    size?: string;
    price?: string;
    labelLink?: string;
    printedDate?: string;
    senderDetails?: {
      name: string;
      company?: string;
      address: string;
    };
    recipientDetails?: {
      firstName: string;
      lastName: string;
      company?: string;
      email?: string;
      phone?: string;
      country: string;
      address1: string;
      address2?: string;
      city: string;
      zip: string;
    };
  };
  shipments?: Array<{
    trackingNumber: string;
    carrier: string;
    service: string;
    shipDate: string;
    shippingMethod?: string;
    weight?: string;
    size?: string;
    price?: string;
    labelLink?: string;
    printedDate?: string;
    packedItems?: Array<{ sku: string; qty: number }>;
    senderDetails?: {
      name: string;
      company?: string;
      address: string;
    };
    recipientDetails?: {
      firstName: string;
      lastName: string;
      company?: string;
      email?: string;
      phone?: string;
      country: string;
      address1: string;
      address2?: string;
      city: string;
      zip: string;
    };
  }>;
  internalNotes?: string;
  insertType?: 'Thank You Card' | 'Gift Message' | 'Packing Slip';
  activityHistory?: Array<{
    id: string;
    date: string;
    action: string;
    performedBy: string;
    notes?: string;
  }>;
  returnAddress?: {
    name: string;
    companyLine: string;
    addressLine: string;
    cityStateZip: string;
    phone?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    email?: string;
  };
  shipAddress?: {
    name: string;
    companyLine: string;
    addressLine: string;
    cityStateZip: string;
    phone: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    email?: string;
  };
}

export interface StoreRowItem {
  id: string;
  active: boolean;
  integration: 'OrderDesk' | 'SwiftPOD API';
  storeName: string;
  storeCode: string;
  storeAddress?: string;
  returnAddress: string;
  billingAddress?: string;
  createdAt: string;
  createdBy: string;
}




