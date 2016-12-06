'use strict'

const Lucid  = use('Lucid')

class Purchased extends Lucid {
  static scopeActive (builder) {
    builder.where('deleted', 0)
  }

  user () {
    return this.belongsTo('App/Model/User', 'id', 'user_id')
  }

  title () {
    return this.belongsTo('App/Model/Title', 'id', 'title_id')
  }
}

module.exports = Purchased
