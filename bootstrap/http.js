'use strict'


const app = require('./app')
const fold = require('adonis-fold')
const path = require('path')
const packageFile = path.join(__dirname, '../package.json')
require('./extend')

module.exports = function (callback) {
  fold.Registrar
    .register(app.providers)
    .then(() => {

      fold.Ioc.aliases(app.aliases)

      const Helpers = use('Helpers')
      const Env = use('Env')
      Helpers.load(packageFile, fold.Ioc)

      require('./events')

      use(Helpers.makeNameSpace('Http', 'kernel'))
      use(Helpers.makeNameSpace('Http', 'routes'))

      const Server = use('Adonis/Src/Server')
      Server.listen(Env.get('HOST'), Env.get('PORT'))
      if (typeof (callback) === 'function') {
        callback()
      }
    })
    .catch((error) => console.error(error.stack))
}
