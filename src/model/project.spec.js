import {create} from '../model/client'
import data from '../data/data'

const fixtureLsData = 'cypress/fixtures/localStorageData.json'

describe('project',() => {

  beforeEach(() => {
    cy.readFile(fixtureLsData).then(json => {
      const client = create(json.clients[0],{
        config: data.config ,personal: data.personal,get projects() {
          return client.projects.slice(0)
        }
      })
      global.project = client.projects[2]
      const projectProto = Object.getPrototypeOf(global.project)
      Object.defineProperty(projectProto,'daysLate',{
        get() {
          return 200;
        }
      });
    })
  })

  describe('create',() => {
    it('should have a custom prototype',() => {
      assert.notEqual(Object.getPrototypeOf(project),Object.getPrototypeOf({}))
    })
    it('should not have enumerable circular references',() => {
      let pass;
      try {
        JSON.stringify(project)
        pass = true
      } catch (err) {
        pass = false
      }
      assert(pass)
    })
  })

  describe('clone',() => {
    it('should clone',() => {
      const duplicate = project.clone()
      assert(!!duplicate)
      assert.notEqual(duplicate,project)
    })
  })

  xdescribe('cloneNew',() => {
    it('should',() => {})
  })

  describe('calculateInvoiceNr',() => {
    it('should parse correctly',() => {
      assert.equal(project.calculateInvoiceNr(),'2016.1')
    })
  })

  describe('invoiceNr',() => {
    it('should parse correctly',() => {
      assert.equal(project.invoiceNr,'2016.1')
    })
  })

  describe('invoiceNum',() => {
    it('should return the correct number',() => {
      assert.strictEqual(project.invoiceNum,3)
    })
  })

  describe('total',() => {
    it('should return the total excluding VAT',() => {
      assert.strictEqual(project.total,2280+960+360)
    })
  })

  describe('totalVat',() => {
    it('should return the total including VAT',() => {
      assert.strictEqual(project.totalVat,parseFloat(((2280+960+360)*0.21).toFixed(2)))
    })
  })

  describe('totalDiscount',() => {
    it('should return the total discount excluding VAT',() => {
      assert.strictEqual(project.totalDiscount,360)
    })
  })

  describe('totalVatDiscount',() => {
    it('should return VAT amount for the discount',() => {
      assert.strictEqual(project.totalVatDiscount<<0,75)
    })
  })

  describe('totalDiscounted',() => {
    it('should return the total excluding VAT minus the discount',() => {
      assert.strictEqual(project.totalDiscounted,(2280+960+360)*0.90)
    })
  })

  describe('totalVatDiscounted',() => {
    it('should return the total discounted VAT',() => {
      assert.strictEqual(project.totalVatDiscounted,(2280+960+360)*0.90*0.21)
    })
  })

  describe('totalIncDiscounted',() => {
    it('should return the total including VAT and the discount',() => {
      assert.strictEqual(project.totalIncDiscounted,(2280+960+360)*0.90*1.21)
    })
  })

  describe('totalIncDiscountedInterest',() => {
    it('should return the total including VAT and the discount with interest',() => {
      const amnt = (2280+960+360)*0.90*1.21
      const intr = 158.7945205479452 // (200/365)*(0.01*8.05)*amnt
      assert.strictEqual(project.totalIncDiscountedInterest<<0,(amnt+intr)<<0)
    })
  })

  describe('interest',() => {
    it('should return the interest amount',() => {
      const amnt = (2280+960+360)*0.90//*1.21
      const intr = 158.7945205479452//(200/365)*(0.01*8.05)*amnt
      assert.strictEqual(project.interest<<0,158)
    })
  })

  describe('date',() => {
    it('should return something',() => {
      // it('should return the project date',()=>{
      // console.log('date',typeof project.date); // todo: remove log
      assert(!!project.date)
    })
  })

  xdescribe('dateFormatted',() => {
    it('should',() => {})
  })

  xdescribe('timestamp',() => {
    it('should',() => {})
  })

  describe('daysLate',() => {
    it('should return the number of days late',() => {
      assert.strictEqual(project.daysLate,200)
    })
  })

  xdescribe('isLate',() => {
    it('should',() => {})
  })

  xdescribe('overdue',() => {
    it('should',() => {})
  })

  describe('dateLatest',() => {
    it('should return something',() => {
      // it('should return the project date',()=>{
      // console.log('date',typeof project.date); // todo: remove log
      assert(!!project.dateLatest)
    })
  })

  xdescribe('timestampLatest',() => {
    it('should',() => {})
  })

  describe('year',() => {
    it('should return a string',() => {
      assert.equal(typeof project.year,'number')
    })
  })

  describe('dateYear',() => {
    it('should return a string',() => {
      assert.equal(typeof project.dateYear,'string')
    })
  })

  describe('indexOnYear',() => {
    it('should return index of the project for this year',() => {
      assert.strictEqual(project.indexOnYear,0)
    })
  })

  xdescribe('quarter',() => {
    it('should',() => {})
  })

  describe('hourlyRateCalculated',() => {
    it('should return the hourly rate based on estimated hours and min and max rate',() => {
      assert.strictEqual(project.hourlyRateCalculated<<0,15)
    })
  })

  describe('hourlyRateDiscounted',() => {
    it('should return the discounted actual hourly rate',() => {
      assert.strictEqual(project.hourlyRateDiscounted,0)
    })
  })

  describe('totalHours',() => {
    it('should return the total estimated hours',() => {
      assert.strictEqual(project.totalHours,60)
    })
  })

  xdescribe('client',() => {
    it('should',() => {})
  })

  xdescribe('clientName',() => {
    it('should',() => {})
  })

  describe('indexOnClient',() => {
    it('should return index of the project for this client',() => {
      assert.strictEqual(project.indexOnClient,2)
    })
  })

  xdescribe('addLine',() => {
    it('should',() => {})
  })

  xdescribe('addInvoice',() => {
    it('should',() => {})
  })

  xdescribe('vatMax',() => {
    it('should',() => {})
  })

  xdescribe('uri',() => {
    it('should',() => {})
  })
})