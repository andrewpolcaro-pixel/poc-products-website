import Link from 'next/link';
import Image from 'next/image';
import { Product, TaxonomyTerm } from '@/lib/wordpress';

interface Props {
  product: Product;
  categories: TaxonomyTerm[];
}

export default function ProductCard({ product, categories }: Props) {
  const title = product.title.rendered;
  const href = `/products/${product.slug}`;

  return (
    <Link
      href={href}
      className="group flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square bg-gray-100">
        {product.featured_image_url ? (
          <Image
            src={product.featured_image_url}
            alt={title}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300 text-4xl">
            &#9633;
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h2 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
          {title}
        </h2>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <span
                key={cat.id}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
