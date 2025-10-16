import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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

function CheckboxMenuReusable({
	label = "Select Items",
	headerLabel = label,
	options = [],
	selected = [],
	setSelected = () => {},
	isLoading = false,
	renderSearchInput,
	renderCheckbox,
	renderLoading,
	isMenuAbsolute = false,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const selectRef = useRef(null);
	const menuRef = useRef(null);

	const handleCheckboxChange = (value, label) => {
		setSelected((prev) => {
			const filtered = options.filter((item) =>
				item.label.toLowerCase().includes(searchQuery.toLowerCase())
			);

			if (value === "all") {
				const allSelected = filtered.every((item) =>
					prev.some((s) => s.value === item.value)
				);
				return allSelected
					? prev.filter(
							(item) =>
								!filtered.some((f) => f.value === item.value)
					  )
					: [
							...prev,
							...filtered.filter(
								(item) =>
									!prev.some((s) => s.value === item.value)
							),
					  ];
			} else {
				const exists = prev.some((item) => item.value === value);
				return exists
					? prev.filter((item) => item.value !== value)
					: [...prev, { value, label }];
			}
		});
	};

	const filteredOptions = options.filter((item) =>
		item.label.toLowerCase().includes(searchQuery.toLowerCase())
	);

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
		if (isOpen) document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, [isOpen]);

	return (
		<>
			<div className="w-full">
				<div className="font-semibold text-[0.85rem]">{label}</div>
				<div className="w-full flex items-center justify-end relative">
					<div
						tabIndex={0}
						className="w-full p-2 text-[0.95rem] bg-[var(--color-grey-light)] border border-[var(--color-grey)] rounded-md cursor-pointer"
						onClick={() => setIsOpen(!isOpen)}
						ref={selectRef}
					>
						{"Select " + label}
					</div>
					<div className="h-[calc(100%-4px)] pr-2 flex items-center bg-[var(--color-grey-light)] mr-[2px] rounded-se-[calc(0.375rem-2px)] rounded-ee-[calc(0.375rem-2px)] absolute">
						<span className="fa-solid fa-square-arrow-up-right"></span>
					</div>
				</div>
			</div>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						className="w-full h-full fixed top-0 left-0 flex justify-center items-center rounded-xl bg-[rgba(0,0,0,0.85)] z-[99]"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							ref={menuRef}
							className={`w-[80%] max-w-[30rem] min-w-[14rem] max-h-[90%] mt-2 bg-[var(--color-grey-light)] shadow-lift rounded-md flex overflow-hidden ${
								isMenuAbsolute ? "absolute" : ""
							}`}
							variants={popUp}
							initial="hidden"
							animate="visible"
							exit="exit"
						>
							{isLoading ? (
								renderLoading ? (
									renderLoading()
								) : (
									<div className="w-full h-[10rem] grid place-content-center">
										Loading...
									</div>
								)
							) : (
								<div className="w-full flex flex-col p-4 gap-2">
									<span className="w-full text-center text-[1.25rem] font-semibold">
										{headerLabel}
									</span>
									{renderSearchInput ? (
										renderSearchInput(
											searchQuery,
											setSearchQuery
										)
									) : (
										<input
											type="search"
											placeholder="Search..."
											className="p-2 border rounded"
											value={searchQuery}
											onChange={(e) =>
												setSearchQuery(e.target.value)
											}
										/>
									)}

									<div className="w-full flex flex-col overflow-hidden border border-[var(--color-grey)] bg-[var(--color-bg-secondary)] rounded-md pt-2 px-0">
										<div className="px-2">
											{renderCheckbox ? (
												renderCheckbox(
													"Remove all",
													filteredOptions.length >
														0 &&
														filteredOptions.every(
															(item) =>
																selected.some(
																	(s) =>
																		s.value ===
																		item.value
																)
														),
													() =>
														handleCheckboxChange(
															"all",
															"All"
														)
												)
											) : (
												<label>
													<input
														type="checkbox"
														checked={
															filteredOptions.length >
																0 &&
															filteredOptions.every(
																(item) =>
																	selected.some(
																		(s) =>
																			s.value ===
																			item.value
																	)
															)
														}
														onChange={() =>
															handleCheckboxChange(
																"all",
																"All"
															)
														}
													/>{" "}
													Select All
												</label>
											)}
										</div>

										<div className="w-full overflow-y-auto overflow-x-hidden p-2 flex flex-col border-t border-[var(--color-grey)] gap-1">
											{filteredOptions.length > 0 ? (
												<>
													{filteredOptions.map(
														(option) =>
															renderCheckbox ? (
																renderCheckbox(
																	option.label,
																	selected.some(
																		(s) =>
																			s.value ===
																			option.value
																	),
																	() =>
																		handleCheckboxChange(
																			option.value,
																			option.label
																		)
																)
															) : (
																<label
																	key={
																		option.value
																	}
																>
																	<input
																		type="checkbox"
																		checked={selected.some(
																			(
																				s
																			) =>
																				s.value ===
																				option.value
																		)}
																		onChange={() =>
																			handleCheckboxChange(
																				option.value,
																				option.label
																			)
																		}
																	/>{" "}
																	{option.label +
																		"asdasd"}
																</label>
															)
													)}
												</>
											) : (
												<>
													<div className="w-full h-8 flex justify-center items-center text-center">
														<span className="opacity-75 italic">
															Empty
														</span>
													</div>
												</>
											)}
										</div>
									</div>

									<button
										className="mt-4 px-4 py-2 rounded bg-[var(--color-primary)] text-white"
										onClick={() => setIsOpen(false)}
									>
										OK
									</button>
								</div>
							)}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

export default CheckboxMenuReusable;
