import icons from './icon-import'
import { DownloadIcon, CopyIcon } from '@storybook/icons'
import { styled } from '@storybook/theming'
import type { FC, PropsWithChildren } from 'react'
import React from 'react'

export interface GalleryProps {
  searchAlternatives: { [key: string]: string[] }
}

export interface GalleryItemProps {
  size: string
  name: string
  svg: string
}

const GalleryWrapper = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 'none',
}))
const Gallery = styled.ul(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(192px, 1fr))',
  gridGap: '1rem',
  listStyle: 'none',
  padding: 0,
  margin: 0,
}))
const GalleryItem = styled.li(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: theme.appBorderRadius,
  background: theme.background.app,
  padding: '1rem',
  gap: '1rem',
  ' > div.info': {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexGrow: 1,
  },
  ' > div.info > .actions': {
    display: 'flex',
    flexDirection: 'row',
    gap: '0.4rem',
    alignItems: 'stretch',
  },
}))
const IconPreview = styled.div(({ theme }) => ({
  width: '64px',
  height: '64px',
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 0,
  borderRadius: theme.appBorderRadius,
  background: theme.background.content,
  border: `1px solid ${theme.appBorderColor}`,
  '&:hover': {
    '& svg': {
      border: `1px solid ${theme.color.secondary}`,
    },
  },
}))
const IconName = styled.div(({ theme }) => ({
  fontSize: '0.9rem',
  border: 'none',
  background: 'none',
  padding: 0,
  textAlign: 'start',
}))
const SearchInput = styled.input(({ theme }) => ({
  marginBlock: '1rem',
  padding: '0.5rem 1rem',
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: '64px',
  background: theme.background.content,
  color: theme.color.defaultText,
  fontFamily: theme.typography.fonts.base,
  fontSize: '1rem',
  lineHeight: '1.5rem',
  outline: 'none',
  transition: 'border-color 0.2s ease-in-out',
  '&:focus': {
    borderColor: theme.color.secondary,
  },
}))

const sharedButtonBubble = (theme) => ({
  margin: 0,
  padding: '4px 10px',
  borderRadius: `4px`,
  border: `1px solid ${theme.appBorderColor}`,
  color: theme.color.defaultText,
  background: theme.background.content,
  fontSize: '.7rem',
  lineHeight: '16px',
  fontFamily: theme.typography.fonts.base,
  fontWeight: theme.typography.weight.bold,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const SizeBubble = styled.div(({ theme }) => ({
  ...sharedButtonBubble(theme),
  lineHeight: 1,
  background: theme.background.content,
  fontSize: '0.75rem',
  fontWeight: 'bold',
  padding: '4px 6px',
  color: theme.color.orange,
  borderColor: 'currentColor',
  '&.special': {
    color: theme.color.purple,
  },
}))
const ActionButton = styled.button(({ theme }) => ({
  ...sharedButtonBubble(theme),
  cursor: 'pointer',
  gap: '0.4rem',

  transition: 'background 0.2s ease-in-out, color 0.2s ease-in-out',
  '&.copied': {
    background: theme.color.positive,
    color: theme.color.lightest,
    transition: 'none',
  },

  '&:focus-visible': {
    outline: `2px solid ${theme.color.secondary}`,
  },
}))

const IconElement: FC<PropsWithChildren<GalleryItemProps>> = ({
  size,
  name,
  svg,
}) => {
  function iconName() {
    return `${size}-${name}.svg`
  }

  function downloadSVG() {
    const element = document.createElement('a')
    const file = new Blob([svg], { type: 'image/svg+xml' })
    element.href = URL.createObjectURL(file)
    element.download = iconName()
    document.body.appendChild(element)
    element.click()
  }

  function copyPath(e: React.MouseEvent<HTMLButtonElement>) {
    const path = `@tint/icons/${iconName()}`
    // add the path to the clipboard
    navigator.clipboard.writeText(path)
    // add class 'copied' to the button
    const button = e.currentTarget
    button.classList.add('copied')
    // remove the class after 1 second
    setTimeout(() => button.classList.remove('copied'), 1000)
  }

  return (
    <GalleryItem>
      <IconPreview dangerouslySetInnerHTML={{ __html: svg }} />
      <div className="info">
        <IconName>{name}</IconName>
        <div className="actions">
          <SizeBubble className={size !== '20' ? 'special' : ''}>
            {size}
          </SizeBubble>
          <ActionButton title="Download icon" onClick={downloadSVG}>
            <DownloadIcon />
          </ActionButton>
          <ActionButton title="Copy path" onClick={copyPath}>
            <CopyIcon />
          </ActionButton>
        </div>
      </div>
    </GalleryItem>
  )
}

const IconGallery: FC<PropsWithChildren<GalleryProps>> = ({
  searchAlternatives,
}) => {
  const [searchString, setSearchString] = React.useState('')
  const [filteredIcons, setFilteredIcons] = React.useState(icons)

  React.useEffect(() => {
    if (!searchString.trim()) {
      setFilteredIcons(icons)
      return
    }
    const filtered = icons.filter(({ name }) => {
      const lowerCase = searchString.trim().toLowerCase()
      // check if the search string is in the name or in the alternatives
      return (
        name.toLowerCase().includes(lowerCase) ||
        searchAlternatives[name]?.some((alternative) =>
          alternative.toLowerCase().includes(lowerCase),
        )
      )
    })
    setFilteredIcons(filtered)
  }, [searchString])

  return (
    <GalleryWrapper>
      <SearchInput
        type="text"
        placeholder="Search for an icon"
        onChange={(e) => setSearchString(e.target.value)}
      />
      <Gallery className="icon-gallery">
        {filteredIcons.map(({ size, name, svg }) => (
          <IconElement key={name} size={size} name={name} svg={svg} />
        ))}
      </Gallery>
    </GalleryWrapper>
  )
}

export default IconGallery
