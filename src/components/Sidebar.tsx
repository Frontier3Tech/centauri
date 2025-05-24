import { CreateSubdenom, subdenom } from '~/state';
import { PlusCircleIcon } from './icon/PlusCircleIcon';
import { ConnectButton } from './ConnectButton';
import { useCreatorDenoms } from '~/hooks/useCreatorDenoms';

export function Sidebar() {
  const items = useCreatorDenoms();

  return (
    <aside class="w-full md:w-64 flex-shrink-0 bg-white shadow-sm flex flex-col md:flex-col max-h-[300px] md:max-h-[100%] overflow-y-auto md:overflow-y-visible">
      <ul class="flex flex-col space-y-2 flex-1">
      <li class="block">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              subdenom.value = CreateSubdenom;
            }}
            class="block px-4 py-2 hover:bg-gray-100 text-gray-700 flex items-center gap-2"
          >
            <PlusCircleIcon width={20} height={20} class="text-gray-500" />
            Create
          </a>
        </li>
        {items.value.map((item) => (
          <li key={item} class="block">
            <a
              href="#"
              class="block px-4 py-2 hover:bg-gray-100 text-gray-700"
              onClick={(e) => {
                e.preventDefault();
                subdenom.value = item;
              }}
            >
              {item.split('/', 3).pop()}
            </a>
          </li>
        ))}
      </ul>
      <ConnectButton class="w-full md:hidden p-4 border-b border-gray-200 md:rounded-md" />
    </aside>
  );
}