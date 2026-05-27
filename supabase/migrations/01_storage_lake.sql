INSERT INTO storage.buckets (id, name, public)
VALUES ('zhuyun-assets', 'zhuyun-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "zhuyun_assets_select_public" ON storage.objects
FOR SELECT TO public USING (bucket_id = 'zhuyun-assets');

CREATE POLICY "zhuyun_assets_insert_authenticated" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'zhuyun-assets');

CREATE POLICY "zhuyun_assets_update_authenticated" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'zhuyun-assets') WITH CHECK (bucket_id = 'zhuyun-assets');

CREATE POLICY "zhuyun_assets_delete_authenticated" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'zhuyun-assets');
