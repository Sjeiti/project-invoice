import {
  parse
  ,__
} from '../../../../src/util/interpolationService'
import model from '../../../../src/model/index'

describe('interpolationService',()=>{

  context('parse',()=>{
    it('should interpolate strings',()=>{
      assert.equal(parse('a${b}a',{b:'c'}),'aca')
    })
    it('should have default models',()=>{
      assert.equal(parse('${data.city}'),'Bikini Bottom')
    })
    it('should parse Javascript',()=>{
      assert.equal(parse('a${Date.now()*0}a'),'a0a')
    })
    it('should translate if possible',()=>{
      model.config.lang = 'nl'
      assert.equal(parse('total'),'totaal')
    })
    it('should parse from multiple sources',()=>{
      assert.equal(parse('${c(2)} ${data.city}'),'€2,00 Bikini Bottom')
    })
    it('should interpolate strings',()=>{
      assert.equal(parse('a\\${b}a',{b:'c'},true),'a${b}a')
    })
    it('should do double interpolation',()=>{
      assert.equal(parse('a\\${b}a',{b:'c'}),'aca')
    })
  })

  context('__',()=>{
    it('should translate',()=>{
      model.config.lang = 'en'
      assert.equal(__('total'),'total')
      model.config.lang = 'nl'
      assert.equal(__('total'),'totaal')
    })
    it('should return key if no translation is found',()=>{
      assert.equal(__('pejcuwytqhmbb'),'pejcuwytqhmbb')
    })
  })

})
