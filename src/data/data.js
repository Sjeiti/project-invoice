/* tslint:disable:max-line-length */
import moment from 'moment'
import {VERSION} from '../config'

const now = Date.now()
const week = 1000*60*60*24*7
const dateString = millis=>moment(new Date(millis)).format('YYYY-MM-DD')
const data = {
  timestamp: now
  ,version: VERSION
  ,clients: [
    {
      nr: 1
      ,name: 'Krusty Krab'
      ,address: '831 Bottomfeeder Lane'
      ,zipcode: '1000 DG'
      ,postbox: ''
      ,zippost: ''
      ,city: 'Bikini Bottom'
      ,phone: ''
      ,paymentterm: '21'
      ,contact: ''
      ,projects: [
        ...Array.from(new Array(2)).map((o,i)=>({
          clientNr: 1
          ,id: i
          ,description: `${i===0?'One':'Two'} gazillion Krabby Patties`
          ,hourlyRate: 33
          ,discount: 5
          ,lines: [
            {
              description: 'Krabby Patties'
              ,hours: 55
              ,vat: 21
              ,amount: 1234
            }
            ,{
              description: 'spatula greese'
              ,hours: 14
              ,vat: 21
              ,amount: 444
            }
          ]
          ,invoices: [
            {
              date: dateString(now-7*week-i*52)
              ,type: 'invoice'
            }
            ,{
              date: dateString(now-4*week-i*52)
              ,type: 'reminder'
            }
            ,{
              date: dateString(now-2*week-i*52)
              ,type: 'reminder'
            }
            ,{
              date: dateString(now-i*52)
              ,type: 'reminder'
              ,interest: true
            }
          ]
          ,paid: i===0
          ,quotationDate: dateString(now-8*week)
          ,quotationStartDate: dateString(now-8*week)
          ,quotationDuration: 7
          ,quotationSubject: 'Krabby Patties'
          ,quotationBefore: `### project
I, Spongebob Squarepants, hereby solemly swear to make ${i===0?'one':'two'} gazillion Krabby Patties.`
          ,quotationAfter: `### finally
Thank you`
        }))
        ,...Array.from(new Array(3)).map((o,i)=>({
          clientNr: 1
          ,id: i+21
          ,description: 'Krusty Krab spring-cleaning'
          ,hourlyRate: 33
          ,discount: 5
          ,lines: [
            {
              description: 'Krabby Patties'
              ,hours: 823
              ,vat: 21
              ,amount: 12345
            }
          ]
          ,invoices: i===0?[]:[
            {
              date: dateString(now-i*52*week)
              ,type: 'invoice'
            }
          ]
          ,paid: false
        }))
      ]
    }
  ]
  ,personal: {
    name: 'SpongeBob SquarePants'
    ,address: '124 Conch Street'
    ,zipcode: ''
    ,city: 'Bikini Bottom'
    ,phone: ''
    ,vatNumber: '1234567'
    ,kvkNumber: '9876543'
    ,bank: '192837465'
    ,iban: 'PO55BBBA0938282773'
    ,bic: 'BIBOBA23'
    ,bankName: 'Bikini Bottom Bank'
    ,country: 'Pacific ocean'
    ,reminderPeriod: 7
    ,vatAmounts: '21,6,0'
    ,interestAmount: 8.05
    ,administrationCosts: 25
    ,terms: 'http://squarepants.org/terms.pdf'
    ,email: 'spongebob@squarepants.org'
    ,website: 'http://squarepants.org'
    ,blog: ''
    ,hourrateMin: 2
    ,hourrateMax: 16
    ,hoursMin: 32
    ,hoursMax: 2048
  }
  ,copy: {
    sender: {
      nl: '**${data.name}**\n${data.address}\n${data.zipcode} ${data.city}\n${data.vatNumber}\nkvk ${data.kvkNumber}'
      ,en: '**${data.name}**\n${data.address}\n${data.zipcode} ${data.city}\n${data.vatNumber}\nkvk ${data.kvkNumber}'
    }
    ,receiver: {
      nl: '**${client.name}**\n${client.address}\n${client.zipcode} ${client.city}\n${client.contact}'
      ,en: '**${client.name}**\n${client.address}\n${client.zipcode} ${client.city}\n${client.contact}'
    }
    ,footer: {
      nl: 'Gelieve binnen **${client.paymentterm}** dagen over te maken op bankrekeningnummer (IBAN) **${data.iban}** t.n.v. ${data.name} onder vermelding van factuurnummer **${project.invoiceNr}**. Bij het verstrijken van de betalingstermijn worden administratiekosten en wettelijke rente in rekening gebracht.'
      ,en: 'Please transfer within ${data.reminderPeriod} days to IBAN ${data.iban}, ${data.bic}, bank name: ${data.bankName} quoting the invoice number. Upon expiry of the payment, administration costs and legal interest will be charged.'
    }
    ,invoice: {
      nl: 'factuur'
      ,en: 'invoice'
    }
    ,reminder: {
      nl: 'herinnering'
      ,en: 'reminder'
    }
    ,quotation: {
      nl: 'offerte'
      ,en: 'quotation'
    }
    ,reminder1: {
      nl: 'Uit de administratie blijkt dat factuur **${project.invoiceNr}** van *${project.dateFormatted}* al **${project.daysLate}** dagen geleden betaald had moeten zijn. Vanaf de tweede herinnering zal **€${data.administrationCosts}** administratiekosten  in rekening gebracht worden, alsmede de wettelijke rente. Mocht u de factuur inmiddels hebben betaald dan kunt u deze herinnering als niet verzonden beschouwen.'
      ,en: 'We\'ve noticed that invoice **${project.invoiceNr}** from *${project.dateFormatted}* should have been paid **${project.daysLate}** days ago. From the second reminder administration costs (**€${data.administrationCosts}**) and legal interest may be added.'
    }
    ,reminder2: {
      nl: 'Uit de administratie blijkt dat factuur **${project.invoiceNr}** van *${project.dateFormatted}* al **${project.daysLate}** dagen geleden betaald had moeten zijn. Er zijn **€${data.administrationCosts}** administratiekosten in rekening gebracht, alsmede de wettelijke rente. Mocht u de factuur inmiddels hebben betaald dan kunt u deze herinnering als niet verzonden beschouwen.'
      ,en: 'We\'ve noticed that invoice **${project.invoiceNr}** from *${project.dateFormatted}* should have been paid **${project.daysLate}** days ago. Administration costs (**€${data.administrationCosts}**) and legal interest have been added.'
    }
    ,exhortation: {
      nl: 'Aanmanging'
      ,en: 'Exhortation'
    }
    ,exhortation_: {
      nl: 'Uit de administratie blijkt dat factuur **${project.invoiceNr}** van *${project.dateFormatted}* al **${project.daysLate}** dagen geleden betaald had moeten zijn.\n<strong>De betaling dient uiterlijk binnen **${client.paymentterm}** dagen na dagtekening te zijn bijgeschreven. Wanneer deze termijn verstreken is zal de vordering uit handen worden gegeven.</strong>\nMocht u de factuur inmiddels hebben betaald dan kunt u deze aanmaning als niet verzonden beschouwen.\nDeze aanmaning zal u zowel per e-mail als per aangetekende post toekomen.'
      ,en: 'We\'ve noticed that invoice **${project.invoiceNr}** from *${project.dateFormatted}* should have been paid **${project.daysLate}** days ago. **Payment must be fullfilled within **${client.paymentterm}** days after this writing.** If this term is exceeded a debt-collection agency will be called in; the client is liable for any associated costs.'
    }
    ,dateFormat: {
      nl: 'DD-MM-YYYY'
      ,en: 'MM/DD/YYYY'
    }
    ,amount: {
      nl: 'bedrag'
      ,en: 'amount'
    }
    ,vat: {
      nl: 'BTW'
      ,en: 'VAT'
    }
    ,total: {
      nl: 'totaal'
      ,en: 'total'
    }
    ,subtotal: {
      nl: 'subtotaal'
      ,en: 'subtotal'
    }
    ,payment: {
      nl: 'betaling'
      ,en: 'payment'
    }
    ,discount: {
      nl: 'korting'
      ,en: 'discount'
    }
    ,date: {
      nl: 'datum'
      ,en: 'date'
    }
    ,concerns: {
      nl: 'betreft'
      ,en: 'concerns'
    }
    ,number: {
      nl: 'nummer'
      ,en: 'number'
    }
    ,legalInterest: {
      nl: 'wettelijke rente'
      ,en: 'legal interest'
    }
    ,administrationCosts: {
      nl: 'administratie kosten'
      ,en: 'administration costs'
    }
    ,pagebreak: {
      nl: '<div class=\'page-break\'></div>'
      ,en: '<div class=\'page-break\'></div>'
    }
    ,planning: {
      nl: `Bij acceptatie van de offerte kan vanaf $\{project.quotationStartDate} worden gestart met de uitvoer. De looptijd bedraagt ongeveer $\{project.quotationDuration} weken.
Voor oplevering worden de onderdelen getest op gebruiksvriendelijkheid en technisch correct functioneren. Eventuele punten van verbetering (binnen redelijke grenzen) worden verwerkt in het eindproduct.`
      ,en: 'Before delivery, the components are tested on usability and technical functioning. Possible areas for improvement (within reasonable limits) are processed into the final product.'
    }
    ,finally: {
      nl: `Deze offerte valt onder deze algemene voorwaarden: $\{data.terms}. Gaarne acceptatie van de offerte per mail bevestigen. Mochten er nog vragen zijn dan verneem ik dat graag. Ik hoop een gepast voorstel te hebben gedaan en ben benieuwd naar uw reactie.


Met vriendelijke groet,

Spongebob Squarepants
*‎Fry cook*`
      ,en: `This quotation is subject to: $\{data.terms}. Please confirm acceptance of the quotation by email. If you have any questions then let me know. I hope the proposal is appropriate and I'm looking forward to your response.


Met vriendelijke groet,

Spongebob Squarepants
*‎Fry cook*`
    }
  }
  ,config: {
    theme: 'default'
    ,themes: ['default','clean','vertical']
    ,projectNumberTemplate: '${project.dateYear}.${project.indexOnYear+1}'
    ,themeMainBgColor: '#FFFFFF'
    ,themeMainFgColor: '#333333'
    ,themeSecondaryBgColor: '#FFF244'
    ,themeSecondaryFgColor: '#ff0071'
    ,themeFontSize: 26
    ,themeFontMain: 'Schoolbell'
    ,themeFontCurrency: 'Allan'
    ,themeLogoCSS: `.invoice #logo {
      height: 73px;
      background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNC4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDQzMzYzKSAgLS0+DQo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgd2lkdGg9Ijc3LjE2N3B4IiBoZWlnaHQ9IjczLjI5MXB4IiB2aWV3Qm94PSI3LjczMiAxLjE0NyA3Ny4xNjcgNzMuMjkxIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDcuNzMyIDEuMTQ3IDc3LjE2NyA3My4yOTEiDQoJIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPGc+DQoJCTxnPg0KCQkJPGc+DQoJCQkJPHBhdGggZmlsbD0iIzEyMEUwQiIgZD0iTTI5LjUzMiw3Ljc1MmMwLjU5NC0wLjAzLDEuMTg2LTAuMDYzLDEuNzc4LTAuMDkxYzAuMTczLDEuMTQxLDAuMzA4LDIuMjg2LDAuMzcyLDMuNDM5DQoJCQkJCWMyLjIwNywwLjI4NCw0LjI3OSwxLjA4Miw2LjM1NywxLjgzN2MxLjE4OS0wLjYwNSwxLjc5Mi0yLjEwMSwyLjc2Ni0zLjAzNmMwLjQ0MiwwLjQxMiwwLjksMC44MTMsMS4zNzUsMS4xOTUNCgkJCQkJYy0wLjczMywxLjAwNC0xLjQxMiwyLjA1LTIuMTA0LDMuMDg2YzIuMTAxLDEuODE4LDMuOTYsMy45NzgsNS4xMzcsNi41MDdjMC42ODMsMS40MzYsMC45NzgsMy4wMSwxLjQ2Niw0LjUxMg0KCQkJCQljMC45NzMtNC42NTEsMy43NDEtOC45MSw3Ljg2NC0xMS4zNThjLTAuNDItMC44NjMtMC44NzMtMS43Mi0xLjE1Ny0yLjY0M2MwLjQzLTAuNTE2LDAuOTQtMC45NDYsMS40MzQtMS4zOTgNCgkJCQkJYzAuNTcsMS4wMTEsMS4xMzgsMi4wMiwxLjY3MSwzLjA0N2MyLjAzNi0wLjgxNCw0LjIwOS0xLjIxNCw2LjM5NS0xLjMyNmMwLjA3Ni0xLjE0OSwwLjE0NS0yLjI5OSwwLjI4NS0zLjQ0NA0KCQkJCQljMC42NTEsMC4wNzcsMS4zMDQsMC4xNTQsMS45NTUsMC4yMzZjMC4wOSwxLjEyMi0wLjMzLDIuNDA3LDAuMzQ5LDMuNDA3YzEuOTU0LDAuNTIzLDMuOTA5LDEuMDc2LDUuNjk2LDIuMDUNCgkJCQkJYzAuNTg4LTAuOTg2LDEuMDcyLTIuMDU1LDEuODYtMi45MDVjMC44NjktMC4yODksMS4yOTQsMC43NzMsMS45MDksMS4xODZjLTAuNjg0LDAuOTgyLTEuMjU4LDIuMDM2LTEuODMyLDMuMDgyDQoJCQkJCWMyLjM5MSwyLjI1OSw0LjQyNiw1LjAwNiw1LjMwOSw4LjIxNWMxLjUzMyw1LjM5NywwLjA0OSwxMS42NDYtMy45NzUsMTUuNjJjLTMuMDIxLDMuMDEtNy4yMjcsNC44OTMtMTEuNTEzLDQuODY0DQoJCQkJCWMtNC4xNjgsMC4wNzMtOC4yMTgtMS42NS0xMS4zMzEtNC4zNzFjLTEuMjYsMi41NjMtMS45MjQsNS4zMzEtMi42NTEsOC4wNjljLTAuODQyLTQuNjA3LDIuNTI5LTguNjYyLDIuMjQ0LTEzLjIyOQ0KCQkJCQljLTAuMjcxLTIuMTY4LTAuODMyLTQuNjM0LTIuNzc4LTUuOTA5Yy0xLjUzMy0wLjg3My0zLjYzOS0wLjIwOC00LjQ4NCwxLjMyNWMtMS44NzMsMi45LTEuMDYzLDYuNTEzLTAuNTU2LDkuNjkzDQoJCQkJCWMwLjI5OSwyLjU1MywxLjM2Niw0Ljk3OSwxLjI5NCw3LjU3NWMtMS4wODYtMi42NzQtMS45MzgtNS40MzYtMi44MTktOC4xODJjLTIuNjIsMi4yMDgtNS43MTEsNC4yMDMtOS4yMzEsNC4zOTcNCgkJCQkJYy0yLjk0MSwwLjE1NC02LjAxOSwwLjA4Ni04Ljc2Mi0xLjEyNmMtNS4zNjEtMi4zNzYtOS4yNC03Ljg0OC05LjU3NS0xMy43MjFjLTAuMzQ4LTUuNTY3LDIuNDEyLTExLjA2NCw2LjkxMS0xNC4zMTENCgkJCQkJYy0wLjQ5OC0wLjg5Ni0wLjk4Mi0xLjgwMi0xLjQyMi0yLjcyOWMwLjUzNC0wLjMxLDEuMDY4LTAuNjIsMS41OTgtMC45MjhjMC40NjEsMC44OTksMC45MSwxLjgsMS4zNjcsMi43DQoJCQkJCWMyLjE4MS0wLjk1NSw0LjQ2MS0xLjY5MSw2LjgzNy0xLjk4MUMyOS41NjQsOS45ODgsMjkuNTQyLDguODcxLDI5LjUzMiw3Ljc1MnogTTE4LjYzMSwxNy41NDUNCgkJCQkJYy0zLjUzNSw0LjIyOC00LjQ3MiwxMC40MTItMi40NzcsMTUuNTNjMS40MywzLjEyNywzLjY3LDYuMDgyLDYuODExLDcuNjM1YzMuNzI5LDIuMDYzLDguMzE3LDIuNDAyLDEyLjM3NywxLjIyMw0KCQkJCQljMi41MTItMC43MDEsNC41MjEtMi40MjIsNi40NDktNC4wODhjLTAuNDM2LTEuOTMyLTAuNDQzLTMuOTE5LTAuMzYyLTUuODg3YzAuMDk5LTIuNTU3LDEuODUxLTUuMDUxLDQuNDI1LTUuNjI1DQoJCQkJCWMtMC41MjktNS4xNTktMy41MTYtMTAuMTE5LTguMjE3LTEyLjQ3N0MzMS40NTYsMTAuNDk1LDIzLjA5NywxMi4xMDEsMTguNjMxLDE3LjU0NXogTTUzLjQyNCwxNS42ODENCgkJCQkJYy0zLjMzOCwyLjQ4My01LjQ4OCw2LjM2MS02LjAxNCwxMC40NzZjMS41OCwwLjUzOSwzLjA1MSwxLjUzNCwzLjc3OCwzLjA4N2MxLjczNywyLjgyMywxLjI2OSw2LjI2NywwLjg4Myw5LjM5DQoJCQkJCWMzLjg4NCwzLjg0OCw5Ljg2NSw1LjIyOCwxNS4xMDEsMy44MTRjMy4zNzctMC45NTUsNi4yOTEtMy4yMDgsOC4zNDYtNi4wMTRjNC4yMy02LjA2MSwzLjI2OC0xNS4yMzItMi40MDItMjAuMDY5DQoJCQkJCUM2Ny44NzUsMTEuMzksNTkuMDI4LDExLjE5Miw1My40MjQsMTUuNjgxeiIvPg0KCQkJPC9nPg0KCQk8L2c+DQoJPC9nPg0KCTxnPg0KCQk8Zz4NCgkJCTxnPg0KCQkJCTxwYXRoIGZpbGw9IiNGRUZFRkUiIGQ9Ik0xOC42MzEsMTcuNTQ1YzQuNDY2LTUuNDQzLDEyLjgyNC03LjA1MSwxOS4wMDYtMy42ODhjNC43MDEsMi4zNTYsNy42ODgsNy4zMTYsOC4yMTcsMTIuNDc3DQoJCQkJCWMtMi41NzQsMC41NzQtNC4zMjYsMy4wNjgtNC40MjUsNS42MjVjLTAuMDgxLDEuOTY4LTAuMDczLDMuOTU1LDAuMzYyLDUuODg4Yy0xLjkyOCwxLjY2Ni0zLjkzOCwzLjM4Ni02LjQ0OSw0LjA4Nw0KCQkJCQljLTQuMDYsMS4xODEtOC42NDcsMC44NDItMTIuMzc3LTEuMjIzYy0zLjE0MS0xLjU1My01LjM4MS00LjUwOC02LjgxMS03LjYzNUMxNC4xNiwyNy45NTgsMTUuMDk2LDIxLjc3MiwxOC42MzEsMTcuNTQ1eg0KCQkJCQkgTTMwLjk4OSwyMi4yNjljLTMuOTMzLDAuODc0LTYuMzQsNS4zNjItNC45Niw5LjEzN2MxLjA0MiwzLjc3OSw1LjU3MSw1Ljg2NSw5LjE3Myw0LjUyMWMzLjczOC0xLjQ2Niw1LjkxNS02LjM2OSwzLjk0Mi05Ljk5NQ0KCQkJCQlDMzcuNzEzLDIyLjk3MSwzNC4xNDgsMjEuNDI3LDMwLjk4OSwyMi4yNjl6Ii8+DQoJCQk8L2c+DQoJCTwvZz4NCgkJPGc+DQoJCQk8Zz4NCgkJCQk8cGF0aCBmaWxsPSIjRkVGRUZFIiBkPSJNNTMuNDI0LDE1LjY4MWM1LjYwNC00LjQ4OSwxNC40NTEtNC4yOTEsMTkuNjg5LDAuNjg0YzUuNjcyLDQuODM3LDYuNjM1LDE0LjAxLDIuNDAzLDIwLjA2OQ0KCQkJCQljLTIuMDU2LDIuODA2LTQuOTcsNS4wNTktOC4zNDUsNi4wMTRjLTUuMjM1LDEuNDEyLTExLjIxOSwwLjAzMi0xNS4xMDItMy44MTRjMC4zODUtMy4xMjMsMC44NTUtNi41NjUtMC44ODMtOS4zOQ0KCQkJCQljLTAuNzI5LTEuNTUzLTIuMTk5LTIuNTQ4LTMuNzc5LTMuMDg3QzQ3LjkzNiwyMi4wNDMsNTAuMDg2LDE4LjE2Niw1My40MjQsMTUuNjgxeiBNNTksMjEuNw0KCQkJCQljLTQuNDk0LDEuMDU5LTYuNTk1LDcuMTYzLTMuODc1LDEwLjgzM2MxLjc1MiwyLjUzOSw1LjEyNSwzLjc3LDguMDk4LDIuOTE5YzMuMDgxLTEuMjksNS4yNzUtNC41NDMsNC45MjgtNy45MzMNCgkJCQkJQzY3Ljc5MywyMy4yODgsNjIuOTk3LDIwLjI3NCw1OSwyMS43eiIvPg0KCQkJPC9nPg0KCQk8L2c+DQoJPC9nPg0KCTxnPg0KCQk8Zz4NCgkJCTxnPg0KCQkJCTxwYXRoIGZpbGw9IiMwMDBDMTEiIGQ9Ik01OSwyMS43YzMuOTk2LTEuNDI2LDguNzkzLDEuNTg4LDkuMTQ5LDUuODE5YzAuMzQ5LDMuMzktMS44NDcsNi42NDMtNC45MjgsNy45MzMNCgkJCQkJYy0yLjk3NCwwLjg1MS02LjM0NS0wLjM4LTguMDk3LTIuOTE5QzUyLjQwNywyOC44NjMsNTQuNTA2LDIyLjc1OCw1OSwyMS43eiBNNTguNTgxLDIyLjY1Yy0yLjEsMC42ODgtMy40OSwyLjcxNS0zLjg1NCw0LjgyOA0KCQkJCQljLTAuNjgxLDMuNjQ0LDIuNTUxLDcuNzI5LDYuMzg1LDcuMjk1YzMuNTE3LTAuMDA5LDYuNDUzLTMuNDE3LDYuMTY4LTYuODc0Yy0wLjAxNC0yLjU0My0yLjAxLTQuNzc4LTQuMzgxLTUuNDg5DQoJCQkJCUM2MS40NzYsMjIuMTAyLDU5Ljk1MiwyMi4xNTcsNTguNTgxLDIyLjY1eiIvPg0KCQkJPC9nPg0KCQk8L2c+DQoJCTxnPg0KCQkJPGc+DQoJCQkJPHBhdGggZmlsbD0iIzAwMEMxMSIgZD0iTTMwLjk4OSwyMi4yNjljMy4xNTktMC44NDIsNi43MjUsMC43MDIsOC4xNTUsMy42NjFjMS45NzMsMy42MjYtMC4yMDQsOC41MjktMy45NDIsOS45OTUNCgkJCQkJYy0zLjYwMiwxLjM0Ni04LjEzMS0wLjc0LTkuMTczLTQuNTIxQzI0LjY0OSwyNy42MzIsMjcuMDU2LDIzLjE0MywzMC45ODksMjIuMjY5eiBNMzAuOTcxLDIzLjEzNA0KCQkJCQljLTMuMTg2LDAuNzg3LTUuMTQ2LDQuMzIxLTQuMzMxLDcuNDY3YzAuNjM0LDMuODI5LDUuNDU4LDYuMTczLDguODM5LDQuMjNjNC4yODktMS43OTYsNC42MjQtOC42MiwwLjc3Ny0xMS4wNDYNCgkJCQkJQzM0LjcxMywyMi43NzcsMzIuNzIyLDIyLjU3MywzMC45NzEsMjMuMTM0eiIvPg0KCQkJPC9nPg0KCQk8L2c+DQoJPC9nPg0KCTxnPg0KCQk8Zz4NCgkJCTxnPg0KCQkJCTxwYXRoIGZpbGw9IiMzNkJFRjIiIGQ9Ik01OC41ODEsMjIuNjVjMS4zNzEtMC40OTMsMi44OTYtMC41NDgsNC4zMTYtMC4yNGMyLjM3MSwwLjcxMSw0LjM2NywyLjk0Niw0LjM4MSw1LjQ4OQ0KCQkJCQljMC4yODUsMy40NTctMi42NTIsNi44NjUtNi4xNjgsNi44NzRjLTMuODM0LDAuNDM1LTcuMDY0LTMuNjUxLTYuMzg1LTcuMjk1QzU1LjA5LDI1LjM2NSw1Ni40ODEsMjMuMzM3LDU4LjU4MSwyMi42NXoNCgkJCQkJIE01OS40NjcsMjQuODQ5Yy0yLjk3OSwxLjA1NC0zLjAyLDUuODU0LTAuMjgxLDcuMjE4YzIuMjk1LDEuMjk5LDUuODY5LDAuMDM2LDYuMTA1LTIuODA3DQoJCQkJCUM2Ni4xNzgsMjYuMDEyLDYyLjM0LDIzLjI5Niw1OS40NjcsMjQuODQ5eiIvPg0KCQkJPC9nPg0KCQk8L2c+DQoJPC9nPg0KCTxnPg0KCQk8Zz4NCgkJCTxnPg0KCQkJCTxwYXRoIGZpbGw9IiMzNUJFRjMiIGQ9Ik0zMC45NzEsMjMuMTM0YzEuNzUxLTAuNTYyLDMuNzQyLTAuMzU2LDUuMjg1LDAuNjUxYzMuODQ3LDIuNDI2LDMuNTEyLDkuMjUtMC43NzcsMTEuMDQ2DQoJCQkJCWMtMy4zODEsMS45NDEtOC4yMDUtMC40MDEtOC44MzktNC4yM0MyNS44MjYsMjcuNDU2LDI3Ljc4NiwyMy45MjEsMzAuOTcxLDIzLjEzNHogTTMxLjQ3MywyNS40ODcNCgkJCQkJYy0yLjc4NywwLjgxMS0zLjc3NCw0Ljk1MS0xLjM3NSw2Ljc1N2MyLjI0OCwyLjE5OSw2LjY1MSwwLjc0Miw2Ljc2NS0yLjUyNUMzNy4zNzksMjYuNzcyLDM0LjE5NCwyNC4zODMsMzEuNDczLDI1LjQ4N3oiLz4NCgkJCTwvZz4NCgkJPC9nPg0KCTwvZz4NCgk8Zz4NCgkJPGc+DQoJCQk8cGF0aCBmaWxsPSIjMTUxMzE1IiBkPSJNNTkuNDY3LDI0Ljg0OWMyLjg3My0xLjU1NCw2LjcxMSwxLjE2Myw1LjgyNCw0LjQxMWMtMC4yMzYsMi44NDMtMy44MTIsNC4xMDQtNi4xMDUsMi44MDcNCgkJCQlDNTYuNDUsMzAuNzA1LDU2LjQ4OSwyNS45MDMsNTkuNDY3LDI0Ljg0OXoiLz4NCgkJPC9nPg0KCQk8Zz4NCgkJCTxwYXRoIGZpbGw9IiMxNTEzMTUiIGQ9Ik0zMS40NzMsMjUuNDg3YzIuNzIxLTEuMTA0LDUuOTA2LDEuMjg1LDUuMzksNC4yM2MtMC4xMTMsMy4yNjktNC41MTcsNC43MjYtNi43NjUsMi41MjUNCgkJCQlDMjcuNjk5LDMwLjQzOCwyOC42ODYsMjYuMjk3LDMxLjQ3MywyNS40ODd6Ii8+DQoJCTwvZz4NCgk8L2c+DQoJPGc+DQoJCTxnPg0KCQkJPGc+DQoJCQkJPHBhdGggZmlsbD0iI0NBNTgyMSIgZD0iTTguNzM3LDQyLjYyNWMwLjQ0My0wLjY3OSwxLjYwNCwwLjA2MSwxLjA2OCwwLjcyNkM5LjM2Miw0NC4wMjgsOC4yMDQsNDMuMjksOC43MzcsNDIuNjI1eiIvPg0KCQkJPC9nPg0KCQk8L2c+DQoJCTxnPg0KCQkJPGc+DQoJCQkJPHBhdGggZmlsbD0iI0NBNTgyMSIgZD0iTTE0Ljk5Miw0Mi42NjZjMC43MzctMC4yMywwLjk5LDAuMDIsMC43NTUsMC43NTFDMTUuMDA0LDQzLjY1MiwxNC43NTIsNDMuNDAzLDE0Ljk5Miw0Mi42NjZ6Ii8+DQoJCQk8L2c+DQoJCTwvZz4NCgkJPGc+DQoJCQk8Zz4NCgkJCQk8cGF0aCBmaWxsPSIjQ0E1ODIxIiBkPSJNMTIuMjk0LDQ2Ljc5NmMwLjY1NS0wLjUyNywxLjQyMSwwLjYwNywwLjc0NywxLjA2MUMxMi4zNzksNDguMzksMTEuNjIsNDcuMjUsMTIuMjk0LDQ2Ljc5NnoiLz4NCgkJCTwvZz4NCgkJPC9nPg0KCTwvZz4NCgk8Zz4NCgkJPGc+DQoJCQk8Zz4NCgkJCQk8cGF0aCBmaWxsPSIjQ0E1ODIxIiBkPSJNNzYuNTM2LDQzLjQxM2MtMC4yNDItMC4yNDgtMC4xMDktMC44NTYsMC4xMDgtMS4wOTRjMC4yMTctMC4yMzYsMC41ODQtMC41NTIsMS4xODgtMC4zMjcNCgkJCQkJQzc4LjQzOSw0Mi4yMTUsNzguMTMzLDQ0LjA5OCw3Ni41MzYsNDMuNDEzIi8+DQoJCQk8L2c+DQoJCTwvZz4NCgkJPGc+DQoJCQk8Zz4NCgkJCQk8cGF0aCBmaWxsPSIjQ0E1ODIxIiBkPSJNODMuMTQyLDQyLjMzMmMwLjc4LTAuMjYzLDEuMTY2LDEuMDQ1LDAuMzM4LDEuMjE3QzgyLjcwNCw0My43OTcsODIuMzEyLDQyLjQ5OSw4My4xNDIsNDIuMzMyeiIvPg0KCQkJPC9nPg0KCQk8L2c+DQoJCTxnPg0KCQkJPGc+DQoJCQkJPHBhdGggZmlsbD0iI0NBNTgyMSIgZD0iTTc5LjQ1OCw0Ni4zNjhjMC44NTktMC4yODUsMS4yMTcsMS4xMzEsMC4zNDksMS4zMjFDNzguOTQzLDQ3Ljk4Myw3OC41ODgsNDYuNTUyLDc5LjQ1OCw0Ni4zNjh6Ii8+DQoJCQk8L2c+DQoJCTwvZz4NCgk8L2c+DQoJPGc+DQoJCTxnPg0KCQkJPGc+DQoJCQkJPHBhdGggZmlsbD0iIzBCMDYwQSIgZD0iTTIxLjQ2Niw0Ny40MTljMC4yOTQtMi4xMzIsMy4yNzEtMi41OTMsNC42MjktMS4xNzNjLTAuNzc3LDAuMDQ2LTEuNTU3LDAuMDY4LTIuMzM0LDAuMTAyDQoJCQkJCWMxLjAzNSw0LjQxNiw0LjY2NCw3LjY3NSw4LjU3NCw5LjY2YzcuNDI3LDMuODgzLDE2LjQxNCw0LjExNywyNC4zMDIsMS41NjNjNS43NjUtMS45MjksMTEuMzQ5LTUuNzAyLDEzLjYyMS0xMS41NjcNCgkJCQkJYy0wLjg4OSwwLjE0Ni0xLjc3NCwwLjMxLTIuNjYxLDAuNDQ4YzEuMTk4LTEuODczLDQuNjYxLTEuNjc1LDUuNDIyLDAuNTM5Yy0wLjY4OC0wLjI3Ni0xLjM1OC0wLjU3NS0yLjAzMi0wLjg2OQ0KCQkJCQljLTIuNjQ1LDcuMDU1LTkuNzI2LDExLjEyOC0xNi42MDcsMTMuMTczYy0wLjAwNCwwLjMzNS0wLjAxOSwxLjAxMS0wLjAyMiwxLjM0NWMtMC4wNSwxLjkwNC0wLjAzMiwzLjgxMS0wLjAzNiw1LjcxNg0KCQkJCQljLTAuMjAzLTAuMDA1LTAuNjA1LTAuMDEtMC44MDYtMC4wMTVjLTIuMTMyLTAuMDE4LTQuMjU5LTAuMjA0LTYuMzYyLTAuNTIzYy0wLjEyNy0xLjg1My0wLjA5LTMuNzA3LDAuMDA0LTUuNTU5DQoJCQkJCWMtMC4xOTMsMC4wNDctMC41NzQsMC4xMzMtMC43NjksMC4xNzhjLTAuMDE5LDEuODMzLTAuMDE5LDMuNjY1LTAuMDIyLDUuNTAydjAuMzU2Yy0yLjQ5OC0wLjA5NC01LDAuMDMyLTcuNDk0LTAuMjE3DQoJCQkJCWMtMC4wNzctMi4xODYtMC4wNTUtNC4zNzEsMC4xMzYtNi41NTJjLTUuMDIzLTEuNTEyLTEwLjIwNC0zLjcyMS0xMy40MzEtOC4wNTJjLTEuMTgyLTEuNTAyLTEuOTY5LTMuMjY0LTIuNTU3LTUuMDY3DQoJCQkJCUMyMi41MDIsNDYuNzUsMjEuOTkyLDQ3LjA5MywyMS40NjYsNDcuNDE5eiBNNDcuOTU4LDYwLjE5OWMtMC4wNzIsMS42MzQtMC4wOSwzLjI2OC0wLjAzNSw0LjkwMQ0KCQkJCQljMS44ODMtMC4wMDYsMy43NiwwLjEzNiw1LjYzOSwwLjI0OGMtMC4xNTQtMi4wMTUtMC4wNDEtNC4wMzIsMC4wMjEtNi4wNDZDNTEuNzE3LDU5LjY4Myw0OS44NDksNjAuMDQxLDQ3Ljk1OCw2MC4xOTl6DQoJCQkJCSBNMzkuNzkzLDU5LjYxYy0wLjA5OSwxLjg0Mi0wLjA1OSwzLjY4NS0wLjA1OSw1LjUyNWMxLjk1NSwwLjA1LDMuOTA5LDAuMTEyLDUuODY0LDAuMDk2YzAuMDcyLTEuNjY2LTAuMDI3LTMuMzMtMC4wNC00Ljk5Ng0KCQkJCQlDNDMuNjIzLDYwLjIxMiw0MS43MDgsNTkuODgxLDM5Ljc5Myw1OS42MXoiLz4NCgkJCTwvZz4NCgkJPC9nPg0KCTwvZz4NCgk8Zz4NCgkJPGc+DQoJCQk8cGF0aCBmaWxsPSIjRkVGRkZEIiBkPSJNNDcuOTU4LDYwLjE5OWMxLjg5My0wLjE1OCwzLjc2Mi0wLjUxNiw1LjYyNS0wLjg5NmMtMC4wNjMsMi4wMTQtMC4xNzcsNC4wMzEtMC4wMjEsNi4wNDYNCgkJCQljLTEuODc5LTAuMTEyLTMuNzU2LTAuMjU0LTUuNjM5LTAuMjQ4QzQ3Ljg2OCw2My40NjYsNDcuODgzLDYxLjgzMyw0Ny45NTgsNjAuMTk5eiIvPg0KCQk8L2c+DQoJPC9nPg0KCTxnPg0KCQk8Zz4NCgkJCTxwYXRoIGZpbGw9IiNGRUZGRkYiIGQ9Ik0zOS43OTMsNTkuNjFjMS45MTUsMC4yNzEsMy44MjksMC42MDMsNS43NjYsMC42MjVjMC4wMTMsMS42NjYsMC4xMTIsMy4zMywwLjA0LDQuOTk2DQoJCQkJYy0xLjk1NSwwLjAxOC0zLjkwOS0wLjA0Ni01Ljg2NC0wLjA5NkMzOS43MzUsNjMuMjk0LDM5LjY5NSw2MS40NTIsMzkuNzkzLDU5LjYxeiIvPg0KCQk8L2c+DQoJPC9nPg0KPC9nPg0KPC9zdmc+DQo=);
  }`
    ,invoiceCSS: `.invoice {
    #logo {
      width: 78px;
      margin: 0 0 10pt auto;
    }
  }`
    ,csvTemplate: '${project.invoiceNr}\\tD\\t${client.name}\\t${invoice.date}\\t${data.vatAmount}%\\t${currency(project.totalIncDiscounted)}\\tOmzet\\t${currency(project.totalDiscounted)}\\t${currency(project.totalVat)}\\tBank\\tKwartaal ${project.quarter+1}\\t${project.description}\\t${currency(project.totalIncDiscounted)}'
    ,langs: [
      'en'
      ,'nl'
    ]
    ,lang: 'en'
    ,currency: 'EUR'
    ,googleFontsAPIKey: 'AIzaSyAFYPRYJcm8kFOxnKJNpnCIPNoA1rEQ1NA'
    ,homeMessage: true
    ,cloudSelected: ''
    ,type: 'config'
    ,notifications: false
  }
}

let index = 0
const copy = data.copy
for (let key in copy){
  if (copy.hasOwnProperty(key)){
    copy[key].index = index
    index++
  }
}

export default data