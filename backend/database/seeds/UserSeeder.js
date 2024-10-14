"use strict"

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory")
const Hash = use("Hash")
const User = use("App/Models/User")

class UserSeeder {
	async run() {
		const user = new User()
		user.fullname = "Administrator"
		user.username = "admin"
		user.email = "admin@admin.com"
		user.password = "admin"
		user.role = "admin"
		user.is_blocked = false
		user.position = "Manager"
		await user.save()
	}
}

module.exports = UserSeeder
