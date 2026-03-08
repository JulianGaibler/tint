import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import typographyImporter from '../scripts/typography-importer.ts'
import type { StorybookConfig } from '@storybook/svelte-vite'
import { mergeConfig, loadConfigFromFile } from 'vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],

  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-svelte-csf"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-vitest")
  ],

  framework: {
    name: getAbsolutePath("@storybook/svelte-vite"),
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

  features: {
    backgrounds: false,
    measure: false,
    outline: false
  }
}
export default config

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
