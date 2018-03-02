
import model from '@/model'
import {currency} from '@/util'
import marked from 'marked'

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true, // false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
})

export function parse(key, models, doubled){
  key = key.toString()
  // extend models
  !doubled && Object.assign(models, {
    data: model.personal
    ,copy: model.copy
    ,currency
    ,c: val=>currency(val,'€',2,'.',',')
  })
  //
  const keys = Object.keys(models)
  const values = Object.values(models)
  let interpolated;
  try {
    const tpl = marked(__(key).replace(/\n/g,'<br/>')).replace(/^\s*<p>|<\/p>\s*$/g,'')
    interpolated = new Function(
      ...keys
      ,'return `'+tpl+'`'
    )(
      ...values
    )
  } catch (err) {
    interpolated = '[interpolation error]'
    console.warn('Interpolation error',{key, models});
  }
  // todo only do double interpolation if applicable
  return doubled?interpolated:parse(interpolated, models, true)
}

export function __(key){
  const lang = model.config.lang
  const copy = model.copy[key]
  return copy&&(copy[lang]||copy.en)||key
}