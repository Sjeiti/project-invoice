import React, {useState} from 'react'
import styled, {css} from 'styled-components'

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
      box-shadow: 0 -1px 0 var(--color-border) inset;
    }
  }
`

const Tab = styled.button`
  position: relative;
  flex: 0 0 auto;
  margin: 0 .25rem 0 0;
  padding: .5rem 1rem 0;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  border: 1px solid var(--color-border);
  border-bottom-color: transparent;
  background-color: transparent;
  color: var(--color-foreground);
  &:after {
    content: '';
    position: absolute;
    right: -1px; 
    bottom: -1px;
    display: block;
    width: 0.25rem;
    height: 1px;
    transform: translateX(100%);
    background-color: var(--color-border);
  }
  ${props => props.notCurrent && css`
    color: var(--color-border);
    border-bottom-color: var(--color-border);
    cursor: pointer;
    background: linear-gradient(to top, rgba(0,0,0,0.1), rgba(0,0,0,0));
    &>h3 { overflow: hidden; }
  `}
  &>h3 {
    margin-bottom: 0;
    padding-bottom: 0;
    line-height: 100%;
  }`

export const Tabs = ({ currentIndex=0, children }) => {
  const [selectedChildIndex, setSelectedChildIndex] = useState(currentIndex)
  const tabs = children
      .map(section=>firstChildType(section, 'h3'))
      .filter(n=>n)
      .map(n=>n)
      .map(({props:{children}}, i)=><Tab
          key={i}
          notCurrent={selectedChildIndex!==i}
          onClick={()=>setSelectedChildIndex(i)}
      ><h3>{children}</h3></Tab>)
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