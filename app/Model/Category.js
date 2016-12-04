'use strict'

const Lucid = use('Lucid')

class Category extends Lucid {
  titles () {
    return this.hasMany('App/Model/Title')
  }
}

module.exports = Category
