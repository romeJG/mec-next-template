import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoadingSpinner from "../animated/LoadingSpinner";
import CustomCheckbox2 from "./CustomCheckBox2";
import CustomButton from "./CustomButton";
import CustomInput from "./CustomInput";

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

function CustomCheckboxMenu({
	checkboxLabel,
	checkboxContents,
	selectedCheckboxes,
	setSelectedCheckboxes,
	isCheckboxLoading,
	isMenuAbsolute = false,
	mainSearchQuery = "",
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const selectRef = useRef(null);
	const menuRef = useRef(null);

	useEffect(() => {
		if (isOpen) {
			setSearchQuery(mainSearchQuery);
		}
	}, [isOpen]);

	const handleCheckboxChange = (value, label) => {
		setSelectedCheckboxes((prevState) => {
			const filteredList = checkboxContents.filter((content) =>
				content.label.toLowerCase().includes(searchQuery.toLowerCase())
			);

			if (value === "all") {
				const allFilteredSelected = filteredList.every((item) =>
					prevState.some((selected) => selected.value === item.value)
				);
				return allFilteredSelected
					? prevState.filter(
							(item) =>
								!filteredList.some(
									(filtered) => filtered.value === item.value
								)
					  )
					: [
							...prevState,
							...filteredList.filter(
								(item) =>
									!prevState.some(
										(selected) =>
											selected.value === item.value
									)
							),
					  ];
			} else {
				const exists = prevState.some((item) => item.value === value);
				if (exists) {
					return prevState.filter((item) => item.value !== value);
				} else {
					return [...prevState, { value, label }];
				}
			}
		});
	};

	// Filter checkboxes based on search query
	const filteredContents = checkboxContents.filter(
		(content) =>
			content.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
			content.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
			content.department.toLowerCase().includes(searchQuery.toLowerCase())
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
		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	return (
		<>
			<div className="w-full">
				<div className="font-semibold text-[0.85rem]">
					{checkboxLabel}
				</div>
				<div className="w-full flex items-center justify-end relative">
					<div
						tabIndex={0}
						className="w-full p-2 text-[0.95rem] bg-[var(--color-grey-light)] border border-[var(--color-grey)] rounded-md cursor-pointer"
						onClick={() => setIsOpen(!isOpen)}
						ref={selectRef}
					>
						{"Select " + checkboxLabel}
					</div>
					<div className="h-[calc(100%-4px)] pr-2 flex items-center bg-[var(--color-grey-light)] mr-[2px] rounded-se-[calc(0.375rem-2px)] rounded-ee-[calc(0.375rem-2px)] absolute">
						<span className="fa-solid fa-square-arrow-up-right"></span>
					</div>
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
							className={`w-[80%] max-w-[30rem] min-w-[14rem] max-h-[90%] mt-2 bg-[var(--color-grey-light)] shadow-lift rounded-md flex overflow-hidden ${
								isMenuAbsolute && "absolute "
							}`}
							variants={popUp}
							initial="hidden"
							animate="visible"
							exit="exit"
						>
							{isCheckboxLoading ? (
								<>
									<div className="w-full h-[10rem] grid place-content-center">
										<LoadingSpinner
											loadingSpinnerColor="var(--color-primary)"
											loadingSpinnerWidth="0.25rem"
											loadingSpinnerSize="3rem"
										/>
									</div>
								</>
							) : (
								<>
									<div className="w-full flex flex-col p-4 gap-2">
										<span className="w-full text-center text-[1.25rem] font-semibold">
											{checkboxLabel}
										</span>
										<CustomInput
											inputType="search"
											inputPlaceHolder="Search..."
											inputLabelSize="0.85rem"
											inputValue={searchQuery}
											setInputValue={setSearchQuery}
										/>
										<div className="w-full flex flex-col overflow-hidden border border-[var(--color-grey)] bg-[var(--color-bg-secondary)] rounded-md pt-2 px-0">
											<div className="px-2">
												<CustomCheckbox2
													label="All"
													checked={
														filteredContents.length >
															0 &&
														filteredContents.every(
															(content) =>
																selectedCheckboxes.some(
																	(
																		selected
																	) =>
																		selected.value ===
																		content.value
																)
														)
													}
													onChange={() =>
														handleCheckboxChange(
															"all",
															"All"
														)
													}
													customStyles={{
														checkbox: {
															width: "0.85rem",
														},
														label: {
															fontSize: "0.95rem",
														},
													}}
												/>
											</div>
											<div className="w-full overflow-y-auto overflow-x-hidden p-2 flex flex-col border-t border-[var(--color-grey)] gap-6">
												<div className="flex flex-col gap-1">
													<div className="grid gap-1">
														{filteredContents.map(
															(content) => (
																<CustomCheckbox2
																	key={
																		content.value
																	}
																	checked={selectedCheckboxes.some(
																		(
																			item
																		) =>
																			item.value ===
																			content.value
																	)}
																	onChange={() =>
																		handleCheckboxChange(
																			content.value,
																			content.label
																		)
																	}
																	label={
																		content.label
																	}
																	labelPosition="right"
																	customStyles={{
																		checkboxWrapper:
																			{
																				width: "100%",
																			},
																		checkbox:
																			{
																				width: "0.85rem",
																			},
																		label: {
																			fontSize:
																				"0.95rem",
																		},
																	}}
																/>
															)
														)}
													</div>
												</div>
											</div>
										</div>

										<CustomButton
											buttonLabel="OK"
											buttonVariant="solid"
											buttonSolidColor="var(--color-primary)"
											buttonLabelColor="white"
											buttonClick={() => setIsOpen(false)}
										/>
									</div>
								</>
							)}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

export default CustomCheckboxMenu;
