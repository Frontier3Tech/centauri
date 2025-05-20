import { tooltip } from '@kiruse/cosmos-components';
import { useSignalEffect, type ReadonlySignal } from '@preact/signals';
import { render, type JSX } from 'preact';

export interface TooltipOptions {
  placement?: 'top' | 'bottom' | 'left' | 'right',
}

export function useTooltip(
  ref: ReadonlySignal<HTMLElement | SVGSVGElement | undefined | null>,
  computeContent: () => JSX.Element,
  options: TooltipOptions = {},
) {
  useSignalEffect(() => {
    if (!ref.value) return;
    const content = computeContent();
    const el = document.createElement('div');
    render(content, el);
    const tt = tooltip.create(ref.value as any, el, options);
    return () => tt.destroy();
  });
}
