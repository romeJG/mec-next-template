import React from "react";
import PropTypes from "prop-types";

// CSS for Checkbox styling
const styles = {
	checkboxWrapper: {
		display: "flex",
		alignItems: "center",
		width: "100%",
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

const DEFAULT_FUNCTION = () => {
	return;
};

const CustomCheckbox2 = ({
	checked = false,
	onChange = DEFAULT_FUNCTION,
	label,
	disabled = false,
	labelPosition = "right",
	customStyles = {},
	isBin = false,
}) => {
	const handleChange = () => {
		if (disabled) return;
		onChange && onChange();
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
			{isBin ? (
				// If isBin is true, render a trash can icon

				<i
					className="fa fa-trash-can text-[var(--color-secondary)] cursor-pointer"
					checked={checked}
					onClick={handleChange}
					disabled={disabled}
					style={{ ...styles.checkbox, ...customStyles.checkbox }}
				/>
			) : (
				// Otherwise, render a checkbox input
				<input
					type="checkbox"
					checked={checked}
					onChange={handleChange}
					disabled={disabled}
					style={{ ...styles.checkbox, ...customStyles.checkbox }}
				/>
			)}
			{labelPosition === "right" && (
				<label
					className="truncate"
					style={{ ...styles.label, ...customStyles.label }}
					onClick={handleChange}
					title={label}
				>
					{label}
				</label>
			)}
		</div>
	);
};

// PropTypes for type-checking
CustomCheckbox2.propTypes = {
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

export default CustomCheckbox2;
