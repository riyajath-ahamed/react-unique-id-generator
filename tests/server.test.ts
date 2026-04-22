import { createServerIdManager } from '../lib/server';

describe('createServerIdManager', () => {
  test('should generate sequential IDs starting from 1', () => {
    const manager = createServerIdManager();
    expect(manager.nextId()).toBe('1');
    expect(manager.nextId()).toBe('2');
    expect(manager.nextId()).toBe('3');
  });

  test('should apply prefix to IDs', () => {
    const manager = createServerIdManager({ prefix: 'ssr-' });
    expect(manager.nextId()).toBe('ssr-1');
    expect(manager.nextId()).toBe('ssr-2');
  });

  test('should apply suffix to IDs', () => {
    const manager = createServerIdManager({ suffix: '-id' });
    expect(manager.nextId()).toBe('1-id');
    expect(manager.nextId()).toBe('2-id');
  });

  test('should apply both prefix and suffix', () => {
    const manager = createServerIdManager({ prefix: 'app-', suffix: '-ssr' });
    expect(manager.nextId()).toBe('app-1-ssr');
    expect(manager.nextId()).toBe('app-2-ssr');
  });

  test('should allow local prefix to override configured prefix', () => {
    const manager = createServerIdManager({ prefix: 'default-' });
    expect(manager.nextId('custom-')).toBe('custom-1');
    expect(manager.nextId()).toBe('default-2');
  });

  test('should start from custom startId', () => {
    const manager = createServerIdManager({ startId: 100 });
    expect(manager.nextId()).toBe('101');
    expect(manager.nextId()).toBe('102');
  });

  test('should reset counter to 0', () => {
    const manager = createServerIdManager();
    manager.nextId();
    manager.nextId();
    expect(manager.getCurrentId()).toBe(2);

    manager.resetId();
    expect(manager.getCurrentId()).toBe(0);
    expect(manager.nextId()).toBe('1');
  });

  test('should return current counter value', () => {
    const manager = createServerIdManager();
    expect(manager.getCurrentId()).toBe(0);
    manager.nextId();
    expect(manager.getCurrentId()).toBe(1);
  });

  test('should set counter to specific value', () => {
    const manager = createServerIdManager();
    manager.setId(50);
    expect(manager.getCurrentId()).toBe(50);
    expect(manager.nextId()).toBe('51');
  });

  test('should clamp negative values to 0', () => {
    const manager = createServerIdManager();
    manager.setId(-10);
    expect(manager.getCurrentId()).toBe(0);
  });

  test('should floor decimal values', () => {
    const manager = createServerIdManager();
    manager.setId(5.9);
    expect(manager.getCurrentId()).toBe(5);
  });

  test('should isolate state between managers', () => {
    const manager1 = createServerIdManager({ prefix: 'req1-' });
    const manager2 = createServerIdManager({ prefix: 'req2-' });

    manager1.nextId();
    manager1.nextId();
    manager2.nextId();

    expect(manager1.getCurrentId()).toBe(2);
    expect(manager2.getCurrentId()).toBe(1);
    expect(manager1.nextId()).toBe('req1-3');
    expect(manager2.nextId()).toBe('req2-2');
  });

  test('should handle null local prefix by falling back to configured prefix', () => {
    const manager = createServerIdManager({ prefix: 'default-' });
    expect(manager.nextId(null)).toBe('default-1');
  });

  test('should handle undefined local prefix by falling back to configured prefix', () => {
    const manager = createServerIdManager({ prefix: 'default-' });
    expect(manager.nextId(undefined)).toBe('default-1');
  });
});
