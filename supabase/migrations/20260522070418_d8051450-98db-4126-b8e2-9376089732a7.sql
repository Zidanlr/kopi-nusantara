
-- HERO
CREATE TABLE public.hero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headline TEXT NOT NULL,
  subheadline TEXT,
  cta_text TEXT,
  background_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.hero ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hero public read" ON public.hero FOR SELECT USING (true);

-- ABOUT
CREATE TABLE public.about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judul TEXT NOT NULL,
  deskripsi TEXT,
  gambar TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.about ENABLE ROW LEVEL SECURITY;
CREATE POLICY "about public read" ON public.about FOR SELECT USING (true);

-- MENU
CREATE TABLE public.menu (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_menu TEXT NOT NULL,
  deskripsi TEXT,
  harga INTEGER NOT NULL DEFAULT 0,
  kategori TEXT,
  gambar TEXT,
  allow_sugar_level BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.menu ENABLE ROW LEVEL SECURITY;
CREATE POLICY "menu public read" ON public.menu FOR SELECT USING (true);

-- TESTIMONIALS
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  review TEXT NOT NULL,
  foto TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "testimonials public read" ON public.testimonials FOR SELECT USING (true);

-- SOSIAL_MEDIA
CREATE TABLE public.sosial_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp TEXT,
  instagram TEXT,
  alamat TEXT,
  jam_operasional TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.sosial_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sosial_media public read" ON public.sosial_media FOR SELECT USING (true);

-- PESANAN
CREATE TABLE public.pesanan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kode_pesanan TEXT NOT NULL UNIQUE,
  nama_pelanggan TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal INTEGER NOT NULL DEFAULT 0,
  metode_pembayaran TEXT NOT NULL,
  bank_selected TEXT,
  payment_reference TEXT,
  status TEXT NOT NULL DEFAULT 'Menunggu Konfirmasi',
  catatan TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.pesanan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pesanan public insert" ON public.pesanan FOR INSERT WITH CHECK (true);
CREATE POLICY "pesanan public read" ON public.pesanan FOR SELECT USING (true);

-- STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public) VALUES ('coffee-images', 'coffee-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "coffee-images public read" ON storage.objects FOR SELECT USING (bucket_id = 'coffee-images');
CREATE POLICY "coffee-images public upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'coffee-images');
CREATE POLICY "coffee-images public update" ON storage.objects FOR UPDATE USING (bucket_id = 'coffee-images');
CREATE POLICY "coffee-images public delete" ON storage.objects FOR DELETE USING (bucket_id = 'coffee-images');

-- SEED DATA
INSERT INTO public.hero (headline, subheadline, cta_text) VALUES
('Cita Rasa Kopi Nusantara dalam Setiap Tegukan', 'Diseduh dengan biji kopi pilihan dari pegunungan terbaik Indonesia — Gayo, Toraja, hingga Kintamani.', 'Lihat Menu');

INSERT INTO public.about (judul, deskripsi) VALUES
('Warisan Kopi dari Tanah Nusantara', 'Kopi Nusantara lahir dari kecintaan kami terhadap kekayaan kopi Indonesia. Setiap biji kami pilih langsung dari petani lokal di Gayo, Toraja, Kintamani, dan Flores. Diseduh dengan teknik manual brew dan espresso modern, kami menghadirkan pengalaman ngopi yang hangat, autentik, dan penuh cerita.');

INSERT INTO public.sosial_media (whatsapp, instagram, alamat, jam_operasional) VALUES
('6281234567890', '@kopinusantara', 'Jl. Sudirman No. 123, Jakarta Selatan', 'Senin - Minggu, 07:00 - 23:00');

INSERT INTO public.testimonials (nama, review) VALUES
('Andini Pratama', 'Suasananya hangat dan kopinya luar biasa. Caramel Latte-nya jadi favorit saya tiap pagi.'),
('Reza Mahendra', 'Tempat terbaik untuk meeting dan ngerjain laptop. V60 Gayo-nya juara!'),
('Sasha Wirawan', 'Bukan sekadar kopi, ini pengalaman. Baristanya ramah, interiornya estetik banget.');

INSERT INTO public.menu (nama_menu, deskripsi, harga, kategori, allow_sugar_level, sort_order) VALUES
('Espresso', 'Single shot espresso pekat dari blend house signature.', 22000, 'Coffee', false, 1),
('Americano', 'Espresso dengan air panas, clean dan bold.', 25000, 'Coffee', false, 2),
('V60 Gayo', 'Manual brew biji Arabika Gayo, floral & citrus.', 32000, 'Manual Brew', false, 3),
('Caramel Latte', 'Espresso, susu segar, dan saus karamel premium.', 35000, 'Coffee', true, 4),
('Cappuccino', 'Espresso dengan steamed milk dan foam lembut.', 30000, 'Coffee', true, 5),
('Mocha', 'Perpaduan espresso, cokelat Belgia, dan susu.', 36000, 'Coffee', true, 6),
('Hazelnut Milk Coffee', 'Kopi susu dengan sentuhan hazelnut harum.', 28000, 'Milk Coffee', true, 7),
('Matcha Latte', 'Bubuk matcha premium Jepang dengan susu segar.', 34000, 'Non-Coffee', true, 8),
('Earl Grey Tea', 'Teh hitam bergamot diseduh hangat.', 24000, 'Tea', true, 9),
('Tiramisu Cake', 'Lapisan mascarpone dengan kopi espresso.', 38000, 'Dessert', false, 10);
