import { ProductCard } from "./ProductCard";
import type { SelectProduct } from "@/db/schema";

interface ProductGridProps {
  products: SelectProduct[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <section className="px-4 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-12 lg:mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"></div>
            <span className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">
              Featured Collection
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
            Browse Our <span className="text-emerald-400">Products</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl">
            Pilihan terbaik dengan kualitas premium. Semua produk telah terverifikasi dan siap dikirim ke seluruh Indonesia.
          </p>
        </div>

        {/* Products grid or empty state */}
        {products.length === 0 ? (
          <div className="grid place-items-center min-h-[400px] rounded-2xl border-2 border-dashed border-slate-700/50 bg-slate-900/20 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold text-slate-300 mb-2">
                No Products Yet
              </h3>
              <p className="text-slate-400 mb-6">
                Be the first to add a product to this marketplace!
              </p>
              <p className="text-sm text-slate-500">
                Click the <span className="font-semibold">+</span> button in the bottom right to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Info section */}
        {products.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-800/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-black text-cyan-400 mb-2">
                  {products.length}
                </div>
                <p className="text-slate-400">Total Products</p>
              </div>
              <div>
                <div className="text-3xl font-black text-emerald-400 mb-2">
                  {Math.max(...products.map((p) => p.price)).toLocaleString(
                    "id-ID"
                  )}
                </div>
                <p className="text-slate-400">Max Price</p>
              </div>
              <div>
                <div className="text-3xl font-black text-blue-400 mb-2">
                  {Math.min(...products.map((p) => p.price)).toLocaleString(
                    "id-ID"
                  )}
                </div>
                <p className="text-slate-400">Min Price</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
