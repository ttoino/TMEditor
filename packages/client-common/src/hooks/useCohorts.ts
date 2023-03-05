import useParticipants from './useParticipants'

export default function useCohorts () {
  const { data } = useParticipants()
  const cohorts = new Set()

  data?.forEach(({ __cohort }) => {
    if (__cohort) {
      cohorts.add(__cohort)
    }
  })

  return [...cohorts]
}
