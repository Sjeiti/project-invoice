import React from 'react'
import {useTranslation} from 'react-i18next'

export const T = ({children, lang:lng}) => {
  const {t} = useTranslation()
  const text = t(children, {lng})
  const split = text.split('|')
  return <>{split.length===1?text:split.map((txt, i)=><span key={children+lng+i} className={['media-low', 'media-high'][i]}>{txt}</span>)}</>
}
