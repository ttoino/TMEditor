require('fs').readdirSync(__dirname).forEach(file => {
  const name = file.split('.')[0]
  exports[name] = require('./' + name)
})
