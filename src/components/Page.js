import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {getSession} from '../model/session/selectors'
import {storeSaveable} from '../model/session/actions'

export const Page = connect(
    state => ({session: getSession(state)})
    , {storeSaveable}
)(props => {
  const {children, saveable=false, storeSaveable, session: {saveable: saveable_}} = props
  useEffect(()=>{
    saveable!==saveable_&&storeSaveable(saveable)
  }, [storeSaveable, saveable, saveable_])
  return <>{children}</>
})
