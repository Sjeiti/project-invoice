import {STORE_SESSION, STORE_SAVEABLE, STORE_SAVEABLEFUNCTIONS} from '../model/session/actions'

export const APP_NAME = 'Project Invoice'
export const ORIGIN = 'https://projectinvoice.nl'
export const VERSION = process.env.VERSION
export const MODE_DEVELOPMENT = process.env.NODE_ENV==='development'
export const STORAGE_NAME = 'data'
export const CLOUD_NAME = 'nl.projectinvoice.data.test'
export const NOOP_ACTIONS = [STORE_SESSION, STORE_SAVEABLE, STORE_SAVEABLEFUNCTIONS]
export const TODAY = new Date()
export const PEER_HOSTS = ['0.peerjs.com', 'peerjs.herokuapp.com', 'peerjs-server.herokuapp.com']
export const PEER_STUN = 'stun:stun3.l.google.com:19302'
