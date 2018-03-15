/**
 * Promise all watch several properties
 * @param {object} vm
 * @param {string[]} props
 */
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

/**
 * Object assign but only when key does not yet exist
 * @param {object} obj
 * @param {object[]} adds
 */
export function weakAssign(obj,...adds){
  adds.forEach(add=>{
    for (let key in add) {
      if (!obj.hasOwnProperty(key)) {
        obj[key] = add[key]
      }
    }
  })
  return obj
}

/**
 * Returns the string with the first character to uppercase
 * @param {string} s
 * @returns {string}
 */
export function capitalise(s){
	return s[0].toUpperCase()+s.substr(1)
}

/**
 * Dynamically load a javascript file
 * @param {string} src
 * @returns {Promise}
 */
export function loadScript(src){
  return new Promise((resolve,reject)=>{
    const script = document.createElement('script')
    document.body.appendChild(script)
    script.setAttribute('src',src)
    script.addEventListener('load',resolve)
  })
}