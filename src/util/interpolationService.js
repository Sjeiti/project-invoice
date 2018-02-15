
import model from '@/model'
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

export function parse(key, models){
  const keys = Object.keys(models)
  const values = Object.values(models)
  const tpl = marked(__(key).replace(/\n/g,'<br/>'))
  return new Function(
    ...keys
    ,'return `'+tpl+'`'
  )(
    ...values
  )
}

export function __(key){
  const lang = model.config.lang
  const copy = model.copy[key]
  return copy&&(copy[lang]||copy.en)||key
}