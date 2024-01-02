import './global.sass'
import SvelteApp from '@demo/App.svelte'

const elementSvelte = document.getElementById('svelte') as HTMLElement

const app = new SvelteApp({
  target: elementSvelte,
})
