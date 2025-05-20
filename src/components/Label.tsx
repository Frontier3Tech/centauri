import type { JSX } from 'preact';
import cx from 'classnames';
import { Info } from './Info';

interface LabelProps {
  children: JSX.Element | string;
  required?: boolean;
  info?: string;
  class?: string;
}

export function Label({ children, required, info, class: className }: LabelProps): JSX.Element {
  return (
    <div class="flex items-center gap-1">
      <label class={cx('text-sm text-gray-500', className)}>
        {children}
        {required && <span class="text-red-500 ml-1">*</span>}
      </label>
      {info && <Info>{info}</Info>}
    </div>
  );
}