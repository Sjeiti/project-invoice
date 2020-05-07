import React from 'react'
import styled from 'styled-components'
import {Label} from './Label'
import {T} from './T'

const SunMoon = styled.span`
  cursor: pointer;
  i {
    color: var(--color-button);
    +i { color: var(--color-background-header); }
  }
  input:checked + i {
    color: var(--color-background-header);
    +i { color: var(--color-buttonL30); }
  }
`

export const SettingsColorScheme = ({
    config: {colorScheme}
    , storeConfigWith
  }) => <Label><T>color scheme</T>
    <SunMoon className="input">
      <input
          type="checkbox"
          className="visually-hidden"
          value={colorScheme==='light'}
          onChange={({ target: { checked } })=>storeConfigWith({colorScheme: checked?'dark':'light'})}
      />
      <i className="icon-sun" />
      <i className="icon-moon" />
    </SunMoon>
  </Label>