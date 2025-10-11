let globalPrefix = "";
let globalSuffix = "";
let lastId = 0;

/**
 * Generates a unique ID with optional local prefix
 * @param localPrefix - Optional prefix to override global prefix
 * @returns A unique string ID
 */
export default function nextId(localPrefix?: string | null): string {
  lastId++;
  return `${localPrefix !== null && localPrefix !== undefined ? localPrefix : globalPrefix}${lastId}${globalSuffix}`;
}

/**
 * Resets the ID counter to 0
 */
export const resetId = (): void => {
  lastId = 0;
};

/**
 * Sets a global prefix for all generated IDs
 * @param newPrefix - The prefix to use for all IDs
 */
export const setGlobalPrefix = (newPrefix: string): void => {
  globalPrefix = newPrefix || "";
};

/**
 * Sets a global suffix for all generated IDs
 * @param newSuffix - The suffix to use for all IDs
 */
export const setGlobalSuffix = (newSuffix: string): void => {
  globalSuffix = newSuffix || "";
};

/**
 * Gets the current ID counter value
 * @returns The current last ID value
 */
export const getCurrentId = (): number => {
  return lastId;
};

/**
 * Sets the ID counter to a specific value
 * @param id - The ID value to set the counter to
 */
export const setId = (id: number): void => {
  lastId = Math.max(0, Math.floor(id));
};

/**
 * Generates a unique ID with a specific prefix and suffix
 * @param prefix - The prefix for this ID
 * @param suffix - The suffix for this ID
 * @returns A unique string ID
 */
export const generateId = (prefix: string = "", suffix: string = ""): string => {
  lastId++;
  return `${prefix}${lastId}${suffix}`;
};