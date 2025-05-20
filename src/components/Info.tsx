import cx from 'classnames';
import type { JSX } from 'preact';
import { InfoIcon } from './icon/InfoIcon';
import { tooltip } from '@kiruse/cosmos-components';
import { useTooltip } from '~/hooks/useTooltip';
import { useSignal } from '@preact/signals';

interface InfoProps {
  children: JSX.Element | string;
  class?: string;
}

export function Info({ children, class: className }: InfoProps): JSX.Element {
  const iconRef = useSignal<SVGSVGElement | null>(null);
  useTooltip(iconRef, () => (
    <div class="text-sm">
      {children}
    </div>
  ));

  return (
    <div class={cx('inline-flex items-center gap-1 text-gray-500', className)}>
      <InfoIcon ref={(el: any) => iconRef.value = el} width={16} height={16} class="text-gray-400" />
      <span class="text-sm">{children}</span>
    </div>
  );
}