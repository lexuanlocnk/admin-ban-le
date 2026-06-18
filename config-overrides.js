function walkRules(rules, visitor) {
  if (!Array.isArray(rules)) {
    return
  }

  rules.forEach((rule) => {
    if (!rule) {
      return
    }

    if (rule.oneOf) {
      walkRules(rule.oneOf, visitor)
    }

    if (rule.use) {
      const uses = Array.isArray(rule.use) ? rule.use : [rule.use]
      uses.forEach(visitor)
    }

    if (rule.loader) {
      visitor(rule)
    }
  })
}

module.exports = function override(config) {
  config.ignoreWarnings = [
    ...(config.ignoreWarnings || []),
    (warning) => {
      const message = warning?.message || ''
      return message.includes('Failed to parse source map from')
    },
  ]

  walkRules(config.module?.rules, (useEntry) => {
    const loader = typeof useEntry === 'string' ? useEntry : useEntry?.loader
    if (!loader || !loader.includes('sass-loader')) {
      return
    }

    const target = typeof useEntry === 'string' ? null : useEntry
    if (!target) {
      return
    }

    target.options = target.options || {}
    target.options.sassOptions = target.options.sassOptions || {}
    target.options.sassOptions.quietDeps = true
    target.options.sassOptions.silenceDeprecations = [
      'legacy-js-api',
      'import',
    ]
  })

  return config
}
