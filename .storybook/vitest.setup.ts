import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from '@storybook/svelte-vite'
import { beforeAll } from 'vitest'
import * as previewAnnotations from './preview'

const annotations = setProjectAnnotations([a11yAddonAnnotations, previewAnnotations])

// Run Storybook's beforeAll hook to set up any global state
beforeAll(annotations.beforeAll)
