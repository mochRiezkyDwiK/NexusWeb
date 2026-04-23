import { ShoppingCart, ExternalLink } from "lucide-react";
import type { SelectProduct } from "@/db/schema";

interface ProductCardProps {
  product: SelectProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <div className="group relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 backdrop-blur-xl hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 p-6 flex flex-col">
      {/* Glassmorphism overlay on hover */}
      <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-cyan-500/5 to-emerald-500/5 transition-opacity duration-300"></div>

      {/* Icon badge */}
      <div className="mb-4 inline-flex w-fit p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/50 transition-all">
        <ShoppingCart className="w-6 h-6 text-cyan-400" />
      </div>

      {/* Product name */}
      <h3 className="text-xl font-bold text-slate-100 mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">
        {product.name}
      </h3>

      {/* Product description */}
      <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-grow">
        {product.description || "Produk berkualitas premium dengan harga terjangkau"}
      </p>

      {/* Price section */}
      <div className="mb-4 pt-4 border-t border-slate-700/50">
        <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          {formattedPrice}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {product.createdAt
            ? new Date(product.createdAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Baru"}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/20">
          Add to Cart
        </button>
        {product.sourceUrl && (
          <a
            href={product.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-cyan-400 border border-slate-700/50 hover:border-cyan-500/50 rounded-lg transition-all"
            title="View source"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        )}
      </div>
    </div>
  );
}
