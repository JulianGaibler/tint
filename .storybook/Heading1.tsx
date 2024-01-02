import { styled } from '@storybook/theming'
import React from 'react'

const H = styled.h1(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  paddingInline: '3rem !important',
  backgroundColor: theme.background.app,
  borderRadius: '1rem',
  marginBlockStart: 'calc(-3rem) !important',
  marginBlockEnd: '2rem !important',
  height: '30vh',
  maxHeight: '12rem',
  minHeight: '5rem',
}))

const NewHeader = ({ children }) => <H>{children}</H>

export default NewHeader
