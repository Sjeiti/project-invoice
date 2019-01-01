/* eslint-disable no-console */

import { register } from 'register-service-worker'
import {signal} from './signal'

export const appReady = signal()
export const appCached = signal()
export const appUpdated = signal()
export const appOffline = signal()
export const appError = signal()
export const appMessage = signal()

/** {boolean} */
const hasServiceWorker = 'serviceWorker' in navigator
/** {boolean} */
const hasPushManager = 'PushManager' in window
/** {boolean} */
const isProduction = process.env.NODE_ENV==='production'

const serviceWorkerName = 'swNotification.js'

if (hasServiceWorker){
  const hooks = {}
  hasPushManager&&(hooks.message = appMessage.dispatch.bind(appMessage))
  isProduction&&Object.assign(hooks,{
    ready: appReady.dispatch.bind(appReady) // App is being served from cache by a service worker
    ,cached: appCached.dispatch.bind(appCached) // Content has been cached for offline use
    ,updated: appUpdated.dispatch.bind(appUpdated) // New content is available; please refresh
    ,offline: appOffline.dispatch.bind(appOffline) // No internet connection found. App is running in offline mode.
    ,error: appError.dispatch.bind(appError) // Error during service worker registration
  })
  if (!isProduction){
    for (let name in hooks){
      const hook = hooks[name]
      hooks[name] = function(){
        console.log('ServiceWorker::',name,arguments)
        hook.apply(null,arguments)
      }
    }
  }
  register(process.env.BASE_URL+serviceWorkerName,hooks)
}
