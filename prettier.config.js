const config = {
  semi: false,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  plugins: ['prettier-plugin-svelte', 'prettier-plugin-jsdoc'],
  overrides: [
    {
      files: '*.mdx',
      options: {
        proseWrap: 'always',
      },
    },
  ],
}

export default config
