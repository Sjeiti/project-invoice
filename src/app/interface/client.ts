import {IProject} from './project'

export interface IClient {
  address: string
  city: string
  contact: string
  name: string
  nr: number
  paymentterm: string
  phone: string
  postbox: string
  projects: IProject[]
  zipcode: string
  zippost: string
}
