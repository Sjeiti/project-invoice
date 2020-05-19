import React, {useState} from 'react'
import {Button} from './Button'
import {T} from './T'
import {Select} from './Select'
import {ID as driveID} from '../service/cloudDrive'

export const SettingsCloud = ({config, storeConfigWith}) => {

  const [cloudProvider, setCloudProvider] = useState(config.cloudSelected)
  const cloudProviders = [
    {value: driveID, text:'Google Drive'}
    , {value:'', text:'-other-'}
  ]
  const cloudAuthorise = ()=>{
    storeConfigWith({cloudSelected: cloudProvider})
  }
  const cloudRevoke = ()=>{
    storeConfigWith({cloudSelected: ''})
  }

  return <>
    <Select value={cloudProvider} setter={setCloudProvider} disabled={config.cloudSelected} options={cloudProviders} data-cy="cloudSelect" />
    <Button onClick={cloudAuthorise} disabled={!!config.cloudSelected} data-cy="cloudAuthorise"><T>authorise</T></Button>
    <Button onClick={cloudRevoke} disabled={!config.cloudSelected} data-cy="cloudRevoke"><T>revoke</T></Button>
  </>
}