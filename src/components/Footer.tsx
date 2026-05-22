import { Instagram, MapPin, Clock, Phone } from "lucide-react";
import logo from "@/assets/logo.png";

export interface Social {
  whatsapp?: string | null;
  instagram?: string | null;
  alamat?: string | null;
  jam_operasional?: string | null;
}

export function Footer({ social }: { social: Social }) {
  return (
    <footer className="gradient-warm text-white pt-20 pb-8">
      <div className="mx-auto max-w-7xl px-5 md:px-8 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-5">
            <img src={logo} alt="Kopi Nusantara" className="size-12 rounded-full bg-white/95 p-0.5" />
            <span className="font-display text-xl">Kopi Nusantara</span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Indonesian specialty coffee, diseduh dengan hati.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4">Kunjungi</h4>
          <p className="flex items-start gap-3 text-white/80 text-sm leading-relaxed">
            <MapPin className="size-4 mt-0.5 text-accent shrink-0" />
            {social.alamat ?? "Jl. Sudirman No. 123, Jakarta"}
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4">Jam Buka</h4>
          <p className="flex items-start gap-3 text-white/80 text-sm">
            <Clock className="size-4 mt-0.5 text-accent shrink-0" />
            {social.jam_operasional ?? "Setiap hari, 07:00 - 23:00"}
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4">Terhubung</h4>
          <div className="space-y-2 text-sm">
            {social.whatsapp && (
              <a
                href={`https://wa.me/${social.whatsapp}`}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-3 text-white/80 hover:text-accent transition-colors"
              >
                <Phone className="size-4" />
                +{social.whatsapp}
              </a>
            )}
            {social.instagram && (
              <a
                href={`https://instagram.com/${social.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-3 text-white/80 hover:text-accent transition-colors"
              >
                <Instagram className="size-4" />
                {social.instagram}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16 pt-6 border-t border-white/10 text-center text-white/50 text-xs">
        © {new Date().getFullYear()} Kopi Nusantara. Crafted with care.
      </div>
    </footer>
  );
}
