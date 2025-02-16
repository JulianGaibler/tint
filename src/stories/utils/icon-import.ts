// using vite, re-export all files ending with *.svg
const modules = import.meta.glob('../../lib/icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const imported = Object.fromEntries(
  Object.entries(modules).map(([key, value]) => [key, value]),
) as Record<string, string>

export default Object.entries(imported).map(([key, value]) => {
  const [, size, name] = key.match(/\/(\d+)-(.*)\.svg$/)!
  return { size, name, svg: value }
})
