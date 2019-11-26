import React from 'react'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'
import {CSSTransition, TransitionGroup} from 'react-transition-group'
import {lighten} from 'polished'
import {color, breakpoint} from '../service/css'

const {colorBorder, colorButton, colorTable} = color
const {breakpointHigh} = breakpoint

const trHeight = '2.375rem'

const StyledTable = styled.table`
  width: 100%;
  border-top: 1px solid ${colorBorder};
  border-bottom: 1px solid ${colorBorder};
  thead { border-bottom: 1px solid #CCC; }
  tfoot { border-top: 1px solid #CCC; }
  &.hoverable {
    tr {
      transition: background-color 200ms linear, box-shadow 200ms linear;
    }
    tbody tr {
      box-shadow: 0 1px 0 0 transparent inset, 0 -1px 0 0 transparent inset;
      @media ${breakpointHigh} {
        &:hover {
          background-color: ${lighten(0.54, colorButton)};
          box-shadow: 0 1px 0 0 ${lighten(0.3, colorButton)} inset, 0 -1px 0 0 ${lighten(0.3, colorButton)} inset;
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
  tr {
    &.animate {
      &-enter-active,
      &-exit-active {
        &, &>td>div {
          transition: all 200ms linear;
        }
      }
      &-exit, &-enter-active {
        opacity: 1;
        transform: scaleY(1);
        td>div { height: ${trHeight}; }
      }
      &-enter, &-exit-active {
        opacity: 0;
        transform: scaleY(0.1);
        td>div { height: 0; }
      }
    }
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
    height: ${trHeight};
    //line-height: 2.25rem;
    white-space: nowrap;
    overflow: hidden;
    padding: 0 0.25rem 0 0;
    margin-bottom: 0;
    &:first-child { padding-left: 0; }
    &:last-child { padding-right: 0; }
  }
  input, button, select {
    margin: 0;
  }
  div>input[type=checkbox]+span {
    margin-top: 0.25rem;
    margin-bottom: 0;
  }
`

export const Table = ({ cols, subjects, empty, children, className }) => {
  const {length} = cols
  const {t} = useTranslation()
  !Array.isArray(cols)&&(cols = cols.split(' ').map(key=>({key, th:t(key)})))
  const isHoverable = !!subjects?.[0]?.onClick
  const hasTFoot = children&&(Array.isArray(children)&&children.filter(c=>c.type==='tfoot').length||children.type==='tfoot')
  return (
    <StyledTable className={className+(isHoverable&&' hoverable'||'')}>
      <thead>
        <tr>
          {cols.map(({th}, index) => (
            <th key={index}>{th}</th>
          ))}
        </tr>
      </thead>
      <TransitionGroup component="tbody">
        {(subjects.length &&
          subjects.map((subject, index) => (
            <CSSTransition
              timeout={200}
              classNames="animate"
              key={subject.hasOwnProperty('key')?subject.key:index}
            >
              <tr onClick={subject.onClick}>
                {cols.map(({key}, index) => <td key={index}><div>{subject[key]}</div></td>)}
              </tr>
            </CSSTransition>
          ))) || (
          <tr>
            <td colSpan={length}>{empty||'-'}</td>
          </tr>
        )}
      </TransitionGroup>
      {!hasTFoot&&<tfoot><tr><td colSpan={length} /></tr></tfoot>}
      {children}
    </StyledTable>
  )
}
