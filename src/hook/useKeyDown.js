import { useState, useEffect } from 'react'

const keydown = 'keydown'
const keyup = 'keyup'

export function useKeyDown() {
  const [keys, setKeys] = useState({})
  useEffect(() => {
    const onKey = e=>{
      const {key, type} = e
      const keyz = {...keys}
      keyz[key] = type===keydown
      setKeys(keyz)
    }
    window.addEventListener(keydown, onKey)
    window.addEventListener(keyup, onKey)
    return () => {
      window.removeEventListener(keydown, onKey)
      window.removeEventListener(keyup, onKey)
    }
  }, [keys])
  return keys
}