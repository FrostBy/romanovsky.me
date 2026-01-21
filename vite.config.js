import { defineConfig } from 'vite'
import { viteConvertPugInHtml } from '@mish.dev/vite-convert-pug-in-html'

export default defineConfig({
  root: 'src',
  publicDir: 'public',
  plugins: [
    viteConvertPugInHtml()
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})
