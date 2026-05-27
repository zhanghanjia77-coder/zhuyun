-- 仅使用 00_initial_schema 中一定存在的列（id, username, created_at），避免库未跑 02 迁移时出现 PGRST204（schema cache 无 email 列）
-- 若已存在旧版函数定义，本文件会覆盖为兼容版

CREATE OR REPLACE FUNCTION public.save_profile_username(p_username text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_username text := NULLIF(TRIM(p_username), '');
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  UPDATE public.profiles
  SET username = v_username
  WHERE id = auth.uid();

  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, username, created_at)
    VALUES (auth.uid(), v_username, now());
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.save_profile_username(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.save_profile_username(text) TO authenticated;
