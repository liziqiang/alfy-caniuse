const { browserIcon, browserName } = require('./utils')

class SupportItem {
  constructor({ browserId, featureId, db, browsersList }) {
    this.browserId = browserId
    this.featureId = featureId
    this.db = db
    this.browsersList = browsersList
  }

  get versionSupport() {
    return Object.entries(this.db.data[this.featureId].stats[this.browserId])
  }

  get desiredVersionList() {
    const desiredSupport = this.browsersList
      .filter(browser => {
        return browser.split(' ')[0] === this.browserId
      })
      .map(browser => {
        return browser.split(' ')[1]
      })

    return desiredSupport
  }

  get desiredVersionSupport() {
    const versionList = this.desiredVersionList

    return this.versionSupport.filter(([version, supported]) =>
      versionList.includes(version)
    )
  }

  get firstPartialSupportVersion() {
    const [version] =
      this.versionSupport.find(([version, supported]) => {
        return supported.startsWith('a')
      }) || []

    if (version) {
      return version
    } else {
      return
    }
  }

  get firstFullSupportVersion() {
    const [version] =
      this.versionSupport.find(([version, supported]) => {
        return supported.startsWith('y')
      }) || []

    if (version) {
      return version
    } else {
      return
    }
  }

  get safeSupport() {
    return this.desiredVersionSupport.every(([version, supported]) =>
      supported.startsWith('y')
    )
  }

  get noSupport() {
    return this.desiredVersionSupport.every(([version, supported]) =>
      supported.startsWith('n')
    )
  }

  get partialSupport() {
    return this.desiredVersionSupport.every(([version, supported]) =>
      supported.startsWith('p')
    )
  }

  get supportString() {
    if (this.safeSupport) {
      return '✅️ Well supported'
    } else if (this.noSupport) {
      return '❌️ Not supported'
    } else if (this.partialSupport) {
      return `⚠️ Partial support`
    } else {
      if (this.firstFullSupportVersion) {
        return `⚠️ Support in versions >= ${this.firstFullSupportVersion}`
      } else {
        return `⚠️ Partial support in versions >= ${
          this.firstPartialSupportVersion
        }`
      }
    }
  }

  get alfredItem() {
    return {
      title: browserName(this.browserId, this.db),
      subtitle: this.supportString,
      icon: {
        path: `./icons/${browserIcon(this.browserId)}.png`
      },
      valid: false
    }
  }
}

module.exports = {
  SupportItem
}
