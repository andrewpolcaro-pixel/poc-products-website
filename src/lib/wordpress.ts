const WP_API = process.env.NEXT_PUBLIC_WP_API_URL ?? 'https://your-wordpress-site.com/wp-json/wp/v2';

export interface TaxonomyTerm {
  id: number;
  name: string;
  slug: string;
}

export interface SpecRow {
  item: string;
  capacity: string;
  dosage: string;
  height: string;
  diameter: string;
  body_height: string;
  pump_options: string;
  special_function: string;
}

export interface Product {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  featured_image_url: string | null;
  meta: {
    poc_neck: string;
    poc_specs: SpecRow[];
  };
  // taxonomy term IDs
  product_category: number[];
  product_tag: number[];
  product_series: number[];
  product_cap_material: number[];
  product_actuator_material: number[];
  product_pump_body_material: number[];
  product_bottle_material: number[];
  product_sustainable: number[];
  product_markets: number[];
  _embedded?: {
    'wp:term'?: TaxonomyTerm[][];
  };
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${WP_API}${path}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`WP API error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export async function getProducts(): Promise<Product[]> {
  return apiFetch<Product[]>('/products?_embed=true&per_page=100');
}

export async function getProduct(slug: string): Promise<Product | null> {
  const results = await apiFetch<Product[]>(`/products?slug=${slug}&_embed=true`);
  return results[0] ?? null;
}

export async function getTerms(taxonomy: string): Promise<TaxonomyTerm[]> {
  return apiFetch<TaxonomyTerm[]>(`/${taxonomy}?per_page=100`);
}

export async function getAllCategories(): Promise<TaxonomyTerm[]> {
  return getTerms('product-categories');
}

export async function getAllMarkets(): Promise<TaxonomyTerm[]> {
  return getTerms('product-markets');
}

/**
 * Resolve embedded taxonomy terms by position in _embedded['wp:term'].
 * Order matches taxonomy registration order in taxonomies.php:
 *   0: product_category, 1: product_tag, 2: product_series,
 *   3: product_cap_material, 4: product_actuator_material,
 *   5: product_pump_body_material, 6: product_bottle_material,
 *   7: product_sustainable, 8: product_markets
 */
export function getEmbeddedTerms(product: Product, index: number): TaxonomyTerm[] {
  return product._embedded?.['wp:term']?.[index] ?? [];
}
