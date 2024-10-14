"use strict"

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema")

class TokensSchema extends Schema {
	up() {
		this.create("tokens", (table) => {
			table.increments()
			table
				.integer("user_id")
				.unsigned()
				.references("id")
				.inTable("users")
			table.string("token", 255).notNullable().unique().index()
			table.string("type", 80).notNullable()
			table.boolean("is_revoked").defaultTo(false)
			table.integer("created_by", 10).notNullable().defaultTo("1")
			table.integer("updated_by", 10).notNullable().defaultTo("1")
			table.timestamps()
		})
	}

	down() {
		this.drop("tokens")
	}
}

module.exports = TokensSchema
