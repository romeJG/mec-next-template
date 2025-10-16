import { useEffect, useRef, useState } from "react";
import CustomInput from "../../customs/CustomInput";
import { format } from "date-fns";
import CustomModalNoScroll from "../../customs/CustomModalNoScroll";
import CustomButton from "../../customs/CustomButton";
import CustomAlertModal from "../../customs/CustomAlertModal";
import PreviewImageModal from "../PreviewImageModal";
import CustomTextArea from "../../customs/CustomTextArea";
import useCashAdvance from "../../apis/useCashAdvance";
import capitalizeEveryWord from "../../../utils/capitalizeEveryWord";
import useDeviceSize from "../../../hooks/useDeviceSize";
import CustomCheckbox2 from "../../customs/CustomCheckBox2";

function CARequestListReviewModal({
	details,
	isModalOpen,
	setIsModalOpen,
	getAllRequest,
}) {
	// const { getDownloadReceipts } = useReimbursement();
	const userInfo = JSON.parse(localStorage.getItem("user-info"));

	const {
		getDisbursementAttachmentImage,
		getLiquidationAttachmentImage,
		getReturnAttachmentImage,
		downloadDisbursementAttachment,
		downloadLiquidationAttachment,
		downloadReturnAttachment,
		approveLiquidatedCARequest,
		returnLiquidatedCARequest,
	} = useCashAdvance();

	const { isMobile } = useDeviceSize();

	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [fetchMessage, setFetchMessage] = useState("");

	const taxCheckboxStyles = {
		label: {
			width: "0",
			marginLeft: "0rem",
			marginRight: "0rem",
		},
	};

	// Image Preview
	const [isPreviewOpenDisburse, setIsPreviewOpenDisburse] = useState(false);
	const [isPreviewOpenLiquidate, setIsPreviewOpenLiquidate] = useState(false);
	const [isPreviewOpenReturn, setIsPreviewOpenReturn] = useState(false);
	const [imageName, setImageName] = useState("");

	// Liquidated CA Request Approval
	const [isApproveOpen, setIsApproveOpen] = useState(false);
	const [isLoadingApproved, setIsLoadingApproved] = useState(false);
	const [isSuccessApproved, setIsSuccessApproved] = useState(false);

	// Return Request for Revision
	const [isReturnOpen, setIsReturnOpen] = useState(false);
	const [additionalNotes, setAdditionalNotes] = useState("");
	const [isLoadingReturn, setIsLoadingReturn] = useState(false);
	const [isSuccessReturn, setIsSuccessReturn] = useState(false);

	const handleConfirmApproval = async () => {
		await approveLiquidatedCARequest(
			details.ref_number,
			userInfo.user_creds.email,
			setIsLoadingApproved,
			setIsSuccessApproved,
			setIsError,
			setFetchMessage
		);
	};

	const handleConfirmReturn = async () => {
		if (additionalNotes === "") {
			setFetchMessage("Please provide additional notes for revision.");
			setIsError(true);
			return;
		}
		await returnLiquidatedCARequest(
			details.ref_number,
			userInfo.user_creds.email,
			additionalNotes,
			setIsLoadingReturn,
			setIsSuccessReturn,
			setIsError,
			setFetchMessage
		);
	};

	const handleDownloadReceiptDisburse = (filename) => {
		downloadDisbursementAttachment(
			filename,
			setIsLoading,
			setIsError,
			setIsSuccess,
			setFetchMessage
		);
	};
	const handleDownloadReceiptLiquidate = (filename) => {
		downloadLiquidationAttachment(
			filename,
			setIsLoading,
			setIsError,
			setIsSuccess,
			setFetchMessage
		);
	};
	const handleDownloadReceiptReturn = (filename) => {
		downloadReturnAttachment(
			filename,
			setIsLoading,
			setIsError,
			setIsSuccess,
			setFetchMessage
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

	useEffect(() => {
		if (isSuccessApproved) {
			setIsApproveOpen(false);
			setIsModalOpen(false);
			getAllRequest();
		}
	}, [isSuccessApproved]);

	useEffect(() => {
		if (isSuccessReturn) {
			setAdditionalNotes("");
			setIsReturnOpen(false);
			setIsModalOpen(false);
			getAllRequest();
		}
	}, [isSuccessReturn]);

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
				<div className="font-semibold text-gradient-soft text-[1.25rem] mt-4 mb-[-0.5rem] flex items-center gap-2">
					<span className="leading-none text-nowrap">
						CASH ADVANCE DETAILS
					</span>
					<div className="w-full h-[2px] min-h-[2px] bg-[var(--color-accent-medium)] rounded-sm" />
				</div>
				<div className="w-full flex flex-col md:flex-row gap-3">
					<CustomInput
						inputType="text"
						inputLabel="Reference Number"
						inputValue={details.ref_number}
						isReadOnly
						isDisabled
					/>
					<CustomInput
						inputType="text"
						inputLabel="Application Date"
						inputValue={
							details.application_date
								? format(
										details.application_date,
										"MMMM dd, yyyy"
								  )
								: "--"
						}
						isReadOnly
						isDisabled
					/>
				</div>
				<div className="w-full flex flex-col md:flex-row gap-3">
					<CustomInput
						inputType="text"
						inputLabel="Full Name"
						inputValue={details.fullname}
						isReadOnly
						isDisabled
					/>
					<CustomInput
						inputType="text"
						inputLabel="Email"
						inputValue={details.email}
						isReadOnly
						isDisabled
					/>
				</div>
				<div className="w-full flex flex-col md:flex-row gap-3">
					<CustomInput
						inputType="text"
						inputLabel="Position"
						inputValue={details.position}
						isReadOnly
						isDisabled
					/>
					<CustomInput
						inputType="text"
						inputLabel="Department"
						inputValue={details.department}
						isReadOnly
						isDisabled
					/>
				</div>
				<div className="w-full flex flex-col md:flex-row gap-3">
					<CustomInput
						inputType="text"
						inputLabel="Disbursement Date"
						inputValue={
							details.disbursement_date
								? format(
										details.disbursement_date,
										"MMMM dd, yyyy"
								  )
								: "--"
						}
						isReadOnly
						isDisabled
					/>
					<CustomInput
						inputType="text"
						inputLabel="Liquidation Date"
						inputValue={
							details.liquidation_date
								? format(
										details.liquidation_date,
										"MMMM dd, yyyy"
								  )
								: "--"
						}
						isReadOnly
						isDisabled
					/>
				</div>

				<div className="w-full flex flex-col gap-3">
					<CustomInput
						inputType="text"
						inputLabel="Amount Requested"
						inputValue={
							details.amount_requested
								? "PHP " +
								  parseFloat(details.amount_requested).toFixed(
										2
								  )
								: "--"
						}
						isReadOnly
						isDisabled
					/>
					<CustomTextArea
						inputLabel="Cash Advance Purpose"
						inputValue={details.ca_purpose}
						isReadOnly
						isDisabled
					/>
				</div>
				{details.disbursement_attachment && (
					<>
						{JSON.parse(details.disbursement_attachment).length >
							0 && (
							<div className="w-full">
								<label className="font-semibold text-color flex">
									{JSON.parse(details.disbursement_attachment)
										.length > 1
										? "Disbursement Attachments"
										: "Disbursement Attachment"}
								</label>
								<div className="w-full p-2 border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md flex flex-wrap gap-2">
									{JSON.parse(
										details.disbursement_attachment
									).map((receipt, index) => (
										<div
											key={receipt + index}
											className="p-2 bg-[var(--color-bg)] shadow-lift flex gap-4 items-center justify-between font-medium rounded-md min-w-[15.5rem] max-w-[15.5rem]"
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
																		{isLoading ? (
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
																	setIsPreviewOpenDisburse(
																		true
																	);
																	setImageName(
																		receipt
																	);
																}}
																isDisabled={
																	isLoading
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
																	{isLoading ? (
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
																handleDownloadReceiptDisburse(
																	receipt
																)
															}
															isDisabled={
																isLoading
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
									))}
								</div>
							</div>
						)}
					</>
				)}
				<div className="font-semibold text-gradient-soft text-[1.25rem] mt-4 mb-[-0.5rem] flex items-center gap-2">
					<span className="leading-none text-nowrap">
						PAYMENT DETAILS
					</span>
					<div className="w-full h-[2px] min-h-[2px] bg-[var(--color-accent-medium)] rounded-sm" />
				</div>
				<div className="w-full flex flex-col md:flex-row gap-3">
					<CustomInput
						inputType="text"
						inputLabel="Payment Type"
						inputValue={
							details.payment_type === 1
								? "Petty Cash"
								: details.payment_type === 2
								? "GCash"
								: "BDO"
						}
						isReadOnly
						isDisabled
					/>
				</div>
				{details.payment_type === 2 ? (
					<>
						<div className="w-full flex flex-col md:flex-row gap-3">
							<CustomInput
								inputType="text"
								inputLabel="GCash Name"
								inputValue={details.gcash_name}
								isReadOnly
								isDisabled
							/>
							<CustomInput
								inputType="text"
								inputLabel="GCash Number"
								inputValue={details.gcash_number}
								isReadOnly
								isDisabled
							/>
						</div>
					</>
				) : details.payment_type === 3 ? (
					<>
						<div className="w-full flex flex-col md:flex-row gap-3">
							<CustomInput
								inputType="text"
								inputLabel="BDO Name"
								inputValue={details.bdo_name}
								isReadOnly
								isDisabled
							/>
							<CustomInput
								inputType="text"
								inputLabel="BDO Number"
								inputValue={details.bdo_number}
								isReadOnly
								isDisabled
							/>
						</div>
					</>
				) : (
					<></>
				)}
				<div className="font-semibold text-gradient-soft text-[1.25rem] mt-4 mb-[-0.5rem] flex items-center gap-2">
					<span className="leading-none text-nowrap">
						EXPENSE DETAILS
					</span>
					<div className="w-full h-[2px] min-h-[2px] bg-[var(--color-accent-medium)] rounded-sm" />
				</div>
				{details.expense_type && (
					<div className="w-full">
						<label className="font-semibold text-color flex">
							Expense Type
						</label>
						<div className="w-full p-2 border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md flex flex-wrap gap-2">
							{JSON.parse(details.expense_type).map(
								(type, index) => (
									<div
										key={type + index}
										className="p-2 bg-[var(--color-bg)] shadow-lift flex gap-4 items-center font-medium rounded-md"
									>
										{capitalizeEveryWord(type)}
									</div>
								)
							)}
						</div>
					</div>
				)}
				{details.expense_details && (
					<div className="w-full flex flex-col gap-2">
						<label className="font-semibold text-color flex mb-[-0.5rem]">
							Expense Details
						</label>

						{JSON.parse(details.expense_details).map(
							(expense, index) => (
								<div
									key={expense + index}
									className="w-full p-2 mt-1 flex flex-col bg-[var(--color-bg)] border border-[var(--color-grey)] rounded-md relative"
								>
									<div className="w-full flex justify-end absolute mt-[-1.25rem]">
										<span className="font-semibold mr-6 bg-[var(--color-bg)] px-2 text-[var(--color-primary)]">
											{capitalizeEveryWord(
												expense.reimbursement_type
											)}
										</span>
									</div>
									{/* <CustomTextArea
										inputLabel="Reimbursement Details"
										inputValue={expense.details}
										isReadOnly
										isDisabled
									/> */}
									<div className="w-full flex flex-col gap-2 mb-2 overflow-y-auto pb-1">
										<div className="w-full flex gap-2 leading-tight mb-[-0.5rem] font-semibold justify-between relative">
											<div className="min-w-[3rem] w-[3rem]"></div>
											<div className="min-w-[15rem] w-[15rem]">
												Receipt No.
											</div>
											<div className="min-w-[20rem] w-full">
												Description
											</div>
											<div className="min-w-[10rem] w-[10rem]">
												Amount
											</div>
											<div className="min-w-[3rem] w-[3rem] text-center">
												VAT
											</div>
											<div className="min-w-[10rem] w-[10rem] mr-[-0.5rem]">
												Gross Amount
											</div>
										</div>

										{expense.details.map(
											(details, index) => (
												<div
													key={index}
													className="w-full flex gap-2 leading-none justify-between relative"
												>
													<div className="min-w-[3rem] w-[3rem] border border-[var(--color-grey)] rounded-md bg-[var(--color-grey-light)] grid place-content-center">
														{index > 9
															? index + 1
															: "0" + (index + 1)}
													</div>
													<div className="min-w-[15rem] w-[15rem]">
														<CustomInput
															inputType="text"
															inputValue={
																details.receipt_number
															}
															inputPlaceHolder="Enter Receipt No."
															isDisabled
															isReadOnly
														/>
													</div>
													<div className="min-w-[20rem] w-full">
														<CustomInput
															inputType="text"
															inputValue={
																details.reimbursement_desc
															}
															inputPlaceHolder="Enter Description"
															isDisabled
															isReadOnly
														/>
													</div>
													<div className="min-w-[10rem] w-[10rem]">
														<CustomInput
															inputType="text"
															inputValue={
																details.reimbursement_amount
																	? "PHP " +
																	  parseFloat(
																			details.reimbursement_amount
																	  ).toLocaleString(
																			"en-US",
																			{
																				minimumFractionDigits: 2,
																				maximumFractionDigits: 2,
																			}
																	  )
																	: "PHP 0.00"
															}
															inputPlaceHolder="Enter Amount"
															isDisabled
															isReadOnly
														/>
													</div>
													<div className="min-w-[3rem] w-[3rem]">
														<div className="w-full h-full border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md grid place-content-center">
															<CustomCheckbox2
																checked={
																	details.with_tax ===
																	1
																}
																disabled
																customStyles={
																	taxCheckboxStyles
																}
																onChange={() => {
																	return;
																}}
															/>
														</div>
													</div>
													<div className="min-w-[10rem] w-[10rem] mr-[-0.5rem]">
														<CustomInput
															inputType="text"
															inputValue={
																details.gross_amount
																	? "PHP " +
																	  parseFloat(
																			details.gross_amount
																	  ).toLocaleString(
																			"en-US",
																			{
																				minimumFractionDigits: 2,
																				maximumFractionDigits: 2,
																			}
																	  )
																	: "PHP 0.00"
															}
															inputPlaceHolder="Enter Amount"
															isDisabled
															isReadOnly
														/>
													</div>
												</div>
											)
										)}
									</div>
									<div className="w-full flex justify-end">
										<div className="flex gap-2 items-center">
											<span className="font-semibold">
												Amount:
											</span>
											<CustomInput
												inputType="text"
												inputValue={
													"PHP " +
													parseFloat(
														expense.amount
													).toFixed(2)
												}
												isReadOnly
												isDisabled
											/>
										</div>
									</div>
								</div>
							)
						)}
					</div>
				)}
				<div className="w-full">
					<CustomInput
						inputType="text"
						inputLabel="Total Amount of Expense"
						inputValue={
							"PHP " +
							parseFloat(details.total_expense).toFixed(2)
						}
						isReadOnly
						isDisabled
					/>
				</div>
				{details.liquidation_attachment && (
					<>
						{JSON.parse(details.liquidation_attachment).length >
							0 && (
							<div className="w-full">
								<label className="font-semibold text-color flex">
									{JSON.parse(details.liquidation_attachment)
										.length > 1
										? "Liquidation Attachments"
										: "Liquidation Attachment"}
								</label>
								<div className="w-full p-2 border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md flex flex-wrap gap-2">
									{JSON.parse(
										details.liquidation_attachment
									).map((receipt, index) => (
										<div
											key={receipt + index}
											className="p-2 bg-[var(--color-bg)] shadow-lift flex gap-4 items-center justify-between font-medium rounded-md min-w-[15.5rem] max-w-[15.5rem]"
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
																		{isLoading ? (
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
																	setIsPreviewOpenLiquidate(
																		true
																	);
																	setImageName(
																		receipt
																	);
																}}
																isDisabled={
																	isLoading
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
																	{isLoading ? (
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
																handleDownloadReceiptLiquidate(
																	receipt
																)
															}
															isDisabled={
																isLoading
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
									))}
								</div>
							</div>
						)}
					</>
				)}
				{parseFloat(details.total_excess) > 0 && (
					<>
						<div className="font-semibold text-gradient-soft text-[1.25rem] mt-4 mb-[-0.5rem] flex items-center gap-2">
							<span className="leading-none text-nowrap">
								EXCESS DETAILS
							</span>
							<div className="w-full h-[2px] min-h-[2px] bg-[var(--color-accent-medium)] rounded-sm" />
						</div>
						<div className="w-full">
							<CustomInput
								inputType="text"
								inputLabel="Total Amount of Excess"
								inputValue={
									"PHP " +
									parseFloat(details.total_excess).toFixed(2)
								}
								isReadOnly
								isDisabled
							/>
						</div>
						{details.return_attachment && (
							<>
								{JSON.parse(details.return_attachment).length >
									0 && (
									<div className="w-full">
										<label className="font-semibold text-color flex">
											{JSON.parse(
												details.return_attachment
											).length > 1
												? "Excess Return Attachments"
												: "Excess Return Attachment"}
										</label>
										<div className="w-full p-2 border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md flex flex-wrap gap-2">
											{JSON.parse(
												details.return_attachment
											).map((receipt, index) => (
												<div
													key={receipt + index}
													className="p-2 bg-[var(--color-bg)] shadow-lift flex gap-4 items-center justify-between font-medium rounded-md min-w-[15.5rem] max-w-[15.5rem]"
												>
													<div className="w-full flex flex-col gap-2">
														<span className="text-[0.9rem] truncate">
															{receipt}
														</span>
														<div className="flex gap-2">
															{isImageFile(
																receipt
															) && (
																<div className="w-full">
																	<CustomButton
																		buttonVariant="solid"
																		buttonSolidColor="var(--color-accent-medium)"
																		buttonLabel={
																			<>
																				{isLoading ? (
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
																			setIsPreviewOpenReturn(
																				true
																			);
																			setImageName(
																				receipt
																			);
																		}}
																		isDisabled={
																			isLoading
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
																			{isLoading ? (
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
																		handleDownloadReceiptReturn(
																			receipt
																		)
																	}
																	isDisabled={
																		isLoading
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
											))}
										</div>
									</div>
								)}
							</>
						)}
					</>
				)}
			</div>
			<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex flex-col sm:flex-row gap-2 bg-[var(--color-bg)]">
				<CustomButton
					buttonVariant="primary"
					buttonLabel="Approve"
					buttonClick={() => setIsApproveOpen(true)}
					isLoading={isLoadingApproved}
					isDisabled={isLoadingApproved}
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
					inputValue={additionalNotes}
					setInputValue={setAdditionalNotes}
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
					// isLoading={isLoadingReturn}
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
				modalTitle="Review Liquidated CA Request"
				modalTitleTWStyle="leading-none px-6"
				modalContent={modalContent}
				isCloseable
			/>

			{/* APPROVE */}
			<CustomAlertModal
				isModalOpen={isApproveOpen}
				modalVariant="confirm"
				modalMessage={
					<>
						<div>
							<span className="fa fa-circle-exclamation text-[var(--color-grey-dark)] mr-1 text-[0.85rem]" />
							<span className="mr-1">
								Proceeding will approve the liquidated cash
								advance request.
							</span>
						</div>
						<div>
							Please review all information carefully before
							continuing.
						</div>
					</>
				}
				modalHeadline="Approve the Liquidated CA Request?"
				modalButtonClick={() => setIsApproveOpen(false)}
				modalButtonConfirm={handleConfirmApproval}
				isLoading={isLoadingApproved}
			/>
			<CustomAlertModal
				modalVariant="success"
				modalMessage={fetchMessage}
				isModalOpen={isSuccessApproved}
				modalButtonClick={() => setIsSuccessApproved(false)}
			/>

			{/* RETURN */}
			<CustomModalNoScroll
				isModalOpen={isReturnOpen}
				setIsModalOpen={setIsReturnOpen}
				modalSize="md"
				modalTitle="Return Liquidated CA Request"
				modalTitleTWStyle="leading-none px-6"
				modalContent={modalContentReturn}
				isCloseable
			/>
			<CustomAlertModal
				modalVariant="success"
				modalMessage={fetchMessage}
				isModalOpen={isSuccessReturn}
				modalButtonClick={() => setIsSuccessReturn(false)}
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

			<PreviewImageModal
				isModalOpen={isPreviewOpenDisburse}
				setIsModalOpen={setIsPreviewOpenDisburse}
				imageName={imageName}
				getImage={getDisbursementAttachmentImage}
			/>
			<PreviewImageModal
				isModalOpen={isPreviewOpenLiquidate}
				setIsModalOpen={setIsPreviewOpenLiquidate}
				imageName={imageName}
				getImage={getLiquidationAttachmentImage}
			/>
			<PreviewImageModal
				isModalOpen={isPreviewOpenReturn}
				setIsModalOpen={setIsPreviewOpenReturn}
				imageName={imageName}
				getImage={getReturnAttachmentImage}
			/>
		</>
	);
}

export default CARequestListReviewModal;
