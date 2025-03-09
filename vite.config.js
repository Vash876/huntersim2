import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// unplugin-icons
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

// unplugin-vue-components
import Components from 'unplugin-vue-components/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),

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
    plugins: [] // Keine speziellen Plugins für Worker
  },
  build: {
    target: 'esnext', // Modernes JavaScript
    sourcemap: true, // Für besseres Debugging
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})