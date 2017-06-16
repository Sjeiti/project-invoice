import {Component, OnInit} from '@angular/core'
import {ModelService} from '../../model/model.service'
import {IProject} from '../../interface/project'
import {INVOICE} from '../../config/invoice'

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})

export class OverviewComponent implements OnInit {

  static data:any = {
    title: 'Overview',
    heading: 'Overview',
    meta: {description: 'Welcome to Overview'}
  }
  projects:IProject[]
  dateFormat:string = INVOICE.dateFormat

  constructor(
      public modelService:ModelService
  ) {}

  ngOnInit() {
    this.projects = this.modelService.getProjects()
  }

  onPaidChange() {
    this.modelService.save()
  }

}
