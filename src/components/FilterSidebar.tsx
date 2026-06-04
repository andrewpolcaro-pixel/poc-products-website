'use client';

import { TaxonomyTerm } from '@/lib/wordpress';

interface Props {
  categories: TaxonomyTerm[];
  markets: TaxonomyTerm[];
  activeCategory: string;
  activeMarket: string;
  onCategoryChange: (slug: string) => void;
  onMarketChange: (slug: string) => void;
  onReset: () => void;
}

export default function FilterSidebar({
  categories,
  markets,
  activeCategory,
  activeMarket,
  onCategoryChange,
  onMarketChange,
  onReset,
}: Props) {
  const hasActive = activeCategory !== '' || activeMarket !== '';

  return (
    <aside className="w-56 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-700 uppercase text-xs tracking-wider">Filters</h2>
        {hasActive && (
          <button onClick={onReset} className="text-xs text-blue-600 hover:underline">
            Clear all
          </button>
        )}
      </div>

      <FilterGroup
        title="Category"
        terms={categories}
        active={activeCategory}
        onChange={onCategoryChange}
      />

      <FilterGroup
        title="Market"
        terms={markets}
        active={activeMarket}
        onChange={onMarketChange}
      />
    </aside>
  );
}

function FilterGroup({
  title,
  terms,
  active,
  onChange,
}: {
  title: string;
  terms: TaxonomyTerm[];
  active: string;
  onChange: (slug: string) => void;
}) {
  if (terms.length === 0) return null;

  return (
    <div className="mb-6">
      <p className="font-semibold text-gray-800 text-sm mb-2">{title}</p>
      <ul className="space-y-1">
        {terms.map((term) => (
          <li key={term.id}>
            <button
              onClick={() => onChange(active === term.slug ? '' : term.slug)}
              className={`w-full text-left text-sm px-2 py-1 rounded-md transition-colors ${
                active === term.slug
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {term.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
