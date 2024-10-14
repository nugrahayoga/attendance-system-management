"use client"

import React from "react"
import axios from "axios"
import toast from "react-hot-toast"
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "@nextui-org/modal"
import Layout from "@/components/layout"
import AuthServices from "@/components/auth/auth"
import Breadcrumb from "@/components/breadcrumbs/breadcrumb"
import constants from "@/utils/constants"
import hash from "@/utils/auth/hash"

const Auth = new AuthServices()

class Employee extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			user: null,
			token: null,
			employee: null,
			loading: true,
			modalConfirm: false,
		}
		this.changeStartDate = this.changeStartDate.bind(this)
		this.changeEndDate = this.changeEndDate.bind(this)
		this.modalConfirm = this.modalConfirm.bind(this)
		this.handleDelete = this.handleDelete.bind(this)
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
			this.getAllEmployee()
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

	getAllEmployee() {
		let self = this
		toast.loading("Memuat data karyawan...")
		axios({
			url: constants.NEXT_BASE_API_URL + "/employee/get-all-employee",
			headers: {
				Authorization: `Bearer ${this.state.token}`,
			},
			data: {
				page: 1,
				limit: 10,
			},
			method: "POST",
			timeout: constants.TIMEOUT,
		})
			.then((response) => {
				if (response.status == 200) {
					self.setState({
						employee: response.data.data.employee.data,
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
				toast.dismiss()
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

	modalConfirm(userId = null) {
		this.setState((prevState) => ({
			modalConfirm: !prevState.modalConfirm,
			selectedUserId: userId,
		}))
	}

	handleDelete() {
		const { selectedUserId } = this.state
		toast.loading("Menghapus data karyawan...")
		axios({
			url: constants.NEXT_BASE_API_URL + "/employee/delete",
			headers: {
				Authorization: `Bearer ${this.state.token}`,
			},
			data: {
				id: selectedUserId,
			},
			method: "POST",
			timeout: constants.TIMEOUT,
		})
			.then((response) => {
				if (response.status == 200) {
					toast.dismiss()
					toast.success("Data karyawan berhasil dihapus")
					this.getAllEmployee()
				} else {
					toast.error(response.data.message)
				}
			})
			.catch((error) => {
				toast.dismiss()
				toast.error("Terjadi kesalahan")
				console.log(error)
			})
	}

	render() {
		const { employee, loading, modalConfirm } = this.state
		if (loading) {
			return <div></div>
		}

		return (
			<Layout>
				<Breadcrumb pageName="Daftar Karyawan" />
				<div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
					<div className="max-w-full overflow-x-auto">
						<div className="flex justify-between items-center mb-5">
							<button
								className="px-4 py-2 bg-blue-500 text-white rounded-md"
								onClick={() => {
									window.location.href = "/employee/create"
								}}
							>
								Buat Data Karyawan
							</button>
						</div>
						<table className="w-full table-auto">
							<thead>
								<tr className="bg-gray-2 text-left dark:bg-meta-4">
									<th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
										Nama Karyawan
									</th>
									<th className="px-4 py-4 font-medium text-black dark:text-white">
										Actions
									</th>
								</tr>
							</thead>
							<tbody>
								{employee.map((item, key) => (
									<tr key={key}>
										<td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
											<h5 className="font-medium text-black dark:text-white">
												{item.name}
											</h5>
										</td>
										<td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
											<div className="flex items-center space-x-3.5">
												<button
													className="hover:text-primary"
													onClick={() => {
														window.location.href =
															`/employee/edit/` +
															`${item.id}`
													}}
												>
													<svg
														className="fill-current"
														width="18"
														height="18"
														viewBox="0 0 24 24"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm2.92-2.92L14.06 6.19l1.41 1.41-8.14 8.14H5.92v-1.41zm14.85-9.19c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
															fill="currentColor"
														/>
													</svg>
												</button>
												<button
													className="hover:text-primary"
													onClick={() => {
														this.modalConfirm(
															item.id
														)
													}}
												>
													<svg
														className="fill-current"
														width="18"
														height="18"
														viewBox="0 0 18 18"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
															fill=""
														/>
														<path
															d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
															fill=""
														/>
														<path
															d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
															fill=""
														/>
														<path
															d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
															fill=""
														/>
													</svg>
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<Modal
						isOpen={modalConfirm}
						radius="lg"
						className="bg-white text-black rounded-xl dark:bg-boxdark dark:text-white"
					>
						<ModalContent>
							<ModalHeader></ModalHeader>
							<ModalBody>
								<div className="text-center">
									<h1 className="text-xl font-medium mb-3">
										Apakah anda yakin ingin menghapus data
										ini?
									</h1>
									<ModalFooter>
										<div className="flex justify-center space-x-3">
											<button
												className="px-4 py-2 bg-red-500 text-white rounded-md"
												onClick={() => {
													this.handleDelete()
													this.modalConfirm()
												}}
											>
												Hapus
											</button>
											<button
												className="px-4 py-2 bg-blue-500 text-white rounded-md"
												onClick={() => {
													this.modalConfirm()
												}}
											>
												Batal
											</button>
										</div>
									</ModalFooter>
								</div>
							</ModalBody>
						</ModalContent>
					</Modal>
				</div>
			</Layout>
		)
	}
}

export default Employee
