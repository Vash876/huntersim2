import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
// unplugin-icons
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// unplugin-vue-components
import Components from 'unplugin-vue-components/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    wasm(),
    topLevelAwait(),
    nodePolyfills({
      globals: {
        global: true
      }
    }),

    Components({
      resolvers: [
        IconsResolver({
          // Optional: Prefix festlegen
          // componentPrefix: 'Icon', // dann heißen die Components <IconTablerHome />
        }),
      ],
    }),
    Icons({
      // Lädt fehlende Icons bei Bedarf automatisch nach
      autoInstall: true,
    }),
  ],
  worker: {
    format: 'es', // Verwende ES-Module in Workern
    plugins: [
      wasm(),           
      topLevelAwait()  
    ] 
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        pure_funcs: ['console.log', 'console.debug', 'console.info']
      },
      format: {
        comments: false
      },
      mangle: {
        properties: {
          regex: /_$/  // Ändere nur Properties die mit _ enden
        }
      }
    },
    target: 'esnext',
    sourcemap: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    fs: {
      allow: ['..']
    }
  },
  assetsInclude: ['**/*.wasm']
})