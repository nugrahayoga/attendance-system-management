import Router from "next/router"
import hash from "@/utils/auth/hash"

export default class Auth {
	constructor() {
		this.authenticated = this.authenticated.bind(this)
		this.getProfile = this.getProfile.bind(this)
	}

	authenticated() {
		const user = localStorage.getItem("user")
		if (!user) return false
		return true
	}

	getProfile() {
		const user = localStorage.getItem("user")
		if (user) {
			const data = hash.decrypt(user)
			if (!data) {
				window.location.href = "/"
				return false
			}
			return JSON.parse(data)
		} else {
			Router.push({
				pathname: "/login",
			})
			return false
		}
	}

	getToken() {
		const user = localStorage.getItem("user")
		if (user) {
			const data = hash.decrypt(user)
			if (!data) {
				Router.push({
					pathname: "/login",
				})
				return false
			}
			return JSON.parse(data).token.token
		} else {
			Router.push({
				pathname: "/login",
			})
			return false
		}
	}
}
