import React, { memo, useCallback, useEffect } from 'react'

import { useGlobals, useStorybookApi } from 'storybook/manager-api'
import { IconButton } from 'storybook/internal/components'
import { LightningIcon } from '@storybook/icons'

const ADDON_ID = 'myaddon'
const PARAM_KEY = 'myaddon'
const TOOL_ID = `myaddon/myaddon`

export const Tool = memo(function MyAddonSelector() {
  const [globals, updateGlobals] = useGlobals()
  const api = useStorybookApi()

  const isActive = [true, 'true'].includes(globals[PARAM_KEY])

  const toggleMyTool = useCallback(() => {
    updateGlobals({
      [PARAM_KEY]: !isActive,
    })
  }, [isActive])

  useEffect(() => {
    api.setAddonShortcut(ADDON_ID, {
      label: 'Toggle Addon [8]',
      defaultShortcut: ['8'],
      actionName: 'myaddon',
      showInMenu: false,
      action: toggleMyTool,
    })
  }, [toggleMyTool, api])

  return (
    <IconButton
      key={TOOL_ID}
      active={isActive}
      title="Enable my addon"
      onClick={toggleMyTool}
    >
      <LightningIcon />
    </IconButton>
  )
})
