import { SpecRow } from '@/lib/wordpress';

const COLUMNS: { key: keyof SpecRow; label: string }[] = [
  { key: 'item',             label: 'Item' },
  { key: 'capacity',         label: 'Capacity(ml)' },
  { key: 'dosage',           label: 'Dosage(cc)' },
  { key: 'height',           label: 'Height(mm)' },
  { key: 'diameter',         label: 'Diameter(mm)' },
  { key: 'body_height',      label: 'Body Height(mm)' },
  { key: 'pump_options',     label: 'Pump Option/s' },
  { key: 'special_function', label: 'Special Function' },
];

export default function SpecsTable({ specs }: { specs: SpecRow[] }) {
  if (!specs || specs.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Specifications</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ backgroundColor: '#1e3a6e' }}>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-center font-semibold text-white whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specs.map((row, i) => (
              <tr key={i} className="border-t border-gray-200 even:bg-gray-50">
                {COLUMNS.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-center text-gray-700 whitespace-nowrap">
                    {row[col.key] || ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
