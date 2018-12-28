import {create} from './client'
// import data from '../data/data'

const fixtureLsData = 'cypress/fixtures/localStorageData.json'

describe('project',() => {

  beforeEach(() => {
    cy
        .readFile(fixtureLsData).then(json => json.clients[0]).as('dataClient')
    // cy.readFile(fixtureLsData).then(json => {
    //   // global.client = create(json.clients[0],{
    //   //   config:data.config,personal: data.personal,get projects() {
    //   //     return client.projects.slice(0)
    //   //   }
    //   // })
    // })
  })

  describe('create',() => {
    it('should create a client',() => cy
        .then(()=>assert(create))
        // .get('@dataClient').then(dataClient=>create(dataClient,{
        //   config: data.config
        //   ,personal: data.personal
        //   ,get projects(){
        //     return client.projects.slice(0)
        //   }
        // }))
    )
    // it('should have a custom prototype',() => {
    //   assert.notEqual(Object.getPrototypeOf(client),Object.getPrototypeOf({}))
    // })
    // it('should not have enumerable circular references',() => {
    //   let pass;
    //   try {
    //     JSON.stringify(client)
    //     pass =x` true
    //   } catch (err) {
    //     pass = false
    //   }
    //   assert(pass)
    // })
  })

  // describe('clone',() => {
  //   it('should clone',() => {
  //     const duplicate = client.clone()
  //     assert(!!duplicate)
  //     assert.notEqual(duplicate,client)
  //   })
  // })
  //
  // describe('uri',() => {
  //   it('should exist',() => {
  //     assert.equal(client.uri,'/client/1')
  //   })
  // })
  //
  // describe('createProject',() => {
  //   it('should',() => {
  //     assert.equal(client.projects.length,3)
  //     client.createProject()
  //     assert.equal(client.projects.length,4)
  //   })
  // })
  //
  // describe('getProject',() => {
  //   it('should get a project by index',() => {
  //     assert.strictEqual(client.getProject(1),client.projects[1])
  //   })
  // })
  //
  // describe('deleteProject',() => {
  //   it('should be able to delete projects by instance',() => {
  //     assert.equal(client.projects.length,3)
  //     const project = client.getProject(1)
  //     client.deleteProject(project)
  //     assert.equal(client.projects.length,2)
  //   })
  // })
  //
  // describe('toString',() => {
  //   it('should show name',() => {
  //     assert.equal(client.toString(),'[object client \'Jaskolski, Mertz and O\'Hara\']')
  //   })
  // })

})