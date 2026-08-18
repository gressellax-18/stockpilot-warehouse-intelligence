import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Order,
  OrderStatus,
  Warehouse,
  Product,
  WarehouseInventory,
  Worker,
  PickTask,
  Package,
  QualityCheck,
  Shipment,
  ExceptionItem,
  DecisionLog,
  FeedbackItem,
  ReorderRequest,
  AllocationStrategy,
  PriorityLevel,
  CustomerType,
  ShippingMethod,
  Carrier,
  DemoStep,
} from '../types';
import {
  INITIAL_WAREHOUSES,
  INITIAL_PRODUCTS,
  INITIAL_INVENTORY,
  INITIAL_ORDERS,
  INITIAL_WORKERS,
  INITIAL_PICK_TASKS,
  INITIAL_PACKAGES,
  INITIAL_QUALITY_CHECKS,
  INITIAL_SHIPMENTS,
  INITIAL_EXCEPTIONS,
  INITIAL_DECISION_LOGS,
  INITIAL_FEEDBACK,
  INITIAL_REORDERS,
} from '../data/initialData';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'stockpilot_control_tower_v4';

export const DEMO_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    title: 'Critical Order Received (#10482)',
    tagline: 'Tier-1 Aerospace VIP Client — High Stakes SLA',
    description: 'Tata Advanced Systems placed a critical order for 10 × SKU-421 (Laser LiDAR Sensors) with a stringent 2h 14m SLA deadline.',
    activeView: 'orders',
    highlightedOrderId: '10482',
    targetActionLabel: 'View Order Details',
    aiExplanation: 'Priority Engine calculated a 94/100 Priority Score due to VIP penalty clauses and rapid Same-Day delivery requirements.',
    impactMetrics: [
      { label: 'Priority Score', value: '94 / 100 (CRITICAL)' },
      { label: 'SLA Window', value: '2 Hours 14 Min' },
      { label: 'Order Value', value: '₹1,45,000' },
    ],
  },
  {
    stepNumber: 2,
    title: 'Inventory Conflict Detected',
    tagline: 'Local Stock Constraint at Hyderabad Central FC',
    description: 'Primary fulfillment center (HYD-01) has only 7 available units on hand, while 10 units are required.',
    activeView: 'command_center',
    highlightedOrderId: '10482',
    targetActionLabel: 'Inspect Conflict in Action Center',
    aiExplanation: 'Control Tower cross-referenced 6 national warehouses: Pune has 35 units, Bengaluru has 28 units, Chennai has 7 units.',
    impactMetrics: [
      { label: 'Units Required', value: '10 Units' },
      { label: 'Local Stock', value: '7 Available' },
      { label: 'Deficit', value: '3 Units' },
    ],
  },
  {
    stepNumber: 3,
    title: 'Decision Intelligence Recommendation',
    tagline: 'Explainable AI Prevents Total SLA Breach',
    description: 'StockPilot recommends allocating all 7 local units immediately to #10482 and backordering 3 units from Chennai C-12.',
    activeView: 'command_center',
    highlightedOrderId: '10482',
    targetActionLabel: 'Accept Recommendation',
    aiExplanation: 'Confidence 94%. Fulfilling 7 units preserves assembly line continuity and protects 70% of order value while avoiding severe penalty.',
    impactMetrics: [
      { label: 'AI Confidence', value: '94%' },
      { label: 'SLA Protected', value: '100% On-Time' },
      { label: 'Penalty Avoided', value: '₹50,000' },
    ],
  },
  {
    stepNumber: 4,
    title: 'Manager Approves Decision',
    tagline: 'Human-in-the-Loop Workflow Execution',
    description: 'Warehouse manager approves the partial allocation recommendation. Decision is logged into immutable Decision History.',
    activeView: 'decision_log',
    highlightedOrderId: '10482',
    targetActionLabel: 'View Decision Log',
    aiExplanation: 'System updated inventory ledger: 7 units reserved in HYD-01; automated reorder request REO-301 generated.',
    impactMetrics: [
      { label: 'Action Logged', value: 'ALLOCATE_PARTIAL' },
      { label: 'Audit Trail', value: 'DEC-9941' },
      { label: 'Status', value: 'Approved & Committed' },
    ],
  },
  {
    stepNumber: 5,
    title: 'Smart Route Generated for Picker',
    tagline: 'Aisle Trajectory Optimization (31% Distance Saved)',
    description: 'Pick task PT-8821 assigned to Aryan Rao. System calculates optimized 98m path instead of traditional 142m unoptimized walk.',
    activeView: 'picking',
    highlightedOrderId: '10482',
    targetActionLabel: 'View Where to Go Route',
    aiExplanation: 'Optimized waypoint sequence: START → A-01 → A-03 → A-07 → A-12 → Packing Station 03.',
    impactMetrics: [
      { label: 'Standard Route', value: '142 meters' },
      { label: 'Optimized Route', value: '98 meters' },
      { label: 'Walking Saved', value: '31% Distance' },
    ],
  },
  {
    stepNumber: 6,
    title: 'Picker Discovers 1 Missing Unit',
    tagline: 'Physical Discrepancy at Bin A-03',
    description: 'Picker Aryan Rao scans 6 units in Bin A-03 but finds the 7th physical unit missing. Aryan clicks "Report Missing Item".',
    activeView: 'picking',
    highlightedOrderId: '10482',
    targetActionLabel: 'Report Missing Unit',
    aiExplanation: 'Instead of stalling the entire pick line, StockPilot immediately captures the physical mismatch and routes order to Exception Center.',
    impactMetrics: [
      { label: 'Scanned Units', value: '6 / 7' },
      { label: 'Reported Missing', value: '1 Unit' },
      { label: 'Trigger', value: 'Instant Exception' },
    ],
  },
  {
    stepNumber: 7,
    title: 'Exception Created & Handled',
    tagline: 'Real-Time Control Tower Alert #EX-10482',
    description: 'The exception is registered in the Control Tower. Bin A-03 is flagged for physical inventory count adjustment.',
    activeView: 'exceptions',
    highlightedOrderId: '10482',
    targetActionLabel: 'Inspect Exception Center',
    aiExplanation: 'StockPilot prevents picker idle time by initiating a background multi-warehouse stock search across 5 nearby fulfillment centers.',
    impactMetrics: [
      { label: 'Exception ID', value: 'EX-10482' },
      { label: 'Impacted Order', value: '#10482' },
      { label: 'Status', value: 'OPEN — AI Resolving' },
    ],
  },
  {
    stepNumber: 8,
    title: 'Alternative Stock Found in Chennai',
    tagline: 'Multi-Warehouse Stock Synchronization',
    description: 'System automatically discovers 4 spare units of SKU-421 in Chennai Coastal Fulfillment Center (Bin C-12, 620 km away).',
    activeView: 'exceptions',
    highlightedOrderId: '10482',
    targetActionLabel: 'Review Alternative Stock',
    aiExplanation: 'Direct line transit from Chennai allows same-day delivery via scheduled air shuttle without violating customer SLA.',
    impactMetrics: [
      { label: 'Source Bin', value: 'Chennai C-12' },
      { label: 'Available', value: '7 Units' },
      { label: 'Transit Time', value: 'Air Shuttle Ready' },
    ],
  },
  {
    stepNumber: 9,
    title: '1-Click Reallocation Executed',
    tagline: 'Exception Resolved in Under 60 Seconds',
    description: 'Manager clicks "Reallocate 1 Unit". Inventory ledger updates, and the 6 picked units proceed directly to Packing Station P-03.',
    activeView: 'exceptions',
    highlightedOrderId: '10482',
    targetActionLabel: 'Click Reallocate 1 Unit',
    aiExplanation: 'Zero downtime achieved. Order #10482 resumes active fulfillment line as Exception #EX-10482 is marked RESOLVED.',
    impactMetrics: [
      { label: 'Resolution Time', value: '45 Seconds' },
      { label: 'Line Stoppage', value: '0 Minutes' },
      { label: 'Exception State', value: 'RESOLVED' },
    ],
  },
  {
    stepNumber: 10,
    title: 'Packing Station P-03 Complete',
    tagline: 'Anti-Static Protective Packaging & Weight Check',
    description: 'Packer Nisha Shah encloses sensors in Anti-Static foam with shock-absorption pillows. Package PKG-4491 weighs 6.2 kg.',
    activeView: 'packing',
    highlightedOrderId: '10482',
    targetActionLabel: 'Complete Packing',
    aiExplanation: 'StockPilot validates package cubic volume vs weight density to minimize carrier dimensional surcharge.',
    impactMetrics: [
      { label: 'Package ID', value: 'PKG-4491' },
      { label: 'Gross Weight', value: '6.2 kg' },
      { label: 'Container', value: 'Medium Box (ESD Safe)' },
    ],
  },
  {
    stepNumber: 11,
    title: 'Quality Check Verified & Passed',
    tagline: '5-Point Zero-Defect Optical Verification',
    description: 'QC Inspector Vikram Kumar verifies SKU barcode, quantity (6 units), tamper seal, shipping label, and destination coordinates.',
    activeView: 'packing',
    highlightedOrderId: '10482',
    targetActionLabel: 'PASS Quality Check',
    aiExplanation: 'Checklist 100% verified. Order status automatically advances to READY_TO_DISPATCH at Dock 01.',
    impactMetrics: [
      { label: 'QC Score', value: '5 / 5 Verified' },
      { label: 'Tamper Seal', value: 'Passed' },
      { label: 'Next Stage', value: 'Ready to Dispatch' },
    ],
  },
  {
    stepNumber: 12,
    title: 'Express Dispatch via BlueDart',
    tagline: 'Automated Carrier Routing & Tracking Creation',
    description: 'BlueDart Air Express selected based on real-time SLA deadline comparison. Tracking number BD-98234-IN generated.',
    activeView: 'shipments',
    highlightedOrderId: '10482',
    targetActionLabel: 'Dispatch Shipment',
    aiExplanation: 'Automated manifest transmitted via API to BlueDart dispatch system. Estimated transit time: 3.5 hours.',
    impactMetrics: [
      { label: 'Carrier', value: 'BlueDart Air' },
      { label: 'Tracking ID', value: 'BD-98234-IN' },
      { label: 'Status', value: 'IN TRANSIT' },
    ],
  },
  {
    stepNumber: 13,
    title: 'Live Delivery Tracking to Customer',
    tagline: 'End-to-End Milestone Tracking',
    description: 'Shipment progresses through Regional Sorting Hub, Out for Delivery, and successfully delivered to Tata Advanced Systems.',
    activeView: 'shipments',
    highlightedOrderId: '10482',
    targetActionLabel: 'Advance to Delivered',
    aiExplanation: 'Delivered 42 minutes before SLA deadline. On-time delivery SLA successfully protected.',
    impactMetrics: [
      { label: 'Final Delivery', value: 'On-Time (42m Early)' },
      { label: 'Receiver', value: 'Aerospace Receiving Bay' },
      { label: 'Order Status', value: 'DELIVERED' },
    ],
  },
  {
    stepNumber: 14,
    title: 'Customer Submits 5-Star CSAT',
    tagline: 'Closing the Feedback Loop',
    description: 'Customer submits a 5-star rating with tags: "Fast delivery" & "Good packaging" and praises the rapid partial fulfillment.',
    activeView: 'feedback',
    highlightedOrderId: '10482',
    targetActionLabel: 'Submit Customer Feedback',
    aiExplanation: 'Feedback directly updates the customer satisfaction index (CSAT: 96.8%, NPS: +78).',
    impactMetrics: [
      { label: 'Customer Rating', value: '★★★★★ 5.0' },
      { label: 'CSAT Impact', value: '+0.4% Overall' },
      { label: 'Client Sentiment', value: 'Very Positive' },
    ],
  },
  {
    stepNumber: 15,
    title: 'Analytics & Continuous Learning Loop',
    tagline: 'Operational Intelligence Closes the Circuit',
    description: 'Control Tower analytics reflect the completed lifecycle, updating picker productivity, SLA metrics, and operational recommendations.',
    activeView: 'analytics',
    highlightedOrderId: '10482',
    targetActionLabel: 'Explore Analytics & Bottlenecks',
    aiExplanation: 'StockPilot highlights that Picking was today\'s primary bottleneck (53% of cycle time), driving warehouse continuous improvement.',
    impactMetrics: [
      { label: 'Cycle Time', value: '38 Minutes Total' },
      { label: 'Bottleneck Detected', value: 'Picking (53%)' },
      { label: 'Full Loop Completed', value: 'Demo Success 🎉' },
    ],
  },
];

interface WarehouseContextType {
  // State
  warehouses: Warehouse[];
  products: Product[];
  inventory: WarehouseInventory[];
  orders: Order[];
  workers: Worker[];
  pickTasks: PickTask[];
  packages: Package[];
  qualityChecks: QualityCheck[];
  shipments: Shipment[];
  exceptions: ExceptionItem[];
  decisionLogs: DecisionLog[];
  feedback: FeedbackItem[];
  reorders: ReorderRequest[];

  activeWarehouseId: string | null;
  currentStrategy: AllocationStrategy;
  currentView: string;
  selectedOrderId: string | null;
  presentationMode: boolean;
  demoState: {
    active: boolean;
    currentStep: number;
    isAutoPlaying: boolean;
  };
  isAiDrawerOpen: boolean;
  isNewOrderModalOpen: boolean;

  // Setters / Actions
  setActiveWarehouseId: (id: string | null) => void;
  setCurrentStrategy: (strategy: AllocationStrategy) => void;
  setCurrentView: (view: string) => void;
  setSelectedOrderId: (id: string | null) => void;
  setPresentationMode: (mode: boolean) => void;
  setIsAiDrawerOpen: (open: boolean) => void;
  setIsNewOrderModalOpen: (open: boolean) => void;

  // Business Operations
  placeOrder: (data: {
    customerName: string;
    customerType: CustomerType;
    channel?: import('../types').OrderChannel;
    customerPhone?: string;
    customerEmail?: string;
    sku: string;
    quantity: number;
    destinationCity: string;
    shippingMethod: ShippingMethod;
    preferredWarehouseId?: string;
  }) => Order;

  acceptRecommendation: (orderId: string) => void;
  overrideRecommendation: (orderId: string, customReason?: string) => void;
  assignWorkerToPickTask: (taskId: string, workerId: string) => void;
  scanPickItem: (taskId: string, sku: string) => void;
  reportMissingInPick: (taskId: string, sku: string, count: number) => void;
  reportDamageInPick: (taskId: string, sku: string, count: number) => void;
  resolveException: (exceptionId: string, resolution: 'REALLOCATE_ALT_STOCK' | 'BACKORDER' | 'CANCEL_ITEM') => void;
  startPacking: (orderId: string, packageSize: Package['packageSize'], packagingMaterial: string) => void;
  completePacking: (orderId: string) => void;
  submitQualityCheck: (orderId: string, checklist: QualityCheck['checklist'], passed: boolean, reason?: string) => void;
  dispatchOrder: (orderId: string, carrier: Carrier) => void;
  advanceShipmentStage: (shipmentId: string) => void;
  submitCustomerFeedback: (orderId: string, rating: number, tags: string[], comments: string) => void;
  createReorder: (sku: string, warehouseId: string, quantity: number) => void;

  // Simulator & Demo
  runDemoStep: (stepNumber: number) => void;
  startDemo: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  stopDemo: () => void;
  toggleDemoAutoPlay: () => void;
  resetDemoData: () => void;

  // AI Helper
  askAiAssistant: (prompt: string) => Promise<{ answer: string; confidence: number; recommendation?: any }>;
}

const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined);

export const WarehouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or initial
  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_warehouses');
    return saved ? JSON.parse(saved) : INITIAL_WAREHOUSES;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [inventory, setInventory] = useState<WarehouseInventory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [workers, setWorkers] = useState<Worker[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_workers');
    return saved ? JSON.parse(saved) : INITIAL_WORKERS;
  });

  const [pickTasks, setPickTasks] = useState<PickTask[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_pickTasks');
    return saved ? JSON.parse(saved) : INITIAL_PICK_TASKS;
  });

  const [packages, setPackages] = useState<Package[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_packages');
    return saved ? JSON.parse(saved) : INITIAL_PACKAGES;
  });

  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_qualityChecks');
    return saved ? JSON.parse(saved) : INITIAL_QUALITY_CHECKS;
  });

  const [shipments, setShipments] = useState<Shipment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_shipments');
    return saved ? JSON.parse(saved) : INITIAL_SHIPMENTS;
  });

  const [exceptions, setExceptions] = useState<ExceptionItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_exceptions');
    return saved ? JSON.parse(saved) : INITIAL_EXCEPTIONS;
  });

  const [decisionLogs, setDecisionLogs] = useState<DecisionLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_decisionLogs');
    return saved ? JSON.parse(saved) : INITIAL_DECISION_LOGS;
  });

  const [feedback, setFeedback] = useState<FeedbackItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_feedback');
    return saved ? JSON.parse(saved) : INITIAL_FEEDBACK;
  });

  const [reorders, setReorders] = useState<ReorderRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY + '_reorders');
    return saved ? JSON.parse(saved) : INITIAL_REORDERS;
  });

  const [activeWarehouseId, setActiveWarehouseId] = useState<string | null>(null);
  const [currentStrategy, setCurrentStrategy] = useState<AllocationStrategy>('PRIORITY_FIRST');
  const [currentView, setCurrentView] = useState<string>('command_center');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [presentationMode, setPresentationMode] = useState<boolean>(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState<boolean>(false);

  const [demoState, setDemoState] = useState<{
    active: boolean;
    currentStep: number;
    isAutoPlaying: boolean;
  }>({
    active: false,
    currentStep: 1,
    isAutoPlaying: false,
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY + '_warehouses', JSON.stringify(warehouses));
    localStorage.setItem(STORAGE_KEY + '_products', JSON.stringify(products));
    localStorage.setItem(STORAGE_KEY + '_inventory', JSON.stringify(inventory));
    localStorage.setItem(STORAGE_KEY + '_orders', JSON.stringify(orders));
    localStorage.setItem(STORAGE_KEY + '_workers', JSON.stringify(workers));
    localStorage.setItem(STORAGE_KEY + '_pickTasks', JSON.stringify(pickTasks));
    localStorage.setItem(STORAGE_KEY + '_packages', JSON.stringify(packages));
    localStorage.setItem(STORAGE_KEY + '_qualityChecks', JSON.stringify(qualityChecks));
    localStorage.setItem(STORAGE_KEY + '_shipments', JSON.stringify(shipments));
    localStorage.setItem(STORAGE_KEY + '_exceptions', JSON.stringify(exceptions));
    localStorage.setItem(STORAGE_KEY + '_decisionLogs', JSON.stringify(decisionLogs));
    localStorage.setItem(STORAGE_KEY + '_feedback', JSON.stringify(feedback));
    localStorage.setItem(STORAGE_KEY + '_reorders', JSON.stringify(reorders));
  }, [
    warehouses,
    products,
    inventory,
    orders,
    workers,
    pickTasks,
    packages,
    qualityChecks,
    shipments,
    exceptions,
    decisionLogs,
    feedback,
    reorders,
  ]);

  // Priority Calculation Function
  const calculatePriority = (
    customerType: CustomerType,
    shippingMethod: ShippingMethod,
    quantity: number,
    availableUnits: number
  ): { score: number; level: PriorityLevel; reasons: string[] } => {
    let score = 30; // base
    const reasons: string[] = [];

    // Customer tier
    if (customerType === 'VIP') {
      score += 35;
      reasons.push('VIP Account tier SLA guarantee');
    } else if (customerType === 'ENTERPRISE') {
      score += 25;
      reasons.push('Enterprise Contract priority clause');
    } else {
      reasons.push('Standard Customer Account');
    }

    // Shipping urgency
    if (shippingMethod === 'SAME_DAY') {
      score += 25;
      reasons.push('Same-Day delivery urgency (< 4 hours target)');
    } else if (shippingMethod === 'EXPRESS') {
      score += 15;
      reasons.push('Express Air Delivery timeline');
    } else {
      reasons.push('Standard ground shipping timeline');
    }

    // Stock scarcity risk
    if (availableUnits < quantity) {
      score += 10;
      reasons.push(`Stock conflict: ${availableUnits} available vs ${quantity} required`);
    }

    score = Math.min(100, score);
    const level: PriorityLevel = score >= 80 ? 'CRITICAL' : score >= 60 ? 'HIGH' : 'NORMAL';
    return { score, level, reasons };
  };

  // Smart Allocation Logic
  const findBestWarehouse = (sku: string, requiredQty: number, destCity: string, strategy: AllocationStrategy) => {
    const skuInventory = inventory.filter((inv) => inv.sku === sku);

    // Strategy evaluation
    const scoredWarehouses = warehouses.map((wh) => {
      const inv = skuInventory.find((i) => i.warehouseId === wh.id);
      const available = inv ? inv.available : 0;

      let score = 0;
      if (strategy === 'NEAREST_WAREHOUSE') {
        const isCityMatch = destCity.toLowerCase().includes(wh.city.toLowerCase());
        score += isCityMatch ? 50 : 20;
      } else if (strategy === 'MAXIMIZE_FULFILLED') {
        score += available >= requiredQty ? 60 : (available / requiredQty) * 30;
      } else if (strategy === 'MINIMIZE_PARTIAL') {
        score += available >= requiredQty ? 70 : 0;
      } else {
        // Priority First default
        score += available >= requiredQty ? 40 : (available / requiredQty) * 25;
        if (destCity.toLowerCase().includes(wh.city.toLowerCase())) score += 30;
        score -= wh.capacityUtilization * 0.2;
      }

      return { warehouse: wh, available, score };
    });

    scoredWarehouses.sort((a, b) => b.score - a.score);
    return scoredWarehouses[0] || { warehouse: warehouses[0], available: 0, score: 0 };
  };

  // Place New Order
  const placeOrder = (data: {
    customerName: string;
    customerType: CustomerType;
    channel?: import('../types').OrderChannel;
    customerPhone?: string;
    customerEmail?: string;
    sku: string;
    quantity: number;
    destinationCity: string;
    shippingMethod: ShippingMethod;
    preferredWarehouseId?: string;
  }): Order => {
    const product = products.find((p) => p.sku === data.sku) || products[0];
    const targetWhMatch = data.preferredWarehouseId
      ? {
          warehouse: warehouses.find((w) => w.id === data.preferredWarehouseId) || warehouses[0],
          available: inventory.find((i) => i.warehouseId === data.preferredWarehouseId && i.sku === data.sku)?.available || 0,
        }
      : findBestWarehouse(data.sku, data.quantity, data.destinationCity, currentStrategy);

    const bestWarehouse = targetWhMatch.warehouse;
    const availableInWh = targetWhMatch.available;

    const allocatedQty = Math.min(data.quantity, availableInWh);
    const isPartial = allocatedQty < data.quantity;
    const isOutOfStockVip = (data.customerType === 'VIP' || data.customerType === 'ENTERPRISE') && allocatedQty < data.quantity;
    const stockDeficitUnits = data.quantity - allocatedQty;

    const { score, level, reasons } = calculatePriority(
      data.customerType,
      data.shippingMethod,
      data.quantity,
      availableInWh
    );

    const orderId = `${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const slaHours = data.shippingMethod === 'SAME_DAY' ? 4 : data.shippingMethod === 'EXPRESS' ? 12 : 36;
    const slaDeadline = new Date(now.getTime() + slaHours * 60 * 60 * 1000).toISOString();

    const orderItem = {
      sku: product.sku,
      productName: product.name,
      quantityRequired: data.quantity,
      quantityAllocated: allocatedQty,
      quantityPicked: 0,
      quantityPacked: 0,
      unitPrice: product.unitPrice,
    };

    const newOrder: Order = {
      id: orderId,
      customerName: data.customerName,
      customerType: data.customerType,
      channel: data.channel || 'Amazon',
      customerPhone: data.customerPhone || '+91 98450 12890',
      customerEmail: data.customerEmail || `${data.customerName.toLowerCase().replace(/[^a-z0-9]/g, '')}@enterprise.in`,
      isOutOfStockVip,
      stockDeficitUnits: stockDeficitUnits > 0 ? stockDeficitUnits : undefined,
      items: [orderItem],
      destinationCity: data.destinationCity,
      shippingMethod: data.shippingMethod,
      placedAt: now.toISOString(),
      slaDeadline,
      slaRemainingMinutes: slaHours * 60,
      priorityScore: score,
      priorityLevel: level,
      priorityReasons: reasons,
      status: allocatedQty > 0 ? 'ALLOCATED' : 'EXCEPTION',
      assignedWarehouseId: bestWarehouse.id,
      allocatedWarehouseName: bestWarehouse.name,
      isPartial,
      totalAmount: product.unitPrice * data.quantity,
      notes: isPartial
        ? `Partial allocation: ${allocatedQty}/${data.quantity} units assigned in ${bestWarehouse.city}. ${data.quantity - allocatedQty} backordered.`
        : `100% full allocation in ${bestWarehouse.city}.`,
      timeline: [
        { stage: 'NEW', label: 'Order Created & Received', startTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true, workerName: 'System Gateway' },
        { stage: 'VALIDATED', label: 'Customer Account & Address Validated', startTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true, workerName: 'Rules Engine' },
        { stage: 'PRIORITIZED', label: `Priority Scored ${score}/100 (${level})`, startTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true, workerName: 'Priority Engine' },
        { stage: 'ALLOCATED', label: `Allocated ${allocatedQty} units in ${bestWarehouse.name}`, startTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true, workerName: 'Pilot Decision AI' },
        { stage: 'PICKING', label: 'Pending Picker Assignment', completed: false },
        { stage: 'PACKING', label: 'Packing Station', completed: false },
        { stage: 'QC', label: 'Quality Check', completed: false },
        { stage: 'DISPATCHED', label: 'Carrier Dispatch', completed: false },
        { stage: 'IN_TRANSIT', label: 'In Transit', completed: false },
        { stage: 'DELIVERED', label: 'Delivery', completed: false },
        { stage: 'FEEDBACK_RECEIVED', label: 'Customer Feedback', completed: false },
      ],
    };

    // Update inventory (reserve quantity)
    setInventory((prev) =>
      prev.map((inv) => {
        if (inv.warehouseId === bestWarehouse.id && inv.sku === product.sku) {
          const newAvailable = Math.max(0, inv.available - allocatedQty);
          const newReserved = inv.reserved + allocatedQty;
          return { ...inv, available: newAvailable, reserved: newReserved };
        }
        return inv;
      })
    );

    // Auto-create pick task if units allocated
    if (allocatedQty > 0) {
      const taskId = `PT-${Math.floor(8000 + Math.random() * 1000)}`;
      const idleWorker = workers.find((w) => w.role === 'PICKER' && w.status === 'IDLE') || workers[0];

      const newPickTask: PickTask = {
        id: taskId,
        orderId: newOrder.id,
        assignedWorkerId: idleWorker.id,
        assignedWorkerName: idleWorker.name,
        zone: 'Zone A',
        items: [
          {
            sku: product.sku,
            productName: product.name,
            binLocation: inventory.find((i) => i.warehouseId === bestWarehouse.id && i.sku === product.sku)?.binLocation || 'A-01',
            quantityRequested: allocatedQty,
            quantityScanned: 0,
            status: 'PENDING',
          },
        ],
        progressPercent: 0,
        status: 'PENDING',
        estimatedWalkingMeters: 135,
        optimizedWalkingMeters: 92,
        efficiencyGainPercent: 32,
        routeSequence: ['START', 'A-01', 'A-04', 'PACKING_STATION_01'],
        createdAt: now.toISOString(),
      };

      newOrder.pickTaskId = taskId;
      setPickTasks((prev) => [newPickTask, ...prev]);

      // Update worker
      setWorkers((prev) =>
        prev.map((w) => (w.id === idleWorker.id ? { ...w, status: 'PICKING', currentTaskId: taskId } : w))
      );
    }

    // Log decision
    const decision: DecisionLog = {
      id: `DEC-${Math.floor(9000 + Math.random() * 1000)}`,
      decisionType: isPartial ? 'PARTIAL_FULFILLMENT' : 'ALLOCATE_STOCK',
      orderId: newOrder.id,
      action: `Allocated ${allocatedQty} units of ${product.sku} at ${bestWarehouse.name}`,
      reason: `Strategy ${currentStrategy} applied. Available: ${availableInWh}, Required: ${data.quantity}. Priority: ${level} (${score}/100).`,
      confidenceScore: 95,
      alternativeOptions: [
        { option: 'Fulfill from Secondary DC', rejectedReason: 'Secondary transit time adds 8h SLA delay.' },
      ],
      expectedImpact: isPartial ? 'Protects immediate partial order fulfillment' : '100% On-time SLA delivery guarantee',
      timestamp: now.toISOString(),
      acceptedBy: 'AI_AUTO',
    };

    setDecisionLogs((prev) => [decision, ...prev]);
    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrderId(newOrder.id);
    return newOrder;
  };

  // Recalculate allocations when strategy changes
  const handleStrategyChange = (newStrategy: AllocationStrategy) => {
    setCurrentStrategy(newStrategy);
    const log: DecisionLog = {
      id: `DEC-${Math.floor(9000 + Math.random() * 1000)}`,
      decisionType: 'ALLOCATE_STOCK',
      orderId: 'MULTIPLE',
      action: `Switched global allocation strategy to ${newStrategy}`,
      reason: `Operator updated optimization parameters to emphasize ${newStrategy.replace('_', ' ').toLowerCase()}`,
      confidenceScore: 92,
      alternativeOptions: [],
      expectedImpact: 'Recomputed routing priorities across all 6 connected national warehouses',
      timestamp: new Date().toISOString(),
      acceptedBy: 'OPERATOR_OVERRIDE',
    };
    setDecisionLogs((prev) => [log, ...prev]);
  };

  // Accept Recommendation
  const acceptRecommendation = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedTimeline = ord.timeline.map((t) =>
            t.stage === 'ALLOCATED' ? { ...t, completed: true, notes: 'Recommendation Accepted by Operator' } : t
          );
          return {
            ...ord,
            status: ord.status === 'NEW' || ord.status === 'VALIDATED' ? 'ALLOCATED' : ord.status,
            timeline: updatedTimeline,
            notes: (ord.notes || '') + ' [AI Recommendation Confirmed]',
          };
        }
        return ord;
      })
    );

    const log: DecisionLog = {
      id: `DEC-${Math.floor(9000 + Math.random() * 1000)}`,
      decisionType: 'PARTIAL_FULFILLMENT',
      orderId,
      action: `Operator ACCEPTED recommendation for Order #${orderId}`,
      reason: 'Confirmed allocation optimization & SLA penalty protection',
      confidenceScore: 96,
      alternativeOptions: [],
      expectedImpact: 'Locks in current allocation plan and dispatches picking task',
      timestamp: new Date().toISOString(),
      acceptedBy: 'MANAGER_APPROVAL',
    };
    setDecisionLogs((prev) => [log, ...prev]);
  };

  // Override Recommendation
  const overrideRecommendation = (orderId: string, customReason?: string) => {
    const reason = customReason || 'Manual manager priority override applied.';
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            notes: `${ord.notes || ''} [OVERRIDE: ${reason}]`,
          };
        }
        return ord;
      })
    );

    const log: DecisionLog = {
      id: `DEC-${Math.floor(9000 + Math.random() * 1000)}`,
      decisionType: 'PRIORITY_OVERRIDE',
      orderId,
      action: `Manual Override executed for Order #${orderId}`,
      reason,
      confidenceScore: 100,
      alternativeOptions: [],
      expectedImpact: 'Operator customized order routing rules',
      timestamp: new Date().toISOString(),
      acceptedBy: 'OPERATOR_OVERRIDE',
    };
    setDecisionLogs((prev) => [log, ...prev]);
  };

  // Assign Worker to Pick Task
  const assignWorkerToPickTask = (taskId: string, workerId: string) => {
    const worker = workers.find((w) => w.id === workerId);
    if (!worker) return;

    setPickTasks((prev) =>
      prev.map((pt) =>
        pt.id === taskId
          ? {
              ...pt,
              assignedWorkerId: worker.id,
              assignedWorkerName: worker.name,
              status: 'IN_PROGRESS',
            }
          : pt
      )
    );

    setWorkers((prev) =>
      prev.map((w) =>
        w.id === workerId
          ? { ...w, status: 'PICKING', currentTaskId: taskId }
          : w.currentTaskId === taskId
          ? { ...w, status: 'IDLE', currentTaskId: undefined }
          : w
      )
    );
  };

  // Scan Pick Item
  const scanPickItem = (taskId: string, sku: string) => {
    setPickTasks((prev) =>
      prev.map((pt) => {
        if (pt.id === taskId) {
          const updatedItems = pt.items.map((item) => {
            if (item.sku === sku) {
              const newScanned = Math.min(item.quantityRequested, item.quantityScanned + 1);
              return {
                ...item,
                quantityScanned: newScanned,
                status: (newScanned >= item.quantityRequested ? 'SCANNED' : 'PENDING') as any,
              };
            }
            return item;
          });

          const totalReq = updatedItems.reduce((sum, i) => sum + i.quantityRequested, 0);
          const totalScanned = updatedItems.reduce((sum, i) => sum + i.quantityScanned, 0);
          const progressPercent = Math.round((totalScanned / totalReq) * 100);
          const isComplete = progressPercent === 100;

          // If complete, advance order to PACKING
          if (isComplete) {
            setOrders((orderList) =>
              orderList.map((ord) => {
                if (ord.id === pt.orderId) {
                  const updatedTimeline = ord.timeline.map((t) =>
                    t.stage === 'PICKING'
                      ? { ...t, completed: true, endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
                      : t
                  );
                  return {
                    ...ord,
                    status: 'PACKING',
                    timeline: updatedTimeline,
                  };
                }
                return ord;
              })
            );
          }

          return {
            ...pt,
            items: updatedItems,
            progressPercent,
            status: isComplete ? 'COMPLETED' : 'IN_PROGRESS',
          };
        }
        return pt;
      })
    );
  };

  // Report Missing Item during Picking -> Creates real Exception
  const reportMissingInPick = (taskId: string, sku: string, missingCount: number) => {
    const task = pickTasks.find((t) => t.id === taskId);
    if (!task) return;

    const exceptionId = `EX-${task.orderId}`;
    const product = products.find((p) => p.sku === sku);

    // Search alternative warehouses with stock
    const altInventory = inventory
      .filter((inv) => inv.sku === sku && inv.available > 0 && inv.warehouseId !== 'wh-hyd')
      .sort((a, b) => b.available - a.available)[0];

    const altWarehouse = altInventory ? warehouses.find((w) => w.id === altInventory.warehouseId) : undefined;

    const newException: ExceptionItem = {
      id: exceptionId,
      orderId: task.orderId,
      sku,
      productName: product ? product.name : sku,
      type: 'MISSING_IN_BIN',
      expectedQuantity: task.items[0]?.quantityRequested || 7,
      foundQuantity: (task.items[0]?.quantityRequested || 7) - missingCount,
      missingOrDamagedCount: missingCount,
      detectedAtBin: task.items[0]?.binLocation || 'A-03',
      detectedByWorker: task.assignedWorkerName || 'Aryan Rao',
      status: 'OPEN',
      alternativeStockFound: altWarehouse
        ? {
            warehouseId: altWarehouse.id,
            warehouseName: altWarehouse.name,
            binLocation: altInventory.binLocation,
            availableQuantity: altInventory.available,
            distanceKm: 620,
            estimatedTransitHours: 8,
          }
        : undefined,
      recommendedResolution: altWarehouse
        ? `Reallocate ${missingCount} unit from ${altWarehouse.name} (${altInventory.binLocation}) via air express shuttle.`
        : 'Create urgent supplier replenishment PO.',
      createdAt: new Date().toISOString(),
    };

    setExceptions((prev) => [newException, ...prev.filter((e) => e.id !== exceptionId)]);

    // Update inventory missing count
    setInventory((prev) =>
      prev.map((inv) => {
        if (inv.warehouseId === 'wh-hyd' && inv.sku === sku) {
          return {
            ...inv,
            onHand: Math.max(0, inv.onHand - missingCount),
            missing: inv.missing + missingCount,
          };
        }
        return inv;
      })
    );

    // Update order status to EXCEPTION
    setOrders((prev) =>
      prev.map((ord) => (ord.id === task.orderId ? { ...ord, status: 'EXCEPTION', exceptionId } : ord))
    );

    // Update pick task
    setPickTasks((prev) =>
      prev.map((pt) =>
        pt.id === taskId
          ? {
              ...pt,
              status: 'EXCEPTION',
              items: pt.items.map((i) => (i.sku === sku ? { ...i, status: 'MISSING' } : i)),
            }
          : pt
      )
    );
  };

  // Report Damage Item during Picking -> Creates real Exception & removes from available stock
  const reportDamageInPick = (taskId: string, sku: string, damagedCount: number) => {
    const task = pickTasks.find((t) => t.id === taskId);
    if (!task) return;

    const exceptionId = `EX-DAM-${task.orderId}`;
    const product = products.find((p) => p.sku === sku);

    const newException: ExceptionItem = {
      id: exceptionId,
      orderId: task.orderId,
      sku,
      productName: product ? product.name : sku,
      type: 'DAMAGED_ITEM',
      expectedQuantity: task.items[0]?.quantityRequested || 2,
      foundQuantity: Math.max(0, (task.items[0]?.quantityRequested || 2) - damagedCount),
      missingOrDamagedCount: damagedCount,
      detectedAtBin: task.items[0]?.binLocation || 'C-08',
      detectedByWorker: task.assignedWorkerName || 'Picker',
      status: 'OPEN',
      recommendedResolution: 'Quarantine damaged units immediately. Reallocate replacement from nearest West fulfillment center.',
      createdAt: new Date().toISOString(),
    };

    setExceptions((prev) => [newException, ...prev]);

    // Update inventory damaged count
    setInventory((prev) =>
      prev.map((inv) => {
        if (inv.sku === sku && inv.available >= damagedCount) {
          return {
            ...inv,
            available: inv.available - damagedCount,
            damaged: inv.damaged + damagedCount,
            quarantine: inv.quarantine + damagedCount,
          };
        }
        return inv;
      })
    );

    setOrders((prev) =>
      prev.map((ord) => (ord.id === task.orderId ? { ...ord, status: 'EXCEPTION', exceptionId } : ord))
    );
  };

  // Resolve Exception (1-click Reallocate, Backorder, Cancel)
  const resolveException = (
    exceptionId: string,
    resolution: 'REALLOCATE_ALT_STOCK' | 'BACKORDER' | 'CANCEL_ITEM'
  ) => {
    const exception = exceptions.find((e) => e.id === exceptionId);
    if (!exception) return;

    let resolutionText = '';
    if (resolution === 'REALLOCATE_ALT_STOCK') {
      resolutionText = `Reallocated ${exception.missingOrDamagedCount} unit from ${
        exception.alternativeStockFound?.warehouseName || 'Alternative Hub'
      } (Bin ${exception.alternativeStockFound?.binLocation || 'C-12'}).`;

      // Deduct from alt inventory
      if (exception.alternativeStockFound) {
        setInventory((prev) =>
          prev.map((inv) => {
            if (
              inv.warehouseId === exception.alternativeStockFound?.warehouseId &&
              inv.sku === exception.sku
            ) {
              return {
                ...inv,
                available: Math.max(0, inv.available - exception.missingOrDamagedCount),
                reserved: inv.reserved + exception.missingOrDamagedCount,
              };
            }
            return inv;
          })
        );
      }
    } else if (resolution === 'BACKORDER') {
      resolutionText = `Created backorder PO for ${exception.missingOrDamagedCount} units with 2-day priority lead time.`;
    } else {
      resolutionText = `Cancelled missing item line and adjusted order total accordingly.`;
    }

    setExceptions((prev) =>
      prev.map((e) =>
        e.id === exceptionId
          ? {
              ...e,
              status: 'RESOLVED',
              resolvedAction: resolutionText,
              resolvedAt: new Date().toISOString(),
            }
          : e
      )
    );

    // Move order forward to PACKING
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === exception.orderId) {
          const updatedTimeline = ord.timeline.map((t) =>
            t.stage === 'PICKING' ? { ...t, completed: true, notes: 'Resolved & Pick Finalized' } : t
          );
          return {
            ...ord,
            status: 'PACKING',
            timeline: updatedTimeline,
            notes: (ord.notes || '') + ` [Exception Resolved: ${resolutionText}]`,
          };
        }
        return ord;
      })
    );

    // Update pick task
    setPickTasks((prev) =>
      prev.map((pt) =>
        pt.orderId === exception.orderId
          ? { ...pt, status: 'COMPLETED', progressPercent: 100 }
          : pt
      )
    );

    // Log decision
    const log: DecisionLog = {
      id: `DEC-${Math.floor(9000 + Math.random() * 1000)}`,
      decisionType: 'EXCEPTION_REALLOCATION',
      orderId: exception.orderId,
      action: `Resolved Exception ${exceptionId}: ${resolutionText}`,
      reason: 'Automated multi-warehouse stock routing recovered missing inventory with zero SLA penalty',
      confidenceScore: 98,
      alternativeOptions: [
        { option: 'Halt entire order until weekly replenishment', rejectedReason: 'Guaranteed 4-day SLA breach' },
      ],
      expectedImpact: 'Preserves on-time delivery schedule without line stoppage',
      timestamp: new Date().toISOString(),
      acceptedBy: 'MANAGER_APPROVAL',
    };
    setDecisionLogs((prev) => [log, ...prev]);
  };

  // Start Packing Station
  const startPacking = (orderId: string, packageSize: Package['packageSize'], packagingMaterial: string) => {
    const pkgId = `PKG-${Math.floor(4000 + Math.random() * 1000)}`;
    const packer = workers.find((w) => w.role === 'PACKER' && w.status === 'IDLE') || workers[1];

    const newPkg: Package = {
      id: pkgId,
      orderId,
      packageSize,
      weightKg: packageSize === 'SMALL_BOX' ? 2.4 : packageSize === 'MEDIUM_BOX' ? 6.2 : 18.5,
      packagingMaterial,
      packerName: packer.name,
      station: packer.stationOrZone,
      isPacked: false,
    };

    setPackages((prev) => [newPkg, ...prev.filter((p) => p.orderId !== orderId)]);
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              packageId: pkgId,
              status: 'PACKING',
              timeline: ord.timeline.map((t) =>
                t.stage === 'PACKING' ? { ...t, startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), workerName: packer.name } : t
              ),
            }
          : ord
      )
    );
  };

  // Complete Packing -> Move to QC
  const completePacking = (orderId: string) => {
    const qcId = `QC-${Math.floor(800 + Math.random() * 200)}`;
    const inspector = workers.find((w) => w.role === 'QC_INSPECTOR') || workers[2];

    const newQc: QualityCheck = {
      id: qcId,
      orderId,
      inspectorName: inspector.name,
      station: inspector.stationOrZone,
      checklist: {
        skuCorrect: true,
        quantityCorrect: true,
        packageSealed: true,
        labelAttached: true,
        addressVerified: true,
      },
      passed: null,
    };

    setQualityChecks((prev) => [newQc, ...prev.filter((q) => q.orderId !== orderId)]);
    setPackages((prev) =>
      prev.map((p) => (p.orderId === orderId ? { ...p, isPacked: true, packedAt: new Date().toISOString() } : p))
    );

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedTimeline = ord.timeline.map((t) =>
            t.stage === 'PACKING'
              ? { ...t, completed: true, endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
              : t
          );
          return { ...ord, status: 'QC', timeline: updatedTimeline };
        }
        return ord;
      })
    );
  };

  // Submit Quality Check
  const submitQualityCheck = (
    orderId: string,
    checklist: QualityCheck['checklist'],
    passed: boolean,
    reason?: string
  ) => {
    setQualityChecks((prev) =>
      prev.map((q) =>
        q.orderId === orderId
          ? {
              ...q,
              checklist,
              passed,
              failedReason: reason,
              checkedAt: new Date().toISOString(),
            }
          : q
      )
    );

    if (passed) {
      setOrders((prev) =>
        prev.map((ord) => {
          if (ord.id === orderId) {
            const updatedTimeline = ord.timeline.map((t) =>
              t.stage === 'QC'
                ? { ...t, completed: true, endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
                : t
            );
            return { ...ord, status: 'READY_TO_DISPATCH', timeline: updatedTimeline };
          }
          return ord;
        })
      );
    } else {
      // Failed QC creates exception
      const exId = `EX-QC-${orderId}`;
      const newEx: ExceptionItem = {
        id: exId,
        orderId,
        sku: 'QC-REJECT',
        productName: 'Quality Inspection Failure',
        type: 'QC_FAILED',
        expectedQuantity: 1,
        foundQuantity: 0,
        missingOrDamagedCount: 1,
        detectedAtBin: 'QC Bay',
        detectedByWorker: 'Vikram Kumar',
        status: 'OPEN',
        recommendedResolution: `Repack & reseal package. Reason: ${reason || 'Failed seal/label inspection'}`,
        createdAt: new Date().toISOString(),
      };
      setExceptions((prev) => [newEx, ...prev]);
      setOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, status: 'EXCEPTION', exceptionId: exId } : ord)));
    }
  };

  // Dispatch Order -> Creates Shipment
  const dispatchOrder = (orderId: string, carrier: Carrier) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const shpId = `SHP-${Math.floor(7000 + Math.random() * 1000)}`;
    const prefix = carrier === 'BlueDart' ? 'BD' : carrier === 'Delhivery' ? 'DEL' : carrier === 'DTDC' ? 'DT' : 'XB';
    const trackingNumber = `${prefix}-${Math.floor(10000 + Math.random() * 90000)}-IN`;

    const now = new Date();
    const estDelivery = new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString();

    const newShipment: Shipment = {
      id: shpId,
      orderId,
      trackingNumber,
      carrier,
      originWarehouse: order.allocatedWarehouseName || 'Hyderabad Central FC',
      destinationCity: order.destinationCity,
      currentStage: 'DISPATCHED',
      dispatchedAt: now.toISOString(),
      estimatedDelivery: estDelivery,
      history: [
        { stage: 'WAREHOUSE', label: 'QC Passed & Packed at Dock', location: order.allocatedWarehouseName || 'Hyderabad FC', timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
        { stage: 'DISPATCHED', label: `Handed over to ${carrier} Express Air Courier`, location: 'Dock 01', timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
        { stage: 'IN_TRANSIT', label: `Departed origin hub on dedicated flight shuttle`, location: 'Airport Cargo Terminal', timestamp: 'Pending', completed: false },
        { stage: 'REGIONAL_HUB', label: 'Arrival at destination sort facility', location: order.destinationCity, timestamp: 'Pending', completed: false },
        { stage: 'OUT_FOR_DELIVERY', label: 'Courier dispatch van en route', location: 'Local Distribution', timestamp: 'Pending', completed: false },
        { stage: 'DELIVERED', label: 'Recipient Signature & Photo Handover', location: 'Customer Gate', timestamp: 'Pending', completed: false },
      ],
    };

    setShipments((prev) => [newShipment, ...prev.filter((s) => s.orderId !== orderId)]);
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedTimeline = ord.timeline.map((t) =>
            t.stage === 'DISPATCHED' ? { ...t, completed: true, startTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : t
          );
          return {
            ...ord,
            status: 'DISPATCHED',
            shipmentId: shpId,
            timeline: updatedTimeline,
          };
        }
        return ord;
      })
    );

    const log: DecisionLog = {
      id: `DEC-${Math.floor(9000 + Math.random() * 1000)}`,
      decisionType: 'CARRIER_SELECTION',
      orderId,
      action: `Selected ${carrier} for Order #${orderId} with tracking ${trackingNumber}`,
      reason: `Optimized carrier selection meeting Same-Day air freight SLA deadline`,
      confidenceScore: 97,
      alternativeOptions: [],
      expectedImpact: 'Guarantees on-time doorstep delivery',
      timestamp: now.toISOString(),
      acceptedBy: 'AI_AUTO',
    };
    setDecisionLogs((prev) => [log, ...prev]);
  };

  // Advance Shipment Stages
  const advanceShipmentStage = (shipmentId: string) => {
    setShipments((prev) =>
      prev.map((shp) => {
        if (shp.id === shipmentId) {
          const stages: Shipment['currentStage'][] = [
            'WAREHOUSE',
            'DISPATCHED',
            'IN_TRANSIT',
            'REGIONAL_HUB',
            'OUT_FOR_DELIVERY',
            'DELIVERED',
          ];
          const currentIndex = stages.indexOf(shp.currentStage);
          if (currentIndex < stages.length - 1) {
            const nextStage = stages[currentIndex + 1];
            const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const updatedHistory = shp.history.map((h) => {
              if (h.stage === nextStage) {
                return { ...h, completed: true, timestamp: now };
              }
              return h;
            });

            // Update order status
            const orderStatus: OrderStatus =
              nextStage === 'DELIVERED'
                ? 'DELIVERED'
                : nextStage === 'OUT_FOR_DELIVERY'
                ? 'OUT_FOR_DELIVERY'
                : 'IN_TRANSIT';

            setOrders((orderList) =>
              orderList.map((ord) => {
                if (ord.id === shp.orderId) {
                  const updatedTimeline = ord.timeline.map((t) => {
                    if (t.stage === 'IN_TRANSIT' && nextStage === 'IN_TRANSIT') return { ...t, completed: true, startTime: now };
                    if (t.stage === 'DELIVERED' && nextStage === 'DELIVERED') return { ...t, completed: true, endTime: now };
                    return t;
                  });
                  return {
                    ...ord,
                    status: orderStatus,
                    timeline: updatedTimeline,
                  };
                }
                return ord;
              })
            );

            if (nextStage === 'DELIVERED') {
              confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
            }

            return {
              ...shp,
              currentStage: nextStage,
              deliveredAt: nextStage === 'DELIVERED' ? new Date().toISOString() : shp.deliveredAt,
              history: updatedHistory,
            };
          }
        }
        return shp;
      })
    );
  };

  // Submit Customer Feedback -> Real impact on analytics & packaging recommendations
  const submitCustomerFeedback = (orderId: string, rating: number, tags: string[], comments: string) => {
    const order = orders.find((o) => o.id === orderId);
    const fbId = `FB-${Math.floor(900 + Math.random() * 100)}`;

    let recommendation = '';
    if (rating >= 4) {
      recommendation = 'Maintain high-speed air dispatch standard and ESD packaging protocol.';
    } else if (tags.includes('Damaged item') || tags.includes('Minor packaging wear')) {
      recommendation = 'Increase packing verification: Enforce double-wall corrugated cartons for shipments > 10kg.';
    } else if (tags.includes('Late delivery')) {
      recommendation = 'Recalibrate carrier SLA buffers for South India regional transits.';
    } else {
      recommendation = 'Review picker accuracy checklists in Zone A.';
    }

    const newFeedback: FeedbackItem = {
      id: fbId,
      orderId,
      customerName: order ? order.customerName : 'Verified Customer',
      rating,
      tags,
      comments,
      submittedAt: new Date().toISOString(),
      impactOnAnalytics: `Updated CSAT score and added operational recommendation to Control Tower.`,
      actionableRecommendation: recommendation,
    };

    setFeedback((prev) => [newFeedback, ...prev]);

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedTimeline = ord.timeline.map((t) =>
            t.stage === 'FEEDBACK_RECEIVED' ? { ...t, completed: true, notes: `Rating: ${rating}★` } : t
          );
          return {
            ...ord,
            status: 'FEEDBACK_RECEIVED',
            feedbackId: fbId,
            timeline: updatedTimeline,
          };
        }
        return ord;
      })
    );
  };

  // Create Reorder Request
  const createReorder = (sku: string, warehouseId: string, quantity: number) => {
    const product = products.find((p) => p.sku === sku);
    const wh = warehouses.find((w) => w.id === warehouseId);

    const reo: ReorderRequest = {
      id: `REO-${Math.floor(300 + Math.random() * 200)}`,
      sku,
      productName: product ? product.name : sku,
      warehouseId,
      warehouseName: wh ? wh.name : 'Central Hub',
      quantityRequested: quantity,
      supplier: product ? product.supplier : 'Apex Industrial Ltd',
      urgency: 'HIGH',
      status: 'ORDERED',
      createdAt: new Date().toISOString(),
    };

    setReorders((prev) => [reo, ...prev]);

    // Update incoming inventory
    setInventory((prev) =>
      prev.map((inv) => {
        if (inv.sku === sku && inv.warehouseId === warehouseId) {
          return { ...inv, incoming: inv.incoming + quantity };
        }
        return inv;
      })
    );

    const log: DecisionLog = {
      id: `DEC-${Math.floor(9000 + Math.random() * 1000)}`,
      decisionType: 'REPLENISHMENT_ORDER',
      orderId: 'INVENTORY_REORDER',
      action: `Created Replenishment PO for ${quantity} units of ${sku} at ${wh?.name}`,
      reason: 'Automated demand forecasting detected stockout risk under 24 hours',
      confidenceScore: 99,
      alternativeOptions: [],
      expectedImpact: `Replenishes stock buffer before next wave of enterprise orders`,
      timestamp: new Date().toISOString(),
      acceptedBy: 'AI_AUTO',
    };
    setDecisionLogs((prev) => [log, ...prev]);
  };

  // 15-Step Automated Demo Orchestrator
  const runDemoStep = useCallback((stepNumber: number) => {
    const step = DEMO_STEPS.find((s) => s.stepNumber === stepNumber);
    if (!step) return;

    setDemoState((prev) => ({ ...prev, currentStep: stepNumber, active: true }));
    setCurrentView(step.activeView);
    if (step.highlightedOrderId) {
      setSelectedOrderId(step.highlightedOrderId);
    }

    // Programmatically advance data state corresponding to demo step
    if (stepNumber === 1) {
      // Step 1: Order 10482 in system
      setSelectedOrderId('10482');
    } else if (stepNumber === 3) {
      // Step 3: Decision ready
    } else if (stepNumber === 4) {
      // Step 4: Accept recommendation
      acceptRecommendation('10482');
    } else if (stepNumber === 6) {
      // Step 6: Trigger missing item
      reportMissingInPick('PT-8821', 'SKU-421', 1);
    } else if (stepNumber === 9) {
      // Step 9: Resolve exception by reallocating
      resolveException('EX-10482', 'REALLOCATE_ALT_STOCK');
    } else if (stepNumber === 10) {
      // Step 10: Complete packing
      completePacking('10482');
    } else if (stepNumber === 11) {
      // Step 11: Pass QC
      submitQualityCheck(
        '10482',
        {
          skuCorrect: true,
          quantityCorrect: true,
          packageSealed: true,
          labelAttached: true,
          addressVerified: true,
        },
        true
      );
    } else if (stepNumber === 12) {
      // Step 12: Dispatch via BlueDart
      dispatchOrder('10482', 'BlueDart');
    } else if (stepNumber === 13) {
      // Step 13: Advance to delivered
      const shp = shipments.find((s) => s.orderId === '10482');
      if (shp) {
        advanceShipmentStage(shp.id);
        advanceShipmentStage(shp.id);
        advanceShipmentStage(shp.id);
        advanceShipmentStage(shp.id);
      }
    } else if (stepNumber === 14) {
      // Step 14: Submit 5-star feedback
      submitCustomerFeedback(
        '10482',
        5,
        ['Fast delivery', 'Good packaging', 'Accurate order'],
        'Remarkable response! The partial fulfillment saved our satellite assembly schedule from halting. Outstanding control tower communication.'
      );
    }
  }, [shipments]);

  const startDemo = () => {
    setDemoState({ active: true, currentStep: 1, isAutoPlaying: false });
    runDemoStep(1);
  };

  const nextDemoStep = () => {
    if (demoState.currentStep < 15) {
      runDemoStep(demoState.currentStep + 1);
    }
  };

  const prevDemoStep = () => {
    if (demoState.currentStep > 1) {
      runDemoStep(demoState.currentStep - 1);
    }
  };

  const stopDemo = () => {
    setDemoState((prev) => ({ ...prev, active: false, isAutoPlaying: false }));
  };

  const toggleDemoAutoPlay = () => {
    setDemoState((prev) => ({ ...prev, isAutoPlaying: !prev.isAutoPlaying }));
  };

  // Demo auto-play interval
  useEffect(() => {
    let timer: any;
    if (demoState.active && demoState.isAutoPlaying) {
      timer = setInterval(() => {
        setDemoState((prev) => {
          if (prev.currentStep < 15) {
            const next = prev.currentStep + 1;
            runDemoStep(next);
            return { ...prev, currentStep: next };
          } else {
            return { ...prev, isAutoPlaying: false };
          }
        });
      }, 6000);
    }
    return () => clearInterval(timer);
  }, [demoState.active, demoState.isAutoPlaying, runDemoStep]);

  // Reset Demo Data
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY + '_warehouses');
    localStorage.removeItem(STORAGE_KEY + '_products');
    localStorage.removeItem(STORAGE_KEY + '_inventory');
    localStorage.removeItem(STORAGE_KEY + '_orders');
    localStorage.removeItem(STORAGE_KEY + '_workers');
    localStorage.removeItem(STORAGE_KEY + '_pickTasks');
    localStorage.removeItem(STORAGE_KEY + '_packages');
    localStorage.removeItem(STORAGE_KEY + '_qualityChecks');
    localStorage.removeItem(STORAGE_KEY + '_shipments');
    localStorage.removeItem(STORAGE_KEY + '_exceptions');
    localStorage.removeItem(STORAGE_KEY + '_decisionLogs');
    localStorage.removeItem(STORAGE_KEY + '_feedback');
    localStorage.removeItem(STORAGE_KEY + '_reorders');

    setWarehouses(INITIAL_WAREHOUSES);
    setProducts(INITIAL_PRODUCTS);
    setInventory(INITIAL_INVENTORY);
    setOrders(INITIAL_ORDERS);
    setWorkers(INITIAL_WORKERS);
    setPickTasks(INITIAL_PICK_TASKS);
    setPackages(INITIAL_PACKAGES);
    setQualityChecks(INITIAL_QUALITY_CHECKS);
    setShipments(INITIAL_SHIPMENTS);
    setExceptions(INITIAL_EXCEPTIONS);
    setDecisionLogs(INITIAL_DECISION_LOGS);
    setFeedback(INITIAL_FEEDBACK);
    setReorders(INITIAL_REORDERS);
    setSelectedOrderId('10482');
    setCurrentView('command_center');
    setDemoState({ active: false, currentStep: 1, isAutoPlaying: false });
  };

  // AI Assistant Query
  const askAiAssistant = async (prompt: string) => {
    try {
      const response = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context: {
            activeOrdersCount: orders.length,
            pendingExceptions: exceptions.filter((e) => e.status === 'OPEN').length,
            criticalOrder: orders.find((o) => o.id === '10482'),
            sku421Stock: inventory.filter((i) => i.sku === 'SKU-421'),
            warehouses: warehouses.map((w) => ({ name: w.name, capacity: w.capacityUtilization })),
          },
        }),
      });
      const data = await response.json();
      return {
        answer: data.answer || 'Control tower intelligence query processed.',
        confidence: data.confidence || 95,
        recommendation: data.recommendation,
      };
    } catch (e) {
      return {
        answer: 'StockPilot intelligence is online. Order #10482 requires immediate partial allocation of 7 units of SKU-421 to avoid SLA breach.',
        confidence: 94,
        recommendation: { action: 'ALLOCATE_PARTIAL_FULFILLMENT', target: '#10482' },
      };
    }
  };

  return (
    <WarehouseContext.Provider
      value={{
        warehouses,
        products,
        inventory,
        orders,
        workers,
        pickTasks,
        packages,
        qualityChecks,
        shipments,
        exceptions,
        decisionLogs,
        feedback,
        reorders,
        activeWarehouseId,
        currentStrategy,
        currentView,
        selectedOrderId,
        presentationMode,
        demoState,
        isAiDrawerOpen,
        isNewOrderModalOpen,
        setActiveWarehouseId,
        setCurrentStrategy: handleStrategyChange,
        setCurrentView,
        setSelectedOrderId,
        setPresentationMode,
        setIsAiDrawerOpen,
        setIsNewOrderModalOpen,
        placeOrder,
        acceptRecommendation,
        overrideRecommendation,
        assignWorkerToPickTask,
        scanPickItem,
        reportMissingInPick,
        reportDamageInPick,
        resolveException,
        startPacking,
        completePacking,
        submitQualityCheck,
        dispatchOrder,
        advanceShipmentStage,
        submitCustomerFeedback,
        createReorder,
        runDemoStep,
        startDemo,
        nextDemoStep,
        prevDemoStep,
        stopDemo,
        toggleDemoAutoPlay,
        resetDemoData,
        askAiAssistant,
      }}
    >
      {children}
    </WarehouseContext.Provider>
  );
};

export const useWarehouse = () => {
  const context = useContext(WarehouseContext);
  if (!context) {
    throw new Error('useWarehouse must be used within a WarehouseProvider');
  }
  return context;
};
