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

export type ServiceType = 'TRIGGER' | 'FIXED' | 'VARIABLE';

export type OrderStatus =
  | 'CREATED'
  | 'PAID'
  | 'AUTHORIZED'
  | 'RUNNING'
  | 'DONE'
  | 'FAILED';

export type DeviceStatus =
  | 'ACTIVE'
  | 'OFFLINE'
  | 'MAINTENANCE'
  | 'DEACTIVATED';

export type UserRole = 'vendor' | 'buyer';

export type LogDirection = 'PI_TO_SRV' | 'SRV_TO_PI';

// =============================================================================
// Domain Models (database entities)
// =============================================================================

export interface User {
  id: string;
  firebaseUid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  createdAt: Date | null;
  updatedAt: Date | null;
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

export interface Service {
  id: string;
  entityId: string;
  name: string;
  description: string | null;
  type: ServiceType;
  priceCents: number;
  fixedMinutes: number | null;
  minutesPer25c: number | null;
  active: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface DeviceService {
  deviceWalletAddress: string;
  serviceId: string;
}

export interface Order {
  id: string;
  deviceWalletAddress: string;
  serviceId: string;
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
  serviceId: string;
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

/** Create a new service/product */
export interface ServiceCreateRequest {
  name: string;
  description: Optional<string>;
  type: ServiceType;
  priceCents: number;
  fixedMinutes: Optional<number>;
  minutesPer25c: Optional<number>;
}

/** Update an existing service */
export interface ServiceUpdateRequest {
  name: Optional<string>;
  description: Optional<string>;
  type: Optional<ServiceType>;
  priceCents: Optional<number>;
  fixedMinutes: Optional<number>;
  minutesPer25c: Optional<number>;
  active: Optional<boolean>;
}

/** Assign services to a device */
export interface DeviceServiceAssignRequest {
  serviceIds: string[];
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

/** Response after verifying device signature */
export interface DeviceVerifyResponse {
  device: Device;
  services: Service[];
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
  serviceName: string;
  serviceType: ServiceType;
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
  serviceType: ServiceType;
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
export const BLE_CHAR_DEVICE_INFO_UUID =
  '00000E32-0000-1000-8000-00805f9b34fb';
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

// Service responses
export type ServiceListResponse = BaseResponse<Service[]>;
export type ServiceResponse = BaseResponse<Service>;

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

// Health check
export interface HealthCheckData {
  name: string;
  version: string;
  status: string;
}
export type HealthCheckResponse = BaseResponse<HealthCheckData>;
