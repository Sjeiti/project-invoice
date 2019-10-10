import React, { useState } from 'react'
import styled from 'styled-components'

const InputElement = styled.input`
  display: block;
  // margin: 0;
  // padding: 0;
`

export const InputText = attr => <InputElement {...attr} type="text" />

export const InputNumber = attr => <InputElement {...attr} type="number" />

export const InputBoolean = attr => <InputElement {...attr} type="checkbox" />

export const InputDate = attr => <InputElement {...attr} type="date" />

export const Input = ({ value, onChange, setter }) => {
  const [Element] = useState(() => {
    const isBoolean = value === true || value === false
    const isString = typeof value === 'string'
    const isNumber = typeof value === 'number'
    const isDate =
      (isString &&
        value.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/) &&
        true) ||
      false
    // console.log('asdf', {value, isBoolean, isString, isNumber}) // todo: remove log
    return (
      (isBoolean && InputBoolean) ||
      (isNumber && InputNumber) ||
      (isDate && InputDate) ||
      (isString && InputText) ||
      InputElement
    )
  })
  return <Element value={value} onChange={onChange || setter && (({ target: { value } }) => setter(value)) || (() => {})} />
}
