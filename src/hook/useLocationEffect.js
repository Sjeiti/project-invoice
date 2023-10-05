import React,{useEffect,useState} from 'react'
import {useLocation} from 'react-router-dom'
// import {isEqual} from 'lodash'

export function useLocationEffect(callback) {
  const location = useLocation()

  useEffect(() => {
    // console.log('useLocationEffect', location) // todo: remove log
    callback(location)
  }, [location, callback])

  // const {key, ...stripped_} = location
  // const [stripped, setStripped] = useState(stripped_)
  //
  // useEffect(() => {
  //   if (!isEqual(stripped, stripped_)) {
  //     setStripped(stripped_)
  //     console.log('useLocationEffect', stripped_, location) // todo: remove log
  //     callback(location)
  //   } else {
  //     console.log('useLocationEffect SAME') // todo: remove log
  //   }
  // }, [location, callback])
}
