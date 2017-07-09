import {Directive, ElementRef, Input, OnInit} from '@angular/core'
import {EXPLAIN} from '../config/explain'


@Directive({ selector: '[appExplain]' })

export class ExplainDirective implements OnInit {

  @Input('appExplain') parentKey:string

  private elm:HTMLElement

  constructor(el: ElementRef) {
    this.elm = el.nativeElement as HTMLElement
  }

  ngOnInit(){
    const [parent, key] = this.parentKey.split(/[.,]/),
        name = this.name(key, parent),
        explanation = this.explain(key, parent)
    this.elm.textContent = name
    explanation&&this.elm.setAttribute('data-title', explanation)
  }

  private getKey(key:string, parent:string):string[] {
    return EXPLAIN[parent]&&EXPLAIN[parent][key]||[key, null]
  }

  private name(key:string, parent:string):string {
    return this.getKey(key, parent||'data')[0]
  }

  private explain(key:string, parent:string):string {
    return this.getKey(key, parent||'data')[1]
  }

}