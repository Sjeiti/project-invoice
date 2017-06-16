import {Injectable} from '@angular/core'
import {InterpolationService} from '../service/interpolation.service'
import {IConfig} from '../interface/config'
import {IStoreData} from '../interface/store-data'
import {IClient} from '../interface/client'
import {IProject} from '../interface/project'
import {Project} from './project'
import {Client} from './client'
import {dateTimeToDate} from '../mixins'
import {modelBeforeSave, modelSaved} from '../signals'
import {INVOICE} from '../config/invoice'
import * as dummyConfig from '../dummy/config'
import * as dummyData from '../dummy/data'

declare const localStorage:any

@Injectable()

export class ModelService {

  private dataName = 'data'
  private data:IStoreData

  private configName = 'config'
  public config:IConfig

  private clients:Client[]
  private projects:Project[]

  constructor(
      protected interpolationService:InterpolationService
  ) {
    // get initial config
    let config:string = localStorage.getItem(this.configName)
    this.initConfig(<IConfig>(config&&Object.assign(dummyConfig.default, JSON.parse(config))||this.saveConfig(dummyConfig.default)))
    // get initial data
    let data:string = localStorage.getItem(this.dataName)
    this.initData((data&&JSON.parse(data)||dummyData.default))
    !data&&this.saveData(this.data)
  }

  //////////////////////////////////////////////////

  /**
   * Config loaded either from LocalStorage or XHR is initialised
   * @param {IConfig} config
   * @returns {IConfig}
   */
  private initConfig(config:IConfig):IConfig {
    this.config = this.parseConfig(config)
    return config
  }

  /**
   * Config is saved to LocalStorage
   * @param {IConfig} config
   * @returns {IConfig}
   */
  private saveConfig(config:IConfig):IConfig {
    localStorage.setItem(this.configName, JSON.stringify(this.setTimestamp(this.parseConfig(config))))
    return config
  }

  getConfig():IConfig {
    return this.config
  }

  setConfig(config:IConfig):IConfig {
    return this.initConfig(this.saveConfig(config))
  }

  parseConfig(config:IConfig):IConfig {
    if (typeof config.langs==='string') {
      config.langs = (config.langs as String).split(/,/g)
    }
    return config
  }

  clearConfig(){
    localStorage.removeItem(this.configName)
    location.href = location.href
  }

  //////////////////////////////////////////////////

  getData():IStoreData {
    return this.data
  }

  setData(data:IStoreData):IStoreData {
    return this.initData(this.saveData(data))
  }

  getCopy():any[] {
    return this.data.copy
  }

  getPersonal():any {
    return this.data.personal
  }

  private initData(data:IStoreData):IStoreData {
    this.data = data
    this.clients = data.clients = data.clients.map(client=>this.createClient(client))
    this.clients.forEach(client=> {
      // force client.nr to type number
      client.nr = client.nr<<0
      // create project instances
      client.projects = <IProject[]>client.projects.map(this.createProject.bind(this))
    })
    // create all projects
    this.updateProjects()
    // convert datetime to date otherwise input[type=date] cannot eat model
    this.projects.forEach(project=> {
      project.invoices.forEach(invoice=> {
        invoice.date = dateTimeToDate(invoice.date)
      })
      project.quotationDate = dateTimeToDate(project.quotationDate)
      project.quotationStartDate = dateTimeToDate(project.quotationStartDate)
      project.clientNr = project.clientNr<<0
      // fix quotation dates (were mostly set to 09-05-2016)
      if (project.quotationBefore===''&&project.quotationAfter==='') {
        project.quotationDate = dateTimeToDate(new Date('1-1-1970 01:00:00').toString())
      }
    })
    // check default copy
    for (let key in dummyData.default.copy) {
      if (!this.data.copy.hasOwnProperty(key)) {
        this.data.copy[key] = dummyData.default.copy[key]
      }
    }
    //
    return data
  }

  private saveData(data:IStoreData):IStoreData {
    localStorage.setItem(this.dataName, JSON.stringify(this.setTimestamp(_.cloneDeep(data))))
    return data
  }

  clearData(){
    localStorage.removeItem(this.dataName)
    location.href = location.href
  }

  //////////////////////////////////////////////////

  public save() {
    modelBeforeSave.dispatch()
    this.saveData(this.data)
    this.saveConfig(this.config)
    modelSaved.dispatch()
  }

  //////////////////////////////////////////////////

  public getClients():IClient[] {
    return this.clients||[]
  }

  public getClientByNr(nr:number):IClient {
    return this.clients&&this.clients.filter(client=>client.nr===nr).pop()
  }

  private createClient(client:IClient):Client {
    return new Client(client)
  }

  public addClient():Client {
    let nr:number = this.highestClientNr() + 1,
        name:string = 'new'+nr,
        client:Client = this.createClient(<IClient>{
          name, // todo: test new name
          nr,
          projects: [],
          paymentterm: '21' // todo: from config
        })
    this.clients.push(client)
    this.save()
    return client
  }

  public removeClient(client:IClient):boolean {
    let clients:Client[] = this.clients,
        numClients:number = clients.length
    _.pull(this.clients, client)
    let isDeleted:boolean = (clients.length+1)===numClients
    isDeleted&&this.save()
    return isDeleted
  }

  //////////////////////////////////////////////////

  public getProjects():Project[] {
    return this.projects
  }

  public getProject(projectId:string):Project {
    return this.projects&&this.projects.filter(project=>project.invoiceNr===projectId).pop()
  }

  private updateProjects() {
    this.projects = this.clients.length===0?[]:<Project[]>this.clients
      .map(client=>client.projects)
      .reduce((prev, curr)=>prev.concat(curr))
  }

  private createProject(project:IProject):Project {
    return new Project(project, this)
  }

  public addProject(clientNr:number):Project {
    const client:IClient = this.getClientByNr(clientNr),
        invoiceNr:string = [client.nr, client.projects.length + 1, 0, 0].join('.'), // todo: fix
        project:Project = this.createProject(<IProject>{
          clientNr: client.nr,
          invoiceNr,
          quotationDate: dateTimeToDate(),
          lines: [{amount:0, description:'', hours:0, vat:INVOICE.VAT_DEFAULT}]
        })
    client.projects.push(project)
    this.updateProjects()
    this.save()
    return project
  }

  public removeProject(project:IProject):boolean {
    let client:IClient = this.getClientByNr(project.clientNr),
        projects:IProject[] = client.projects,
        numProjects:number = projects.length
    _.pull(client.projects, project)
    let isDeleted:boolean = (projects.length+1)===numProjects
    isDeleted&&this.updateProjects()
    isDeleted&&this.save()
    return isDeleted
  }

  public calculateInvoiceNr(project:Project):string {
    let client:IClient = this.getClientByNr(project.clientNr),
        projectNumberTemplate = (<any>this.config).projectNumberTemplate,
        model = {project, client},
        invoiceNr = this.interpolationService.parse(projectNumberTemplate, model)
    return invoiceNr
  }

  public cloneProject(project:IProject):IProject {
    const clientNr = project.clientNr
    const clonedProject:IProject = this.addProject(clientNr)
    Object.assign(clonedProject, {
      description: project.description,
      discount: project.discount,
      hourlyRate: project.hourlyRate,
      lines: project.lines.map(line=>Object.assign({}, line)),
      quotationAfter: project.quotationAfter,
      quotationBefore: project.quotationBefore,
      quotationDate: project.quotationDate
    })
    return clonedProject
  }

  //////////////////////////////////////////////////

  private highestClientNr():number {
    let highest = 0
    this.clients.forEach(client=> {
      if (client.nr>highest) {
        highest = client.nr
      }
    })
    return highest
  }

  private setTimestamp(o:any):any {
    o.timestamp = Date.now()
    return o
  }

}
