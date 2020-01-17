import React, {useState} from 'react'
import styled from 'styled-components'

const notCurrentClassname = 'notcurrent'

const StyledTabs = styled.div`
  margin-top: 2rem;
  &>nav:first-child {
    display: flex;
    vertical-align: bottom;
    margin-bottom: 0.5rem;
    &:after {
      content: '';
      flex: 1 1 auto;
      display: block;
      box-shadow: 0 -1px 0 #bbb inset;
    }
    &>button {
      flex: 0 0 auto;
      margin: 0 .25rem 0 0;
      padding: .5rem 1rem 0;
      border-top-left-radius: 0.5rem;
      border-top-right-radius: 0.5rem;
      border: 1px solid #bbb;
      border-bottom-color: transparent;
      background-color: transparent;
      &.${notCurrentClassname} {
        color: #888;
        border-bottom-color: #bbb;
        cursor: pointer;
      }
      &>h3 {
        margin-bottom: 0;
        padding-bottom: 0;
      }
    }
  }
`

export const Tabs = ({ currentIndex=0, children }) => {
  const [selectedChildIndex, setSelectedChildIndex] = useState(currentIndex)
  const tabs = children
      .map(section=>firstChildType(section, 'h3'))
      .filter(n=>n)
      .map(({props:{children}}, i)=><button className={selectedChildIndex!==i&&notCurrentClassname} onClick={setSelectedChildIndex.bind(null,i)}><h3>{children}</h3></button>)
  ;
  const selectedChild = children[selectedChildIndex]
  return <StyledTabs>
    <nav>{tabs}</nav>
    {selectedChild}
  </StyledTabs>
}

/**
 * Find children by type in react child,
 * where children can be Array, Object and string!
 * @param {Object} elm
 * @param {string} type
 * @return {Object}
 */
function firstChildType(elm, type){
  let childFound
  const {props:{children}} = elm
  const childList = children.forEach&&children||[children]
  childList.forEach(child=>{
    if (!childFound) {
      if (child.type===type) {
        childFound = child
      } else if (typeof child !== 'string') {
        childFound = firstChildType(child, type)
      }
    }
  })
  return childFound
}