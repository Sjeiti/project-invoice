import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'
import {withRouter} from 'react-router-dom'
import {ORIGIN} from '../config'

const {body} = document

const StyledAbout = styled.div`
  dt {
    font-weight: bold;
  }
  dd {
    margin-bottom: 1rem;
  }
`

export const About = withRouter(({history}) => {
  const {t} = useTranslation()
  const [handleDocumentClick] = useState(()=>e=>{
      const {target:{origin, href}} = e
      if (origin===ORIGIN||origin===location.origin) {
        e.preventDefault()
        history.push(href.replace(origin, ''))
      }
  })
  useEffect(()=>{
    body.addEventListener('click', handleDocumentClick)
    return ()=>body.addEventListener('click', handleDocumentClick)
  })
  return <StyledAbout dangerouslySetInnerHTML={{ __html: t('pageAbout') }} />
})
