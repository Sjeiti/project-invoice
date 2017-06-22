import {enableProdMode} from '@angular/core'
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic'

import {AppModule} from './app/app.module'
import {environment} from './environments/environment'

if (environment.production) {
  enableProdMode()
}

platformBrowserDynamic().bootstrapModule(AppModule)


applicationCache&&applicationCache.addEventListener('updateready', handleApplicationCacheUpdateReady, false)

/**
 * Check application cache for new version and reload if so.
 */
function handleApplicationCacheUpdateReady(){ // see:http://www.html5rocks.com/en/tutorials/appcache/beginner/
  applicationCache.status===applicationCache.UPDATEREADY&&window.location.reload()
}

// /**
//  * Get the application cache status
//  * @returns {string}
//  */
// function getApplicationCacheStatus(){
//   const appCache = window.applicationCache,
//     stati = ['uncached', 'idle', 'checking', 'downloading', 'updateready', 'OBSOLETE', ''] // todo; fill in
//   return stati[appCache.status]
// }