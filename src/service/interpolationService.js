import model from '../model/index'
import {currency} from '../util/index'
import marked from 'marked'
import {CURRENCY_ISO} from '../config/currencyISO'

marked.setOptions({
  renderer: new marked.Renderer()
  ,gfm: true
  ,tables: true
  ,breaks: true // false,
  ,pedantic: false
  ,sanitize: false
  ,smartLists: true
  ,smartypants: false
})

/**
 * Parse a string by interpolation
 * @param {string} key
 * @param {object} models
 * @returns {string}
 */
export function parse(key,models={}){
  const rxIterpolation = /\${\w*(\.\w*)*}/
  const currencySymbol = CURRENCY_ISO[model.config.currency].symbol
  key = key.toString()
  // extend models
  Object.assign(models,{
    data: model.personal
    ,copy: new Proxy({},{get:(a,key)=>__(key)})
    ,currency
    ,c: val=>currency(val,currencySymbol,2,'.',',')
  })
  //
  const keys = Object.keys(models)
  const values = Object.values(models)
  let interpolated = key
  try {
    let maxInterpolations = 10
    while (rxIterpolation.test(interpolated)&&maxInterpolations--) interpolated = interpolate(interpolated,keys,values)
    interpolated = marked(interpolated)
    const matchEndP = interpolated.match(/<\/p>/g)
    matchEndP&&matchEndP.length===1
      &&(interpolated = interpolated.replace(/^\s*<p>|<\/p>\s*$/g,''))
      ||(interpolated = interpolated.replace(/\n/g,'<br/>'))
  } catch (err){
    interpolated = '[interpolation error]'
    console.warn('Interpolation error',{key,models,err})
  }
  return interpolated
}

/**
 * Interpolate
 * @param {string} tpl
 * @param {string[]} keys
 * @param {string[]} values
 * @returns {string}
 */
function interpolate(tpl,keys,values){
  return new Function(
    ...keys
    ,'return `'+tpl+'`'
  )(
    ...values
  )
}

/**
 * Internationalisation parser
 * @param {string} key
 * @returns {string}
 * @private
 */
export function __(key){
  const lang = model.config.lang
  const copy = model.copy[key]
  return copy&&(copy[lang]||copy.en)||key
}