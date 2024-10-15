"use strict"

const { makePublisher } = require("amqp-simple-pub-sub")
const Env = use("Env")

class Publisher {
	async publish(routingKey, data) {
		const publisher = makePublisher({
			type: `${Env.get("RABBITMQ_TYPE")}`,
			url: `${Env.get("RABBITMQ_URL")}`,
			exchange: `${Env.get("EXCHANGE_NAME")}`,
			onError: (error) => {
				console.error("A connection error happened", error)
			},
			onClose: () => {
				console.log("The connection has closed.")
			},
		})
		await publisher.start()
		await publisher.publish(routingKey, data)
	}
}

module.exports = new Publisher()
