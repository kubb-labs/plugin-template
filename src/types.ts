import type { PluginFactoryOptions } from '@kubb/core'

export type Api = {
  getDemo: () => string | null
}

export type Options = {
  output?: string
}

export type PluginOptions = PluginFactoryOptions<'plugin-demo', Options, false, Api>
