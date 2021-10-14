exports.query = (realtime, ref) => {
  return realtime.ref(ref).once('value').then(function (snapshot) {
    return snapshot.val()
  })
}

exports.simpleQuery = (realtime, ref) => this.query(realtime, ref)

// Assuming the child keys are timestamps
exports.filteredQuery = (realtime, ref, params) => {
  const startTimestamp = (new Date(params.from).getTime()).toString()
  const endTimestamp = (new Date(params.to + ' 23:59:59').getTime()).toString()

  return realtime.ref(ref).orderByKey().startAt(startTimestamp).endAt(endTimestamp).once('value').then(function (snapshot) {
    return snapshot.val()
  })
}
