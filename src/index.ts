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

import type { Optional, BaseResponse } from '@sudobility/types';

// =============================================================================
// Enums
// =============================================================================

export type InstallationType = 'TRIGGER' | 'FIXED' | 'VARIABLE';

export type OrderStatus =
  | 'CREATED'
  | 'PAID'
  | 'AUTHORIZED'
  | 'RUNNING'
  | 'DONE'
  | 'FAILED';

export type DeviceStatus = 'ACTIVE' | 'OFFLINE' | 'MAINTENANCE' | 'DEACTIVATED';

export type UserRole = 'vendor' | 'buyer';

export type LogDirection = 'PI_TO_SRV' | 'SRV_TO_PI';

export type VendorModelType = 'Washer' | 'Dryer' | 'Parking' | 'Locker' | 'Vending';

export type VendorModelPricing = 'fixed' | 'variable';

export type VendorModelAction = 'timed' | 'sequence';

export type VendorModelInterruption = 'stop' | 'continue';

export type VendorModelPayment = 'atStart' | 'atEnd';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface DailySchedule {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

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

export interface Device {
  walletAddress: string;
  entityId: string;
  label: string;
  model: string | null;
  location: string | null;
  gpioConfig: GpioConfig | null;
  status: DeviceStatus;
  serverWalletAddress: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface GpioConfig {
  pin: number;
  activeLow?: boolean;
}

export interface Installation {
  id: string;
  entityId: string;
  name: string;
  description: string | null;
  type: InstallationType;
  priceCents: number;
  fixedMinutes: number | null;
  minutesPer25c: number | null;
  active: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface DeviceInstallation {
  deviceWalletAddress: string;
  installationId: string;
}

export interface Order {
  id: string;
  deviceWalletAddress: string;
  installationId: string;
  buyerUid: string | null;
  amountCents: number;
  authorizedSeconds: number;
  status: OrderStatus;
  stripePaymentIntentId: string | null;
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
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface VendorModel {
  id: string;
  entityId: string;
  name: string;
  type: VendorModelType | null;
  pricing: VendorModelPricing | null;
  action: VendorModelAction | null;
  interruption: VendorModelInterruption | null;
  payment: VendorModelPayment | null;
  schedule: DailySchedule[] | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface VendorInstallation {
  id: string;
  vendorLocationId: string;
  vendorModelId: string;
  name: string;
  price: string;
  currencyCode: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface VendorInstallationControl {
  id: string;
  vendorInstallationId: string;
  pinNumber: number;
  duration: number;
}

export interface VendorEquipment {
  walletAddress: string;
  vendorInstallationId: string;
  name: string;
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
  installationId: string;
  amountCents: number;
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
// Request Types — Vendor Endpoints
// =============================================================================

/** Register a new device */
export interface DeviceCreateRequest {
  walletAddress: string;
  label: string;
  model: Optional<string>;
  location: Optional<string>;
  gpioConfig: Optional<GpioConfig>;
}

/** Update an existing device */
export interface DeviceUpdateRequest {
  label: Optional<string>;
  model: Optional<string>;
  location: Optional<string>;
  gpioConfig: Optional<GpioConfig>;
  status: Optional<DeviceStatus>;
}

/** Create a new installation */
export interface InstallationCreateRequest {
  name: string;
  description: Optional<string>;
  type: InstallationType;
  priceCents: number;
  fixedMinutes: Optional<number>;
  minutesPer25c: Optional<number>;
}

/** Update an existing installation */
export interface InstallationUpdateRequest {
  name: Optional<string>;
  description: Optional<string>;
  type: Optional<InstallationType>;
  priceCents: Optional<number>;
  fixedMinutes: Optional<number>;
  minutesPer25c: Optional<number>;
  active: Optional<boolean>;
}

/** Assign installations to a device */
export interface DeviceInstallationAssignRequest {
  installationIds: string[];
}

/** Generate QR code for a device */
export interface QrGenerateRequest {
  deviceWalletAddress: string;
  format?: 'svg' | 'png';
  size?: number;
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
  action?: VendorModelAction;
  interruption?: VendorModelInterruption;
  payment?: VendorModelPayment;
  schedule?: DailySchedule[];
}

export interface VendorModelUpdateRequest {
  name?: string;
  type?: VendorModelType;
  pricing?: VendorModelPricing;
  action?: VendorModelAction;
  interruption?: VendorModelInterruption;
  payment?: VendorModelPayment;
  schedule?: DailySchedule[] | null;
}

export interface VendorInstallationCreateRequest {
  vendorLocationId: string;
  vendorModelId: string;
  name: string;
  price: string;
  currencyCode?: string;
}

export interface VendorInstallationUpdateRequest {
  vendorLocationId?: string;
  vendorModelId?: string;
  name?: string;
  price?: string;
  currencyCode?: string;
}

export interface VendorInstallationControlCreateRequest {
  vendorInstallationId: string;
  pinNumber: number;
  duration: number;
}

export interface VendorInstallationControlUpdateRequest {
  pinNumber?: number;
  duration?: number;
}

export interface VendorEquipmentCreateRequest {
  walletAddress: string;
  vendorInstallationId: string;
  name: string;
}

export interface VendorEquipmentUpdateRequest {
  name?: string;
  vendorInstallationId?: string;
}

// =============================================================================
// Response Types — Buyer
// =============================================================================

/** Response after verifying device signature */
export interface DeviceVerifyResponse {
  device: Device;
  installations: Installation[];
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

/** Device status distribution */
export interface DeviceStatusData {
  status: DeviceStatus;
  count: number;
}

/** Device with summary info */
export interface DeviceSummary extends Device {
  serviceCount: number;
  totalOrders: number;
  lastOrderAt: Date | null;
}

/** Order with joined details */
export interface OrderDetailed extends Order {
  deviceLabel: string;
  installationName: string;
  installationType: InstallationType;
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

export interface DeviceQueryParams {
  status?: DeviceStatus;
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
  installationType: InstallationType;
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

// Device responses
export type DeviceListResponse = BaseResponse<Device[]>;
export type DeviceSummaryListResponse = BaseResponse<DeviceSummary[]>;
export type DeviceResponse = BaseResponse<Device>;
export type DeviceVerifyApiResponse = BaseResponse<DeviceVerifyResponse>;

// Installation responses
export type InstallationListResponse = BaseResponse<Installation[]>;
export type InstallationResponse = BaseResponse<Installation>;

// Order responses
export type OrderListResponse = BaseResponse<Order[]>;
export type OrderDetailedListResponse = BaseResponse<OrderDetailed[]>;
export type OrderResponse = BaseResponse<Order>;

// Authorization responses
export type AuthorizationApiResponse = BaseResponse<AuthorizationResponse>;

// Dashboard responses
export type DashboardStatsResponse = BaseResponse<DashboardStats>;
export type OrdersChartResponse = BaseResponse<OrdersChartData[]>;
export type DeviceStatusResponse = BaseResponse<DeviceStatusData[]>;

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
export type VendorInstallationListResponse = BaseResponse<VendorInstallation[]>;
export type VendorInstallationResponse = BaseResponse<VendorInstallation>;
export type VendorInstallationControlListResponse = BaseResponse<VendorInstallationControl[]>;
export type VendorInstallationControlResponse = BaseResponse<VendorInstallationControl>;
export type VendorEquipmentListResponse = BaseResponse<VendorEquipment[]>;
export type VendorEquipmentResponse = BaseResponse<VendorEquipment>;

// Health check
export interface HealthCheckData {
  name: string;
  version: string;
  status: string;
}
export type HealthCheckResponse = BaseResponse<HealthCheckData>;
