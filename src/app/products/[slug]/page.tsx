import { getProduct, getEmbeddedTerms, TERM_IDX } from '@/lib/wordpress';
import ProductDetails from '@/components/ProductDetails';
import SpecsTable from '@/components/SpecsTable';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  return { title: product?.title.rendered ?? 'Product' };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const categories      = getEmbeddedTerms(product, TERM_IDX.category);
  const tags            = getEmbeddedTerms(product, TERM_IDX.tag);
  const series          = getEmbeddedTerms(product, TERM_IDX.series);
  const capMaterial     = getEmbeddedTerms(product, TERM_IDX.capMaterial);
  const actuatorMat     = getEmbeddedTerms(product, TERM_IDX.actuatorMaterial);
  const pumpBodyMat     = getEmbeddedTerms(product, TERM_IDX.pumpBodyMaterial);
  const bottleMat       = getEmbeddedTerms(product, TERM_IDX.bottleMaterial);
  const sustainable     = getEmbeddedTerms(product, TERM_IDX.sustainable);
  const markets         = getEmbeddedTerms(product, TERM_IDX.markets);

  const neck  = product.meta?.poc_neck ?? '';
  const specs = product.meta?.poc_specs ?? [];

  const detailRows = [
    { label: 'Series',             terms: series },
    { label: 'Cap Material',       terms: capMaterial },
    { label: 'Actuator Material',  terms: actuatorMat },
    { label: 'Pump Body Material', terms: pumpBodyMat },
    { label: 'Bottle Material',    terms: bottleMat },
    { label: 'Sustainable',        terms: sustainable },
    { label: 'Markets',            terms: markets },
  ];

  const title = product.title.rendered;

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-brand transition-colors">Products</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium uppercase">{title}</span>
      </nav>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {product.featured_image_url ? (
            <Image
              src={product.featured_image_url}
              alt={title}
              fill
              className="object-contain p-8"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300">
              No image
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide mb-3">
            {title}
          </h1>

          {/* Categories / Tags */}
          {(categories.length > 0 || tags.length > 0) && (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm mb-5 pb-5 border-b border-gray-200">
              {categories.length > 0 && (
                <>
                  <span className="text-gray-500">Categories:</span>
                  {categories.map((c, i) => (
                    <span key={c.id} className="text-brand font-medium">
                      {c.name}{i < categories.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </>
              )}
              {tags.length > 0 && (
                <>
                  {categories.length > 0 && <span className="text-gray-400 mx-0.5">/</span>}
                  <span className="text-gray-500">Tags:</span>
                  {tags.map((t, i) => (
                    <span key={t.id} className="text-brand font-medium">
                      {t.name}{i < tags.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Description */}
          <div
            className="prose prose-sm max-w-none text-gray-700 mb-6"
            dangerouslySetInnerHTML={{ __html: product.content.rendered }}
          />

          {/* CTA */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">
              Interested in this product? Contact our team to request a sample or get pricing.
            </p>
            <a
              href="mailto:info@packagegroupllc.com"
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-dark text-white font-semibold text-sm px-6 py-3 transition-colors"
            >
              Request a Quote
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Product Details table */}
      <div className="mt-12">
        <ProductDetails rows={detailRows} neck={neck} />
      </div>

      {/* Specs table */}
      <SpecsTable specs={specs} />
    </div>
  );
}
