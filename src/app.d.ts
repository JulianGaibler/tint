declare module '*?url' {
  const url: string
  export default url
}

declare module '*?raw' {
  const content: string
  export default content
}

declare module 'vite' {
  interface ImportMeta {
    glob(pattern: string): Record<string, () => Promise<any>>
  }
}

declare module 'virtual:typography-importer' {
  export const typeDefinitons: any[]
}
