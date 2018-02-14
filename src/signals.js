import signals from 'signals'

export const signal = () => new signals.Signal()
export const sassChanged = signal()
export const sassCompiled = signal()
export const cssVariablesChanged = signal()
