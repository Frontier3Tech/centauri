import cx from 'classnames';
import type { JSX } from 'preact';
import { InfoIcon } from './icon/InfoIcon';
import { tooltip } from '@kiruse/cosmos-components';
import { useTooltip } from '~/hooks/useTooltip';
import { useSignal } from '@preact/signals';

interface InfoProps {
  children: JSX.Element | string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  class?: string;
}

export function Info({ children, placement = 'top', class: className }: InfoProps): JSX.Element {
  const iconRef = useSignal<SVGSVGElement | null>(null);
  useTooltip(iconRef, () => (
    <div class="text-sm">
      {children}
    </div>
  ), {
    placement,
  });

  return (
    <div class={cx('inline-flex items-center gap-1 text-gray-500', className)}>
      <InfoIcon ref={(el: any) => iconRef.value = el} width={16} height={16} class="text-gray-400" />
      <span class="text-sm">{children}</span>
    </div>
  );
}