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

import {
  generateIdWithStrategy,
  useIdWithStrategy,
  numericStrategy,
  zeroPaddedStrategy,
  timestampStrategy,
  hashStrategy,
  resetStrategyCounter,
  getStrategyCounter,
} from "./strategy";
import type { IdStrategy } from "./strategy";

import {
  CollisionDetector,
  getGlobalCollisionDetector,
  resetGlobalCollisionDetector,
  checkCollision,
} from "./collision";
import type { CollisionAction, CollisionDetectorOptions } from "./collision";

import { IdPool, useIdPool } from "./pool";
import type { IdPoolOptions } from "./pool";

import {
  SSRProvider,
  SSRContext,
  useSSRContext,
  useSSRSafeId,
  createSSRIdFactory,
} from "./ssr";
import type { SSRContextValue, SSRProviderProps } from "./ssr";

import {
  generateDelimitedId,
  useDelimitedId,
  resetDelimiterCounter,
  getDelimiterCounter,
} from "./delimiter";
import type { DelimitedIdOptions } from "./delimiter";

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

  // v2.2.0: Custom ID strategies
  generateIdWithStrategy,
  useIdWithStrategy,
  numericStrategy,
  zeroPaddedStrategy,
  timestampStrategy,
  hashStrategy,
  resetStrategyCounter,
  getStrategyCounter,

  // v2.2.0: Collision detection
  CollisionDetector,
  getGlobalCollisionDetector,
  resetGlobalCollisionDetector,
  checkCollision,

  // v2.2.0: ID pool management
  IdPool,
  useIdPool,

  // v2.2.0: SSR utilities
  SSRProvider,
  SSRContext,
  useSSRContext,
  useSSRSafeId,
  createSSRIdFactory,

  // v2.2.0: Custom delimiter support
  generateDelimitedId,
  useDelimitedId,
  resetDelimiterCounter,
  getDelimiterCounter,
};

export type {
  IdProviderProps,
  IdContextValue,
  ServerIdManager,
  ServerIdManagerOptions,
  AutomationIdStrategy,
  AutomationIdOptions,
  IdMetrics,
  IdStrategy,
  CollisionAction,
  CollisionDetectorOptions,
  IdPoolOptions,
  SSRContextValue,
  SSRProviderProps,
  DelimitedIdOptions,
};
