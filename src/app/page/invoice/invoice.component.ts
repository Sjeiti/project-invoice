import {Component, OnInit, ElementRef} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {ModelService} from '../../model/model.service'
import {Project} from '../../model/project'
import {IClient} from '../../interface/client'
import {IInvoice} from '../../interface/invoice'
import {cssCompiled} from '../../signals'

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  static data:any = {
    title: 'Invoice',
    heading: 'Invoice',
    meta: {description: 'Foo is the bar of all qux'}
  }

  private subscription:any
  private projectId:string
  private elm:HTMLElement

  public client:IClient
  public reminderNr:number
  public project:Project
  public invoice:IInvoice
  public invoiceName:string
  public pageReady = false

  private canvas:HTMLCanvasElement
  public dataUrl:string

  constructor(
      private element:ElementRef,
      protected modelService:ModelService,
      private route:ActivatedRoute
  ) { }

  ngOnInit() {
    this.elm = this.element.nativeElement
    this.subscription = this.route.params.subscribe((params:any)=> {
      const clientNr:number = params['clientNr']<<0
      const projectIndex:number = (params['projectIndex']<<0) - 1
      //
      this.projectId = params.projectNr
      this.client = this.modelService.getClientByNr(clientNr)
      //
      this.project = this.modelService.getProject(clientNr, projectIndex)
      const hasReminderNr = params.hasOwnProperty('reminderNr')
      this.reminderNr = hasReminderNr?params.reminderNr<<0:0
      this.invoice = this.project.invoices[this.reminderNr]
      this.invoiceName = 'invoice' + this.project.invoiceNr + '_' + (this.invoice&&this.invoice.type)
    })
    this.populateIframe()
        .then(cssCompiled.add.bind(cssCompiled, this.onCssCompiled.bind(this)))
  }

  /**
   * Call print on the iframe if the page is ready
   */
  onClickPrint(){
    const {contentWindow} = this.getIFrameContent()
    contentWindow.print()
  }

  /**
   * IE hack to download the image
   * @param {event} e
   * @todo: use FileSaver.js ?
   */
  onClickDownload(e){
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(this.canvas.msToBlob(), `${this.invoiceName}.png`)
      e.preventDefault()
    }
  }

  /**
   * Populate the iframe with unbound html and css
   */
  private populateIframe() {
    return new Promise(resolve=>{
      setTimeout(()=>{
        const {contentDocument} = this.getIFrameContent()
        const contentBody = contentDocument.body
        //
        contentDocument.title = this.invoiceName
        //
        const html = this.elm.querySelector('app-print-invoice').innerHTML
        const styles = Array.from(document.querySelectorAll('style')).map(style=>style.outerHTML).join('')
        //
        contentBody.innerHTML = styles + html
        //
        resolve()
        this.pageReady = true
      })
    })
  }

  /**
   * For some reason these properties cannot be cached
   * @returns {{contentWindow: Window, contentDocument: Document}}
   */
  private getIFrameContent(){
    const {contentWindow, contentDocument} = this.elm.querySelector('iframe')
    return {contentWindow, contentDocument}
  }

  /**
   * Create and download an image from the iframe if the page is ready
   */
  private renderImage(){
    const {contentDocument} = this.getIFrameContent()
    contentDocument&&html2canvas(contentDocument.body, {
      // width: .2*210,
      // height: .2*297,
      // logging: true
    })
        .then(canvas=>{
          this.canvas = canvas
          this.dataUrl = this.canvas.toDataURL()
        })
  }

  /**
   * Inject custom CSS into iframe when sass has compiled
   * @param {string} css
   */
  private onCssCompiled(css) {
    const {contentDocument} = this.getIFrameContent()
    if (contentDocument) {
      contentDocument.getElementById('invoiceCSS').textContent = css
    }
    // re-render image after css compilation
    this.renderImage()
  }

}
