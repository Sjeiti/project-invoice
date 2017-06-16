let invoice = {
  type: {
    invoice: 'invoice',
    reminder: 'reminder'
  },
  VAT: {
    null: 0,
    low: 6,
    high: 21
  },
  VAT_DEFAULT: 21,
  dateFormat: 'dd-MM-yyyy'
}


Object.freeze(invoice)
Object.freeze(invoice.type)
Object.freeze(invoice.VAT)

export const INVOICE = invoice