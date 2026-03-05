import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    // Allow any host so *.loca.lt tunnel URLs work
    allowedHosts: true,
    // Disable HMR when using a tunnel (set DISABLE_HMR=1) to avoid white screen
    hmr: process.env.DISABLE_HMR ? false : true,
  },
})