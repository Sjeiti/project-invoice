import {Component, OnDestroy, OnInit} from '@angular/core'
import {ModelService} from '../../model/model.service'
import {Saveable} from '../../abstract/saveable'
import {IConfig} from '../../interface/config'
import {IStoreData} from '../../interface/store-data'

import {IClient} from '../../interface/client'
import {Client} from '../../model/client'
import {Project} from '../../model/project'
import * as dummyData from '../../dummy/data'
import {cssChanged} from '../../signals'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent extends Saveable implements OnInit, OnDestroy {

  static data:any = {
    title: 'Settings',
    heading: 'Settings',
    meta: {robots: 'noindex, nofollow'}
  }

  settings:any
  client:any
  project:any
  invoice:any
  private blurTimeoutId:number
  private selectStart = -1
  private selectEnd = -1

  constructor(
      protected modelService:ModelService
  ) {
    super(modelService)
  }

  ngOnInit() {
    super.ngOnInit()
    this.settings = this.setModel(this.modelService.getConfig())
    //
    const client = new Client(<IClient>dummyData.default.clients[0])
    client.projects = client&&client.projects.map(project=>new Project(project, this.modelService))
    this.client = client
    this.project = client&&client.projects.slice(0).pop()
    this.invoice = this.project.invoices.slice(0).shift()
    cssChanged.dispatch(this.settings.invoiceCSS)
    setTimeout(cssChanged.dispatch.bind(cssChanged, this.settings.invoiceCSS))
  }

  ngOnDestroy(){
    cssChanged.dispatch()
  }

  onClickDownload(e:any, type:string){
    let currentTarget:HTMLElement = <HTMLElement>e.currentTarget,
        data:any = type==='config'?this.modelService.getConfig():this.modelService.getData(),
        dataWithType:any = Object.assign(data, {type}),
        dataString:string = JSON.stringify(dataWithType)
    currentTarget.setAttribute('href', `data:text/json,${encodeURIComponent(dataString)}`)
    currentTarget.setAttribute('download', `${type}.json`)
  }

  onChangeRestore(e:any, type:string){
    const target = e.target
    const fileReader = new FileReader()
    const file = target.files[0]
    fileReader.readAsText(file)
    fileReader.addEventListener('load', ()=>{
      const result = fileReader.result,
          resultData = JSON.parse(result)
      if (resultData.type===type) {
        delete resultData.type
        if (type==='config') {
          this.settings = this.setModel(this.modelService.setConfig(<IConfig>resultData))
        } else if (type==='data') {
          this.modelService.setData(<IStoreData>resultData)
        }
      }
      target.value = null
    })
  }

  onClickClear(type:string){
    if (confirm(`Do you really want to clear the ${type}?`)) {
      type==='config'?this.modelService.clearConfig():this.modelService.clearData()
    }
  }

  onChangeCSS(css:string){
    cssChanged.dispatch(css)
  }

  onSelectCSS(e:Event){
    const target:HTMLTextAreaElement = e.target as HTMLTextAreaElement
    this.selectStart = target.selectionStart
    this.selectEnd = target.selectionEnd
  }

  onBlurCSS(){
    this.blurTimeoutId = window.setTimeout(()=>{
      this.selectStart = -1
      this.selectEnd = -1
    }, 1000)
  }

  onFocusImageInput(){
    // console.log('onFocusImageInput'); // todo: remove log
    clearTimeout(this.blurTimeoutId)
  }

  onChangeImage(e:Event){
    // console.log('onChangeImage',this.cssInsertable,this.selectStart,this.selectEnd); // todo: remove log
    if (this.cssInsertable){
      clearTimeout(this.blurTimeoutId)
      const target:HTMLInputElement = e.target as HTMLInputElement
      const fileReader = new FileReader()
      const file = target.files[0]
      fileReader.readAsDataURL(file)
      fileReader.addEventListener('load', ()=>{
        const result = fileReader.result
        target.value = null
        const s = this.settings.invoiceCSS
        this.settings.invoiceCSS = s.substr(0, this.selectStart) + result + s.substr(this.selectEnd)
        cssChanged.dispatch(this.settings.invoiceCSS)
        this.onNgModelChanged()
        this.selectStart = -1
        this.selectEnd = -1
      })
    }
  }

  get cssInsertable(){
    return this.selectStart!==-1&&this.selectEnd!==-1
  }

  onRevert(){
    super.onRevert()
    cssChanged.dispatch()
  }

  protected cloneModel():any {
    return this.settings = <any>super.cloneModel()
  }

}
