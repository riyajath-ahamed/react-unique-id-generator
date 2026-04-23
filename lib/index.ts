import nextId, {
  resetId,
  setGlobalPrefix,
  setGlobalSuffix,
  getCurrentId,
  setId,
  generateId,
  OVERFLOW_THRESHOLD
} from "./nextId";

import { useUniqueId, useUniqueIds } from "./hooks";

import { IdProvider, IdContext, useIdContext } from "./context";
import type { IdProviderProps, IdContextValue } from "./context";

import { createServerIdManager } from "./server";
import type { ServerIdManager, ServerIdManagerOptions } from "./server";

import {
  generateAutomationId,
  useAutomationId,
  resetAutomationCounter,
  AutomationIdPool,
} from "./automation";
import type { AutomationIdStrategy, AutomationIdOptions } from "./automation";

import { generateSecureId } from "./secure";

import {
  nextIdForScope,
  resetIdForScope,
  resetAllScopes,
  getScopeCounter,
  getActiveScopes,
} from "./scope";

import {
  useTrackedUniqueId,
  useTrackedUniqueIds,
  useIdMetrics,
  getIdMetrics,
  resetIdMetrics,
  getActiveIdCount,
  cleanupInactiveIds,
} from "./performance";
import type { IdMetrics } from "./performance";

export {
  nextId as default,
  resetId,
  setGlobalPrefix,
  setGlobalSuffix,
  getCurrentId,
  setId,
  generateId,
  OVERFLOW_THRESHOLD,
  useUniqueId,
  useUniqueIds,

  IdProvider,
  IdContext,
  useIdContext,

  createServerIdManager,

  generateAutomationId,
  useAutomationId,
  resetAutomationCounter,
  AutomationIdPool,

  generateSecureId,

  nextIdForScope,
  resetIdForScope,
  resetAllScopes,
  getScopeCounter,
  getActiveScopes,

  useTrackedUniqueId,
  useTrackedUniqueIds,
  useIdMetrics,
  getIdMetrics,
  resetIdMetrics,
  getActiveIdCount,
  cleanupInactiveIds,
};

export type {
  IdProviderProps,
  IdContextValue,
  ServerIdManager,
  ServerIdManagerOptions,
  AutomationIdStrategy,
  AutomationIdOptions,
  IdMetrics,
};
