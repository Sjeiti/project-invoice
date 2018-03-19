import Vue from 'vue'
import {resize} from '../util/signal'

/**
 * Attribute modifier to create middle ellipsis
 * When the attribute value is left blank the ellipsis will be in the middle
 * When positive the attribute value will be used as a percentage
 * When negative the attribute value will be used as character index counted from the end
 * @module ellipsis
 * @example
 *   <div data-middle-ellipsis>A Javascript solution to middle ellipsis</div>
 *   <div data-middle-ellipsis="20">A Javascript solution to middle ellipsis</div>
 *   <div data-middle-ellipsis="-3">A Javascript solution to middle ellipsis</div>
 */

const clamp = (val,min=Number.NEGATIVE_INFINITY,max=Number.POSITIVE_INFINITY)=>Math.max(min,Math.min(max,val))
const ellipsis = '…'
const map = new Map()
const list = []

Vue.directive('ellipsis',{
  bind(elm,binding){
    elm.classList.add('middle-ellipsis')
    testMiddleEllipsis(elm,binding)
    list.push(elm)
  }
  ,inserted: testMiddleEllipsis
  ,unbind(elm){
    const index = list.indexOf(elm)
    index!==-1&&list.splice(index,1)
    map.delete(elm)
  }
})

resize.add(()=>list.forEach(testMiddleEllipsis))

/**
 * Test middle ellipsis for element
 * @param {HTMLElement} elm
 * @param {object} [_binding]
 */
function testMiddleEllipsis(elm,_binding){
  // do not recalculate variables a second time
  const mapped = map.get(elm)
  let {text,textLength,from,multiplier,font,textWidth,elementWidth,binding} = mapped||{}
  // first time
  if (!mapped){
    binding = _binding
    text = elm.getAttribute('data-text')||elm.textContent
    textLength = text.length
    from = parseFloat(binding.value)||50 // parseFloat(elm.getAttribute(attributeName))||50
    multiplier = from>0&&from/100
    const computedStyle = window.getComputedStyle(elm,null)
    font = `${computedStyle.getPropertyValue('font-weight')} ${computedStyle.getPropertyValue('font-size')} ${computedStyle.getPropertyValue('font-family')}`
    textWidth = getTextWidth(text,font)
    elementWidth = elm.offsetWidth
    map.set(elm,{text,textLength,from,multiplier,font,textWidth,elementWidth,binding})
  }
  //
  const {offsetWidth} = elm
  const widthChanged = !mapped||elementWidth!==offsetWidth
  mapped&&widthChanged&&(mapped.elementWidth=elementWidth=offsetWidth)
  //
  if (widthChanged){
    if (textWidth>elementWidth){
      elm.setAttribute('title',text)
      let smallerText = text
      let smallerWidth = elementWidth
      while(smallerText.length>3){
        let smallerTextLength = smallerText.length
        const half = multiplier&&
            clamp(multiplier*smallerTextLength<<0,1,smallerTextLength-2)||
            Math.max(smallerTextLength+from-1,1)
        const half1 = smallerText.substr(0,half).replace(/\s*$/,'')
        const half2 = smallerText.substr(half+1).replace(/^\s*/,'')
        smallerText = half1+half2
        smallerWidth = getTextWidth(smallerText+ellipsis,font)
        if (smallerWidth<elementWidth){
          elm.textContent = half1+ellipsis+half2
          break
        }
      }
    } else {
      elm.textContent = text
      elm.removeAttribute('title')
    }
  }
}

/**
 * Get the text width
 * @param {string} text
 * @param {string} font
 * @returns {number}
 */
function getTextWidth(text,font){
  let context = getTextWidth.context
  if (!context){
    const canvas = document.createElement('canvas')
    context = getTextWidth.context = canvas.getContext('2d')
  }
  context.font = font
  const metrics = context.measureText(text)
  return metrics.width
}