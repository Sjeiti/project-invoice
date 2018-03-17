import data from '../../../../src/data/data'
import {create} from '../../../../src/model/config'

describe('config',() => {

  beforeEach(() => {
    global.config = create(data.config);
  })

  describe('create',() => {
    it('should have a custom prototype',() => {
      assert.notEqual(Object.getPrototypeOf(config),Object.getPrototypeOf({}))
    })
    it('should not have enumerable circular references',() => {
      let pass;
      try {
        JSON.stringify(config)
        pass = true
      } catch (err) {
        pass = false
      }
      assert(pass)
    })
  })

  describe('clone',() => {
    it('should clone',() => {
      const duplicate = config.clone()
      assert(!!duplicate)
      assert.notEqual(duplicate,config)
    })
  })

  describe('langsJoined',() => {
    it('should set a comma separated list to an internal array',() => {
      config.langsJoined = 'nl,en,de,fr'
      assert.equal(config.langs.sort().join('-'),'de-en-fr-nl')
    })
    it('should get a comma separated list from a string array',() => {
      config.langs = ['de','ne','rk']
      assert.equal(config.langsJoined,'de,ne,rk')
    })
  })

  describe('currencySymbol',() => {
    it('should get the symbol of the set currency',() => {
      config.currency = 'EUR'
      assert.equal(config.currencySymbol,'€')
      config.currency = 'AUD'
      assert.equal(config.currencySymbol,'$')
    })
  })

})