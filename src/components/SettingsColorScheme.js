import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {Label} from './Label'
import {T} from './T'

const SunMoon = styled.span`
  cursor: pointer;
  i {
    color: var(--color-background-header);
    +i { color: var(--color-buttonL30); }
  }
  input:checked + i {
    color: var(--color-button);
    +i { color: var(--color-background-header); }
  }
`

export const SettingsColorScheme = () => {

  const [isLight, setLight] = useState('')

  useEffect(()=>{
    const colorScheme = isLight===''&&localStorage.colorScheme||(isLight?'light':'dark')
    // const colorScheme = isLight?'light':'dark'
    document.body.dataset.colorScheme = colorScheme
    localStorage.colorScheme = colorScheme
  }, [isLight])

  useEffect(()=>{
    setLight(localStorage.colorScheme==='light')
  }, [])

  return <Label><T>color scheme</T>
    <SunMoon className="input">
      <input
          type="checkbox"
          className="visually-hidden"
          checked={isLight||false}
          value={isLight}
          onChange={({ target: { value } }) => setLight(value==='false')}
          data-color-scheme
      />
      <i className="icon-sun" />
      <i className="icon-moon" />
    </SunMoon>
  </Label>
}