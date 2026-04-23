import { ArrowRight, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[500px] flex flex-col items-center justify-center px-4 py-20 lg:py-32 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm mb-6 hover:border-cyan-500/50 transition-all">
        <Zap className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-medium text-slate-300">
          Powered by TiDB Cloud
        </span>
      </div>

      {/* Main heading */}
      <div className="text-center max-w-4xl mx-auto mb-8">
        <h1 className="text-5xl lg:text-7xl font-black mb-6 tracking-tight">
          <span className="bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            Discover Premium
          </span>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Products Today
          </span>
        </h1>

        <p className="text-lg lg:text-xl text-slate-400 leading-relaxed mb-8 max-w-2xl mx-auto">
          Jelajahi koleksi produk terlengkap dengan harga terbaik. Semua tersimpan aman di cloud dengan teknologi TiDB.
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 flex items-center gap-2">
          Explore Products
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <button className="px-8 py-4 border border-slate-700 hover:border-emerald-500/50 bg-slate-900/50 hover:bg-slate-900/80 text-slate-300 hover:text-emerald-400 font-bold rounded-lg transition-all backdrop-blur-sm">
          Learn More
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-slate-800/50 w-full max-w-2xl">
        <div className="text-center">
          <div className="text-3xl lg:text-4xl font-black text-cyan-400 mb-2">
            500+
          </div>
          <div className="text-sm text-slate-400">Products Listed</div>
        </div>
        <div className="text-center">
          <div className="text-3xl lg:text-4xl font-black text-emerald-400 mb-2">
            99.9%
          </div>
          <div className="text-sm text-slate-400">Uptime</div>
        </div>
        <div className="text-center">
          <div className="text-3xl lg:text-4xl font-black text-blue-400 mb-2">
            24/7
          </div>
          <div className="text-sm text-slate-400">Support</div>
        </div>
      </div>
    </section>
  );
}
