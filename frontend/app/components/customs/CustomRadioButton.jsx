import PropTypes from "prop-types";

/**
 * CustomRadioButton - A reusable radio button component
 *
 * @param {string} name - Name for the radio group.
 * @param {Array} options - Array of objects with value and label for the options.
 * @param {string} selectedValue - The currently selected value.
 * @param {Function} onChange - Callback function when the value changes.
 * @param {Object} styles - Custom styles for the component.
 */
const CustomRadioButton = ({
	name,
	options,
	selectedValue = "",
	onChange,
	styles = {},
}) => {
	return (
		<div className="custom-radio-group h-full" style={styles.group}>
			{options.map((option) => (
				<label
					key={option.value}
					className={`custom-radio-label leading-none cursor-pointer ${
						selectedValue === option.value ? "selected" : ""
					}`}
					style={styles.label}
				>
					<input
						type="radio"
						name={name}
						value={option.value}
						checked={selectedValue === option.value}
						onChange={(e) => onChange(e.target.value)}
						className="custom-radio-input"
						style={styles.input}
					/>
					<div className="w-4 h-4 min-w-4 min-h-4 border border-[var(--color-text)] rounded-full grid place-content-center">
						<span
							className="custom-radio-circle"
							style={styles.circle}
						></span>
					</div>
					{option.label}
				</label>
			))}
		</div>
	);
};

CustomRadioButton.propTypes = {
	name: PropTypes.string.isRequired,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		})
	).isRequired,
	selectedValue: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	styles: PropTypes.shape({
		group: PropTypes.object,
		label: PropTypes.object,
		input: PropTypes.object,
		circle: PropTypes.object,
	}),
};

export default CustomRadioButton;
