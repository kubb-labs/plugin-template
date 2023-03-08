/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */

import pathParser from 'path'

import { createPlugin, getPathMode, validatePlugins } from '@kubb/core'
import { pluginName as swaggerPluginName } from '@kubb/swagger'
import { writeIndexes } from '@kubb/ts-codegen'
import type { Api as SwaggerApi } from '@kubb/swagger'

import type { Api } from '.'
import type { PluginOptions } from './types'

export const pluginName = 'plugin-demo' as const

export const definePlugin = createPlugin<PluginOptions>((options) => {
  const { output = 'output' } = options
  let swaggerApi: SwaggerApi

  const api: Api = {
    resolveId(fileName, directory) {
      if (!directory) {
        return null
      }

      const mode = getPathMode(pathParser.resolve(directory, output))

      if (mode === 'file') {
        /**
         * when output is a file then we will always append to the same file(output file), see fileManager.addOrAppend
         * Other plugins then need to call addOrAppend instead of just add from the fileManager class
         */
        return pathParser.resolve(directory, output)
      }

      return pathParser.resolve(directory, output, fileName)
    },
  }

  return {
    name: pluginName,
    options,
    kind: 'schema',
    api,
    validate(plugins) {
      const valid = validatePlugins(plugins, [swaggerPluginName])
      if (valid) {
        swaggerApi = plugins.find((plugin) => plugin.name === swaggerPluginName)?.api
      }

      return valid
    },
    resolveId(fileName, directory) {
      return api.resolveId(fileName, directory)
    },
    async writeFile(source, path) {
      if (!path.endsWith('.ts') || !source) {
        return
      }

      await this.fileManager.write(source, path)
    },
    async buildStart() {
      const oas = await swaggerApi.getOas(this.config)
      const schemas = oas.getDefinition().components?.schemas || {}
      const directory = pathParser.resolve(this.config.root, this.config.output.path)
      const mode = getPathMode(pathParser.resolve(directory, output))

      console.log('Build')
    },
    async buildEnd() {
      if (this.config.output.write || this.config.output.write === undefined) {
        await writeIndexes(this.config.root, this.config.output.path, { extensions: /\.ts/, exclude: [/schemas/, /json/] })
      }
    },
  }
})
