import { CheckCircle2, Loader2, QrCode } from "lucide-react";
import { formatIDR } from "@/lib/format";

export interface PaymentResult {
  code: string;
  method: "QRIS" | "Bank Transfer";
  bank?: string;
  va?: string;
  subtotal: number;
  items: Array<{ menu_name: string; qty: number; sugar_level: string | null; subtotal: number }>;
  status: string;
}

interface Props {
  mode: "processing" | "success";
  paying?: { method: "QRIS" | "Bank Transfer"; bank?: string; va?: string };
  result?: PaymentResult;
  onClose?: () => void;
}

export function PaymentModal({ mode, paying, result, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-primary/70 backdrop-blur-md p-4 animate-fade-up">
      <div className="bg-background rounded-3xl shadow-elegant max-w-md w-full overflow-hidden">
        {mode === "processing" && paying && (
          <div className="p-8 text-center">
            <h3 className="font-display text-2xl text-primary mb-1">
              {paying.method === "QRIS" ? "Pindai QRIS" : "Transfer ke Virtual Account"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {paying.method === "QRIS"
                ? "Simulasi pembayaran QRIS"
                : `Bank ${paying.bank}`}
            </p>

            {paying.method === "QRIS" ? (
              <div className="mx-auto mb-6 size-56 bg-white rounded-2xl shadow-soft flex items-center justify-center border-2 border-dashed border-primary/20">
                <QrCode className="size-40 text-primary" strokeWidth={1.2} />
              </div>
            ) : (
              <div className="mx-auto mb-6 bg-card rounded-2xl shadow-soft p-6 border-2 border-dashed border-primary/20">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Virtual Account
                </p>
                <p className="font-mono text-2xl text-primary tracking-wider">{paying.va}</p>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-accent">
              <Loader2 className="size-4 animate-spin" />
              <span className="text-sm">Memproses pembayaran simulasi...</span>
            </div>
          </div>
        )}

        {mode === "success" && result && (
          <div>
            <div className="gradient-warm p-8 text-center text-white">
              <div className="size-16 rounded-full bg-white/15 backdrop-blur mx-auto mb-4 flex items-center justify-center">
                <CheckCircle2 className="size-9" />
              </div>
              <h3 className="font-display text-2xl">Pesanan Berhasil Dikonfirmasi</h3>
              <p className="text-white/75 text-sm mt-1">Terima kasih telah memesan</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-muted rounded-xl p-4 text-center">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Kode Pesanan</p>
                <p className="font-display text-2xl text-primary mt-1">{result.code}</p>
              </div>

              <div className="space-y-2 text-sm">
                <Row label="Metode" value={result.method} />
                {result.bank && <Row label="Bank" value={result.bank} />}
                {result.va && <Row label="VA Number" value={result.va} mono />}
                <Row label="Status" value={result.status} accent />
              </div>

              <div className="border-t border-border pt-4 space-y-1.5 max-h-40 overflow-y-auto">
                {result.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-foreground/80">
                      {i.menu_name} {i.sugar_level && `(${i.sugar_level})`} × {i.qty}
                    </span>
                    <span className="font-medium">{formatIDR(i.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-display text-lg text-primary border-t border-border pt-4">
                <span>Total</span>
                <span>{formatIDR(result.subtotal)}</span>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 font-semibold hover:bg-accent transition-colors"
              >
                Selesai
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, mono, accent }: { label: string; value: string; mono?: boolean; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${mono ? "font-mono" : ""} ${accent ? "text-accent" : "text-primary"}`}>
        {value}
      </span>
    </div>
  );
}
