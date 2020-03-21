import React, {useState} from 'react'
import styled from 'styled-components'
import {color} from '../service/css'
import {InputText} from './Input'
import {Textarea} from './Textarea'
import {Select} from './Select'
import {interpolateEvil} from '../util'

const {
  colorButton
  , colorBorder
} = color

export const StyledInterpolationInput = styled.div`
  input {
    width: 100%;
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

  function onSelectInput(e){
    const {target: {selectionStart, selectionEnd}} = e
    setStart(selectionStart)
    setEnd(selectionEnd)
  }

  function onChangeSelect(e){
    const {target: {name, value: prop}} = e
    setter([value.substr(0, start), `\${${name}.${prop}}`, value.substr(end)].join(''))
    // todo focus and set caret to after addition
  }

  return <StyledInterpolationInput className="input">
    <InputElement onSelect={onSelectInput} {...attr} />
    <ul>
      {contextKeys.map(key=><li>{`\${${key}}`}
      <Select
          onChange={onChangeSelect}
          name={key}
          key={key}
          options={Object.keys(context[key]).map(subkey=>({
            text: subkey
            , name: subkey
          // todo filter options for underscore prefix (private) and enumerate getters
      }))} /></li>)}
    </ul>
    <pre>{interpolateEvil(value, context)}</pre>
  </StyledInterpolationInput>
}