let attribute = {
  'data.iban':                  {pattern:'[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}'},
  'data.bic':                   {pattern:'([a-zA-Z]{4}[a-zA-Z]{2}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?)'},
  'data.reminderPeriod':        {type:'number',min:0,step:1},
  'data.vatAmounts':            {pattern:'\\\d\\\d?(\\.\\\d+)?(,\\\d\\\d?(\\.\\\d+)?)*'},
  'data.interestAmount':        {type:'number',min:0,max:100,step:0.01},
  'data.administrationCosts':   {type:'number',min:0,step:0.01},
  'data.terms':                 {type:'url'},
  'data.email':                 {type:'email'},
  'data.website':               {type:'url'},
  'data.blog':                  {type:'url'},
  'data.hourrateMin':           {type:'number',min:0,step:0.1},
  'data.hourrateMax':           {type:'number',min:0,step:0.1},
  'data.hoursMin':              {type:'number',min:0,step:1},
  'data.hoursMax':              {type:'number',min:0,step:1},
  'settings.langs':             {pattern:'\\\w\\\w(,\\\w\\\w)*'}
}
Object.freeze(attribute)
export const ATTRIBUTE = attribute