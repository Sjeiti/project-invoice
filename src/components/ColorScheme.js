import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {getConfig} from '../model/config/selectors'

export const ColorScheme = connect(
    state => ({ config: getConfig(state) })
  )(({ config: {colorScheme} }) => {
    useEffect(()=>{
      document.body.dataset.colorScheme = colorScheme
    }, [colorScheme])
    return <></>
})
