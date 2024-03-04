import pathParser from 'node:path'

import { FileManager, createPlugin } from '@kubb/core'
import { pluginName as swaggerPluginName } from '@kubb/swagger'

import { camelCase, camelCaseTransformMerge } from 'change-case'

import type { KubbFile } from '@kubb/core'
import type { PluginOptions } from './types.ts'
import path from 'node:path'

export const pluginName = 'plugin-demo' satisfies PluginOptions['name']
export const pluginKey: PluginOptions['key'] = [pluginName] satisfies PluginOptions['key']

export const definePlugin = createPlugin<PluginOptions>((options) => {
  const { output = { path: 'demo' } } = options

  return {
    name: pluginName,
    options,
    pre: [swaggerPluginName],
    resolvePath(fileName, directory, options) {
      const root = pathParser.resolve(this.config.root, this.config.output.path)
      const mode = FileManager.getMode(path.resolve(root, output.path))

      if (mode === 'file') {
        /**
         * when output is a file then we will always append to the same file(output file), see fileManager.addOrAppend
         * Other plugins then need to call addOrAppend instead of just add from the fileManager class
         */
        return pathParser.resolve(root, output.path)
      }

      return pathParser.resolve(root, output.path, fileName)
    },
    resolveName(name, _type) {
      return camelCase(name, { delimiter: '', stripRegexp: /[^A-Z0-9$]/gi, transform: camelCaseTransformMerge })
    },
    async buildStart() {
      // const oas = await swaggerApi.getOas()

      const files: KubbFile.File[] = [
        {
          baseName: 'test.ts',
          path: this.resolvePath({
            baseName: 'test.ts',
            pluginKey: this.plugin.key,
          })!,
          source: "export const hello = 'world';",
        },
      ]
      await this.addFile(...files)

      console.log('Build started')
    },
    async buildEnd() {
      if (this.config.output.write === false) {
        return
      }

      const root = pathParser.resolve(this.config.root, this.config.output.path)

      await this.fileManager.addIndexes({ root, output, meta: { pluginKey: this.plugin.key } })
      console.log('Build ended')
    },
  }
})
