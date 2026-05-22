import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import logo from "@/assets/logo.png";
import { useCart } from "@/lib/cart";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { openCart, totalQty } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { label: "Beranda", href: "#hero" },
    { label: "Tentang", href: "#about" },
    { label: "Menu", href: "#menu" },
    { label: "Testimoni", href: "#testimonials" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8 h-20 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Kopi Nusantara"
            className={`h-12 w-12 rounded-full transition-all ${
              scrolled ? "" : "bg-white/95 p-0.5"
            }`}
          />
          <span
            className={`hidden sm:block font-display text-lg tracking-wide transition-colors ${
              scrolled ? "text-primary" : "text-white"
            }`}
          >
            Kopi Nusantara
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-9">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={`text-sm font-medium transition-colors hover:opacity-70 ${
                scrolled ? "text-foreground" : "text-white"
              }`}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <button
          onClick={openCart}
          className={`relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:scale-[1.03] ${
            scrolled
              ? "bg-primary text-primary-foreground shadow-soft"
              : "bg-white text-primary shadow-glow"
          }`}
        >
          <ShoppingBag className="size-4" />
          Pesanan
          {totalQty > 0 && (
            <span className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center">
              {totalQty}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
