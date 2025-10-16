import { useState } from "react";
import CustomAlertModal from "./CustomAlertModal";

const CustomFileUpload = ({
	files,
	setFiles,
	inputLabel,
	inputLabelSize = "1rem",
	inputNotes,
	acceptedFileTypes,
	setIsCameraOpen,
	isWithImageCapture = false,
	isRequired = false,
	isNoRequiredIndicator = false,
	isMultiple = true,
	inputId = `file-input-${Math.random().toString(36).substring(2, 9)}`,
	iconSize = '7rem',
}) => {
	const [isFileInvalid, setIsFileInvalid] = useState(false);
	const isValidFile = (file) => {
		return file && acceptedFileTypes.includes(file.type);
	};

	const handleFileChange = (event) => {
		const selectedFiles = Array.from(event.target.files);
		const invalidFiles = selectedFiles.some((file) => !isValidFile(file));

		if (invalidFiles) {
			setIsFileInvalid(true);
		} else {
			setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
			setIsFileInvalid(false);
		}
	};

	const handleDrop = (event) => {
		event.preventDefault();
		let droppedFiles = Array.from(event.dataTransfer.files);

		if (!isMultiple && droppedFiles.length > 1) {
			droppedFiles = [droppedFiles[0]];
		}

		const invalidFiles = droppedFiles.some((file) => !isValidFile(file));

		if (invalidFiles) {
			setIsFileInvalid(true);
		} else {
			setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
			setIsFileInvalid(false);
		}
	};

	const handleDragOver = (event) => {
		event.preventDefault();
	};

	const handleDelete = (index) => {
		setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
	};

	return (
		<>
			{inputLabel && (
				<label
					className="font-semibold text-color inline-block"
					style={{
						fontSize: inputLabelSize,
					}}
				>
					{inputLabel}
					{isRequired && !isNoRequiredIndicator && (
						<span className="text-[var(--color-secondary)]">*</span>
					)}
				</label>
			)}
			{inputNotes && (
				<div className="w-full flex justify-start text-[0.85rem] text-[var(--color-grey-dark)] italic mb-1">
					{inputNotes}
				</div>
			)}
			<div className="w-full flex flex-col sm:flex-row gap-4">
				<div
					className="w-full border-dashed border border-[var(--color-grey)] rounded-md p-4 text-center
                bg-[var(--color-grey-light)] hover:bg-[var(--color-bg-secondary)] flex flex-col items-center"
					onDrop={handleDrop}
					onDragOver={handleDragOver}
				>
					<span className="fa-solid fa-file  text-[var(--color-grey)] my-4"
						style={{ fontSize: iconSize }} />
					<span className="mb-1">Drag & Drop Files Here or</span>

					<input
						type="file"
						multiple={isMultiple}
						accept={acceptedFileTypes}
						onChange={handleFileChange}
						style={{ display: "none" }}
						id={inputId}
					/>
					<label
						htmlFor={inputId}
						className="w-[10rem] py-3 text-white leading-none bg-[var(--color-primary)] rounded-md cursor-pointer"
					>
						Choose File
					</label>
				</div>
				{isWithImageCapture && (
					<>
						<div
							className="w-full border-dashed border border-[var(--color-grey)] rounded-md p-4 text-center
                bg-[var(--color-grey-light)] hover:bg-[var(--color-bg-secondary)] flex flex-col items-center"
						>
							<span className="fa-solid fa-camera text-[7rem] text-[var(--color-grey)] my-4" />
							<span className="mb-1">Capture a Photo</span>

							<div
								className="w-[10rem] py-3 text-white leading-none bg-[var(--color-primary)] rounded-md cursor-pointer"
								onClick={() => setIsCameraOpen(true)}
							>
								Open Camera
							</div>
						</div>
					</>
				)}
			</div>
			<div className="w-full mt-2 flex gap-2 flex-wrap">
				{files.map((file, index) => (
					<div
						key={index}
						className="p-2 bg-[var(--color-grey-light)] shadow-lift rounded-md flex gap-4 items-center justify-between"
					>
						<div className="flex gap-2 items-center">
							<div className="w-10 bg-[rgba(53,114,239,0.25)] aspect-square rounded-lg flex justify-center items-center">
								<span className="fa-solid fa-file text-white w-7 grid place-content-center text-center aspect-square rounded-full bg-[var(--color-primary)] text-[0.85rem]" />
							</div>
							<span className="text-[0.9rem]">{file.name}</span>
						</div>
						<span
							className="fa-solid fa-xmark w-7 aspect-square grid place-content-center text-center rounded-full hover:bg-[var(--color-grey)] cursor-pointer"
							onClick={() => handleDelete(index)}
						/>
					</div>
				))}
			</div>

			<CustomAlertModal
				isModalOpen={isFileInvalid}
				modalVariant="error"
				modalMessage={
					<div className="flex flex-col gap-1">
						<p>The file you selected is invalid.</p>
						<p>
							Please choose a valid file format: "jpg," "png,"
							"pdf," or "xlsx."
						</p>
					</div>
				}
				modalButtonClick={() => setIsFileInvalid(false)}
			/>
		</>
	);
};

export default CustomFileUpload;
