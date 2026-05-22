import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CartProvider } from "@/lib/cart";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Menu } from "@/components/Menu";
import { Testimonials, type Testimonial } from "@/components/Testimonials";
import { Footer, type Social } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CartDrawer } from "@/components/CartDrawer";
import type { MenuItem } from "@/lib/cart";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kopi Nusantara — Indonesian Specialty Coffee" },
      {
        name: "description",
        content:
          "Coffee shop premium dengan biji kopi pilihan dari Gayo, Toraja, dan Kintamani. Pesan online dengan mudah.",
      },
      { property: "og:title", content: "Kopi Nusantara — Indonesian Specialty Coffee" },
      { property: "og:description", content: "Cita rasa kopi Nusantara dalam setiap tegukan." },
    ],
  }),
  component: Page,
});

interface HeroData {
  headline: string;
  subheadline: string | null;
  cta_text: string | null;
  background_image: string | null;
}
interface AboutData {
  judul: string;
  deskripsi: string | null;
  gambar: string | null;
}

function Page() {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [about, setAbout] = useState<AboutData | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [social, setSocial] = useState<Social>({});
  const [menuLoading, setMenuLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [h, a, m, t, s] = await Promise.all([
        supabase.from("hero").select("*").limit(1).maybeSingle(),
        supabase.from("about").select("*").limit(1).maybeSingle(),
        supabase.from("menu").select("*").order("sort_order"),
        supabase.from("testimonials").select("*").order("created_at"),
        supabase.from("sosial_media").select("*").limit(1).maybeSingle(),
      ]);
      if (h.data) setHero(h.data as HeroData);
      if (a.data) setAbout(a.data as AboutData);
      if (m.data) setMenu(m.data as MenuItem[]);
      if (t.data) setTestimonials(t.data as Testimonial[]);
      if (s.data) setSocial(s.data as Social);
      setMenuLoading(false);
    })();
  }, []);

  return (
    <CartProvider>
      <Navbar />
      <main>
        <Hero
          headline={hero?.headline}
          subheadline={hero?.subheadline ?? undefined}
          cta_text={hero?.cta_text ?? undefined}
          background_image={hero?.background_image}
        />
        <About
          judul={about?.judul}
          deskripsi={about?.deskripsi ?? undefined}
          gambar={about?.gambar}
        />
        <Menu items={menu} loading={menuLoading} />
        <Testimonials items={testimonials} />
      </main>
      <Footer social={social} />
      <WhatsAppButton phone={social.whatsapp} />
      <CartDrawer />
    </CartProvider>
  );
}
