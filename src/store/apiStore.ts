import { useSyncExternalStore } from "react";

export interface ApiResourceState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  updatedAt: number | null;
}

type ResourceMap = Record<string, ApiResourceState<unknown>>;

const listeners = new Set<() => void>();
let resources: ResourceMap = {};

function createEmptyState<T>(): ApiResourceState<T> {
  return {
    data: null,
    loading: false,
    error: null,
    updatedAt: null,
  };
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

function setResourceState<T>(key: string, nextState: Partial<ApiResourceState<T>>) {
  const currentState = (resources[key] as ApiResourceState<T> | undefined) ?? createEmptyState<T>();

  resources = {
    ...resources,
    [key]: {
      ...currentState,
      ...nextState,
    },
  };

  emitChange();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getApiResource<T>(key: string): ApiResourceState<T> {
  return (resources[key] as ApiResourceState<T> | undefined) ?? createEmptyState<T>();
}

export function setApiResource<T>(key: string, state: Partial<ApiResourceState<T>>) {
  setResourceState(key, state);
}

export function resetApiResource(key: string) {
  const { [key]: _removed, ...rest } = resources;
  resources = rest;
  emitChange();
}

export function clearApiResources() {
  resources = {};
  emitChange();
}

export function useApiResource<T>(key: string): ApiResourceState<T> {
  return useSyncExternalStore(
    subscribe,
    () => getApiResource<T>(key),
    () => createEmptyState<T>(),
  );
}

export async function fetchApiResource<T>(key: string, request: () => Promise<T>, options: { keepPreviousData?: boolean } = {}): Promise<T> {
  const previousState = getApiResource<T>(key);

  setResourceState<T>(key, {
    loading: true,
    error: null,
    data: options.keepPreviousData ? previousState.data : null,
  });

  try {
    const data = await request();
    setResourceState<T>(key, {
      data,
      loading: false,
      error: null,
      updatedAt: Date.now(),
    });
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected API error occurred.";
    setResourceState<T>(key, {
      loading: false,
      error: message,
      updatedAt: Date.now(),
    });
    throw error;
  }
}

export const apiStore = {
  get: getApiResource,
  set: setApiResource,
  reset: resetApiResource,
  clear: clearApiResources,
  fetch: fetchApiResource,
};
