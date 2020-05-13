import {COUNTRIES} from './countries'

export const CURRENCY_ISO = {}
Object.keys(COUNTRIES).forEach(key=>{
  const country = COUNTRIES[key]
  country.currencies.forEach(({code, name, symbol})=>{
    if ([null, '(none)'].indexOf(code)===-1&&!CURRENCY_ISO[code]&&code.length===3){
      CURRENCY_ISO[code] = {code, name, symbol}
    }
  })
})