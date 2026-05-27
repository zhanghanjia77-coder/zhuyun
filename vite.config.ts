import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 便于手机通过 http://电脑局域网IP:5173 访问开发服（邮件回调也须用同一主机名加入白名单）
    host: true,
    port: 5173,
  },
})


