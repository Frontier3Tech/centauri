import { Signal, useSignal } from '@preact/signals';

export function usePropSignal<T>(initial: T | Signal<T> | undefined, defaultValue: T): Signal<T> {
  if (isSignalish(initial)) return initial;
  return useSignal(initial ?? defaultValue);
}

const isSignalish = <T>(value: T | Signal<T> | undefined): value is Signal<T> =>
  typeof value === 'object' && value !== null && 'value' in value;
