import tintLogo from './tint-logo.svg?url'
import { create } from '@storybook/theming'

export default create({
  base: 'light',

  fontBase: '"Inter", sans-serif',
  fontCode: '"Menlo", monospace',

  brandTitle: 'tint - design foundation',
  brandImage: tintLogo,
  brandTarget: '_self',

  appBg: '#FFF6F6',

  appBorderRadius: 16,
  inputBorderRadius: 16,
})
