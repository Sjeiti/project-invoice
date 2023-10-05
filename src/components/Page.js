import React,{useEffect,useMemo} from 'react'
import {connect} from 'react-redux'
import {getSession} from '../model/session/selectors'
import {storeSession} from '../model/session/actions'

export const Page = connect(
    state => ({session: getSession(state)}, state)
    , {storeSession}
)(props => {
  const {children, saveable=false, storeSession} = props
  useEffect(()=>{
    console.log('storingSESSION attempt', saveable) // todo: remove log
    storeSession({saveable})
  }, [storeSession])
  return <>{children}</>
})
