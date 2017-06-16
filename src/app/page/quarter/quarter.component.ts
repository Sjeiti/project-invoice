import {Component, OnInit, ViewChild, ElementRef} from '@angular/core'
import {ActivatedRoute} from '@angular/router'
import {InterpolationService} from '../../service/interpolation.service'
import {ModelService} from '../../model/model.service'
import {Project} from '../../model/project'
import {IProject} from '../../interface/project'
import {INVOICE} from '../../config/invoice'
import {CurrencyFormat} from '../../filter/currency-format.pipe'

@Component({
  selector: 'app-quarter',
  templateUrl: './quarter.component.html',
  styleUrls: ['./quarter.component.scss']
})

export class QuarterComponent implements OnInit {

  static data:any = {
    title: 'Quarter',
    heading: 'Quarter',
    meta: {description: 'Welcome to Quarter'}
  }

  private projects:Project[]
  private csvTemplate = ''
  @ViewChild('csv') private csvRef:ElementRef
  private elmCsv:HTMLTextAreaElement

  quarters:IProject[][] = [[], [], [], []]
  year = (new Date).getFullYear()
  years = []
  dateFormat:string = INVOICE.dateFormat

  constructor(
    public modelService:ModelService,
    protected interpolationService:InterpolationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.hasOwnProperty('year')){
        this.year = parseInt(params['year'], 10)
        this.setQuarters()
      }
    })
    const config:any = this.modelService.getConfig()
    this.csvTemplate = config.csvTemplate
    this.projects = this.modelService.getProjects().slice(0)
    this.setQuarters()
    this.years = this.projects.filter(project=>project.invoices.length).map((project:Project)=>{
      return project.year
    }).filter((elem, pos, arr) => {
      return arr.indexOf(elem)===pos
    }).sort()
    this.elmCsv = this.csvRef.nativeElement
    //
    // this.quarters.forEach(quarter=>{
    //   const arr = quarter as any
    //   // arr.totalDiscounted = quarter.map(project=>project.totalDiscounted).reduce((a, b)=>a+b)
    //   // arr.totalVatDiscounted = quarter.map(project=>project.totalVatDiscounted).reduce((a, b)=>a+b)
    //   // arr.totalIncDiscounted = quarter.map(project=>project.totalIncDiscounted).reduce((a, b)=>a+b)
    //   Object.defineProperty(arr, 'totalDiscounted', { set: function() { return this.quarter.map(project=>project.totalDiscounted).reduce((a, b)=>a+b); } });
    //   Object.defineProperty(arr, 'totalVatDiscounted', { set: function() { return this.quarter.map(project=>project.totalVatDiscounted).reduce((a, b)=>a+b); } });
    //   Object.defineProperty(arr, 'totalIncDiscounted', { set: function() { return this.quarter.map(project=>project.totalIncDiscounted).reduce((a, b)=>a+b); } });
    // })
  }

  private setQuarters(){
    this.quarters.forEach(quarter=>{
      quarter.length = 0
    })
    this.projects&&this.projects
        .filter(project=>project.invoices.length&&project.year===this.year)
        .forEach((project:Project)=>{
          const monthNumber = project.date.getMonth()
          const quarter = Math.ceil((monthNumber+1)/3)
          this.quarters[quarter-1].push(project)
        })
  }

  onClickCsv(quarter:IProject[]) {
    const parsed = quarter.map(project=>{
      const client = this.modelService.getClientByNr(project.clientNr),
        invoice = project.invoices.slice(0).shift(),
        currencyPipe = new CurrencyFormat(),
        data = this.modelService.getData().personal,
        currency = (...args) => currencyPipe.transform.apply(currencyPipe, args)
      return this.interpolationService.parse(this.csvTemplate, {
        project,
        client,
        invoice,
        data,
        currency
      })
    })
    this.elmCsv.value = parsed.join('\n')
    if (this.elmCsv && this.elmCsv.select) {
      this.elmCsv.select()
      try {
        document.execCommand('copy')
        this.elmCsv.blur()
      } catch (err) {
        alert('please press Ctrl/Cmd+C to copy')
      }
    }
  }

  getTotalDiscounted(quarter?:Project[]):number {
    let total = 0
    if (quarter===undefined) {
      quarter = this.projects&&this.projects
        .filter(project=>project.invoices.length&&project.year===this.year)
    }
    quarter
        .forEach((project:Project)=>{
          total += project.totalDiscounted
        })
    return total
  }

  getTotalVatDiscounted(quarter?:Project[]):number {
    let total = 0
    if (quarter===undefined) {
      quarter = this.projects&&this.projects
        .filter(project=>project.invoices.length&&project.year===this.year)
    }
    quarter
        .forEach((project:Project)=>{
          total += project.totalVatDiscounted
        })
    return total
  }

  getTotalIncDiscounted(quarter?:Project[]):number {
    let total = 0
    if (quarter===undefined) {
      quarter = this.projects&&this.projects
        .filter(project=>project.invoices.length&&project.year===this.year)
    }
    quarter
        .forEach((project:Project)=>{
          total += project.totalIncDiscounted
        })
    return total
  }

}
