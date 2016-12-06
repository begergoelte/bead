'use strict'

const Schema = use('Schema')

class PurchasedTableSchema extends Schema {

  up () {
   this.create('purchased', table => {
      table.increments()
      table.string('username', 100).notNullabsle().unique()
      table.string('titlename', 100).notNullable().unique()
      table.string('e-mail',100).notNullable()
      table.string('phone', 100).notNullable()
      table.string('address', 100).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('purchased')
  }

}

module.exports = UsersTableSchema
