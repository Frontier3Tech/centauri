export interface NavItem {
  id: string;
  label: string;
}

export interface SidebarProps {
  items: NavItem[];
}

export function Sidebar({ items }: SidebarProps) {
  return (
    <aside class="w-64 flex-shrink-0 bg-white shadow-sm">
      <ul class="flex flex-col space-y-2">
        {items.map((item) => (
          <li key={item.id} class="block">
            <a
              href={`#${item.id}`}
              class="block px-4 py-2 hover:bg-gray-100 text-gray-700"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}