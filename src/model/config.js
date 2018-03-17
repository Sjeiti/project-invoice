import {CURRENCY_ISO} from '../config/currencyISO'
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

  /**
   * Getter to return the language array as comma joined string
   * @returns {string}
   */
  ,get langsJoined(){
    return this.langs.join(',')
  }

  /**
   * Setter to turn a comma joined string into an array
   * @param {string} s
   * @returns {string[]}
   */
  ,set langsJoined(s){
    return this.langs = s.split(/,/g)
  }

  /**
   * Getter for the currency symbol
   * @returns {string}
   */
  ,get currencySymbol(){
    return CURRENCY_ISO[this.currency].symbol
  }
}

/**
 * Create a config object
 * @param {object} config
 * @returns {config}
 */
export function create(config){
    return Object.setPrototypeOf(config,proto)
}
