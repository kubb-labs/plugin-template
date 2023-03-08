import type { PluginFactoryOptions } from '@kubb/core'

export type Api = {
  resolveId: (fileName: string, directory: string | undefined) => string | null
}

export type Options = {
  output?: string
}

export type PluginOptions = PluginFactoryOptions<Options, false, Api>
