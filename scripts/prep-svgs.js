import fs from 'fs'
import path from 'path'
import { optimize } from 'svgo'
import util from 'util'

const readFileAsync = util.promisify(fs.readFile)
const writeFileAsync = util.promisify(fs.writeFile)
const readdirAsync = util.promisify(fs.readdir)

const processSVG = async (filePath) => {
  try {
    const content = await readFileAsync(filePath, 'utf-8')

    // Remove <defs> tag and its content
    let processedContent = content.replace(/<defs>[\s\S]*<\/defs>/g, '')

    // Remove specific attributes (id, data-name, class, fill, stroke)
    processedContent = processedContent.replace(
      /(?:id|data-name|class|fill|stroke)\s*=\s*['"][^'"]*['"]/g,
      '',
    )

    // Add fill="currentColor" attribute
    processedContent = processedContent.replace(
      /<svg/g,
      '<svg fill="currentColor"',
    )

    // If there is a <title> tag, remove it
    processedContent = processedContent.replace(/<title>[\s\S]*<\/title>/g, '')

    // if there is a viewbox but no width/height, add width/height with the same value as viewbox
    if (
      processedContent.match(/viewBox="[\s\S]*"/g) &&
      !processedContent.match(/width="[\s\S]*"/g)
    ) {
      const { width, height } = extractViewBoxValues(processedContent)
      processedContent = appendAttributesToTags(
        processedContent,
        'svg',
        `width="${width}" height="${height}"`,
      )
    } else if (
      // if there is a width/height but no viewbox, add viewbox with the same value as width/height
      processedContent.match(/width="[\s\S]*"/g) &&
      !processedContent.match(/viewBox="[\s\S]*"/g)
    ) {
      // extract the width/height values (e.g. width="24" height="20")
      const width = processedContent.match(/width="([\s\S]*)"/)[1]
      const height = processedContent.match(/height="([\s\S]*)"/)[1]
      processedContent = appendAttributesToTags(
        processedContent,
        'svg',
        `viewBox="0 0 ${width} ${height}"`,
      )
    }

    // Run svgo
    const result = await optimize(processedContent, {
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false,
            },
          },
        },
      ],
    })

    // Write the optimized SVG back to the file
    await writeFileAsync(filePath, result.data, 'utf-8')

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

function appendAttributesToTags(htmlString, tagName, attributesToAdd) {
  const regex = new RegExp(`(<${tagName}\\s*[^>]*>)`, 'gi')

  htmlString = htmlString.replace(regex, (_, openingTag) => {
    const updatedTag = openingTag.replace('>', ` ${attributesToAdd}>`)
    return updatedTag
  })

  return htmlString
}

function extractViewBoxValues(svgString) {
  const viewBoxRegex =
    /viewBox\s*=\s*["']\s*([^"'\s]+)\s+([^"'\s]+)\s+([^"'\s]+)\s+([^"'\s]+)\s*["']/i
  const match = svgString.match(viewBoxRegex)

  if (match) {
    const [, minX, minY, width, height] = match
    return { minX, minY, width, height }
  } else {
    return null // If viewBox attribute is not found
  }
}
