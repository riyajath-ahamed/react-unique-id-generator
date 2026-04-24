import { generateSecureId } from '../lib/secure';

describe('generateSecureId', () => {
  test('should return a string', () => {
    const id = generateSecureId();
    expect(typeof id).toBe('string');
  });

  test('should return non-empty string', () => {
    const id = generateSecureId();
    expect(id.length).toBeGreaterThan(0);
  });

  test('should generate unique IDs', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      ids.add(generateSecureId());
    }
    expect(ids.size).toBe(1000);
  });

  test('should respect custom length when crypto.randomUUID is unavailable', () => {
    const originalRandomUUID = crypto.randomUUID;
    try {
      Object.defineProperty(crypto, 'randomUUID', { value: undefined, configurable: true });
      const id = generateSecureId(16);
      expect(id.length).toBe(16);
    } finally {
      Object.defineProperty(crypto, 'randomUUID', { value: originalRandomUUID, configurable: true });
    }
  });

  test('should only contain hex characters when not using randomUUID', () => {
    const originalRandomUUID = crypto.randomUUID;
    try {
      Object.defineProperty(crypto, 'randomUUID', { value: undefined, configurable: true });
      const id = generateSecureId(32);
      expect(id).toMatch(/^[0-9a-f]+$/);
    } finally {
      Object.defineProperty(crypto, 'randomUUID', { value: originalRandomUUID, configurable: true });
    }
  });

  test('should return UUID format when crypto.randomUUID is available', () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      const id = generateSecureId();
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    }
  });

  test('should generate different IDs on each call', () => {
    const id1 = generateSecureId();
    const id2 = generateSecureId();
    expect(id1).not.toBe(id2);
  });

  test('should work with default length parameter', () => {
    const id = generateSecureId();
    expect(id.length).toBeGreaterThan(0);
  });

  test('should fallback gracefully when crypto is unavailable', () => {
    const originalCrypto = globalThis.crypto;
    try {
      (globalThis as any).crypto = undefined;
      const id = generateSecureId(16);
      expect(typeof id).toBe('string');
      expect(id.length).toBe(16);
    } finally {
      (globalThis as any).crypto = originalCrypto;
    }
  });
});
