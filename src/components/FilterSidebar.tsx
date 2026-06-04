'use client';

import { useState } from 'react';
import { TaxonomyTerm } from '@/lib/wordpress';

export interface FilterGroupConfig {
  title: string;
  terms: TaxonomyTerm[];
  active: string;
  onChange: (slug: string) => void;
}

interface Props {
  search: string;
  onSearch: (v: string) => void;
  productFilters: FilterGroupConfig[];
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

export default function FilterSidebar({
  search,
  onSearch,
  productFilters,
  onClearAll,
  hasActiveFilters,
}: Props) {
  return (
    <aside className="w-64 flex-shrink-0">
      {/* Search */}
      <div className="relative mb-0">
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search Product"
          className="w-full border border-gray-300 rounded-none px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-brand"
        />
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </div>

      {/* Product Filter section */}
      <div className="mt-0 border border-gray-200">
        <div className="bg-brand px-4 py-2.5 flex items-center justify-between">
          <span className="text-white font-bold text-sm tracking-wide uppercase">
            Product Filter
          </span>
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="text-white/80 hover:text-white text-xs underline"
            >
              Clear all
            </button>
          )}
        </div>

        {productFilters.map((group) => (
          <CollapsibleGroup key={group.title} {...group} />
        ))}
      </div>
    </aside>
  );
}

function CollapsibleGroup({ title, terms, active, onChange }: FilterGroupConfig) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-gray-200">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 transition-colors"
      >
        <span className={active ? 'font-semibold text-brand' : 'font-medium'}>
          {title}
          {active && <span className="ml-1 text-xs">•</span>}
        </span>
        <span className="text-brand text-lg font-light leading-none">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="pb-2 border-t border-gray-100 bg-gray-50">
          {terms.length === 0 ? (
            <p className="px-4 py-2 text-xs text-gray-400">No options</p>
          ) : (
            terms.map((term) => (
              <button
                key={term.id}
                onClick={() => onChange(active === term.slug ? '' : term.slug)}
                className={`flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors ${
                  active === term.slug
                    ? 'text-brand font-semibold bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-sm border flex-shrink-0 flex items-center justify-center ${
                    active === term.slug ? 'bg-brand border-brand' : 'border-gray-400'
                  }`}
                >
                  {active === term.slug && (
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    </svg>
                  )}
                </span>
                {term.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
