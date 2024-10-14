"use strict"

/*
|--------------------------------------------------------------------------
| EmployeeSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory")
const Employee = use("App/Models/Employee")

class EmployeeSeeder {
	async run() {
		const employee = new Employee()
		employee.user_id = 1
		employee.name = "Jane Doe"
		employee.email = "admin@admin.com"
		employee.phone = "08123456789"
		employee.address = "Jl. Raya No. 123"
		employee.position = "Manager"
		await employee.save()
	}
}

module.exports = EmployeeSeeder
