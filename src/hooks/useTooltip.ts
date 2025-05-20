import { tooltip } from '@kiruse/cosmos-components';
import { useSignalEffect, type ReadonlySignal } from '@preact/signals';
import { render, type JSX } from 'preact';

export function useTooltip(
  ref: ReadonlySignal<HTMLElement | SVGSVGElement | undefined | null>,
  computeContent: () => JSX.Element,
) {
  useSignalEffect(() => {
    if (!ref.value) return;
    const content = computeContent();
    const el = document.createElement('div');
    render(content, el);
    const tt = tooltip.create(ref.value as any, el);
    return () => tt.destroy();
  });
}
