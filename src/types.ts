export type OrderStatus =
  | 'NEW'
  | 'VALIDATED'
  | 'PRIORITIZED'
  | 'ALLOCATED'
  | 'PICKING'
  | 'PARTIALLY_PICKED'
  | 'PACKING'
  | 'QC'
  | 'READY_TO_DISPATCH'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FEEDBACK_RECEIVED'
  | 'EXCEPTION'
  | 'CANCELLED';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'NORMAL';
export type CustomerType = 'REGULAR' | 'VIP' | 'ENTERPRISE';
export type ShippingMethod = 'STANDARD' | 'EXPRESS' | 'SAME_DAY';
export type OrderChannel =
  | 'Amazon'
  | 'Flipkart'
  | 'Blinkit'
  | 'Zepto'
  | 'Shopify'
  | 'B2B Portal'
  | 'Tata Neu'
  | 'Swiggy Instamart';

export type WorkerTier = 'TIER_1_HIGH' | 'TIER_2_MID' | 'TIER_3_JUNIOR';

export type AllocationStrategy =
  | 'PRIORITY_FIRST'
  | 'EARLIEST_DEADLINE'
  | 'MAXIMIZE_FULFILLED'
  | 'MINIMIZE_PARTIAL'
  | 'NEAREST_WAREHOUSE';

export interface OrderItem {
  sku: string;
  productName: string;
  quantityRequired: number;
  quantityAllocated: number;
  quantityPicked: number;
  quantityPacked: number;
  unitPrice: number;
}

export interface OrderStageLog {
  stage: OrderStatus;
  label: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  workerName?: string;
  notes?: string;
  completed: boolean;
}

export interface Order {
  id: string; // e.g. "10482"
  customerName: string;
  customerType: CustomerType;
  channel?: OrderChannel;
  customerPhone?: string;
  customerEmail?: string;
  items: OrderItem[];
  destinationCity: string;
  shippingMethod: ShippingMethod;
  placedAt: string;
  slaDeadline: string; // ISO or relative
  slaRemainingMinutes: number;
  priorityScore: number; // 0 - 100
  priorityLevel: PriorityLevel;
  priorityReasons: string[];
  status: OrderStatus;
  assignedWarehouseId: string;
  allocatedWarehouseName?: string;
  pickTaskId?: string;
  packageId?: string;
  shipmentId?: string;
  feedbackId?: string;
  exceptionId?: string;
  timeline: OrderStageLog[];
  totalAmount: number;
  isPartial: boolean;
  isOutOfStockVip?: boolean;
  stockDeficitUnits?: number;
  notes?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  type: 'PRIMARY_HUB' | 'FULFILLMENT_CENTER' | 'REGIONAL_DC';
  capacityUtilization: number; // %
  activeWorkers: number;
  activeOrders: number;
  avgDispatchHours: number;
  lat: number;
  lng: number;
  zones: string[];
}

export interface Product {
  sku: string;
  name: string;
  category: string;
  unitPrice: number;
  weightKg: number;
  minThreshold: number;
  reorderPoint: number;
  leadTimeDays: number;
  supplier: string;
}

export interface WarehouseInventory {
  warehouseId: string;
  sku: string;
  onHand: number;
  reserved: number;
  available: number;
  picking: number;
  packed: number;
  damaged: number;
  missing: number;
  quarantine: number;
  incoming: number;
  binLocation: string; // e.g. "A-03"
}

export interface PickItem {
  sku: string;
  productName: string;
  binLocation: string;
  quantityRequested: number;
  quantityScanned: number;
  status: 'PENDING' | 'SCANNED' | 'MISSING' | 'DAMAGED';
}

export interface PickTask {
  id: string; // e.g. "PT-8821"
  orderId: string;
  assignedWorkerId: string;
  assignedWorkerName: string;
  zone: string;
  items: PickItem[];
  progressPercent: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'EXCEPTION';
  estimatedWalkingMeters: number;
  optimizedWalkingMeters: number;
  efficiencyGainPercent: number;
  routeSequence: string[]; // ["START", "A-03", "A-12", "B-04", "C-07", "PACKING"]
  createdAt: string;
}

export interface Worker {
  id: string;
  name: string;
  role: 'PICKER' | 'PACKER' | 'QC_INSPECTOR' | 'DISPATCH_LEAD';
  workerTier: WorkerTier; // 'TIER_1_HIGH' | 'TIER_2_MID' | 'TIER_3_JUNIOR'
  tierLabel: string; // e.g. "Senior Specialist (High Class)", "Skilled Operator", "Junior Associate"
  status: 'IDLE' | 'PICKING' | 'PACKING' | 'QUALITY_CHECK' | 'ON_BREAK';
  currentTaskId?: string;
  stationOrZone: string;
  progressPercent: number;
  speedUnitsPerHour: number;
  efficiencyScore: number; // 0-100
  accuracyRate: number; // e.g. 99.4%
  errorRatePercent: number; // e.g. 0.2%
  certifications: string[]; // e.g. ["HazMat Certified", "Speed Lead", "Cold-Chain"]
  avatarColor: string;
}

export interface Package {
  id: string; // "PKG-4491"
  orderId: string;
  packageSize: 'SMALL_BOX' | 'MEDIUM_BOX' | 'LARGE_BOX' | 'ECO_CORRUGATED';
  weightKg: number;
  packagingMaterial: string;
  packerName: string;
  station: string;
  isPacked: boolean;
  packedAt?: string;
}

export interface QualityCheck {
  id: string; // "QC-882"
  orderId: string;
  inspectorName: string;
  station: string;
  checklist: {
    skuCorrect: boolean;
    quantityCorrect: boolean;
    packageSealed: boolean;
    labelAttached: boolean;
    addressVerified: boolean;
  };
  passed: boolean | null; // null = pending
  failedReason?: string;
  checkedAt?: string;
}

export type Carrier = 'BlueDart' | 'Delhivery' | 'DTDC' | 'XpressBees';

export type ShipmentStage =
  | 'WAREHOUSE'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'REGIONAL_HUB'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED';

export interface Shipment {
  id: string; // "SHP-7731"
  orderId: string;
  trackingNumber: string; // e.g. "BD-98234-IN"
  carrier: Carrier;
  originWarehouse: string;
  destinationCity: string;
  currentStage: ShipmentStage;
  dispatchedAt: string;
  estimatedDelivery: string;
  deliveredAt?: string;
  history: {
    stage: ShipmentStage;
    label: string;
    location: string;
    timestamp: string;
    completed: boolean;
  }[];
}

export interface ExceptionItem {
  id: string; // "EX-10482"
  orderId: string;
  sku: string;
  productName: string;
  type: 'MISSING_IN_BIN' | 'DAMAGED_ITEM' | 'QC_FAILED' | 'SLA_BREACH_RISK';
  expectedQuantity: number;
  foundQuantity: number;
  missingOrDamagedCount: number;
  detectedAtBin: string;
  detectedByWorker: string;
  status: 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'CANCELLED';
  alternativeStockFound?: {
    warehouseId: string;
    warehouseName: string;
    binLocation: string;
    availableQuantity: number;
    distanceKm: number;
    estimatedTransitHours: number;
  };
  recommendedResolution: string;
  resolvedAction?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface DecisionLog {
  id: string;
  decisionType:
    | 'ALLOCATE_STOCK'
    | 'PARTIAL_FULFILLMENT'
    | 'EXCEPTION_REALLOCATION'
    | 'PRIORITY_OVERRIDE'
    | 'REPLENISHMENT_ORDER'
    | 'CARRIER_SELECTION';
  orderId: string;
  action: string;
  reason: string;
  confidenceScore: number;
  alternativeOptions: {
    option: string;
    rejectedReason: string;
  }[];
  expectedImpact: string;
  timestamp: string;
  acceptedBy: 'AI_AUTO' | 'OPERATOR_OVERRIDE' | 'MANAGER_APPROVAL';
}

export interface FeedbackItem {
  id: string;
  orderId: string;
  customerName: string;
  rating: number; // 1 - 5
  tags: string[]; // e.g. "Fast delivery", "Good packaging", "Accurate order", "Damaged item"
  comments: string;
  submittedAt: string;
  impactOnAnalytics: string;
  actionableRecommendation?: string;
}

export interface ReorderRequest {
  id: string;
  sku: string;
  productName: string;
  warehouseId: string;
  warehouseName: string;
  quantityRequested: number;
  supplier: string;
  urgency: 'HIGH' | 'MEDIUM' | 'NORMAL';
  status: 'PENDING_APPROVAL' | 'ORDERED' | 'IN_TRANSIT' | 'RECEIVED';
  createdAt: string;
}

export interface SimulationScenario {
  id: string;
  title: string;
  description: string;
  skuTarget?: string;
  quantityDelta?: number;
  orderIdTarget?: string;
  priorityOverride?: PriorityLevel;
  beforeStats: {
    affectedOrders: number;
    ordersAtRisk: number;
    partialShipments: number;
    avgFulfillmentHours: number;
    stockoutRiskPercent: number;
  };
  afterStats: {
    affectedOrders: number;
    ordersAtRisk: number;
    partialShipments: number;
    avgFulfillmentHours: number;
    stockoutRiskPercent: number;
  };
  impactSummary: string;
}

export interface DemoStep {
  stepNumber: number; // 1 to 15
  title: string;
  tagline: string;
  description: string;
  activeView: string;
  highlightedOrderId?: string;
  targetActionLabel?: string;
  aiExplanation: string;
  impactMetrics: {
    label: string;
    value: string;
  }[];
}
