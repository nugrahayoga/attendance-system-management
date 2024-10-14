"use client"
import React, { useState } from "react"
import Sidebar from "./sidebar"
import Header from "./header/index"

export default function Layout({ children }) {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	return (
		<>
			<div className="flex">
				<Sidebar
					sidebarOpen={sidebarOpen}
					setSidebarOpen={setSidebarOpen}
				/>
				<div className="relative flex flex-1 flex-col lg:ml-72.5">
					<Header
						sidebarOpen={sidebarOpen}
						setSidebarOpen={setSidebarOpen}
					/>
					<main>
						<div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
							{children}
						</div>
					</main>
				</div>
			</div>
		</>
	)
}
