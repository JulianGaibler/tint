import './global.sass'
import SvelteApp from '@demo/App.svelte'
import { mount } from 'svelte'

const elementSvelte = document.getElementById('svelte') as HTMLElement

mount(SvelteApp, {
  target: elementSvelte,
})
