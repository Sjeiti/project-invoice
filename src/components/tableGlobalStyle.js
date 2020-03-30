import {css} from 'styled-components'
import {StyledTable} from './Table'
import {size, color, breakpoint} from '../service/css'

const {breakpointLow, breakpointHigh} = breakpoint

export const tableGlobalStyle = css`
  ${StyledTable} {
    .drag { width: 1rem; }
    .paid { width: 2.5rem; }
    .last,
    .client,
    .description { 
      width: auto; 
      width: 100%; 
    }
    .nr { width: 4rem; }
    .times,
    .recent,
    .dateLatest,
    .date { width: 5.5rem; }
    .totalDiscounted,
    .totalVATDiscounted,
    .totalIncDiscounted { width: 7rem; }
    .invoices { width: 5rem; }
    .actions { width: 8rem; }
    .hours { width: 5rem; }
    .amount { width: 8rem; }
    .vat { width: 4rem; }
    .action { width: 2rem; }
    .allPaid { width: 3rem; }
    td div {}
    input {
      width: 100%;
    }
    input+span { transform: translateY(-2px); }
    @media ${breakpointLow} {
      //.last,
      //.description { width: 16vw; }
    } 
  } 
`