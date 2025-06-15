import { CopyIcon } from '@storybook/icons'
import { styled, type Theme } from 'storybook/theming'
import type { FC } from 'react'
import React from 'react'
import { typeDefinitons } from 'virtual:typography-importer'
import { type TypeDefinition } from '../../../scripts/typography-importer'

const GalleryWrapper = styled.div((_) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 'none',
}))
const Gallery = styled.ul((_) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
  gridGap: '1rem',
  listStyle: 'none',
  padding: 0,
  margin: 0,
}))

const sharedButtonBubble = (theme: Theme) => ({
  margin: 0,
  padding: '4px 8px',
  borderRadius: `4px`,
  color: theme.color.defaultText,
  fontSize: '.8rem',
  lineHeight: '16px',
  fontFamily: theme.typography.fonts.base,
  fontWeight: theme.typography.weight.bold,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const DefinitionElement = styled.li(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
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
    flex: 1,
  },
  ' > div.info > h3': {
    margin: 0,
  },
}))

const Attributes = styled.div(({ theme }) => ({
  display: 'flex',
  gap: '0.2rem',
  ' > div': {
    ...sharedButtonBubble(theme),
    border: `1px solid ${theme.appBorderColor}`,
    background: theme.background.content,
    borderColor: 'currentColor',
  },
  '.category': {
    color: '#4E4C62',
  },
  '.letterform': {
    color: '#864FFF',
  },
  '.level': {
    color: '#00976D',
  },
  '.size': {
    color: '#EA3E55',
  },
  '.modifier': {
    color: '#007AFF',
  },
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
const CopyButton = styled.button(({ theme }) => ({
  ...sharedButtonBubble(theme),
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  gap: '0.4rem',
  fontFamily: theme.typography.fonts.mono,
  paddingInlineStart: 2,
  textAlign: 'start',
  '&:hover': {
    background: theme.background.hoverable,
  },

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

const TypePreview = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: theme.appBorderRadius,
  background: theme.background.content,
  border: `1px solid ${theme.appBorderColor}`,
  // no wrap
  whiteSpace: 'nowrap',
  minHeight: '64px',
  flex: 0.7,
  overflow: 'hidden',
  padding: '.75rem',
  userSelect: 'none',
}))

const TypeDefItem: FC<{ definition: TypeDefinition }> = ({ definition }) => {
  function copyClass(e: React.MouseEvent<HTMLButtonElement>) {
    const path = `tint--type-${definition.name}`
    // add the path to the clipboard
    navigator.clipboard.writeText(path)
    // add class 'copied' to the button
    const button = e.currentTarget
    button.classList.add('copied')
    // remove the class after 1 second
    setTimeout(() => button.classList.remove('copied'), 1000)
  }
  return (
    <DefinitionElement>
      <TypePreview
        aria-hidden="true"
        className={`tint--type-${definition.name}`}
      >
        The quick brown fox jumps over the lazy dog
      </TypePreview>
      <div className="info">
        <h3>{definition.name}</h3>
        <CopyButton onClick={copyClass}>
          <CopyIcon />
          tint--type-{definition.name}
        </CopyButton>
        <Attributes>
          <div className="category">{definition.category}</div>
          {definition.letterform && (
            <div className="letterform">{definition.letterform}</div>
          )}
          {definition.modifier && (
            <div className="modifier">{definition.modifier}</div>
          )}
          {definition.level && <div className="level">{definition.level}</div>}
          {definition.size && <div className="size">{definition.size}</div>}
        </Attributes>
      </div>
    </DefinitionElement>
  )
}

const TypeGallery: FC = () => {
  const [searchString, setSearchString] = React.useState('')
  const [filteredDefs, setFilteredDefs] = React.useState(typeDefinitons)

  React.useEffect(() => {
    setFilteredDefs(typeDefinitons)
    if (!searchString.trim()) {
      return
    }
    const lowerCase = searchString.trim().toLowerCase()
    const filtered = typeDefinitons.reduce(
      (acc, item) => {
        // include the category if any of the definitions match
        const definitions = item.definitions.filter(({ name }) => {
          // check if the search string is in the name or in the alternatives
          return name.toLowerCase().includes(lowerCase)
        })
        if (definitions.length) {
          acc.push({
            ...item,
            definitions,
          })
        }
        return acc
      },
      [] as typeof typeDefinitons,
    )
    setFilteredDefs(filtered)
  }, [searchString])

  return (
    <GalleryWrapper>
      <SearchInput
        type="text"
        placeholder="Search for type definitions"
        onChange={(e) => setSearchString(e.target.value)}
      />
      {/* first we create an h2 for the category name */}
      {filteredDefs.map(({ category, categoryTitle, definitions }) => (
        <React.Fragment key={category}>
          <h2>{categoryTitle}</h2>
          <Gallery className="docs-type">
            {definitions.map((definition) => (
              <TypeDefItem definition={definition} key={definition.name} />
            ))}
          </Gallery>
        </React.Fragment>
      ))}
    </GalleryWrapper>
  )
}

export default TypeGallery
