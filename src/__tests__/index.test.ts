import { describe, it, expect } from 'vitest';
import {
  successResponse,
  errorResponse,
  BLE_SERVICE_UUID,
  BLE_CHAR_DEVICE_INFO_UUID,
  BLE_CHAR_COMMAND_UUID,
  BLE_CHAR_RESPONSE_UUID,
  BLE_DEVICE_NAME_PREFIX,
} from '../index';

describe('successResponse', () => {
  it('returns a success response with data', () => {
    const res = successResponse({ foo: 'bar' });
    expect(res.success).toBe(true);
    expect(res.data).toEqual({ foo: 'bar' });
    expect(res.timestamp).toBeDefined();
    expect(res.error).toBeUndefined();
  });

  it('includes ISO timestamp', () => {
    const before = new Date().toISOString();
    const res = successResponse(null);
    const after = new Date().toISOString();
    expect(res.timestamp >= before).toBe(true);
    expect(res.timestamp <= after).toBe(true);
  });
});

describe('errorResponse', () => {
  it('returns an error response', () => {
    const res = errorResponse('Something went wrong');
    expect(res.success).toBe(false);
    expect(res.error).toBe('Something went wrong');
    expect(res.timestamp).toBeDefined();
  });
});

describe('BLE constants', () => {
  it('exports correct service UUID', () => {
    expect(BLE_SERVICE_UUID).toBe('000088F4-0000-1000-8000-00805f9b34fb');
  });

  it('exports correct characteristic UUIDs', () => {
    expect(BLE_CHAR_DEVICE_INFO_UUID).toBe(
      '00000E32-0000-1000-8000-00805f9b34fb'
    );
    expect(BLE_CHAR_COMMAND_UUID).toBe('00000E33-0000-1000-8000-00805f9b34fb');
    expect(BLE_CHAR_RESPONSE_UUID).toBe('00000E34-0000-1000-8000-00805f9b34fb');
  });

  it('exports device name prefix', () => {
    expect(BLE_DEVICE_NAME_PREFIX).toBe('tapayoka-');
  });
});
