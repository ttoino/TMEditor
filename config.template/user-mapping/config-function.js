// Template example
exports.default = (data) => {
  var usersIdentifiers = [];
  // ----------- Example -----------
  var index = 1;
  for (var key in data) {
    var user = { key: key, id: 'Participant ' + index, ...data[key] };
    usersIdentifiers.push(user);
    index++;
  }
  // ----------- End of Example -----------

  return usersIdentifiers;
}