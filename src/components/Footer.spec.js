// const mountVue = require('cypress-vue-unit-test')
//
// describe('My Vue', () => {
//   beforeEach(mountVue(/* my Vue code */, /* options */))
//   it('renders', () => {
//     // Any Cypress command
//     // Cypress.vue is the mounted component reference
//   })
// })

import Footer from './Footer.vue'
const mountVue = require('cypress-vue-unit-test')

describe('Footer',() => {
  const template = `<div>
    <footer></footer>
  </div>`
  const components = { Footer,footer:Footer }
  beforeEach(mountVue({ template,components }))

  describe('create',() => {
    it('should parse',() => {
      cy.get('div').should('contain','123')
    })
  })
})