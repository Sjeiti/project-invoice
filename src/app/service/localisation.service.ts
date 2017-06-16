import {Injectable} from '@angular/core'
import * as marked from 'marked'
import {ModelService} from '../model/model.service'

@Injectable()
export class LocalisationService {

  private copy:any = {}
  private extra:any = {}
  config:any

  constructor(
      private modelService:ModelService
  ) {
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
    this.config = modelService.getConfig()
    const data = modelService.getData()
    this.setCopy(data.copy)
    this.addExtra(data.personal, 'personal')
  }

  setCopy(copy:any){
    this.copy = copy
  }

  addExtra(obj:any, name:string) {
    this.extra[name] = obj
  }

  __(text:string):string {
    let translation = this.getExtra(text)
    //
    if (this.copy.hasOwnProperty(text)) {
      translation = this.copy[text][this.config.lang]||translation
    }
    translation = this.interpolate(translation)||translation
    //
    // markdown: but don't paragraph single lines
    if (translation) {
      translation = marked(translation.toString())
      const matchParagraphEnd = translation.match(/<\/p>/g)
      if (matchParagraphEnd&&matchParagraphEnd.length===1) {
        translation = translation.replace(/^<p>|<\/p>\s$/g, '')
      }
    }
    return translation
  }

  private getExtra(text:string):string {
    if (/^\w+\.\w+$/.test(text)) {
      let split = text.split(/\./g),
          obj = this.extra
      split.forEach((s, i)=>{
        if (obj[s]) {
          obj = obj[s]
          if (i===split.length-1){
            text = obj
          }
        }
      })
    }
    return text
  }

  private interpolate(text:string):string {
    let match = text.match&&text.match(/%\w+(\.\w+)*%/g)
    match&&match.forEach(line=>{
      text = text.replace(line, this.__(line.replace(/^%|%$/g, '')))
    })
    return text
  }

}
