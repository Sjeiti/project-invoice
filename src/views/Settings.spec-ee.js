import {
  basics
  ,describeResponsive
} from './pi'

const password = 'asdf'

describeResponsive('Settings',()=>{

  beforeEach(()=>cy
      // .window().then(win => cy.stub(win,'prompt').returns(password))
      .visitPage('/settings',{
        onBeforeLoad(win){
          cy.stub(win,'prompt').returns(password) // todo: this does not seem to work
        }
      })
      .get('h2').contains('encryption')
      .parent().find('button').contains('disable').then($but=>{
        if (!$but.get(0).disabled){
          cy.wrap($but).click()
        }
      })
  )

  context('Basics',basics.bind(null,'Settings - Project Invoice','',true))

  context('Application language',()=>{
    it('should select',()=>cy
      .isDirty(false)
      .get('dt').contains('application language').find('+dd>select').select('nl')
      .isDirty(true)
    )
  })

  // context('Project number template',()=>{
  //   it('should input',()=>cy
  //     .isDirty(false)
  //     .get('dt').contains('project number template').find('+dd input').type('1',{force:true}).blur()
  //     .isDirty(true)
  //   )
  // })

  // context('Project number template',()=>{
  //   it('should input',()=>cy
  //     .get('.btn').contains('download').click()
  //   )
  // })

  context('Encryption',()=>{
    it('should have buttons for encryption',()=>cy
        .get('h2').contains('encryption').parent().as('sectionEncryption')
        .get('@sectionEncryption').find('button').contains('disable').as('disable').should('be.disabled')
        .get('@sectionEncryption').find('button').contains('enable').as('enable').click()
        // .parent().find('button').should('have.length',2)
        // .contains('enable').click()
        .get('dialog input[type="password"]').first().as('inputOne')
        .get('dialog input[type="password"]').last().as('inputTwo')
        .next().as('icon')
        .get('dialog footer button').first().as('dialogCancel')
        .get('dialog footer button').last().as('dialogEnable')
        .get('@dialogEnable').should('be.disabled')
        .get('@icon').should('have.class','icon-close')
        .get('@inputOne').type(password)
        .get('@dialogEnable').should('be.disabled')
        .get('@icon').should('have.class','icon-close')
        .get('@inputTwo').type(password)
        .get('@icon').should('not.have.class','icon-close').and('have.class','icon-mark')
        .get('@dialogEnable').click()
        .get('@enable').should('be.disabled')
        // .reload()
        // .window().its('prompt').should('be.called')
        // .get('@sectionEncryption').find('button').contains('disable').click()
    )
  })
})
