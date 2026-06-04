import { getProduct, getEmbeddedTerms } from '@/lib/wordpress';
import ProductDetails from '@/components/ProductDetails';
import SpecsTable from '@/components/SpecsTable';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  // Taxonomy term order matches registration in taxonomies.php (neck removed):
  // 0: category, 1: tag, 2: series,
  // 3: cap_material, 4: actuator_material, 5: pump_body_material,
  // 6: bottle_material, 7: sustainable, 8: markets
  const categories       = getEmbeddedTerms(product, 0);
  const tags             = getEmbeddedTerms(product, 1);
  const series           = getEmbeddedTerms(product, 2);
  const capMaterial      = getEmbeddedTerms(product, 3);
  const actuatorMaterial = getEmbeddedTerms(product, 4);
  const pumpBodyMaterial = getEmbeddedTerms(product, 5);
  const bottleMaterial   = getEmbeddedTerms(product, 6);
  const sustainable      = getEmbeddedTerms(product, 7);
  const markets          = getEmbeddedTerms(product, 8);

  const neck = product.meta?.poc_neck ?? '';
  const specs = product.meta?.poc_specs ?? [];

  const detailRows = [
    { label: 'Series',             terms: series },
    { label: 'Cap Material',       terms: capMaterial },
    { label: 'Actuator Material',  terms: actuatorMaterial },
    { label: 'Pump Body Material', terms: pumpBodyMaterial },
    { label: 'Bottle Material',    terms: bottleMaterial },
    { label: 'Sustainable',        terms: sustainable },
    { label: 'Markets',            terms: markets },
  ];

  const title = product.title.rendered;

  return (
    <div>
      <Link href="/" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        &larr; Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-4">
        {/* Image */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
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
            <div className="flex items-center justify-center h-full text-gray-300 text-6xl">
              &#9633;
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>

          <hr className="border-gray-200 mb-4" />

          {/* Taxonomy badges */}
          <div className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm text-gray-500 mb-6">
            {categories.length > 0 && (
              <>
                <span className="font-medium text-gray-600">Categories:</span>
                {categories.map((c, i) => (
                  <span key={c.id} className="text-blue-600">
                    {c.name}{i < categories.length - 1 ? ',' : ''}
                  </span>
                ))}
              </>
            )}
            {tags.length > 0 && (
              <>
                <span className="mx-1">/</span>
                <span className="font-medium text-gray-600">Tags:</span>
                {tags.map((t, i) => (
                  <span key={t.id} className="text-blue-600">
                    {t.name}{i < tags.length - 1 ? ',' : ''}
                  </span>
                ))}
              </>
            )}
          </div>

          {/* Description */}
          <div
            className="prose prose-sm max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: product.content.rendered }}
          />

          {/* Neck (meta dropdown) + taxonomy details */}
          <ProductDetails
            rows={detailRows}
            neck={neck}
          />
        </div>
      </div>

      {/* Full-width specs table below the two-column layout */}
      <SpecsTable specs={specs} />
    </div>
  );
}
