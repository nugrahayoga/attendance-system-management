"use client"

import React from "react"
import Layout from "@/components/layout"
import AuthServices from "@/components/auth/auth"
import Breadcrumb from "@/components/breadcrumbs/breadcrumb"
import axios from "axios"
import toast from "react-hot-toast"
import constants from "@/utils/constants"
import hash from "@/utils/auth/hash"

const Auth = new AuthServices()

class Dashboard extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			user: null,
			token: null,
			attendance: null,
		}
	}

	componentDidMount() {
		if (Auth.authenticated()) {
			this.setState({
				loggedIn: true,
				user: Auth.getProfile(),
				token: Auth.getToken(),
			})
		} else {
			Router.push({
				pathname: "/",
			})
		}
	}

	componentDidUpdate(_, prevState) {
		if (this.state.token && this.state.token !== prevState.token) {
			this.getUser()
			this.getAttendance()
		}
	}

	getUser() {
		const dataUser = localStorage.getItem("user")
		let user = null
		if (dataUser) {
			const data = hash.decrypt(dataUser)
			if (!data) {
				window.location.href = "/"
				return
			}
			user = JSON.parse(data)
			this.setState({ user: user.user })
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
					this.setState({
						attendance: response.data.data.attendance,
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

	render() {
		return (
			<Layout>
				<Breadcrumb pageName="Dashboard" />
				<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-10">
					<h1>
						Selamat datang di <i>Attendance Management System</i>,{" "}
						<b>{this.state.user?.fullname ?? ""}</b>!
					</h1>
					<div style={{ marginBottom: "20px" }}></div>

					{this.state.attendance?.clocked_in == 1 && (
						<div className="card dashboard-card-blue">
							<h2>Waktu Masuk</h2>
							<p>
								{this.state.attendance?.time_clock_in
									? new Date(
											this.state.attendance.time_clock_in
										).toLocaleTimeString()
									: ""}
							</p>
						</div>
					)}
					<div style={{ marginBottom: "20px" }}></div>

					{this.state.attendance?.clocked_in == 1 && (
						<div className="card dashboard-card-green">
							<h2>Total Waktu Kerja</h2>
							<p>
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
							</p>
						</div>
					)}
				</div>
				<style jsx>{`
					.dashboard-container {
						padding: 20px;
					}
					.dashboard-card-blue {
						background: #3c50e0;
						border-radius: 15px;
						box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
						padding: 20px;
						color: #fff;
						text-align: center;
					}

					.dashboard-card-green {
						background: #10b981;
						border-radius: 15px;
						box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
						padding: 20px;
						color: #fff;
						text-align: center;
					}
					.dashboard-card h2 {
						margin-bottom: 10px;
					}
					.dashboard-card p {
						font-size: 1.2em;
					}
				`}</style>
			</Layout>
		)
	}
}

export default Dashboard
