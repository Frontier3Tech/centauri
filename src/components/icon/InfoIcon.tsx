import cx from 'classnames';
import { forwardRef } from 'preact/compat';
import type { IconBaseProps } from './base';

export interface InfoIconProps extends IconBaseProps {}

export const InfoIcon = forwardRef<SVGSVGElement, InfoIconProps>(({
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
      class={cx('icon icon-info', className)}
      fill="none"
      stroke={color}
      viewBox="0 0 24 24"
      style={style}
    >
      <circle
        cx="12"
        cy="12"
        r="11.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={1}
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={2}
        d="M12 17v-6M12 7v-.02"
      />
    </svg>
  );
});