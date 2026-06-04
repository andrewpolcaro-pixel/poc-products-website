import Link from 'next/link';
import Image from 'next/image';
import { Product, TaxonomyTerm } from '@/lib/wordpress';

interface Props {
  product: Product;
  categories: TaxonomyTerm[];
  markets: TaxonomyTerm[];
}

export default function ProductCard({ product, categories, markets }: Props) {
  const title = product.title.rendered;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {product.featured_image_url ? (
          <Image
            src={product.featured_image_url}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300 text-sm">
            No image
          </div>
        )}
      </div>

      {/* Text */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <h2 className="font-bold text-gray-900 uppercase text-sm leading-snug tracking-wide group-hover:text-brand transition-colors">
          {title}
        </h2>

        {categories.length > 0 && (
          <p className="text-brand font-semibold text-sm">
            {categories.map((c) => c.name).join(', ')}
          </p>
        )}

        {markets.length > 0 && (
          <p className="text-gray-500 text-xs">
            {markets.map((m) => m.name).join(', ')}
          </p>
        )}
      </div>
    </Link>
  );
}
