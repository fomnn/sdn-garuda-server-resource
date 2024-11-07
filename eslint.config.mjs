import baseConfig from '@hono/eslint-config'
import stylistic from '@stylistic/eslint-plugin'

export default [
  stylistic.configs['recommended-flat'],
  ...baseConfig,
  {
    rules: {
      'no-console': ['warn'],
    },
  },
]
