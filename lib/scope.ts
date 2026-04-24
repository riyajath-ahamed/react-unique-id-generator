const scopeCounters = new Map<string, number>();

export function nextIdForScope(scope: string, prefix: string = ''): string {
  const current = (scopeCounters.get(scope) ?? 0) + 1;
  scopeCounters.set(scope, current);
  return `${prefix}${current}`;
}

export function resetIdForScope(scope: string): void {
  scopeCounters.delete(scope);
}

export function resetAllScopes(): void {
  scopeCounters.clear();
}

export function getScopeCounter(scope: string): number {
  return scopeCounters.get(scope) ?? 0;
}

export function getActiveScopes(): string[] {
  return Array.from(scopeCounters.keys());
}
