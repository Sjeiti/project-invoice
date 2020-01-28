import {STORE_SESSION} from '../model/session/actions'

export const VERSION = process.env.VERSION
export const MODE_DEVELOPMENT = process.env.NODE_ENV==='development'
export const STORAGE_NAME = 'pi'
export const CLOUD_NAME = 'nl.projectinvoice.data.test'
export const NOOP_ACTIONS = [STORE_SESSION]
