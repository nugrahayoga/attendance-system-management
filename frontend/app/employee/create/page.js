"use client"
import React from "react"
import Layout from "@/components/layout"
import Breadcrumb from "@/components/breadcrumbs/breadcrumb"
import AuthServices from "@/components/auth/auth"
import hash from "@/utils/auth/hash"
import axios from "axios"
import toast from "react-hot-toast"
import constants from "@/utils/constants"

const Auth = new AuthServices()

class EditProfile extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			user: null,
			picture: null,
			formData: {},
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

		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	componentDidUpdate(_, prevState) {
		if (this.state.token && this.state.token !== prevState.token) {
			this.getUser()
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

	handleChange = (e) => {
		const { name, value } = e.target
		this.setState({
			formData: {
				...this.state.formData,
				[name]: value,
			},
		})
	}

	handleSubmit = (e) => {
		toast.loading("Membuat data karyawan...")

		e.preventDefault()
		const { password, ...data } = this.state.formData
		const dataToSubmit = password ? this.state.formData : data

		axios({
			url: constants.NEXT_BASE_API_URL + "/employee/create",
			headers: {
				Authorization: `Bearer ${this.state.token}`,
			},
			data: dataToSubmit,
			method: "POST",
			timeout: constants.TIMEOUT,
		})
			.then((response) => {
				if (response.status == 200) {
					toast.success("Data karyawan berhasil dibuat")
					toast.dismiss()
					setTimeout(() => {
						window.location.href = "/employee"
					}, 2000)
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

	render() {
		return (
			<Layout>
				<div className="mx-auto max-w-270">
					<Breadcrumb pageName="Buat Data Karyawan" />

					<div className="grid">
						<div className="col-span-5 xl:col-span-3">
							<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
								<div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
									<h3 className="font-medium text-black dark:text-white">
										Buat Data Karyawan
									</h3>
								</div>
								<div className="p-7">
									<form
										action="#"
										onSubmit={this.handleSubmit}
									>
										<div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
											<div className="w-full sm:w-1/2">
												<label
													className="mb-3 block text-sm font-medium text-black dark:text-white"
													htmlFor="fullName"
												>
													Nama
												</label>
												<div className="relative">
													<span className="absolute left-4.5 top-4">
														<svg
															className="fill-current"
															width="20"
															height="20"
															viewBox="0 0 20 20"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<g opacity="0.8">
																<path
																	fillRule="evenodd"
																	clipRule="evenodd"
																	d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
																	fill=""
																/>
																<path
																	fillRule="evenodd"
																	clipRule="evenodd"
																	d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
																	fill=""
																/>
															</g>
														</svg>
													</span>
													<input
														className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
														type="text"
														name="name"
														id="name"
														placeholder="Nama"
														defaultValue=""
														onChange={
															this.handleChange
														}
													/>
												</div>
											</div>

											<div className="w-full sm:w-1/2">
												<label
													className="mb-3 block text-sm font-medium text-black dark:text-white"
													htmlFor="phone"
												>
													Nomor Telepon
												</label>
												<input
													className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
													type="text"
													name="phone"
													id="phone"
													placeholder="Nomor Telepon"
													defaultValue=""
													onChange={this.handleChange}
												/>
											</div>
										</div>

										<div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
											<div className="w-full sm:w-1/2">
												<label
													className="mb-3 block text-sm font-medium text-black dark:text-white"
													htmlFor="role"
												>
													Peran
												</label>
												<div className="relative">
													<span className="absolute left-4.5 top-4">
														<svg
															className="fill-current"
															width="18"
															height="19"
															viewBox="0 0 18 19"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<g clipPath="url(#clip0_130_9814)">
																<path
																	d="M12.7127 0.55835H9.53457C8.80332 0.55835 8.18457 1.1771 8.18457 1.90835V3.84897C8.18457 4.18647 8.46582 4.46772 8.80332 4.46772C9.14082 4.46772 9.45019 4.18647 9.45019 3.84897V1.88022C9.45019 1.82397 9.47832 1.79585 9.53457 1.79585H12.7127C13.3877 1.79585 13.9221 2.33022 13.9221 3.00522V15.0709C13.9221 15.7459 13.3877 16.2802 12.7127 16.2802H9.53457C9.47832 16.2802 9.45019 16.2521 9.45019 16.1959V14.2552C9.45019 13.9177 9.16894 13.6365 8.80332 13.6365C8.43769 13.6365 8.18457 13.9177 8.18457 14.2552V16.1959C8.18457 16.9271 8.80332 17.5459 9.53457 17.5459H12.7127C14.0908 17.5459 15.1877 16.4209 15.1877 15.0709V3.03335C15.1877 1.65522 14.0627 0.55835 12.7127 0.55835Z"
																	fill=""
																/>
																<path
																	d="M10.4346 8.60205L7.62207 5.7333C7.36895 5.48018 6.97519 5.48018 6.72207 5.7333C6.46895 5.98643 6.46895 6.38018 6.72207 6.6333L8.46582 8.40518H3.45957C3.12207 8.40518 2.84082 8.68643 2.84082 9.02393C2.84082 9.36143 3.12207 9.64268 3.45957 9.64268H8.49395L6.72207 11.4427C6.46895 11.6958 6.46895 12.0896 6.72207 12.3427C6.83457 12.4552 7.00332 12.5114 7.17207 12.5114C7.34082 12.5114 7.50957 12.4552 7.62207 12.3145L10.4346 9.4458C10.6877 9.24893 10.6877 8.85518 10.4346 8.60205Z"
																	fill=""
																/>
															</g>
															<defs>
																<clipPath id="clip0_130_9814">
																	<rect
																		width="18"
																		height="18"
																		fill="white"
																		transform="translate(0 0.052124)"
																	></rect>
																</clipPath>
															</defs>
														</svg>
													</span>
													<select
														className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
														name="role"
														id="role"
														onChange={
															this.handleChange
														}
													>
														<option value="admin">
															Admin
														</option>
														<option value="employee">
															User
														</option>
													</select>
												</div>
											</div>

											<div className="w-full sm:w-1/2">
												<label
													className="mb-3 block text-sm font-medium text-black dark:text-white"
													htmlFor="emailAddress"
												>
													Alamat Email
												</label>
												<div className="relative">
													<span className="absolute left-4.5 top-4">
														<svg
															className="fill-current"
															width="20"
															height="20"
															viewBox="0 0 20 20"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<g opacity="0.8">
																<path
																	fillRule="evenodd"
																	clipRule="evenodd"
																	d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z"
																	fill=""
																/>
																<path
																	fillRule="evenodd"
																	clipRule="evenodd"
																	d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z"
																	fill=""
																/>
															</g>
														</svg>
													</span>
													<input
														className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
														type="email"
														name="email"
														id="email"
														placeholder="Alamat Email"
														defaultValue=""
														onChange={
															this.handleChange
														}
													/>
												</div>
											</div>
										</div>

										<div className="mb-5.5">
											<label
												className="mb-3 block text-sm font-medium text-black dark:text-white"
												htmlFor="position"
											>
												Alamat
											</label>
											<div className="relative">
												<textarea
													rows={4}
													type="text"
													name="address"
													id="address"
													placeholder="Alamat"
													className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
													onChange={this.handleChange}
												></textarea>
											</div>
										</div>

										<div className="mb-5.5">
											<label
												className="mb-3 block text-sm font-medium text-black dark:text-white"
												htmlFor="position"
											>
												Jabatan
											</label>
											<div className="relative">
												<span className="absolute left-4.5 top-4">
													<svg
														className="fill-current"
														width="18"
														height="18"
														viewBox="0 0 18 18"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
															fill=""
														></path>
														<path
															d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
															fill=""
														></path>
													</svg>
												</span>
												<input
													className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
													type="text"
													name="position"
													id="position"
													placeholder="Jabatan"
													defaultValue=""
													onChange={this.handleChange}
												/>
											</div>
										</div>

										<div className="mb-5.5">
											<label
												className="mb-3 block text-sm font-medium text-black dark:text-white"
												htmlFor="emailAddress"
											>
												Kata Sandi
											</label>
											<div className="relative">
												<span className="absolute left-4.5 top-4">
													<svg
														className="fill-current"
														width="20"
														height="20"
														viewBox="0 0 20 20"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<g opacity="0.8">
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z"
																fill=""
															/>
															<path
																fillRule="evenodd"
																clipRule="evenodd"
																d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z"
																fill=""
															/>
														</g>
													</svg>
												</span>
												<input
													className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
													type="password"
													name="password"
													id="password"
													placeholder="Kata Sandi"
													defaultValue=""
													onChange={this.handleChange}
												/>
											</div>
										</div>

										<div className="flex justify-end gap-4.5">
											<button
												className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
												type="button"
												onClick={() => {
													window.location.href =
														"/employee"
												}}
											>
												Batal
											</button>
											<button
												className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
												type="submit"
											>
												Simpan
											</button>
										</div>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Layout>
		)
	}
}

export default EditProfile
