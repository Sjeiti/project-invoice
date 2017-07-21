import {Directive, ElementRef, Input, OnInit} from '@angular/core'
import {EXPLAIN} from '../config/explain'

@Directive({ selector: '[appExplain]' })

/**
 * A directive to use in conjunction with `config/explain` that is used to convert key-names to human readable format.
 * Also has the possibility to add a title-like pseudo element for more explanation.
 */
export class ExplainDirective implements OnInit {

  @Input('appExplain') parentKey:string

  private elm:HTMLElement

  /**
   * Constructor
   * @param {HTMLElement} el
   */
  constructor(el: ElementRef) {
    this.elm = el.nativeElement as HTMLElement
  }

  /**
   * ngOnInit
   */
  ngOnInit(){
    const [parent, key] = this.parentKey.split(/[.,]/),
        name = this.name(key, parent),
        explanation = this.explain(key, parent)
    this.elm.textContent = name
    explanation&&this.elm.setAttribute('data-title', explanation)
  }

  /**
   * Getter for the key
   * @param {string} key
   * @param {string} parent
   * @returns {string[]}
   */
  private getKey(key:string, parent:string):string[] {
    return EXPLAIN[parent]&&EXPLAIN[parent][key]||[key, null]
  }

  /**
   * Get the name associated with a key
   * @param {string} key
   * @param {string} parent
   * @returns {string}
   */
  private name(key:string, parent:string):string {
    return this.getKey(key, parent||'data')[0]
  }


  /**
   * Get the explanation associated with a key
   * @param {string} key
   * @param {string} parent
   * @returns {string}
   */
  private explain(key:string, parent:string):string {
    return this.getKey(key, parent||'data')[1]
  }

}