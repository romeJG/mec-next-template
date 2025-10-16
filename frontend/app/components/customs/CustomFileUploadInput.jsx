import { useRef, useState } from "react";

const CustomFileUploadInput = ({
	onChange = () => {},
	files = [],
	setFiles = () => {},
	labelTextSize = "1rem",
	inputLabel = "Files:",
	isDisabled = false,
	isLoading = false,
	isRequired = false,
}) => {
	const selectRef = useRef(null);
	const fileInputRef = useRef(null);

	const [isFocused, setIsFocused] = useState(false);

	const handleFileChange = (e) => {
		const newFiles = Array.from(e.target.files);
		const combined = [...files, ...newFiles];

		const unique = combined.filter(
			(file, idx, self) =>
				idx ===
				self.findIndex(
					(f) =>
						f.name === file.name &&
						f.lastModified === file.lastModified
				)
		);

		setFiles(unique);
		onChange?.(unique);
		e.target.value = "";
	};

	const handleRemove = (fileToRemove) => {
		const updated = files.filter((f) => f !== fileToRemove);
		setFiles(updated);
		onChange?.(updated);
	};

	const openFileDialog = () => {
		fileInputRef.current?.click();
	};

	return (
		<>
			<div className="w-full h-full flex flex-col relative">
				<label
					className="font-semibold flex"
					style={{ fontSize: labelTextSize }}
				>
					<div className="inline-block">
						{inputLabel}
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
					// onClick={() => setIsOpen(!isOpen)}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
				>
					{files.map((file, idx) => (
						<div
							key={idx}
							className="bg-[var(--color-bg)] shadow-lift rounded-full pl-3 pr-[0.35rem] py-[0.35rem] flex items-center gap-2"
						>
							{file.name}
							<span
								className="w-5 h-5 aspect-square fa-solid fa-xmark grid place-content-center text-center p-1 rounded-full cursor-pointer text-[0.75rem] opacity-50 hover:opacity-90 hover:bg-[var(--color-grey)] transition-all duration-150"
								onClick={(e) => {
									e.stopPropagation();
									handleRemove(file);
								}}
							></span>
						</div>
					))}

					<button
						onClick={openFileDialog}
						className="px-3 py-1 text-sm rounded-full bg-[var(--color-grey)] hover:brightness-95 text-[var(--color-text)] font-medium"
					>
						<span className="fa-solid fa-plus text-[0.75rem]"></span>{" "}
						Add Files
					</button>

					<input
						type="file"
						multiple
						ref={fileInputRef}
						onChange={handleFileChange}
						className="hidden"
					/>
				</div>
			</div>
		</>
	);
};

export default CustomFileUploadInput;
