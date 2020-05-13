import React, {useState} from 'react'
import styled from 'styled-components'
import {Button} from './Button'
import {useTranslation} from 'react-i18next'
import {T} from './T'
import {InputText} from './Input'
import {Dialog} from './Dialog'

const StyledDialog = styled(Dialog)`
  input[type="text"] {
    width: 100%;
    margin-right: 2px;
  }
`

export const SettingsEncryption = ({config, session, storeSession, storeConfigWith}) => {

  const {t} = useTranslation()

  const [encryptionDialogOpen, setEncryptionDialog] = useState(false)
  const [encryptionKey, setEncryptionKey] = useState('')
  const encryptAndReload = ()=>{
    if (encryptionKey) {
      storeSession({...session, encryptionKey})
      storeConfigWith({
        encryption: true
      })
      setEncryptionDialog(false)
      window.location.reload()
    } else {
      // warn about invalid password
    }
  }

  return <>
      <Button onClick={()=>setEncryptionDialog(true)} disabled={config.encryption}><T>enable</T></Button>
      <Button onClick={()=>storeConfigWith({encryption:false})} disabled={!config.encryption}><T>disable</T></Button>
      <StyledDialog
          show={encryptionDialogOpen}
          title={t('passwordSet')}
          close={()=>setEncryptionDialog(false)}
          submit={()=>encryptAndReload()}
      >
        <T>passwordResetReload</T>
        <InputText value={encryptionKey} setter={setEncryptionKey} />
      </StyledDialog>
    </>
}