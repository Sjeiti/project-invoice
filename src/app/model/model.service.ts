import {Injectable} from '@angular/core'
import {InterpolationService} from '../service/interpolation.service'
import {IConfig} from '../interface/config'
import {IData} from '../interface/store-data'
import {IClient} from '../interface/client'
import {IProject} from '../interface/project'
import {Project} from './project'
import {Client} from './client'
import {dateTimeToDate} from '../mixins'
import {modelBeforeSave, modelSaved} from '../signals'
// import {INVOICE} from '../config/invoice'
import * as dummyConfig from '../dummy/config'
import * as dummyData from '../dummy/data'
import {setTimestamp} from '../util/helper'

import {CURRENCY_ISO} from '../config/currencyISO'

declare const localStorage:any

@Injectable()

/**
 * Main service for all data
 * @todo split into multiple services using custom decorator for fns
 */
export class ModelService {

  private dataName = 'data'
  private data:IData

  private configName = 'config'
  public config:IConfig

  private clients:Client[]
  private projects:Project[]

  private projectID = 1

  /**
   * Constructor
   * Gets data from LocalStorage if present, otherwise set dummy data
   * @param {InterpolationService} interpolationService
   */
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
  //////////////////////////////////////////////////
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
   * Converts config data to something storeable
   * Adds a timestamp
   * @param config
   * @returns {string}
   */
  getStoreableConfig(config:IConfig = null):string {
    return JSON.stringify(Object.assign(setTimestamp(this.parseConfig(config||this.getConfig())), {type:'config'}))
  }

  /**
   * Config is saved to LocalStorage
   * @param {IConfig} config
   * @returns {IConfig}
   */
  private saveConfig(config:IConfig):IConfig {
    localStorage.setItem(this.configName, this.getStoreableConfig(config))
    return config
  }

  /**
   * Returns configuration
   * @returns {IConfig}
   */
  getConfig():IConfig {
    return this.config
  }

  /**
   * Sets configuration
   * @param {IConfig} config
   * @returns {IConfig}
   */
  setConfig(config:IConfig):IConfig {
    return this.initConfig(this.saveConfig(config))
  }

  /**
   * Parses raw config data
   * Splits `langs` to an array
   * Adds getters for `currencySign` and `currencyISO`
   * @param config
   * @returns {IConfig}
   */
  parseConfig(config:IConfig):IConfig {
    if (typeof config.langs==='string') {
      config.langs = (config.langs as String).split(/,/g)
    }
    Object.defineProperty(config, 'currencySign', { get: ()=>{
      const iso = CURRENCY_ISO[config.currency]
      return iso&&iso.symbol||'-'
    } })
    Object.defineProperty(config, 'currencyISO', { get: ()=>{
      const iso = CURRENCY_ISO[config.currency]
      return iso&&iso.code||'-'
    } })
    //
    return config
  }

  /**
   * Clears the configuration from LocalStorage and reloads the page
   */
  clearConfig(){
    localStorage.removeItem(this.configName)
    location.href = location.href
  }

  //////////////////////////////////////////////////

  /**
   * Returns data
   * @returns {IData}
   */
  getData():IData {
    return this.data
  }

  /**
   * Sets the data
   * @param {IData} data
   * @returns {IData}
   */
  setData(data:IData):IData {
    return this.initData(this.saveData(data))
  }

  /**
   * Returns copy data
   * @returns {any[]}
   */
  getCopy():any[] {
    return this.data.copy
  }

  /**
   * Returns personal data
   * @returns {any}
   */
  getPersonal():any {
    return this.data.personal
  }

  /**
   * Initialises data
   * Creates clients and projects and defaults missing copy to the dummy data
   * @param {IData} data
   * @returns {IData}
   */
  private initData(data:IData):IData {
    this.data = data
    this.clients = data.clients = data.clients.map(client=>this.createClient(client))
    this.clients.forEach(client=> {
      // force client.nr to type number
      client.nr = client.nr<<0
      // alter project input
      // invoiceNr removed from json after v1.2.13 (1.3.0)
      client.projects.forEach(project=>delete project.invoiceNr)
      // create project instances
      // client.projects = <IProject[]>client.projects.map(this.createProject.bind(this))
      client.projects = <IProject[]>client.projects.map(project=>this.createProject(project, client))
    })
    // create all projects
    this.updateProjects()
    // convert datetime to date otherwise input[type=date] cannot eat model
    this.projects.forEach(project=> {
      project.id = this.projectID++ // add unique id
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
    // hourrateMin, hourrateMax, hoursMin, hoursMax should be numeral (since 1.3.24) // todo find way to add types (data.personal is any plus interface)
    this.data.personal.hourrateMin = parseFloat(this.data.personal.hourrateMin)
    this.data.personal.hourrateMax = parseFloat(this.data.personal.hourrateMax)
    this.data.personal.hoursMin = parseFloat(this.data.personal.hoursMin)
    this.data.personal.hoursMax = parseFloat(this.data.personal.hoursMax)
    //
    return data
  }

  /**
   * Converts config data to something storeable
   * Removes invalid properties (not on IData)
   * @param {IData} data
   * @returns {string}
   */
  getStoreableData(data:IData = null):string {
    const dataToStore = Object.assign(setTimestamp(_.cloneDeep(data||this.getData())), {type:'data'})
    //
    // delete properties to prevent circular references in json (non-enumerability does not work due to template references)
    dataToStore.clients.forEach(client=>client.projects.forEach(project=>{
      delete project.modelService
      delete project._client // well that sucks
      delete project.datePipe // todo: ehrm?
      delete project.personal // todo: not getter?
      delete project.startValue // todo: wa?
    }))
    //
    return JSON.stringify(dataToStore)
  }

  /**
   * Save data to LocalStorage
   * @param {IData} data
   * @returns {IData}
   */
  private saveData(data:IData):IData {
    localStorage.setItem(this.dataName, this.getStoreableData(data))
    return data
  }

  /**
   * Clears data from LocalStorage and reloads the page
   */
  clearData(){
    localStorage.removeItem(this.dataName)
    location.href = location.href
  }

  //////////////////////////////////////////////////

  /**
   * Save data and config
   */
  public save() {
    modelBeforeSave.dispatch()
    this.saveData(this.data)
    this.saveConfig(this.config)
    modelSaved.dispatch()
  }

  //////////////////////////////////////////////////

  /**
   * Get all clients
   * @returns {Client[]}
   */
  public getClients():IClient[] {
    return this.clients||[]
  }

  /**
   * Get a client by number
   * @param {number} nr
   * @returns {Client}
   */
  public getClientByNr(nr:number):Client {
    return this.clients&&this.clients.filter(client=>client.nr===nr).pop()
  }

  /**
   * Create a client
   * @param {IClient} client
   * @returns {Client}
   */
  private createClient(client:IClient):Client {
    return new Client(client)
  }

  /**
   * Add a client and save
   * @returns {Client}
   */
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

  /**
   * Removes a client from the client list
   * @param {IClient} client
   * @returns {boolean} succes
   */
  public removeClient(client:IClient):boolean {
    let clients:Client[] = this.clients,
        numClients:number = clients.length
    _.pull(this.clients, client)
    let isDeleted:boolean = (clients.length+1)===numClients
    isDeleted&&this.save()
    return isDeleted
  }

  //////////////////////////////////////////////////

  /**
   * Get all projects
   * @returns {Project[]}
   */
  public getProjects():Project[] {
    return this.projects
  }

  /**
   * Get a single project by `clientNr` and `projectIndex`
   * @param {number} clientNr
   * @param {number} projectIndex
   * @returns {Project}
   */
  public getProject(clientNr:number, projectIndex:number):Project {
    const client = this.getClientByNr(clientNr) as Client
    return client&&client.sortProjects()[projectIndex] as Project
  }

  /**
   * Update project list by adding all client.projects
   */
  private updateProjects() {
    this.projects = this.clients.length===0?[]:<Project[]>this.clients
      .map(client=>client.projects)
      .reduce((prev, curr)=>prev.concat(curr))
  }

  /**
   * Create a project
   * @param {IProject} project
   * @param {Client} client
   * @returns {Project}
   */
  private createProject(project:IProject, client:Client):Project {
    const newProject = new Project(project, client, this)
    newProject.id = this.projectID++
    return newProject
  }

  /**
   * Add a net project to a client and save
   * @param clientNr
   * @returns {Project}
   */
  public addProject(clientNr:number):Project {
    const client:IClient = this.getClientByNr(clientNr),
        project:Project = this.createProject(<IProject>{
          clientNr: client.nr,
          quotationDate: dateTimeToDate(),
          lines: [{amount:0, description:'', hours:0, vat:this.data.personal.vatAmounts.split(',').shift()}]
        }, client as Client)
    client.projects.push(project)
    this.updateProjects()
    this.save()
    return project
  }

  /**
   * Remove a project
   * @param {IProject} project
   * @returns {boolean}
   * @todo make param Project
   */
  public removeProject(project:IProject):boolean {
    let client:IClient = (project as Project).client,
        projects:IProject[] = client.projects,
        numProjects:number = projects.length
    _.pull(client.projects, project)
    let isDeleted:boolean = (projects.length+1)===numProjects
    isDeleted&&this.updateProjects()
    isDeleted&&this.save()
    return isDeleted
  }

  /**
   * Returns the interpolationService
   * @returns {InterpolationService}
   */
  public getInterpolationService():InterpolationService {
    return this.interpolationService
  }

  /**
   * Clone an existing project to a new one (minus the invoices)
   * @param {IProject} project
   * @returns {Project}
   */
  public cloneProject(project:IProject):Project {
    const clientNr = project.clientNr
    const clonedProject = this.addProject(clientNr)
    Object.assign(clonedProject, {
      id: this.projectID++,
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

  /**
   * Returns the heighest client number
   * @returns {number}
   */
  private highestClientNr():number {
    let highest = 0
    this.clients.forEach(client=> {
      if (client.nr>highest) {
        highest = client.nr
      }
    })
    return highest
  }

}