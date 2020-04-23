import {Prompt} from 'react-router-dom'
import React from 'react'
import {interpolate} from '../util'
import {useTranslation} from 'react-i18next'

// when={isDirty}
export const DirtyPrompt = attr => {
  const {t} = useTranslation()
  return <Prompt
      message={location => interpolate(t('routeChangeDirty'), {location})}
      {...attr}
  />
}