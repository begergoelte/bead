'use strict'

const Schema = use('Schema')

class TitlesSchema extends Schema {
  up () {
    this.create('titles', (table) => {
      table.increments()
      table.integer('category_id').unsigned().references('id').inTable('categories')
      table.integer('created_by_id').unsigned().references('id').inTable('users')
      table.string('name', 60).notNullable()
      table.text('description').notNullable()
      table.boolean('deleted').defaultTo(false).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('titles')
  }
}

module.exports = TitlesSchema
