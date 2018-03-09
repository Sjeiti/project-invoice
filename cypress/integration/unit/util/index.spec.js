import {
  watchAll
  ,currency
  ,weakAssign
  ,capitalise
} from '../../../../src/util/index'

describe('util',()=>{

  context('watchall',()=>{
    it('should exist',()=>{
      assert(!!watchAll)
    })
    // todo: mock Vue vm.$watch
  })

  context('currency',()=>{
    it('should default to HTML',()=>{
      assert.equal(currency(2000),'€ 2<span class="chunk" char="."></span>000<span class="decimal" char=",">.</span>00')
    })
    it('should be able to plain text',()=>{
      assert.equal(currency(2000,'$',2,',','.'),'$2,000.00')
    })
    it('should be able to parse giant numbers',()=>{
      assert.equal(currency(9E12,'€ ',2,'.',','),'€ 9.000.000.000.000,00')
    })
    it('should be able to parse whole numbers',()=>{
      assert.equal(currency(9E6,'€ ',0,'.',','),'€ 9.000.000')
      assert.equal(currency(Math.PI,'€ ',0,'.',','),'€ 3')
    })
    it('should be able to parse small numbers',()=>{
      assert.equal(currency(Math.PI-3,'',5,',','.'),'0.14159')
    })
  })

  context('weakAssign',()=>{
    it('should apply to- and return first parameter',()=>{
      const obj1 = {a:1,b:2}
      const obj2 = {b:3,c:4}
      const assigned = weakAssign(obj1,obj2)
      assert.equal(assigned,obj1)
    })
    it('should only assign missing object properties',()=>{
      const obj1 = {a:1,b:2}
      const obj2 = {b:3,c:4}
      const assigned = weakAssign(obj1,obj2)
      assert.equal(assigned.b,2)
    })
    it('should apply n parameters',()=>{
      const obj1 = {a:1,b:2}
      const obj2 = {b:3,c:4}
      const obj3 = {c:3,d:4}
      const assigned = weakAssign(obj1,obj2,obj3)
      assert.equal(assigned.d,4)
    })
  })

  context('capitalise',()=>{
    it('should capitalise a word',()=>{
      assert.equal(capitalise('foo'),'Foo')
    })
    it('should capitalise a sentence',()=>{
      assert.equal(capitalise('foo bar baz'),'Foo bar baz')
    })
    it('should not lowercase anything',()=>{
      assert.equal(capitalise('FOO BAR BAZ'),'FOO BAR BAZ')
    })
  })

})