import useParticipants from './useParticipants'

export default function useCohorts () {
  const participants = useParticipants()
  const cohorts = new Set()

  participants.forEach(({ __cohort }) => {
    if (__cohort) {
      cohorts.add(__cohort)
    }
  })

  return [...cohorts]
}
