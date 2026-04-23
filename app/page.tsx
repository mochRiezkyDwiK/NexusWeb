import { db } from "@/db";
import { products } from "@/db/schema";
import { Navbar } from "@/app/components/Navbar";
import { HeroSection } from "@/app/components/HeroSection";
import { ProductGrid } from "@/app/components/ProductGrid";
import { AddProductModal } from "@/app/components/AddProductModal";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch all products from TiDB Cloud
  const allProducts = await db.select().from(products);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Product Grid Section */}
      <ProductGrid products={allProducts} />

      {/* Floating Add Product Button & Modal */}
      <AddProductModal />

      {/* Footer */}
      <footer className="bg-slate-950/80 border-t border-slate-800/50 py-12 px-4 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="text-lg font-black mb-4">
                <span className="text-white">NEXUS</span>
                <span className="text-cyan-400">WEB</span>
              </div>
              <p className="text-slate-400 text-sm">
                Premium marketplace dengan teknologi cloud terdepan.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#products" className="hover:text-cyan-400 transition-colors">
                    Products
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    About
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-400 transition-colors">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Email: hello@nexusweb.id</li>
                <li>Phone: +62 800-NEXUS-ID</li>
                <li>Location: Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-slate-500">
              © 2024 NEXUSWEB. Semua hak dilindungi.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors text-sm">
                Twitter
              </a>
              <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors text-sm">
                Instagram
              </a>
              <a href="#" className="text-slate-500 hover:text-cyan-400 transition-colors text-sm">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}