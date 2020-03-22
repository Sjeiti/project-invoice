import React, {useState} from 'react'
import styled, {css} from 'styled-components'
import {color} from '../service/css'
import {InputText} from './Input'
import {Textarea} from './Textarea'
import {Select} from './Select'
import {interpolateEvil, readGetters, unique} from '../util'

const {
  colorButton
  , colorBorder
} = color

export const StyledInterpolationInput = styled.div`
  input {
    width: 100%;
  }
  section {
    max-height: 0;
    overflow: hidden;
    transition: max-height 300ms ease;
    &.focussed {
      max-height: 10rem;
    }
  }
  ul {
    padding-left: 0.75rem;
    font-size: 0.8125rem;
    line-height: 1.25rem;
  }
  li {
    position: relative;
    display: inline-block;
    padding-right: 0.5rem;
    overflow: hidden;
    line-height: 1rem;
    color: ${colorButton};
    cursor: hand;
  }
  select {
    position: absolute;
    left: 0;
    top: 0;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
  pre {
    padding: 0.75rem;
    margin: 0 0 1rem;
    font-size: 0.75rem;
    line-height: 1rem;
    color: #888;
    background-color: #F0F0F0;
    box-shadow: 0 0 0 1px ${colorBorder} inset;
    white-space: pre-wrap;
  }
`

export const InterpolationInput = attr => {
  const {context, value, setter} = attr
  const contextKeys = Object.keys(context)

  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(0)

  const InputElement = attr.multiline&&Textarea||InputText

  const [elmInput, setElmInput] = useState(null)

  const [focussed, setFocus] = useState()
  const focusChange = {onFocus:onFocusChange, onBlur:onFocusChange}
  function onFocusChange({type}){
    setFocus(type==='focus')
  }

  function onSelectInput(e){
    const {target: {selectionStart, selectionEnd}} = e
    setStart(selectionStart)
    setEnd(selectionEnd)
  }

  function onChangeSelect(e){
    const {target, target: {name, value: prop}} = e
    const rule = `\${${name}.${prop}}`
    const newPos = start + rule.length
    setter([value.substr(0, start), rule, value.substr(end)].join(''))
    target.value = ''
    elmInput.focus()
    elmInput.setSelectionRange(newPos, newPos) // todo focus and set caret to after addition (not working now)
  }

  // console.log('array',Object.getOwnPropertyNames(Array.prototype)) // todo: remove log
  // console.log('object',Object.getOwnPropertyNames(Object.prototype)) // todo: remove log
  // console.log('function',Object.getOwnPropertyNames(Function.prototype)) // todo: remove log

  return <StyledInterpolationInput className="input">
    <InputElement ref={setElmInput} {...focusChange} onSelect={onSelectInput} {...attr} />
    <section focussed={focussed}
            className={focussed&&'focussed'}>
      <ul>
        {contextKeys.map(key=><li key={key}>{`\${${key}}`}
        <Select
            {...focusChange}

            onChange={onChangeSelect}
            name={key}
            options={(()=>{
              const obj = context[key]
              if (typeof obj === 'function') {
                return []
                // return [{text: '', name: ''}, {text: '()', name: '()'}]
              } else {
                const protoGetters = readGetters(Object.getPrototypeOf(obj))
                return ['', ...Object.keys(obj), ...protoGetters]
                  .filter(key=>key[0]!=='_')
                  .filter(unique)
                  .map(subkey=>({
                    text: subkey
                    , name: subkey
                  }))
              }
            })()} /></li>)}
      </ul>
      <pre>{interpolateEvil(value, context)}</pre>
    </section>
  </StyledInterpolationInput>
}