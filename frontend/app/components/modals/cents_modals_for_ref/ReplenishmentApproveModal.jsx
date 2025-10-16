import React, { useEffect, useRef, useState } from "react";
import CustomModalNoScroll from "../customs/CustomModalNoScroll";
// import useReimbursement from "../../apis/useReimbursement";
import LoadingSpinner from "../animated/LoadingSpinner";
import { format, set } from "date-fns";
import CustomInput from "../customs/CustomInput";
import CustomTextArea from "../customs/CustomTextArea";
import CustomButton from "../customs/CustomButton";
// import ReplenishmentPreviewImage from "./ReplenishmentPreviewImage";
import CustomAlertModal from "../customs/CustomAlertModal";
import useReplenishment from "../../apis/useReplenishment";
import PreviewImageModal from "./PreviewImageModal";
import useDeviceSize from "../../hooks/useDeviceSize";

function ReplenishmentApproveModal({
	isModalOpen,
	setIsModalOpen,
	details,
	getAllRequest,
}) {
	const {
		getRequestDetailsByRefNumbers,
		getDownloadAttachment,
		getAttachmentImage,
		approveReplenishment,
		returnReplenishedRecord,
	} = useReplenishment();
	const { isMobile } = useDeviceSize();

	const userInfo = JSON.parse(localStorage.getItem("user-info"));

	const [requestDetails, setRequestDetails] = useState([]);
	const [isLoadingDetails, setIsLoadingDetails] = useState(false);
	const [isErrorDetails, setIsErrorDetails] = useState(false);
	const [isSuccessDetails, setIsSuccessDetails] = useState(false);
	const [fetchMessageDetails, setFetchMessageDetails] = useState("");

	const handleGetRequestDetails = async () => {
		await getRequestDetailsByRefNumbers(
			details.request_numbers ? JSON.parse(details.request_numbers) : [],
			setRequestDetails,
			setIsLoadingDetails,
			setIsErrorDetails,
			setIsSuccessDetails,
			setFetchMessageDetails
		);
	};

	// Calculating the Overall Total of Expense
	const [overallTotal, setOverallTotal] = useState(0);
	const calculateTotalExpense = () => {
		let total = 0;
		for (let i = 0; i < requestDetails.length; i++) {
			if (requestDetails[i].total_expense) {
				total += parseFloat(requestDetails[i].total_expense);
			}
		}
		setOverallTotal(total);
	};

	const [isLoadingDownload, setIsLoadingDownload] = useState(false);
	const [isErrorDownload, setIsErrorDownload] = useState(false);
	const [isSuccessDownload, setIsSuccessDownload] = useState(false);
	const [fetchMessageDownload, setFetchMessageDownload] = useState("");
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [imageName, setImageName] = useState("");

	const handleDownloadReceipt = (filename) => {
		getDownloadAttachment(
			filename,
			setIsLoadingDownload,
			setIsErrorDownload,
			setIsSuccessDownload,
			setFetchMessageDownload
		);
	};

	function isImageFile(filename) {
		const imageExtensions = [
			".png",
			".jpg",
			".jfif",
			".jpeg",
			".gif",
			".bmp",
			".webp",
			".tiff",
			".svg",
		];
		const fileExtension = filename
			.slice(filename.lastIndexOf("."))
			.toLowerCase();
		return imageExtensions.includes(fileExtension);
	}

	// Approve CA Records
	const [isApproveOpen, setIsApproveOpen] = useState(false);
	const [isApproveLoading, setIsApproveLoading] = useState(false);
	const [isApproveError, setIsApproveError] = useState(false);
	const [isApproveSuccess, setIsApproveSuccess] = useState(false);
	const [additionalNotes, setAdditionalNotes] = useState("");

	const handleConfirmApprove = async () => {
		await approveReplenishment(
			details.id,
			userInfo.user_creds.name,
			userInfo.user_creds.email,
			additionalNotes,
			setIsApproveLoading,
			setIsApproveError,
			setIsApproveSuccess,
			setFetchMessageDetails
		);
	};

	// Return Request for Revision
	const [isReturnOpen, setIsReturnOpen] = useState(false);
	const [returnNotes, setReturnNotes] = useState("");
	const [isLoadingReturn, setIsLoadingReturn] = useState(false);
	const [isSuccessReturn, setIsSuccessReturn] = useState(false);

	const handleConfirmReturn = async () => {
		if (returnNotes === "") {
			setFetchMessageDetails(
				"Please provide additional notes for revision."
			);
			setIsErrorDetails(true);
			return;
		}
		await returnReplenishedRecord(
			details.id,
			userInfo.user_creds.email,
			returnNotes,
			setIsLoadingReturn,
			setIsErrorDetails,
			setIsSuccessReturn,
			setFetchMessageDetails
		);
	};

	useEffect(() => {
		if (isModalOpen) {
			handleGetRequestDetails();
			setAdditionalNotes("");
			setReturnNotes("");
		}
	}, [isModalOpen]);

	useEffect(() => {
		if (isSuccessDetails) {
			calculateTotalExpense();
		}
	}, [isSuccessDetails]);

	useEffect(() => {
		if (isSuccessReturn) {
			setReturnNotes("");
			setIsReturnOpen(false);
			setIsModalOpen(false);
			getAllRequest();
		}
	}, [isSuccessReturn]);

	useEffect(() => {
		if (isApproveSuccess) {
			setAdditionalNotes("");
			setIsApproveOpen(false);
			setIsModalOpen(false);
			getAllRequest();
		}
	}, [isApproveSuccess]);

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
	}, [isContentScrollable, isModalOpen]);

	const modalContent = (
		<>
			<div
				ref={contentRef}
				className="w-full h-full mt-2 pl-6 pt-2 pb-4 flex flex-col gap-3 overflow-x-hidden overflow-y-auto leading-tight"
				style={{
					paddingRight:
						isContentScrollable && !isMobile ? "0.5rem" : "1.5rem",
				}}
			>
				<div className="w-full">
					<span className="font-semibold">
						{requestDetails.length > 1
							? "Replenished Requests"
							: "Replenished Request"}
					</span>
					<div className="w-full p-2 rounded-md border border-[var(--color-grey)] mt-1">
						<div
							className="w-full overflow-x-auto"
							ref={contentRef}
						>
							{isLoadingDetails ? (
								<div className="w-full min-h-[12rem] flex items-center justify-center">
									<LoadingSpinner
										loadingSpinnerSize="4rem"
										loadingSpinnerWidth="0.5rem"
										loadingSpinnerColor="var(--color-primary)"
									/>
								</div>
							) : (
								<table className="w-full relative">
									<thead className="w-full">
										<tr className="leading-none text-left bg-[var(--color-bg-secondary)]">
											<th className="p-1 py-3 border border-[var(--color-grey)] bg-[var(--color-bg-secondary)] sticky top-0">
												Reference Number
											</th>
											<th className="p-1 border border-[var(--color-grey)] bg-[var(--color-bg-secondary)] sticky top-0">
												Requestor
											</th>
											<th className="p-1 border border-[var(--color-grey)] bg-[var(--color-bg-secondary)] sticky top-0">
												Application Date
											</th>
											<th className="p-1 border border-[var(--color-grey)] bg-[var(--color-bg-secondary)] sticky top-0">
												Disbursement Date
											</th>
											<th className="p-1 border border-[var(--color-grey)] min-w-[10rem] bg-[var(--color-bg-secondary)] sticky top-0 right-0 z-20">
												Total Expense
											</th>
										</tr>
									</thead>
									<tbody className="w-full">
										{requestDetails.map((request) => (
											<tr key={request.ref_number}>
												<td className="p-1 border border-[var(--color-grey)] min-w-[11rem]">
													{request.ref_number}
												</td>
												<td className="p-1 border border-[var(--color-grey)] min-w-[12rem] text-nowrap">
													{request.fullname}
												</td>
												<td className="p-1 border border-[var(--color-grey)] min-w-[10rem]">
													{request.application_date
														? format(
																request.application_date,
																"MM/dd/yyyy"
														  )
														: "--"}
												</td>
												<td className="p-1 border border-[var(--color-grey)] min-w-[12rem]">
													{request.disbursement_date
														? format(
																request.disbursement_date,
																"MM/dd/yyyy"
														  )
														: "--"}
												</td>
												<td className="p-1 border border-[var(--color-grey)] min-w-[10rem] bg-[var(--color-bg-secondary)] sticky right-0 z-10">
													PHP{" "}
													{request.total_expense
														? parseFloat(
																request.total_expense
														  ).toFixed(2)
														: "--"}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
						</div>
						<div
							className="w-full flex justify-end mt-2"
							style={{
								paddingRight: isContentScrollable
									? "1rem"
									: "0",
							}}
						>
							<div className="font-semibold pr-1 opacity-75">
								Replenishment Total Amount:
							</div>
							<div className="font-bold">
								PHP {overallTotal.toFixed(2)}
							</div>
						</div>
					</div>
				</div>
				<div className="w-full flex gap-2">
					<CustomInput
						inputLabel="Cut-Off Date"
						inputValue={
							details.cutoff_start && details.cutoff_end
								? format(
										details.cutoff_start,
										"MMMM dd, yyyy"
								  ) +
								  " - " +
								  format(details.cutoff_end, "MMMM dd, yyyy")
								: "--"
						}
						isDisabled
						isReadOnly
					/>
					<CustomInput
						inputLabel="Replenishment Date"
						inputValue={
							details.replenishment_date
								? format(
										details.replenishment_date,
										"MMMM dd, yyyy"
								  )
								: "--"
						}
						isDisabled
						isReadOnly
					/>
				</div>
				<div className="w-full flex gap-2">
					<CustomInput
						inputLabel="Replenished By"
						inputValue={
							details.replenished_by
								? JSON.parse(details.replenished_by)[1]
								: "--"
						}
						isDisabled
						isReadOnly
					/>
					<CustomInput
						inputLabel="Reimbursement Processor"
						inputValue={
							details.reimbursement_processor
								? JSON.parse(details.reimbursement_processor)[1]
								: "--"
						}
						isDisabled
						isReadOnly
					/>
				</div>
				{details.attachment && (
					<div className="w-full">
						<label className="font-semibold text-color flex">
							{JSON.parse(details.attachment).length > 1
								? "Attachments"
								: "Attachment"}
						</label>
						<div className="w-full p-2 border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md flex flex-wrap gap-2">
							{JSON.parse(details.attachment).length > 0 ? (
								JSON.parse(details.attachment).map(
									(receipt, index) => (
										<div
											key={receipt + index}
											className="p-2 bg-[var(--color-bg)] shadow-lift flex gap-4 items-center justify-between font-medium rounded-md max-w-[15.5rem]"
										>
											<div className="w-full flex flex-col gap-2">
												<span className="text-[0.9rem] truncate">
													{receipt}
												</span>
												<div className="flex gap-2">
													{isImageFile(receipt) && (
														<div className="w-full">
															<CustomButton
																buttonVariant="solid"
																buttonSolidColor="var(--color-accent-medium)"
																buttonLabel={
																	<>
																		{isLoadingDownload ? (
																			<>
																				<span className="fa-solid fa-spinner fa-spin text-white" />
																			</>
																		) : (
																			<>
																				<div className="flex gap-2 items-center">
																					<span className="fa-solid fa-eye text-white" />
																					<span className="text-white text-[0.75rem]">
																						View
																					</span>
																				</div>
																			</>
																		)}
																	</>
																}
																buttonClick={() => {
																	setIsPreviewOpen(
																		true
																	);
																	setImageName(
																		receipt
																	);
																}}
																isDisabled={
																	isLoadingDownload
																}
																isScaledOnHover={
																	false
																}
																isDarkendOnHover
															/>
														</div>
													)}
													<div className="w-full">
														<CustomButton
															buttonVariant="solid"
															buttonSolidColor="var(--color-primary)"
															buttonLabel={
																<>
																	{isLoadingDownload ? (
																		<>
																			<span className="fa-solid fa-spinner fa-spin text-white" />
																		</>
																	) : (
																		<>
																			<div className="flex gap-2 items-center">
																				<span className="fa-solid fa-file-download text-white" />
																				<span className="text-white text-[0.75rem]">
																					Download
																				</span>
																			</div>
																		</>
																	)}
																</>
															}
															buttonClick={() =>
																handleDownloadReceipt(
																	receipt
																)
															}
															isDisabled={
																isLoadingDownload
															}
															isScaledOnHover={
																false
															}
															isDarkendOnHover
														/>
													</div>
												</div>
											</div>
										</div>
									)
								)
							) : (
								<>
									<span className="text-[var(--color-grey)] py-[0.15rem]">
										No attachment
									</span>
								</>
							)}
						</div>
					</div>
				)}
				{details.notes && (
					<div className="w-full">
						<CustomTextArea
							inputLabel="Notes"
							inputValue={details.notes}
							isDisabled
							isReadOnly
						/>
					</div>
				)}
				{/* <div className="w-full flex justify-center py-1">
					<div className="w-full h-[2px] min-h-[2px] rounded-full bg-[var(--color-grey)]"></div>
				</div>
				<div className="w-full">
					<CustomTextArea
						inputLabel="Additional Notes"
						inputNotes="Enter some additional notes if needed. Optional"
						inputValue={additionalNotes}
						setInputValue={setAdditionalNotes}
					/>
				</div> */}
			</div>
			<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
				<CustomButton
					buttonVariant="primary"
					buttonLabel="Approve"
					buttonClick={() => setIsApproveOpen(true)}
					isLoading={isApproveLoading}
					isDisabled={isApproveLoading}
				/>
				<CustomButton
					buttonVariant="secondary"
					buttonLabel="Return for Revision"
					buttonClick={() => setIsReturnOpen(true)}
					isDisabled={isLoadingReturn}
				/>
			</div>
		</>
	);

	const modalContentApprove = (
		<>
			<div
				ref={contentRef}
				className="w-full h-full mt-2 pl-6 pt-2 pb-4 flex flex-col gap-3 overflow-x-hidden overflow-y-auto"
				style={{
					paddingRight:
						isContentScrollable && !isMobile ? "0.5rem" : "1.5rem",
				}}
			>
				<CustomTextArea
					inputLabel="Remarks"
					inputNotes="Enter some additional notes if needed. Optional"
					inputPlaceHolder="Enter a remark..."
					inputValue={additionalNotes}
					setInputValue={setAdditionalNotes}
				/>
			</div>

			<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
				<CustomButton
					buttonVariant="primary"
					buttonLabel="Confirm"
					buttonClick={handleConfirmApprove}
					isLoading={isApproveLoading}
					isDisabled={isApproveLoading}
				/>
				<CustomButton
					buttonVariant="bordered"
					buttonLabel="Cancel"
					buttonClick={() => setIsApproveOpen(false)}
					isDisabled={isLoadingReturn}
				/>
			</div>
		</>
	);

	const modalContentReturn = (
		<>
			<div
				ref={contentRef}
				className="w-full h-full mt-2 pl-6 pt-2 pb-4 flex flex-col gap-3 overflow-x-hidden overflow-y-auto"
				style={{
					paddingRight:
						isContentScrollable && !isMobile ? "0.5rem" : "1.5rem",
				}}
			>
				<CustomTextArea
					inputLabel="Remarks"
					inputNotes="Kindly include a note or reason for returning this request."
					inputPlaceHolder="Enter a remark..."
					inputValue={returnNotes}
					setInputValue={setReturnNotes}
					isRequired
				/>
			</div>

			<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
				<CustomButton
					buttonVariant="primary"
					buttonLabel="Confirm"
					buttonClick={handleConfirmReturn}
					isLoading={isLoadingReturn}
					isDisabled={isLoadingReturn}
				/>
				<CustomButton
					buttonVariant="bordered"
					buttonLabel="Cancel"
					buttonClick={() => setIsReturnOpen(false)}
					isDisabled={isLoadingReturn}
				/>
			</div>
		</>
	);

	return (
		<>
			<CustomModalNoScroll
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				modalSize="md"
				modalTitle="Review Replenished Record"
				modalTitleTWStyle="leading-none px-6"
				modalContent={modalContent}
				isCloseable
			/>

			<PreviewImageModal
				isModalOpen={isPreviewOpen}
				setIsModalOpen={setIsPreviewOpen}
				imageName={imageName}
				getImage={getAttachmentImage}
			/>

			{/* APPROVE */}
			<CustomModalNoScroll
				isModalOpen={isApproveOpen}
				setIsModalOpen={setIsApproveOpen}
				modalSize="md"
				modalTitle="Approve Replenishment Record"
				modalTitleTWStyle="leading-none px-6"
				modalContent={modalContentApprove}
				isCloseable
			/>
			<CustomAlertModal
				modalVariant="error"
				isModalOpen={isApproveError}
				modalButtonClick={() => setIsApproveError(false)}
				modalMessage={fetchMessageDetails}
			/>
			<CustomAlertModal
				modalVariant="success"
				isModalOpen={isApproveSuccess}
				modalButtonClick={() => {
					setIsApproveSuccess(false);
					// handleGetAllRequests();
				}}
				modalMessage={fetchMessageDetails}
			/>

			{/* RETURN */}
			<CustomModalNoScroll
				isModalOpen={isReturnOpen}
				setIsModalOpen={setIsReturnOpen}
				modalSize="md"
				modalTitle="Return Replenishment Record"
				modalContent={modalContentReturn}
				modalTitleTWStyle="leading-none px-6"
				isCloseable
			/>
			<CustomAlertModal
				modalVariant="success"
				modalMessage={fetchMessageDetails}
				isModalOpen={isSuccessReturn}
				modalButtonClick={() => setIsSuccessReturn(false)}
			/>

			<CustomAlertModal
				modalVariant="error"
				modalMessage={fetchMessageDetails}
				isModalOpen={isErrorDetails}
				modalButtonClick={() => setIsErrorDetails(false)}
			/>

			<CustomAlertModal
				modalVariant="success"
				modalMessage={fetchMessageDownload}
				isModalOpen={isSuccessDownload}
				modalButtonClick={() => setIsSuccessDownload(false)}
			/>
			<CustomAlertModal
				modalVariant="error"
				modalMessage={fetchMessageDownload}
				isModalOpen={isErrorDownload}
				modalButtonClick={() => setIsErrorDownload(false)}
			/>
		</>
	);
}

export default ReplenishmentApproveModal;
