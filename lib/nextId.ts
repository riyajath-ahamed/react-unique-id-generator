let globalPrefix = "";
let globalSuffix = "";
let lastId = 0;

const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production';
const deprecationWarned = new Set<string>();

const OVERFLOW_THRESHOLD = 1_000_000;
let overflowWarned = false;

function checkOverflow(counter: number): void {
  if (isDev && counter >= OVERFLOW_THRESHOLD && !overflowWarned) {
    overflowWarned = true;
    console.warn(
      `[react-unique-id-generator] ID counter has exceeded ${OVERFLOW_THRESHOLD}. ` +
      `This may indicate a memory leak or unintended usage pattern. ` +
      `Consider using resetId() or scoped ID management.`
    );
  }
}

function warnDeprecated(name: string, alternative: string): void {
  if (isDev && !deprecationWarned.has(name)) {
    deprecationWarned.add(name);
    console.warn(
      `[react-unique-id-generator] DEPRECATED: ${name}() uses global state. ` +
      `Use ${alternative} instead for SSR safety. ` +
      `Global API will be removed in a future major version.`
    );
  }
}

/**
 * Generates the next unique ID. Accepts an optional prefix that overrides the
 * global prefix for that call only.
 *
 * @param localPrefix - Optional prefix string. When provided (non-null/undefined),
 *   it replaces the global prefix for this call. Pass `null` or `undefined` to
 *   fall back to the global prefix.
 * @returns A unique string ID in the format `{prefix}{counter}{suffix}`
 *
 * @example
 * ```ts
 * nextId()           // "1"
 * nextId('input-')   // "input-2"
 * ```
 */
export default function nextId(localPrefix?: string | null): string {
  if (isDev && localPrefix !== undefined && localPrefix !== null && typeof localPrefix !== 'string') {
    console.warn(
      `[react-unique-id-generator] nextId() expected a string prefix, but received ${typeof localPrefix}. ` +
      `The value will be coerced to a string.`
    );
  }
  lastId++;
  checkOverflow(lastId);
  return `${localPrefix !== null && localPrefix !== undefined ? localPrefix : globalPrefix}${lastId}${globalSuffix}`;
}

/**
 * Resets the ID counter back to 0. The next call to {@link nextId} or
 * {@link generateId} will produce an ID with counter value 1.
 *
 * @example
 * ```ts
 * nextId();   // "1"
 * nextId();   // "2"
 * resetId();
 * nextId();   // "1"
 * ```
 */
export const resetId = (): void => {
  lastId = 0;
  overflowWarned = false;
};

/**
 * Sets a global prefix applied to every subsequent {@link nextId} call,
 * unless overridden by a local prefix argument.
 *
 * @param newPrefix - The prefix string. Falsy values are normalized to `""`.
 *
 * @example
 * ```ts
 * setGlobalPrefix('app-');
 * nextId(); // "app-1"
 * nextId(); // "app-2"
 * ```
 */
export const setGlobalPrefix = (newPrefix: string): void => {
  warnDeprecated('setGlobalPrefix', '<IdProvider prefix="...">');
  if (isDev && newPrefix !== undefined && newPrefix !== null && typeof newPrefix !== 'string') {
    console.warn(
      `[react-unique-id-generator] setGlobalPrefix() expected a string, but received ${typeof newPrefix}.`
    );
  }
  globalPrefix = newPrefix || "";
};

/**
 * Sets a global suffix appended to every subsequent {@link nextId} call.
 *
 * @param newSuffix - The suffix string. Falsy values are normalized to `""`.
 *
 * @example
 * ```ts
 * setGlobalSuffix('-id');
 * nextId(); // "1-id"
 * nextId(); // "2-id"
 * ```
 */
export const setGlobalSuffix = (newSuffix: string): void => {
  warnDeprecated('setGlobalSuffix', '<IdProvider suffix="...">');
  if (isDev && newSuffix !== undefined && newSuffix !== null && typeof newSuffix !== 'string') {
    console.warn(
      `[react-unique-id-generator] setGlobalSuffix() expected a string, but received ${typeof newSuffix}.`
    );
  }
  globalSuffix = newSuffix || "";
};

/**
 * Returns the current counter value without incrementing it.
 *
 * @returns The current counter value
 *
 * @example
 * ```ts
 * nextId();       // "1"
 * getCurrentId(); // 1
 * ```
 */
export const getCurrentId = (): number => {
  return lastId;
};

/**
 * Sets the counter to a specific value. Negative values are clamped to 0;
 * decimals are floored.
 *
 * @param id - The counter value to set
 *
 * @example
 * ```ts
 * setId(10);
 * nextId(); // "11"
 * ```
 */
export const setId = (id: number): void => {
  if (isDev && (typeof id !== 'number' || Number.isNaN(id))) {
    console.warn(
      `[react-unique-id-generator] setId() expected a number, but received ${typeof id}.`
    );
  }
  lastId = Math.max(0, Math.floor(id));
};

/**
 * Generates a unique ID with an explicit prefix and suffix, ignoring the
 * global prefix/suffix configuration.
 *
 * @param prefix - The prefix for this ID (default: `""`)
 * @param suffix - The suffix for this ID (default: `""`)
 * @returns A unique string ID in the format `{prefix}{counter}{suffix}`
 *
 * @example
 * ```ts
 * generateId('btn-', '-primary') // "btn-1-primary"
 * generateId('icon-')            // "icon-2"
 * generateId()                   // "3"
 * ```
 */
export const generateId = (prefix: string = "", suffix: string = ""): string => {
  lastId++;
  checkOverflow(lastId);
  return `${prefix}${lastId}${suffix}`;
};

export { OVERFLOW_THRESHOLD };