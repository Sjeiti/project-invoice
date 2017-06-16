import {Component, ElementRef, Input, OnInit, Renderer} from '@angular/core'
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms'
import {InterpolationService} from '../../service/interpolation.service'
import {LocalisationService} from '../../service/localisation.service'
import {ModelService} from '../../model/model.service'
import {CurrencyFormat} from '../../filter/currency-format.pipe'
import {IClient} from '../../interface/client'
import {Client} from '../../model/client'
// import {IProject} from '../../interface/project'
import {Project} from '../../model/project'
import * as dummyData from '../../dummy/data'

const noop = () => {}
let id = 0
const getId = ()=>id++

@Component({
  selector: 'app-interpolationui',
  templateUrl: './interpolationui.component.html',
  styleUrls: ['./interpolationui.component.scss'],
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: InterpolationUIComponent, multi: true}
  ]
})

export class InterpolationUIComponent implements OnInit, ControlValueAccessor {

  private innerValue = ''
  private onTouchedCallback: () => void = noop
  private onChangeCallback: (_: any) => void = noop

  private selectionStart = 0
  private selectionEnd = 0

  private elmTextarea:HTMLTextAreaElement

  dummyModel:any

  isFocused = false
  isOver = false
  hideTimeout:any
  uiVisible = false
  id:string

  @Input()
  localise:string
  doLocalise = false

  __:any

  constructor(
      private element: ElementRef,
      private renderer: Renderer,
      private modelService:ModelService,
      private interpolationService:InterpolationService,
      private localisationService:LocalisationService
  ) {
    const client = new Client(<IClient>dummyData.default.clients[0])
    client.projects = client&&client.projects.map(project=>new Project(project, modelService))
    const project = client&&client.projects.slice(0).pop(),
        invoice = project.invoices.slice(0).shift(),
        data = modelService.getData().personal,
        currencyPipe = new CurrencyFormat(),
        currency = (...args) => currencyPipe.transform.apply(currencyPipe, args)
    this.dummyModel = {
      client,
      project,
      invoice,
      data,
      currency
    }
    this.__ = localisationService.__.bind(localisationService)
    this.id = 'interpolationui'+getId()
  }

  ngOnInit(){
    this.doLocalise = this.localise!==undefined&&this.localise!=='false'
    this.elmTextarea = this.element.nativeElement.querySelector('textarea')
  }
  // ngOnDestroy(){}

  get value(): any {
      return this.innerValue
  };

  set value(val: any) {
    if (val !== this.innerValue) {
      this.innerValue = val
      this.onChangeCallback(val)
    }
  }

  onFocus(e:FocusEvent) {
    this.isFocused = true
    this.uiVisible = true
  }

  onBlur(e:FocusEvent) {
    this.isFocused = false
    this.checkVisibility()
    this.onTouchedCallback()
    //
    const target = <HTMLTextAreaElement>e.target
    this.selectionStart = target.selectionStart
    this.selectionEnd = target.selectionEnd
  }

  onMouseEnter(e:FocusEvent) {
    this.isOver = true
  }

  onMouseLeave(e:FocusEvent) {
    this.isOver = false
    this.checkVisibility()
  }

  onClickDummy(dummyKey:string, dummyProp:string){
    this.value = `${this.value.substring(0, this.selectionStart)}\${${dummyKey}.${dummyProp}}${this.value.substring(this.selectionEnd)}`
    setTimeout(this.renderer.invokeElementMethod.bind(this.renderer, this.elmTextarea, 'focus'), 1)
  }

  writeValue(value: any): void {
    this.innerValue = value
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn
  }
  setDisabledState(isDisabled: boolean): void {}

  parse(text:string):string {
    if (this.doLocalise) {
      text = this.__(text||'')
    }
    return this.interpolate(text||'')
  }

  private interpolate(text:string):string {
    return this.interpolationService.parse(text, this.dummyModel)
  }

  private checkVisibility() {
    clearTimeout(this.hideTimeout)
    this.hideTimeout = setTimeout(()=>{
      this.uiVisible = this.isOver||this.isFocused
    }, 200)
  }


}