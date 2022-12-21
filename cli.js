#!/usr/bin/env node
'use strict'
import meow from 'meow'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import gltfjsx from './src/gltfjsx.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const cli = meow(
  `
	Usage
	  $ npx gltfjsx [Model.glb] [options]

	Options
    --output, -o        Output file name/path
    --types, -t         Add Typescript definitions
    --keepnames, -k     Keep original names
    --keepgroups, -K    Keep (empty) groups
    --meta, -m          Include metadata (as userData)
    --shadows, s        Let meshes cast and receive shadows
    --printwidth, w     Prettier printWidth (default: 120)
    --precision, -p     Number of fractional digits (default: 2)
    --draco, -d         Draco binary path
    --root, -r          Sets directory from which .gltf file is served
    --instance, -i      Instance re-occuring geometry
    --instanceall, -I   Instance every geometry (for cheaper re-use)
    --transform, -T     Transform the asset for the web (draco, prune, resize)
    --debug, -D         Debug output
`,
  {
    importMeta: import.meta,
    flags: {
      output: { type: 'string', alias: 'o' },
      types: { type: 'boolean', alias: 't' },
      keepnames: { type: 'boolean', alias: 'k' },
      keepgroups: { type: 'boolean', alias: 'K' },
      shadows: { type: 'boolean', alias: 's' },
      printwidth: { type: 'number', alias: 'p', default: 1000 },
      meta: { type: 'boolean', alias: 'm' },
      precision: { type: 'number', alias: 'p', default: 2 },
      draco: { type: 'string', alias: 'd' },
      root: { type: 'string', alias: 'r' },
      instance: { type: 'boolean', alias: 'i' },
      instanceall: { type: 'boolean', alias: 'I' },
      transform: { type: 'boolean', alias: 'T' },
      debug: { type: 'boolean', alias: 'D' },
    },
  }
)

if (cli.input.length === 0) {
  console.log(cli.help)
} else {
  const config = { ...cli.flags }
  const file = cli.input[0]
  const filePath = path.resolve(__dirname, file)
  let nameExt = file.match(/[-_\w]+[.][\w]+$/i)[0]
  let name = nameExt.split('.').slice(0, -1).join('.')
  const output = name.charAt(0).toUpperCase() + name.slice(1) + (config.types ? '.tsx' : '.js')
  const showLog = (log) => {
    console.info('log:', log)
  }
  try {
    const response = await gltfjsx(file, output, { ...config, showLog, timeout: 0, delay: 1 })
  } catch (e) {
    console.error(e)
  }
}
