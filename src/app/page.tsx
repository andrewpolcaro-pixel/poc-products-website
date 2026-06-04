'use client';

import { useEffect, useState, useMemo } from 'react';
import { getProducts, getAllCategories, getAllMarkets, getEmbeddedTerms, Product, TaxonomyTerm } from '@/lib/wordpress';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<TaxonomyTerm[]>([]);
  const [markets, setMarkets] = useState<TaxonomyTerm[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [activeMarket, setActiveMarket] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getProducts(), getAllCategories(), getAllMarkets()])
      .then(([prods, cats, mkts]) => {
        setProducts(prods);
        setCategories(cats);
        setMarkets(mkts);
      })
      .catch(() => setError('Failed to load products. Check the WordPress API URL.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const terms = p._embedded?.['wp:term'] ?? [];
      const catSlugs = (terms[0] ?? []).map((t: TaxonomyTerm) => t.slug);
      const mktSlugs = (terms[8] ?? []).map((t: TaxonomyTerm) => t.slug); // markets at index 8

      if (activeCategory && !catSlugs.includes(activeCategory)) return false;
      if (activeMarket && !mktSlugs.includes(activeMarket)) return false;
      if (search && !p.title.rendered.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [products, activeCategory, activeMarket, search]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
        <input
          type="search"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-2 w-full max-w-sm rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading && <p className="text-gray-500">Loading…</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="flex gap-10">
          <FilterSidebar
            categories={categories}
            markets={markets}
            activeCategory={activeCategory}
            activeMarket={activeMarket}
            onCategoryChange={setActiveCategory}
            onMarketChange={setActiveMarket}
            onReset={() => { setActiveCategory(''); setActiveMarket(''); }}
          />

          <div className="flex-1">
            {filtered.length === 0 ? (
              <p className="text-gray-500">No products match your filters.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    categories={getEmbeddedTerms(product, 0)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
