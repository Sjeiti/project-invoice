let explain = {
  data: {
    name:                  ['name',                 'Your name'],
    address:               ['address',              'Your address'],
    zipcode:               ['zip code',             'Your zip code'],
    city:                  ['city',                 'Your city'],
    phone:                 ['phone',                'Your phone number'],
    vatNumber:             ['VAT number',           'VAT number'],
    kvkNumber:             ['COC number',           'Chamber of commerce id'],
    bank:                  ['bank',                 'Your bank account number'],
    iban:                  ['IBAN',                 'The IBAN code of your account number'],
    bic:                   ['BIC',                  'The BIC code of your bank'],
    bankName:              ['bank name',            'Your bank name'],
    country:               ['country',              'Your country'],
    reminderPeriod:        ['reminder period',      'Number of days the invoice is due'],
    vatAmounts:            ['VAT amounts',          'A comma separated list of VAT percentages, ie `21,6,0`'],
    interestAmount:        ['interest percentage',  'The amount of interest added when a reminder is sent (differs per country), ie `8.05`'],
    administrationCosts:   ['administration costs', 'The amount of administrations costs added when a reminder is sent, ie `25`'],
    terms:                 ['terms url',            'An optional url to your terms and conditions'],
    email:                 ['email address',        'An optional email address'],
    website:               ['website',              'An optional website url'],
    blog:                  ['blog',                 'An optional possible blog url'],
    hourrateMin:           ['minimum hourly rate',  'Minimum hourly rate to calculate the hourly rate (corresponding to `minimum hours`)'],
    hourrateMax:           ['maximum hourly rate',  'Maximum hourly rate to calculate the hourly rate (corresponding to `maximum hours`)'],
    hoursMin:              ['minimum hours',        'Minimum hours rate to calculate the hourly rate (corresponding to `minimum hourly`)'],
    hoursMax:              ['maximum hours',        'Maximum hours rate to calculate the hourly rate (corresponding to `maximum hourly`)']
  },
  project: {
    description:           ['project description'],
    invoiceNr:             ['invoice number'],
    hourlyRate:            ['hourly rate'],
    discountRate:          ['discount rate'],
    quotationBefore:       ['before quotation',     'text shown before the quote'],
    quotationAfter:        ['after quotation',      'text shown after the quote'],
    quotationDuration:     ['estimated duration',   'the estimated number of weeks the project wil take'],
    quotationDate:         ['quotation date'],
    quotationStartDate:    ['project start date']
  },
  settings: {
    backup:                ['backup',                    'download all the data or configuration as a json file'],
    restore:               ['restore',                   'load a json file to restore the data or configuration'],
    clear:                 ['clear',                     'clear all data from LocalStorage'],
    projectNumberTemplate: ['project number template'],
    csvTemplate:           ['csv template'],
    langs:                 ['languages',                 'A comma separated list of language ISO codes, ie `en,nl`. These are the languages you want to send your invoices in.'],
    homeMessage:           ['welcome message',           'show or hide the welcome message on the first page']
  },
  copy: {
    sender:                ['sender',                    'your contact information shown at the top of the invoice'],
    receiver:              ['receiver',                  'contact information of the client receiving the invoice'],
    footer:                ['footer',                    'footer information, shown at the footer'],
    reminder1:             ['first reminder',            'first reminder text'],
    reminder2:             ['later reminder',            'later reminder text'],
    exhortation_:          ['exhortation',               'exhortation text'],
    dateFormat:            ['date format',               'see: https://en.wikipedia.org/wiki/Date_format_by_country'],
    vat:                   ['VAT'],
    pagebreak:             ['page-break'],
    legalInterest:         ['legal interest'],
    administrationCosts:   ['administration costs']
  }
}

for (let s in explain) {
  Object.freeze(explain[s])
}
Object.freeze(explain)

export const EXPLAIN = explain