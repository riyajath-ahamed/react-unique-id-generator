import nextId, {
  resetId,
  setGlobalPrefix,
  setGlobalSuffix,
  getCurrentId,
  setId,
  generateId
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

export {
  nextId as default,
  resetId,
  setGlobalPrefix,
  setGlobalSuffix,
  getCurrentId,
  setId,
  generateId,
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
};

export type {
  IdProviderProps,
  IdContextValue,
  ServerIdManager,
  ServerIdManagerOptions,
  AutomationIdStrategy,
  AutomationIdOptions,
};
