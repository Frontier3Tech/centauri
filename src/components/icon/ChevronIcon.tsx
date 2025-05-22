import cx from 'classnames';
import { forwardRef } from 'preact/compat';
import type { IconBaseProps } from './base';
import { useComputed, type ReadonlySignal } from '@preact/signals';
import { usePropSignal } from '~/hooks/usePropSignal';

export type ChevronDirection = 'up' | 'down' | 'left' | 'right';

export interface ChevronIconProps extends IconBaseProps {
  direction?: ChevronDirection | ReadonlySignal<ChevronDirection>;
}

export const ChevronIcon = forwardRef<SVGSVGElement, ChevronIconProps>(({
  width = 24,
  height = 24,
  color = 'currentColor',
  class: className = '',
  direction,
  style
}, ref) => {
  const directionSignal = usePropSignal(direction, 'down');
  const classes = useComputed(() => cx('icon icon-chevron icon-orient', directionSignal.value, className));

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      class={classes}
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
      style={style}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
});
