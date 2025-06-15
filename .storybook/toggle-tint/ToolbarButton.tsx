import { PARAM_KEY, ADDON_ID, TOOL_ID } from './constants'
import { IconButton } from 'storybook/internal/components'
import { useGlobals, useStorybookApi } from 'storybook/manager-api'
import React, { memo, useCallback, useEffect } from 'react'

const ICON_TINT_FILL = `<svg viewBox="0 0 14 14" width="14px" height="14px"><path fill="currentColor" d="M13.444 7.833C13.444 11.24 10.66 14 7.222 14 3.786 14 1 11.24 1 7.833 1 3.4 7.222 0 7.222 0s6.222 3.4 6.222 7.833Z"/></svg>`
const ICON_TINT = `<svg viewBox="0 0 14 14" width="14px" height="14px"><path fill="currentColor" fill-rule="evenodd" d="M7.222 13c2.893 0 5.222-2.322 5.222-5.167 0-1.766-1.266-3.47-2.78-4.837a17.661 17.661 0 0 0-2.442-1.833 17.66 17.66 0 0 0-2.441 1.833C3.266 4.364 2 6.067 2 7.833 2 10.678 4.33 13 7.222 13Zm0 1c3.437 0 6.222-2.76 6.222-6.167C13.444 3.4 7.222 0 7.222 0S1 3.4 1 7.833C1 11.24 3.786 14 7.222 14Z" clip-rule="evenodd"/></svg>`

const Selector = memo(function MyAddonSelector() {
  const [globals, updateGlobals] = useGlobals()
  const api = useStorybookApi()

  const isActive = [true, 'true'].includes(globals[PARAM_KEY])

  const toggleTinted = useCallback(() => {
    updateGlobals({
      [PARAM_KEY]: !isActive,
    })
  }, [isActive])

  useEffect(() => {
    api.setAddonShortcut(ADDON_ID, {
      label: 'Toggle tinted [T]',
      defaultShortcut: ['T'],
      actionName: 'tint',
      showInMenu: false,
      action: toggleTinted,
    })
  }, [toggleTinted, api])

  return (
    <IconButton
      key={TOOL_ID}
      active={isActive}
      title={isActive ? 'Disable tinted theme' : 'Enable tinted theme'}
      onClick={toggleTinted}
      dangerouslySetInnerHTML={{
        __html: isActive ? ICON_TINT_FILL : ICON_TINT,
      }}
    />
  )
})

export default Selector
