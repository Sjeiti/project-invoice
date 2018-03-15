import signals from 'signals'
export const signal = () => new signals.Signal()

export const notify = signal()
export const storageInitialised = signal()
export const sync = signal()
export const modelReplaced = signal()
