import aboutImg from "@/assets/about.jpg";

interface Props {
  judul?: string;
  deskripsi?: string;
  gambar?: string | null;
}

export function About({ judul, deskripsi, gambar }: Props) {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-accent/20 -z-10 blur-2xl" />
          <img
            src={gambar || aboutImg}
            alt={judul ?? "Tentang Kami"}
            loading="lazy"
            className="w-full h-[520px] object-cover rounded-3xl shadow-elegant"
          />
          <div className="absolute -bottom-6 -right-6 hidden md:block bg-card rounded-2xl px-6 py-5 shadow-elegant">
            <p className="font-display text-3xl text-primary">15+</p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
              Tahun Pengalaman
            </p>
          </div>
        </div>
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">
            Tentang Kami
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-primary mt-4 mb-6 leading-tight">
            {judul ?? "Warisan Kopi dari Tanah Nusantara"}
          </h2>
          <p className="text-foreground/80 leading-relaxed text-lg">
            {deskripsi ??
              "Kopi Nusantara lahir dari kecintaan kami terhadap kekayaan kopi Indonesia."}
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { n: "10+", l: "Origin Biji" },
              { n: "20", l: "Menu Pilihan" },
              { n: "5K+", l: "Pelanggan" },
            ].map((s) => (
              <div key={s.l} className="border-l-2 border-accent pl-4">
                <p className="font-display text-2xl text-primary">{s.n}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
