import { useSignal } from '@preact/signals';
import { PlusCircleIcon } from './icon/PlusCircleIcon';
import { TrashIcon } from './icon/TrashIcon';

interface Unit {
  denom: string;
  decimals: number;
  aliases: string[];
}

interface UnitsTableProps {
  units: Unit[];
  onUnitsChange: (units: Unit[]) => void;
}

export function UnitsTable({ units, onUnitsChange }: UnitsTableProps) {
  return (
    <>
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Denom</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Decimals</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aliases</th>
            <th class="px-6 whitespace-nowrap text-right text-sm font-medium"></th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {units.map((unit, index) => (
            <tr key={index}>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{unit.denom}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{unit.decimals}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{unit.aliases.join(', ')}</td>
              <td class="px-6 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => {
                    onUnitsChange(units.filter((_, i) => i !== index));
                  }}
                  class="p-2 text-red-600 hover:text-red-500 rounded-full bg-white hover:bg-gray-50 transition-colors"
                >
                  <TrashIcon width={20} height={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        class="w-full flex items-center gap-2 px-6 py-4 border-t border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900"
        onClick={() => {
          onUnitsChange([...units, { denom: '', decimals: 0, aliases: [] }]);
        }}
      >
        <PlusCircleIcon width={20} height={20} />
        <span>Add unit</span>
      </button>
    </>
  );
}