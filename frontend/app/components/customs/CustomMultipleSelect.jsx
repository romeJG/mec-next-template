import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CustomButton from "./CustomButton";

const DEFAULT_OPTIONS = [
	{ label: "Label 1", value: "Value 1" },
	{ label: "Label 2", value: "Value 2" },
	{ label: "Label 3", value: "Value 3" },
];

const popUp = {
	hidden: { scale: 0.5, opacity: 0 },
	visible: {
		scale: 1,
		opacity: 1,
		transition: {
			duration: 0.1,
			type: "spring",
			damping: 25,
			stiffness: 500,
		},
	},
	exit: { scale: 0.5, opacity: 0 },
};

function CustomMultipleSelect({
	selectLabel = "",
	selectTitle = "",
	selectPlaceHolder = "Select options...",
	selectOptions = DEFAULT_OPTIONS,
	selectedOptions = [],
	setSelectedOptions = () => {},
	labelTextSize = "1rem",
	optionsTextSize = "1rem",
	isShowValue = false,
	isTitleValue = false,
	isOptionValue = false,
	isSubOptionValue = false,
	isWithSubOption = false,
	isOptionWithBorder = false,
	isRequired = false,
	isLoading = false,
	isDisabled = false,
}) {
	const [searchQuery, setSearchQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const selectRef = useRef(null);
	const menuRef = useRef(null);

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
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
			setSearchQuery("");
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const filteredOptions = selectOptions.filter(
		(option) =>
			(
				option.label.toLowerCase() +
				" " +
				String(option.value).toLowerCase()
			).includes(searchQuery.toLowerCase()) &&
			!selectedOptions.some((sel) => sel.value === option.value)
	);

	const handleSelectOption = (option) => {
		if (!selectedOptions.some((sel) => sel.value === option.value)) {
			setSelectedOptions([...selectedOptions, option]);
		}
		setSearchQuery("");
	};

	const removeOption = (optionToRemove) => {
		setSelectedOptions(
			selectedOptions.filter((opt) => opt.value !== optionToRemove.value)
		);
	};

	return (
		<>
			<div className="w-full h-full flex flex-col relative">
				<label
					className="font-semibold flex"
					style={{ fontSize: labelTextSize }}
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

				<div
					ref={selectRef}
					className="w-full min-h-[40px] max-h-[12rem] overflow-x-hidden overflow-y-auto rounded-md flex flex-wrap gap-[0.35rem] items-center cursor-pointer p-[0.35rem] py-1"
					style={{
						border: isFocused
							? "1px solid transparent"
							: "1px solid var(--color-grey)",
						outline: isFocused
							? "1px solid var(--color-primary)"
							: "none",
						background: "var(--color-grey-light)",
						pointerEvents: isDisabled ? "none" : "auto",
					}}
					tabIndex={0}
					onClick={() => setIsOpen(!isOpen)}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
				>
					{selectedOptions.length === 0 && (
						<span
							className="text-gray-500"
							style={{ fontSize: optionsTextSize }}
						>
							{selectPlaceHolder}
						</span>
					)}
					{selectedOptions.map((option) => (
						<span
							key={option.value}
							className="bg-[var(--color-bg)] shadow-lift rounded-full pl-3 pr-[0.35rem] py-[0.35rem] flex items-center gap-2"
							style={{ fontSize: optionsTextSize }}
							title={isTitleValue ? option.value : option.label}
						>
							{isShowValue ? option.value : option.label}
							<span
								className="w-5 h-5 aspect-square fa-solid fa-xmark grid place-content-center text-center p-1 rounded-full cursor-pointer text-[0.75rem] opacity-50 hover:opacity-90 hover:bg-[var(--color-grey)] transition-all duration-150"
								onClick={(e) => {
									e.stopPropagation();
									removeOption(option);
								}}
							></span>
						</span>
					))}
				</div>
			</div>

			<AnimatePresence wait>
				{isOpen && (
					<motion.div
						className="w-full h-full fixed top-0 left-0 flex justify-center items-center rounded-xl bg-[rgba(0,0,0,0.85)] z-[99]"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							ref={menuRef}
							className="w-[80%] min-w-[14rem] max-h-[90%] bg-[var(--color-grey-light)] shadow-lift rounded-md flex flex-col overflow-hidden"
							variants={popUp}
							initial="hidden"
							animate="visible"
							exit="exit"
						>
							<div className="w-full justify-center text-center font-semibold text-[1.25rem] leading-none pt-4 px-4">
								{selectTitle}
							</div>
							<div
								className="w-full px-4 py-2 bg-[var(--color-grey-light)] border-b border-[var(--color-grey)]"
								onFocus={() => setIsSearchFocused(true)}
								onBlur={() => setIsSearchFocused(false)}
							>
								<input
									tabIndex={-1}
									className="w-full p-2 rounded"
									style={{
										border: isSearchFocused
											? "1px solid transparent"
											: "1px solid var(--color-grey)",
										outline: isSearchFocused
											? "1px solid var(--color-primary)"
											: "none",
										background: "var(--color-grey-light)",
									}}
									value={searchQuery}
									onChange={handleSearchChange}
									placeholder="Search..."
								/>
							</div>

							<div
								className="min-w-full max-h-[16rem] bg-[var(--color-grey-light)] flex flex-col overflow-x-hidden overflow-y-auto"
								tabIndex={-1}
							>
								{filteredOptions.map((option, index) => (
									<div
										key={index}
										className={`w-full flex flex-col items-start cursor-pointer hover:bg-[var(--color-grey)] p-1 px-4 leading-none gap-[2px]
											${isOptionWithBorder ? "border-b border-[var(--color-grey)]" : ""}`}
										style={{ fontSize: optionsTextSize }}
										onClick={() =>
											handleSelectOption(option)
										}
									>
										<span className="whitespace-nowrap text-ellipsis">
											{isOptionValue
												? option.value
												: option.label}
										</span>
										{isWithSubOption && (
											<span className="text-[0.85rem] opacity-75">
												{isSubOptionValue
													? option.value
													: option.label}
											</span>
										)}
									</div>
								))}
							</div>
							<div className="w-full px-4 py-2 pb-4 border-t border-[var(--color-grey)] bg-[var(--color-grey-light)] flex justify-end">
								<CustomButton
									buttonVariant="solid"
									buttonLabel="CLOSE"
									buttonSolidColor="var(--color-primary)"
									buttonLabelColor="white"
									buttonClick={() => setIsOpen(false)}
									isScaledOnHover={false}
									isDarkendOnHover
								/>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

export default CustomMultipleSelect;
