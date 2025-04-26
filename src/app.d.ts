declare module '*?url' {
  const url: string
  export default url
}

declare module '*?raw' {
  const content: string
  export default content
}

declare module 'virtual:typography-importer' {
  export const typeDefinitons: import('../scripts/typography-importer').TypeCategories
}
