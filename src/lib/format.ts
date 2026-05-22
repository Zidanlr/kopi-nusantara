export const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

export const generateOrderCode = () => {
  const y = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `KPN-${y}-${rand}`;
};
