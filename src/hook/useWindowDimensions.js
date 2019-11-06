import { useState, useEffect } from 'react'

function getWindowDimensions() {
  const { innerWidth, innerHeight } = window
  return { width:innerWidth, height:innerHeight }
}

export function useWindowDimensions() {
  const [dim, setDimensions] = useState(getWindowDimensions())

  useEffect(() => {
    function handleResize() {
      setDimensions(getWindowDimensions())
    }
    // const onResize = ()=>

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return dim
}