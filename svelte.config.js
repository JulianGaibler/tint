import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

const __dirname = path.resolve()

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  kit: {
    // This is used by svelte-package to resolve imports
    // [!] Also update in vite.config.js and tsconfig.json
    alias: {
      '@src': path.resolve(__dirname, './src'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@demo': path.resolve(__dirname, './src/demo'),
    },
  },
}
