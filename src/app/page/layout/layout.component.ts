import {Component, OnDestroy, OnInit} from '@angular/core'
import {ModelService} from '../../model/model.service'
import {RestService} from '../../service/rest.service'
import {Saveable} from '../../abstract/saveable'

import {IClient} from '../../interface/client'
import {IFont} from '../../interface/font'
import {Client} from '../../model/client'
import {Project} from '../../model/project'
import * as dummyData from '../../dummy/data'
import {sassChanged, cssVariablesChanged, cssFontsChanged} from '../../signals'

@Component({
  selector: 'app-settings',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

export class LayoutComponent extends Saveable implements OnInit, OnDestroy {

  static data:any = {
    title: 'Settings',
    heading: 'Settings',
    meta: {robots: 'noindex, nofollow'}
  }

  settings:any
  client:any
  project:any
  invoice:any

  fonts:IFont[]

  constructor(
      protected modelService:ModelService,
      protected restService:RestService
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
    //
    this.getFonts()
    //
    sassChanged.dispatch(this.settings.invoiceCSS)
    setTimeout(sassChanged.dispatch.bind(sassChanged, this.settings.invoiceCSS))
  }

  ngOnDestroy(){
    sassChanged.dispatch()
  }

  getFonts(){
    this.restService.load(`https://www.googleapis.com/webfonts/v1/webfonts?key=${this.settings.googleFontsAPIKey}`)
        .then(result=>{
          this.fonts = result.items
        })
  }

  onChangeVariables(){
    // todo: check why this.settings takes one tick to update ngmodel
    setTimeout(cssVariablesChanged.dispatch.bind(cssVariablesChanged, this.settings))
  }

  onChangeFonts(){
    // todo: check why this.settings takes one tick to update ngmodel
    setTimeout(cssFontsChanged.dispatch.bind(cssFontsChanged, this.settings))
  }

  onChangeSass(sass:string){
    sassChanged.dispatch(sass)
  }

  onChangeLogo(e:Event){
      const target:HTMLInputElement = e.target as HTMLInputElement
      const fileReader = new FileReader()
      const file = target.files[0]
      fileReader.readAsDataURL(file)
      fileReader.addEventListener('load', ()=>{
        const result = fileReader.result
        const img = document.createElement('img')
        img.addEventListener('load', this.onLogoLoad.bind(this, result, img))
        img.setAttribute('src', result)
        target.value = null
      })
  }

  onDeleteLogo(){
    this.onLogoLoad()
  }

  onLogoLoad(result?:string, img?:HTMLImageElement){
    this.settings.themeLogoCSS = result?`.invoice #logo {
    width: ${img.naturalWidth}px;
    height: ${img.naturalHeight}px;
    background: url(${result}) no-repeat;
}`:''
    cssVariablesChanged.dispatch(this.settings)
    this.onNgModelChanged()
  }

  onRevert(){
    super.onRevert()
    sassChanged.dispatch()
  }

  protected cloneModel():any {
    return this.settings = <any>super.cloneModel()
  }

}
