import React from 'react'
import styled from 'styled-components'

const Tr = styled.tr`
  cursor: pointer;
  &:hover {
    background: #e9f6fb;
    box-shadow: 0 1px 0 0 #80c9ea inset, 0 -1px 0 0 #80c9ea inset;
  }
`

export const Table = ({ cols, projects: subjects, empty }) => {
  const colNames = cols.split(/\s/g)
  return (
    <table>
      <thead>
        <tr>
          {colNames.map((name, index) => (
            <th key={index}>{name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {(subjects.length &&
          subjects.map((subject,index) => (
            <Tr onClick={subject.onClick} key={index}>
              {colNames.map((name, index) => (
                <td key={index}>{subject[name]}</td>
              ))}
            </Tr>
          ))) || (
          <tr>
            <td colSpan={colNames.length}>{empty}</td>
          </tr>
        )}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={colNames.length}></td>
        </tr>
      </tfoot>
    </table>
  )
}
