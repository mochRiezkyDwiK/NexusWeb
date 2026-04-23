"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { addProductAction } from "@/app/lib/actions";

export function AddProductModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await addProductAction(formData);
      setIsOpen(false);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 group p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-110"
        aria-label="Add new product"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Modal backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Modal content */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl shadow-2xl shadow-black/50">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-slate-800/95 to-slate-900/95 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Add New Product</h2>
                <p className="text-slate-400 text-sm mt-1">
                  Fill in the details below to add a new product to your marketplace
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Product name */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter product name"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900/80 transition-all"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Price (IDR) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  placeholder="Enter price in IDR"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900/80 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  placeholder="Describe your product..."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900/80 transition-all resize-none"
                ></textarea>
              </div>

              {/* Source URL (optional) */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Source URL (Optional)
                </label>
                <input
                  type="url"
                  name="source_url"
                  placeholder="https://example.com/product"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900/80 transition-all"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-slate-300 font-semibold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-cyan-500/25"
                >
                  {isLoading ? "Adding..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
