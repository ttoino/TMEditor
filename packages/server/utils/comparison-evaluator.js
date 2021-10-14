exports.compareAttributes = (e1, operator, e2) => {
  switch (operator) {
    case '==':
      return e1 === e2
    case '===':
      return e1 === e2
    case '!=':
      return e1 !== e2
    case '!==':
      return e1 !== e2
    case '>':
      return e1 > e2
    case '>=':
      return e1 >= e2
    case '<':
      return e1 < e2
    default:
      return e1 <= e2
  }
}
