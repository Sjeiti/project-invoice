const invoice = {
  type: {
    invoice: 'invoice'
    , reminder: 'reminder'
  }
  , dateFormat: 'dd-MM-yyyy'
}

Object.freeze(invoice)
Object.freeze(invoice.type)

export const INVOICE = invoice

