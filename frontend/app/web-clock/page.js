"use client"
import React from "react"
import toast from "react-hot-toast"
import axios from "axios"
import Layout from "@/components/layout"
import Breadcrumb from "@/components/breadcrumbs/breadcrumb"
import constants from "@/utils/constants"
import AuthServices from "@/components/auth/auth"
import TimeComponent from "@/utils/time"
import { DateTime } from "luxon"

const Auth = new AuthServices()

class WebClock extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			user: null,
			token: null,
			clockedIn: false,
			time: null,
			attendance: null,
		}

		this.handleClockIn = this.handleClockIn.bind(this)
		this.handleClockOut = this.handleClockOut.bind(this)
		this.getAttendance = this.getAttendance.bind(this)
		this.logout = this.logout.bind(this)
	}

	componentDidMount() {
		if (Auth.authenticated()) {
			this.setState({
				user: Auth.getProfile(),
				token: Auth.getToken(),
			})
		} else {
			window.location.href = "/"
		}
	}

	componentDidUpdate(_, prevState) {
		if (this.state.token && this.state.token !== prevState.token) {
			this.getAttendance()
		}
	}

	getAttendance() {
		axios({
			url: constants.NEXT_BASE_API_URL + "/attendance/get-attendance",
			headers: {
				Authorization: `Bearer ${this.state.token}`,
			},
			method: "GET",
			timeout: constants.TIMEOUT,
		})
			.then((response) => {
				if (response.status == 200) {
					const time = DateTime.fromISO(
						response.data.data.attendance.time_clock_in
					).toFormat("dd-MM-yyyy HH:mm")
					this.setState({
						attendance: response.data.data.attendance,
						clockedIn: response.data.data.attendance.clocked_in,
						time: time,
					})
				} else if (response.status == 400) {
					toast.error(response.data.message)
				} else {
					toast.error(response.data.message)
				}
			})
			.catch((error) => {
				console.log(error)
			})
	}

	handleClockIn = () => {
		axios({
			method: "POST",
			url: constants.NEXT_BASE_API_URL + "/attendance/clock-in",
			headers: {
				Authorization: `Bearer ${this.state.token}`,
			},
		})
			.then((response) => {
				if (response.status === 200) {
					this.setState({
						clockedIn: true,
						time: new Date().toLocaleTimeString(),
					})
					toast.success("Clocked in successfully")
					this.getAttendance()
				} else {
					toast.error("Failed to clock in")
				}
			})
			.catch((error) => {
				console.log(error)
				toast.error("Failed to clock in")
			})
	}

	handleClockOut = () => {
		axios({
			method: "POST",
			url: constants.NEXT_BASE_API_URL + "/attendance/clock-out",
			data: { attendance_id: this.state.attendance.id },
			headers: {
				Authorization: `Bearer ${this.state.token}`,
			},
		})
			.then((response) => {
				if (response.status === 200) {
					this.setState({
						clockedIn: false,
						time: new Date().toLocaleTimeString(),
					})
					toast.success("Clocked out successfully")
					this.getAttendance()
				} else {
					toast.error("Failed to clock out")
				}
			})
			.catch((error) => {
				console.log(error)
				toast.error("Failed to clock out")
			})
	}

	logout() {
		localStorage.clear()
		window.location.href = "/"
	}

	render() {
		return (
			<Layout>
				<Breadcrumb pageName="Web Clock" />
				<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-4">
					<div className="p-4 rounded shadow-md">
						<p className="mb-1">
							Selamat Datang,{" "}
							<>
								{this.state.user && (
									<b
										className="cursor-pointer text-blue-500 hover:underline"
										onClick={() => {
											window.location.href = "/profile"
										}}
									>
										{this.state.user
											? this.state.user.user.fullname
											: "[User Name]"}
									</b>
								)}
							</>
						</p>
					</div>
					<div className="p-4 rounded">
						<p className="mb-2">
							Status:{" "}
							<b>
								{this.state.clockedIn
									? "Clocked In"
									: "Clocked Out"}
							</b>
						</p>
						<p className="mb-4">
							Time: <b>{this.state.time}</b>
						</p>
						<p className="mb-4">
							Total Waktu Kerja:{" "}
							<b>
								{this.state.attendance?.clocked_in == 1
									? (() => {
											const timeClockIn = new Date(
												this.state.attendance.time_clock_in
											)
											const now = new Date()
											const diffMs = now - timeClockIn
											const diffHrs = Math.floor(
												diffMs / 3600000
											) // milliseconds to hours
											const diffMins = Math.floor(
												(diffMs % 3600000) / 60000
											) // remaining minutes
											return `${diffHrs} Jam ${diffMins} Menit`
										})()
									: "Anda belum melakukan proses presensi"}
							</b>
						</p>
						<div className="p-2"></div>
						<button
							className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center w-full sm:w-auto"
							onClick={
								this.state.clockedIn
									? this.handleClockOut
									: this.handleClockIn
							}
						>
							<svg
								className="w-5 h-5 mr-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
							{this.state.clockedIn ? "Clock Out" : "Clock In"}
						</button>
					</div>
					<div className="mt-4"></div>
					<div className="p-4 rounded shadow-md">
						<div
							style={{
								display: "table",
								margin: "auto",
								fontWeight: "bold",
								fontSize: "1.5rem",
							}}
						>
							<TimeComponent />
						</div>
					</div>
				</div>
			</Layout>
		)
	}
}

export default WebClock
