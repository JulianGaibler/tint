import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '@src': '/src',
      '@lib': '/src/lib',
      '@demo': '/src/demo',
    },
  },
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: (d) => {
          const prepend = `@use "src/demo/utils.sass" as tint\n`
          const match = d.match(/^\s*/)
          const spaces = match ? match[0] : ''
          return `${spaces}${prepend}\n${d}`
        },
      },
    },
  },
  build: {
    lib: {
      entry: 'src/lib/index.ts',
      name: 'svelte-tint',
      fileName: (format) => `svelte-tint.${format}.js`,
    },
    rollupOptions: {
      external: ['svelte'],
      output: {
        globals: {
          svelte: 'svelte',
        },
      },
    },
  },
})
