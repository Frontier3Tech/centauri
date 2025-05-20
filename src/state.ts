import { signals as apophisSignals } from '@apophis-sdk/core';
import { computed, signal } from '@preact/signals';

export const CreateSubdenom = Symbol('CreateSubdenom');

/** Creator override, if any */
export const creatorOverride = signal<string | undefined>();

export const creator = computed(() => creatorOverride.value ?? apophisSignals.address.value);

/** Currently active subdenom, if any */
export const subdenom = signal<string | typeof CreateSubdenom | undefined>();
