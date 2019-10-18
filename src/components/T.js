import React from 'react'
import {useTranslation} from 'react-i18next'

export const T = ({children, lang:lng}) => {
  const {t} = useTranslation()
  return <>{t(children,{lng})}</>
}
