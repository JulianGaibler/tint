import React, { useState } from 'react'
import { styled } from 'storybook/theming'

interface ColorInputProps {
  label: string
  value: string
  onChange: (value: string) => void
}

const InputContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
})

const Label = styled.label(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 500,
  color: theme.color.defaultText,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}))

const InputWrapper = styled.div({
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
})

const ColorSwatch = styled.div<{ color: string }>(({ color, theme }) => ({
  width: '32px',
  height: '32px',
  borderRadius: '4px',
  border: `1px solid ${theme.appBorderColor}`,
  backgroundColor: color,
  cursor: 'pointer',
  flexShrink: 0,
}))

const Input = styled.input(({ theme }) => ({
  flex: 1,
  padding: '0.5rem',
  borderRadius: '4px',
  border: `1px solid ${theme.appBorderColor}`,
  backgroundColor: theme.background.content,
  color: theme.color.defaultText,
  fontSize: '0.875rem',
  fontFamily: 'monospace',

  '&:focus': {
    outline: `2px solid ${theme.color.secondary}`,
    outlineOffset: '2px',
    borderColor: theme.color.secondary,
  },
}))

const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange }) => {
  const [localValue, setLocalValue] = useState(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
  }

  const handleBlur = () => {
    onChange(localValue)
  }

  const handleSwatchClick = () => {
    const input = document.createElement('input')
    input.type = 'color'

    // Convert current color to hex for color picker
    try {
      const ctx = document.createElement('canvas').getContext('2d')
      if (ctx) {
        ctx.fillStyle = value
        input.value = ctx.fillStyle
      }
    } catch (_e) {
      input.value = '#000000'
    }

    input.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement
      setLocalValue(target.value)
      onChange(target.value)
    })

    input.click()
  }

  // Update local value when prop changes
  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  return (
    <InputContainer>
      <Label>{label}</Label>
      <InputWrapper>
        <ColorSwatch
          color={value}
          onClick={handleSwatchClick}
          title="Click to pick color"
        />
        <Input
          type="text"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="#ffffff"
        />
      </InputWrapper>
    </InputContainer>
  )
}

export default ColorInput
