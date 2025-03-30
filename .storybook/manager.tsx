import tintTheme from './tint-theme'
import Selector from './toggle-tint/ToolbarButton'
import { ADDON_ID, TOOL_ID } from './toggle-tint/constants'
import { addons, types } from '@storybook/manager-api'
import React from 'react'


addons.register(ADDON_ID, () => {
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Toggle Tinted',
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: () => <Selector />,
  })
})

addons.setConfig({
  theme: tintTheme,
})
