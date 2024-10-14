"use client"
import React, { useEffect, useState } from "react"
import Loader from "@/components/common/loader/index"
import ErrorBoundary from "@/components/errorBoundary"
import { Toaster } from "react-hot-toast"
import "jsvectormap/dist/jsvectormap.css"
import "flatpickr/dist/flatpickr.min.css"
import "@/css/satoshi.css"
import "@/css/style.css"
import "react-datepicker/dist/react-datepicker.css"

export default function RootLayout({ children }) {
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		setTimeout(() => setLoading(false), 1000)
	}, [])

	return (
		<html lang="en">
			<body suppressHydrationWarning={true}>
				<div className="dark:bg-boxdark-2 dark:text-bodydark">
					<ErrorBoundary>
						<Toaster />
						{loading ? <Loader /> : children}
					</ErrorBoundary>
				</div>
			</body>
		</html>
	)
}
