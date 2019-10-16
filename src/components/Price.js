import React from 'react'
import styled from 'styled-components'

const PriceDiv = styled.div`
  position: relative;
  max-width: 6rem;
  padding-left: 20px;
  white-space: nowrap;
  text-align: right;
  font-family: monospace;
  text-align: right;
  &:before {
    content: attr(data-symbol);
    position: absolute;
    top: 0;
    left: 0;
  }
`

const DividerCent = styled.span`
  &:before {
    display: inline-block;
    content: '${props => props.separator || '.'}';
  }
`

const DividerFloat = styled.span`
  display: inline-block;
  position: relative;
  transform: translateX(-9999rem);
  &:before {
    position: absolute;
    top: 0;
    left: 0;
    content: '${props => props.separator || ','}';
    transform: translateX(9999rem);
  }
`

const currency = (amount, separator) => {
  let dotValue = parseFloat(amount || 0).toFixed(2)
  const [before, after] = dotValue.split(/\./)
  const divide3 = /.{1,3}(?=(.{3})+(?!.))|.{1,3}$/g
  const thousand = (separator === '.' && ',') || '.'
  return (
    <>
      {before.match(divide3).map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <DividerCent separator={thousand} />}
          {item}
        </React.Fragment>
      ))}
      <DividerFloat separator={separator}>.</DividerFloat>
      {after}
    </>
  )
}

export const Price = ({ amount, symbol = '€', separator = ',', ...attr }) => (
  <PriceDiv data-symbol={symbol} {...attr}>{currency(amount, separator)}</PriceDiv>
)
