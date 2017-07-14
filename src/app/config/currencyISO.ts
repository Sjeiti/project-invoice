import {COUNTRIES} from './countries'

const currencyISO = {};
Object.keys(COUNTRIES).forEach(key=>{
  const country = COUNTRIES[key]
  country.currencies.forEach(({code,name,symbol})=>{
    if ([null,'(none)'].indexOf(code)==-1&&!currencyISO[code]&&code.length===3) {
      currencyISO[code] = {code,name,symbol}
    }
  })
})

export const CURRENCY_ISO = currencyISO
