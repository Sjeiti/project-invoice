import {Injectable} from '@angular/core'
import {Title} from '@angular/platform-browser'

@Injectable()

export class DOMHeadService {

  public setTitle:any
  public getTitle:any

  private titleService:Title
  private headElement:HTMLElement

  /**
   * Inject the Angular 2 Title Service
   * @param titleService
   */
  constructor(titleService:Title) {
    this.titleService = titleService
    this.headElement = document.querySelector('head')
    this.setTitle = this.titleService.setTitle
    this.getTitle = this.titleService.getTitle
  }

  // public getMetas():any {
  //   let metas = {},
  //       setObj = elm=> {
  //         let name = elm.getAttribute('name')
  //         if (name) {
  //           metas[name] = elm.getAttribute('content')
  //         }
  //       }
  //   Array.prototype.forEach.call(this.headElement.querySelectorAll('meta'), setObj)
  //   return metas
  // }

  public setMetas(metas:any, absolute = false) {
    // let deleteMetas:string[] = []
    // if (absolute) {
    //   for (let name in this.getMetas()) {
    //     if (!metas|| !metas.hasOwnProperty('name')) {
    //       deleteMetas.push(name)
    //     }
    //   }
    //   deleteMetas.forEach(name=> {
    //     let elm = document.querySelector('meta[name=' + name + ']')
    //     !elm&&console.warn(name)
    //     elm&&elm.parentNode.removeChild(elm)
    //   })
    // }
    // for (let name in metas) {
    //   if (metas.hasOwnProperty(name)) {
    //     this.setMeta(name, metas[name])
    //   }
    // }
  }

  // private setMeta(name:string, content:string):boolean {
  //   let elm:HTMLElement = document.querySelector('meta[name=' + name + ']') as HTMLElement,
  //       exists = !!elm
  //   if (!exists) {
  //     elm = document.createElement('meta')
  //     elm.setAttribute('name', name)
  //   }
  //   elm.setAttribute('content', content)
  //   !exists&&this.headElement.appendChild(elm)
  //   return exists
  // }
}