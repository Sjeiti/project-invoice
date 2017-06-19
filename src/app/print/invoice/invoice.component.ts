import {Component, Input, OnInit, ViewEncapsulation, ElementRef, OnDestroy} from '@angular/core'
import {IClient} from '../../interface/client'
import {IProject} from '../../interface/project'
import {IInvoice} from '../../interface/invoice'
import {ModelService} from '../../model/model.service'
import {LocalisationService} from '../../service/localisation.service'
import {InterpolationService} from '../../service/interpolation.service'
import {CurrencyFormat} from '../../filter/currency-format.pipe'
import {cssChanged, cssCompiled} from '../../signals'

@Component({
  selector: 'app-print-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrintInvoiceComponent implements OnInit, OnDestroy {

  @Input()
  project:IProject
  @Input()
  client:IClient
  @Input()
  invoice:IInvoice

  copy:any
  binds:any[]
  personal:any
  config:any
  __:Function

  isQuotation = false

  private sass:any
  private styleClone:HTMLStyleElement

  constructor(
      private modelService:ModelService,
      protected interpolationService:InterpolationService,
      private localisationService:LocalisationService,
      private elementRef: ElementRef
  ) {
    this.__ = localisationService.__.bind(localisationService)
    this.sass = new Sass('./static/js/sass.worker.js')
  }

  ngOnInit(){
    this.copy = this.modelService.getCopy()
    this.personal = this.modelService.getPersonal()
    this.config = this.modelService.getConfig()
    this.localisationService.addExtra(this.project, 'project')
    this.localisationService.addExtra(this.client, 'client')
    this.setCustomStyle()
    this.binds = [this.setCustomStyle.bind(this)].map(bind=>{
      cssChanged.add(bind)
      return bind
    })
    this.isQuotation = /\/client\/\d+\/\d+\/quotation/.test(location.href)
  }

  ngOnDestroy(){
    this.binds.forEach(bind=>cssChanged.remove(bind))
  }

  private setCustomStyle(css:string = null){
    this.styleClone = document.getElementById('invoiceCSS') as HTMLStyleElement
    !this.styleClone&&Array.from(document.querySelectorAll('style')).forEach(style=>{
      if (style.innerText==='{{config.invoiceCSS}}') {
        this.styleClone = style.cloneNode(true) as HTMLStyleElement
        this.styleClone.setAttribute('id', 'invoiceCSS')
        this.elementRef.nativeElement.querySelector('.invoice').appendChild(this.styleClone)
      }
    })
    this.sass.compile(css||this.config.invoiceCSS, this.onSassCompiled.bind(this))
  }

  private onSassCompiled(result){
    if (result.status===0){
      this.styleClone.textContent = result.text
      cssCompiled.dispatch(result.text)
    }
  }

  parse(key){
    const client = this.client,
      invoice = this.invoice,
      project = this.project,
      currencyPipe = new CurrencyFormat(),
      data = this.modelService.getData().personal,
      currency = (...args) => currencyPipe.transform.apply(currencyPipe, args)
    return this.interpolationService.parse(this.__(key), {
      project,
      client,
      invoice,
      data,
      currency
    })
  }

  get invoiceIndex(){
    return this.project.invoices.indexOf(this.invoice)
  }

}