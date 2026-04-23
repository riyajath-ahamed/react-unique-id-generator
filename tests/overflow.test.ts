import nextId, {
  resetId,
  setId,
  generateId,
  OVERFLOW_THRESHOLD
} from '../lib/nextId';

describe('ID counter overflow protection', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    resetId();
    warnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  test('should export OVERFLOW_THRESHOLD as 1,000,000', () => {
    expect(OVERFLOW_THRESHOLD).toBe(1_000_000);
  });

  test('should warn when nextId counter exceeds threshold', () => {
    setId(OVERFLOW_THRESHOLD - 1);
    nextId();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('ID counter has exceeded')
    );
  });

  test('should warn when generateId counter exceeds threshold', () => {
    setId(OVERFLOW_THRESHOLD - 1);
    generateId();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('ID counter has exceeded')
    );
  });

  test('should only warn once', () => {
    setId(OVERFLOW_THRESHOLD - 1);
    nextId();
    nextId();
    nextId();
    const overflowWarnings = warnSpy.mock.calls.filter(
      (call: unknown[]) => typeof call[0] === 'string' && call[0].includes('exceeded')
    );
    expect(overflowWarnings.length).toBe(1);
  });

  test('should warn again after reset', () => {
    setId(OVERFLOW_THRESHOLD - 1);
    nextId();
    expect(warnSpy).toHaveBeenCalledTimes(1);

    resetId();
    warnSpy.mockClear();

    setId(OVERFLOW_THRESHOLD - 1);
    nextId();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('ID counter has exceeded')
    );
  });

  test('should not warn below threshold', () => {
    for (let i = 0; i < 100; i++) {
      nextId();
    }
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('should still generate valid IDs past threshold', () => {
    setId(OVERFLOW_THRESHOLD - 1);
    const id = nextId('prefix-');
    expect(id).toBe(`prefix-${OVERFLOW_THRESHOLD}`);
  });
});
