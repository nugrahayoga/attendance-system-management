"use strict"

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema")

class AttendancesSchema extends Schema {
	up() {
		this.create("attendances", (table) => {
			table.increments()
			table.integer("user_id").unsigned().notNullable()
			table.boolean("clocked_in").defaultTo(false)
			table.timestamp("time_clock_in").nullable()
			table.timestamp("time_clocked_out").nullable()
			table.date("date_clock_in").nullable()
			table.date("date_clocked_out").nullable()
			table.integer("created_by", 10).notNullable().defaultTo("1")
			table.integer("updated_by", 10).notNullable().defaultTo("1")
			table.timestamps()
		})
	}

	down() {
		this.drop("attendances")
	}
}

module.exports = AttendancesSchema
