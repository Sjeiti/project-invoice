import styled from 'styled-components'
import { Link } from 'react-router-dom'
import {Button} from './Button'

/**
 * An anchor that looks like a button
 */
export const ButtonAnchor = styled(Link)`${Button.componentStyle.rules}`
