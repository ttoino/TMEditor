import { globalCss } from '@stitches/react'

const globalStyles = globalCss({
  '*': { boxSizing: 'border-box' },
  body: {
    fontFamily: '$body',
    color: '$text'
  },
  a: {
    color: '$primary',
    textDecoration: 'none',

    '&:hover': {
      opacity: 0.7
    }
  }

})

export default globalStyles
