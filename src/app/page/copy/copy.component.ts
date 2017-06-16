import {Component, OnInit} from '@angular/core'
import {Saveable} from '../../abstract/saveable'
import {ModelService} from '../../model/model.service'
import * as dummyData from '../../dummy/data'
import * as Rx from 'rxjs/Rx'

@Component({
  selector: 'app-copy',
  templateUrl: './copy.component.html',
  styleUrls: ['./copy.component.scss']
})

export class CopyComponent extends Saveable implements OnInit {

  static data:any = {
    title: 'Copy',
    heading: 'Copy',
    meta: {description: 'Foo is the bar of all qux'}
  }

  private clone:any
  private sectionRect:any
  private dragFrom:HTMLElement
  private dragTo:HTMLElement

  public copy:any
  public copySorted:any[] = []

  constructor(
      protected modelService:ModelService
  ) {
    super(modelService)
  }

  ngOnInit() {
    super.ngOnInit()
    this.copy = this.setModel(this.modelService.getCopy())
    this.buildCopySorted()
    this.initDrag()
  }

  initDrag(){
    const Observable = Rx.Observable
    const merge = Observable.merge.bind(Rx)
    const fromEvent = Observable.fromEvent.bind(Rx)
    const fromDc = fromEvent.bind(Rx, document)
    //
    const mousedown = merge(fromDc('mousedown'), fromDc('touchstart'))
    const mouseup = merge(fromDc('mouseup'), fromDc('touchend'))
    const mousemove = merge(fromDc('mousemove'), fromDc('touchmove'))
    //
    const dragstart = mousedown.flatMap(()=>mousemove.takeUntil(mouseup).take(1))
    const dragmove = mousedown.flatMap(()=>mousemove.takeUntil(mouseup)).map(e=>{
      const subj = e.constructor===TouchEvent&&e.touches[0]||e
      return {
        e,
        x: subj.clientX,
        y: subj.clientY
      }
    })
    dragstart.subscribe(this.onDragStart.bind(this))
    dragmove.subscribe(this.onDragMove.bind(this))
    mouseup.subscribe(this.onDragEnd.bind(this))
  }

  onDragStart(e){
    if (e.target.nodeName==='DT') {
      const target = e.target,
          parentDL = target.parentNode,
          section = parentDL.parentNode
      this.sectionRect = section.getBoundingClientRect()
      this.dragFrom = target
      let sibling = <HTMLElement>this.dragFrom.nextElementSibling
      const siblings = [<HTMLElement>this.dragFrom]
      while (sibling&&sibling.nodeName==='DD') {
        siblings.push(sibling)
        sibling = <HTMLElement>sibling.nextElementSibling
      }
      this.clone = parentDL.cloneNode(false)
      this.clone.classList.add('clone')
      siblings.forEach(elm=>this.clone.appendChild(elm.cloneNode(true)))
      const parentNode = <HTMLElement>this.dragFrom.parentNode.parentNode
      parentNode.appendChild(this.clone)
      parentNode.style.position = 'relative'
      Object.assign(this.clone.style, {
        position: 'absolute',
        width: '100%',
        left: 0,
        top: 0
      })
    }
  }

  onDragMove({e, x, y}){
    if (this.dragFrom) {
      this.dragTo = e.target
      // const isFoo = this.dragTo===this.dragFrom,
      //     isDt = this.dragTo.nodeName==='DT'
      this.clone.style.todp = `${y-this.sectionRect.top}px`
      e.preventDefault()
    }
  }

  onDragEnd(){
    if (this.dragFrom&&this.dragTo) {
      const dts = (<HTMLElement>this.dragFrom.parentNode).querySelectorAll('dt'),
          indexFrom = Array.prototype.indexOf.call(dts, this.dragFrom),
          indexTo = Array.prototype.indexOf.call(dts, this.dragTo)
      if (indexFrom>=0&&indexTo>=0&&indexFrom!==indexTo) {
        this.copySorted[indexFrom].value.index = this.copySorted[indexTo].value.index + (indexFrom>indexTo?-0.1:0.1)
        this.copySorted.sort((a, b)=>a.value.index>b.value.index?1:-1)
        this.copySorted.forEach((o, i)=>{
          o.value.index = i
        })
      }
    }
    this.dragFrom = null
    this.dragTo = null
    this.clone&&this.clone.parentNode.removeChild(this.clone)
    this.clone = null
  }

  onAdd(){
    let name = prompt('name').replace(/[^_A-Za-z0-9]/g, '')
    if (name!=='') {
      this.copy[name] = {nl:name, en:name, index: this.highestIndex+1 }
    }
    this.buildCopySorted()
    this.checkModelDirty()
  }

  keyDeletable(key:string) {
    return !dummyData.default.copy.hasOwnProperty(key)
  }

  onRemoveCopy(name:string){
    delete this.copy[name]
    this.buildCopySorted()
    this.checkModelDirty()
  }

  /*onIndexUp(name:string){
    this.moveIndex(name, -1)
  }

  onIndexDown(name:string){
    this.moveIndex(name, 1)
  }*/

  protected cloneModel():any {
    return this.copy = <any>super.cloneModel()
  }

  get lang():string {
    return (<any>this.modelService.config).lang
  }

  /*private moveIndex(name:string, to:number) {
    let value = this.copy[name],
        index = value.index,
        indexNew = index + to,
        swap = this.copySorted[indexNew].value
    if (indexNew>0&&indexNew<this.copySorted.length) {
      value.index = indexNew
      swap.index = index
      this.buildCopySorted()
      this.checkModelDirty()
    }
  }*/

  private buildCopySorted(){
    let copy = this.copy,
        copySorted = this.copySorted
    copySorted.length = 0
    for (let name in copy) {
      if (copy.hasOwnProperty(name)) {
        let value = this.copy[name],
            index = value.index
        copySorted[index] = {name, value}
      }
    }
  }

  private get highestIndex(){
    let index = 0,
        copy = this.copy
    for (let name in copy) {
      if (copy.hasOwnProperty(name)) {
        let value = this.copy[name]
        if (value.index>index) {
          index = value.index
        }
      }
    }
    return index
  }

}
