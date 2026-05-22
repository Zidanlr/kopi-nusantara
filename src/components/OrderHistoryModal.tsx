import { useEffect, useState } from "react";
import { X, Trash2, Receipt, Loader2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatIDR } from "@/lib/format";
import { toast } from "sonner";
import { OrderDetailModal, type OrderDetail } from "./OrderDetailModal";

interface OrderRow {
  id: string;
  kode_pesanan: string;
  metode_pembayaran: string;
  bank_selected: string | null;
  payment_reference: string | null;
  subtotal: number;
  status: string;
  created_at: string;
  items: OrderDetail["items"];
}

interface Props {
  open: boolean;
  onClose: () => void;
  onCountChange?: (count: number) => void;
}

export function OrderHistoryModal({ open, onClose, onCountChange }: Props) {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState<
    null | { type: "one"; id: string; code: string } | { type: "all" }
  >(null);
  const [detail, setDetail] = useState<OrderDetail | null>(null);

  const load = async () => {
    setLoading(true);
    const [{ data }, { data: menus }] = await Promise.all([
      supabase
        .from("pesanan")
        .select(
          "id, kode_pesanan, metode_pembayaran, bank_selected, payment_reference, subtotal, status, created_at, items",
        )
        .order("created_at", { ascending: false }),
      supabase.from("menu").select("id, gambar_url"),
    ]);
    const menuMap = new Map<string, string | null>(
      (menus ?? []).map((m: { id: string; gambar_url: string | null }) => [m.id, m.gambar_url]),
    );
    const rows = ((data as unknown as OrderRow[]) ?? []).map((o) => ({
      ...o,
      items: (o.items ?? []).map((it) => ({
        ...it,
        gambar_url: it.gambar_url ?? (it.menu_id ? menuMap.get(it.menu_id) ?? null : null),
      })),
    }));
    setOrders(rows);
    onCountChange?.(rows.length);
    setLoading(false);
  };

  useEffect(() => {
    if (open) load();
  }, [open]);

  const handleDelete = async () => {
    if (!confirm) return;
    if (confirm.type === "one") {
      const { error } = await supabase.from("pesanan").delete().eq("id", confirm.id);
      if (error) return toast.error("Gagal menghapus pesanan");
      setOrders((prev) => {
        const next = prev.filter((o) => o.id !== confirm.id);
        onCountChange?.(next.length);
        return next;
      });
      toast.success(`Kode ${confirm.code} dihapus`);
    } else {
      const ids = orders.map((o) => o.id);
      if (ids.length === 0) return setConfirm(null);
      const { error } = await supabase.from("pesanan").delete().in("id", ids);
      if (error) return toast.error("Gagal menghapus semua pesanan");
      setOrders([]);
      onCountChange?.(0);
      toast.success("Semua kode pesanan dihapus");
    }
    setConfirm(null);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-primary/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-background rounded-3xl shadow-elegant max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden animate-scale-in">
        <header className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="font-display text-2xl text-primary">Kode Pesanan</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Riwayat pesanan simulasi</p>
          </div>
          <button
            onClick={onClose}
            className="size-9 rounded-full bg-card hover:bg-muted flex items-center justify-center"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="size-4 animate-spin" /> Memuat...
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <Receipt className="size-12 mb-4 opacity-40" />
              <p>Belum ada riwayat pesanan</p>
              <p className="text-xs mt-1">Pesanan yang dikonfirmasi akan tampil di sini</p>
            </div>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="bg-card rounded-2xl p-4 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg text-primary">{o.kode_pesanan}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                      <span>
                        {o.metode_pembayaran}
                        {o.bank_selected ? ` · ${o.bank_selected}` : ""}
                      </span>
                      <span>·</span>
                      <span>
                        {new Date(o.created_at).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-accent/15 text-accent text-[11px] font-semibold">
                        {o.status}
                      </span>
                      <p className="font-semibold text-primary">{formatIDR(o.subtotal)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      setDetail({
                        id: o.id,
                        kode_pesanan: o.kode_pesanan,
                        created_at: o.created_at,
                        metode_pembayaran: o.metode_pembayaran,
                        bank_selected: o.bank_selected,
                        payment_reference: o.payment_reference,
                        status: o.status,
                        subtotal: o.subtotal,
                        items: o.items ?? [],
                      })
                    }
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold border border-primary/25 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Eye className="size-3.5" /> Detail
                  </button>
                  <button
                    onClick={() => setConfirm({ type: "one", id: o.id, code: o.kode_pesanan })}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                    <Trash2 className="size-3.5" /> Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {orders.length > 0 && (
          <div className="p-4 border-t border-border bg-card/50">
            <button
              onClick={() => setConfirm({ type: "all" })}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="size-4" /> Hapus Semua Riwayat
            </button>
          </div>
        )}
      </div>

      {confirm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-primary/70 backdrop-blur-md p-4">
          <div className="bg-background rounded-2xl shadow-elegant max-w-sm w-full p-6 text-center animate-scale-in">
            <h4 className="font-display text-xl text-primary">
              {confirm.type === "one" ? "Hapus kode pesanan ini?" : "Hapus semua riwayat?"}
            </h4>
            <p className="text-sm text-muted-foreground mt-2">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="grid grid-cols-2 gap-2 mt-6">
              <button
                onClick={() => setConfirm(null)}
                className="rounded-xl py-2.5 text-sm font-semibold bg-muted text-foreground/70 hover:bg-muted/80"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="rounded-xl py-2.5 text-sm font-semibold bg-destructive text-destructive-foreground hover:opacity-90"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <OrderDetailModal order={detail} onClose={() => setDetail(null)} />
    </div>
  );
}
