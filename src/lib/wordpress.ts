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
  product_category: number[];
  product_tag: number[];
  product_series: number[];
  product_cap_material: number[];
  product_actuator_material: number[];
  product_pump_body_material: number[];
  product_bottle_material: number[];
  product_sustainable: number[];
  product_markets: number[];
  _embedded?: { 'wp:term'?: TaxonomyTerm[][] };
}

// Embedded term index map — matches taxonomy registration order in taxonomies.php
export const TERM_IDX = {
  category:         0,
  tag:              1,
  series:           2,
  capMaterial:      3,
  actuatorMaterial: 4,
  pumpBodyMaterial: 5,
  bottleMaterial:   6,
  sustainable:      7,
  markets:          8,
} as const;

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

export async function getTerms(restBase: string): Promise<TaxonomyTerm[]> {
  return apiFetch<TaxonomyTerm[]>(`/${restBase}?per_page=100`);
}

export const getAllCategories  = () => getTerms('product-categories');
export const getAllSeries      = () => getTerms('product-series');
export const getAllMarkets     = () => getTerms('product-markets');
export const getAllSustainable = () => getTerms('product-sustainable');

export function getEmbeddedTerms(product: Product, index: number): TaxonomyTerm[] {
  return product._embedded?.['wp:term']?.[index] ?? [];
}
