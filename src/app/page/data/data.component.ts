import {Component, OnInit} from '@angular/core'
import {Saveable} from '../../abstract/saveable'
import {ModelService} from '../../model/model.service'
import {ExplainDirective} from '../../directive/explain.directive'

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html'
})

export class DataComponent extends Saveable implements OnInit {

  static data:any = {
    title: 'Data',
    heading: 'Data',
    meta: {description: 'Foo is the bar of all qux'},
    declarations: [ExplainDirective]
  }
  personal:any

  constructor(
      protected modelService:ModelService
  ) {
    super(modelService)
  }

  ngOnInit() {
    super.ngOnInit()
    this.personal = this.setModel(this.modelService.getPersonal())
  }

  protected cloneModel():any {
    return this.personal = <any>super.cloneModel()
  }
}
