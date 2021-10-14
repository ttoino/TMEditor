export const updateCohorts = users => {
  const cohorts = []

  if (Object.prototype.hasOwnProperty.call(users[0], 'cohort')) {
    users.forEach(({ cohort }) => {
      if (!cohorts.includes(cohort)) {
        cohorts.push(cohort)
      }
    })
  }

  // "Other" cohort must be replaced at the end of the list of options
  for (var x in cohorts) {
    if (cohorts[x] === 'Other') {
      cohorts.push(cohorts.splice(x, 1)[0])
    }
  }

  return {
    type: 'UPDATE_COHORTS',
    payload: cohorts
  }
}
