import {Component, ElementRef, OnInit} from '@angular/core'

@Component({
  selector: 'app-foldable-definition',
  templateUrl: './foldable-definition.component.html',
  styleUrls: ['./foldable-definition.component.scss'],
})

export class FoldableDefinitionComponent implements OnInit {

  list = []
  name = `fd${(Date.now()/Math.random())<<0}`

  constructor(
      private element: ElementRef
  ) {}

  ngOnInit(){
    const wrapper = this.element.nativeElement.querySelector('[data-list]')
    const list = wrapper&&wrapper.querySelectorAll('dt,dd')||[]
    let dt:string
    Array.from(list).forEach((element, index)=>{
      const elm = element as HTMLElement
      const nodeName = elm.nodeName
      if (nodeName==='DT') {
        dt = elm.innerHTML
      } else if (nodeName==='DD') {
        const dd = elm.innerHTML
        this.list.push({dt, dd, index})
      }
    })
  }

}