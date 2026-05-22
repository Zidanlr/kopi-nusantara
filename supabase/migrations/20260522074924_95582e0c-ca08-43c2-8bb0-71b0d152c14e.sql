ALTER TABLE public.menu RENAME COLUMN gambar TO gambar_url;

CREATE POLICY "pesanan public delete"
ON public.pesanan
FOR DELETE
TO public
USING (true);