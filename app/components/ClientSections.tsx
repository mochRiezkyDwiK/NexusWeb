"use client";
/* eslint-disable @typescript-eslint/no-unused-vars, react/no-array-index-key, react/prefer-read-only-props, react/function-component-definition, react-hooks/rules-of-hooks, react/no-unstable-nested-components, react/jsx-pascal-case, jsx-a11y/anchor-is-valid, no-nested-ternary */

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useActionState, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { useFormStatus } from "react-dom";
import {
  Zap, Star, Shield, Globe, Package, ArrowRight, Plus,
  ChevronDown, X, Loader2, Check, Menu,
  Mail, Phone, MapPin, Send, TrendingUp, Users,
  Clock, ChevronRight, ExternalLink, Copy, CheckCheck, MessageCircle,
  Cpu, Database, Lock, BarChart3,
  AlertCircle, Trash2, Pencil,
} from "lucide-react";
import { addProductAction, updateProductAction, deleteProductAction, saveContactMessage } from "@/app/lib/actions";

// ── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  price: string | number;
  description: string | null;
  category?: string;
  sourceUrl?: string | null;
  createdAt?: string | Date | null;
  source_url?: string | null;
  created_at?: string | Date | null;
}
interface Props { products: Product[]; session: Session | null; isAdmin?: boolean }

// ── Easing ───────────────────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1] as const;

// ── useCountUp ───────────────────────────────────────────────────────────────
function useCountUp(target: number, decimals = 0) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const total = 1800;
    const step = 16;
    const inc = target / (total / step);
    const t = setInterval(() => {
      start += inc;
      if (start >= target) { setVal(target); clearInterval(t); }
      else setVal(Number.parseFloat(start.toFixed(decimals)));
    }, step);
    return () => clearInterval(t);
  }, [inView, target, decimals]);
  return { val, ref };
}

// ── FadeIn ───────────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, y = 30, className = "" }: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease }}
    >{children}</motion.div>
  );
}

// ── SectionLabel ─────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/6 mb-4">
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
      <span className="text-cyan-400 text-[11px] font-bold tracking-[0.2em] uppercase">{children}</span>
    </div>
  );
}

function FloatingField({
  id,
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  inputRef,
  inputMode,
  enterKeyHint,
  onKeyDown,
  autoComplete,
  name,
  rows = 3,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
  inputRef?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  enterKeyHint?: React.InputHTMLAttributes<HTMLInputElement>["enterKeyHint"];
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  autoComplete?: string;
  name?: string;
  rows?: number;
}) {
  const base = "peer w-full bg-slate-900/50 border rounded-xl px-4 pt-6 pb-3 text-white text-sm transition-all duration-200 placeholder-transparent";
  const borderCls = "border-slate-700/50 hover:border-slate-600/60 focus:border-cyan-400/50 focus:shadow-[0_0_0_3px_rgba(6,182,212,0.06)]";

  return (
    <div className="relative group">
      <label
        htmlFor={id}
        className="absolute left-4 top-4 pointer-events-none font-medium text-sm text-slate-500 transition-all duration-200 peer-focus:top-2.5 peer-focus:text-[10px] peer-focus:text-cyan-400 peer-focus:tracking-widest peer-focus:uppercase peer-not-placeholder-shown:top-2.5 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-cyan-400 peer-not-placeholder-shown:tracking-widest peer-not-placeholder-shown:uppercase"
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={rows}
          ref={inputRef as React.Ref<HTMLTextAreaElement>}
          name={name}
          value={value}
          placeholder=" "
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          enterKeyHint={enterKeyHint}
          autoComplete={autoComplete}
          className={`${base} ${borderCls} min-h-30 resize-y`}
        />
      ) : (
        <input
          id={id}
          type={type}
          ref={inputRef as React.Ref<HTMLInputElement>}
          name={name}
          value={value}
          placeholder=" "
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          inputMode={inputMode}
          enterKeyHint={enterKeyHint}
          autoComplete={autoComplete}
          className={`${base} ${borderCls}`}
        />
      )}
    </div>
  );
}

function ContactSubmitButton({ isSuccess }: { isSuccess: boolean }) {
  const { pending } = useFormStatus();
  let content: React.ReactNode;

  if (pending) {
    content = <><Loader2 size={16} className="animate-spin" /> Mengirim...</>;
  } else if (isSuccess) {
    content = <><Check size={15} /> Pesan Terkirim!</>;
  } else {
    content = <><Send size={15} /> Kirim Pesan</>;
  }

  return (
    <button
      type="submit"
      disabled={pending || isSuccess}
      className="w-full h-12 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2.5 relative overflow-hidden disabled:opacity-60"
      style={{ background: "linear-gradient(135deg,#06b6d4,#6366f1)" }}
    >
      {content}
      <motion.div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: "-200%" }}
        whileHover={{ x: "200%" }}
        transition={{ duration: 0.5 }} />
    </button>
  );
}

// ── Magnetic Button ───────────────────────────────────────────────────────────
function MagneticBtn({ children, onClick, className = "", style = {} }: {
  children: React.ReactNode; onClick?: () => void; className?: string; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.25);
    y.set((e.clientY - r.top - r.height / 2) * 0.25);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button ref={ref} onClick={onClick} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ x: sx, y: sy, ...style }} className={className}
      whileTap={{ scale: 0.96 }}
    >{children}</motion.button>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ onAddProduct, isAdmin, isLoggedIn }: { onAddProduct: () => void; isAdmin: boolean; isLoggedIn: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { href: "#hero", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#products", label: "Products" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
      >
        <div className={`max-w-6xl mx-auto flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-500 ${
          scrolled ? "glass glow-cyan-sm" : "bg-transparent"
        }`}>
          {/* Logo */}
          <a href="#hero" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#06b6d4,#6366f1)" }}>
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-display text-base font-black tracking-tight">
              <span className="text-white">NEXUS</span>
              <span className="text-gradient">WEB</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a key={l.href} href={l.href}
                onClick={() => setActive(l.label)}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active === l.label
                    ? "text-cyan-400 bg-cyan-500/8"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}>
                {l.label}
                {active === l.label && (
                  <motion.div layoutId="nav-indicator"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400" />
                )}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => signOut({ redirectTo: "/" })}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 border border-slate-700/60 hover:bg-slate-800/60 transition-colors"
              >
                Logout
              </button>
            ) : (
              <button
                type="button"
                onClick={() => signIn("github")}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 border border-slate-700/60 hover:bg-slate-800/60 transition-colors"
              >
                Login
              </button>
            )}

            {isAdmin && (
              <motion.button onClick={onAddProduct}
                whileHover={{ scale: 1.03, boxShadow: "0 0 24px rgba(6,182,212,0.3)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white relative overflow-hidden"
                style={{ background: "linear-gradient(135deg,#06b6d4,#6366f1)" }}>
                <Plus size={14} />
                Add Product
                <motion.div className="absolute inset-0 bg-white/10"
                  initial={{ x: "-100%", skewX: -20 }}
                  whileHover={{ x: "200%" }}
                  transition={{ duration: 0.45 }}
                />
              </motion.button>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800/60 text-slate-400">
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-4 right-4 z-40 glass rounded-2xl p-4 space-y-1">
            {links.map((l) => (
              <a key={l.href} href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all">
                {l.label}
              </a>
            ))}
            <div className="pt-2">
              {isAdmin ? (
                <button onClick={() => { onAddProduct(); setMobileOpen(false); }}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#06b6d4,#6366f1)" }}>
                  + Add Product
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    if (isLoggedIn) {
                      signOut({ redirectTo: "/" });
                    } else {
                      signIn("github");
                    }
                  }}
                  className="w-full py-3 rounded-xl text-sm font-bold text-slate-100 border border-slate-700/60"
                >
                  {isLoggedIn ? "Logout" : "Login"}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Ticker ────────────────────────────────────────────────────────────────────
function Ticker() {
  const items = [
    "🚀 Premium Marketplace", "⚡ TiDB Cloud Powered", "🔒 Enterprise Security",
    "🌏 Indonesia #1 Platform", "💎 10K+ Products", "⭐ 4.98 Rating",
    "🚀 Premium Marketplace", "⚡ TiDB Cloud Powered", "🔒 Enterprise Security",
    "🌏 Indonesia #1 Platform", "💎 10K+ Products", "⭐ 4.98 Rating",
  ];
  return (
    <div className="overflow-hidden border-y border-slate-800/60 py-3 bg-slate-950/50">
      <div className="flex gap-12 animate-ticker whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="text-slate-500 text-xs font-medium tracking-wider shrink-0">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero({ onAddProduct }: { onAddProduct: () => void }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const floats = [
    { icon: Zap, x: "7%", top: "28%", color: "#22d3ee", delay: 0 },
    { icon: Star, x: "87%", top: "22%", color: "#818cf8", delay: 0.4 },
    { icon: Shield, x: "5%", top: "65%", color: "#34d399", delay: 0.8 },
    { icon: TrendingUp, x: "88%", top: "62%", color: "#f472b6", delay: 0.6 },
    { icon: Globe, x: "76%", top: "40%", color: "#fbbf24", delay: 1.1 },
    { icon: Database, x: "18%", top: "78%", color: "#a78bfa", delay: 1.4 },
  ];

  return (
    <section id="hero" ref={ref} className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-20">
      {/* BG orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-225 h-150 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse, #06b6d4 0%, transparent 70%)" }} />
        <div className="absolute top-1/2 left-1/4 w-150 h-150 rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(ellipse, #6366f1 0%, transparent 70%)" }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(rgba(6,182,212,1) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,1) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }} />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 text-center max-w-5xl mx-auto w-full">
        {/* Badge */}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass mb-10 border border-cyan-500/20">
          <div className="flex gap-0.5">
            {[0,1,2].map(i => (
              <motion.div key={i} className="w-1 h-1 rounded-full bg-cyan-400"
                animate={{ opacity: [0.3,1,0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
            ))}
          </div>
          <span className="text-xs font-bold text-slate-300 tracking-wide">Platform Marketplace Terdepan di Indonesia</span>
          <ChevronRight size={12} className="text-cyan-400" />
        </motion.div>

        {/* Headline */}
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          className="font-display text-[clamp(3.5rem,10vw,8rem)] font-black leading-[0.88] tracking-tight mb-6">
          <span className="block text-white">THE FUTURE</span>
          <span className="block text-white">OF</span>
          <span className="block text-gradient animate-gradient">COMMERCE</span>
        </motion.h1>

        {/* Sub */}
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="text-slate-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed font-light">
          Platform marketplace premium yang ditenagai{" "}
          <span className="text-slate-300 font-medium">TiDB Cloud</span> — skalabilitas tanpa batas,
          performa tanpa kompromi.
        </motion.p>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticBtn onClick={onAddProduct}
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl text-[13px] font-bold text-white relative overflow-hidden"
            style={{ background: "linear-gradient(135deg,#06b6d4 0%,#6366f1 100%)", boxShadow: "0 0 40px rgba(6,182,212,0.2)" }}>
            <Plus size={15} />
            Mulai Berjualan
            <motion.div className="absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent"
              initial={{ x: "-200%" }} whileHover={{ x: "200%" }}
              transition={{ duration: 0.5 }} />
          </MagneticBtn>

          <motion.a href="#products" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2.5 px-8 py-4 rounded-2xl text-[13px] font-bold text-slate-300 glass glass-hover transition-all">
            Jelajahi Produk
            <ArrowRight size={14} />
          </motion.a>
        </motion.div>

        {/* Trust indicators */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center justify-center gap-6 mt-12 flex-wrap">
          {[
            { label: "12K+ Pengguna" },
            { label: "99.9% Uptime" },
            { label: "Zero Data Loss" },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-slate-400 text-xs font-medium">{t.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Floating Icons */}
      {floats.map((f, i) => (
        <motion.div key={i} initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: f.delay + 0.9 }}
          style={{ position: "absolute", left: f.x, top: f.top }}
          className="hidden xl:block">
          <motion.div animate={{ y: [0, -12, 0], rotate: [0, 4, -4, 0] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: `${f.color}12`,
              border: `1px solid ${f.color}25`,
              backdropFilter: "blur(10px)",
              color: f.color,
            }}>
            <f.icon size={20} />
          </motion.div>
        </motion.div>
      ))}

      {/* Scroll hint */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-600">
        <span className="text-[9px] uppercase tracking-[0.25em] font-bold">Scroll</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ChevronDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ── Stats ─────────────────────────────────────────────────────────────────────
function Stats() {
  const stats = [
    { value: 12400, suffix: "+", label: "Pengguna Aktif", icon: Users, decimals: 0 },
    { value: 8200, suffix: "+", label: "Produk Terdaftar", icon: Package, decimals: 0 },
    { value: 99.9, suffix: "%", label: "Uptime SLA", icon: Shield, decimals: 1 },
    { value: 4.98, suffix: "", label: "Rating Platform", icon: Star, decimals: 2 },
  ];

  return (
    <section className="py-8">
      <Ticker />
      <div className="max-w-6xl mx-auto px-4 mt-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => {
            const { val, ref } = useCountUp(s.value, s.decimals);
            return (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="relative p-6 rounded-2xl glass glass-hover transition-all duration-300 group overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-cyan-500/30 to-transparent" />
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity"
                    style={{ background: "radial-gradient(#06b6d4, transparent)" }} />
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:bg-cyan-500/15 transition-all">
                    <s.icon size={16} />
                  </div>
                  <div ref={ref} className="font-display text-3xl font-black text-white mb-1 tabular-nums">
                    {val.toLocaleString("id-ID", { maximumFractionDigits: s.decimals })}{s.suffix}
                  </div>
                  <div className="text-slate-500 text-xs font-medium uppercase tracking-wider">{s.label}</div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function About() {
  const features = [
    {
      icon: Cpu, title: "TiDB Cloud Infrastructure",
      desc: "Database terdistribusi dengan skalabilitas horizontal otomatis. Performa konsisten meski traffic melonjak jutaan request per detik.",
      tag: "Database",
    },
    {
      icon: Lock, title: "Enterprise-Grade Security",
      desc: "Enkripsi end-to-end AES-256, SSL/TLS, firewall berlapis, dan compliance SOC 2 Type II untuk keamanan data pengguna.",
      tag: "Security",
    },
    {
      icon: BarChart3, title: "Real-Time Analytics",
      desc: "Dashboard analitik live dengan insight produk, tren penjualan, dan perilaku pembeli — semua dalam satu panel kontrol.",
      tag: "Analytics",
    },
    {
      icon: Globe, title: "CDN Global Network",
      desc: "Aset ter-cache di edge node 180+ kota dunia. Latency sub-50ms untuk pengguna Indonesia maupun mancanegara.",
      tag: "Network",
    },
  ];

  const milestones = [
    { year: "2021", title: "Founded", desc: "NEXUSWEB lahir dari visi membangun ekosistem commerce masa depan." },
    { year: "2022", title: "Seed Round", desc: "Mendapat pendanaan awal dan meluncurkan beta platform ke 500 early adopters." },
    { year: "2023", title: "10K Users", desc: "Mencapai 10.000 pengguna aktif dengan GMV melebihi Rp 50 miliar." },
    { year: "2024", title: "Series A", desc: "Ekspansi ke 5 kota besar dan integrasi penuh dengan TiDB Cloud." },
  ];

  return (
    <section id="about" className="py-28 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <FadeIn className="text-center mb-20">
          <SectionLabel>Tentang Kami</SectionLabel>
          <h2 className="font-display text-4xl md:text-6xl font-black text-white leading-tight">
            Dibangun untuk<br />
            <span className="text-gradient">Skala Enterprise</span>
          </h2>
          <p className="text-slate-400 text-base mt-5 max-w-2xl mx-auto leading-relaxed">
            NEXUSWEB bukan sekadar marketplace. Kami adalah infrastruktur commerce generasi berikutnya —
            dibangun di atas teknologi database terdistribusi yang sama yang digunakan oleh perusahaan Fortune 500.
          </p>
        </FadeIn>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-5 mb-24">
          {features.map((f, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="relative p-6 rounded-2xl glass glass-hover group transition-all duration-300 overflow-hidden h-full">
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-700/60 to-transparent group-hover:via-cyan-500/40 transition-all" />
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,rgba(6,182,212,0.12),rgba(99,102,241,0.12))", border: "1px solid rgba(6,182,212,0.2)" }}>
                    <f.icon size={20} className="text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white font-bold text-sm">{f.title}</h3>
                      <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                        {f.tag}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Mission + Timeline */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Mission */}
          <FadeIn>
            <div className="space-y-6">
              <div>
                <SectionLabel>Misi Kami</SectionLabel>
                <h3 className="font-display text-3xl font-black text-white leading-tight mt-2">
                  Demokratisasi Commerce untuk Semua
                </h3>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Kami percaya setiap pengusaha — dari UMKM hingga korporasi — berhak mendapatkan
                infrastruktur kelas dunia. NEXUSWEB hadir untuk menghapus kesenjangan teknologi
                antara bisnis besar dan kecil.
              </p>
              <div className="space-y-3">
                {[
                  "Zero vendor lock-in — data Anda, kontrol Anda",
                  "99.9% SLA dengan kompensasi otomatis",
                  "Onboarding kurang dari 5 menit",
                  "Support 24/7 dalam Bahasa Indonesia",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                      <Check size={11} className="text-cyan-400" />
                    </div>
                    <span className="text-slate-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 pt-2">
                <motion.a href="#contact"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#06b6d4,#6366f1)" }}>
                  Mulai Gratis <ArrowRight size={14} />
                </motion.a>
                <a href="#products" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  Lihat Produk <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </FadeIn>

          {/* Timeline */}
          <FadeIn delay={0.15}>
            <div className="relative">
              <div className="absolute left-5.5 top-0 bottom-0 w-px bg-linear-to-b from-cyan-500/40 via-indigo-500/30 to-transparent" />
              <div className="space-y-6">
                {milestones.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex gap-5 pl-2">
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black z-10 relative"
                        style={{ background: "linear-gradient(135deg,rgba(6,182,212,0.2),rgba(99,102,241,0.2))", border: "1px solid rgba(6,182,212,0.3)", color: "#22d3ee" }}>
                        {m.year.slice(2)}
                      </div>
                    </div>
                    <div className="pt-1.5 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-bold text-sm">{m.title}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{m.year}</span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">{m.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ── Products ──────────────────────────────────────────────────────────────────
const BADGES = [
  { label: "🔥 Hot", bg: "rgba(249,115,22,0.12)", color: "#fb923c", border: "rgba(249,115,22,0.25)" },
  { label: "✨ New", bg: "rgba(6,182,212,0.12)", color: "#22d3ee", border: "rgba(6,182,212,0.25)" },
  { label: "⚡ Flash", bg: "rgba(234,179,8,0.12)", color: "#facc15", border: "rgba(234,179,8,0.25)" },
  { label: "💎 Premium", bg: "rgba(99,102,241,0.12)", color: "#818cf8", border: "rgba(99,102,241,0.25)" },
  { label: "🚀 Trending", bg: "rgba(244,114,182,0.12)", color: "#f472b6", border: "rgba(244,114,182,0.25)" },
];

function ProductCard({ product, index, size = "sm", onEdit, onDelete, canManage }: {
  product: Product;
  index: number;
  size?: "sm" | "md" | "lg";
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
  canManage: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const badge = BADGES[index % BADGES.length];
  const price = Number.parseFloat(String(product.price)) || 0;
  const imageUrl = product.sourceUrl ?? product.source_url ?? "";

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setTilt({
      x: ((e.clientX - r.left) / r.width - 0.5) * 10,
      y: ((e.clientY - r.top) / r.height - 0.5) * -10,
    });
  };

  return (
    <motion.div ref={ref} onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      animate={{ rotateY: tilt.x, rotateX: tilt.y, scale: hovered ? 1.015 : 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      style={{ transformStyle: "preserve-3d" }}
      className="h-full"
    >
      {(() => {
        let previewHeight = "100px";
        if (size === "lg") {
          previewHeight = "160px";
        } else if (size === "md") {
          previewHeight = "120px";
        }

        return (
      <div className="relative h-full rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group"
        style={{
          background: hovered
            ? "linear-gradient(135deg,rgba(6,182,212,0.04) 0%,rgba(8,15,31,0.95) 100%)"
            : "linear-gradient(135deg,rgba(15,23,42,0.85) 0%,rgba(8,15,31,0.95) 100%)",
          backdropFilter: "blur(24px)",
          border: hovered ? "1px solid rgba(6,182,212,0.25)" : "1px solid rgba(148,163,184,0.07)",
          boxShadow: hovered ? "0 0 30px rgba(6,182,212,0.08)" : "none",
        }}>
        <div className="absolute top-0 left-4 right-4 h-px bg-linear-to-r from-transparent via-slate-700/50 to-transparent group-hover:via-cyan-500/40 transition-all" />
        {canManage && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(product);
              }}
              className="h-8 w-8 rounded-lg border border-cyan-500/30 bg-slate-900/75 text-cyan-300 transition-colors hover:bg-cyan-500/20"
              aria-label="Edit product"
              title="Edit product"
            >
              <Pencil size={14} className="mx-auto" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(product.id);
              }}
              className="h-8 w-8 rounded-lg border border-red-500/35 bg-slate-900/75 text-red-300 transition-colors hover:bg-red-500/20"
              aria-label="Delete product"
              title="Delete product"
            >
              <Trash2 size={14} className="mx-auto" />
            </button>
          </div>
        )}

        {/* Image area */}
        <div className="relative overflow-hidden"
          style={{ height: previewHeight }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,rgba(6,182,212,0.04),rgba(99,102,241,0.04))" }}>
              {/* Animated rings */}
              <div className="relative">
                {hovered && (
                  <motion.div className="absolute inset-0 rounded-2xl border border-cyan-500/30"
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }} />
                )}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg,rgba(6,182,212,0.15),rgba(99,102,241,0.15))",
                    border: "1px solid rgba(6,182,212,0.2)",
                  }}>
                  <Package size={24} className="text-cyan-400/70" />
                </div>
              </div>
            </div>
          )}
          {/* Corner accents */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-cyan-500/25 rounded-tl-lg" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-indigo-500/25 rounded-br-lg" />
        </div>

        <div className="p-4 flex flex-col gap-3">
          {/* Badge */}
          <span className="self-start text-[10px] font-bold px-2 py-1 rounded-full"
            style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
            {badge.label}
          </span>

          <div>
            <h3 className="font-bold text-white text-sm leading-tight line-clamp-2 group-hover:text-cyan-50 transition-colors mb-1">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{product.description}</p>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
            <div>
              <div className="text-[9px] text-slate-600 uppercase tracking-widest mb-0.5">Harga</div>
              <div className="font-display font-black text-sm"
                style={{ background: "linear-gradient(90deg,#22d3ee,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Rp {price.toLocaleString("id-ID")}
              </div>
            </div>
            <motion.div animate={{ x: hovered ? 2 : 0, opacity: hovered ? 1 : 0.4 }}
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", color: "#22d3ee" }}>
              <ArrowRight size={13} />
            </motion.div>
          </div>
        </div>
      </div>
        );
      })()}
    </motion.div>
  );
}

function Products({ products, onAddProduct, onEditProduct, onDeleteProduct, canManage }: {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
  canManage: boolean;
}) {
  const [filter, setFilter] = useState("All");
  const visibleProducts =
    filter === "All"
      ? products
      : products.filter((p) => (p.category ?? "").toLowerCase().includes(filter.toLowerCase()));
  const productsToRender = visibleProducts.length > 0 ? visibleProducts : products;
  const getCardClassName = (index: number) => {
    if (index % 7 === 0) return "col-span-2 row-span-2";
    if (index % 5 === 0) return "col-span-2";
    if (index % 4 === 0) return "row-span-2";
    return "";
  };
  const getCardSize = (index: number): "sm" | "md" | "lg" => {
    if (index % 7 === 0) return "lg";
    if (index % 4 === 0) return "md";
    return "sm";
  };

  return (
    <section id="products" className="py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="text-center mb-14">
          <SectionLabel>Katalog Produk</SectionLabel>
          <h2 className="font-display text-4xl md:text-6xl font-black text-white leading-tight">
            Produk <span className="text-gradient">Pilihan</span>
          </h2>
          <p className="text-slate-400 text-base mt-4 max-w-xl mx-auto">
            Temukan ribuan produk premium dari penjual terpercaya seluruh Indonesia.
          </p>
        </FadeIn>

        {/* Filter tabs */}
        <FadeIn delay={0.1} className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {["All", "Electronics", "Fashion", "Food", "Beauty"].map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                filter === cat
                  ? "text-white"
                  : "text-slate-400 glass glass-hover hover:text-slate-200"
              }`}
              style={filter === cat ? { background: "linear-gradient(135deg,#06b6d4,#6366f1)" } : {}}>
              {cat}
            </button>
          ))}
        </FadeIn>

        {products.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[220px] gap-4">
            <FadeIn className="col-span-full flex flex-col items-center justify-center py-24 gap-6">
              <motion.div animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 rounded-3xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg,rgba(6,182,212,0.1),rgba(99,102,241,0.1))",
                  border: "1px solid rgba(6,182,212,0.2)",
                }}>
                <Package size={36} className="text-cyan-400" />
              </motion.div>
              <div className="text-center">
                <h3 className="font-display text-2xl font-black text-white mb-2">Belum Ada Produk</h3>
                <p className="text-slate-400 text-sm max-w-xs">Jadilah yang pertama menambahkan produk premium di NEXUSWEB.</p>
              </div>
              {canManage && (
                <MagneticBtn onClick={onAddProduct}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#06b6d4,#6366f1)" }}>
                  <Plus size={15} /> Tambah Produk Pertama
                </MagneticBtn>
              )}
            </FadeIn>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[220px] gap-4">
            {productsToRender.map((p, i) => (
              <FadeIn key={p.id} delay={i * 0.05} className={getCardClassName(i)}>
                <ProductCard
                  product={p}
                  index={i}
                  size={getCardSize(i)}
                  onEdit={onEditProduct}
                  onDelete={onDeleteProduct}
                  canManage={canManage}
                />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  const initialContactState = { success: false, message: null as string | null };
  const [actionState, formAction] = useActionState(saveContactMessage, initialContactState);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [copied, setCopied] = useState(false);

  const set = (k: string) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (actionState.success) {
      setForm({ name: "", email: "", subject: "", message: "" });
    }
  }, [actionState.success]);

  const copyEmail = () => {
    navigator.clipboard.writeText("hello@nexusweb.id");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const contactInfo = [
    {
      icon: Mail, label: "Email", value: "riezkydwi42@gmail.com",
      sub: "Respon dalam 2 jam kerja", action: copyEmail, actionLabel: copied ? "Tersalin!" : "Salin",
    },
    {
      icon: Phone, label: "Telepon", value: "+62 831-3056-5795",
      sub: "Senin – Jumat, 08.00 – 17.00 WIB",
    },
    {
      icon: MapPin, label: "Kantor", value: "Bandung Barat",
      sub: "Padalarang",
    },
    {
      icon: Clock, label: "Jam Operasional", value: "24/7 Online",
      sub: "Platform selalu aktif, support on-demand",
    },
  ];

  const socials = [
    { icon: Mail, label: "Email", href: "#" },
    { icon: Globe, label: "Website", href: "#" },
    { icon: MessageCircle, label: "Chat", href: "#" },
    { icon: Send, label: "Support", href: "#" },
  ];

  return (
    <section id="contact" className="py-28 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <FadeIn className="text-center mb-16">
          <SectionLabel>Hubungi Kami</SectionLabel>
          <h2 className="font-display text-4xl md:text-6xl font-black text-white leading-tight">
            Mari <span className="text-gradient">Terhubung</span>
          </h2>
          <p className="text-slate-400 text-base mt-4 max-w-xl mx-auto">
            Ada pertanyaan, ide kolaborasi, atau ingin bergabung? Tim kami siap membantu Anda.
          </p>
        </FadeIn>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Panel — Info */}
          <FadeIn className="lg:col-span-2 space-y-4">
            {/* Contact cards */}
            {contactInfo.map((c, i) => (
              <div key={i} className="relative p-5 rounded-2xl glass glass-hover transition-all duration-300 group overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-700/50 to-transparent group-hover:via-cyan-500/30 transition-all" />
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                    style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.15)" }}>
                    <c.icon size={16} className="text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-0.5">{c.label}</div>
                    <div className="text-white text-sm font-bold truncate">{c.value}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{c.sub}</div>
                  </div>
                  {c.action && (
                    <button onClick={c.action}
                      className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-cyan-400 bg-cyan-500/8 border border-cyan-500/20 hover:bg-cyan-500/15 transition-all">
                      {copied ? <CheckCheck size={11} /> : <Copy size={11} />}
                      {c.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="p-5 rounded-2xl glass">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4">Ikuti Kami</div>
              <div className="flex gap-3">
                {socials.map((s, i) => (
                  <motion.a key={i} href={s.href} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-xl glass glass-hover flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors"
                    title={s.label}>
                    <s.icon size={16} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Live chat card */}
            <div className="relative p-5 rounded-2xl overflow-hidden"
              style={{ background: "linear-gradient(135deg,rgba(6,182,212,0.08),rgba(99,102,241,0.08))", border: "1px solid rgba(6,182,212,0.15)" }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg,#06b6d4,#6366f1)" }}>
                  <MessageCircle size={16} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-white text-sm font-bold">Live Chat</span>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/25 px-1.5 py-0.5 rounded-full">ONLINE</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">Bicara langsung dengan tim support kami. Rata-rata respon 3 menit.</p>
                  <button className="mt-3 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                    Mulai Chat <ChevronRight size={11} />
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right Panel — Form */}
          <FadeIn delay={0.1} className="lg:col-span-3">
            <div className="relative p-8 rounded-2xl h-full"
              style={{
                background: "linear-gradient(135deg,rgba(15,23,42,0.7),rgba(8,15,31,0.9))",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(148,163,184,0.08)",
              }}>
              <div className="absolute top-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-cyan-500/30 to-transparent" />

              <AnimatePresence mode="wait">
                {actionState.success ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
                      style={{ background: "linear-gradient(135deg,rgba(16,185,129,0.2),rgba(5,150,105,0.2))", border: "1px solid rgba(16,185,129,0.3)" }}>
                      <Check size={36} className="text-emerald-400" />
                    </motion.div>
                    <h3 className="font-display text-2xl font-black text-white mb-2">Pesan Terkirim!</h3>
                    <p className="text-slate-400 text-sm max-w-xs">Tim kami akan menghubungi Anda dalam 2 jam kerja. Terima kasih!</p>
                    <button onClick={() => { setForm({ name: "", email: "", subject: "", message: "" }); }}
                      className="mt-6 text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                      <ArrowRight size={13} /> Kirim Pesan Lain
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="mb-6">
                      <h3 className="font-display text-xl font-black text-white">Kirim Pesan</h3>
                      <p className="text-slate-400 text-sm mt-1">Isi form di bawah dan kami akan segera merespon.</p>
                    </div>

                    {actionState.message && !actionState.success && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-3 rounded-xl bg-red-500/8 border border-red-500/20 text-red-400 text-xs">
                        <AlertCircle size={14} />
                        {actionState.message}
                      </motion.div>
                    )}

                    <form action={formAction} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FloatingField id="name" name="name" label="Nama Lengkap *" value={form.name} onChange={set("name")} />
                        <FloatingField id="email" name="email" label="Email *" type="email" value={form.email} onChange={set("email")} />
                      </div>
                      <FloatingField id="subject" name="subject" label="Subjek" value={form.subject} onChange={set("subject")} />
                      <FloatingField id="message" name="message" label="Pesan *" value={form.message} onChange={set("message")} multiline rows={4} />

                      {/* Category chips */}
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Topik</div>
                        <div className="flex gap-2 flex-wrap">
                          {["Umum", "Partnership", "Technical", "Billing", "Karir"].map((t) => (
                            <button key={t}
                              type="button"
                              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 border border-slate-700/50 hover:border-cyan-500/40 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all">
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <ContactSubmitButton isSuccess={actionState.success} />
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer() {
  const links = {
    Platform: ["Beranda", "Produk", "Tentang Kami", "Pricing", "Blog"],
    Developers: ["API Docs", "SDK", "Webhooks", "Status Page", "Changelog"],
    Legal: ["Privasi", "Syarat Layanan", "Cookie Policy", "GDPR", "EULA"],
    Perusahaan: ["Karir", "Press Kit", "Partners", "Investor Relations", "Kontak"],
  };

  return (
    <footer className="relative border-t border-slate-800/40 pt-20 pb-10 px-4">
      {/* Top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-cyan-500/30 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-linear-to-r from-transparent via-indigo-500/40 to-transparent blur-sm" />

      <div className="max-w-6xl mx-auto">
        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#06b6d4,#6366f1)" }}>
                <Zap size={16} className="text-white" />
              </div>
              <span className="font-display text-lg font-black">
                <span className="text-white">NEXUS</span>
                <span className="text-gradient">WEB</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-xs">
              Platform marketplace premium dengan infrastruktur cloud terdepan untuk bisnis skala enterprise.
            </p>
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
              <div className="w-2 h-2 rounded-full bg-emerald-400 relative">
                <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-50" />
              </div>
              <span className="text-emerald-400 text-xs font-bold">All Systems Operational</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="relative p-6 rounded-2xl mb-12 overflow-hidden"
          style={{
            background: "linear-gradient(135deg,rgba(6,182,212,0.05),rgba(99,102,241,0.05))",
            border: "1px solid rgba(6,182,212,0.12)",
          }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-black text-white text-lg mb-1">Subscribe Newsletter</h3>
              <p className="text-slate-400 text-sm">Dapatkan update produk, fitur baru, dan tips eksklusif langsung ke inbox Anda.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto min-w-[320px]">
              <input placeholder="email@perusahaan.com" type="email"
                className="flex-1 px-4 py-3 rounded-xl text-sm text-white bg-slate-900/60 border border-slate-700/50 focus:border-cyan-500/40 focus:outline-none transition-all placeholder:text-slate-600" />
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="px-5 py-3 rounded-xl text-sm font-bold text-white flex items-center gap-2 shrink-0"
                style={{ background: "linear-gradient(135deg,#06b6d4,#6366f1)" }}>
                <Send size={14} /> Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-800/40">
          <div className="flex items-center gap-6">
            <p className="text-slate-500 text-xs">
              © 2024 NEXUSWEB · PT Nexus Teknologi Indonesia · Hak cipta dilindungi.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Powered by</span>
              <span className="font-bold text-slate-300">TiDB Cloud</span>
              <span>×</span>
              <span className="font-bold text-slate-300">Next.js 15</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Product Drawer ─────────────────────────────────────────────────────────────
function ProductDrawer({ open, onClose, editingProduct }: {
  open: boolean;
  onClose: () => void;
  editingProduct: Product | null;
}) { // NOSONAR
  const router = useRouter();
  const isEditMode = Boolean(editingProduct);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", price: "", category: "", description: "", stock: "", imageUrl: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);
  const set = (k: string) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const categories = ["Electronics", "Fashion", "Food & Beverage", "Beauty", "Home & Living", "Sports", "Books", "Other"];

  useEffect(() => {
    const activeProduct = open ? editingProduct : null;
    const imageUrl = activeProduct?.sourceUrl ?? activeProduct?.source_url ?? "";
    setForm({
      name: activeProduct?.name ?? "",
      price: activeProduct ? String(activeProduct.price ?? "") : "",
      category: activeProduct?.category ?? "",
      description: activeProduct?.description ?? "",
      stock: "",
      imageUrl,
    });
    setError(null);
    setSuccess(false);
    setStep(1);
  }, [open, editingProduct]);

  useEffect(() => {
    const t = setTimeout(() => {
      open && step === 1 && nameInputRef.current?.focus();
      open && step === 2 && descInputRef.current?.focus();
    }, 120);
    return () => clearTimeout(t);
  }, [open, step]);

  const handleSubmit = async () => {
    const name = form.name.trim();
    const description = form.description.trim();
    const imageUrl = form.imageUrl.trim();
    const priceNumber = Number(form.price);

    if (!name || !description || !Number.isFinite(priceNumber)) {
      setError("Nama, harga, dan deskripsi wajib diisi.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", String(priceNumber));
      formData.append("description", description);
      formData.append("source_url", imageUrl);

      if (isEditMode && editingProduct) {
        await updateProductAction(editingProduct.id, formData);
      } else {
        await addProductAction(formData);
      }
      router.refresh();

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setStep(1);
        setForm({ name: "", price: "", category: "", description: "", stock: "", imageUrl: "" });
        onClose();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambah produk.");
    } finally {
      setLoading(false);
    }
  };

  const submitContent = getProductDrawerSubmitContent(loading, success, isEditMode);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/75 backdrop-blur-md z-40" />

          <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 h-full w-full max-w-110 z-50 flex flex-col"
            style={{ background: "#080f1f", borderLeft: "1px solid rgba(148,163,184,0.08)" }}>

            {/* Header */}
            <div className="relative px-7 py-6 border-b border-slate-800/60 shrink-0">
              <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-cyan-500/40 to-transparent" />
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-black tracking-[0.25em] text-cyan-400 uppercase mb-1.5">New Listing</div>
                  <h2 className="font-display text-xl font-black text-white">{getProductDrawerHeaderTitle(isEditMode)}</h2>
                  <p className="text-slate-500 text-xs mt-1">Langkah {step} dari 2</p>
                </div>
                <button onClick={onClose}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                  style={{ background: "rgba(30,41,59,0.8)", border: "1px solid rgba(71,85,105,0.4)" }}>
                  <X size={15} />
                </button>
              </div>
              {/* Progress */}
              <div className="flex gap-1.5 mt-5">
                {[1, 2].map((s) => (
                  <div key={s} className="h-1 flex-1 rounded-full overflow-hidden bg-slate-800">
                    <motion.div animate={{ width: step >= s ? "100%" : "0%" }}
                      transition={{ duration: 0.4 }}
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg,#06b6d4,#6366f1)" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto scrollbar-none px-7 py-6">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
                    className="space-y-4">
                    <FloatingField id="pname" label="Nama Produk *" value={form.name} onChange={set("name")}
                      inputRef={nameInputRef}
                      enterKeyHint="next"
                      autoComplete="off"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          priceInputRef.current?.focus();
                        }
                      }} />
                    <div className="grid grid-cols-2 gap-3">
                      <FloatingField id="pprice" label="Harga (IDR) *" type="number" value={form.price} onChange={set("price")}
                        inputRef={priceInputRef}
                        inputMode="numeric"
                        enterKeyHint="next"
                        autoComplete="off" />
                      <FloatingField id="pstock" label="Stok" type="number" value={form.stock} onChange={set("stock")}
                        inputMode="numeric"
                        enterKeyHint="next"
                        autoComplete="off" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase mb-2">Kategori</div>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((cat) => (
                          <button key={cat} onClick={() => setForm((f) => ({ ...f, category: cat }))}
                            className="px-3 py-2 rounded-xl text-xs font-medium text-left transition-all duration-200"
                            style={{
                              background: form.category === cat ? "rgba(6,182,212,0.1)" : "rgba(15,23,42,0.5)",
                              border: form.category === cat ? "1px solid rgba(6,182,212,0.35)" : "1px solid rgba(71,85,105,0.3)",
                              color: form.category === cat ? "#22d3ee" : "#94a3b8",
                            }}>
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}
                    className="space-y-4">
                    {error && (
                      <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                        {error}
                      </div>
                    )}
                    <FloatingField id="pimage" label="Image URL" value={form.imageUrl} onChange={set("imageUrl")}
                      type="url"
                      autoComplete="off" />
                    <FloatingField id="pdesc" label="Deskripsi Produk" value={form.description} onChange={set("description")} multiline rows={3}
                      inputRef={descInputRef}
                      enterKeyHint="done"
                      autoComplete="off"
                      onKeyDown={(e) => {
                        if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !loading && !success) {
                          e.preventDefault();
                          void handleSubmit();
                        }
                      }} />
                    <p className="text-[11px] text-slate-500 -mt-2">Tip: tekan Ctrl + Enter untuk simpan lebih cepat.</p>

                    {/* Preview */}
                    {(form.name || form.price) && (
                      <div className="rounded-2xl overflow-hidden"
                        style={{ border: "1px solid rgba(6,182,212,0.15)", background: "rgba(6,182,212,0.03)" }}>
                        <div className="px-4 py-2 border-b border-slate-800/60">
                          <span className="text-[10px] font-black tracking-[0.2em] text-cyan-400 uppercase">Preview Card</span>
                        </div>
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            {form.imageUrl ? (
                              <img
                                src={form.imageUrl}
                                alt={form.name || "Preview image"}
                                className="h-12 w-12 shrink-0 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                style={{ background: "linear-gradient(135deg,rgba(6,182,212,0.12),rgba(99,102,241,0.12))", border: "1px solid rgba(6,182,212,0.2)" }}>
                                <Package size={18} className="text-cyan-400" />
                              </div>
                            )}
                            <div>
                              <div className="text-white font-bold text-sm">{form.name || "Nama Produk"}</div>
                              {form.category && <div className="text-slate-500 text-xs mb-1">{form.category}</div>}
                              <div className="font-display font-black text-sm"
                                style={{ background: "linear-gradient(90deg,#22d3ee,#818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                {form.price ? `Rp ${Number(form.price).toLocaleString("id-ID")}` : "Rp 0"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-7 py-6 border-t border-slate-800/60 shrink-0 space-y-3">
              {step === 1 ? (
                <motion.button onClick={() => setStep(2)} disabled={!form.name || !form.price}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  className="w-full h-12 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-40 relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg,#06b6d4,#6366f1)" }}>
                  Lanjutkan <ChevronRight size={16} />
                  <motion.div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: "-200%" }} whileHover={{ x: "200%" }} transition={{ duration: 0.45 }} />
                </motion.button>
              ) : (
                <>
                  <motion.button onClick={handleSubmit} disabled={loading || success}
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    className="w-full h-12 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-70 relative overflow-hidden"
                    style={{
                      background: success
                        ? "linear-gradient(135deg,#10b981,#059669)"
                        : "linear-gradient(135deg,#06b6d4,#6366f1)",
                    }}>
                    {submitContent}
                  </motion.button>
                  <button onClick={() => setStep(1)}
                    className="w-full h-10 rounded-xl text-sm font-medium text-slate-400 hover:text-white glass glass-hover transition-all">
                    ← Kembali
                  </button>
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ── FAB ───────────────────────────────────────────────────────────────────────
function FAB({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <motion.button onClick={onClick}
      onHoverStart={() => setHover(true)} onHoverEnd={() => setHover(false)}
      whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.93 }}
      className="fixed bottom-7 right-7 z-30 flex items-center gap-2.5 h-14 rounded-2xl text-white font-bold text-sm shadow-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg,#06b6d4,#6366f1)",
        boxShadow: "0 0 40px rgba(6,182,212,0.25), 0 8px 32px rgba(0,0,0,0.5)",
        paddingLeft: hover ? "20px" : "17px",
        paddingRight: hover ? "20px" : "17px",
        transition: "padding 0.3s ease",
      }}>
      <Plus size={18} />
      <motion.span animate={{ width: hover ? "auto" : 0, opacity: hover ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden whitespace-nowrap text-sm">
        Add Product
      </motion.span>
      <motion.div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: "-200%" }} whileHover={{ x: "200%" }} transition={{ duration: 0.5 }} />
    </motion.button>
  );
}

function getProductDrawerHeaderTitle(isEditMode: boolean) {
  return isEditMode ? "Edit Produk" : "Tambah Produk";
}

function getProductDrawerSubmitContent(loading: boolean, success: boolean, isEditMode: boolean) {
  if (loading) {
    return <><Loader2 size={15} className="animate-spin" /> Menyimpan...</>;
  }

  if (success) {
    return <><Check size={15} /> {isEditMode ? "Berhasil Diupdate!" : "Berhasil Ditambahkan!"}</>;
  }

  return <><Plus size={15} /> {isEditMode ? "Update Produk" : "Tambah Produk"}</>;
}

// ── Root ──────────────────────────────────────────────────────────────────────
export function ClientSections({ products, session, isAdmin: isAdminOverride }: Props) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const isAdmin = isAdminOverride ?? session?.user?.role === "admin";
  const isLoggedIn = Boolean(session?.user?.email);

  const openCreateDrawer = () => {
    if (!isAdmin) return;
    setEditingProduct(null);
    setDrawerOpen(true);
  };

  const openEditDrawer = (product: Product) => {
    if (!isAdmin) return;
    setEditingProduct(product);
    setDrawerOpen(true);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!isAdmin) return;
    const confirmed = globalThis.confirm("Hapus produk ini? Tindakan ini tidak bisa dibatalkan.");
    if (!confirmed) return;

    try {
      await deleteProductAction(productId);
      router.refresh();
    } catch (err) {
      globalThis.alert(err instanceof Error ? err.message : "Gagal menghapus produk.");
    }
  };

  return (
    <>
      <Navbar onAddProduct={openCreateDrawer} isAdmin={isAdmin} isLoggedIn={isLoggedIn} />
      <Hero onAddProduct={openCreateDrawer} />
      <Stats />
      <About />
      <Products
        products={products}
        onAddProduct={openCreateDrawer}
        onEditProduct={openEditDrawer}
        onDeleteProduct={handleDeleteProduct}
        canManage={isAdmin}
      />
      <Contact />
      <Footer />
      <FAB onClick={openCreateDrawer} />
      {isAdmin && (
        <ProductDrawer
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setEditingProduct(null);
          }}
          editingProduct={editingProduct}
        />
      )}
    </>
  );
}