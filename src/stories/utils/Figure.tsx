import { styled } from '@storybook/theming'
import type { FC, PropsWithChildren } from 'react'
import React from 'react'

export interface FigureProps {
  src: string
  alt: string
  caption: string
}

const FigureEl = styled.div((_) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 'none',
  '> img': {
    maxHeight: '40vh',
    height: 'auto',
    maxWidth: '100%',
  },
}))

const Figure: FC<PropsWithChildren<FigureProps>> = ({ src, alt, children }) => {
  return (
    <FigureEl>
      <img src={src} alt={alt} />
      <figcaption>{children}</figcaption>
    </FigureEl>
  )
}

export default Figure
