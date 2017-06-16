import {IClient} from './client'

export interface IStoreData {
  clients: IClient[]
  copy: any[]
  personal: any
  timestamp: number
}
