"use strict"

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema")

class UserSchema extends Schema {
	up() {
		this.create("users", (table) => {
			table.increments()
			table.string("username", 80).notNullable().unique()
			table.string("email", 254).notNullable().unique()
			table.string("password", 60).notNullable()
			table.string("fullname").notNullable()
			table.enu("role", ["admin", "employee"]).defaultTo("employee")
			table.string("position").nullable()
			table.boolean("is_blocked").defaultTo(false)
			table.string("phone").nullable()
			table.integer("created_by", 10).notNullable().defaultTo("1")
			table.integer("updated_by", 10).notNullable().defaultTo("1")
			table.timestamps()
		})
	}

	down() {
		this.drop("users")
	}
}

module.exports = UserSchema
