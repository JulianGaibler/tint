import Heading1 from './Heading1'
import './global.sass'
import tintTheme from './tint-theme'
import { PARAM_KEY } from './toggle-tint/constants'
import { withTintedClass } from './toggle-tint/withTint'
import type { Preview } from '@storybook/svelte'
import type { Addon_DecoratorFunction } from '@storybook/types'

export const decorators: Addon_DecoratorFunction[] = [withTintedClass]

export const globals = {
  [PARAM_KEY]: false,
}

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
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
}

export default preview
