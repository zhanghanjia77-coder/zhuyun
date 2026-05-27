-- 为已登录角色授予 profiles 表级权限（RLS 仍生效；缺此授权时客户端 upsert 会报 permission denied）
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;
