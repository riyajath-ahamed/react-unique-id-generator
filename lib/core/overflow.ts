export const OVERFLOW_THRESHOLD = 1_000_000;

export const isDev =
  typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production';

export function checkOverflow(
  counter: number,
  label: string,
  warnedFlags: Record<string, boolean>,
): void {
  if (isDev && counter >= OVERFLOW_THRESHOLD && !warnedFlags[label]) {
    warnedFlags[label] = true;
    console.warn(
      `[react-unique-id-generator] ${label} counter has exceeded ${OVERFLOW_THRESHOLD}. ` +
      `This may indicate a memory leak or unintended usage pattern.`
    );
  }
}
