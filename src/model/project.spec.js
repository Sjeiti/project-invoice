const assert = require('assert')
import 'babel-polyfill'
import {create} from './client'
import data from '../data/data'
import config from '../data/config'

describe('project', ()=>{

    beforeEach(()=>{
        const client = create(data.clients[0],{
            config,
            personal: data.personal,
            get projects(){return client.projects.slice(0)}
        })
        global.project = client.projects[0]
    })

    describe('create',()=>{
        it('should have a custom prototype',()=>{
            assert.notEqual(Object.getPrototypeOf(project),Object.getPrototypeOf({}))
        })
        it('should not have enumerable circular references',()=>{
            let pass;
            try {
                JSON.stringify(project)
                pass = true
            } catch(err) {
                pass = false
            }
            assert(pass)
        })
    })

    describe('clone',()=>{
        it('should clone',()=>{
            const duplicate = project.clone()
            assert(!!duplicate)
            assert.notEqual(duplicate,project)
        })
    })

    describe('calculateInvoiceNr',()=>{
        it('should parse correctly',()=>{
            assert.equal(project.calculateInvoiceNr(),'1.1.17.1')
        })
    })

    describe('invoiceNr',()=>{
        it('should parse correctly',()=>{
            assert.equal(project.invoiceNr,'1.1.17.1')
        })
    })

    describe('invoiceNum',()=>{
        it('should return the correct number',()=>{
            assert.strictEqual(project.invoiceNum,4)
        })
    })

    describe('total',()=>{
        it('should return the total excluding VAT',()=>{
            assert.strictEqual(project.total,1234+444)
        })
    })

    describe('totalVat',()=>{
        it('should return the total including VAT',()=>{
            assert.strictEqual(project.totalVat,(1234+444)*0.21)
        })
    })

    describe('totalDiscount',()=>{
        it('should return the total discount excluding VAT',()=>{
            assert.strictEqual(project.totalDiscount,0)
        })
    })

    describe('totalVatDiscount',()=>{
        it('should return VAT amount for the discount',()=>{
            assert.strictEqual(project.totalVatDiscount,0)
        })
    })

    describe('totalDiscounted',()=>{
        it('should return the total excluding VAT minus the discount',()=>{
            assert.strictEqual(project.totalDiscounted,1234+444)
        })
    })

    describe('totalVatDiscounted',()=>{
        it('should return the total discounted VAT',()=>{
            assert.strictEqual(project.totalVatDiscounted,(1234+444)*0.21)
        })
    })

    describe('totalIncDiscounted',()=>{
        it('should return the total including VAT and the discount',()=>{
            assert.strictEqual(project.totalIncDiscounted,2030.38) // (1234+444)*1.21
        })
    })

    describe('totalIncDiscountedInterest',()=>{
        it('should return the total including VAT and the discount with interest',()=>{
            // console.log('project.daysLate',project.daysLate); // todo: remove log
            // console.log('project.totalIncDiscountedInterest',project.totalIncDiscountedInterest); // todo: remove log
            assert.strictEqual(project.totalIncDiscountedInterest,2048.513893150685)
        })
    })

    describe('daysLate',()=>{
        it('should return the number of days late',()=>{
            assert.strictEqual(project.daysLate,49)
        })
    })

    describe('date',()=>{
        it('should return something',()=>{
        // it('should return the project date',()=>{
            // console.log('date',typeof project.date); // todo: remove log
            assert(!!project.date)
        })
    })

    describe('dateLatest',()=>{
        it('should return something',()=>{
        // it('should return the project date',()=>{
            // console.log('date',typeof project.date); // todo: remove log
            assert(!!project.dateLatest)
        })
    })

    describe('hourlyRateCalculated',()=>{
        it('should return the hourly rate based on estimated hours and min and max rate',()=>{
            assert.strictEqual(project.hourlyRateCalculated,85.87053571428571)
        })
    })

    describe('hourlyRateDiscounted',()=>{
        it('should return the discounted actual hourly rate',()=>{
            assert.strictEqual(project.hourlyRateDiscounted,0)
        })
    })

    describe('totalHours',()=>{
        it('should return the total estimated hours',()=>{
            assert.strictEqual(project.totalHours,69)
        })
    })

    describe('indexOnClient',()=>{
        it('should return index of the project for this client',()=>{
            assert.strictEqual(project.indexOnClient,0)
        })
    })

    describe('year',()=>{
        it('should return a string',()=>{
            assert.equal(typeof project.year, 'number')
        })
    })

    describe('dateYear',()=>{
        it('should return a string',()=>{
            assert.equal(typeof project.dateYear, 'string')
        })
    })

    describe('indexOnYear',()=>{
        it('should return index of the project for this year',()=>{
            assert.strictEqual(project.indexOnYear,0)
        })
    })
})