import { getUIConfig } from '@app/api'
import React, { createContext, useContext, useEffect, useState } from 'react'

const ConfigContext = createContext<any>({})
type Props = {
  loading?: () => React.ReactNode | undefined,
  onError?: (error: any) => void,
  children?: React.ReactNode
}
type UIConfig = {
  api_url?: string,
  auth: {
    provider?: 'keycloak' | 'firebase',
    config?: any
  },
  theme: {
    logo?: string,
  } & { [key: string]: any }
}

export default ConfigContext

export const UIConfigProvider: React.FC<Props> = ({ loading, onError, children }) => {
  const [config, setConfig] = useState<any>()

  // fetch configuration once
  useEffect(() => {
    getUIConfig()
      .then((response) => setConfig(response))
      .catch(error => {
        onError?.(error)
        console.error('Error loading configuration ', error)
        setConfig({})
      })
  }, [onError])

  return (
    <ConfigContext.Provider value={config}>
      {config ? children : loading?.()}
    </ConfigContext.Provider>
  )
}

export function useUIConfig (): UIConfig {
  return useContext(ConfigContext)
}
