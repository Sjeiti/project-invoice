import {IClient} from './client'

export interface IData {
  clients: IClient[]
  copy: any[]
  personal: any
  timestamp: number
}
