/**
 * @typedef {object} config
 * @property {number} timestamp
 * @property {string} theme
 * @property {string[]} themes
 * @property {string} projectNumberTemplate
 * @property {string} themeMainBgColor
 * @property {string} themeMainFgColor
 * @property {string} themeSecondaryBgColor
 * @property {string} themeSecondaryFgColor
 * @property {number} themeFontSize
 * @property {string} themeFontMain
 * @property {string} themeFontCurrency
 * @property {string} themeLogoCSS
 * @property {string} invoiceCSS
 * @property {string} csvTemplate
 * @property {string[]} langs
 * @property {string} lang
 * @property {string} currency
 * @property {string} googleFontsAPIKey
 * @property {boolean} homeMessage
 * @property {string} type
 */

const proto = {
  /**
   * Returns an exact clone of the project
   * @returns {Project}
   */
  clone(){
      const cloned = JSON.parse(JSON.stringify(this))
      return create(cloned)
  }

  ,get langsJoined(){
    return this.langs.join(',')
  }
  ,set langsJoined(s){
    return this.langs = s.split(/,/g)
  }
}

export function create(config){
    return Object.setPrototypeOf(config, proto);
}
