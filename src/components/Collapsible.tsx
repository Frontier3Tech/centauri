import { useComputed, useSignal, useSignalEffect, type ReadonlySignal } from '@preact/signals';
import { type ComponentChildren } from 'preact';
import { usePropSignal } from '~/hooks/usePropSignal';
import { ChevronIcon } from './icon/ChevronIcon';

export interface CollapsibleProps {
  children?: ComponentChildren;
  open?: boolean | ReadonlySignal<boolean>;
  title?: string;
  class?: string;
  onToggle?: () => void;
}

export function Collapsible({ children, open, onToggle, title, class: className }: CollapsibleProps) {
  const isOpen = usePropSignal(open, false);
  const direction = useComputed(() => isOpen.value ? 'up' : 'down');
  const contentEl = useSignal<HTMLDivElement | null>(null);

  useSignalEffect(() => {
    const content = contentEl.value;
    if (!content) return;

    const expanding = isOpen.value;

    const startHeight = expanding ? 0 : content.scrollHeight;
    const endHeight = expanding ? content.scrollHeight : 0;

    // Set initial height
    content.style.height = `${startHeight}px`;
    content.style.overflow = 'hidden';

    // Create and start animation
    const anim = content.animate(
      [
        { height: `${startHeight}px` },
        { height: `${endHeight}px` }
      ],
      {
        duration: 200,
        easing: 'ease-in-out',
        fill: 'forwards'
      }
    );

    anim.finished.then(() => {
      anim.cancel();
      if (expanding) {
        content.style.height = `auto`;
      } else {
        content.style.height = `0`;
      }
    });

    // Clean up animation on unmount
    return () => {
      anim.cancel();
    };
  });

  return (
    <div class={className}>
      <button
        class={"w-full px-6 py-4 text-left flex justify-between items-center bg-[#f0f0f0] hover:bg-[#e9e9e9] transition-colors cursor-pointer overflow-hidden"}
        onClick={onToggle ?? (() => (isOpen.value = !isOpen.peek()))}
      >
        <span class="font-medium">{title}</span>
        <ChevronIcon
          width={20}
          height={20}
          class="text-gray-500"
          direction={direction}
        />
      </button>
      <div ref={el => (contentEl.value = el)} class="overflow-hidden h-0">
        <div class="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
