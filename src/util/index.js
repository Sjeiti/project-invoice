export function watchAll(vm,...props){
	return Promise.all(props.map(key=>new Promise(resolve=>{
         const unwatch = vm.$watch(key,()=>{
           unwatch()
           resolve()
           return vm[key]
         })
       })
     ))
}

/**
 * @param {number} value
 * @param {string} currencySign
 * @param {number} decimalLength
 * @param {string} chunkDelimiter
 * @param {string} decimalDelimiter
 * @param {number} chunkLength
 * @returns {string}
 */
export function currency(
      value,
      currencySign = '€ ',
      decimalLength = 2,
      chunkDelimiter = '<span class="chunk" char="."></span>',
      decimalDelimiter = `<span class="decimal" char=",">.</span>`,
      chunkLength = 3
  ) {
    let result = '\\d(?=(\\d{' + chunkLength + '})+' + (decimalLength>0 ? '\\D' : '$') + ')',
        num = value.toFixed(Math.max(0, ~~decimalLength))
    return currencySign + (decimalDelimiter ? num.replace('.', decimalDelimiter) : num).replace(new RegExp(result, 'g'), '$&' + chunkDelimiter)
  }