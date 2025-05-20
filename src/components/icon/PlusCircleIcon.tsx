import cx from 'classnames';
import { forwardRef } from 'preact/compat';
import type { IconBaseProps } from './base';

export interface PlusCircleIconProps extends IconBaseProps {}

export const PlusCircleIcon = forwardRef<SVGSVGElement, PlusCircleIconProps>(({
  width = 24,
  height = 24,
  color = 'currentColor',
  class: className = '',
  style
}, ref) => {
  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      class={cx('icon icon-plus-circle', className)}
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
      style={style}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={1}
        d="M12 6v12M6 12h12"
      />
      <circle
        cx="12"
        cy="12"
        r="11.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={1}
      />
    </svg>
  );
});
