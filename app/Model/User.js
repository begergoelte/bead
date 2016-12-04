'use strict'

const Lucid = use('Lucid')

class User extends Lucid {
  apiTokens () {
    return this.hasMany('App/Model/Token')
  }

  titles () {
    return this.hasMany('App/Model/Title')
  }
}

module.exports = User
