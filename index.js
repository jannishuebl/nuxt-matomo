const path = require('path')

module.exports = function nuxtMatomo (options) {
  this.nuxt.hook('renderer', renderer => {
  // Don't include on dev mode
  if (process.env.NODE_ENV !== 'production') {
    return
  }
    // Add matomo script to head
    let config_js = "window['_paq'] = [];";
    config_js += "window['_paq'].push(['setTrackerUrl', '" + (process.env.MATOMO_URL || options.trackerUrl || (options.matomoUrl || options.piwikUrl)+'piwik.php') + "']);"
    config_js += "window['_paq'].push(['setSiteId', '" + (process.env.MATOMO_SITE_ID || options.siteId)   + "']);"

    if (options.cookies === false) {
      config_js += "window['_paq'].push(['disableCookies']);"
    }

    if (typeof(this.options.head.__dangerouslyDisableSanitizersByTagID) === 'undefined') {
      this.options.head.__dangerouslyDisableSanitizersByTagID = {}
    }
    this.options.head.__dangerouslyDisableSanitizersByTagID['nuxt-matomo-js'] = ['innerHTML']
    this.options.head.script.push({
      hid: 'nuxt-matomo-js',
      innerHTML: config_js,
      type: 'text/javascript'
    })
    this.options.head.script.push({
      src: options.scriptUrl || options.matomoUrl+'piwik.js',
      async: true,
      defer: true
    })
  })

  // Register plugin
  this.addPlugin({src: path.resolve(__dirname, 'plugin.js'), ssr: false, options})
}

module.exports.meta = require('./package.json')
