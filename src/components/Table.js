import React from 'react'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'
import {lighten} from 'polished'
import {color, breakpoint} from '../cssService'

const {colorBorder, colorButton, colorTable} = color
const {breakpointHigh} = breakpoint

const StyledTable = styled.table`
  width: 100%;
  border-top: 1px solid ${colorBorder};
  border-bottom: 1px solid ${colorBorder};
  thead { border-bottom: 1px solid #CCC; }
  tfoot { border-top: 1px solid #CCC; }
  &.hoverable {
    tbody tr {
      transition: background-color 200ms linear, box-shadow 200ms linear;
      box-shadow: 0 1px 0 0 transparent inset, 0 -1px 0 0 transparent inset;
      @media ${breakpointHigh} {
        &:hover {
          background-color: ${lighten(0.54,colorButton)};
          box-shadow: 0 1px 0 0 ${lighten(0.3,colorButton)} inset, 0 -1px 0 0 ${lighten(0.3,colorButton)} inset;
        }
      }
    }
  }
  thead,tfoot { background-color: ${colorTable}; }
  &, tbody, tfoot, tr, td, th {
    margin:0;
    padding:0;
    border-collapse:collapse;
    border-spacing:0;
  }
  tr:nth-child(even) {
    background-color: #f8f8f8;
  }
  th {
    line-height: 180%;
    font-weight: normal;
    text-align: left;
    white-space: nowrap;
  }
  td, th {
    height: 38px;
    white-space: nowrap;
    overflow: hidden;
    padding: 0 1px;
    margin-bottom: 0;
    &:first-child { padding-left: 0; }
    &:last-child { padding-right: 0; }
  }
`

export const Table = ({ cols, subjects, empty, children }) => {
  const {length} = cols
  const {t} = useTranslation()
  !Array.isArray(cols)&&(cols = cols.split(' ').map(key=>({key,th:t(key)})))
  const isHoverable = !!subjects?.[0]?.onClick
  // console.log('children', children) // todo: remove log
  //   // if (children) {
  //   //
  //   // }
  const hasTFoot = children&&(Array.isArray(children)&&children.filter(c=>c.type==='tfoot').length||children.type==='tfoot')
  return (
    <StyledTable className={isHoverable&&'hoverable'||''}>
      <thead>
        <tr>
          {cols.map(({th}, index) => (
            <th key={index}>{th}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(subjects.length &&
          subjects.map((subject, index) => (
            <tr onClick={subject.onClick} key={index}>
              {cols.map(({key}, index) => <td key={index}>{subject[key]}</td>)}
            </tr>
          ))) || (
          <tr>
            <td colSpan={length}>{empty||'-'}</td>
          </tr>
        )}
      </tbody>
      {!hasTFoot&&<tfoot><tr><td colSpan={length} /></tr></tfoot>}
      {children}
    </StyledTable>
  )
}
