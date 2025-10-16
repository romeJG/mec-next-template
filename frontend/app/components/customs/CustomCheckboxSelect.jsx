import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const DEFAULT_OPTIONS = [
	{ label: "Label 1", value: "Value 1" },
	{ label: "Label 2", value: "Value 2" },
	{ label: "Label 3", value: "Value 3" },
];

const CustomCheckboxSelect = ({
	selectOptions = DEFAULT_OPTIONS,
	selected = [],
	setSelected = () => {},
	onChange = () => {},
	selectLabel = "Select Items",
	labelTextSize = "1rem",
	optionsTextSize = "1rem",
}) => {
	// const [selected, setSelected] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const selectRef = useRef(null);
	const menuRef = useRef(null);

	const isAllSelected = selected.length === selectOptions.length;

	const handleToggleAll = () => {
		const newSelected = isAllSelected ? [] : [...selectOptions];
		setSelected(newSelected);
		onChange(newSelected);
	};

	const handleToggleOption = (option) => {
		const exists = selected.some((sel) => sel.value === option.value);
		const newSelected = exists
			? selected.filter((sel) => sel.value !== option.value)
			: [...selected, option];
		setSelected(newSelected);
		onChange(newSelected);
	};

	const handleClickOutside = (event) => {
		if (
			selectRef.current &&
			!selectRef.current.contains(event.target) &&
			menuRef.current &&
			!menuRef.current.contains(event.target)
		) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const isChecked = (opt) => selected.some((sel) => sel.value === opt.value);

	const displayText =
		selected.length === 0
			? "None selected"
			: selected.length === selectOptions.length
			? "All selected"
			: `${selected.length} item${
					selected.length > 1 ? "s" : ""
			  } selected`;

	return (
		<div className="w-full flex flex-col relative">
			<label
				className="font-semibold"
				style={{ fontSize: labelTextSize }}
			>
				{selectLabel}
			</label>
			<div
				className="w-full rounded-md flex justify-between items-center cursor-pointer"
				tabIndex={0}
				style={{
					border: isFocused
						? "1px solid transparent"
						: "1px solid var(--color-grey)",
					outline: isFocused
						? "1px solid var(--color-primary)"
						: "none",
					background: "var(--color-grey-light)",
				}}
				onClick={() => setIsOpen((prev) => !prev)}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				ref={selectRef}
			>
				<span className="p-2" style={{ fontSize: optionsTextSize }}>
					{displayText}
				</span>
				<div className="pr-2 flex items-center">
					<motion.span
						className="fa-solid fa-chevron-down"
						style={{ fontSize: optionsTextSize }}
						initial={{ rotate: "0deg" }}
						animate={{ rotate: isOpen ? "-180deg" : "0deg" }}
					/>
				</div>
			</div>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						ref={menuRef}
						className="absolute *:w-full bg-[var(--color-grey-light)] shadow-lift rounded-md z-10 max-h-[16rem] max-w-[15rem] overflow-y-auto overflow-x-auto"
						style={{
							marginTop: `calc(${labelTextSize} + ${optionsTextSize} + (${labelTextSize}/2) + (${optionsTextSize}/2) + 1.65rem)`,
							pointerEvents: isOpen ? "auto" : "none",
							fontSize: optionsTextSize,
						}}
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
					>
						<label className="px-2 py-1 flex items-center gap-1 bg-[var(--color-grey-light)] hover:bg-[var(--color-grey)] cursor-pointer">
							<input
								type="checkbox"
								checked={isAllSelected}
								onChange={handleToggleAll}
								className="accent-[var(--color-primary)]"
							/>{" "}
							All
						</label>
						{selectOptions.map((opt) => (
							<label
								key={opt.value}
								className="px-2 py-1 flex items-center gap-1 bg-[var(--color-grey-light)] hover:bg-[var(--color-grey)] cursor-pointer text-nowrap"
							>
								<input
									type="checkbox"
									className="accent-[var(--color-primary)]"
									checked={isChecked(opt)}
									onChange={() => handleToggleOption(opt)}
								/>{" "}
								{opt.label}
							</label>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default CustomCheckboxSelect;
