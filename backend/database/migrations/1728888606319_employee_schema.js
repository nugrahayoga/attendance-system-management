"use strict"

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema")

class EmployeeSchema extends Schema {
	up() {
		this.create("employees", (table) => {
			table.increments()
			table
				.integer("user_id")
				.unsigned()
				.references("id")
				.inTable("users")
			table.string("name", 80).notNullable()
			table.string("email", 254).notNullable().unique()
			table.string("phone", 20).notNullable().unique()
			table.string("address", 254).notNullable()
			table.string("position", 80).notNullable()
			table.integer("created_by", 10).notNullable().defaultTo("1")
			table.integer("updated_by", 10).notNullable().defaultTo("1")
			table.timestamps()
		})
	}

	down() {
		this.drop("employees")
	}
}

module.exports = EmployeeSchema
