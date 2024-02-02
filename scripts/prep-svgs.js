import fs from 'fs'
import { EOL } from 'os'
import path from 'path'
import { optimize } from 'svgo'
import util from 'util'

const readFileAsync = util.promisify(fs.readFile)
const writeFileAsync = util.promisify(fs.writeFile)
const readdirAsync = util.promisify(fs.readdir)

const processSVG = async (filePath) => {
  try {
    const content = await readFileAsync(filePath, 'utf-8')

    // Run svgo
    const result = optimize(content, {
      plugins: [
        svgoRemoveAttrs([
          'id',
          'data-name',
          'class',
          'fill',
          'stroke',
          'stroke-width',
          'stroke-miterlimit',
          'clip-rule',
          'fill-rule',
          'fill-opacity',
        ]),
        viewBoxAndDimensions,
        addContextFill,
        ...svgoBasePlugins,
      ],
    })

    console.log(result)

    // Write the optimized SVG back to the file
    await writeFileAsync(filePath, `${result.data}${EOL}`, 'utf-8')

    console.log(`Processed: ${filePath}`)
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`)
  }
}

const processSVGs = async (dir) => {
  try {
    const files = await readdirAsync(dir)

    const svgFiles = files.filter((file) => path.extname(file) === '.svg')

    if (svgFiles.length === 0) {
      console.log(`No SVG files found in ${dir}`)
      return
    }

    for (const file of svgFiles) {
      const filePath = path.join(dir, file)
      await processSVG(filePath)
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}: ${error.message}`)
  }
}

// Run the script
processSVGs('src/lib/icons')

const viewBoxAndDimensions = {
  name: 'viewBoxAndDimensions',
  fn: () => ({
    element: {
      enter(node) {
        if (node.name !== 'svg') {
          return
        }
        const viewBox = node.attributes.viewBox
        const width = node.attributes.width
        const height = node.attributes.height
        if (viewBox && width && height) {
          return
        }
        if ((viewBox && !width) || !height) {
          const [, , w, h] = viewBox.split(' ')
          node.attributes.width = w
          node.attributes.height = h
        } else if (width && height && !viewBox) {
          node.attributes.viewBox = `0 0 ${width} ${height}`
        } else {
          throw new Error('SVG has no width, height, or viewBox')
        }
      },
    },
  }),
}

const addContextFill = {
  name: 'addContextFill',
  fn: () => ({
    element: {
      enter(node) {
        if (node.name !== 'svg') {
          return
        }
        node.attributes.fill = 'currentColor'
      },
    },
  }),
}

const svgoBasePlugins = [
  'removeDesc',
  'removeStyleElement',
  'removeOffCanvasPaths',
  'removeNonInheritableGroupAttrs',
  'sortAttrs',
  {
    name: 'preset-default',
    params: {
      overrides: {
        removeViewBox: false,
      },
    },
  },
]

function svgoRemoveAttrs(attrs) {
  const attrString = attrs.map((attr) => attr.trim()).join('|')
  return {
    name: 'removeAttrs',
    params: {
      attrs: `(${attrString})`,
    },
  }
}
