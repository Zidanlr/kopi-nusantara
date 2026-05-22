import heroBg from "@/assets/hero-bg.jpg";

interface Props {
  headline?: string;
  subheadline?: string;
  cta_text?: string;
  background_image?: string | null;
}

export function Hero({ headline, subheadline, cta_text, background_image }: Props) {
  const bg = background_image || heroBg;
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={bg}
          alt="Kopi Nusantara"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/55 to-primary/85" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 md:px-8 py-32 md:py-40 w-full">
        <div className="max-w-3xl animate-fade-up">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-white text-xs tracking-[0.25em] uppercase mb-7">
            Indonesian Specialty Coffee
          </span>
          <h1 className="font-display text-white text-5xl sm:text-6xl md:text-7xl leading-[1.05] mb-6">
            {headline ?? "Cita Rasa Kopi Nusantara dalam Setiap Tegukan"}
          </h1>
          <p className="text-white/85 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            {subheadline ??
              "Diseduh dengan biji kopi pilihan dari pegunungan terbaik Indonesia."}
          </p>
          <a
            href="#menu"
            className="inline-flex items-center gap-3 rounded-full bg-white text-primary px-8 py-4 text-sm font-semibold tracking-wide shadow-glow hover:scale-[1.04] transition-transform"
          >
            {cta_text ?? "Lihat Menu"}
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/70 text-xs tracking-[0.3em] uppercase animate-pulse">
        Scroll
      </div>
    </section>
  );
}
