import nextId, {
  resetId,
  setGlobalPrefix,
  setGlobalSuffix,
  setId
} from '../lib/nextId';

describe('Input validation warnings', () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    resetId();
    setGlobalPrefix('');
    setGlobalSuffix('');
    warnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  test('should warn when nextId receives a non-string prefix', () => {
    nextId(123 as any);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('nextId() expected a string prefix')
    );
  });

  test('should not warn when nextId receives a valid string prefix', () => {
    nextId('valid-');
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('should not warn when nextId receives null or undefined', () => {
    nextId(null);
    nextId(undefined);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('should warn when setGlobalPrefix receives a non-string', () => {
    setGlobalPrefix(42 as any);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('setGlobalPrefix() expected a string')
    );
  });

  test('should warn when setGlobalSuffix receives a non-string', () => {
    setGlobalSuffix(true as any);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('setGlobalSuffix() expected a string')
    );
  });

  test('should warn when setId receives a non-number', () => {
    setId('five' as any);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('setId() expected a number')
    );
  });

  test('should warn when setId receives NaN', () => {
    setId(NaN);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('setId() expected a number')
    );
  });

  test('should not warn for valid setId calls', () => {
    setId(5);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  test('should still produce output even with invalid input', () => {
    const id = nextId(123 as any);
    expect(id).toBeTruthy();
    expect(typeof id).toBe('string');
  });
});
