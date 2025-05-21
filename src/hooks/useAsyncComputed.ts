import { useSignal, useSignalEffect } from '@preact/signals';

export enum ReadyState {
  Pending = 'pending',
  Ready = 'ready',
  Error = 'error',
}

export interface AsyncComputedResult<T> {
  state: ReadyState;
  error: any;
  value: T;
}

/** Fetch remote data and populate a signal with the result. At first, the signal will be populated
 * with the `initial` value. When the data is ready, the signal will be repopulated with the result.
 *
 * *Caveat:* Signal dependencies are only tracked until the first `await` call. Be sure to call all
 * dependencies before that.
 */
export function useAsyncComputed<T>(
  initial: T,
  callback: () => Promise<T>
) {
  const state = useSignal<AsyncComputedResult<T>>({
    state: ReadyState.Pending,
    error: undefined,
    value: initial,
  });

  useSignalEffect(() => {
    let isMounted = true;

    callback()
      .then((result) => {
        if (!isMounted) return;
        state.value = {
          state: ReadyState.Ready,
          error: undefined,
          value: result,
        };
      })
      .catch((err) => {
        if (!isMounted) return;
        state.value = {
          ...state.peek(),
          state: ReadyState.Error,
          error: err,
        };
      });

    return () => {
      isMounted = false;
    };
  });

  return {
    get state() { return state.value.state },
    get error() { return state.value.error },
    get value() { return state.value.value },
    peek: () => state.peek(),
    subscribe: (fn: (value: AsyncComputedResult<T>) => void) => state.subscribe(fn),
  };
}
