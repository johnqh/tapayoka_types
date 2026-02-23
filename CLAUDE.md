# tapayoka_types

Shared TypeScript type definitions for the Tapayoka QR-to-device cashless payment system.

## Package Info

- **NPM**: `@sudobility/tapayoka_types` (public)
- **Dual build**: ESM (`dist/index.js`) + CJS (`dist/index.cjs`)
- **Peer dep**: `@sudobility/types` (re-exports BaseResponse, NetworkClient, etc.)

## Type Categories

### Enums
- `ServiceType`: TRIGGER | FIXED | VARIABLE
- `OrderStatus`: CREATED | PAID | AUTHORIZED | RUNNING | DONE | FAILED
- `DeviceStatus`: ACTIVE | OFFLINE | MAINTENANCE | DEACTIVATED
- `UserRole`: vendor | buyer
- `LogDirection`: PI_TO_SRV | SRV_TO_PI

### Domain Models
- `Device` — keyed by `walletAddress` (Ethereum address)
- `Service` — pricing with type-specific fields
- `Order` — links device + service + buyer + payment
- `Authorization` — signed payload for device activation

### BLE Protocol
- `BleDeviceChallenge` — device signs to prove identity
- `AuthorizationPayload` — server signs for device activation
- `BleCommand` / `BleDeviceResponse` — BLE GATT communication
- UUID constants for BLE service/characteristics

### Request/Response Types
- Buyer: DeviceVerify, CreateOrder, ProcessPayment, CreateAuthorization
- Vendor: DeviceCRUD, ServiceCRUD, DeviceServiceAssign, QrGenerate
- Dashboard: Stats, OrdersChart, DeviceStatus

## Commands

```bash
bun run typecheck    # Type check without emit
bun run lint         # ESLint
bun run build        # ESM + CJS dual build
bun run verify       # typecheck + lint + build
bun run test         # Vitest
```

## Pre-commit

Run `bun run verify` before committing.

## Local Development

```bash
bun install
bun link
# In consuming projects:
bun link @sudobility/tapayoka_types
```
