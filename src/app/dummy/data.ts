/* tslint:disable:max-line-length */
const now = Date.now()
const week = 1000*60*60*24*7
const dateString = millis=>(new Date(millis)).toString()
const data = {
  timestamp: now,
  clients: [
    {
      nr: 1,
      name: 'Krusty Krab',
      address: '831 Bottomfeeder Lane',
      zipcode: '1000 DG',
      postbox: '',
      zippost: '',
      city: 'Bikini Bottom',
      phone: '',
      paymentterm: '21',
      contact: '',
      projects: [
        {
          clientNr: 1,
          description: 'Krabby Patty innovations',
          hourlyRate: 0,
          discount: 0,
          lines: [
            {
              description: '',
              hours: 0,
              vat: 21,
              amount: 1234
            },
            {
              description: '',
              hours: 0,
              vat: 21,
              amount: 444
            }
          ],
          invoices: [
            {
              date: dateString(now-7*week),
              type: 'invoice'
            },
            {
              date: dateString(now-4*week),
              type: 'reminder'
            },
            {
              date: dateString(now-2*week),
              type: 'reminder'
            },
            {
              date: dateString(now),
              type: 'reminder',
              interest: true
            }
          ],
          paid: false,
          quotationDate: dateString(now-8*week),
          quotationStartDate: dateString(now-8*week),
          quotationDuration: 7,
          quotationBefore: `### project

I, Spongebob Squarepants, hereby solemly swear to make one gazillion Krabby Patties.

### planning

%planning%
%pagebreak%`,
          quotationAfter: `### finally

%finally%`
        }
      ]
    }
  ],
  personal: {
    name: 'SpongeBob SquarePants',
    address: '124 Conch Street',
    zipcode: '',
    city: 'Bikini Bottom',
    phone: '',
    vatNumber: '1234567',
    kvkNumber: '9876543',
    bank: '192837465',
    iban: 'PO55BBBA0938282773',
    bic: 'BIBOBA',
    bankName: 'Bikini Bottom Bank',
    country: 'Pacific ocean',
    reminderPeriod: 7,
    vatAmount: '21',
    interestAmount: 8.05,
    administrationCosts: 25,
    terms: 'http://squarepants.org/terms.pdf',
    email: 'spongebob@squarepants.org',
    website: 'http://squarepants.org',
    blog: '',
    hourrateMin: '65',
    hourrateMax: '90',
    hoursMin: '32',
    hoursMax: '256',
    lang: 'nl,en'
  },
  copy: {
    sender: {
      nl: '**${data.name}**\n${data.address}\n${data.zipcode} ${data.city}\n${data.vatNumber}\nkvk ${data.kvkNumber}',
      en: '**${data.name}**\n${data.address}\n${data.zipcode} ${data.city}\n${data.vatNumber}\nkvk ${data.kvkNumber}'
    },
    receiver: {
      nl: '**${client.name}**\n${client.address}\n${client.zipcode} ${client.city}\n${client.contact}',
      en: '**${client.name}**\n${client.address}\n${client.zipcode} ${client.city}\n${client.contact}'
    },
    footer: {
      nl: 'Gelieve binnen **${client.paymentterm}** dagen over te maken op bankrekeningnummer (IBAN) **${data.iban}** t.n.v. ${data.name} onder vermelding van factuurnummer **${project.invoiceNr}**. Bij het verstrijken van de betalingstermijn worden administratiekosten en wettelijke rente in rekening gebracht.',
      en: 'Please transfer within ${data.reminderPeriod} days to IBAN ${data.iban}, ${data.bic}, bank name: ${data.bankName} quoting the invoice number. Upon expiry of the payment, administration costs and legal interest will be charged.'
    },
    invoice: {
      nl: 'factuur',
      en: 'invoice'
    },
    reminder: {
      nl: 'herinnering',
      en: 'reminder'
    },
    quotation: {
      nl: 'offerte',
      en: 'quotation'
    },
    reminder1: {
      nl: 'Uit de administratie blijkt dat factuur **${project.invoiceNr}** van *${project.dateFormatted}* al **${project.daysLate}** dagen geleden betaald had moeten zijn. Vanaf de tweede herinnering zal **€${data.administrationCosts}** administratiekosten  in rekening gebracht worden, alsmede de wettelijke rente. Mocht u de factuur inmiddels hebben betaald dan kunt u deze herinnering als niet verzonden beschouwen.',
      en: 'We\'ve noticed that invoice **${project.invoiceNr}** from *${project.dateFormatted}* should have been paid **${project.daysLate}** days ago. From the second reminder administration costs (**€${data.administrationCosts}**) and legal interest may be added.'
    },
    reminder2: {
      nl: 'Uit de administratie blijkt dat factuur **${project.invoiceNr}** van *${project.dateFormatted}* al **${project.daysLate}** dagen geleden betaald had moeten zijn. Er zijn **€${data.administrationCosts}** administratiekosten in rekening gebracht, alsmede de wettelijke rente. Mocht u de factuur inmiddels hebben betaald dan kunt u deze herinnering als niet verzonden beschouwen.',
      en: 'We\'ve noticed that invoice **${project.invoiceNr}** from *${project.dateFormatted}* should have been paid **${project.daysLate}** days ago. Administration costs (**€${data.administrationCosts}**) and legal interest have been added.'
    },
    exhortation: {
      nl: 'Aanmanging',
      en: 'Exhortation'
    },
    exhortation_: {
      nl: 'Uit de administratie blijkt dat factuur **${project.invoiceNr}** van *${project.dateFormatted}* al **${project.daysLate}** dagen geleden betaald had moeten zijn.\n<strong>De betaling dient uiterlijk binnen **${client.paymentterm}** dagen na dagtekening te zijn bijgeschreven. Wanneer deze termijn verstreken is zal de vordering uit handen worden gegeven.</strong>\nMocht u de factuur inmiddels hebben betaald dan kunt u deze aanmaning als niet verzonden beschouwen.\nDeze aanmaning zal u zowel per e-mail als per aangetekende post toekomen.',
      en: 'We\'ve noticed that invoice **${project.invoiceNr}** from *${project.dateFormatted}* should have been paid **${project.daysLate}** days ago. **Payment must be fullfilled within **${client.paymentterm}** days after this writing.** If this term is exceeded a debt-collection agency will be called in; the client is liable for any associated costs.'
    },
    dateFormat: {
      nl: 'dd-MM-yyyy',
      en: 'MM/dd/yyyy'
    },
    amount: {
      nl: 'bedrag',
      en: 'amount'
    },
    vat: {
      nl: 'BTW',
      en: 'VAT'
    },
    total: {
      nl: 'totaal',
      en: 'total'
    },
    subtotal: {
      nl: 'subtotaal',
      en: 'subtotal'
    },
    payment: {
      nl: 'betaling',
      en: 'payment'
    },
    date: {
      nl: 'datum',
      en: 'date'
    },
    concerns: {
      nl: 'betreft',
      en: 'concerns'
    },
    number: {
      nl: 'nummer',
      en: 'number'
    },
    legalInterest: {
      nl: 'wettelijke rente',
      en: 'legal interest'
    },
    administrationCosts: {
      nl: 'administratie kosten',
      en: 'administration costs'
    },
    pagebreak: {
      nl: '<div class=\'page-break\'></div>',
      en: '<div class=\'page-break\'></div>'
    },
    planning: {
      nl: `Bij acceptatie van de offerte kan vanaf %startdatum% worden gestart met de uitvoer. De looptijd bedraagt ongeveer %looptijd% weken.
Voor oplevering worden de onderdelen getest op gebruiksvriendelijkheid en technisch correct functioneren. Eventuele punten van verbetering (binnen redelijke grenzen) worden verwerkt in het eindproduct.`,
      en: 'Before delivery, the components are tested on usability and technical functioning. Possible areas for improvement (within reasonable limits) are processed into the final product.'
    },
    finally: {
      nl: `Deze offerte valt onder deze algemene voorwaarden: $\{data.terms}. Gaarne acceptatie van de offerte per mail bevestigen. Mochten er nog vragen zijn dan verneem ik dat graag. Ik hoop een gepast voorstel te hebben gedaan en ben benieuwd naar uw reactie.


Met vriendelijke groet,

Spongebob Squarepants
*‎Fry cook*`,
      en: `This quotation is subject to: $\{data.terms}. Please confirm acceptance of the quotation by email. If you have any questions then let me know. I hope the proposal is appropriate and I'm looking forward to your response.


Met vriendelijke groet,

Spongebob Squarepants
*‎Fry cook*`
    }
  }
}

let index = 0
const copy = data.copy
for (let key in copy) {
  if (copy.hasOwnProperty(key)) {
    copy[key].index = index
    index++
  }
}

export default data