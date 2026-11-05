-- Public readers may inspect feature availability; only the Hub bridge may change it.
DROP POLICY IF EXISTS "Admins can insert ai_feature_settings" ON public.ai_feature_settings;
DROP POLICY IF EXISTS "Admins can update ai_feature_settings" ON public.ai_feature_settings;
DROP POLICY IF EXISTS "Authenticated can read ai_feature_settings" ON public.ai_feature_settings;
CREATE POLICY "Authenticated can read ai_feature_settings" ON public.ai_feature_settings FOR SELECT TO authenticated USING (true);
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.ai_feature_settings FROM anon, authenticated;
GRANT SELECT ON public.ai_feature_settings TO anon, authenticated;
