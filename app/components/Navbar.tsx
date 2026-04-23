import { ShoppingBag } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/50 border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/50 group-hover:border-cyan-400/70 transition-colors">
            <ShoppingBag className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="hidden sm:block">
            <div className="text-lg font-black">
              <span className="text-white">NEXUS</span>
              <span className="text-cyan-400">WEB</span>
            </div>
            <div className="text-xs text-slate-500">Marketplace</div>
          </div>
        </div>

        {/* Navigation links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#products"
            className="text-slate-400 hover:text-cyan-400 font-medium transition-colors"
          >
            Products
          </a>
          <a href="#" className="text-slate-400 hover:text-cyan-400 font-medium transition-colors">
            About
          </a>
          <a href="#" className="text-slate-400 hover:text-cyan-400 font-medium transition-colors">
            Contact
          </a>
        </div>

        {/* Cart button */}
        <button className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-cyan-400 border border-slate-700/50 hover:border-cyan-500/50 transition-all">
          <ShoppingBag className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}
