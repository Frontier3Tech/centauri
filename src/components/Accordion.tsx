import { useComputed, type ReadonlySignal, type Signal } from '@preact/signals';
import { cloneElement, type ComponentChildren, type VNode } from 'preact';
import { Children } from 'preact/compat';
import { usePropSignal } from '~/hooks/usePropSignal';
import { Collapsible } from './Collapsible';

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

  return (
    <Collapsible
      title={title}
      open={isOpen}
      onToggle={() => onToggle(index)}
      class="border-b border-gray-200"
    >
      {children}
    </Collapsible>
  );
}

export interface AccordionProps {
  children?: ComponentChildren;
  active?: number | Signal<number>;
}

export function Accordion({ children, ...props }: AccordionProps) {
  const activeIndex = usePropSignal(props.active, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
