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
    vatAmount:             ['VAT amount',           'The percentate of VAT, ie `21`'],
    interestAmount:        ['interest percentage',  'The amount of interest added when a reminder is sent (differs per country), ie `8.05`'],
    administrationCosts:   ['administration costs', 'The amount of administrations costs added when a reminder is sent, ie `25`'],
    terms:                 ['terms url',            'An optional url to your terms and conditions'],
    email:                 ['email address',        'An optional email address'],
    website:               ['website',              'An optional website url'],
    blog:                  ['blog',                 'An optional possible blog url'],
    hourrateMin:           ['minimum hourly rate',  'Minimum hourly rate to calculate the hourly rate (corresponding to `minimum hours`)'],
    hourrateMax:           ['maximum hourly rate',  'Maximum hourly rate to calculate the hourly rate (corresponding to `maximum hours`)'],
    hoursMin:              ['minimum hours',        'Minimum hours rate to calculate the hourly rate (corresponding to `minimum hourly`)'],
    hoursMax:              ['maximum hours',        'Maximum hours rate to calculate the hourly rate (corresponding to `maximum hourly`)'],
    lang:                  ['lang',                 'A comma separated list of language ISO codes, ie `en,nl`. These are the languages you want to send your invoices in.']
  },
  project: {
    description:           ['project description'],
    invoiceNr:             ['invoice number'],
    hourlyRate:            ['hourly rate'],
    discountRate:          ['discount rate'],
    quotationBefore:       ['before quotation', 'text shown before the quote'],
    quotationAfter:        ['after quotation',  'text shown after the quote'],
    quotationDate:         ['quotation date']
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
    sender:                ['sender',                    'text shown before the lorem ipsum'],
    receiver:              ['receiver',                  'text shown before the lorem ipsum'],
    footer:                ['footer',                    'text shown before the lorem ipsum'],
    reminder:              ['first reminder',            'text shown before the lorem ipsum'],
    reminder1:             ['second reminder',           'text shown before the lorem ipsum'],
    reminder2:             ['last reminder',             'text shown before the lorem ipsum'],
    quotation:             ['quotation',                 'text shown before the lorem ipsum'],
    exhortation_:          ['exhortation',               'text shown before the lorem ipsum'],
    total:                 ['total',                     'text shown before the lorem ipsum'],
    date:                  ['date',                      'text shown before the lorem ipsum'],
    dateFormat:            ['date format',               'text shown before the lorem ipsum'],
    amount:                ['amount',                    'text shown before the lorem ipsum'],
    vat:                   ['VAT',                       'text shown before the lorem ipsum'],
    pagebreak:             ['page-break',                'text shown before the lorem ipsum'],
    subtotal:              ['subtotal',                  'text shown before the lorem ipsum'],
    concerns:              ['concerns',                  'text shown before the lorem ipsum'],
    number:                ['number',                    'text shown before the lorem ipsum'],
    legalInterest:         ['legal interest',            'text shown before the lorem ipsum'],
    administrationCosts:   ['administration costs',      'text shown before the lorem ipsum']
  }
}


Object.freeze(explain)
Object.freeze(explain.data)

export const EXPLAIN = explain