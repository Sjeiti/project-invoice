import {Component} from '@angular/core'
import {ModelService} from '../../model/model.service'


@Component({
  selector: 'app-lang',
  templateUrl: './lang.component.html',
  styleUrls: ['./lang.component.scss']
})

export class LangComponent {

  public config:any

  constructor(
      protected modelService:ModelService
  ) {
    this.config = <any>this.modelService.config
  }

  setLang(lang:string){
    this.config.lang = lang
    this.modelService.save()
  }

}
