const User = use("App/Models/User")
const { validateAll, rule } = use("Validator")

class UserController {
	async login({ request, response, auth }) {
		const { email, password } = request.all()
		try {
			let setLogin = false
			const isBlocked = await User.query()
				.where("email", email)
				.where("is_blocked", false)
				.first()
			if (isBlocked) {
				setLogin = await auth
					.authenticator("session")
					.attempt(email, password)
			} else {
				setLogin = false
			}

			if (setLogin) {
				const user = await auth.getUser()
				const token = await auth.authenticator("api").generate(user)
				const data = {
					status: "success",
					message: "Login success",
					data: {
						token,
						user,
					},
				}

				return response.status(200).send(data)
			}
		} catch (error) {
			console.log(error)
			const data = {
				status: "error",
				message: "Invalid email or password",
				data: {},
			}
			return response.status(401).send(data)
		}
	}

	async logout({ response, auth, session }) {
		try {
			await auth.logout()
			session.forget("user")
			session.clear()
			response.header("Clear-Site-Data", '"cache", "cookies", "storage"')

			const data = {
				status: "success",
				message: "Logout success",
				data: {},
			}
			return response.status(200).send(data)
		} catch (error) {
			const data = {
				status: "error",
				message: "Logout failed",
				data: error,
			}
			return response.status(500).send(data)
		}
	}

	async create({ request, response }) {
		const { email, password, username, fullname, role, position } =
			request.all()

		try {
			const formData = {
				username: username,
				email: email,
				fullname: fullname,
				password: password,
				role: role,
				is_blocked: false,
				position: position,
			}

			const rules = {
				location_id: "required",
				username: "required|unique:users,username",
				email: "required|email|unique:users,email",
				fullname: "required",
				password: [
					rule("required"),
					rule("min", 8),
					rule("max", 60),
					rule("regex", /[^A-Za-z0-9]/),
				],
				role: "required",
				position: "required",
			}

			const validationMessages = {
				"username.required": "Username harus diisi",
				"username.unique": "Username sudah digunakan",
				"email.required": "Email harus diisi",
				"email.email": "Email tidak valid",
				"email.unique": "Email sudah digunakan",
				"fullname.required": "Nama lengkap harus diisi",
				"password.required": "Password harus diisi",
				"password.min": "Password minimal 8 karakter",
				"password.max": "Password maksimal 60 karakter",
				"password.regex": "Password harus mengandung karakter unik",
				"user_type.required": "Tipe user harus diisi",
				"user_role.required": "Role user harus diisi",
				"position.required": "Posisi user harus diisi",
			}

			const validation = await validateAll(
				formData,
				rules,
				validationMessages
			)
			if (validation.fails()) {
				const data = {
					status: "error",
					message: "Validation error",
					data: validation.messages(),
				}
				return response.status(400).send(data)
			}

			const newUser = await User.create(formData)
			const data = {
				status: "success",
				message: "User created",
				data: newUser,
			}
			return response.status(200).send(data)
		} catch (error) {
			console.log(error)
			const data = {
				status: "error",
				message: "Internal Server Error",
				data: {},
			}
			return response.status(500).send(data)
		}
	}
}

module.exports = UserController
