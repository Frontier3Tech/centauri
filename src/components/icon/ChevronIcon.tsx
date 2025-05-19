import cx from 'classnames';
import type { IconBaseProps } from './base';

export interface ChevronIconProps extends IconBaseProps {
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function ChevronIcon({
  width = 24,
  height = 24,
  color = 'currentColor',
  class: className = '',
  direction = 'down',
  style
}: ChevronIconProps) {
  return (
    <svg
      width={width}
      height={height}
      class={cx('icon icon-chevron', direction, className)}
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
}