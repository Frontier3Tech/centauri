import { useComputed, type ReadonlySignal, type Signal } from '@preact/signals';
import { cloneElement, type ComponentChildren, type VNode } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import { usePropSignal } from '~/hooks/usePropSignal';
import { ChevronIcon } from './icon/ChevronIcon';
import { Children } from 'preact/compat';

export interface AccordionItemProps {
  children?: ComponentChildren;
  title: string;
}

interface AccordionItemExtraProps {
  index: number;
  activeIndex: ReadonlySignal<number>;
  onToggle: (index: number) => void;
}

function AccordionItem({ children, title, ...props }: AccordionItemProps) {
  const { index, activeIndex, onToggle } = props as AccordionItemExtraProps;
  const isOpen = useComputed(() => activeIndex.value === index);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    // Cancel any ongoing animation
    if (animationRef.current) {
      animationRef.current.cancel();
    }

    const startHeight = isOpen.value ? 0 : content.scrollHeight;
    const endHeight = isOpen.value ? content.scrollHeight : 0;

    // Set initial height
    content.style.height = `${startHeight}px`;
    content.style.overflow = 'hidden';

    // Create and start animation
    animationRef.current = content.animate(
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

    // Clean up animation on unmount
    return () => {
      if (animationRef.current) {
        animationRef.current.cancel();
      }
    };
  }, [isOpen.value]);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 cursor-pointer"
        onClick={() => onToggle(index)}
      >
        <span className="font-medium">{title}</span>
        <ChevronIcon
          width={20}
          height={20}
          class="text-gray-500"
          direction={isOpen.value ? 'up' : 'down'}
        />
      </button>
      <div ref={contentRef} className="overflow-hidden">
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export interface AccordionProps {
  children?: ComponentChildren;
  active?: number | Signal<number>;
}

export function Accordion({ children, ...props }: AccordionProps) {
  const activeIndex = usePropSignal(props.active, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {Children.map(children, (child, index) =>
        cloneElement(child as VNode, {
          index,
          activeIndex: activeIndex,
          onToggle: (index: number) => activeIndex.value = index,
        } satisfies AccordionItemExtraProps)
      )}
    </div>
  );
}

Accordion.Item = AccordionItem;
