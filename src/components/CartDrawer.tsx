import { useState } from "react";
import { X, Plus, Minus, Trash2, ShoppingBag, Receipt } from "lucide-react";
import { useCart, type SugarLevel } from "@/lib/cart";
import { formatIDR, generateOrderCode } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { MenuImage } from "@/components/MenuImage";
import { PaymentModal, type PaymentResult } from "./PaymentModal";
import { OrderHistoryModal } from "./OrderHistoryModal";

const SUGAR_OPTIONS: SugarLevel[] = ["Normal", "Less Sugar", "No Sugar"];
const BANKS = ["BCA", "Mandiri", "BRI", "BNI"] as const;

export function CartDrawer() {
  const { items, isOpen, closeCart, inc, dec, remove, setSugar, totalQty, subtotal, clear } = useCart();
  const [method, setMethod] = useState<"QRIS" | "Bank Transfer">("QRIS");
  const [bank, setBank] = useState<string>("");
  const [paying, setPaying] = useState<null | {
    method: "QRIS" | "Bank Transfer";
    bank?: string;
    va?: string;
  }>(null);
  const [success, setSuccess] = useState<PaymentResult | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const canCheckout = items.length > 0 && (method === "QRIS" || (method === "Bank Transfer" && bank));

  const handleConfirm = async () => {
    if (!canCheckout) return;
    const va =
      method === "Bank Transfer"
        ? String(Math.floor(Math.random() * 900000000000) + 100000000000)
        : undefined;
    setPaying({ method, bank: method === "Bank Transfer" ? bank : undefined, va });

    // simulate
    await new Promise((r) => setTimeout(r, 3000));

    const code = generateOrderCode();
    const orderItems = items.map((i) => ({
      menu_id: i.menu_id,
      menu_name: i.menu_name,
      qty: i.qty,
      price: i.price,
      sugar_level: i.sugar_level,
      subtotal: i.price * i.qty,
    }));

    await supabase.from("pesanan").insert({
      kode_pesanan: code,
      items: orderItems,
      subtotal,
      metode_pembayaran: method,
      bank_selected: method === "Bank Transfer" ? bank : null,
      payment_reference: va ?? null,
      status: "Menunggu Konfirmasi",
    });

    setPaying(null);
    setSuccess({
      code,
      method,
      bank: method === "Bank Transfer" ? bank : undefined,
      va,
      subtotal,
      items: orderItems,
      status: "Menunggu Konfirmasi",
    });
    clear();
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[460px] bg-background shadow-elegant transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="font-display text-2xl text-primary">Pesanan Anda</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{totalQty} item</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHistoryOpen(true)}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-card hover:bg-muted text-xs font-semibold text-primary"
            >
              <Receipt className="size-4" /> Kode Pesanan
            </button>
            <button
              onClick={closeCart}
              className="size-9 rounded-full bg-card hover:bg-muted flex items-center justify-center"
              aria-label="Tutup"
            >
              <X className="size-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-20">
              <ShoppingBag className="size-12 mb-4 opacity-40" />
              <p>Keranjang masih kosong</p>
              <p className="text-xs mt-1">Pilih menu favoritmu untuk memulai</p>
            </div>
          ) : (
            items.map((i) => (
              <div key={i.key} className="bg-card rounded-2xl p-4 shadow-soft">
                <div className="flex gap-3">
                  <MenuImage
                    src={i.gambar_url}
                    alt={i.menu_name}
                    className="size-16 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-primary leading-tight">{i.menu_name}</p>
                      <button
                        onClick={() => remove(i.key)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Hapus"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatIDR(i.price)} × {i.qty}
                    </p>
                  </div>
                </div>

                {i.allow_sugar_level && (
                  <div className="mt-3 flex gap-1.5">
                    {SUGAR_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSugar(i.key, s)}
                        className={`flex-1 text-[11px] py-1.5 rounded-lg font-medium transition-colors ${
                          i.sugar_level === s
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground/70 hover:bg-muted/70"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center bg-muted rounded-full">
                    <button onClick={() => dec(i.key)} className="size-8 flex items-center justify-center hover:text-accent">
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-7 text-center text-sm font-semibold">{i.qty}</span>
                    <button onClick={() => inc(i.key)} className="size-8 flex items-center justify-center hover:text-accent">
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <p className="font-semibold text-primary">{formatIDR(i.price * i.qty)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4 bg-card/50">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold">
                Metode Pembayaran
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(["QRIS", "Bank Transfer"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      method === m
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "bg-muted text-foreground/70"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              {method === "Bank Transfer" && (
                <select
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="mt-3 w-full bg-card border border-border rounded-xl px-4 py-3 text-sm"
                >
                  <option value="">Pilih Bank</option>
                  {BANKS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal ({totalQty} item)</span>
              <span className="font-semibold">{formatIDR(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-lg">
              <span className="font-display text-primary">Total</span>
              <span className="font-bold text-primary">{formatIDR(subtotal)}</span>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!canCheckout}
              className="w-full bg-primary text-primary-foreground rounded-xl py-4 font-semibold hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Konfirmasi Pesanan
            </button>
          </div>
        )}
      </aside>

      {paying && <PaymentModal mode="processing" paying={paying} />}
      {success && (
        <PaymentModal
          mode="success"
          result={success}
          onClose={() => {
            setSuccess(null);
            closeCart();
          }}
        />
      )}
    </>
  );
}
