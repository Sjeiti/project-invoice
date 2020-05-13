import React from 'react'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'
import {CSSTransition, TransitionGroup} from 'react-transition-group'
import {cssVarValue} from '../service/css'
import {Draggable, useDraggable} from './Draggable'

const {breakpointHigh} = cssVarValue

const trHeight = '2.375rem'

export const StyledTableWrapper = styled.div`
  overflow: auto;
  max-width: 100%;
`

export const StyledTable = styled.table`
  width: 100%;
  table-layout: fixed;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  thead { border-bottom: 1px solid var(--color-light-border); }
  tfoot { border-top: 1px solid var(--color-light-border); }
  &.hoverable {
    tr {
      transition: background-color 200ms linear, box-shadow 200ms linear;
    }
    tbody tr {
      box-shadow: 0 1px 0 0 transparent inset, 0 -1px 0 0 transparent inset;
      @media ${breakpointHigh} {
        &:hover {
          background-color: var(--color-background-highlight);
          box-shadow: 0 1px 0 0 var(--color-header) inset, 0 -1px 0 0 var(--color-header) inset;
        }
      }
    }
  }
  thead,tfoot { background-color: var(--color-background-header); }
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
  tr {
    &:nth-child(even) {
      background-color: var(--color-background-off);
    }
    &.dragTo {
      position: relative;
      z-index: 1;
      box-shadow: 0 0.125rem 0 var(--color-buttonL30) inset, 0 -0.125rem 0 var(--color-buttonL30);
    }
    &.dragFrom {
       background-color: var(--color-buttonL30);
       &~.dragTo {
         box-shadow: 0 -0.125rem 0 var(--color-buttonL30) inset, 0 0.125rem 0 var(--color-buttonL30);
       }
       &.dragTo { box-shadow: none; }
    }
  }
  th {
    width: 100%;
    line-height: 180%;
    font-weight: normal;
    text-align: left;
    white-space: nowrap;
  }
  td, th {
    height: ${trHeight};
    white-space: nowrap;
    overflow: hidden;
    padding: 0 0.25rem 0 0;
    margin-bottom: 0;
    &:first-child { padding-left: 0; }
    &:last-child { padding-right: 0; }
    &.empty { height: 0.75rem; }
  }
  input, button, select {
    margin: 0;
  }
  div>input[type=checkbox]+span {
    margin-top: 0.25rem;
    margin-bottom: 0;
  }
`

export const Tr = styled.tr``

export const Table = ({
  cols
  , subjects
  , empty
  , children
  , className
  , draggableRows
  , dragged
  , ...attr
}) => {
  const {length} = cols
  const {t} = useTranslation()
  !Array.isArray(cols)&&(cols = cols.split(' ').map(key=>({key, th:t(key)})))
  const isHoverable = !!subjects?.[0]?.onClick
  const hasTFoot = children&&(Array.isArray(children)&&children.filter(c=>c.type==='tfoot').length||children.type==='tfoot')

  const draggable = useDraggable(subjects)
  const TableRow = draggableRows?Draggable:Tr
  const TableRowAttr = draggableRows?{
    elm: Tr
    , dragSelector: '.drag,.drag *'
    , dragged
    , ...draggable
  }:{}

  return (
    <StyledTableWrapper className={className} {...attr}><StyledTable className={className+(isHoverable&&' hoverable'||'')}>
      <thead>
        <tr>
          {cols.map(({th, key}, index) => (
            <th key={index} className={key}>{th}</th>
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
              {/* CSSTransition props causes warnings onto tr that cannot be caught */}
              <TableRow
                  {...TableRowAttr}
                  onClick={subject.onClick}
                  data-position={index}
              >
                {cols.map(({key}, index) => <td key={index} className={key}><div>{subject[key]}</div></td>)}
              </TableRow>
            </CSSTransition>
          ))) || (
          <tr>
            <td colSpan={length}>{empty||'-'}</td>
          </tr>
        )}
      </TransitionGroup>
      {!hasTFoot&&<tfoot><tr><td className="empty" colSpan={length} /></tr></tfoot>}
      {children}
    </StyledTable></StyledTableWrapper>
  )
}
