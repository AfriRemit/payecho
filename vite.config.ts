import { defineConfig } from 'vite'
import type { Connect, Plugin, ViteDevServer } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import fs from 'fs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

// Serve OnchainKit CSS as static so it never runs through PostCSS/Tailwind
// (OnchainKit's CSS uses @layer and would error without @tailwind in the same file)
function onchainkitCssPlugin(): Plugin {
  const onchainkitCssPath = path.resolve(
    path.dirname(require.resolve('@coinbase/onchainkit/package.json')),
    'dist/assets/style.css'
  )
  return {
    name: 'onchainkit-css-static',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req: Connect.IncomingMessage, res, next) => {
        if (req.url === '/onchainkit-styles.css') {
          const css = fs.readFileSync(onchainkitCssPath, 'utf-8')
          res.setHeader('Content-Type', 'text/css')
          res.end(css)
        } else {
          next()
        }
      })
    },
    writeBundle() {
      const out = path.resolve(process.cwd(), 'dist/onchainkit-styles.css')
      fs.mkdirSync(path.dirname(out), { recursive: true })
      fs.copyFileSync(onchainkitCssPath, out)
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    onchainkitCssPlugin(),
  ],
  server: {
    // Allow any host so *.loca.lt tunnel URLs work
    allowedHosts: true,
    // Disable HMR when using a tunnel (set DISABLE_HMR=1) to avoid white screen
    hmr: process.env.DISABLE_HMR ? false : true,
  },
})