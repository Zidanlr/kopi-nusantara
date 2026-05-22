import { Quote } from "lucide-react";

export interface Testimonial {
  id: string;
  nama: string;
  review: string;
  foto: string | null;
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <section id="testimonials" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">
            Cerita Mereka
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-primary mt-4">
            Disayang Pelanggan
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <article
              key={t.id}
              className="bg-card rounded-3xl p-8 shadow-soft hover:shadow-elegant transition-all"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <Quote className="size-8 text-accent mb-5" />
              <p className="text-foreground/85 leading-relaxed mb-6">"{t.review}"</p>
              <div className="flex items-center gap-3 border-t border-border pt-5">
                <div className="size-11 rounded-full bg-primary/10 flex items-center justify-center font-display text-primary">
                  {t.foto ? (
                    <img src={t.foto} alt={t.nama} className="size-full rounded-full object-cover" />
                  ) : (
                    t.nama.charAt(0)
                  )}
                </div>
                <div>
                  <p className="font-semibold text-primary">{t.nama}</p>
                  <p className="text-xs text-muted-foreground">Pelanggan Setia</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
