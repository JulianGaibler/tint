import { PARAM_KEY } from './constants'
import { useEffect } from '@storybook/preview-api'
import type {
  Renderer,
  PartialStoryFn as StoryFunction,
  StoryContext,
} from '@storybook/types'

function addTinted(selector: string) {
  // add a style element to the head that contains background-color: var(--tint-bg)
  const style = document.createElement('style')
  style.setAttribute('id', PARAM_KEY)
  style.innerHTML = `
  ${selector} {
    background-color: var(--tint-bg);
  }
  `
  document.head.appendChild(style)
  document.body.classList.add('tint--tinted')
}

function removeTinted() {
  const style = document.getElementById(PARAM_KEY)
  if (style) {
    document.head.removeChild(style)
  }
  document.body.classList.remove('tint--tinted')
}

export const withTintedClass = (
  StoryFn: StoryFunction<Renderer>,
  context: StoryContext<Renderer>,
) => {
  const { globals } = context
  const isActive = [true, 'true'].includes(globals[PARAM_KEY])

  useEffect(() => {
    const selector =
      context.viewMode === 'docs'
        ? `#anchor--${context.id} .docs-story`
        : '.sb-show-main'
    if (!isActive) {
      removeTinted()
    } else {
      addTinted(selector)
    }
    return () => {
      removeTinted()
    }
  }, [isActive, context])

  return StoryFn()
}
