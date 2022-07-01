import { useQuery } from 'react-query'

import { getParticipants } from '@app/api/index'
import { useUIConfig } from '@app/config-provider'

type Participant = {
  __key: string,
  __label: string,
  __cohort?: string,
}

export default function useParticipants(): Participant[] {
  const uiConfig = useUIConfig()
  const { data = [] } = useQuery('participants', () => getParticipants(uiConfig?.api_url))

  return data
}
