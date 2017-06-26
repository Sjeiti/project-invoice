import { Component, OnInit } from '@angular/core'
import {Router} from '@angular/router'
import {ModelService} from '../../model/model.service'
import {Client} from '../../model/client'
import {IProject} from '../../interface/project'
import {INVOICE} from '../../config/invoice'
import {IClient} from '../../interface/client'
import {Project} from '../../model/project'
import {IInvoice} from '../../interface/invoice'
import {IConfig} from '../../interface/config'
import {dateTimeToDate} from '../../mixins'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  static data:any = {
    title: '',
    heading: 'Project Invoice',
    meta: {description: 'Welcome to something'}
  }
  config:IConfig
  projects:IProject[] = []
  latestClient:IClient
  latestProject:IProject
  dateFormat:string = INVOICE.dateFormat

  constructor(
      private router: Router,
      public modelService:ModelService
  ) { }

  ngOnInit() {
    this.config = this.modelService.getConfig()
    this.projects = this.modelService.getProjects()
    this.latestClient = this.modelService.getClients().slice(0).sort((client1, client2)=>{
      return (client1 as Client).lastProjectDate>(client2 as Client).lastProjectDate?1:-1
    }).slice(0).pop()
    this.latestProject = this.latestClient&&this.latestClient.projects.slice(0).pop()
  }

  onPaidChange() {
    this.modelService.save()
  }

  onAddReminder(project:Project) {
    let invoices = project.invoices,
        numInvoices = invoices.length
    invoices.push(<IInvoice>{
      date: dateTimeToDate(),
      type: numInvoices===0?'invoice':'reminder', // todo: from const
      interest: false,
      exhortation: false
    })
    this.modelService.save()
    this.router.navigate([project.uri+'/reminder/'+numInvoices])
  }

  onAddClient() {
    let client = this.modelService.addClient()
    this.router.navigate([client.uri])
  }

  onAddProjectForLatestClient() {
    const project = this.modelService.addProject(this.latestClient.nr)
    this.router.navigate([project.uri])
  }

  onCloneLatestProject() {
    if (this.latestProject) {
      const clonedProject = this.modelService.cloneProject(this.latestProject) as Project
      this.router.navigate([clonedProject.uri])
    }
  }

  onHideWelcome() {
    this.config.homeMessage = false
    this.modelService.save()
  }

}