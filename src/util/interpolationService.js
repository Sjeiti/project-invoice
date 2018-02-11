
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
  const lang = 'nl' // todo implement
  const copy = model.copy[key]
  const tpl = marked(copy&&(copy[lang]||copy.en).replace(/\n/g,'<br/>')||key)
  return new Function(
    ...keys
    ,'return `'+tpl+'`'
  )(
    ...values
  )
}