import React,{useEffect,useMemo,useState} from 'react'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'
import {ORIGIN} from '../config'
import {useNavigate} from 'react-router-dom'
import {Page} from '../components/Page'

const {body} = document

//const StyledAbout = styled(Page)`
const StyledAbout = styled.div`
  dt {
    font-weight: bold;
  }
  dd {
    margin-bottom: 1rem;
  }
`

export const About = () => {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const [handleDocumentClick] = useState(()=>e=>{
    const {target:{origin, href}} = e
    // translate markdown uris to localhost
    if (origin===ORIGIN||origin===location.origin) {
      e.preventDefault()
      navigate(href.replace(origin, ''))
    }
  })
  useEffect(()=>{
    body.addEventListener('click', handleDocumentClick)
    return ()=>body.addEventListener('click', handleDocumentClick)
  })
  return <Page><StyledAbout dangerouslySetInnerHTML={{ __html: t('pageAbout') }} /></Page>
}
