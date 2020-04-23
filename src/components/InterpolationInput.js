import React, {useState} from 'react'
import classNames from 'classnames'
import styled from 'styled-components'
import marked from 'marked'
import {color} from '../service/css'
import {InputText} from './Input'
import {Textarea} from './Textarea'
import {Select} from './Select'
import {interpolateEvil, readGetters, unique} from '../util'
import ChangelogHTML from '../views/Changelog.html'

const {
  colorButton
  , colorBorder
  , colorShade
} = color

export const StyledInterpolationInput = styled.div`
  input, textarea {
    width: 100%;
  }
  &.focussed { input, textarea {
    box-shadow: 0 0 0 1px ${colorButton} inset,  0 4px 16px ${colorShade} inset;
  }}
  section {
    max-height: 0;
    overflow: hidden;
    transition: max-height 300ms ease;
  }
  &.focussed section {
    max-height: 10rem;
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
`

const Result = styled.div`
  margin: 0 0 1rem;
  padding: 0.75rem;
  font-size: 0.75rem;
  line-height: 1rem;
  color: #888;
  background-color: #F0F0F0;
  box-shadow: 0 0 0 1px ${colorBorder} inset;
  //white-space: pre-wrap;
  p:last-child { margin-bottom: 0; }
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

  return <StyledInterpolationInput className={classNames('input', {focussed})}>
    {focussed
      &&<InputElement ref={setElmInput} {...focusChange} onSelect={onSelectInput} {...attr} />
      ||<InputText ref={setElmInput} {...focusChange} onSelect={onSelectInput} {...attr} />
    }
    <section className={focussed&&'focussed'}>
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
      {/*<pre>{marked(interpolateEvil(value, context))}</pre>*/}
      <Result dangerouslySetInnerHTML={{ __html: marked(interpolateEvil(value, context)) }} />
    </section>
  </StyledInterpolationInput>
}