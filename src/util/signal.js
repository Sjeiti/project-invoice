import signals, {Signal} from 'signals'
export const signal = () => new signals.Signal()

export const notify = signal()
// export const alert = signal()

// export const storageInitialised = signal()
export const sync = signal()
// export const modelReplaced = signal()
// export const projectPaid = signal(/**{project}*/)

// export const saveable = new Signal()

export const clouding = new Signal()

export const animate = new Signal()
function animating(){
	animate.dispatch()
  requestAnimationFrame(animating)
}
animating()

// export const resize = signal()
// const win = window
// const doc = document
// const html = doc.documentElement
// const body = doc.body
// let w, h, timeoutId
//
// //////////////////////////////////////////////////////////////////
//
// window.addEventListener('resize',()=>{
//   clearTimeout(timeoutId)
//   timeoutId = setTimeout(onResize,200)
// },{ capture: true,passive: true })
//
// setSize()
//
// /**
//  * Resize event handler
//  */
// function onResize(){
//   const wOld = w
//     ,hOld = h
//   setSize()
//   resize.dispatch(w,h,wOld,hOld)
// }
//
// /**
//  * Set the size variables
//  */
// function setSize(){
//   resize.w = resize.width  = w = win.innerWidth  || html.clientWidth || body.clientWidth
//   resize.h = resize.height = h = win.innerHeight || html.clientHeight|| body.clientHeight
// }
