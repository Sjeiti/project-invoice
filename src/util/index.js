export const nextTick = window.requestAnimationFrame

/**
 * Promise all watch several properties
 * @param {object} vm
 * @param {string[]} props
 * @returns {Promise}
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
    decimalDelimiter = '<span class="decimal" char=",">.</span>',
    chunkLength = 3
){
  let result = '\\d(?=(\\d{' + chunkLength + '})+' + (decimalLength>0 ? '\\D' : '$') + ')'
      ,num = value.toFixed(Math.max(0,~~decimalLength))
  return currencySign + (decimalDelimiter ? num.replace('.',decimalDelimiter) : num).replace(new RegExp(result,'g'),'$&' + chunkDelimiter)
}

/**
 * Object assign but only when key does not yet exist
 * @param {object} obj
 * @param {object[]} adds
 * @returns {object}
 */
export function weakAssign(obj,...adds){
  adds.forEach(add=>{
    for (let key in add){
      if (!obj.hasOwnProperty(key)){
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
  return new Promise((resolve/*,reject*/)=>{
    const script = document.createElement('script')
    document.body.appendChild(script)
    script.setAttribute('src',src)
    script.addEventListener('load',resolve)
  })
}

/**
 * JSON stringify wrapped in try catch
 * @param {object} obj
 * @returns {string}
 */
export function tryStringify(obj){
  let stringData
  try {
    stringData = JSON.stringify(obj)
  } catch(err){
    console.warn('err',err)
  }
  return stringData
}

/**
 * JSON parse wrapped in try catch
 * @param {string} str
 * @returns {object}
 */
export function tryParse(str){
  let obj
  try {
    obj = JSON.parse(str)
  } catch(err){
    console.warn('err',err)
  }
  return obj
}

const scrollbarSizeKey = 'scrollbarSize'

/**
 * Get the scrollbar size from localStorage or do a DOM calculation over two ticks
 * @returns {Promise}
 */
export function getScrollbarSize(){
  return new Promise(resolve => {
    let scrollbarSize = localStorage.getItem(scrollbarSizeKey)
    if (!scrollbarSize){
      scrollbarSize = {width: 0,height: 0}
      const element = document.createElement('div')
      const elementStyle = element.style
      Object.assign(elementStyle,{
        width: '100px',height: '100px'
      })
      const child = document.createElement('div')
      Object.assign(child.style,{
        width: '100%',height: '100%'
      })
      element.appendChild(child)
      document.body.appendChild(element)
      setTimeout(() => {
        scrollbarSize.width = child.offsetWidth
        scrollbarSize.height = child.offsetHeight
        elementStyle.overflow = 'scroll'
        setTimeout(() => {
          scrollbarSize.width -= child.offsetWidth
          scrollbarSize.height -= child.offsetHeight
          localStorage.setItem(scrollbarSizeKey,JSON.stringify(scrollbarSize))
          resolve(scrollbarSize)
        })
      })
    } else {
      resolve(JSON.parse(scrollbarSize))
    }
  })
}

const {body} = document
const {classList} = body
const scrollLock = 'scroll-lock'
getScrollbarSize().then(result => {
  const sheet = document.styleSheets[0]
  sheet.insertRule(`.${scrollLock} {
    overflow: hidden;
    padding-right: ${result.width}px;
  }`,0)
  sheet.insertRule(`.${scrollLock} #app>header {
    max-width: calc(100vw - ${result.width}px);
  }`,0)
})
export const scroll = {
  lock: DOMTokenList.prototype.add.bind(classList,scrollLock)
  ,unlock: DOMTokenList.prototype.remove.bind(classList,scrollLock)
}