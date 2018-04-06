import signals from 'signals'
export const signal = () => new signals.Signal()

export const notify = signal()
export const storageInitialised = signal()
export const sync = signal()
export const modelReplaced = signal()
export const projectPaid = signal(/**{project}*/)
export const message = signal()

export const resize = signal()
let timeoutId
window.addEventListener('resize',()=>{
  clearTimeout(timeoutId)
  timeoutId = setTimeout(()=>resize.dispatch(),200)
},{ capture: true,passive: true })