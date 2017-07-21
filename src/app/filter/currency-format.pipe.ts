import {Pipe, PipeTransform} from '@angular/core'

@Pipe({
  name: 'currencyFormat'
})
/**
 * A currency formatter pipe
 * Has the ability to use any chunk- or decimal delimiter while still enabling copying of a valid number
 */
export class CurrencyFormat implements PipeTransform {
  transform(
      value:number,
      currencySign = '€ ',
      decimalLength = 2,
      chunkDelimiter = '<span class="chunk" char="."></span>',
      decimalDelimiter = `<span class="decimal" char=",">.</span>`,
      chunkLength = 3
  ): string {

    let result = '\\d(?=(\\d{' + chunkLength + '})+' + (decimalLength>0 ? '\\D' : '$') + ')',
        num = value.toFixed(Math.max(0, ~~decimalLength))
    return currencySign + (decimalDelimiter ? num.replace('.', decimalDelimiter) : num).replace(new RegExp(result, 'g'), '$&' + chunkDelimiter)
  }
}