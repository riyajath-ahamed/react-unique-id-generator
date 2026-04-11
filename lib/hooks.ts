import { useRef } from 'react';
import nextId from './nextId';

/**
 * React hook that generates a stable unique ID for a component instance.
 * The ID is created once on mount and remains the same across re-renders.
 *
 * @param localPrefix - Optional prefix prepended to the generated ID
 * @returns A stable unique string ID that persists across re-renders
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const id = useUniqueId('my-input-');
 *   return (
 *     <div>
 *       <label htmlFor={id}>Name</label>
 *       <input id={id} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useUniqueId(localPrefix?: string): string {
  const idRef = useRef<string | null>(null);

  if (idRef.current === null) {
    idRef.current = nextId(localPrefix);
  }

  return idRef.current;
}

/**
 * React hook that generates multiple stable unique IDs for a component instance.
 * All IDs are created once on mount and remain the same across re-renders.
 *
 * @param count - The number of unique IDs to generate
 * @param localPrefix - Optional prefix prepended to each generated ID
 * @returns An array of stable unique string IDs that persist across re-renders
 *
 * @example
 * ```tsx
 * function LoginForm() {
 *   const [emailId, passwordId] = useUniqueIds(2, 'login-');
 *   return (
 *     <form>
 *       <label htmlFor={emailId}>Email</label>
 *       <input id={emailId} type="email" />
 *       <label htmlFor={passwordId}>Password</label>
 *       <input id={passwordId} type="password" />
 *     </form>
 *   );
 * }
 * ```
 */
export function useUniqueIds(count: number, localPrefix?: string): string[] {
  const idsRef = useRef<string[] | null>(null);

  if (idsRef.current === null) {
    idsRef.current = Array.from({ length: count }, () => nextId(localPrefix));
  }

  return idsRef.current;
}
