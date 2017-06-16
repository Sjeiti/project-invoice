import {Injectable} from '@angular/core'

@Injectable()
export class InterpolationService {

  /**
   * Interpolate a string with values from an object
   * @param {string} template
   * @param {object} values
   * @returns {string}
   */
  public parse(template:string, values:any):string{
    let parent = 'values',
        tmpl = this.prefixVariables(template, parent, values),
        val
    try{
      val = new Function(parent, 'return `'+tmpl+'`')(values)
    } catch (error) {
      console.warn('interpolation error', {error, tmpl})
    }
    return val||template
  }

  /**
   * Prefix all interpolation variables with a parent object identifier
   * @param {string} template
   * @param {string} parent
   * @returns {string}
   */
  private prefixVariables(template:string, parent:string, values:any):string {
    let regString = '('+Object.keys(values).map(s=>s+'[\\.\\(]').join('|')+')',
        reg = new RegExp(regString, 'g'),
        tmpl = template.replace(reg, parent+'.$1')
    return tmpl
  }
}