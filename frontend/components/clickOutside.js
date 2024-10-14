import React, { useRef, useEffect, cloneElement } from "react"

const ClickOutside = ({ children, exceptionRef, onClick, className }) => {
	const wrapperRef = useRef(null)

	useEffect(() => {
		const handleClickListener = (event) => {
			let clickedInside = false
			if (exceptionRef) {
				clickedInside =
					(wrapperRef.current &&
						wrapperRef.current.contains(event.target)) ||
					(exceptionRef.current &&
						exceptionRef.current === event.target) ||
					(exceptionRef.current &&
						exceptionRef.current.contains(event.target))
			} else {
				clickedInside =
					wrapperRef.current &&
					wrapperRef.current.contains(event.target)
			}

			if (!clickedInside && typeof onClick === "function") onClick()
		}

		document.addEventListener("mousedown", handleClickListener)

		return () => {
			document.removeEventListener("mousedown", handleClickListener)
		}
	}, [exceptionRef, onClick])

	return (
		<div ref={wrapperRef} className={`${className || ""}`}>
			{React.isValidElement(children)
				? cloneElement(children, { onClick })
				: children}
		</div>
	)
}

export default ClickOutside
