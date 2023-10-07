import React from 'react'
import styled from 'styled-components'
import ChangelogHTML from './Changelog.html'
import {withRouter} from '../util/withRouter'

const StyledAbout = styled.div`
  dt {
    font-weight: bold;
  }
  dd {
    margin-bottom: 1rem;
  }
`

export const Changelog = withRouter(({history}) => {
  return <StyledAbout dangerouslySetInnerHTML={{ __html: ChangelogHTML }} />
})
