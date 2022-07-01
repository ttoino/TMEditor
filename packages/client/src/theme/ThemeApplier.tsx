import { useUIConfig } from '@app/config-provider'
import { createTheme } from '@stitches/react'
import React from 'react'

interface Props {
  children?: React.ReactNode
}

export const ThemeApplier: React.FC<Props> = ({ children }) => {
  const uiConfig = useUIConfig()

  const theme = uiConfig.theme && createTheme(uiConfig.theme)
  return (
    <div className={theme || ''}>
      {children}
    </div>
  )
}

export default ThemeApplier
