# tint

Tint is a design foundation for Svelte and Astro projects, providing components, fonts, icons, and styles.

## Installation

```bash
npm install tint
```

## Documentation

For complete documentation, configuration guides, and component examples, see the Storybook documentation.

## What's Included

- **Components**: Button, TextField, Select, Slider, Modal, and more (Svelte 5)
- **Fonts**: HK Grotesk (sans-serif) and Merriweather (serif) in WOFF2 format
- **Icons**: 90+ SVG icons in 14px and 20px sizes
- **Styles**: SASS mixins for typography, colors, and utilities
- **Actions**: Svelte actions (tooltip, reorderable)
- **Stores**: Form control helpers (radio groups, checkbox groups)

## Import Paths

```javascript
import { Button } from 'tint'                      // Components
import { getFontPreloads } from 'tint/fonts'       // Fonts
import { tooltip } from 'tint/actions'             // Actions
import { createRadioGroup } from 'tint/stores'     // Stores
import icon from 'tint/icons/20-add.svg'           // Icons
import 'tint/styles/bootstrap.sass'                // Styles
```
