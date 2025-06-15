import Heading1 from './Heading1'
import './global.sass'
import tintTheme from './tint-theme'
import { PARAM_KEY } from './toggle-tint/constants'
import { withTintedClass } from './toggle-tint/withTint'
import type { Preview } from '@storybook/svelte-vite'
import type { Addon_DecoratorFunction } from 'storybook/internal/types'

export const decorators: Addon_DecoratorFunction[] = [withTintedClass]

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      grid: {
        cellSize: 8,
        cellAmount: 8,
      },
    },
    docs: {
      components: { h1: Heading1 },
      theme: tintTheme,
    },
  },

  tags: ['autodocs', 'autodocs'],

  initialGlobals: {
    [PARAM_KEY]: false,
  },
}

export default preview
