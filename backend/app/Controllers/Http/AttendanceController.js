"use strict"

const Attendance = use("App/Models/Attendance")
const Database = use("Database")
const { validateAll } = use("Validator")
const { DateTime } = require("luxon")

class AttendanceController {
	async getAttendance({ request, response, auth }) {
		if (!auth.user) {
			const data = {
				status: "error",
				message: "Unauthorized",
				data: null,
			}
			return response.status(401).send(data)
		}

		try {
			const startOfDay = DateTime.local().startOf("day").toJSDate()
			const endOfDay = DateTime.local().endOf("day").toJSDate()

			const attendance = await Attendance.query()
				.where("user_id", auth.user.id)
				.whereBetween("created_at", [startOfDay, endOfDay])
				.first()

			if (!attendance) {
				const data = {
					status: "error",
					message: "Get attendance failed",
					data: null,
				}
				return response.status(400).send(data)
			}

			const data = {
				status: "success",
				message: "Get attendance success",
				data: {
					attendance,
				},
			}
			return response.status(200).send(data)
		} catch (error) {
			console.log(error)
			const data = {
				status: "error",
				message: "Get attendance failed",
				data: null,
			}
			return response.status(500).send(data)
		}
	}

	async clockIn({ request, response, auth }) {
		if (!auth.user) {
			const data = {
				status: "error",
				message: "Unauthorized",
				data: null,
			}
			return response.status(401).send(data)
		}

		const checkAttendance = await Attendance.query()
			.where("user_id", auth.user.id)
			.where("created_at", new Date())
			.first()

		if (checkAttendance) {
			const data = {
				status: "error",
				message: "User already clocked in",
				data: null,
			}
			return response.status(400).send(data)
		}

		const formData = {
			clocked_in: true,
			time_clock_in: new Date(),
			date_clock_in: new Date(),
			user_id: auth.user.id,
			created_by: auth.user.id,
			updated_by: auth.user.id,
			created_at: new Date(),
			updated_at: new Date(),
		}

		const rules = {
			time_clock_in: "required",
			date_clock_in: "required",
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
			const attendance = await Attendance.create(formData, trx)
			await trx.commit()
			const data = {
				status: "success",
				message: "Clock in success",
				data: {
					attendance,
				},
			}
			return response.status(200).send(data)
		} catch (error) {
			console.log(error)
			await trx.rollback()
			const data = {
				status: "error",
				message: "Clock in failed",
				data: null,
			}
			return response.status(500).send(data)
		}
	}

	async clockOut({ request, response, auth }) {
		if (!auth.user) {
			const data = {
				status: "error",
				message: "Unauthorized",
				data: null,
			}
			return response.status(401).send(data)
		}

		const { attendance_id } = request.only(["attendance_id"])

		const formData = {
			attendance_id: attendance_id,
			time: new Date(),
			date: new Date(),
			updated_by: auth.user.id,
			updated_at: new Date(),
		}

		const rules = {
			attendance_id: "required",
			time: "required",
			date: "required",
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
			const attendance = await Attendance.query()
				.where("user_id", auth.user.id)
				.where("id", formData.attendance_id)
				.first()

			if (!attendance) {
				const data = {
					status: "error",
					message: "Clock out failed",
					data: null,
				}
				return response.status(400).send(data)
			}

			await Attendance.query().where("id", attendance.id).update(
				{
					clocked_in: false,
					time_clocked_out: formData.time,
					date_clocked_out: formData.date,
					updated_by: formData.updated_by,
					updated_at: formData.updated_at,
				},
				trx
			)

			await trx.commit()

			const data = {
				status: "success",
				message: "Clock out success",
				data: {
					attendance,
				},
			}
			return response.status(200).send(data)
		} catch (error) {
			await trx.rollback()
			const data = {
				status: "error",
				message: "Clock out failed",
				data: null,
			}
			return response.status(500).send(data)
		}
	}

	async getAllAttendance({ request, response, auth }) {
		if (!auth.user) {
			const data = {
				status: "error",
				message: "Unauthorized",
				data: null,
			}
			return response.status(401).send(data)
		}

		const { page, limit, start_date, end_date } = request.only([
			"page",
			"limit",
			"start_date",
			"end_date",
		])

		const rules = {
			page: "required",
			limit: "required",
		}

		const validation = await validateAll(
			{ page, limit, start_date, end_date },
			rules
		)
		if (validation.fails()) {
			const data = {
				status: "error",
				message: "Validation error",
				data: validation.messages(),
			}
			return response.status(400).send(data)
		}

		try {
			const startDate =
				DateTime.fromISO(start_date).toFormat("yyyy-MM-dd HH:mm")
			const endDate =
				DateTime.fromISO(end_date).toFormat("yyyy-MM-dd HH:mm")

			const attendance = await Attendance.query()
				.where("user_id", auth.user.id)
				.where(function () {
					if (start_date && end_date) {
						this.whereBetween("created_at", [startDate, endDate])
					}
				})
				.orderBy("id", "desc")
				.paginate(page, limit)

			const data = {
				status: "success",
				message: "Get all attendance success",
				data: {
					attendance,
				},
			}
			return response.status(200).send(data)
		} catch (error) {
			const data = {
				status: "error",
				message: "Get all attendance failed",
				data: null,
			}
			return response.status(500).send(data)
		}
	}

	async getAllEmployeeAttendance({ request, response, auth }) {
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

		const { page, limit, start_date, end_date } = request.only([
			"page",
			"limit",
			"start_date",
			"end_date",
		])

		const rules = {
			page: "required",
			limit: "required",
		}

		const validation = await validateAll(
			{ page, limit, start_date, end_date },
			rules
		)
		if (validation.fails()) {
			const data = {
				status: "error",
				message: "Validation error",
				data: validation.messages(),
			}
			return response.status(400).send(data)
		}

		try {
			const startDate =
				DateTime.fromISO(start_date).toFormat("yyyy-MM-dd HH:mm")
			const endDate =
				DateTime.fromISO(end_date).toFormat("yyyy-MM-dd HH:mm")

			const attendance = await Attendance.query()
				.select(
					"attendances.id",
					"attendances.user_id",
					"attendances.clocked_in",
					"attendances.time_clock_in",
					"attendances.date_clock_in",
					"attendances.time_clocked_out",
					"attendances.date_clocked_out",
					"attendances.created_at",
					"attendances.updated_at",
					"users.fullname"
				)
				.innerJoin("users", "attendances.user_id", "users.id")
				.where(function () {
					if (start_date && end_date) {
						this.whereBetween("attendances.created_at", [
							startDate,
							endDate,
						])
					}
				})
				.orderBy("attendances.id", "desc")
				.paginate(page, limit)

			const data = {
				status: "success",
				message: "Get all attendance success",
				data: {
					attendance,
				},
			}
			return response.status(200).send(data)
		} catch (error) {
			console.log(error)
			const data = {
				status: "error",
				message: "Get all attendance failed",
				data: null,
			}
			return response.status(500).send(data)
		}
	}
}

module.exports = AttendanceController
