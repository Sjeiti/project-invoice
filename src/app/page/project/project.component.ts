import {Component, OnInit, OnDestroy} from '@angular/core'
import {Router, ActivatedRoute} from '@angular/router'
import {Client} from '../../model/client'
import {IProject} from '../../interface/project'
import {IInvoice} from '../../interface/invoice'
import {IInvoiceLine} from '../../interface/invoice-line'
import {ModelService} from '../../model/model.service'
import {Saveable} from '../../abstract/saveable'
import {INVOICE} from '../../config/invoice'
import {dateTimeToDate} from '../../mixins'
import {modelAction, modelAble} from '../../signals'
import {Project} from '../../model/project'

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})

export class ProjectComponent extends Saveable implements OnInit, OnDestroy {

  static data:any = {
    title: 'Project',
    heading: 'Project',
    meta: {description: 'Foo is the bar of all qux'}
  }
  private subscription:any
  private projectProper:Project

  public client:Client
  public project:Project
  public INVOICE:any = INVOICE

  constructor(
      protected modelService:ModelService,
      private router:Router,
      private route:ActivatedRoute
  ) {
    super(modelService, modelAble.SAVE|modelAble.DELETE)
    modelAction.add(state=>{
      state===modelAction.DELETE&&this.onDelete()
    })
  }

  ngOnInit() {
    super.ngOnInit()
    this.subscription = this.route.params.subscribe(params=> {
      const clientNr:number = params['clientNr']<<0
      const projectIndex:number = (params['projectIndex']<<0) - 1
      //
      this.client = this.modelService.getClientByNr(clientNr)
      this.projectProper = this.modelService.getProject(clientNr, projectIndex)
      //
      if (!this.projectProper) {
        this.router.navigate([(this.client as Client).uri])
      } else {
        this.project = this.setModel(this.projectProper)
      }
    })
  }

  ngOnDestroy() {
    super.ngOnDestroy()
    this.subscription.unsubscribe()
  }

  protected onDelete():boolean {
    let isDeleted = super.onDelete(this.modelService.removeProject.bind(this.modelService))
    isDeleted&&this.router.navigate([this.client.uri])
    return isDeleted
  }

  clone(project:IProject) {
    const clonedProject = this.modelService.cloneProject(project)
    this.router.navigate([clonedProject.uri])
  }

  onRemoveLine(line:IInvoiceLine) {
    let lines = this.project.lines,
        i = lines.indexOf(line)
    i!==-1&&lines.splice(i, 1)
    this.checkModelDirty()
  }

  onAddLine() {
    this.project.lines.push(<IInvoiceLine>{amount:0, hours:0, vat:INVOICE.VAT_DEFAULT})
    this.checkModelDirty()
  }

  onAddInvoice() {
    let invoices = this.project.invoices
    invoices.push(<IInvoice>{
      date: dateTimeToDate(),
      type: this.project.invoices.length===0?'invoice':'reminder', // todo: from const
      interest: false,
      exhortation: false
    })
    this.onSave()
    this.checkModelDirty()
  }

  onRemoveInvoice(invoice:IInvoice) {
    let invoices = this.project.invoices,
        i = invoices.indexOf(invoice)
    i!==-1&&invoices.splice(i, 1)
    this.checkModelDirty()
  }

  onClickCalculation(project:Project, line:IInvoiceLine) {
    line.amount = line.hours*project.hourlyRateDiscounted
    this.checkModelDirty()
  }

  protected cloneModel():any {
    this.project = super.cloneModel() as Project
    return this.project
  }
}
