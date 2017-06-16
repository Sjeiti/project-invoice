import {Component, OnInit, OnDestroy} from '@angular/core'
import {Router, ActivatedRoute} from '@angular/router'
import {IClient} from '../../interface/client'
import {IProject} from '../../interface/project'
import {IInvoice} from '../../interface/invoice'
import {IInvoiceLine} from '../../interface/invoice-line'
import {ModelService} from '../../model/model.service'
import {Saveable} from '../../abstract/saveable'
import {INVOICE} from '../../config/invoice'
import {dateTimeToDate} from '../../mixins'
import {modelAction, modelAble, modelBeforeSave, modelSaved} from '../../signals'
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
  private projectId:string
  private projectProper:Project

  public client:IClient
  public project:Project
  public INVOICE:any = INVOICE

  constructor(
      protected modelService:ModelService,
      private router:Router,
      private route:ActivatedRoute
  ) {
    super(modelService, modelAble.SAVE|modelAble.DELETE)
    modelAction.add(state=>{
      state===modelAction.DELETE&&this.onDelete()||
      state===modelAction.SAVE&&this.checkInvoiceNumberBeforeSave()
    })
  }

  ngOnInit() {
    super.ngOnInit()
    this.subscription = this.route.params.subscribe(params=> {
      let clientNr:number = params['clientNr']<<0
      this.projectId = params['projectNr']
      this.client = this.modelService.getClientByNr(clientNr)
      this.projectProper = this.modelService.getProject(this.projectId)
      this.project = this.setModel(this.projectProper)
    })
  }

  ngOnDestroy() {
    super.ngOnDestroy()
    this.subscription.unsubscribe()
  }

  protected onDelete():boolean {
    let isDeleted = super.onDelete(this.modelService.removeProject.bind(this.modelService))
    isDeleted&&this.router.navigate(['/client/'+this.client.nr])
    return isDeleted
  }

  clone(project:IProject) {
    const clonedProject = this.modelService.cloneProject(project)
    this.router.navigate(['/client/'+clonedProject.clientNr+'/'+clonedProject.invoiceNr])
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
    let invoices = this.project.invoices/*,
        numInvoices = invoices.length*/
    invoices.push(<IInvoice>{
      date: dateTimeToDate(),
      type: this.project.invoices.length===0?'invoice':'reminder', // todo: from const
      interest: false,
      exhortation: false
    })
    // numInvoices===0&&this.checkInvoiceNumber()
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

  /*private checkInvoiceNumber() {
    modelAction.addOnce(action=>{
      if (action===modelAction.SAVE) {
        this.checkInvoiceNumberBeforeSave()
      }
    }, null, 1)
  }*/

  private checkInvoiceNumberBeforeSave() {
    modelBeforeSave.addOnce(()=>{
      this.projectProper.invoiceNr = this.modelService.calculateInvoiceNr(this.projectProper)
      modelSaved.addOnce(()=>{
        this.router.navigate([this.projectProper.uri])
      })
    })
  }

  protected cloneModel():any {
    this.project = super.cloneModel() as Project
    return this.project
  }
}
