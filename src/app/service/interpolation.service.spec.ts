/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing'
import { InterpolationService } from './interpolation.service'

describe('Service: Interpolation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InterpolationService]
    })
  })

  it('should exist', inject([InterpolationService], (service: InterpolationService) => {
    expect(service).toBeTruthy()
  }))

  it('should interpolate single variables', inject([InterpolationService], (service: InterpolationService) => {
    let foo = 'bar'
    expect(service.parse('${foo}', {foo})).toEqual(foo)
  }))

  it('should interpolate single variables', inject([InterpolationService], (service: InterpolationService) => {
    expect(service.parse('${foo}', {foo:'bar'})).not.toEqual('baz')
  }))

  it('should interpolate multiple variables', inject([InterpolationService], (service: InterpolationService) => {
    expect(service.parse('${foo} and ${baz}', {foo:'bar', baz:'qux'})).toEqual('bar and qux')
  }))

  it('should handle nested properties', inject([InterpolationService], (service: InterpolationService) => {
    expect(service.parse('${foo.bar} or ${baz.qux}', {foo:{bar:'qux'}, baz:{qux:'bar'}})).toEqual('qux or bar')
  }))

  it('should handle operators', inject([InterpolationService], (service: InterpolationService) => {
    expect(service.parse('${foo.bar*5}', {foo:{bar:7}})).toEqual('35')
  }))

  it('should handle functions', inject([InterpolationService], (service: InterpolationService) => {
    expect(service.parse('${foo.bar(2)}', {foo:{bar:i=>`-${i}-`}})).toEqual('-2-')
  }))

  it('should handle getters', inject([InterpolationService], (service: InterpolationService) => {
    expect(service.parse('${foo.bar}', {foo:{get bar(){return 'barfoo'}}})).toEqual('barfoo')
  }))

})
