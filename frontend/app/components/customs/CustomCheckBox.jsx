import React, { useState } from "react";
import PropTypes from "prop-types";

// CSS for Checkbox styling
const styles = {
	checkboxWrapper: {
		display: "flex",
		alignItems: "center",
	},
	checkbox: {
		width: "1rem",
		height: "1rem",
		cursor: "pointer",
		accentColor: "var(--color-primary)",
	},
	label: {
		marginLeft: "0.5rem",
		cursor: "pointer",
		userSelect: "none",
	},
};

const CustomCheckbox = ({
	checked = false,
	onChange,
	label,
	disabled = false,
	labelPosition = "right",
	customStyles = {},
}) => {
	const [isChecked, setIsChecked] = useState(checked);

	const handleChange = () => {
		if (disabled) return;
		setIsChecked(!isChecked);
		onChange && onChange(!isChecked);
	};

	return (
		<div style={{ ...styles.checkboxWrapper, ...customStyles.wrapper }}>
			{labelPosition === "left" && (
				<label
					className="truncate"
					style={{ ...styles.label, ...customStyles.label }}
					onClick={handleChange}
				>
					{label}
				</label>
			)}
			<input
				type="checkbox"
				checked={isChecked}
				onChange={handleChange}
				disabled={disabled}
				style={{ ...styles.checkbox, ...customStyles.checkbox }}
			/>
			{labelPosition === "right" && (
				<label
					className="truncate"
					style={{ ...styles.label, ...customStyles.label }}
					onClick={handleChange}
				>
					{label}
				</label>
			)}
		</div>
	);
};

// PropTypes for type-checking
CustomCheckbox.propTypes = {
	checked: PropTypes.bool,
	onChange: PropTypes.func.isRequired,
	label: PropTypes.string,
	disabled: PropTypes.bool,
	labelPosition: PropTypes.oneOf(["left", "right"]),
	customStyles: PropTypes.shape({
		wrapper: PropTypes.object,
		checkbox: PropTypes.object,
		label: PropTypes.object,
	}),
};

export default CustomCheckbox;
