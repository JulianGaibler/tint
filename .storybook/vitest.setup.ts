import { setProjectAnnotations } from '@storybook/svelte-vite'
import { beforeAll } from 'vitest'
import * as previewAnnotations from './preview'

const annotations = setProjectAnnotations([previewAnnotations])

// Run Storybook's beforeAll hook to set up any global state
beforeAll(annotations.beforeAll)
