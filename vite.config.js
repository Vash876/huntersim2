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
import svgLoader from 'vite-svg-loader'

// unplugin-vue-components
import Components from 'unplugin-vue-components/vite'

// https://vite.dev/config/
export default defineConfig({
  esbuild: {
    // Handle React "use client" directives
    banner: '',
    legalComments: 'none'
  },
  plugins: [
    vue(),
    svgLoader(),
    tailwindcss(),
    wasm(),
    topLevelAwait(),
    nodePolyfills({
      globals: {
        global: true
      }
    }),

    // Plugin to remove "use client" directives
    {
      name: 'remove-use-client',
      transform(code, id) {
        if (id.includes('@stackframe') || id.includes('node_modules')) {
          return code.replace(/^['"]use client['"];?\s*/gm, '');
        }
        return code;
      }
    },

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

  define: {
    __BUILD_TIME__: JSON.stringify(Date.now())
  },

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
        drop_debugger: true,
        pure_funcs: [
          'console.log', 
          'console.debug', 
          'console.info',
          'console.warn'  
        ]
      },
      format: {
        comments: false
      }
      // Removed mangle.properties because it breaks Firebase/Firestore internals (Unexpected state ID: 3fdd)
    },
    target: 'esnext',
    sourcemap: false,
    // Stack Auth removed - now using Firebase
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {}
      }
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    // Entferne sensible Environment Variables aus Production Build
    define: {}
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
    exclude: [],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  ssr: {
    noExternal: []
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    host: 'localhost',
    https: false,
    open: true,
    fs: {
      allow: ['..']
    }
  },
  assetsInclude: ['**/*.wasm']
})