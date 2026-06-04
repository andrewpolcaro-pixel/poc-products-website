'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  getProducts, getAllCategories, getAllSeries, getAllMarkets, getAllSustainable,
  getEmbeddedTerms, TERM_IDX,
  Product, TaxonomyTerm,
} from '@/lib/wordpress';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';

export default function CatalogPage() {
  const [products, setProducts]       = useState<Product[]>([]);
  const [categories, setCategories]   = useState<TaxonomyTerm[]>([]);
  const [series, setSeries]           = useState<TaxonomyTerm[]>([]);
  const [markets, setMarkets]         = useState<TaxonomyTerm[]>([]);
  const [sustainable, setSustainable] = useState<TaxonomyTerm[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  const [search,           setSearch]           = useState('');
  const [activeCategory,   setActiveCategory]   = useState('');
  const [activeSeries,     setActiveSeries]     = useState('');
  const [activeMarket,     setActiveMarket]     = useState('');
  const [activeSustainable,setActiveSustainable]= useState('');

  useEffect(() => {
    Promise.all([
      getProducts(),
      getAllCategories(),
      getAllSeries(),
      getAllMarkets(),
      getAllSustainable(),
    ])
      .then(([prods, cats, ser, mkts, sus]) => {
        setProducts(prods);
        setCategories(cats);
        setSeries(ser);
        setMarkets(mkts);
        setSustainable(sus);
      })
      .catch(() => setError('Could not load products. Check that the WordPress API URL is configured.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const terms = p._embedded?.['wp:term'] ?? [];
      const hasTerm = (idx: number, slug: string) =>
        (terms[idx] ?? []).some((t: TaxonomyTerm) => t.slug === slug);

      if (search && !p.title.rendered.toLowerCase().includes(search.toLowerCase())) return false;
      if (activeCategory    && !hasTerm(TERM_IDX.category,    activeCategory))    return false;
      if (activeSeries      && !hasTerm(TERM_IDX.series,      activeSeries))      return false;
      if (activeMarket      && !hasTerm(TERM_IDX.markets,     activeMarket))      return false;
      if (activeSustainable && !hasTerm(TERM_IDX.sustainable, activeSustainable)) return false;
      return true;
    });
  }, [products, search, activeCategory, activeSeries, activeMarket, activeSustainable]);

  const hasActiveFilters =
    !!search || !!activeCategory || !!activeSeries || !!activeMarket || !!activeSustainable;

  const clearAll = () => {
    setSearch('');
    setActiveCategory('');
    setActiveSeries('');
    setActiveMarket('');
    setActiveSustainable('');
  };

  const productFilters = [
    { title: 'Product Type', terms: categories,  active: activeCategory,    onChange: setActiveCategory },
    { title: 'Series',       terms: series,       active: activeSeries,      onChange: setActiveSeries },
    { title: 'Markets',      terms: markets,      active: activeMarket,      onChange: setActiveMarket },
    { title: 'Sustainable',  terms: sustainable,  active: activeSustainable, onChange: setActiveSustainable },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      <div className="flex gap-8 items-start">
        {/* Sidebar */}
        <FilterSidebar
          search={search}
          onSearch={setSearch}
          productFilters={productFilters}
          onClearAll={clearAll}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {/* Result count */}
          <p className="text-sm text-gray-500 mb-5">
            {loading
              ? 'Loading…'
              : error
              ? ''
              : `Showing ${filtered.length} of ${products.length} product${products.length !== 1 ? 's' : ''}`}
          </p>

          {error && (
            <div className="border border-red-200 bg-red-50 text-red-700 text-sm rounded px-4 py-3">
              {error}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <p className="text-gray-500 text-sm">No products match your filters.</p>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  categories={getEmbeddedTerms(product, TERM_IDX.category)}
                  markets={getEmbeddedTerms(product, TERM_IDX.markets)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
