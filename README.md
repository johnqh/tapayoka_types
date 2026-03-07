# @sudobility/tapayoka_types

Shared TypeScript type definitions for the Tapayoka QR-to-device cashless payment system.

## Installation

```bash
bun add @sudobility/tapayoka_types
```

## Usage

```typescript
import type {
  Device, Service, Order, Authorization,
  ServiceType, OrderStatus, DeviceStatus,
  BleDeviceChallenge, AuthorizationPayload,
} from '@sudobility/tapayoka_types';
```

## Types

- **Enums**: `ServiceType` (TRIGGER/FIXED/VARIABLE), `OrderStatus`, `DeviceStatus`, `UserRole`, `LogDirection`
- **Domain Models**: `Device` (keyed by ETH wallet address), `Service`, `Order`, `Authorization`
- **BLE Protocol**: `BleDeviceChallenge`, `AuthorizationPayload`, `BleCommand`, `BleDeviceResponse`, UUID constants
- **Request/Response**: Buyer (verify, order, pay, authorize) and Vendor (device/service CRUD, QR, dashboard stats) types

## Development

```bash
bun run build        # ESM + CJS dual build
bun run test         # Run Vitest
bun run typecheck    # TypeScript check
bun run lint         # ESLint
bun run verify       # Typecheck + lint + build
```

## Related Packages

- `@sudobility/tapayoka_client` -- React hooks for Tapayoka API
- `@sudobility/tapayoka_lib` -- Business logic with Zustand stores
- `tapayoka_api` -- Backend API server
- `tapayoka_buyer_app_rn` / `tapayoka_vendor_app` -- Consumer apps

## License

BUSL-1.1
