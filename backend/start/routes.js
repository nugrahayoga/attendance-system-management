"use strict"

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route")

Route.on("/").render("welcome")
Route.post("login", "UserController.login").as("login").prefix("api/v1")
Route.get("/logout", "UserController.logout")
Route.group(() => {
	Route.get("/", ({ response }) => {
		response.header("Content-type", "application/json")
		response.type("application/json")
		let data = {
			title: "Attendance System Management",
			description: "Attendance API Services",
			version: "1.0",
		}
		return response.send(data)
	})

	Route.get(
		"/attendance/get-attendance",
		"AttendanceController.getAttendance"
	)
	Route.post(
		"/attendance/get-all-attendance",
		"AttendanceController.getAllAttendance"
	)
	Route.post(
		"/attendance/get-all-employee-attendance",
		"AttendanceController.getAllEmployeeAttendance"
	)
	Route.post("/attendance/clock-in", "AttendanceController.clockIn")
	Route.post("/attendance/clock-out", "AttendanceController.clockOut")

	Route.get("/employee/get-employee", "EmployeeController.getEmployee")
	Route.get(
		"/employee/get-employee-by-id/:id",
		"EmployeeController.getEmployeeById"
	)
	Route.post(
		"/employee/get-all-employee",
		"EmployeeController.getAllEmployee"
	)
	Route.post("/employee/create", "EmployeeController.create")
	Route.post("/employee/update", "EmployeeController.update")
	Route.post("/employee/delete", "EmployeeController.delete")
})
	.prefix("api/v1")
	.middleware(["auth:api"])
