import typographyImporter from '../scripts/typography-importer.ts'
import type { StorybookConfig } from '@storybook/svelte-vite'
import { mergeConfig, loadConfigFromFile } from 'vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
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
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/svelte-vite',
    options: {},
  },
  docs: {},
  staticDirs: ['../static'],
  async viteFinal(config, { configType }) {
    const result = await loadConfigFromFile(
      new URL('../vite.config.ts', import.meta.url).pathname as any,
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
}
export default config
