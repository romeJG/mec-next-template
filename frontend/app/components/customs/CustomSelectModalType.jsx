import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CustomFullscreenOverlay from "./CustomFullscreenOverlay";

const DEFAULT_OPTIONS = [
	{ label: "Label 1", value: "Value 1" },
	{ label: "Label 2", value: "Value 2" },
	{ label: "Label 3", value: "Value 3" },
];

const popUp = {
	hidden: {
		scale: 0.5,
		opacity: 0,
	},
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
	exit: {
		scale: 0.5,
		opacity: 0,
	},
};

function CustomSelectModalType({
	selectLabel,
	selectOptions = DEFAULT_OPTIONS,
	selectedOption = DEFAULT_OPTIONS[0],
	setSelectedOption = () => {},
	labelTextSize = "1rem",
	optionsTextSize = "1rem",
	isRequired = false,
	isLoading = false,
}) {
	const [searchQuery, setSearchQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
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

	// useEffect(() => {
	// 	const { x, y } = selectRef.current.getBoundingClientRect();
	// 	console.log("X:", x, "Y:", y);
	// }, [isOpen]);

	return (
		<>
			<div className="w-full h-full flex flex-col relative">
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
				<div
					ref={selectRef}
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
					<div className="h-full w-[calc(100%-1.5rem)] flex items-center p-2">
						<span
							className="truncate leading-normal"
							style={{
								fontSize: optionsTextSize,
							}}
						>
							{selectedOption.label}
						</span>
					</div>
					<div className="h-full w-[1.5rem] pr-2 flex items-center bg-[var(--color-grey-light)]">
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
			<AnimatePresence wait>
				{isOpen && (
					<CustomFullscreenOverlay>
						<motion.div
							ref={menuRef}
							className="w-[90%] md:w-[30%] md:min-w-[30rem] max-h-[90%] mt-2 bg-[var(--color-grey-light)] shadow-lift rounded-md flex flex-col overflow-hidden relative"
							variants={popUp}
							initial="hidden"
							animate="visible"
							exit="exit"
						>
							<div className="w-full h-4 absolute flex justify-end p-1">
								<motion.div
									className="w-7 h-7 rounded-full flex justify-center items-center text-center cursor-pointer"
									whileHover={{
										scale: 1.025,
										background: "var(--color-grey)",
									}}
									whileTap={{ scale: 0.95 }}
									onClick={(e) => {
										e.preventDefault();
										setIsOpen(false);
									}}
								>
									<span className="fa-solid fa-xmark" />
								</motion.div>
							</div>
							<div className="w-full justify-center text-center font-semibold text-[1.25rem] leading-none pt-4 px-4">
								Select {selectLabel}
							</div>
							<div className="w-full px-4 py-2 bg-[var(--color-grey-light)]">
								<input
									tabIndex={-1}
									className="w-full p-2 rounded focus:outline-[var(--color-primary)]"
									style={{
										border: "1px solid var(--color-grey)",
										background: "var(--color-grey-light)",
									}}
									value={searchQuery}
									onChange={handleSearchChange}
									placeholder="Search..."
									autoFocus
								></input>
							</div>

							<div
								className="min-w-full max-h-[16rem] bg-[var(--color-grey-light)] flex flex-col overflow-x-hidden overflow-y-auto scroll-transparent"
								tabIndex={-1}
							>
								{filteredOptions.map((option, index) => (
									<div
										key={index}
										className={`w-full flex justify-start cursor-pointer hover:bg-[var(--color-grey)] leading-tight py-[0.35rem] px-4
											${
												index ===
												filteredOptions.length - 1
													? ""
													: "border-b border-[var(--color-grey)]"
											}
											`}
										style={{
											fontSize: optionsTextSize,
										}}
										onClick={() =>
											handleSelectOption(option)
										}
										title={option.label}
									>
										{option.label}
									</div>
								))}
							</div>
						</motion.div>
					</CustomFullscreenOverlay>
				)}
			</AnimatePresence>
		</>
	);
}

export default CustomSelectModalType;
