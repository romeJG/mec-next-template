import { useEffect, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";

function CustomInput({
	inputLabel,
	inputType = "text",
	inputPlaceHolder = "Enter " + inputLabel,
	inputValue,
	setInputValue,
	handleSearchClick,
	inputNotes,
	inputLabelSize = "1rem",
	inputTextSize = "1rem",
	inputBackgroundColor = "var(--color-grey-light)",
	inputBorderColor = "var(--color-grey)",
	minNumber = "none",
	maxNumber = "none",
	isNumberCurrency = false,
	isReadOnly = false,
	isRequired = false,
	isDisabled = false,
	isNoRequiredIndicator = false,
	isSearchClickable = false,
	isLoading = false,
	inputRef = null,
	isError = false,
	onChange,
}) {
	const [isPasswordShow, setIsPasswordShow] = useState(false);
	const [isInvalidInputType, setIsInvalidInputType] = useState(false);
	const [isNumberFocused, setIsNumberFocused] = useState(false);
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const today = new Date();
	const [formattedValue, setFormattedValue] = useState(
		format(today, "yyyy-MM-dd")
	);
	const [formattedTimeValue, setFormattedTimeValue] = useState(
		format(today, "HH:mm")
	);

	const [isSearchHovered, setIsSearchHovered] = useState(false);

	useEffect(() => {
		if (inputType === "date") {
			setFormattedValue(
				inputValue ? format(inputValue, "yyyy-MM-dd") : ""
			);
		}
		if (inputType === "time") {
			setFormattedTimeValue(
				inputValue ? format(inputValue, "HH:mm") : ""
			);
		}
		if (inputType === "datetime-local") {
			setFormattedValue(
				inputValue ? format(inputValue, "yyyy-MM-dd'T'HH:mm") : ""
			);
		}
	}, [inputType, inputValue]);

	const handleDateChange = (event) => {
		const inputValueNew = event.target.value;
		const date = inputValueNew ? new Date(inputValueNew) : new Date();
		setInputValue(date);
		if (onChange) onChange(event);
	};

	const handleTimeChange = (event) => {
		const inputValueNew = event.target.value;
		const [hours, minutes] = inputValueNew.split(":");

		// Create a new Date object, only setting the time
		const updatedTime = new Date();
		updatedTime.setHours(hours);
		updatedTime.setMinutes(minutes);
		updatedTime.setSeconds(0);

		setInputValue(updatedTime);
		if (onChange) onChange(event);
	};

	const handleInputChange = (e) => {
		const rawValue = e.target.value
			.replace(/[^0-9.]/g, "")
			.replace(/(\..*)\..*/g, "$1");
		setInputValue(rawValue);
		if (onChange) onChange(e);
	};

	// Function to format the number with commas and maintain two decimal places
	const formatWithCommas = (input) => {
		const parts = input.toString().split(".");
		const onlyNumbers = parts[0].replace(/\D/g, "");
		const formattedInteger = onlyNumbers.replace(
			/\B(?=(\d{3})+(?!\d))/g,
			","
		);

		if (parts.length > 1) {
			const decimalPart = parts[1].slice(0, 2); // Limit to 2 decimal places
			return `${formattedInteger}.${decimalPart}`;
		}

		return formattedInteger;
	};

	useEffect(() => {
		const handleKeyPress = (event) => {
			if (event.key === "Enter" && isSearchFocused && isSearchClickable) {
				console.log("Triggered");
				handleSearchClick();
			}
		};

		document.addEventListener("keydown", handleKeyPress);

		return () => {
			document.removeEventListener("keydown", handleKeyPress);
		};
	}, [isSearchFocused, isSearchClickable, inputValue]);

	useEffect(() => {
		const validInputs = [
			"text",
			"number",
			"email",
			"password",
			"date",
			"time",
			"search",
			"datetime-local",
		];
		if (!validInputs.includes(inputType)) {
			setIsInvalidInputType(true);
		} else {
			setIsInvalidInputType(false);
		}
	}, [inputType]);

	const handleStandardInputChange = (e) => {
		setInputValue(e.target.value);
		if (onChange) onChange(e);
	};

	return (
		<>
			{isInvalidInputType ? (
				<div className="w-full grid place-content-center text-center border-2 rounded-md py-3">
					<span className="font-semibold text-[var(--color-secondary)] leading-none">
						{`Sorry, input type ${inputType} is not supported :(`}
					</span>
				</div>
			) : inputType === "password" ? (
				<div className="custom-input w-full flex flex-col z-[1]">
					{inputLabel && (
						<label
							className="font-semibold text-color flex"
							style={{
								fontSize: inputLabelSize,
							}}
						>
							<div className="inline-block">
								{inputLabel}
								{isRequired && !isNoRequiredIndicator && (
									<span className="text-[var(--color-secondary)]">
										*
									</span>
								)}
							</div>
							{isLoading && (
								<div className="pl-1">
									<span className="fa fa-spinner fa-spin text-[0.75rem]"></span>
								</div>
							)}
						</label>
					)}
					{inputNotes && (
						<div className="w-full flex justify-start text-[0.85rem] text-[var(--color-grey-dark)] italic mb-1">
							{inputNotes}
						</div>
					)}
					<div className="w-full flex justify-end items-center relative">
						<input
							ref={inputRef}
							type={isPasswordShow ? "text" : "password"}
							className="w-full p-2 rounded-md"
							autoComplete="password"
							style={{
								fontSize: inputTextSize,
								lineHeight: 1,
								background: inputBackgroundColor,
								// borderColor: inputBorderColor,
							}}
							value={inputValue}
							onChange={handleStandardInputChange}
							placeholder={inputPlaceHolder}
							readOnly={isReadOnly}
							disabled={isDisabled}
							required={isRequired}
						></input>
						<div className="w-14 h-[calc(100%-4px)] flex items-center absolute bg-[var(--color-grey-light)] mr-[2px] rounded-se-[calc(0.375rem-2px)] rounded-ee-[calc(0.375rem-2px)]">
							<div className="w-[2px] min-w-[2px] h-[calc(100%-0.75rem)] bg-[var(--color-grey)] rounded-full" />
							<div
								className="w-full h-full flex justify-center items-center cursor-pointer"
								onClick={() =>
									setIsPasswordShow(!isPasswordShow)
								}
							>
								<span
									className={`fa-solid ${isPasswordShow
										? "fa-eye-slash"
										: "fa-eye"
										}`}
								></span>
							</div>
						</div>
					</div>
				</div>
			) : inputType === "date" ? (
				<div className="custom-input w-full flex flex-col">
					{inputLabel && (
						<label
							className="font-semibold flex"
							style={{
								fontSize: inputLabelSize,
							}}
						>
							<div className="inline-block">
								{inputLabel}
								{isRequired && !isNoRequiredIndicator && (
									<span className="text-[var(--color-secondary)]">
										*
									</span>
								)}
							</div>
							{isLoading && (
								<div className="pl-1">
									<span className="fa fa-spinner fa-spin text-[0.75rem]"></span>
								</div>
							)}
						</label>
					)}
					{inputNotes && (
						<div className="w-full flex justify-start text-[0.85rem] text-[var(--color-grey-dark)] italic mb-1">
							{inputNotes}
						</div>
					)}
					<div className="w-full relative flex justify-end items-center">
						<input
							ref={inputRef}
							type={inputType}
							className={`w-full p-2 rounded-md ${isError ? "error" : ""
								}`}
							style={{
								fontSize: inputTextSize,
								lineHeight: 1,
								background: inputBackgroundColor,
								// borderColor: inputBorderColor,
							}}
							value={formattedValue}
							onChange={handleDateChange}
							placeholder={inputPlaceHolder}
							readOnly={isReadOnly}
							disabled={isDisabled}
							required={isRequired}
						></input>
						<div className="w-14 h-[calc(100%-4px)] flex items-center absolute bg-[var(--color-grey-light)] mr-[2px] rounded-se-[calc(0.375rem-2px)] rounded-ee-[calc(0.375rem-2px)] pointer-events-none">
							<div className="w-[2px] min-w-[2px] h-[calc(100%-0.75rem)] bg-[var(--color-grey)] rounded-full" />
							<div className="w-full h-full flex justify-center items-center pointer-events-none">
								<span className="fa-solid fa-calendar-days"></span>
							</div>
						</div>
					</div>
				</div>
			) : inputType === "datetime-local" ? (
				<div className="custom-input w-full flex flex-col">
					{inputLabel && (
						<label
							className="font-semibold flex"
							style={{
								fontSize: inputLabelSize,
							}}
						>
							<div className="inline-block">
								{inputLabel}
								{isRequired && !isNoRequiredIndicator && (
									<span className="text-[var(--color-secondary)]">
										*
									</span>
								)}
							</div>
							{isLoading && (
								<div className="pl-1">
									<span className="fa fa-spinner fa-spin text-[0.75rem]"></span>
								</div>
							)}
						</label>
					)}
					{inputNotes && (
						<div className="w-full flex justify-start text-[0.85rem] text-[var(--color-grey-dark)] italic mb-1">
							{inputNotes}
						</div>
					)}
					<div className="w-full relative flex justify-end items-center">
						<input
							ref={inputRef}
							type={inputType}
							className={`w-full p-2 pr-4  rounded-md ${isError ? "error" : ""
								}`}
							style={{
								fontSize: inputTextSize,
								lineHeight: 1,
								background: inputBackgroundColor,
								// borderColor: inputBorderColor,
							}}
							value={formattedValue}
							onChange={handleDateChange}
							placeholder={inputPlaceHolder}
							readOnly={isReadOnly}
							disabled={isDisabled}
							required={isRequired}
						></input>
						<div className="w-14 h-[calc(100%-4px)] flex items-center absolute bg-[var(--color-grey-light)] mr-[2px] rounded-se-[calc(0.375rem-2px)] rounded-ee-[calc(0.375rem-2px)] pointer-events-none ">
							<div className="w-[2px] min-w-[2px] h-[calc(100%-0.75rem)] bg-[var(--color-grey)] rounded-full " />
							<div className="w-full h-full flex justify-center items-center pointer-events-none ">
								<span className="fa-solid fa-calendar-days"></span>
							</div>
						</div>
					</div>
				</div>
			) : inputType === "time" ? (
				<div className="custom-input w-full flex flex-col">
					{inputLabel && (
						<label
							className="font-semibold flex"
							style={{
								fontSize: inputLabelSize,
							}}
						>
							<div className="inline-block">
								{inputLabel}
								{isRequired && !isNoRequiredIndicator && (
									<span className="text-[var(--color-secondary)]">
										*
									</span>
								)}
							</div>
							{isLoading && (
								<div className="pl-1">
									<span className="fa fa-spinner fa-spin text-[0.75rem]"></span>
								</div>
							)}
						</label>
					)}
					{inputNotes && (
						<div className="w-full flex justify-start text-[0.85rem] text-[var(--color-grey-dark)] italic mb-1">
							{inputNotes}
						</div>
					)}
					<div className="w-full relative flex justify-end items-center">
						<input
							ref={inputRef}
							type={inputType}
							className="w-full p-2 rounded-md"
							style={{
								fontSize: inputTextSize,
								lineHeight: 1,
								background: inputBackgroundColor,
								// borderColor: inputBorderColor,
							}}
							value={formattedTimeValue}
							onChange={handleTimeChange}
							placeholder={inputPlaceHolder}
							readOnly={isReadOnly}
							disabled={isDisabled}
							required={isRequired}
						></input>
						<div className="w-14 h-[calc(100%-4px)] flex items-center absolute bg-[var(--color-grey-light)] mr-[2px] rounded-se-[calc(0.375rem-2px)] rounded-ee-[calc(0.375rem-2px)] pointer-events-none">
							<div className="w-[2px] min-w-[2px] h-[calc(100%-0.75rem)] bg-[var(--color-grey)] rounded-full" />
							<div className="w-full h-full flex justify-center items-center pointer-events-none">
								<span className="fa-solid fa-clock"></span>
							</div>
						</div>
					</div>
				</div>
			) : inputType === "number" ? (
				<div className="custom-input w-full flex flex-col">
					{inputLabel && (
						<label
							className="font-semibold text-color flex"
							style={{
								fontSize: inputLabelSize,
							}}
						>
							<div className="inline-block">
								{inputLabel}
								{isRequired && !isNoRequiredIndicator && (
									<span className="text-[var(--color-secondary)]">
										*
									</span>
								)}
							</div>
							{isLoading && (
								<div className="pl-1">
									<span className="fa fa-spinner fa-spin text-[0.75rem]"></span>
								</div>
							)}
						</label>
					)}
					{inputNotes && (
						<div className="w-full flex justify-start text-[0.85rem] text-[var(--color-grey-dark)] italic mb-1">
							{inputNotes}
						</div>
					)}
					{isNumberCurrency ? (
						<input
							ref={inputRef}
							type="text"
							className="w-full p-2 rounded-md"
							style={{
								fontSize: inputTextSize,
								lineHeight: 1,
								background: inputBackgroundColor,
								// borderColor: inputBorderColor,
							}}
							value={
								isNumberFocused
									? inputValue
									: formatWithCommas(inputValue)
							}
							onChange={handleInputChange}
							placeholder={inputPlaceHolder}
							readOnly={isReadOnly}
							disabled={isDisabled}
							required={isRequired}
							onFocus={() => setIsNumberFocused(true)}
							onBlur={() => setIsNumberFocused(false)}
						/>
					) : (
						<input
							ref={inputRef}
							type={inputType}
							className="w-full p-2 rounded-md"
							style={{
								fontSize: inputTextSize,
								lineHeight: 1,
								background: inputBackgroundColor,
								// borderColor: inputBorderColor,
							}}
							value={inputValue}
							onChange={handleStandardInputChange}
							placeholder={inputPlaceHolder}
							min={minNumber}
							max={maxNumber}
							readOnly={isReadOnly}
							disabled={isDisabled}
							required={isRequired}
						/>
					)}
				</div>
			) : inputType === "search" ? (
				<div className="custom-input w-full flex flex-col">
					{inputLabel && (
						<label
							className="font-semibold inline-block"
							style={{
								fontSize: inputLabelSize,
							}}
						>
							<div className="inline-block">
								{inputLabel}
								{isRequired && !isNoRequiredIndicator && (
									<span className="text-[var(--color-secondary)]">
										*
									</span>
								)}
							</div>
							{isLoading && (
								<div className="pl-1">
									<span className="fa fa-spinner fa-spin text-[0.75rem]"></span>
								</div>
							)}
						</label>
					)}
					{inputNotes && (
						<div className="w-full flex justify-start text-[0.85rem] text-[var(--color-grey-dark)] italic mb-1">
							{inputNotes}
						</div>
					)}
					<div className="w-full relative flex justify-end items-center">
						<input
							ref={inputRef}
							type="text"
							className="w-full p-2 rounded-md"
							style={{
								fontSize: inputTextSize,
								lineHeight: 1,
								background: inputBackgroundColor,
								// borderColor: inputBorderColor,
							}}
							value={inputValue}
							onChange={handleStandardInputChange}
							placeholder={inputPlaceHolder}
							onFocus={() => setIsSearchFocused(true)}
							onBlur={() => setIsSearchFocused(false)}
							readOnly={isReadOnly}
							disabled={isDisabled}
							required={isRequired}
						></input>
						{isSearchClickable ? (
							<>
								<motion.div
									className="w-14 h-[calc(100%-4px)] flex items-center absolute bg-[var(--color-grey-light)] cursor-pointer mr-[2px] rounded-se-[calc(0.375rem-2px)] rounded-ee-[calc(0.375rem-2px)]"
									onMouseEnter={() =>
										setIsSearchHovered(true)
									}
									onMouseLeave={() =>
										setIsSearchHovered(false)
									}
									onClick={handleSearchClick}
								>
									<div className="w-[2px] min-w-[2px] h-[calc(100%-0.75rem)] bg-[var(--color-grey)] rounded-full" />
									<div className="w-full h-full flex justify-center items-center">
										<div
											className={`w-8 h-8 rounded-full grid place-content-center text-center transition-all ${isSearchHovered &&
												"bg-[var(--color-grey)]"
												}`}
										>
											<span className="fa-solid fa-magnifying-glass"></span>
										</div>
									</div>
								</motion.div>
							</>
						) : (
							<>
								<div className="w-14 h-[calc(100%-4px)] flex items-center absolute bg-[var(--color-grey-light)] mr-[2px] rounded-se-[calc(0.375rem-2px)] rounded-ee-[calc(0.375rem-2px)] pointer-events-none">
									<div className="w-[2px] min-w-[2px] h-[calc(100%-0.75rem)] bg-[var(--color-grey)] rounded-full" />
									<div className="w-full h-full flex justify-center items-center pointer-events-none">
										<span className="fa-solid fa-magnifying-glass"></span>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			) : (
				<div className="custom-input w-full flex flex-col">
					{inputLabel && (
						<label
							className="font-semibold text-color flex"
							style={{
								fontSize: inputLabelSize,
							}}
						>
							<div className="inline-block">
								{inputLabel}
								{isRequired && !isNoRequiredIndicator && (
									<span className="text-[var(--color-secondary)]">
										*
									</span>
								)}
							</div>
							{isLoading && (
								<div className="pl-1">
									<span className="fa fa-spinner fa-spin text-[0.75rem]"></span>
								</div>
							)}
						</label>
					)}
					{inputNotes && (
						<div className="w-full flex justify-start text-[0.85rem] text-[var(--color-grey-dark)] italic mb-1">
							{inputNotes}
						</div>
					)}
					<input
						ref={inputRef}
						type={inputType}
						className="w-full p-2 rounded-md"
						style={{
							fontSize: inputTextSize,
							lineHeight: 1,
							background: inputBackgroundColor,
							// borderColor: inputBorderColor,
							color:
								(isDisabled || isReadOnly) &&
								"var(--color-grey-dark)",
						}}
						value={inputValue}
						onChange={handleStandardInputChange}
						placeholder={inputPlaceHolder}
						readOnly={isReadOnly}
						disabled={isDisabled}
						required={isRequired}
					></input>
				</div>
			)}
		</>
	);
}

export default CustomInput;
