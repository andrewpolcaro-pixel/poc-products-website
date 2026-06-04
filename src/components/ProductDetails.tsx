import { TaxonomyTerm } from '@/lib/wordpress';

interface Row {
  label: string;
  terms: TaxonomyTerm[];
}

interface Props {
  rows: Row[];
}

export default function ProductDetails({ rows }: Props) {
  const filled = rows.filter((r) => r.terms.length > 0);
  if (filled.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Details</h2>
      <table className="w-full border-collapse text-sm">
        <tbody>
          {filled.map((row) => (
            <tr key={row.label} className="border-t border-gray-200 even:bg-gray-50">
              <th className="text-left font-semibold text-gray-700 py-3 pr-6 pl-2 w-48 align-top">
                {row.label}
              </th>
              <td className="py-3 text-blue-600 italic">
                {row.terms.map((t) => t.name).join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
