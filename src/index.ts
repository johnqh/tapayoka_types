/**
 * @sudobility/tapayoka_types
 * TypeScript types for Tapayoka - QR-to-device cashless payment system
 */

// Re-export common types from @sudobility/types
export type {
  ApiResponse,
  BaseResponse,
  NetworkClient,
  Optional,
  PaginatedResponse,
  PaginationInfo,
  PaginationOptions,
} from '@sudobility/types';

import type { BaseResponse } from '@sudobility/types';

// =============================================================================
// Enums
// =============================================================================

export type OfferingType = 'TRIGGER' | 'FIXED' | 'TIMED';

export type OrderStatus =
  | 'CREATED'
  | 'PAID'
  | 'AUTHORIZED'
  | 'RUNNING'
  | 'DONE'
  | 'FAILED';

export type UserRole = 'vendor' | 'buyer';

export type LogDirection = 'PI_TO_SRV' | 'SRV_TO_PI';

export type VendorModelType =
  | 'Washer'
  | 'Dryer'
  | 'Parking'
  | 'Locker'
  | 'Vending';

export type VendorModelPricing = 'fixed' | 'variable';

export type VendorModelAction = 'timed' | 'sequence';

export type VendorModelInterruption = 'stop' | 'continue';

export type VendorModelPayment = 'atStart' | 'atEnd';

export type VendorModelSlot = 'single' | 'multi1D' | 'multi2D';

export type VendorModelSlotPricing = 'Tiered' | 'Unique';

export type VendorEntityStatus = 'Active' | 'Inactive' | 'Deleted';

export type DurationUnit = 'minutes' | 'hours';

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface DailySchedule {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

// =============================================================================
// Pricing Types
// =============================================================================

export interface OfferingSignal {
  pinNumber: number;
  duration: number;
}

export interface TimedPricingTier {
  type: 'timed';
  id: string;
  name: string;
  currencyCode: string;
  startPrice: string;
  startDuration: number;
  startDurationUnit: DurationUnit;
  marginalPrice: string;
  marginalDuration: number;
  marginalDurationUnit: DurationUnit;
  pinNumber: number;
}

export interface FixedPricingTier {
  type: 'fixed';
  id: string;
  name: string;
  currencyCode: string;
  price: string;
  signals: OfferingSignal[];
}

export type PricingTier = TimedPricingTier | FixedPricingTier;

// =============================================================================
// Domain Models (database entities)
// =============================================================================

export interface User {
  id: string;
  firebaseUid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  tosAcceptedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface UserProfile {
  id: string;
  firebaseUid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  tosAcceptedAt: string | null;
}

export interface Order {
  id: string;
  deviceWalletAddress: string;
  offeringId: string | null;
  pricingTierId: string | null;
  buyerUid: string | null;
  amountCents: number;
  authorizedSeconds: number;
  status: OrderStatus;
  stripePaymentIntentId: string | null;
  slotId: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface Authorization {
  id: string;
  orderId: string;
  payloadJson: string;
  serverSignature: string;
  expiresAt: Date;
  createdAt: Date | null;
}

export interface DeviceLog {
  id: string;
  deviceWalletAddress: string;
  direction: LogDirection;
  ok: boolean;
  details: string | null;
  createdAt: Date | null;
}

export interface AdminLog {
  id: string;
  userId: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  details: string | null;
  createdAt: Date | null;
}

// =============================================================================
// Domain Models — Vendor Management
// =============================================================================

export interface VendorLocation {
  id: string;
  entityId: string;
  name: string;
  address: string;
  city: string;
  stateProvince: string;
  zipcode: string;
  country: string;
  status: VendorEntityStatus;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface VendorModel {
  id: string;
  entityId: string;
  name: string;
  type: VendorModelType | null;
  pricing: VendorModelPricing | null;
  slot: VendorModelSlot | null;
  slotPricing: VendorModelSlotPricing | null;
  action: VendorModelAction | null;
  interruption: VendorModelInterruption | null;
  payment: VendorModelPayment | null;
  status: VendorEntityStatus;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface VendorOffering {
  id: string;
  vendorLocationId: string;
  vendorModelId: string;
  name: string;
  pricingTiers: PricingTier[];
  schedule: DailySchedule[] | null;
  status: VendorEntityStatus;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface VendorInstallation {
  walletAddress: string;
  vendorOfferingId: string;
  label: string;
  status: VendorEntityStatus;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface VendorInstallationSlot {
  id: string;
  installationWalletAddress: string;
  label: string;
  row: string | null;
  column: string | null;
  sortOrder: number;
  pricingTierId: string | null;
  pricingTier: PricingTier | null;
  status: VendorEntityStatus;
  available?: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// =============================================================================
// Request Types — Buyer Endpoints
// =============================================================================

/** Buyer sends device signature to server for verification */
export interface DeviceVerifyRequest {
  deviceWalletAddress: string;
  signedPayload: string;
  signature: string;
}

/** Create a new order */
export interface CreateOrderRequest {
  deviceWalletAddress: string;
  pricingTierId: string;
  amountCents: number;
  slotId?: string;
}

/** Process payment for an order */
export interface ProcessPaymentRequest {
  orderId: string;
  paymentMethodId: string;
}

/** Request authorization after payment */
export interface CreateAuthorizationRequest {
  orderId: string;
}

/** Report telemetry event from device */
export interface TelemetryEventRequest {
  deviceWalletAddress: string;
  direction: LogDirection;
  ok: boolean;
  details?: string;
}

// =============================================================================
// Request Types — Vendor Management
// =============================================================================

export interface VendorLocationCreateRequest {
  name: string;
  address: string;
  city: string;
  stateProvince: string;
  zipcode: string;
  country: string;
}

export interface VendorLocationUpdateRequest {
  name?: string;
  address?: string;
  city?: string;
  stateProvince?: string;
  zipcode?: string;
  country?: string;
}

export interface VendorModelCreateRequest {
  name: string;
  type?: VendorModelType;
  pricing?: VendorModelPricing;
  slot?: VendorModelSlot;
  slotPricing?: VendorModelSlotPricing;
  action?: VendorModelAction;
  interruption?: VendorModelInterruption;
  payment?: VendorModelPayment;
}

export interface VendorModelUpdateRequest {
  name?: string;
  type?: VendorModelType;
  pricing?: VendorModelPricing;
  slot?: VendorModelSlot;
  slotPricing?: VendorModelSlotPricing;
  action?: VendorModelAction;
  interruption?: VendorModelInterruption;
  payment?: VendorModelPayment;
}

export interface VendorOfferingCreateRequest {
  vendorLocationId: string;
  vendorModelId: string;
  name: string;
  pricingTiers: PricingTier[];
  schedule?: DailySchedule[];
}

export interface VendorOfferingUpdateRequest {
  vendorLocationId?: string;
  vendorModelId?: string;
  name?: string;
  pricingTiers?: PricingTier[];
  schedule?: DailySchedule[] | null;
}

export interface VendorInstallationCreateRequest {
  walletAddress: string;
  vendorOfferingId: string;
  label: string;
}

export interface VendorInstallationUpdateRequest {
  label?: string;
  vendorOfferingId?: string;
}

export interface VendorInstallationSlotCreateRequest {
  label: string;
  row?: string;
  column?: string;
  sortOrder?: number;
  pricingTierId?: string;
  pricingTier?: PricingTier;
}

export interface VendorInstallationSlotUpdateRequest {
  label?: string;
  row?: string | null;
  column?: string | null;
  sortOrder?: number;
  pricingTierId?: string | null;
  pricingTier?: PricingTier | null;
}

export interface VendorInstallationSlotBulkCreateRequest {
  rows: string[];
  columns: string[];
}

/** Generate QR code for a device */
export interface QrGenerateRequest {
  deviceWalletAddress: string;
  format?: 'svg' | 'png';
  size?: number;
}

// =============================================================================
// Response Types — Buyer
// =============================================================================

/** Combined response after verifying device signature */
export interface BuyerVerifyResponse {
  model: {
    name: string;
    slot: VendorModelSlot | null;
    pricing: VendorModelPricing | null;
    slotPricing: VendorModelSlotPricing | null;
    action: VendorModelAction | null;
    interruption: VendorModelInterruption | null;
    payment: VendorModelPayment | null;
  };
  installation: {
    name: string;
  };
  operating: boolean;
  operatingPeriod: {
    start: string;
    end: string;
  } | null;
  slots: Array<{
    id: string;
    label: string;
    row: string | null;
    column: string | null;
    sortOrder: number;
    pricingTier: PricingTier | null;
    available: boolean;
  }>;
}

/** Response with signed authorization */
export interface AuthorizationResponse {
  authorization: Authorization;
  payload: AuthorizationPayload;
  serverSignature: string;
}

// =============================================================================
// Response Types — Vendor
// =============================================================================

/** Dashboard stats overview */
export interface DashboardStats {
  totalDevices: number;
  activeDevices: number;
  totalOrders: number;
  activeOrders: number;
  revenueTodayCents: number;
  revenueThisWeekCents: number;
  successRate: number;
}

/** Orders chart data point */
export interface OrdersChartData {
  date: string;
  count: number;
  revenueCents: number;
}

/** Order with joined details */
export interface OrderDetailed extends Order {
  deviceLabel: string;
  offeringName: string;
  offeringType: OfferingType;
}

/** QR code generation response */
export interface QrCodeResponse {
  deviceWalletAddress: string;
  qrData: string;
  format: 'svg' | 'png';
}

// =============================================================================
// Query Parameter Types
// =============================================================================

export interface OrderQueryParams {
  status?: OrderStatus;
  deviceWalletAddress?: string;
  limit?: number;
  offset?: number;
}

export interface LogQueryParams {
  deviceWalletAddress?: string;
  direction?: LogDirection;
  limit?: number;
  offset?: number;
}

// =============================================================================
// BLE Protocol Types
// =============================================================================

/** Challenge payload device signs to prove identity */
export interface BleDeviceChallenge {
  walletAddress: string;
  timestamp: number;
  nonce: string;
}

/** Authorization payload sent to device via BLE */
export interface AuthorizationPayload {
  orderId: string;
  offeringType: OfferingType;
  seconds: number;
  nonce: string;
  exp: number;
}

/** BLE command sent from buyer app to device */
export interface BleCommand {
  command: 'SETUP_SERVER' | 'AUTHORIZE' | 'ON' | 'OFF' | 'STATUS';
  payload?: string;
  signature?: string;
}

/** BLE response from device */
export interface BleDeviceResponse {
  status: 'OK' | 'ERROR' | 'BUSY' | 'UNAUTHORIZED';
  message?: string;
  data?: string;
}

/** Device info read from BLE characteristic */
export interface BleDeviceInfo {
  walletAddress: string;
  firmwareVersion: string;
  hasServerWallet: boolean;
}

// =============================================================================
// BLE Service UUIDs
// =============================================================================

export const BLE_SERVICE_UUID = '000088F4-0000-1000-8000-00805f9b34fb';
export const BLE_CHAR_DEVICE_INFO_UUID = '00000E32-0000-1000-8000-00805f9b34fb';
export const BLE_CHAR_COMMAND_UUID = '00000E33-0000-1000-8000-00805f9b34fb';
export const BLE_CHAR_RESPONSE_UUID = '00000E34-0000-1000-8000-00805f9b34fb';
export const BLE_DEVICE_NAME_PREFIX = 'tapayoka-';

// =============================================================================
// Ethereum / Crypto Types
// =============================================================================

/** Signed message with Ethereum wallet */
export interface EthSignedMessage {
  message: string;
  signature: string;
  address: string;
}

// =============================================================================
// Response Helper Functions
// =============================================================================

/** Create a success response */
export function successResponse<T>(data: T): BaseResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

/** Create an error response */
export function errorResponse(error: string): BaseResponse<never> {
  return {
    success: false,
    error,
    timestamp: new Date().toISOString(),
  };
}

// =============================================================================
// API Response Type Aliases
// =============================================================================

// Buyer responses
export type BuyerVerifyApiResponse = BaseResponse<BuyerVerifyResponse>;

// Order responses
export type OrderListResponse = BaseResponse<Order[]>;
export type OrderDetailedListResponse = BaseResponse<OrderDetailed[]>;
export type OrderResponse = BaseResponse<Order>;

// Authorization responses
export type AuthorizationApiResponse = BaseResponse<AuthorizationResponse>;

// Dashboard responses
export type DashboardStatsResponse = BaseResponse<DashboardStats>;
export type OrdersChartResponse = BaseResponse<OrdersChartData[]>;

// QR responses
export type QrCodeApiResponse = BaseResponse<QrCodeResponse>;

// Log responses
export type DeviceLogListResponse = BaseResponse<DeviceLog[]>;
export type AdminLogListResponse = BaseResponse<AdminLog[]>;

// Vendor management responses
export type VendorLocationListResponse = BaseResponse<VendorLocation[]>;
export type VendorLocationResponse = BaseResponse<VendorLocation>;
export type VendorModelListResponse = BaseResponse<VendorModel[]>;
export type VendorModelResponse = BaseResponse<VendorModel>;
export type VendorOfferingListResponse = BaseResponse<VendorOffering[]>;
export type VendorOfferingResponse = BaseResponse<VendorOffering>;
export type VendorInstallationListResponse = BaseResponse<VendorInstallation[]>;
export type VendorInstallationResponse = BaseResponse<VendorInstallation>;
export type VendorInstallationSlotListResponse = BaseResponse<
  VendorInstallationSlot[]
>;
export type VendorInstallationSlotResponse =
  BaseResponse<VendorInstallationSlot>;

// Health check
export interface HealthCheckData {
  name: string;
  version: string;
  status: string;
}
export type HealthCheckResponse = BaseResponse<HealthCheckData>;
