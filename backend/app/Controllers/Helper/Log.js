"use strict"

const parser = require("ua-parser-js")
const Env = use("Env")
const { randomUUID } = require("crypto")
const { MongoClient } = require("mongodb")

let db = null

class Log {
	async setConnectionMongo() {
		try {
			if (!db) {
				let url =
					"mongodb://" +
					Env.get("DB_MONGO_USERNAME") +
					":" +
					Env.get("DB_MONGO_PASSWORD") +
					"@" +
					Env.get("DB_MONGO_HOST") +
					":" +
					Env.get("DB_MONGO_PORT") +
					"/" +
					"?authSource=admin&maxPoolSize=20&w=majority"
				console.log("MONGO URL CONNECTION")
				console.log(url)
				var mongoClient = new MongoClient(url)
				await mongoClient.connect()
				const _db = mongoClient.db(Env.get("DB_MONGO_DATABASE"))
				db = _db
			}
			return db
		} catch (error) {
			console.log("ERROR INIT MONGO CONNECTION")
			console.log(error)
			return null
		}
	}

	async set(data) {
		try {
			if (!db) {
				await this.setConnectionMongo()
			}

			const logEnabled = Env.get("LOG_SYS")
			if (logEnabled) {
				const ua = parser(data.user_agent)
				const id = randomUUID()

				await db.collection("system_logs").insertOne({
					id: id,
					user_id: data.user_id || "",
					merchant_id: data.merchant_id || "",
					access: data.access || "",
					ip: data.ip || "",
					user_agent: data.user_agent || "",
					browser: `Name: ${ua.browser.name || ""}, Version: ${ua.browser.version || ""}`,
					cpu: `Arch: ${ua.cpu.architecture || ""}`,
					device: `Vendor: ${ua.device.vendor || ""}, Model: ${ua.device.model || ""}, Type: ${ua.device.type || ""}`,
					engine: `Name: ${ua.engine.name || ""}, Version: ${ua.engine.version || ""}`,
					os: `Name: ${ua.os.name || ""}, Version: ${ua.os.version || ""}`,
					url: data.url || "",
					method: data.method || "",
					param: data.params || "",
					body: data.body || "",
					response: JSON.stringify(data.response),
				})
			}
			return true
		} catch (error) {
			console.log("Set log error: ", error)
		}
	}
}

module.exports = new Log()
