import { useState, useEffect } from 'react'

function getWindowScroll() {
  const { scrollX, scrollY } = window
  return { scrollX, scrollY }
}

export function useWindowScroll() {
  const [scrollTop, setScrollTop] = useState(getWindowScroll())
  useEffect(() => {
    function handleScroll() {
      setScrollTop(getWindowScroll())
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return scrollTop
}