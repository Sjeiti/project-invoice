import React, {useState} from 'react'
import {T} from './T'
import {Dialog} from './Dialog'
import {InputText} from './Input'
import {STORAGE_NAME} from '../config'
import {isEncrypted} from '../service/encryption'
import {connect} from 'react-redux'
import {getStorage} from '../service/localStorageEncrypted'
import {restoreState} from '../model/rootActions'
import styled from 'styled-components'

const StyledDialog = styled(Dialog)`
  input[type="text"] {
    width: 99%;
    margin: 0.5rem 0;
    + p {
      color: red;
    }
  }
  & + svg {
    background-image: linear-gradient(315deg, #0cbaba 0%, #3f5267 100%);
    z-index: 98;
  }
`

export const DecryptionDialog = connect(
    () => ({}),
    { restoreState }
  )(({ restoreState }) => {

  const stringData = localStorage.getItem(STORAGE_NAME)
  const dataIsEncrypted = isEncrypted(stringData)

  const [encryptionDialogOpen, setEncryptionDialog] = useState(dataIsEncrypted)
  const [invalid, setInvalid] = useState(false)
  const [encryptionKey, setEncryptionKey] = useState('')
  const decryptAndSetStore = ()=>{
    if (encryptionKey) {
      const decryptedState = getStorage(STORAGE_NAME, encryptionKey)
      if (decryptedState) {
        decryptedState.session = decryptedState.session||{}
        decryptedState.session.encryptionKey = encryptionKey

        restoreState(decryptedState)
        setEncryptionDialog(false)
      } else {
        setInvalid(true)
      }
    } else {
        setInvalid(true)
    }
  }

  return (
    <>
      <StyledDialog
          show={encryptionDialogOpen}
          title="Project Invoice"
          close={()=>setEncryptionDialog(false)}
          submit={()=>decryptAndSetStore()}
      >
        <p><T>passwordRequiredFor</T></p>
        <InputText value={encryptionKey} setter={setEncryptionKey} />
        {invalid&&<p><T>passwordInvalidMessage</T></p>}
      </StyledDialog>
    </>
  )
})
