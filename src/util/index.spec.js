/* global describe, it assert */

import {
  getDateString
  , isEqual
  , isFunction
  , getGetSetter
  , getCSSVariables
  , interpolate
  , interpolateEvil
  , getInterpolationContext
  , deepFreeze
  // , keyMap
  // , stopPropagation
  , tryParse
  , tryStringify
  , unique
  , readGetters
  , nextTick
  // , watchAll
  , currency
  , weakAssign
  , moveArrayItem
  , capitalise
  , camelCase
  // , loadScript
  // , appendChild
  // , getScrollbarSize
} from './index'

describe('utils', () => {

  it('getDateString', () => {
    assert.equal(typeof getDateString(new Date()), 'string')
    assert.equal(getDateString(new Date(1588107294906)), '2020-04-28')
  })

  it('isEqual', () => {
    assert.equal(isEqual({a:parseInt('2', 10)}, {a:2}), true)
    assert.equal(isEqual({a:2, b:true}, {a:2, b:1}), false)
    assert.equal(isEqual({a:2, b:true}, {a:2, b:1}, ['b']), true)
  })

  it('isFunction', () => {
    assert.equal(isFunction(()=>{}), true)
    assert.equal(isFunction(function(){}), true)
    assert.equal(isFunction(Math.ceil), true)
    assert.equal(isFunction({}), false)
    assert.equal(isFunction((()=>{})()), undefined)
  })

  it('getGetSetter', () => {
    assert.equal(typeof getGetSetter({}), 'function')
    const data = {a:1}
    const fallThrough = o=>o
    const setter = getGetSetter(data, fallThrough)
    const result = setter('a')(4)
    assert.notEqual(data, result)
    assert.equal(result.a, 4)
  })

  it('getCSSVariables', () => {
    assert.equal(typeof getCSSVariables({}), 'string')
  })

  it('interpolate', () => {
    assert.equal(interpolate('${amount} apples', {amount:2}), '2 apples')
    assert.equal(interpolate('${amount} apples', {amount:2, more:4}), '2 apples')
    assert.equal(interpolate('${fruit.amount} apples', {fruit:{amount:2}}), '2 apples')
    assert.notEqual(interpolate('${getFruit()} apples', {getFruit:()=>2}), '2 apples')
  })

  it('interpolateEvil', () => {
    assert.equal(interpolateEvil('${amount} apples', {amount:2}), '2 apples')
    assert.equal(interpolateEvil('${amount} apples', {amount:2, more:4}), '2 apples')
    assert.equal(interpolateEvil('${fruit.amount} apples', {fruit:{amount:2}}), '2 apples')
    assert.equal(interpolateEvil('${getFruit()} apples', {getFruit:()=>2}), '2 apples')
  })

  it('getInterpolationContext', () => {
    assert.equal(getInterpolationContext({
      config: {lang:'en', currency:'EUR'}
      , personal: []
      , copy: []
    }).hasOwnProperty('client'), true)
  })

  it('deepFreeze', () => {
    const food = {pees:{num:400}}
    food.pees.num = 200
    assert.equal(food.pees.num, 200)
    deepFreeze(food)
    try { food.pees.num = 800 } catch(err) {}
    assert.equal(food.pees.num, 200)
  })

  ///

  it('tryParse', () => {
    assert.equal(tryParse('{"a":2}').a, 2)
    assert.equal(tryParse('{"a":2"}'), undefined)
  })

  it('tryStringify', () => {
    assert.equal(tryStringify({a:2}), '{"a":2}')
    assert.equal(tryStringify(()=>{}), undefined)
  })

  it('unique', () => {
    assert.equal([0, 0, 2, 2].filter(unique).length, 2)
  })

  it('readGetters', () => {
    const fruit = {
      _apples: 2
      , get apples(){return this._apples}
      , set apples(num){this._apples = num}
    }
    const getters = readGetters(fruit)
    assert.equal(getters.length, 1)
    assert.equal(getters[0], 'apples')
  })

  it('nextTick', () => {
    assert.equal(nextTick, window.requestAnimationFrame)
  })

  ///

  it('currency', () => {
    assert.equal(currency(23), '€ 23<span class="decimal" char=",">.</span>00')
    assert.equal(currency(23, '$', 0, '.', ','), '$23')
    assert.equal(currency(23.5, '$', 2, '.', ','), '$23,50')
  })

  it('weakAssign', () => {
    const assigned = weakAssign({a:1}, {a:2, b:3})
    assert.equal(assigned.a, 1)
    assert.equal(assigned.b, 3)
  })

  it('moveArrayItem', () => {
    assert.equal(moveArrayItem([1, 2, 3], 0, 1).join(''), '213')
  })

  it('capitalise', () => {
    assert.notEqual(capitalise('apple'), 'apple')
    assert.equal(capitalise('apple'), 'Apple')
  })

  it('camelCase', () => {
    assert.equal(camelCase('apple juice'), 'appleJuice')
    assert.equal(camelCase('apple-juice'), 'appleJuice')
    assert.equal(camelCase('Apple-juice'), 'appleJuice')
    assert.equal(camelCase('Apple-juiceBeer'), 'appleJuiceBeer')
  })

  ///

})