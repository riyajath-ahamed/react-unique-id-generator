import { checkOverflow, OVERFLOW_THRESHOLD, isDev } from '../../lib/core/overflow';

describe('core/overflow', () => {
  describe('OVERFLOW_THRESHOLD', () => {
    it('should be 1,000,000', () => {
      expect(OVERFLOW_THRESHOLD).toBe(1_000_000);
    });
  });

  describe('isDev', () => {
    it('should be a boolean', () => {
      expect(typeof isDev).toBe('boolean');
    });
  });

  describe('checkOverflow', () => {
    let warnSpy: jest.SpyInstance;

    beforeEach(() => {
      warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      warnSpy.mockRestore();
    });

    it('should not warn below threshold', () => {
      const flags: Record<string, boolean> = {};
      checkOverflow(999_999, 'test', flags);
      expect(warnSpy).not.toHaveBeenCalled();
      expect(flags.test).toBeUndefined();
    });

    it('should warn at threshold', () => {
      const flags: Record<string, boolean> = {};
      checkOverflow(1_000_000, 'test', flags);
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('test counter has exceeded')
      );
      expect(flags.test).toBe(true);
    });

    it('should warn only once per label', () => {
      const flags: Record<string, boolean> = {};
      checkOverflow(1_000_000, 'test', flags);
      checkOverflow(1_000_001, 'test', flags);
      checkOverflow(2_000_000, 'test', flags);
      expect(warnSpy).toHaveBeenCalledTimes(1);
    });

    it('should track separate labels independently', () => {
      const flags: Record<string, boolean> = {};
      checkOverflow(1_000_000, 'automation', flags);
      checkOverflow(1_000_000, 'strategy', flags);
      expect(warnSpy).toHaveBeenCalledTimes(2);
      expect(flags.automation).toBe(true);
      expect(flags.strategy).toBe(true);
    });

    it('should include the label in the warning message', () => {
      const flags: Record<string, boolean> = {};
      checkOverflow(1_000_000, 'myCounter', flags);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('myCounter')
      );
    });

    it('should allow re-warning after flag is reset', () => {
      const flags: Record<string, boolean> = {};
      checkOverflow(1_000_000, 'test', flags);
      expect(warnSpy).toHaveBeenCalledTimes(1);

      flags.test = false;
      checkOverflow(1_000_000, 'test', flags);
      expect(warnSpy).toHaveBeenCalledTimes(2);
    });
  });
});
