import { useState } from "react";

const CustomHelpBox = ({ children, helpText = "I'm a helpful tooltip!" }) => {
	const [visible, setVisible] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });

	const handleMouseEnter = () => setVisible(true);
	const handleMouseLeave = () => setVisible(false);
	const handleMouseMove = (e) => {
		const offset = 5; // MUCH tighter to cursor!
		setPosition({
			x: e.clientX + offset,
			y: e.clientY + offset,
		});
	};

	const tooltipStyle = {
		position: "fixed",
		top: `${position.y}px`,
		left: `${position.x}px`,
		backgroundColor: "#333",
		color: "#fff",
		padding: "6px 10px",
		borderRadius: "6px",
		fontSize: "13px",
		whiteSpace: "nowrap",
		zIndex: 9999,
		pointerEvents: "none",
		opacity: visible ? 1 : 0,
		transition: "opacity 0.1s ease-in-out",
		boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
	};

	return (
		<span
			style={{ display: "inline-block" }}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onMouseMove={handleMouseMove}
		>
			{children}
			{visible && <div style={tooltipStyle}>{helpText}</div>}
		</span>
	);
};

export default CustomHelpBox;
