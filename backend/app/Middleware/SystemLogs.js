"use strict"

const Log = require("../Controllers/Helper/Log")
const Env = use("Env")

class SystemLogs {
	async handle({ params, request, response, auth }, next) {
		let user_id, merchant_id
		try {
			user_id = auth.user.id
			merchant_id = auth.user.merchant_id
		} catch (error) {
			user_id = 1
			merchant_id = 1
		}

		const logEnabled = Env.get("LOG_SYS")
		if (logEnabled) {
			await Log.set({
				user_id: user_id,
				access: "Backend",
				ip: request.ip(),
				user_agent: request.headers()["user-agent"],
				url: request.originalUrl(),
				method: request.method(),
				param: params,
				body: request.all(),
				response: response._lazyBody,
			})
		}

		await next()
	}
}

module.exports = SystemLogs
