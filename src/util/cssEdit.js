const id = `cssEdit${Date.now()}`
const element = stringToElement(`<div id="${id}" class="css-edit"></div>`)
const {body} = document

// const br = '<br/>'
// const nbsp = '&nbsp;'

/**
 * Init
 * @param {HTMLElement} rootElement
 */
function init(rootElement){
  rootElement.addEventListener('click',onClickRoot)
  body.appendChild(stringToElement(`<style>
.css-edit {
  position: fixed;
  left: 100px;
  top: 100px;
  padding: 10px;
  background: #EEE;
  border-radius: 2px;
  box-shadow: 10px 20px 16px rgba(0,0,0,0.3), 0 0 0 1px #333;
}
.css-edit menu {
  padding: 0;
}
</style>`))
}

/**
 * Click event handler
 * @param {Event} e
 */
function onClickRoot(e){
  console.log('eiframeClicked',e) // todo: remove log
  const {target,currentTarget} = e
  const tree = [target]
  let child = target
  while ((child = child.parentNode)&&child.parentNode!==currentTarget) tree.push(child)
  console.log('tree',tree) // todo: remove log
  const list = tree.reverse().map(elm=>elm.nodeName.toLowerCase()+Array.from(elm.classList).reduce((a,b)=>(a.push('.',b),a),[]).join(''))//.join('>')
  console.log('list',list) // todo: remove log
  // target
  // const computedStyle = window.getComputedStyle(target)
  // console.log('computedStyle',computedStyle) // todo: remove log
  const css = getCSS(target)
  console.log('css',css) // todo: remove log
  //
  const breadcrumb = list.map(selector=>`<a>${selector}</a>`).join('>')
  // const indentedCss = css.join('').replace(/([{;}])/g,`$1${br+nbsp+nbsp}`).replace(/\s+}/g,'}')
  const keyval = css.map(rule=>rule.replace(/^[^{]+{\s*|\s*}\s*$/g,'').split(/\s*;\s*/g))
      .reduce((a,b)=>(a.push(...b),a),[])
      .reduce((a,b)=>(!a.includes(b)&&b!==''&&a.push(b),a),[])
  console.log('CSS',keyval) // todo: remove log
  const propList = `<ul>${keyval.map(k=>`<li>${k}</li>`).join('')}</ul>`
  //
  element.innerHTML = `<menu>${breadcrumb}</menu><section>${propList}</section>`
  // element.innerHTML = `<menu>${breadcrumb}</menu><code>${indentedCss}</code>`
  body.appendChild(element)

}

/**
 * Turn an HTML string into an element
 * @param {string} str
 * @returns {HTMLElement}
 */
export function stringToElement(str){
    return wrapHTMLString(str.replace(/^\s*|\s*$/g,'')).childNodes[0]
}

/**
 * Set the innerHTML of a cached div
 * Helper method for getFragment and stringToElement
 * @param {string} str
 * @returns {HTMLElement}
 */
function wrapHTMLString(str){
    const div = document.createElement('div')
    div.innerHTML = str
    return div
}

/**
 *
 * @param {HTMLElement} el
 * @returns {Array}
 */
function getCSS(el){
  console.log('css',el) // todo: remove log
  const sheets = document.styleSheets
  const ret = []
  el.matches = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector
  for (let i in sheets){
    const sheet = sheets[i]
    try {
      let rules = sheet.rules || sheet.cssRules
      for (let r in rules){
          const rule = rules[r]
          const selectorText = rule.selectorText
          if (selectorText&&el.matches(selectorText)&&rule.type===CSSRule.STYLE_RULE){
            ret.push(rule.cssText)
          }
      }
    } catch(err){
      // console.log('sheet',err,sheet,sheet['origin-clean']) // todo: remove log
    }
    // console.log('clean',sheet) // todo: remove log
  }
  return ret
}

export default {
  init
}
/*
POSITION

position absolute|relative|fixed|static|inherit
left
top
right
bottom
z-index
float
clear
display block|inline|inline-block|flex|inherit
width
height
min-width
min-height
max-width
max-height
margin
padding
overflow
overflow-x
overflow-y

color
background-color
background
box-shadow
border

font-family
font-size
line-height
font-weight
font-style
text-overflow
text-shadow
text-align
white-space
letter-spacing

opacity

transform
transform-origin

*/