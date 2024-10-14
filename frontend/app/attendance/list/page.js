"use client"

import React from "react"
import Layout from "@/components/layout"
import AuthServices from "@/components/auth/auth"
import Breadcrumb from "@/components/breadcrumbs/breadcrumb"
import axios from "axios"
import toast from "react-hot-toast"
import constants from "@/utils/constants"
import hash from "@/utils/auth/hash"
import { DateTime } from "luxon"
import DatePicker from "react-datepicker"

const Auth = new AuthServices()

class Attendance extends React.Component {
	constructor(props) {
		super(props)
		const now = DateTime.now()
		this.state = {
			user: null,
			token: null,
			attendance: [],
			startDate: now.startOf("month").toJSDate(),
			endDate: now.toJSDate(),
			loading: true,
		}
		this.changeStartDate = this.changeStartDate.bind(this)
		this.changeEndDate = this.changeEndDate.bind(this)
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
			this.getAllAttendance()
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

	getAllAttendance() {
		let self = this
		toast.loading("Memuat data presensi...")
		axios({
			url:
				constants.NEXT_BASE_API_URL +
				"/attendance/get-all-employee-attendance",
			headers: {
				Authorization: `Bearer ${this.state.token}`,
			},
			data: {
				page: 1,
				limit: 10,
				start_date: self.state.startDate,
				end_date: self.state.endDate,
			},
			method: "POST",
			timeout: constants.TIMEOUT,
		})
			.then((response) => {
				if (response.status == 200) {
					self.setState({
						attendance: response.data.data.attendance.data,
						loading: false,
					})
					toast.dismiss()
				} else if (response.status == 400) {
					toast.error(response.data.message)
				} else {
					toast.error(response.data.message)
				}
			})
			.catch((error) => {
				toast.error("Terjadi kesalahan")
				console.log(error)
			})
	}

	changeStartDate(e) {
		this.setState({
			startDate: e,
		})
	}

	changeEndDate(e) {
		this.setState({
			endDate: e,
		})
	}

	render() {
		const { attendance, loading } = this.state
		if (loading) {
			return (
				<Layout>
					<div>Memuat data...</div>
				</Layout>
			)
		}

		return (
			<Layout>
				<Breadcrumb pageName="Daftar Presensi" />
				<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
					<div className="px-4 py-6 md:px-6 xl:px-7.5">
						<h4 className="text-xl font-semibold text-black dark:text-white">
							Presensi Karyawan
						</h4>
					</div>

					<div className="rounded-sm border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
						<div className="flex flex-col gap-5.5 p-6.5">
							<div className="flex flex-row gap-5.5">
								<div className="w-1/2">
									<label className="mb-3 block text-sm font-medium text-black dark:text-white">
										Tanggal Mulai
									</label>
									<div className="relative">
										<DatePicker
											className="w-full h-12 px-4 py-2 border border-stroke dark:border-strokedark rounded-md"
											selected={this.state.startDate}
											onChange={this.changeStartDate}
											dateFormat="dd/MM/yyyy"
										/>
									</div>
								</div>
								<div className="w-1/2">
									<label className="mb-3 block text-sm font-medium text-black dark:text-white">
										Tanggal Akhir
									</label>
									<div className="relative">
										<DatePicker
											className="w-full h-12 px-4 py-2 border border-stroke dark:border-strokedark rounded-md"
											selected={this.state.endDate}
											onChange={this.changeEndDate}
											dateFormat="dd/MM/yyyy"
										/>
									</div>
								</div>
								<div className="flex flex-row justify-end h-12 py-0 m-8">
									<button
										className="px-4 py-1 bg-blue-500 text-white rounded-md"
										onClick={() => this.getAllAttendance()}
									>
										Search
									</button>
								</div>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
						<div className="col-span-2 flex items-center">
							<p className="font-medium">Nama</p>
						</div>
						<div className="col-span-2 flex items-center">
							<p className="font-medium">Tanggal</p>
						</div>
						<div className="col-span-1 hidden items-center sm:flex">
							<p className="font-medium">Masuk</p>
						</div>
						<div className="col-span-1 flex items-center">
							<p className="font-medium">Pulang</p>
						</div>
						<div className="col-span-1 flex items-center">
							<p className="font-medium">Jam</p>
						</div>
						<div className="col-span-1 flex items-center">
							<p className="font-medium">Status</p>
						</div>
					</div>
					{attendance.length > 0 && (
						<>
							{attendance.map((item, key) => {
								const createdAt = item.created_at
									? DateTime.fromFormat(
											item.created_at,
											"yyyy-MM-dd HH:mm:ss"
										).toFormat("dd/MM/yyyy")
									: ""
								const clockIn = item.time_clock_in
									? DateTime.fromISO(
											item.time_clock_in
										).toFormat("HH:mm")
									: ""
								const clockOut = item.time_clocked_out
									? DateTime.fromISO(
											item.time_clocked_out
										).toFormat("HH:mm")
									: ""
								const totalHours =
									item.time_clock_in && item.time_clocked_out
										? DateTime.fromISO(
												item.time_clocked_out
											)
												.diff(
													DateTime.fromISO(
														item.time_clock_in
													),
													"hours"
												)
												.hours.toFixed(2)
										: ""

								return (
									<div
										className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
										key={key}
									>
										<div className="col-span-2 flex items-center">
											<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
												<p className="text-sm text-black dark:text-white">
													{item.fullname}
												</p>
											</div>
										</div>
										<div className="col-span-2 flex items-center">
											<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
												<p className="text-sm text-black dark:text-white">
													{createdAt}
												</p>
											</div>
										</div>
										<div className="col-span-1 hidden items-center sm:flex">
											<p className="text-sm text-black dark:text-white">
												{clockIn}
											</p>
										</div>
										<div className="col-span-1 flex items-center">
											<p className="text-sm text-black dark:text-white">
												{clockOut}
											</p>
										</div>
										<div className="col-span-1 flex items-center">
											<p className="text-sm text-black dark:text-white">
												{totalHours}
											</p>
										</div>
										<div className="col-span-1 flex items-center">
											<p className="text-sm text-black dark:text-white">
												{!item.time_clock_in ||
												!item.time_clocked_out ||
												totalHours < 9
													? "Error"
													: "OK"}
											</p>
										</div>
									</div>
								)
							})}
						</>
					)}
				</div>
			</Layout>
		)
	}
}

export default Attendance
