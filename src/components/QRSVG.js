import React, {forwardRef, useEffect, useState} from 'react'
import styled from 'styled-components'
import QRCode from 'qrcode-svg/dist/qrcode.min.js'

const Element = styled.div`
  width: 400px;
  height: 400px;
  max-width: 100%;
  margin: 1rem 0;
  svg {
    width: 100%;
    height: 100%;
  }
`

export const QRSVG = forwardRef((props, ref) => {
  const {content} = props
  const [qrCode, setQrCode] = useState('')

  useEffect(()=>{
    if (content) {
      const svg = new QRCode({
        content
        , padding: 0
        , container: 'svg-viewbox'
      }).svg()
      setQrCode(svg.toString())
    } else {
      setQrCode('')
    }
  }, [content])

  return <Element ref={ref} {...props} dangerouslySetInnerHTML={{ __html: qrCode }} />
})
