import { useEffect, useRef, useState } from "react";
import CustomModalNoScroll from "../customs/CustomModalNoScroll";
import CustomButton from "../customs/CustomButton";
import CustomInput from "../customs/CustomInput";
import useAudit from "../../apis/useAudit";
import CustomAlertModal from "../customs/CustomAlertModal";
import useDeviceSize from "../../hooks/useDeviceSize";
import CustomTextArea from "../customs/CustomTextArea";
import CustomFileUpload from "../customs/CustomFileUpload";
import CapturePhotoFullScreen from "./CapturePhotoFullScreen";
// import React from 'react'

function PettyCashEditModal({
	isModalOpen,
	setIsModalOpen,
	details,
	processorEmail,
	fetchPettyCash,
}) {
	const { updatePettyCashBalance } = useAudit();
	const { isMobile } = useDeviceSize();
	// const user = JSON.parse(localStorage.getItem("user-info")) ?? {};
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const [fetchMessage, setFetchMessage] = useState("");
	const [initialAmount, setInitialAmount] = useState("");
	const [isFocused, setIsFocused] = useState(false);
	const [notes, setNotes] = useState("");
	const [files, setFiles] = useState([]);
	const [isCameraOpen, setIsCameraOpen] = useState(false);

	const handleClose = () => {
		setInitialAmount("");
		setIsModalOpen(false);
	};

	const handleUpdateBalance = async () => {
		await updatePettyCashBalance(
			processorEmail,
			initialAmount,
			notes,
			files,
			setIsLoading,
			setIsError,
			setIsSuccess,
			setFetchMessage
		);
	};

	// Sync initial balance from details
	useEffect(() => {
		if (isModalOpen) {
			const numericValue = parseFloat(details.initial_balance);
			setInitialAmount(numericValue);
		}
	}, [details, isModalOpen]);

	useEffect(() => {
		if (isSuccess) {
			fetchPettyCash();
			handleClose();
		}
	}, [isSuccess]);

	const contentRef = useRef(null);
	const [isContentScrollable, setIsContentScrollable] = useState(false);
	useEffect(() => {
		const checkScrollability = () => {
			if (contentRef.current) {
				const { scrollHeight, clientHeight } = contentRef.current;
				setIsContentScrollable(scrollHeight > clientHeight);
			}
		};
		checkScrollability();
		window.addEventListener("resize", checkScrollability);
		return () => {
			window.removeEventListener("resize", checkScrollability);
		};
	}, [isModalOpen]);

	const modalContent = (
		<>
			<div
				ref={contentRef}
				className="w-full h-full mt-2 pl-6 pt-2 pb-4 flex flex-col gap-3 overflow-x-hidden overflow-y-auto"
				style={{
					paddingRight:
						isContentScrollable && !isMobile ? "0.5rem" : "1.5rem",
				}}
			>
				<div className="w-full flex flex-col gap-2">
					<div className="inline-block text-[var(--color-grey)] text-[0.85rem]">
						<span className="mr-1">Note:</span>
						<span className="fa-solid fa-circle-exclamation mr-1"></span>
						<span>
							The changes you make to the maximum petty cash fund
							will be submitted as a replenishment request and
							will await the custodian's/reimbursement processor's
							approval.
						</span>
					</div>
					<div className="flex flex-col gap-3 md:flex-row">
						<CustomInput
							inputType="text"
							inputLabel="Reimbursement Processor"
							inputValue={
								details.reimbursement_processor
									? JSON.parse(
											details.reimbursement_processor
									  )[1]
									: ""
							}
							isReadOnly
							isDisabled
						/>
						<CustomInput
							inputType="text"
							inputLabel="Department"
							inputValue={
								details.department ? details.department : ""
							}
							isReadOnly
							isDisabled
						/>
					</div>
					<div className="flex flex-col gap-3 md:flex-row">
						<CustomInput
							inputType="text"
							inputLabel="Current Balance"
							inputValue={
								details.current_balance
									? "PHP " +
									  parseFloat(
											details.current_balance
									  ).toLocaleString("en-US", {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
									  })
									: "PHP 0.00"
							}
							isReadOnly
							isDisabled
						/>
						<div
							className="w-full"
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
						>
							<CustomInput
								inputType="text"
								inputLabel="Max Petty Cash Fund"
								inputValue={
									isFocused
										? initialAmount
										: "PHP " +
										  parseFloat(
												initialAmount
										  ).toLocaleString("en-US", {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
										  })
								}
								setInputValue={setInitialAmount}
							/>
						</div>
					</div>
					<div className="w-full leading-tight">
						<CustomTextArea
							inputLabel="Remarks (Optional)"
							inputNotes="Kindly include a note or remark for the petty cash fund adjustment. (If needed)."
							inputPlaceHolder="Enter a remark..."
							inputValue={notes}
							setInputValue={setNotes}
						/>
					</div>
					<div className="w-full leading-tight">
						<CustomFileUpload
							files={files}
							setFiles={setFiles}
							inputLabel="Replenishment Form (Optional)"
							inputNotes="Please upload or capture the replenishment form. (Optional)"
							setIsCameraOpen={setIsCameraOpen}
							acceptedFileTypes={[
								"image/jpeg",
								"image/png",
								"image/gif",
								"text/csv",
								"application/pdf",
								"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
							]}
							isWithImageCapture
							// isRequired
						/>
					</div>
				</div>
			</div>
			<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
				<CustomButton
					buttonVariant="primary"
					buttonLabel="Update"
					buttonClick={handleUpdateBalance}
					isLoading={isLoading}
					isDisabled={isLoading}
				/>
				<CustomButton
					buttonVariant="bordered"
					buttonLabel="Cancel"
					buttonClick={handleClose}
					isDisabled={isLoading}
				/>
			</div>
		</>
	);

	return (
		<>
			<CustomModalNoScroll
				modalContent={modalContent}
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				modalSize="lg"
				modalTitle="Edit Initial Balance"
				modalTitleTWStyle="leading-none px-6"
				isCloseable
			/>

			<CapturePhotoFullScreen
				isModalOpen={isCameraOpen}
				setIsModalOpen={setIsCameraOpen}
				setFiles={setFiles}
			/>

			<CustomAlertModal
				modalVariant="success"
				modalMessage={fetchMessage}
				isModalOpen={isSuccess}
				modalButtonClick={() => setIsSuccess(false)}
			/>
			<CustomAlertModal
				modalVariant="error"
				modalMessage={fetchMessage}
				isModalOpen={isError}
				modalButtonClick={() => setIsError(false)}
			/>
		</>
	);
}

export default PettyCashEditModal;
