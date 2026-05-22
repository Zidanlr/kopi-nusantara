import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import menuPlaceholder from "@/assets/menu-placeholder.jpg";
import { formatIDR } from "@/lib/format";
import { useCart, type MenuItem } from "@/lib/cart";

interface Props {
  items: MenuItem[];
  loading: boolean;
}

export function Menu({ items, loading }: Props) {
  const { addItem } = useCart();
  const [active, setActive] = useState<string>("Semua");

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.kategori || "Lainnya"));
    return ["Semua", ...Array.from(set)];
  }, [items]);

  const filtered = active === "Semua" ? items : items.filter((i) => (i.kategori || "Lainnya") === active);

  return (
    <section id="menu" className="py-24 md:py-32 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">
            Menu Pilihan
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-primary mt-4">
            Diseduh dengan Cinta
          </h2>
          <p className="text-muted-foreground mt-4">
            Dari espresso pekat hingga manual brew lembut — temukan favoritmu.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                active === c
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-card text-foreground/70 hover:bg-card/80"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-3xl h-[420px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((m) => (
              <article
                key={m.id}
                className="group bg-card rounded-3xl overflow-hidden shadow-soft hover:shadow-elegant transition-all hover:-translate-y-1"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={m.gambar || menuPlaceholder}
                    alt={m.nama_menu}
                    loading="lazy"
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {m.kategori && (
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold text-primary">
                      {m.kategori}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-display text-xl text-primary leading-tight">
                      {m.nama_menu}
                    </h3>
                    <p className="font-semibold text-accent shrink-0">{formatIDR(m.harga)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-5 min-h-[40px]">
                    {m.deskripsi}
                  </p>
                  <button
                    onClick={() => addItem(m)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold hover:bg-accent transition-colors"
                  >
                    <Plus className="size-4" /> Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
