import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";

export type SugarLevel = "Normal" | "Less Sugar" | "No Sugar";

export interface MenuItem {
  id: string;
  nama_menu: string;
  deskripsi: string | null;
  harga: number;
  kategori: string | null;
  gambar_url: string | null;
  allow_sugar_level: boolean;
}

export interface CartItem {
  key: string;
  menu_id: string;
  menu_name: string;
  price: number;
  qty: number;
  sugar_level: SugarLevel | null;
  gambar_url: string | null;
  allow_sugar_level: boolean;
}

interface CartCtx {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (m: MenuItem) => void;
  inc: (key: string) => void;
  dec: (key: string) => void;
  remove: (key: string) => void;
  setSugar: (key: string, sugar: SugarLevel) => void;
  clear: () => void;
  totalQty: number;
  subtotal: number;
}

const Ctx = createContext<CartCtx | null>(null);

const keyFor = (menu_id: string, sugar: SugarLevel | null) =>
  `${menu_id}__${sugar ?? "none"}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((m: MenuItem) => {
    const sugar: SugarLevel | null = m.allow_sugar_level ? "Normal" : null;
    const key = keyFor(m.id, sugar);
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      return [
        ...prev,
        {
          key,
          menu_id: m.id,
          menu_name: m.nama_menu,
          price: m.harga,
          qty: 1,
          sugar_level: sugar,
          gambar_url: m.gambar_url,
          allow_sugar_level: m.allow_sugar_level,
        },
      ];
    });
    toast.success("Pesanan berhasil ditambahkan", {
      description: m.nama_menu,
      icon: <Check className="size-4" />,
      duration: 2200,
    });
  }, []);

  const inc = useCallback((key: string) => {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i)));
  }, []);

  const dec = useCallback((key: string) => {
    setItems((prev) =>
      prev.flatMap((i) =>
        i.key === key ? (i.qty - 1 <= 0 ? [] : [{ ...i, qty: i.qty - 1 }]) : [i],
      ),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const setSugar = useCallback((key: string, sugar: SugarLevel) => {
    setItems((prev) => {
      const target = prev.find((i) => i.key === key);
      if (!target) return prev;
      const newKey = keyFor(target.menu_id, sugar);
      const existing = prev.find((i) => i.key === newKey && i.key !== key);
      if (existing) {
        return prev
          .filter((i) => i.key !== key)
          .map((i) => (i.key === newKey ? { ...i, qty: i.qty + target.qty } : i));
      }
      return prev.map((i) => (i.key === key ? { ...i, key: newKey, sugar_level: sugar } : i));
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <Ctx.Provider
      value={{ items, isOpen, openCart, closeCart, addItem, inc, dec, remove, setSugar, clear, totalQty, subtotal }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be inside CartProvider");
  return v;
}
