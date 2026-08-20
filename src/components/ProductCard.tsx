import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group flex flex-col">
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative aspect-3/4 overflow-hidden rounded-md bg-beige shadow-sm transition-all duration-500 group-hover:shadow-[0_20px_40px_-15px_rgba(184,155,94,0.35)]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            draggable={true}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <h3 className="font-serif text-base text-black transition-colors group-hover:text-gold-dark">
            {product.name}
          </h3>
          <p className="text-sm tracking-wide text-gray">{product.price} DA</p>
        </div>
      </Link>

      <Link
        href={`/products/${product._id}`}
        className="mt-3 border border-black py-2.5 text-center text-sm uppercase tracking-wide text-black transition-colors hover:border-gold hover:bg-gold hover:text-white"
      >
        Order Now
      </Link>
    </div>
  );
}
