import { Product, AdditionItem, LocationHistoryItem, OrderManagementItem } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    active: true,
    name: 'Premium t-shirt',
    sku: 'G500 / Dark blue / XL\nUNGSBHOOS',
    incomingStock: 22,
    stockQty: 'In stock: 100',
    weight: 21.3,
    customer: 'Alexandra San',
    createdAt: 'Jan 3, 2024',
    lastUpdated: 'Jan 4, 2024',
    user: 'admin123'
  },
  {
    id: '2',
    active: false,
    name: 'Premium t-shirt with art',
    sku: 'G500 / Dark blue / XL\nUNGSBHOOS',
    incomingStock: 22,
    stockQty: 'In stock: 100',
    weight: 21.3,
    customer: 'Alexandra San',
    createdAt: 'Jan 3, 2024',
    lastUpdated: 'Jan 4, 2024',
    user: 'admin123'
  },
  {
    id: '3',
    active: true,
    name: 'Premium t-shirt',
    sku: 'G500 / Dark blue / XL\nUNGSBHOOS',
    incomingStock: 22,
    stockQty: 'In stock: 100',
    weight: 21.3,
    customer: 'Alexandra San',
    createdAt: 'Jan 3, 2024',
    lastUpdated: 'Jan 4, 2024',
    user: 'admin123'
  },
  {
    id: '4',
    active: true,
    name: 'Premium t-shirt',
    sku: 'G500 / Dark blue / XL\nUNGSBHOOS',
    incomingStock: 22,
    stockQty: 'In stock: 100',
    weight: 21.3,
    customer: 'Hiep Tran Dinh',
    createdAt: 'Jan 3, 2024',
    lastUpdated: 'Jan 4, 2024',
    user: 'admin123'
  },
  {
    id: '5',
    active: false,
    name: 'Premium t-shirt',
    sku: 'G500 / Dark blue / XL\nUNGSBHOOS',
    incomingStock: 22,
    stockQty: 'In stock: 100',
    weight: 21.3,
    customer: 'Alexandra San',
    createdAt: 'Jan 3, 2024',
    lastUpdated: 'Jan 4, 2024',
    user: 'admin123'
  },
  {
    id: '6',
    active: true,
    name: 'Premium t-shirt',
    sku: 'G500 / Dark blue / XL\nUNGSBHOOS',
    incomingStock: 22,
    stockQty: 'In stock: 100',
    weight: 21.3,
    customer: 'Alexandra San',
    createdAt: 'Jan 3, 2024',
    lastUpdated: 'Jan 4, 2024',
    user: 'admin123'
  },
  {
    id: '7',
    active: true,
    name: 'Premium t-shirt',
    sku: 'G500 / Dark blue / XL\nUNGSBHOOS',
    incomingStock: 22,
    stockQty: 'In stock: 100',
    weight: 21.3,
    customer: 'Alexandra San',
    createdAt: 'Jan 3, 2024',
    lastUpdated: 'Jan 4, 2024',
    user: 'admin123'
  },
  {
    id: '8',
    active: true,
    name: 'Premium t-shirt',
    sku: 'G500 / Dark blue / XL\nUNGSBHOOS',
    incomingStock: 22,
    stockQty: 'In stock: 100',
    weight: 21.3,
    customer: 'Alexandra San',
    createdAt: 'Jan 3, 2024',
    lastUpdated: 'Jan 4, 2024',
    user: 'admin123'
  },
  {
    id: '9',
    active: true,
    name: 'Premium t-shirt',
    sku: 'G500 / Dark blue / XL\nUNGSBHOOS',
    incomingStock: 22,
    stockQty: 'In stock: 100',
    weight: 21.3,
    customer: 'Alexandra San',
    createdAt: 'Jan 3, 2024',
    lastUpdated: 'Jan 4, 2024',
    user: 'admin123'
  },
  {
    id: '10',
    active: true,
    name: 'Premium t-shirt',
    sku: 'G500 / Dark blue / XL\nUNGSBHOOS',
    incomingStock: 22,
    stockQty: 'Out of stock',
    weight: 21.3,
    customer: 'Alexandra San',
    createdAt: 'Jan 3, 2024',
    lastUpdated: 'Jan 4, 2024',
    user: 'admin123'
  },
  // Extra pages of items for realistic searching, pagination and filtering
  {
    id: '11',
    active: true,
    name: 'Standard Cotton Tee',
    sku: 'C100 / Red / M\nUNGSBHOOT1',
    incomingStock: 15,
    stockQty: 'In stock: 45',
    weight: 18.5,
    customer: 'Olivia Rhye',
    createdAt: 'Jan 10, 2024',
    lastUpdated: 'Jan 11, 2024',
    user: 'admin123'
  },
  {
    id: '12',
    active: false,
    name: 'V-Neck Summer Shirt',
    sku: 'V200 / White / L\nUNGSBHOOT2',
    incomingStock: 30,
    stockQty: 'In stock: 12',
    weight: 19.2,
    customer: 'John Doe',
    createdAt: 'Jan 12, 2024',
    lastUpdated: 'Jan 12, 2024',
    user: 'admin123'
  },
  {
    id: '13',
    active: true,
    name: 'Heavyweight Hoodie',
    sku: 'H800 / Black / L\nUNGSBHOOH1',
    incomingStock: 50,
    stockQty: 'In stock: 150',
    weight: 45.0,
    customer: 'Hiep Tran Dinh',
    createdAt: 'Feb 1, 2024',
    lastUpdated: 'Feb 2, 2024',
    user: 'editor123'
  },
  {
    id: '14',
    active: true,
    name: 'Polyester Sports Shirt',
    sku: 'P300 / Blue / S\nUNGSBHOOS1',
    incomingStock: 10,
    stockQty: 'Out of stock',
    weight: 15.1,
    customer: 'Alexandra San',
    createdAt: 'Feb 15, 2024',
    lastUpdated: 'Feb 16, 2024',
    user: 'admin123'
  }
];

export const STYLE_OPTIONS = ['All Styles', 'G500', 'C100', 'V200', 'H800', 'P300', 'G505', 'G10000', '102'];
export const COLOR_OPTIONS = ['All Colors', 'Dark blue', 'Red', 'White', 'Black', 'Blue', 'WHITE', 'BLACK'];
export const SIZE_OPTIONS = ['All Sizes', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
export const STOCK_OPTIONS = ['All Statuses', 'In stock', 'Out of stock'];
export const CUSTOMER_OPTIONS = ['All Customers', 'Alexandra San', 'Hiep Tran Dinh', 'Olivia Rhye', 'John Doe'];

import { PurchaseOrder } from './types';

export const VENDOR_OPTIONS = ['OpenCustoms', 'Printify', 'Gelato', 'CustomCat', 'Gooten'];
export const CARRIER_OPTIONS = ['DHL Express', 'FedEx', 'UPS', 'USPS', 'VietPost'];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po1',
    poNumber: '1782623',
    orderStatus: 'New',
    totalQty: 22,
    receivedQty: 22,
    incomingQty: 22,
    tracking: '92632623611132647',
    ageDays: 3,
    createdAt: 'Jan 3, 2024',
    createdBy: 'Eva team',
    vendor: 'OpenCustoms',
    shippingCarrier: 'DHL Express',
    customer: 'Olivia Rhye',
    items: [
      { productInfo: '102 / WHITE / S', sku: 'AJBT1B00M', qty: 2, receivedQty: 2, incomingQty: 2 },
      { productInfo: '102 / BLACK / M', sku: 'AJBT1B00M', qty: 4, receivedQty: 4, incomingQty: 4 },
      { productInfo: 'G500 / Red / L', sku: 'RD-G500-L', qty: 16, receivedQty: 16, incomingQty: 16 }
    ]
  },
  {
    id: 'po2',
    poNumber: '1782624',
    orderStatus: 'Partial Received',
    totalQty: 22,
    receivedQty: 10,
    incomingQty: 12,
    tracking: '92632623611132648',
    ageDays: 2,
    createdAt: 'Jan 3, 2024',
    createdBy: 'Eva team',
    vendor: 'Printify',
    shippingCarrier: 'FedEx',
    customer: 'Alexandra San',
    items: [
      { productInfo: '102 / BLACK / L', sku: 'AJBT1B00M', qty: 10, receivedQty: 10, incomingQty: 0 },
      { productInfo: '102 / BLACK / 2XL', sku: 'AJBT1B00M', qty: 12, receivedQty: 0, incomingQty: 12 }
    ]
  },
  {
    id: 'po3',
    poNumber: '1782625',
    orderStatus: 'Completed',
    totalQty: 22,
    receivedQty: 22,
    incomingQty: 22,
    tracking: '92632623611132649',
    ageDays: 1,
    createdAt: 'Jan 3, 2024',
    createdBy: 'Eva team',
    vendor: 'Gelato',
    shippingCarrier: 'USPS',
    customer: 'Hiep Tran Dinh',
    items: [
      { productInfo: '102 / BLACK / 3XL', sku: 'AJBT1B00M', qty: 11, receivedQty: 11, incomingQty: 11 },
      { productInfo: '102 / BLACK / 4XL', sku: 'AJBT1B00M', qty: 11, receivedQty: 11, incomingQty: 11 }
    ]
  },
  {
    id: 'po4',
    poNumber: '1782626',
    orderStatus: 'Completed',
    totalQty: 30,
    receivedQty: 30,
    incomingQty: 30,
    tracking: '92632623611132650',
    ageDays: 3,
    createdAt: 'Jan 2, 2024',
    createdBy: 'Eva team',
    vendor: 'CustomCat',
    shippingCarrier: 'UPS',
    customer: 'John Doe',
    items: [
      { productInfo: 'G500 / Dark blue / S', sku: 'DB-G500-S', qty: 15, receivedQty: 15, incomingQty: 15 },
      { productInfo: 'G500 / Dark blue / M', sku: 'DB-G500-M', qty: 15, receivedQty: 15, incomingQty: 15 }
    ]
  },
  {
    id: 'po5',
    poNumber: '1782627',
    orderStatus: 'New',
    totalQty: 8,
    receivedQty: 0,
    incomingQty: 8,
    tracking: '92632623611132651',
    ageDays: 4,
    createdAt: 'Jan 1, 2024',
    createdBy: 'Eva team',
    vendor: 'OpenCustoms',
    shippingCarrier: 'USPS',
    customer: 'Alexandra San',
    items: [
      { productInfo: 'H800 / Black / L', sku: 'UNGSBHOOH1', qty: 8, receivedQty: 0, incomingQty: 8 }
    ]
  },
  {
    id: 'po6',
    poNumber: '1782628',
    orderStatus: 'Verified',
    totalQty: 10,
    receivedQty: 10,
    incomingQty: 10,
    tracking: '92632623611132652',
    ageDays: 5,
    createdAt: 'Jan 1, 2024',
    createdBy: 'Eva team',
    vendor: 'Gooten',
    shippingCarrier: 'FedEx',
    customer: 'Hiep Tran Dinh',
    items: [
      { productInfo: 'G500 / Red / XL', sku: 'RD-G500-XL', qty: 10, receivedQty: 10, incomingQty: 10 }
    ]
  },
  {
    id: 'po7',
    poNumber: '1782629',
    orderStatus: 'Cancelled',
    totalQty: 15,
    receivedQty: 0,
    incomingQty: 0,
    tracking: '92632623611132653',
    ageDays: 6,
    createdAt: 'Dec 29, 2023',
    createdBy: 'Admin team',
    vendor: 'Printify',
    shippingCarrier: 'UPS',
    customer: 'John Doe',
    items: [
      { productInfo: '5000 / BLACK / 3XL', sku: 'BLK-5000-3XL', qty: 15, receivedQty: 0, incomingQty: 0 }
    ]
  }
];

export const INITIAL_ADDITIONS: AdditionItem[] = [
  {
    id: 'add1',
    poNumber: '1782623',
    boxId: '25489',
    product: '5000 / BLACK / 3XL',
    qty: 36,
    tracking: '92632623611132647',
    location: 'Container 12',
    receivingDate: 'May 18, 2026 7:59 PM',
    user: 'admin1'
  },
  {
    id: 'add2',
    poNumber: '1782624',
    boxId: '84931',
    product: '18000 / BLACK / 3XL',
    qty: 36,
    tracking: '92632623611132648',
    location: 'Container 7',
    receivingDate: 'May 18, 2026 7:56 PM',
    user: 'admin1'
  },
  {
    id: 'add3',
    poNumber: '1782623',
    boxId: '17826',
    product: '1717 / MOSS / 3XL',
    qty: 10,
    tracking: '92632623611132652',
    location: 'PULLING SHELVES CA',
    receivingDate: 'May 18, 2026 1:30 AM',
    user: 'admin1'
  },
  {
    id: 'add4',
    poNumber: '1715926',
    boxId: '17159',
    product: '1717 / BERRY / S',
    qty: 1,
    tracking: '92632623611132621',
    location: 'R1E24-N-AD1',
    receivingDate: 'May 15, 2026 12:55 AM',
    user: 'admin1'
  },
  {
    id: 'add5',
    poNumber: '1782625',
    boxId: '48392',
    product: '158 / WHITE / M',
    qty: 72,
    tracking: '92632623611132649',
    location: 'AA005A-CA',
    receivingDate: 'May 14, 2026 9:24 PM',
    user: 'admin1'
  },
  {
    id: 'add6',
    poNumber: '1782626',
    boxId: '81920',
    product: '18000 / BLACK / 4XL',
    qty: 1,
    tracking: '92632623611132634',
    location: 'PULLING SHELVES CA',
    receivingDate: 'May 5, 2026 12:51 AM',
    user: 'admin1'
  },
  {
    id: 'add7',
    poNumber: '1782627',
    boxId: '58192',
    product: '18000 / BLACK / 4XL',
    qty: 8,
    tracking: '92632623611132635',
    location: 'PULLING SHELVES CA',
    receivingDate: 'May 5, 2026 12:47 AM',
    user: 'admin1'
  },
  {
    id: 'add8',
    poNumber: '1782628',
    boxId: '38192',
    product: '18000 / BLACK / 4XL',
    qty: 5,
    tracking: '92632623611132636',
    location: 'PULLING SHELVES CA',
    receivingDate: 'May 5, 2026 12:26 AM',
    user: 'admin1'
  },
  {
    id: 'add9',
    poNumber: '1782629',
    boxId: '32115',
    product: '18000 / BLACK / 3XL',
    qty: 10,
    tracking: '92632623611132637',
    location: 'PULLING SHELVES CA',
    receivingDate: 'May 4, 2026 3:59 AM',
    user: 'admin1'
  },
  {
    id: 'add10',
    poNumber: '1782630',
    boxId: '12341',
    product: '18000 / BLACK / 3XL',
    qty: 5,
    tracking: '92632623611132638',
    location: 'PULLING SHELVES CA',
    receivingDate: 'May 4, 2026 2:59 AM',
    user: 'admin1'
  },
  {
    id: 'add11',
    poNumber: '1782631',
    boxId: '54001',
    product: '2400 / Charcoal / XL',
    qty: 5,
    tracking: '92632623611132639',
    location: 'R3V45-S-CD2',
    receivingDate: 'May 4, 2026 12:48 AM',
    user: 'admin1'
  },
  {
    id: 'add12',
    poNumber: '1782632',
    boxId: '31822',
    product: '2000 / DARK HEATHER / L',
    qty: 1,
    tracking: '92632623611132641',
    location: 'AA005A-CA',
    receivingDate: 'Apr 15, 2026 3:41 AM',
    user: 'admin1'
  },
  {
    id: 'add13',
    poNumber: '1782633',
    boxId: '34737',
    product: '210 / BLACK / L',
    qty: 1,
    tracking: '92632623611132642',
    location: 'PULLING SHELVES CA',
    receivingDate: 'Apr 14, 2026 2:31 AM',
    user: 'admin1'
  },
  {
    id: 'add14',
    poNumber: '1782634',
    boxId: '34634',
    product: '5000 / WHITE / S',
    qty: 72,
    tracking: '92632623611132643',
    location: 'PULLING SHELVES CA',
    receivingDate: 'Apr 14, 2026 2:26 AM',
    user: 'Tuan Anh'
  },
  {
    id: 'add15',
    poNumber: '1782635',
    boxId: '35745',
    product: '5000 / TENNESSEE ORANGE / 4XL',
    qty: 12,
    tracking: '92632623611132644',
    location: 'AA005A-CA',
    receivingDate: 'Apr 15, 2026 2:16 AM',
    user: 'admin1'
  }
];

export const INITIAL_LOCATIONS = [
  {
    id: 'loc1',
    location: 'Container 102',
    boxId: '3',
    productQty: 110,
    createdAt: 'Mar 6, 2022 11:00 PM',
    updatedAt: 'May 5, 2026 11:09 AM',
    lastReturnedAt: 'May 28, 2026 5:40 PM',
    lastReturnedBy: 'Tech'
  },
  {
    id: 'loc2',
    location: 'Container 10',
    boxId: '178',
    productQty: 11362,
    createdAt: 'Mar 6, 2022 11:00 PM',
    updatedAt: 'May 15, 2024 9:52 AM',
    lastReturnedAt: 'May 28, 2026 5:28 PM',
    lastReturnedBy: 'Tech'
  },
  {
    id: 'loc3',
    location: 'Container 3',
    boxId: '91',
    productQty: 4115,
    createdAt: 'Mar 6, 2022 11:00 PM',
    updatedAt: 'Nov 4, 2025 1:56 PM',
    lastReturnedAt: '',
    lastReturnedBy: ''
  },
  {
    id: 'loc4',
    location: 'Container 4',
    boxId: '64',
    productQty: 2934,
    createdAt: 'Mar 6, 2022 11:00 PM',
    updatedAt: '',
    lastReturnedAt: 'May 26, 2026 10:07 PM',
    lastReturnedBy: 'Tech'
  },
  {
    id: 'loc5',
    location: 'Container 6',
    boxId: '74',
    productQty: 5268,
    createdAt: 'Mar 6, 2022 11:00 PM',
    updatedAt: '',
    lastReturnedAt: '',
    lastReturnedBy: ''
  },
  {
    id: 'loc6',
    location: 'Container 7',
    boxId: '91',
    productQty: 5065,
    createdAt: 'Mar 6, 2022 11:00 PM',
    updatedAt: '',
    lastReturnedAt: '',
    lastReturnedBy: ''
  },
  {
    id: 'loc7',
    location: 'Container 8',
    boxId: '63',
    productQty: 3981,
    createdAt: 'Mar 6, 2022 11:00 PM',
    updatedAt: '',
    lastReturnedAt: '',
    lastReturnedBy: ''
  },
  {
    id: 'loc8',
    location: 'Container 9',
    boxId: '106',
    productQty: 5304,
    createdAt: 'Mar 6, 2022 11:00 PM',
    updatedAt: '',
    lastReturnedAt: '',
    lastReturnedBy: ''
  },
  {
    id: 'loc9',
    location: 'Container 11',
    boxId: '51',
    productQty: 3598,
    createdAt: 'Mar 6, 2022 11:00 PM',
    updatedAt: 'May 15, 2024 9:52 AM',
    lastReturnedAt: '',
    lastReturnedBy: ''
  },
  {
    id: 'loc10',
    location: 'Container 13',
    boxId: '219',
    productQty: 12299,
    createdAt: 'Mar 6, 2022 11:00 PM',
    updatedAt: 'Dec 15, 2025 11:21 AM',
    lastReturnedAt: '',
    lastReturnedBy: ''
  },
  {
    id: 'loc11',
    location: 'RTN 14',
    boxId: '2',
    productQty: 12,
    createdAt: 'Mar 6, 2022 11:00 PM',
    updatedAt: 'May 27, 2026 6:51 AM',
    lastReturnedAt: 'May 27, 2026 9:17 AM',
    lastReturnedBy: 'Tech'
  },
  {
    id: 'loc12',
    location: 'WAREHOUSE 2',
    boxId: '93',
    productQty: 6660,
    createdAt: 'Mar 6, 2022 11:00 PM',
    updatedAt: '',
    lastReturnedAt: '',
    lastReturnedBy: ''
  },
  {
    id: 'loc13',
    location: '101A1B',
    boxId: '0',
    productQty: 0,
    createdAt: 'Mar 6, 2022 11:00 PM',
    updatedAt: '',
    lastReturnedAt: 'May 27, 2026 8:48 AM',
    lastReturnedBy: 'Tech'
  },
  {
    id: 'loc14',
    location: '101A1F',
    boxId: '25',
    productQty: 838,
    createdAt: 'Mar 6, 2022 11:00 PM',
    updatedAt: '',
    lastReturnedAt: '',
    lastReturnedBy: ''
  },
  {
    id: 'loc15',
    location: '101A2B',
    boxId: '16',
    productQty: 960,
    createdAt: 'Mar 6, 2022 11:00 PM',
    updatedAt: '',
    lastReturnedAt: '',
    lastReturnedBy: ''
  },
  {
    id: 'loc16',
    location: '101A2F',
    boxId: '15',
    productQty: 780,
    createdAt: 'Mar 6, 2022 11:00 PM',
    updatedAt: '',
    lastReturnedAt: '',
    lastReturnedBy: ''
  },
  {
    id: 'loc17',
    location: '101A3B',
    boxId: '20',
    productQty: 985,
    createdAt: 'Mar 6, 2022 11:00 PM',
    updatedAt: '',
    lastReturnedAt: '',
    lastReturnedBy: ''
  },
  {
    id: 'loc18',
    location: '101A3F',
    boxId: '9',
    productQty: 55,
    createdAt: 'Mar 6, 2022 11:00 PM',
    updatedAt: '',
    lastReturnedAt: '',
    lastReturnedBy: ''
  },
  {
    id: 'loc19',
    location: 'WAREHOUSE 6',
    boxId: '81',
    productQty: 2888,
    createdAt: 'Mar 6, 2022 11:00 PM',
    updatedAt: '',
    lastReturnedAt: 'May 28, 2026 5:43 PM',
    lastReturnedBy: 'Tech'
  },
  {
    id: 'loc20',
    location: 'WAREHOUSE 5',
    boxId: '663',
    productQty: 19536,
    createdAt: 'Mar 6, 2022 11:00 PM',
    updatedAt: '',
    lastReturnedAt: '',
    lastReturnedBy: ''
  },
  {
    id: 'loc21',
    location: 'WAREHOUSE 4',
    boxId: '2234',
    productQty: 65630,
    createdAt: 'Mar 6, 2022 11:00 PM',
    updatedAt: '',
    lastReturnedAt: '',
    lastReturnedBy: ''
  }
];

export const INITIAL_LOCATION_HISTORY: LocationHistoryItem[] = [
  {
    id: '64',
    locationId: 'loc11', // RTN 14
    locationName: 'RTN 14',
    boxId: 'box-463633751',
    action: 'Return',
    productInfo: 'YOGH8K00S / 18500B / Graphite Heather / S',
    qty: 10,
    timestamp: 'May 31, 2026 7:44 PM',
    performedBy: 'Tech',
    notes: 'Returned to storage',
    sku: 'YOGH8K00S',
    style: '18500B',
    color: 'Graphite Heather',
    size: 'S',
    value: 74.20
  },
  {
    id: '63',
    locationId: 'loc11',
    locationName: 'RTN 14',
    boxId: 'box-463633751/1',
    action: 'Return',
    productInfo: 'YOGH8K00S / 18500B / Graphite Heather / S',
    qty: 10,
    timestamp: 'May 31, 2026 7:44 PM',
    performedBy: 'Tech',
    notes: 'Returned to storage',
    sku: 'YOGH8K00S',
    style: '18500B',
    color: 'Graphite Heather',
    size: 'S',
    value: 74.20
  },
  {
    id: '47',
    locationId: 'loc19',
    locationName: 'WAREHOUSE 6',
    boxId: 'A040445',
    action: 'Return',
    productInfo: 'MESW1BOOL / 562MR / BLACK / L',
    qty: 24,
    timestamp: 'May 28, 2026 3:43 AM',
    performedBy: 'Tech',
    notes: 'Restocked',
    sku: 'MESW1BOOL',
    style: '562MR',
    color: 'BLACK',
    size: 'L',
    value: 154.80
  },
  {
    id: '46',
    locationId: 'loc19',
    locationName: 'WAREHOUSE 6',
    boxId: 'A040438',
    action: 'Return',
    productInfo: 'MESW1BOOL / 562MR / BLACK / L',
    qty: 24,
    timestamp: 'May 28, 2026 3:43 AM',
    performedBy: 'Tech',
    notes: 'Restocked',
    sku: 'MESW1BOOL',
    style: '562MR',
    color: 'BLACK',
    size: 'L',
    value: 154.80
  },
  {
    id: '45',
    locationId: 'loc19',
    locationName: 'WAREHOUSE 6',
    boxId: 'A040437',
    action: 'Return',
    productInfo: 'MESW1BOOL / 562MR / BLACK / L',
    qty: 24,
    timestamp: 'May 28, 2026 3:43 AM',
    performedBy: 'Tech',
    notes: 'Restocked',
    sku: 'MESW1BOOL',
    style: '562MR',
    color: 'BLACK',
    size: 'L',
    value: 154.80
  },
  {
    id: '44',
    locationId: 'loc19',
    locationName: 'WAREHOUSE 6',
    boxId: 'A040436',
    action: 'Return',
    productInfo: 'MESW1BOOL / 562MR / BLACK / L',
    qty: 24,
    timestamp: 'May 28, 2026 3:43 AM',
    performedBy: 'Tech',
    notes: 'Restocked',
    sku: 'MESW1BOOL',
    style: '562MR',
    color: 'BLACK',
    size: 'L',
    value: 154.80
  },
  {
    id: '43',
    locationId: 'loc19',
    locationName: 'WAREHOUSE 6',
    boxId: 'A040403',
    action: 'Return',
    productInfo: 'UNGS1BOOL / 18000 / BLACK / L',
    qty: 36,
    timestamp: 'May 28, 2026 3:43 AM',
    performedBy: 'Tech',
    notes: 'Restocked',
    sku: 'UNGS1BOOL',
    style: '18000',
    color: 'BLACK',
    size: 'L',
    value: 0
  },
  {
    id: '42',
    locationId: 'loc19',
    locationName: 'WAREHOUSE 6',
    boxId: 'A040378',
    action: 'Return',
    productInfo: 'MESW1BOXL / 562MR / BLACK / XL',
    qty: 24,
    timestamp: 'May 28, 2026 3:43 AM',
    performedBy: 'Tech',
    notes: 'Restocked',
    sku: 'MESW1BOXL',
    style: '562MR',
    color: 'BLACK',
    size: 'XL',
    value: 154.80
  },
  {
    id: '40',
    locationId: 'loc19',
    locationName: 'WAREHOUSE 6',
    boxId: 'A033976',
    action: 'Return',
    productInfo: 'UNGS2K2XL / 18000 / DARK HEATHER / 2XL',
    qty: 36,
    timestamp: 'May 28, 2026 3:43 AM',
    performedBy: 'Tech',
    notes: 'Restocked',
    sku: 'UNGS2K2XL',
    style: '18000',
    color: 'DARK HEATHER',
    size: '2XL',
    value: 323.28
  },
  {
    id: '41',
    locationId: 'loc19',
    locationName: 'WAREHOUSE 6',
    boxId: 'A040124',
    action: 'Return',
    productInfo: 'UNGS1BOOL / 18000 / BLACK / L',
    qty: 36,
    timestamp: 'May 28, 2026 3:43 AM',
    performedBy: 'Tech',
    notes: 'Restocked',
    sku: 'UNGS1BOOL',
    style: '18000',
    color: 'BLACK',
    size: 'L',
    value: 0
  },
  {
    id: '39',
    locationId: 'loc19',
    locationName: 'WAREHOUSE 6',
    boxId: 'A033937',
    action: 'Return',
    productInfo: 'UNGS1BOOL / 18000 / BLACK / L',
    qty: 36,
    timestamp: 'May 28, 2026 3:43 AM',
    performedBy: 'Tech',
    notes: 'Restocked',
    sku: 'UNGS1BOOL',
    style: '18000',
    color: 'BLACK',
    size: 'L',
    value: 0
  },
  {
    id: '38',
    locationId: 'loc19',
    locationName: 'WAREHOUSE 6',
    boxId: 'A032653',
    action: 'Return',
    productInfo: 'UNGS1BOOL / 18000 / BLACK / L',
    qty: 36,
    timestamp: 'May 28, 2026 3:43 AM',
    performedBy: 'Tech',
    notes: 'Restocked',
    sku: 'UNGS1BOOL',
    style: '18000',
    color: 'BLACK',
    size: 'L',
    value: 0
  },
  {
    id: '37',
    locationId: 'loc19',
    locationName: 'WAREHOUSE 6',
    boxId: 'A032650',
    action: 'Return',
    productInfo: 'UNGS1BOOL / 18000 / BLACK / L',
    qty: 36,
    timestamp: 'May 28, 2026 3:43 AM',
    performedBy: 'Tech',
    notes: 'Restocked',
    sku: 'UNGS1BOOL',
    style: '18000',
    color: 'BLACK',
    size: 'L',
    value: 0
  },
  {
    id: '36',
    locationId: 'loc19',
    locationName: 'WAREHOUSE 6',
    boxId: 'A032132',
    action: 'Return',
    productInfo: 'UNGS1BOOL / 18000 / BLACK / L',
    qty: 36,
    timestamp: 'May 28, 2026 3:43 AM',
    performedBy: 'Tech',
    notes: 'Restocked',
    sku: 'UNGS1BOOL',
    style: '18000',
    color: 'BLACK',
    size: 'L',
    value: 0
  },
  {
    id: '48',
    locationId: 'loc19',
    locationName: 'WAREHOUSE 6',
    boxId: 'A040446',
    action: 'Return',
    productInfo: 'MESW1BOOL / 562MR / BLACK / L',
    qty: 24,
    timestamp: 'May 28, 2026 3:43 AM',
    performedBy: 'Tech',
    notes: 'Restocked',
    sku: 'MESW1BOOL',
    style: '562MR',
    color: 'BLACK',
    size: 'L',
    value: 154.80
  },
  {
    id: '49',
    locationId: 'loc19',
    locationName: 'WAREHOUSE 6',
    boxId: 'A040447',
    action: 'Return',
    productInfo: 'MESW1BOOL / 562MR / BLACK / L',
    qty: 24,
    timestamp: 'May 28, 2026 3:43 AM',
    performedBy: 'Tech',
    notes: 'Restocked',
    sku: 'MESW1BOOL',
    style: '562MR',
    color: 'BLACK',
    size: 'L',
    value: 154.80
  },
  {
    id: '50',
    locationId: 'loc19',
    locationName: 'WAREHOUSE 6',
    boxId: 'A040454',
    action: 'Return',
    productInfo: 'MESW1BOOL / 562MR / BLACK / L',
    qty: 24,
    timestamp: 'May 28, 2026 3:43 AM',
    performedBy: 'Tech',
    notes: 'Restocked',
    sku: 'MESW1BOOL',
    style: '562MR',
    color: 'BLACK',
    size: 'L',
    value: 154.80
  },
  {
    id: '62',
    locationId: 'loc19',
    locationName: 'WAREHOUSE 6',
    boxId: 'SJ043001',
    action: 'Return',
    productInfo: 'GDLS3W3XL / 5400 / ASH / 3XL',
    qty: 10,
    timestamp: 'May 28, 2026 3:43 AM',
    performedBy: 'Tech',
    notes: 'Restocked',
    sku: 'GDLS3W3XL',
    style: '5400',
    color: 'ASH',
    size: '3XL',
    value: 20
  },
  {
    id: '61',
    locationId: 'loc19',
    locationName: 'WAREHOUSE 6',
    boxId: 'Test 5151',
    action: 'Return',
    productInfo: 'GDSUOF2XL / 12000 / FOREST / 2XL',
    qty: 36,
    timestamp: 'May 28, 2026 3:43 AM',
    performedBy: 'Tech',
    notes: 'Restocked',
    sku: 'GDSUOF2XL',
    style: '12000',
    color: 'FOREST',
    size: '2XL',
    value: 0
  },
  {
    id: '60',
    locationId: 'loc19',
    locationName: 'WAREHOUSE 6',
    boxId: '5522211',
    action: 'Return',
    productInfo: 'CDACSU3XL / 3413 / SOLID TRUE ROYAL TRIBLEND / 3XL',
    qty: 60,
    timestamp: 'May 28, 2026 3:43 AM',
    performedBy: 'Tech',
    notes: 'Restocked',
    sku: 'CDACSU3XL',
    style: '3413',
    color: 'SOLID TRUE ROYAL TRIBLEND',
    size: '3XL',
    value: 60
  }
];

export const INITIAL_ORDERS: OrderManagementItem[] = [
  {
    id: 'ord1',
    warehouse: 'Warehouse A',
    orderNumber: 'ORD-2026-001',
    refNumber: 'REF-22904-A',
    orderDate: 'Jun 14, 2026',
    customerStore: 'Olivia Rhye',
    orderStatus: 'Shipped',
    shippingStatus: 'Delivered',
    quantity: 120,
    shippingMethod: 'UPS Ground',
    destination: 'Warehouse A',
    destinationType: 'Domestic',
    trackingNumber: '1Z999AA10123456784',
    orderItems: [
      { productName: 'Premium Organic Tee', styleColor: '3001C / Black', sku: 'TS-BLK-S', quantity: 50 },
      { productName: 'Premium Organic Tee', styleColor: '3001C / White', sku: 'TS-WHT-M', quantity: 70 }
    ],
    shipmentInfo: {
      trackingNumber: '1Z999AA10123456784',
      carrier: 'UPS',
      service: 'UPS Ground',
      shipDate: 'Jun 14, 2026',
      shippingMethod: 'UPS Ground',
      weight: '12.4 lbs',
      size: '15 x 12 x 10 in',
      price: '$14.50',
      labelLink: 'https://www.ups.com/assets/resources/images/zpl-label-sample.png',
      printedDate: 'Jun 14, 2026 10:15 AM'
    },
    internalNotes: 'Customer requested front door delivery. Confirmed delivered on porch.',
    activityHistory: [
      { id: 'act1_1', date: 'Jun 14, 2026 15:30', action: 'Delivered', performedBy: 'UPS System', notes: 'Package left at front door' },
      { id: 'act1_2', date: 'Jun 14, 2026 08:15', action: 'Out for Delivery', performedBy: 'UPS System' },
      { id: 'act1_3', date: 'Jun 14, 2026 02:00', action: 'Shipped', performedBy: 'Warehouse A Admin', notes: 'Shipped via UPS Ground carrier pick-up.' }
    ]
  },
  {
    id: 'ord2',
    warehouse: 'Warehouse B',
    orderNumber: 'ORD-2026-002',
    refNumber: 'REF-88741-B',
    orderDate: 'Jun 15, 2026',
    customerStore: 'Acme Corp',
    orderStatus: 'Shipped',
    shippingStatus: 'In Transit',
    quantity: 85,
    shippingMethod: 'FedEx Express',
    destination: 'Store #12 (Tokyo Hub)',
    destinationType: 'International',
    trackingNumber: '78328904721x',
    orderItems: [
      { productName: 'Heavyweight Hooded Sweatshirt', styleColor: '9900H / Navy', sku: 'HD-NVY-XL', quantity: 85 }
    ],
    shipmentInfo: {
      trackingNumber: '78328904721x',
      carrier: 'FedEx',
      service: 'FedEx Express International',
      shipDate: 'Jun 15, 2026',
      shippingMethod: 'FedEx Express',
      weight: '6.8 lbs',
      size: '12 x 12 x 8 in',
      price: '$42.10',
      labelLink: 'https://images.fedex.com/images/us/label-samples/express-airbill.gif',
      printedDate: 'Jun 15, 2026 09:30 AM'
    },
    internalNotes: 'Customs paperwork attached and verified by compliance officer.',
    activityHistory: [
      { id: 'act2_1', date: 'Jun 15, 2026 18:00', action: 'Departed Facility', performedBy: 'FedEx System', notes: 'Anchorage, AK exchange facility' },
      { id: 'act2_2', date: 'Jun 15, 2026 11:00', action: 'Picked Up', performedBy: 'FedEx System' },
      { id: 'act2_3', date: 'Jun 15, 2026 09:30', action: 'Manifest Created', performedBy: 'Warehouse B Admin' }
    ]
  },
  {
    id: 'ord3',
    warehouse: 'Warehouse A',
    orderNumber: 'ORD-2026-003',
    refNumber: 'REF-30911-M',
    orderDate: 'Jun 15, 2026',
    customerStore: 'Phoenix Baker',
    orderStatus: 'Prepared',
    shippingStatus: 'Pre Transit',
    quantity: 340,
    shippingMethod: 'DHL Worldwide',
    destination: 'Los Angeles Main Hub',
    destinationType: 'Domestic',
    trackingNumber: '',
    orderItems: [
      { productName: 'Classic Polo Shirt', styleColor: '5000 / Royal Blue', sku: 'PL-BLU-M', quantity: 200 },
      { productName: 'Classic Polo Shirt', styleColor: '5000 / Red', sku: 'PL-RED-L', quantity: 140 }
    ],
    internalNotes: 'Awaiting shipping manifest release from the secondary floor.',
    activityHistory: [
      { id: 'act3_1', date: 'Jun 15, 2026 14:22', action: 'Order Approved', performedBy: 'CS Staff Hiep' },
      { id: 'act3_2', date: 'Jun 15, 2026 14:15', action: 'Order Submitted', performedBy: 'Phoenix Baker' }
    ]
  },
  {
    id: 'ord4',
    warehouse: 'Warehouse B',
    orderNumber: 'ORD-2026-004',
    refNumber: 'REF-44102-K',
    orderDate: 'Jun 16, 2026',
    customerStore: 'Lana Steiner',
    orderStatus: 'New',
    shippingStatus: 'Pre Transit',
    quantity: 50,
    shippingMethod: 'USPS Priority',
    destination: 'Warehouse B Regional Store',
    destinationType: 'Domestic',
    trackingNumber: '',
    orderItems: [
      { productName: 'Hiep\'s Custom Polo Shirt', styleColor: 'CS-01 / Charcoal', sku: 'PL-CHAR-M', quantity: 50 }
    ],
    internalNotes: 'Hold for verification: check customer account credit status.',
    activityHistory: [
      { id: 'act4_1', date: 'Jun 16, 2026 10:05', action: 'Inventory Allocated', performedBy: 'System Auto' },
      { id: 'act4_2', date: 'Jun 16, 2026 09:44', action: 'Order Placed', performedBy: 'Lana Steiner' }
    ]
  },
  {
    id: 'ord5',
    warehouse: 'Warehouse A',
    orderNumber: 'ORD-2026-005',
    refNumber: 'REF-11902-S',
    orderDate: 'Jun 16, 2026',
    customerStore: 'Demi Wilkinson',
    orderStatus: 'Canceled',
    shippingStatus: 'Cancelled',
    quantity: 15,
    shippingMethod: 'UPS Ground',
    destination: 'Store Boutique (Phoenix)',
    destinationType: 'Domestic',
    trackingNumber: '',
    orderItems: [
      { productName: 'Premium Organic Tee', styleColor: '3001C / White', sku: 'TS-WHT-M', quantity: 15 }
    ],
    internalNotes: 'Cancelled by customer order desk email. Refund processed.',
    activityHistory: [
      { id: 'act5_1', date: 'Jun 16, 2026 16:30', action: 'Refund Issued', performedBy: 'Accounts Receivable' },
      { id: 'act5_2', date: 'Jun 16, 2026 15:40', action: 'Cancelled', performedBy: 'CS Staff Hiep', notes: 'Per customer ticket #10245' }
    ]
  },
  {
    id: 'ord6',
    warehouse: 'Warehouse A',
    orderNumber: 'ORD-2026-006',
    refNumber: 'REF-00192-F',
    orderDate: 'Jun 17, 2026',
    customerStore: 'Olivia Rhye',
    orderStatus: 'Prepared',
    shippingStatus: 'Pre Transit',
    quantity: 210,
    shippingMethod: 'UPS Ground',
    destination: 'Warehouse A Dist Center',
    destinationType: 'Domestic',
    trackingNumber: '',
    orderItems: [
      { productName: 'Premium Organic Tee', styleColor: '3001C / Black', sku: 'TS-BLK-S', quantity: 110 },
      { productName: 'Premium Pique Polo', styleColor: 'PPP-02 / Navy', sku: 'PL-NVY-L', quantity: 100 }
    ],
    internalNotes: 'Awaiting inventory batch replenishment for S size.',
    activityHistory: [
      { id: 'act6_1', date: 'Jun 17, 2026 11:20', action: 'Backorder Checked', performedBy: 'System Auto' },
      { id: 'act6_2', date: 'Jun 17, 2026 08:30', action: 'Order Placed', performedBy: 'Olivia Rhye' }
    ]
  },
  {
    id: 'ord7',
    warehouse: 'Warehouse B',
    orderNumber: 'ORD-2026-007',
    refNumber: 'REF-77210-C',
    orderDate: 'Jun 17, 2026',
    customerStore: 'Acme Corp',
    orderStatus: 'New',
    shippingStatus: 'Unknown',
    quantity: 95,
    shippingMethod: 'FedEx Express',
    destination: 'Store #12 (Tokyo Hub)',
    destinationType: 'International',
    trackingNumber: '',
    orderItems: [
      { productName: 'Heavyweight Hooded Sweatshirt', styleColor: '9900H / Charcoal', sku: 'HD-CHAR-M', quantity: 95 }
    ],
    internalNotes: 'Pending secondary billing address authorization sweep.',
    activityHistory: [
      { id: 'act7_1', date: 'Jun 17, 2026 09:00', action: 'Awaiting Payment Approval', performedBy: 'Fin System' }
    ]
  }
];




