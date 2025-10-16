import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const DEFAULT_OPTIONS = [
	{ label: "Label 1", value: "Value 1" },
	{ label: "Label 2", value: "Value 2" },
	{ label: "Label 3", value: "Value 3" },
];

function CustomSelect({
	isCustomVariant = false,
	selectLabel,
	selectOptions = DEFAULT_OPTIONS,
	selectedOption = DEFAULT_OPTIONS[0],
	setSelectedOption,
	labelTextSize = "1rem",
	optionsTextSize = "1rem",
	withSearch = false,
	isRequired = false,
	isLoading = false,
}) {
	const [searchQuery, setSearchQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const selectRef = useRef(null);

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};

	const handleClickOutside = (event) => {
		if (selectRef.current && !selectRef.current.contains(event.target)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
			setSearchQuery("");
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
			setSearchQuery("");
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const filteredOptions = selectOptions.filter((option) =>
		option.label.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleSelectOption = (value) => {
		setSelectedOption(value);
		setIsOpen(false);
	};

	return (
		<>
			{isCustomVariant ? (
				<div
					className="w-full h-full flex flex-col relative"
					ref={selectRef}
				>
					<label
						className="font-semibold flex"
						style={{
							fontSize: labelTextSize,
						}}
					>
						<div className="inline-block">
							{selectLabel}
							{isRequired && (
								<span className="text-[var(--color-secondary)]">
									*
								</span>
							)}
						</div>
						{isLoading && (
							<div className="pl-1">
								<span
									className="fa fa-spinner fa-spin text-[0.75rem]"
									style={{
										fontSize: labelTextSize,
										scale: "0.85",
									}}
								></span>
							</div>
						)}
					</label>
					<div
						className="w-full h-full rounded-md flex justify-between items-center overflow-hidden cursor-pointer"
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
						onClick={() => setIsOpen(!isOpen)}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}
					>
						<span
							className="h-full p-2"
							style={{
								fontSize: optionsTextSize,
							}}
						>
							{selectedOption.label}
						</span>
						<div className="h-full pr-2 flex items-center bg-[var(--color-grey-light)]">
							<motion.span
								className="fa-solid fa-chevron-down"
								style={{ fontSize: optionsTextSize }}
								initial={{ rotate: "0deg" }}
								animate={{
									rotate: isOpen ? "-180deg" : "0deg",
								}}
							></motion.span>
						</div>
					</div>
					<motion.div
						className={`min-w-full overflow-hidden rounded-md z-10 absolute ${
							isOpen && "shadow-lift"
						}`}
						style={{
							marginTop: `calc(${labelTextSize} + ${optionsTextSize} + (${labelTextSize}/2) + (${optionsTextSize}/2) + 1.65rem)`,
							pointerEvents: isOpen ? "auto" : "none",
						}}
						initial={{
							height: 0,
							opacity: 0,
						}}
						animate={{
							height: isOpen ? "auto" : 0,
							opacity: isOpen ? 1 : 0,
						}}
					>
						{withSearch && (
							<div className="w-full p-2 bg-[var(--color-grey-light)]">
								<input
									tabIndex={-1}
									className="w-full p-1 rounded"
									style={{
										border: "1px solid var(--color-grey)",
										background: "var(--color-grey-light)",
									}}
									value={searchQuery}
									onChange={handleSearchChange}
									placeholder="Search..."
								></input>
							</div>
						)}
						<div
							className="min-w-full max-h-[16rem] bg-[var(--color-grey-light)] flex flex-col overflow-x-hidden overflow-y-auto"
							tabIndex={-1}
						>
							{filteredOptions.map((option, index) => (
								<div
									key={index}
									className="w-full flex justify-start cursor-pointer hover:bg-[var(--color-grey)] p-2 px-2 whitespace-nowrap text-ellipsis"
									style={{ fontSize: optionsTextSize }}
									onClick={() => handleSelectOption(option)}
								>
									{option.label}
								</div>
							))}
							{filteredOptions.length === 0 && (
								<div
									className="w-full italic flex justify-start p-2 px-2 whitespace-nowrap text-ellipsis"
									style={{ fontSize: optionsTextSize }}
								>
									No results found
								</div>
							)}
						</div>
					</motion.div>
				</div>
			) : (
				<div>
					<label
						className="font-semibold flex"
						style={{
							fontSize: labelTextSize,
						}}
					>
						<div className="inline-block">
							{selectLabel}
							{isRequired && (
								<span className="text-[var(--color-secondary)]">
									*
								</span>
							)}
						</div>
						{isLoading && (
							<div className="h-full aspect-square flex items-center justify-center">
								<span
									className="fa-solid fa-spinner fa-spin text-color opacity-50"
									style={{
										fontSize: labelTextSize,
										scale: "0.85",
									}}
								/>
							</div>
						)}
					</label>
					<div className="w-full flex items-center justify-end relative">
						<select
							className="custom-select-normal w-full rounded-md p-2"
							style={{
								background: "var(--color-grey-light)",
							}}
							onFocus={() => setIsOpen(true)}
							onBlur={() => setIsOpen(false)}
							onChange={(e) => handleSelectOption(e.target.value)}
						>
							{filteredOptions.map((option, index) => (
								<option
									key={index}
									className="w-full cursor-pointer hover:bg-[var(--color-grey-light)] p-1"
									style={{ fontSize: optionsTextSize }}
									value={option.value}
								>
									{option.label}
								</option>
							))}
						</select>
						<div className="h-[calc(100%-4px)] pr-2 flex items-center bg-[var(--color-grey-light)] mr-[2px] rounded-se-[calc(0.375rem-2px)] rounded-ee-[calc(0.375rem-2px)] absolute">
							<motion.span
								className="fa-solid fa-chevron-down"
								style={{ fontSize: optionsTextSize }}
								initial={{ rotate: "0deg" }}
								animate={{
									rotate: isOpen ? "-180deg" : "0deg",
								}}
							></motion.span>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default CustomSelect;
