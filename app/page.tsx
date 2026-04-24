import { db } from "@/db";
import { products } from "@/db/schema";
import { ClientSections } from "@/app/components/ClientSections";
import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  noStore();

  const allProducts = await db.select().from(products);
  const session = await auth();
  const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();
  const sessionEmail = session?.user?.email?.trim().toLowerCase();
  const isAdmin = session?.user?.role === "admin" || Boolean(adminEmail && sessionEmail && sessionEmail === adminEmail);
  console.log("Current Session:", session);

  console.log("[Home] products fetched:", allProducts.length);
  console.log("[Home] products payload:", allProducts);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: "#020617", fontFamily: "'Syne', sans-serif" }}
    >
      {/* Google Font: Syne (display) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        h1, h2, h3, .font-display { font-family: 'Syne', sans-serif !important; }
        ::selection { background: rgba(6,182,212,0.25); color: #e2e8f0; }
        html { scroll-behavior: smooth; }

        @keyframes gradient-pan {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-gradient { animation: gradient-pan 6s ease infinite; background-size: 300% 300%; }
        .animate-ticker { animation: ticker 30s linear infinite; }
        .animate-ticker:hover { animation-play-state: paused; }

        .glass {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(148, 163, 184, 0.08);
        }
        .glass-hover:hover {
          background: rgba(15, 23, 42, 0.8);
          border-color: rgba(6, 182, 212, 0.2);
        }
        .glow-cyan { box-shadow: 0 0 40px rgba(6,182,212,0.15); }
        .glow-cyan-sm { box-shadow: 0 0 20px rgba(6,182,212,0.1); }
        .text-gradient {
          background: linear-gradient(135deg, #22d3ee 0%, #818cf8 50%, #22d3ee 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .border-gradient {
          border: 1px solid transparent;
          background-clip: padding-box;
        }
        .noise::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          opacity: 0.4;
          pointer-events: none;
          border-radius: inherit;
        }
        input:focus, textarea:focus { outline: none; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <ClientSections products={allProducts} session={session} isAdmin={isAdmin} />
    </div>
  );
}