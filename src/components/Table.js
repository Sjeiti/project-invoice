import React from 'react'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'

const Tr = styled.tr`
  cursor: pointer;
  &:hover {
    background: #e9f6fb;
    box-shadow: 0 1px 0 0 #80c9ea inset, 0 -1px 0 0 #80c9ea inset;
  }
  th { white-space: nowrap; }
`

export const Table = ({ cols, subjects, empty }) => {
  const {t} = useTranslation()
  !Array.isArray(cols)&&(cols = cols.split(' ').map(key=>({key,th:t(key)})))
  return (
    <table>
      <thead>
        <tr>
          {cols.map(({th}, index) => (
            <th key={index}>{th||''}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(subjects.length &&
          subjects.map((subject, index) => (
            <Tr onClick={subject.onClick} key={index}>
              {cols.map(({key}, index) => <td key={index}>{subject[key]}</td>)}
            </Tr>
          ))) || (
          <tr>
            <td colSpan={cols.length}>{empty||'-'}</td>
          </tr>
        )}
      </tbody>
      <tfoot>
        <tr>
          {cols.map(({tf}, index) => (
            <th key={index}>{tf||''}</th>
          ))}
        </tr>
      </tfoot>
    </table>
  )
}
