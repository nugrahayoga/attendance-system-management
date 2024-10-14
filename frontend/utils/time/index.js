import React, { useEffect, useState } from 'react'

const TimeComponent = () => {
	const [time, setTime] = useState('')
	const [date, setDate] = useState('')

	useEffect(() => {
		const updateTimeAndDate = () => {
			const now = new Date()
			setTime(now.toLocaleTimeString())
			setDate(now.toLocaleDateString())
		}

		updateTimeAndDate() // Set initial time and date
		const intervalId = setInterval(updateTimeAndDate, 1000) // Update time and date every second

		return () => clearInterval(intervalId) // Cleanup interval on component unmount
	}, [])

	return (
		<div>
			<span>{date}</span> | <span>{time}</span>
		</div>
	)
}

export default TimeComponent
