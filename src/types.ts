import type { PluginFactoryOptions } from '@kubb/core'

export type Api = {
  getDemo: () => string | null
}

export type Options = {
  output?: {
    path: string
  }
}

type ResolvedOptions = {}

export type PluginOptions = PluginFactoryOptions<'plugin-demo', Options, ResolvedOptions, never, never, never>

declare module '@kubb/core' {
  export interface _Register {
    ['@kubb/swagger-tanstack-query']: PluginOptions
  }
}
