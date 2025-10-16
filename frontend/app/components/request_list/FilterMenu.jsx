import { useEffect, useRef, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CustomCheckbox2 from "../customs/CustomCheckBox2";
import LoadingSpinner from "../animated/LoadingSpinner";
import CustomInput from "components/customs/CustomInput";

export default function FilterMenu({
	filters = {},
	isLoading = false,
	onChange,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState({});
	const [isFocused, setIsFocused] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const selectRef = useRef(null);
	const menuRef = useRef(null);

	const transformedFilters = useMemo(() => {
		if (Array.isArray(filters)) {
			return filters;
		}

		return Object.entries(filters).map(([label, options]) => ({
			key: label.toLowerCase().replace(/\s+/g, "_"),
			label,
			options,
		}));
	}, [filters]);

	useEffect(() => {
		const clickOutside = (e) => {
			if (
				selectRef.current &&
				!selectRef.current.contains(e.target) &&
				menuRef.current &&
				!menuRef.current.contains(e.target)
			) {
				setIsOpen(false);
				setSearchQuery("");
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", clickOutside);
		} else {
			document.removeEventListener("mousedown", clickOutside);
		}

		return () => document.removeEventListener("mousedown", clickOutside);
	}, [isOpen]);

	const toggleOption = (key, value) => {
		setSelected((prev) => {
			const current = prev[key] || [];
			const updated = current.includes(value)
				? current.filter((v) => v !== value)
				: [...current, value];

			const newState = { ...prev, [key]: updated };
			onChange?.(newState);
			return newState;
		});
	};

	const toggleAll = (key, options) => {
		setSelected((prev) => {
			const current = prev[key] || [];
			const allSelected = current.length === options.length;
			const newState = {
				...prev,
				[key]: allSelected ? [] : options.map((opt) => opt.value),
			};
			onChange?.(newState);
			return newState;
		});
	};

	const getTotalSelected = () => {
		return Object.values(selected).reduce(
			(sum, arr) => sum + arr.length,
			0
		);
	};

	const getDisplayText = () => {
		if (isOpen) return "Close Menu";

		const totalSelected = getTotalSelected();
		return totalSelected > 0
			? `${totalSelected} filter${totalSelected > 1 ? "s" : ""} selected`
			: "No filters";
	};

	return (
		<div className="w-full relative">
			<div className="font-semibold text-[0.85rem]">Filters:</div>
			<div className="w-full flex items-center justify-end relative">
				<div
					tabIndex={0}
					ref={selectRef}
					onClick={() => setIsOpen((prev) => !prev)}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					style={{
						border: isFocused
							? "1px solid transparent"
							: "1px solid var(--color-grey)",
						outline: isFocused
							? "1px solid var(--color-primary)"
							: "none",
					}}
					className="w-full p-2 bg-[var(--color-grey-light)] border border-[var(--color-grey)] rounded-md cursor-pointer"
				>
					{getDisplayText()}
				</div>
				<div className="absolute right-2 h-full flex items-center">
					<motion.span
						className="fa-solid fa-chevron-down"
						initial={{ rotate: "0deg" }}
						animate={{ rotate: isOpen ? "-180deg" : "0deg" }}
					></motion.span>
				</div>
			</div>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						ref={menuRef}
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="w-full min-w-[18rem] md:min-w-[20rem] lg:min-w-[30rem] max-h-[15rem] mt-2 bg-[var(--color-grey-light)] shadow-lift rounded-md flex overflow-hidden absolute z-[99]"
					>
						{isLoading ? (
							<div className="w-full h-[10rem] grid place-content-center">
								<LoadingSpinner
									loadingSpinnerColor="var(--color-primary)"
									loadingSpinnerWidth="0.25rem"
									loadingSpinnerSize="3rem"
								/>
							</div>
						) : (
							<div className="w-full overflow-y-auto p-2 flex flex-col gap-4">
								<CustomInput
									inputType="search"
									inputPlaceHolder="Search..."
									inputLabelSize="0.95rem"
									inputValue={searchQuery}
									setInputValue={setSearchQuery}
								/>

								<div className="grid grid-cols-2 gap-6">
									{transformedFilters.map(({ key, label, options }) => {
										const filteredOptions = options.filter((opt) =>
											opt.label.toLowerCase().includes(searchQuery.toLowerCase())
										);

										return (
											<div key={key} className="flex flex-col gap-1 min-w-[12rem]">
												<span className="font-semibold text-[0.9rem]">{label}:</span>
												<div className="grid gap-1">
													{!searchQuery && (
														<CustomCheckbox2
															label="All"
															checked={(selected[key] || []).length === filteredOptions.length}
															onChange={() => toggleAll(key, filteredOptions)}
															customStyles={{
																checkbox: {
																	width: "0.85rem",
																},
																label: {
																	fontSize: "0.95rem",
																},
																wrapper: {
																	textTruncate: "auto",
																},
															}}
														/>
													)}
													{filteredOptions.map((opt) => (
														<CustomCheckbox2
															key={opt.value}
															label={opt.label}
															checked={(selected[key] || []).includes(opt.value)}
															onChange={() => toggleOption(key, opt.value)}
															labelPosition="right"
															customStyles={{
																checkbox: {
																	width: "0.85rem",
																},
																label: {
																	fontSize: "0.95rem",
																},
															}}
														/>
													))}
													{filteredOptions.length === 0 && (
														<span className="text-xs italic text-gray-400">
															No matches
														</span>
													)}
												</div>
											</div>
										);
									})}
								</div>
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div >
	);
}
