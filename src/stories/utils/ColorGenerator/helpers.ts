import type { ColorPalette, PaletteColors } from './types'

/** Convert color palette to SCSS format */
export function generateScss(
  palette: ColorPalette,
  includeDark?: ColorPalette,
): string {
  const formatPaletteColors = (colors: PaletteColors, indent = '    ') => {
    return Object.entries(colors)
      .map(([key, value]) => `${indent}${key}: ${value},`)
      .join('\n')
  }

  const formatColors = (pal: ColorPalette) => `$colors: (
  plain: (
${formatPaletteColors(pal.plain)}
  ),
  tint: (
${formatPaletteColors(pal.tint)}
  ),
  general: (
    card-border: ${pal.general['card-border']},
    card-shadow: '${pal.general['card-shadow']}',
  ),
);`

  let scss = formatColors(palette)

  if (includeDark) {
    scss +=
      '\n\n' + formatColors(includeDark).replace('$colors', '$colors-dark')
  }

  return scss
}

/** Download SCSS file */
export function downloadScss(content: string, filename = 'colors.scss') {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** Validate if a string is a valid color */
export function isValidColor(color: string): boolean {
  // Check for hex
  if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) return true

  // Check for rgb/rgba
  if (/^rgba?\(/.test(color)) return true

  // Check for hsl/hsla
  if (/^hsla?\(/.test(color)) return true

  // Check for oklch
  if (/^oklch\(/.test(color)) return true

  return false
}

/** Format color to HEX if possible */
export function tryConvertToHex(color: string): string {
  if (color.startsWith('#')) return color.toUpperCase()

  // Try to convert using canvas
  const ctx = document.createElement('canvas').getContext('2d')
  if (!ctx) return color

  ctx.fillStyle = color
  return ctx.fillStyle.toUpperCase()
}
