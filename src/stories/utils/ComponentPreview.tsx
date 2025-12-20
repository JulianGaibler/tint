import React from 'react'
import { styled } from 'storybook/theming'
import type { ColorPalette } from './ColorGenerator/types'

interface ComponentPreviewProps {
  palette: ColorPalette
}

const PreviewContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
})

const ModePreview = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1.5rem',
  borderRadius: '8px',
  minHeight: '400px',
})

const PreviewTitle = styled.h3({
  margin: 0,
  fontSize: '0.875rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '0.5rem',
  color: 'var(--tint-text)',
})

const StyledButton = styled.button({
  boxSizing: 'border-box',
  minHeight: '48px',
  padding: '8px 24px',
  backgroundColor: 'transparent',
  border: '2px solid var(--tint-action-secondary)',
  color: 'var(--tint-action-secondary-text)',
  borderRadius: '12px',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontSize: '1rem',
  fontWeight: 600,
  lineHeight: 1.5,

  '&:focus-visible': {
    outline: '2px solid var(--tint-action-primary)',
    outlineOffset: '2px',
  },

  '&:hover': {
    backgroundColor: 'var(--tint-action-secondary-hover)',
  },

  '&:active': {
    backgroundColor: 'var(--tint-action-secondary-active)',
  },

  '&.primary': {
    backgroundColor: 'var(--tint-action-primary)',
    borderColor: 'transparent',
    color: 'var(--tint-action-primary-text)',

    '&:hover': {
      backgroundColor: 'var(--tint-action-primary-hover)',
    },

    '&:active': {
      backgroundColor: 'var(--tint-action-primary-active)',
    },
  },

  '&.ghost': {
    borderColor: 'transparent',

    '&:hover': {
      backgroundColor: 'var(--tint-action-secondary-hover)',
    },

    '&:active': {
      backgroundColor: 'var(--tint-action-secondary-active)',
    },
  },
})

const InputGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0',
  position: 'relative',
  width: '100%',
})

const InputLabel = styled.label({
  fontSize: '0.875rem',
  fontWeight: 400,
  lineHeight: 1.25,
  color: 'var(--tint-text-secondary)',
  position: 'absolute',
  left: '12px',
  top: '50%',
  transform: 'translateY(-55%) scale(1.166)',
  transformOrigin: 'left top',
  transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms',
  pointerEvents: 'none',

  '&.filled': {
    transform: 'translateY(-106%) scale(1.0)',
  },
})

const StyledInput = styled.input({
  boxSizing: 'border-box',
  minHeight: '48px',
  borderRadius: '8px',
  border: '2px solid transparent',
  backgroundColor: 'var(--tint-input-bg)',
  color: 'var(--tint-text)',
  fontSize: '1rem',
  lineHeight: 1.5,
  fontFamily: 'inherit',
  width: '100%',
  margin: 0,
  padding: '19px 12px 5px 12px',

  '&:focus-visible': {
    outline: '2px solid var(--tint-action-primary)',
    outlineOffset: '2px',
  },

  '&:focus + label, &.filled + label': {
    transform: 'translateY(-106%) scale(1.0)',
  },
})

const StyledSelect = styled.select({
  appearance: 'none',
  boxSizing: 'border-box',
  minHeight: '48px',
  borderRadius: '8px',
  border: '2px solid transparent',
  backgroundColor: 'var(--tint-input-bg)',
  color: 'var(--tint-text)',
  fontSize: '1rem',
  lineHeight: 1.5,
  fontFamily: 'inherit',
  width: '100%',
  margin: 0,
  padding: '19px 44px 5px 12px',
  cursor: 'pointer',
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 9L3.5 5.5L4.5 4.5L7 7L9.5 4.5L10.5 5.5L7 9Z' fill='%23666'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',

  '&:focus-visible': {
    outline: '2px solid var(--tint-action-primary)',
    outlineOffset: '2px',
  },
})

const Card = styled.div({
  padding: '16px',
  borderRadius: '12px',
  border: '1px solid var(--tint-card-border)',
  backgroundColor: 'var(--tint-bg)',
  boxShadow: 'var(--tint-card-shadow)',
})

const ComponentPreview: React.FC<ComponentPreviewProps> = ({ palette }) => {
  const renderPreview = (mode: 'plain' | 'tint') => {
    const colors = mode === 'plain' ? palette.plain : palette.tint

    // Create CSS custom properties string
    const cssVars = {
      '--tint-bg': colors.bg,
      '--tint-text': colors.text,
      '--tint-text-secondary': colors['text-secondary'],
      '--tint-text-accent': colors['text-accent'],
      '--tint-text-link': colors['text-link'],
      '--tint-action-primary': colors['action-primary'],
      '--tint-action-primary-text': colors['action-primary-text'],
      '--tint-action-primary-hover': colors['action-primary-hover'],
      '--tint-action-primary-active': colors['action-primary-active'],
      '--tint-action-secondary': colors['action-secondary'],
      '--tint-action-secondary-text': colors['action-secondary-text'],
      '--tint-action-secondary-hover': colors['action-secondary-hover'],
      '--tint-action-secondary-active': colors['action-secondary-active'],
      '--tint-input-bg': colors['input-bg'],
      '--tint-card-border': palette.general['card-border'],
      '--tint-card-shadow': palette.general['card-shadow'],
    } as React.CSSProperties

    return (
      <ModePreview style={{ ...cssVars, backgroundColor: colors.bg }}>
        <PreviewTitle>{mode === 'plain' ? 'Plain' : 'Tinted'}</PreviewTitle>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <StyledButton className="primary">Primary</StyledButton>
          <StyledButton>Secondary</StyledButton>
          <StyledButton className="ghost">Ghost</StyledButton>
        </div>

        <InputGroup>
          <StyledInput
            type="text"
            className="filled"
            defaultValue="Example text"
          />
          <InputLabel className="filled">Text Field</InputLabel>
        </InputGroup>

        <InputGroup>
          <StyledSelect defaultValue="option1">
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </StyledSelect>
          <InputLabel className="filled">Select Dropdown</InputLabel>
        </InputGroup>

        <Card>
          <p
            style={{
              margin: 0,
              color: 'var(--tint-text)',
              fontSize: '1rem',
              fontWeight: 600,
              lineHeight: 1.5,
            }}
          >
            Card Component
          </p>
          <p
            style={{
              margin: '8px 0 0 0',
              color: 'var(--tint-text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.5,
            }}
          >
            This is secondary text in the card with more information.
          </p>
          <p
            style={{
              margin: '8px 0 0 0',
              color: 'var(--tint-text-accent)',
              fontSize: '1rem',
              lineHeight: 1.5,
            }}
          >
            Accent text for highlighting important information.
          </p>
          <a
            href="#"
            style={{
              display: 'inline-block',
              marginTop: '8px',
              color: 'var(--tint-text-link)',
              fontSize: '1rem',
              lineHeight: 1.5,
              textDecoration: 'none',
              fontWeight: 500,
            }}
            onClick={(e) => e.preventDefault()}
          >
            Link element →
          </a>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '4px',
                backgroundColor: 'var(--tint-text)',
              }}
            />
            <span
              style={{
                fontSize: '1rem',
                lineHeight: 1.5,
                color: 'var(--tint-text)',
              }}
            >
              Primary text color
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '4px',
                backgroundColor: 'var(--tint-text-secondary)',
              }}
            />
            <span
              style={{
                fontSize: '1rem',
                lineHeight: 1.5,
                color: 'var(--tint-text-secondary)',
              }}
            >
              Secondary text color
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '4px',
                backgroundColor: 'var(--tint-text-accent)',
              }}
            />
            <span
              style={{
                fontSize: '1rem',
                lineHeight: 1.5,
                color: 'var(--tint-text-accent)',
              }}
            >
              Accent text color
            </span>
          </div>
        </div>
      </ModePreview>
    )
  }

  return (
    <PreviewContainer>
      {renderPreview('plain')}
      {renderPreview('tint')}
    </PreviewContainer>
  )
}

export default ComponentPreview
