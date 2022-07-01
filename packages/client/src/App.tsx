import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AuthProvider } from './auth'
import { UIConfigProvider } from './config-provider'
import RouterProvider from './RouterProvider'
import { globalStyles } from './theme'
import ThemeApplier from './theme/ThemeApplier'

const queryClient = new QueryClient()

function App () {
  globalStyles()

  return (
    <QueryClientProvider client={queryClient}>
      <UIConfigProvider>
        <ThemeApplier>
          <AuthProvider>
            <RouterProvider />
          </AuthProvider>
        </ThemeApplier>
      </UIConfigProvider>
    </QueryClientProvider>
  )
}

export default App
