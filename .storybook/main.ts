import typographyImporter from '../scripts/typography-importer'
import type { StorybookConfig } from '@storybook/svelte-vite'
import * as path from 'path'
import { mergeConfig, loadConfigFromFile } from 'vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-svelte-csf',
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false,
        measure: false,
        outline: false,
      },
    },
    '@storybook/addon-a11y',
  ],
  core: {},
  async viteFinal(config, { configType }) {
    const result = await loadConfigFromFile(
      path.resolve(__dirname, '../vite.config.ts') as any,
    )

    if (!result) {
      throw new Error('Failed to load Vite config')
    }

    delete result.config.build

    return mergeConfig(config, {
      ...result.config,
      assetsInclude: ['/sb-preview/runtime.js'],
      // manually specify plugins to avoid conflict
      plugins: [typographyImporter()],
    })
  },
  framework: {
    name: '@storybook/svelte-vite',
    options: {},
  },
  docs: {
    autodocs: true,
  },
  staticDirs: ['../static'],
}

export default config
