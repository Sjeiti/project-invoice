// import { Dispatcher } from 'flux'
import { Signal } from 'signals'

// export const saveable = new Dispatcher()
// saveable.handleViewAction = function(action) {
//   this.dispatch({
//     source: 'VIEW_ACTION',
//     action
//   })
// }

export const saveable = new Signal()
