"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import Layout from "@/components/layout"
import AuthServices from "@/components/auth/auth"
import Breadcrumb from "@/components/breadcrumbs/breadcrumb"
import hash from "@/utils/auth/hash"

const Auth = new AuthServices()

class Profile extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			user: null,
			token: null,
		}

		this.getProfile = this.getProfile.bind(this)
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
			this.getProfile()
		}
	}

	getProfile() {
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

	render() {
		return (
			<Layout>
				<div className="mx-auto max-w-242.5">
					<Breadcrumb pageName="Profil" />

					<div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
						<div className="relative z-20 h-35 md:h-65">
							<Link
								href="/profile/edit"
								className="absolute top-1 right-1 z-10 xsm:top-4 xsm:right-4"
							>
								<button className="p-2 text-white bg-blue-500 rounded-full hover:bg-blue-700">
									Ubah Profil
								</button>
							</Link>
						</div>
						<div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
							<div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
								<div className="relative drop-shadow-2">
									<Image
										src={
											this.state.user?.profile_picture ||
											"/images/user.png"
										}
										width={160}
										height={160}
										style={{
											width: "auto",
											height: "auto",
										}}
										alt="profile"
									/>
								</div>
							</div>
							<div className="mt-4">
								<h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
									{this.state.user?.fullname}
								</h3>
								<p className="font-medium">
									{this.state.user?.position}
								</p>
								<div className="mx-auto mb-5.5 mt-4.5 grid max-w-94 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
									<div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
										<span className="text-sm">
											Nomor Telepon:{" "}
										</span>
										<span className="font-semibold text-black dark:text-white">
											{this.state.user?.phone}
										</span>
									</div>
									<div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
										<span className="text-sm">Email: </span>
										<span className="font-semibold text-black dark:text-white">
											{this.state.user?.email}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Layout>
		)
	}
}

export default Profile
