import { X, Receipt } from "lucide-react";
import { formatIDR } from "@/lib/format";
import { MenuImage } from "@/components/MenuImage";

interface OrderItem {
  menu_id?: string;
  menu_name: string;
  qty: number;
  price: number;
  sugar_level?: string | null;
  subtotal: number;
  gambar_url?: string | null;
}

export interface OrderDetail {
  id: string;
  kode_pesanan: string;
  created_at: string;
  metode_pembayaran: string;
  bank_selected: string | null;
  payment_reference: string | null;
  status: string;
  subtotal: number;
  items: OrderItem[];
}

interface Props {
  order: OrderDetail | null;
  onClose: () => void;
}

export function OrderDetailModal({ order, onClose }: Props) {
  if (!order) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-primary/70 backdrop-blur-md p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-background rounded-3xl shadow-elegant max-w-lg w-full max-h-[88vh] flex flex-col overflow-hidden animate-scale-in"
      >
        <header className="relative p-6 pb-5 border-b border-border bg-gradient-to-br from-primary to-primary/85 text-primary-foreground">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 size-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="size-5" />
          </button>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-80">
            <Receipt className="size-3.5" /> Detail Pesanan
          </div>
          <h3 className="font-display text-3xl mt-2">{order.kode_pesanan}</h3>
          <p className="text-xs opacity-75 mt-1">
            {new Date(order.created_at).toLocaleString("id-ID", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </p>
        </header>

        <div className="px-6 pt-5 pb-3 grid grid-cols-2 gap-3 text-sm border-b border-border">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Pembayaran</p>
            <p className="font-semibold text-primary mt-0.5">
              {order.metode_pembayaran}
              {order.bank_selected ? ` · ${order.bank_selected}` : ""}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Status</p>
            <span className="inline-flex mt-0.5 items-center px-2.5 py-1 rounded-full bg-accent/15 text-accent text-[11px] font-semibold">
              {order.status}
            </span>
          </div>
          {order.payment_reference && (
            <div className="col-span-2">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Referensi</p>
              <p className="font-mono text-primary mt-0.5 text-sm">{order.payment_reference}</p>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
            Item Pesanan ({order.items.length})
          </p>
          {order.items.map((it, idx) => (
            <div key={idx} className="bg-card rounded-2xl p-3 flex gap-3 shadow-soft">
              <MenuImage
                src={it.gambar_url}
                alt={it.menu_name}
                className="size-16 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-primary leading-tight">{it.menu_name}</p>
                <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1 text-xs text-muted-foreground">
                  <span>Qty: {it.qty}</span>
                  {it.sugar_level && (
                    <>
                      <span>·</span>
                      <span>Sugar: {it.sugar_level}</span>
                    </>
                  )}
                  <span>·</span>
                  <span>{formatIDR(it.price)}</span>
                </div>
                <p className="text-right font-semibold text-primary text-sm mt-1">
                  {formatIDR(it.subtotal ?? it.price * it.qty)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-6 bg-card/60 flex items-center justify-between">
          <span className="font-display text-lg text-primary">Total</span>
          <span className="font-bold text-xl text-primary">{formatIDR(order.subtotal)}</span>
        </div>
      </div>
    </div>
  );
}
