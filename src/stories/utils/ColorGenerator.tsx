import React, { useState } from 'react'
import { styled } from 'storybook/theming'
import ComponentPreview from './ComponentPreview'
import ColorInput from './ColorInput'
import { presetPalettes } from './ColorGenerator/presets'
import { generateScss, downloadScss } from './ColorGenerator/helpers'
import type { ColorPalette, PaletteColors } from './ColorGenerator/types'

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
})

const Controls = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1.5rem',
  backgroundColor: theme.background.content,
  borderRadius: '8px',
  border: `1px solid ${theme.appBorderColor}`,
}))

const ControlRow = styled.div({
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
})

const Select = styled.select(({ theme }) => ({
  padding: '0.5rem',
  borderRadius: '4px',
  border: `1px solid ${theme.appBorderColor}`,
  backgroundColor: theme.background.content,
  color: theme.color.defaultText,
  fontSize: '0.875rem',
  flex: 1,
}))

const Checkbox = styled.input({
  width: '18px',
  height: '18px',
  cursor: 'pointer',
})

const Label = styled.label(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.color.defaultText,
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  cursor: 'pointer',
}))

const WorkspaceContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',

  '@media (min-width: 500px)': {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
})

const PaletteSection = styled.div({
  flex: '1',
  minWidth: 0,
})

const PreviewSection = styled.div({
  flex: '1',
  minWidth: 0,
})

const Section = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
})

const SectionTitle = styled.h3(({ theme }) => ({
  margin: 0,
  fontSize: '1rem',
  fontWeight: 600,
  color: theme.color.defaultText,
  paddingBottom: '0.5rem',
  borderBottom: `1px solid ${theme.appBorderColor}`,
}))

const ColorGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '1rem',
})

const ColorKeyGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
})

const ColorKeyLabel = styled.div(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: theme.color.defaultText,
  textTransform: 'capitalize',
}))

const ColorVariantsRow = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '0.5rem',
})

const Button = styled.button(({ theme }) => ({
  padding: '0.75rem 1.5rem',
  borderRadius: '6px',
  border: `1px solid ${theme.color.secondary}`,
  backgroundColor: theme.color.secondary,
  color: 'white',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s',

  '&:hover': {
    opacity: 0.9,
  },

  '&:active': {
    opacity: 0.8,
  },
}))

// Default colors
const defaultColors: ColorPalette = presetPalettes[0].colors

const ColorGenerator: React.FC = () => {
  const [selectedPreset, setSelectedPreset] = useState(0)
  const [includeDark, setIncludeDark] = useState(false)
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light')
  const [colors, setColors] = useState<ColorPalette>(defaultColors)
  const [darkColors, setDarkColors] = useState<ColorPalette | undefined>(
    presetPalettes[0].dark,
  )

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value, 10)
    setSelectedPreset(index)
    const preset = presetPalettes[index]
    setColors(preset.colors)
    setDarkColors(preset.dark)
  }

  const handleIncludeDarkChange = (checked: boolean) => {
    setIncludeDark(checked)
    if (checked && !darkColors) {
      // Initialize dark mode with light mode colors if it doesn't exist
      setDarkColors({ ...colors })
    }
    if (!checked) {
      setPreviewMode('light')
    }
  }

  const handleColorChange = (
    palette: 'plain' | 'tint',
    key: keyof PaletteColors,
    value: string,
  ) => {
    setColors((prev) => ({
      ...prev,
      [palette]: {
        ...prev[palette],
        [key]: value,
      },
    }))
  }

  const handleDarkColorChange = (
    palette: 'plain' | 'tint',
    key: keyof PaletteColors,
    value: string,
  ) => {
    setDarkColors((prev) =>
      prev
        ? {
            ...prev,
            [palette]: {
              ...prev[palette],
              [key]: value,
            },
          }
        : undefined,
    )
  }

  const handleGeneralChange = (
    key: 'card-border' | 'card-shadow',
    value: string,
  ) => {
    setColors((prev) => ({
      ...prev,
      general: {
        ...prev.general,
        [key]: value,
      },
    }))
  }

  const handleDarkGeneralChange = (
    key: 'card-border' | 'card-shadow',
    value: string,
  ) => {
    setDarkColors((prev) =>
      prev
        ? {
            ...prev,
            general: {
              ...prev.general,
              [key]: value,
            },
          }
        : undefined,
    )
  }

  const handleExport = () => {
    const scss = generateScss(
      colors,
      includeDark && darkColors ? darkColors : undefined,
    )
    downloadScss(scss)
  }

  const activeColors =
    previewMode === 'dark' && darkColors ? darkColors : colors

  // Get all unique keys from both plain and tint palettes
  const allKeys = Array.from(
    new Set([
      ...Object.keys(colors.plain),
      ...Object.keys(colors.tint),
    ] as Array<keyof PaletteColors>),
  )

  return (
    <Container>
      <Controls>
        <ControlRow>
          <Label>
            Preset Palette:
            <Select value={selectedPreset} onChange={handlePresetChange}>
              {presetPalettes.map((preset, index) => (
                <option key={index} value={index}>
                  {preset.name}
                </option>
              ))}
            </Select>
          </Label>
        </ControlRow>

        <ControlRow>
          <Label>
            <Checkbox
              type="checkbox"
              checked={includeDark}
              onChange={(e) => handleIncludeDarkChange(e.target.checked)}
            />
            Include dark mode palette
          </Label>
        </ControlRow>

        {includeDark && (
          <ControlRow>
            <Label>
              Preview Mode:
              <Select
                value={previewMode}
                onChange={(e) =>
                  setPreviewMode(e.target.value as 'light' | 'dark')
                }
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </Select>
            </Label>
          </ControlRow>
        )}
      </Controls>

      <WorkspaceContainer>
        <PaletteSection>
          <Section>
            <SectionTitle>
              {previewMode === 'dark'
                ? 'Dark Mode Colors'
                : 'Light Mode Colors'}
            </SectionTitle>
            <ColorGrid>
              {allKeys.map((key) => {
                const currentPalette =
                  previewMode === 'dark' && darkColors ? darkColors : colors
                return (
                  <ColorKeyGroup key={key}>
                    <ColorKeyLabel>{key.replace(/-/g, ' ')}</ColorKeyLabel>
                    <ColorVariantsRow>
                      <ColorInput
                        label="Plain"
                        value={currentPalette.plain[key]}
                        onChange={(value) => {
                          if (previewMode === 'dark') {
                            handleDarkColorChange('plain', key, value)
                          } else {
                            handleColorChange('plain', key, value)
                          }
                        }}
                      />
                      <ColorInput
                        label="Tinted"
                        value={currentPalette.tint[key]}
                        onChange={(value) => {
                          if (previewMode === 'dark') {
                            handleDarkColorChange('tint', key, value)
                          } else {
                            handleColorChange('tint', key, value)
                          }
                        }}
                      />
                    </ColorVariantsRow>
                  </ColorKeyGroup>
                )
              })}
            </ColorGrid>
          </Section>

          <Section>
            <SectionTitle>General (Shared)</SectionTitle>
            <ColorGrid>
              <ColorKeyGroup>
                <ColorKeyLabel>Card Border</ColorKeyLabel>
                <ColorVariantsRow>
                  <ColorInput
                    label="Plain/Tinted"
                    value={
                      previewMode === 'dark' && darkColors
                        ? darkColors.general['card-border']
                        : colors.general['card-border']
                    }
                    onChange={(value) => {
                      if (previewMode === 'dark') {
                        handleDarkGeneralChange('card-border', value)
                      } else {
                        handleGeneralChange('card-border', value)
                      }
                    }}
                  />
                </ColorVariantsRow>
              </ColorKeyGroup>
              <ColorKeyGroup>
                <ColorKeyLabel>Card Shadow</ColorKeyLabel>
                <ColorVariantsRow>
                  <ColorInput
                    label="Plain/Tinted"
                    value={
                      previewMode === 'dark' && darkColors
                        ? darkColors.general['card-shadow']
                        : colors.general['card-shadow']
                    }
                    onChange={(value) => {
                      if (previewMode === 'dark') {
                        handleDarkGeneralChange('card-shadow', value)
                      } else {
                        handleGeneralChange('card-shadow', value)
                      }
                    }}
                  />
                </ColorVariantsRow>
              </ColorKeyGroup>
            </ColorGrid>
          </Section>
        </PaletteSection>

        <PreviewSection>
          <ComponentPreview palette={activeColors} />
        </PreviewSection>
      </WorkspaceContainer>

      <div>
        <Button onClick={handleExport}>Export to SCSS</Button>
      </div>
    </Container>
  )
}

export default ColorGenerator
