

export function validateExternalStore(store) {
  return validate(store)
      .validateRoot()
      .validateConfig()
      .validateClients()
      .store
}

function validate(store){
  return Object.create({
    validateRoot(){
      delete store.type
      return this
    }
    , validateConfig(){
      const {config} = store
      config.cloudSelected==='drive'&&(config.cloudSelected = 'gdrive')
      return this
    }
    , validateClients(){
      const {clients} = store
      const projects = clients.reduce((acc, client)=>(acc.push(...client.projects), acc), [])
      const highestID = projects.map(p=>p.id).sort().pop()
      const notUniqueIDS = projects.map(p=>p.id).filter((id, i, a)=>a.lastIndexOf(id)!==i)
      const notUnique = projects.filter(p=>notUniqueIDS.includes(p.id))
      notUnique.forEach((project, i)=>project.id = highestID + i + 1)
      return this
    }
  }, {
    store: {
      writable: false
      , configurable: false
      , value: store
    }
  })

}

