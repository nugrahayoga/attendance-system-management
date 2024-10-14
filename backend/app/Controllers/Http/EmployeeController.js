"use strict"

const Employee = use("App/Models/Employee")
const User = use("App/Models/User")
const Database = use("Database")
const { validateAll } = use("Validator")
const Env = use("Env")
const rabbitmq = require("../../Helper/rabbitmq")

class EmployeeController {
	async create({ request, response, auth }) {
		if (!auth.user) {
			const data = {
				status: "error",
				message: "Unauthorized",
				data: null,
			}
			return response.status(401).send(data)
		}

		const { name, email, password, phone, address, position, role } =
			request.all()

		const rules = {
			name: "required",
			email: "required|email|unique:employees,email",
			phone: "required",
			address: "required",
			position: "required",
			role: "required",
		}

		const validation = await validateAll(request.all(), rules)
		if (validation.fails()) {
			const data = {
				status: "error",
				message: "Validation error",
				data: validation.messages(),
			}
			return response.status(400).send(data)
		}

		const trx = await Database.beginTransaction()
		try {
			const userName = name.toLowerCase().replace(/\s+/g, "")
			const user = await User.create(
				{
					username: userName,
					fullname: name,
					email: email,
					phone: phone,
					password: password,
					role: role,
					created_by: auth.user.id,
					updated_by: auth.user.id,
					created_at: new Date(),
					updated_at: new Date(),
				},
				trx
			)

			const employee = await Employee.create(
				{
					user_id: user.id,
					name: name,
					email: email,
					phone: phone,
					address: address,
					position: position,
					created_by: auth.user.id,
					updated_by: auth.user.id,
					created_at: new Date(),
					updated_at: new Date(),
				},
				trx
			)

			await trx.commit()
			const data = {
				status: "success",
				message: "Employee created",
				data: employee,
			}
			return response.status(200).send(data)
		} catch (error) {
			await trx.rollback()
			console.log(error)
			const data = {
				status: "error",
				message: "Create employee failed",
				data: null,
			}
			return response.status(500).send(data)
		}
	}

	async update({ request, response, auth }) {
		if (!auth.user) {
			const data = {
				status: "error",
				message: "Unauthorized",
				data: null,
			}
			return response.status(401).send(data)
		}

		const { id, name, email, phone, address, position } = request.all()

		const rules = {
			id: "required",
			name: "required",
			email: "required|email",
			phone: "required",
			address: "required",
			position: "required",
		}

		const validation = await validateAll(request.all(), rules)
		if (validation.fails()) {
			const data = {
				status: "error",
				message: "Validation error",
				data: validation.messages(),
			}
			return response.status(400).send(data)
		}

		const trx = await Database.beginTransaction()
		try {
			const user = await User.find(id)
			if (!user) {
				const data = {
					status: "error",
					message: "User not found",
					data: null,
				}
				return response.status(404).send(data)
			}

			await User.query().where("id", user.id).update(
				{
					fullname: name,
					email: email,
					phone: phone,
					updated_by: auth.user.id,
					updated_at: new Date(),
				},
				trx
			)

			await Employee.query().where("user_id", user.id).update(
				{
					name: name,
					email: email,
					phone: phone,
					address: address,
					position: position,
					updated_by: auth.user.id,
					updated_at: new Date(),
				},
				trx
			)

			await trx.commit()
			const data = {
				status: "success",
				message: "Employee updated",
				data: null,
			}
			return response.status(200).send(data)
		} catch (error) {
			await trx.rollback()
			console.log(error)
			const data = {
				status: "error",
				message: "Update employee failed",
				data: null,
			}
			return response.status(500).send(data)
		}
	}

	async delete({ request, response, auth }) {
		if (!auth.user) {
			const data = {
				status: "error",
				message: "Unauthorized",
				data: null,
			}
			return response.status(401).send(data)
		}

		const { id } = request.only(["id"])
		const formData = {
			id: id,
		}

		const rules = {
			id: "required",
		}

		const validation = await validateAll(formData, rules)
		if (validation.fails()) {
			const data = {
				status: "error",
				message: "Validation error",
				data: validation.messages(),
			}
			return response.status(400).send(data)
		}

		const trx = await Database.beginTransaction()
		try {
			const user = await User.find(formData.id)
			if (!user) {
				const data = {
					status: "error",
					message: "User not found",
					data: null,
				}
				return response.status(404).send(data)
			}

			await Employee.query().where("user_id", user.id).delete(trx)
			await User.query().where("id", user.id).delete(trx)

			await trx.commit()
			const data = {
				status: "success",
				message: "Employee deleted",
				data: null,
			}
			return response.status(200).send(data)
		} catch (error) {
			await trx.rollback()
			console.log(error)
			const data = {
				status: "error",
				message: "Delete employee failed",
				data: null,
			}
			return response.status(500).send(data)
		}
	}

	async getEmployeeById({ params, response, auth }) {
		if (!auth.user) {
			const data = {
				status: "error",
				message: "Unauthorized",
				data: null,
			}
			return response.status(401).send(data)
		}

		try {
			const employee = await Employee.find(params.id)
			if (!employee) {
				const data = {
					status: "error",
					message: "Employee not found",
					data: null,
				}
				return response.status(404).send(data)
			}

			const data = {
				status: "success",
				message: "Employee found",
				data: employee,
			}
			return response.status(200).send(data)
		} catch (error) {
			console.log(error)
			const data = {
				status: "error",
				message: "Get employee failed",
				data: null,
			}
			return response.status(500).send(data)
		}
	}

	async getEmployee({ response, auth }) {
		const user = await Employee.query()
			.where("user_id", auth.user.id)
			.first()
		if (!user) {
			const data = {
				status: "error",
				message: "User not found",
				data: null,
			}
			return response.status(404).send(data)
		}

		const data = {
			status: "success",
			message: "User found",
			data: user,
		}
		return response.status(200).send(data)
	}

	async getAllEmployee({ request, response, auth }) {
		if (!auth.user) {
			const data = {
				status: "error",
				message: "Unauthorized",
				data: null,
			}
			return response.status(401).send(data)
		}

		if (auth.user.role !== "admin") {
			const data = {
				status: "error",
				message: "Unauthorized",
				data: null,
			}
			return response.status(401).send(data)
		}

		const { page, limit } = request.only(["page", "limit"])

		const rules = {
			page: "required",
			limit: "required",
		}

		const validation = await validateAll({ page, limit }, rules)
		if (validation.fails()) {
			const data = {
				status: "error",
				message: "Validation error",
				data: validation.messages(),
			}
			return response.status(400).send(data)
		}

		try {
			const employee = await Employee.query()
				.orderBy("employees.id", "asc")
				.paginate(page, limit)

			const data = {
				status: "success",
				message: "Get all employee success",
				data: {
					employee,
				},
			}
			return response.status(200).send(data)
		} catch (error) {
			console.log(error)
			const data = {
				status: "error",
				message: "Get all employee failed",
				data: null,
			}
			return response.status(500).send(data)
		}
	}
}

module.exports = EmployeeController
