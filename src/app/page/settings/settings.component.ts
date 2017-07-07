import {Component, OnDestroy, OnInit} from '@angular/core'
import {ModelService} from '../../model/model.service'
import {Saveable} from '../../abstract/saveable'
import {IConfig} from '../../interface/config'
import {IData} from '../../interface/store-data'

import {IClient} from '../../interface/client'
import {Client} from '../../model/client'
import {Project} from '../../model/project'
import * as dummyData from '../../dummy/data'
import {sassChanged} from '../../signals'

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
    client.projects = client&&client.projects.map(project=>new Project(project, client, this.modelService))
    this.client = client
    this.project = client&&client.projects.slice(0).pop()
    this.invoice = this.project.invoices.slice(0).shift()
    sassChanged.dispatch(this.settings.invoiceCSS)
    setTimeout(sassChanged.dispatch.bind(sassChanged, this.settings.invoiceCSS))
  }

  ngOnDestroy(){
    sassChanged.dispatch()
  }

  onClickDownload(e:Event, type:string){
    let currentTarget:HTMLElement = <HTMLElement>e.currentTarget,
        isConfig = type==='config',
        dataString:string = isConfig?this.modelService.getStoreableConfig():this.modelService.getStoreableData()
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
          this.modelService.setData(<IData>resultData)
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

  onRevert(){
    super.onRevert()
    sassChanged.dispatch()
  }

  protected cloneModel():any {
    return this.settings = <any>super.cloneModel()
  }

}
