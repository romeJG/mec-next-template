import { useEffect, useRef, useState } from "react";
import CustomInput from "../customs/CustomInput";
// import CustomModal from "../customs/CustomModal";
import { format } from "date-fns";
import CustomModalNoScroll from "../customs/CustomModalNoScroll";
import CustomTextArea from "../customs/CustomTextArea";
import useReimbursement from "../../apis/useReimbursement";
import CustomButton from "../customs/CustomButton";
import CustomAlertModal from "../customs/CustomAlertModal";
import capitalizeEveryWord from "../../utils/capitalizeEveryWord";
// import RequestListPreviewImageModal from "./RequestListPreviewImageModal";
import PreviewImageModal from "./PreviewImageModal";
import useDeviceSize from "../../hooks/useDeviceSize";
import CustomCheckbox2 from "../customs/CustomCheckBox2";

function RequestListViewDetailsModal({ details, isModalOpen, setIsModalOpen }) {
	const { getDownloadReceipts, getReceiptImage } = useReimbursement();

	const { isMobile } = useDeviceSize();

	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [fetchMessage, setFetchMessage] = useState("");

	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [imageName, setImageName] = useState("");

	const taxCheckboxStyles = {
		label: {
			width: "0",
			marginLeft: "0rem",
			marginRight: "0rem",
		},
	};

	const handleDownloadReceipt = (filename) => {
		getDownloadReceipts(
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
				<div className="w-full">
					<CustomInput
						inputType="text"
						inputLabel="Reference Number"
						inputValue={details.ref_number}
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
				</div>
				<div className="w-full">
					<label className="font-semibold text-color flex">
						Reimbursement Type
					</label>
					<div className="w-full p-2 border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md flex flex-wrap gap-2">
						{details.reimbursement_type &&
							JSON.parse(details.reimbursement_type).map(
								(rtype, index) => (
									<div
										key={rtype + index}
										className="py-1 px-4 bg-[var(--color-bg)] shadow-lift font-medium rounded-md"
									>
										{capitalizeEveryWord(rtype)}
									</div>
								)
							)}
					</div>
				</div>
				{details.reimbursement_details && (
					<>
						{JSON.parse(details.reimbursement_details).map(
							(detail, index) => (
								<div
									key={index}
									className="w-full p-2 mt-1 flex flex-col bg-[var(--color-bg)] border border-[var(--color-grey)] rounded-md relative"
								>
									<div className="w-full flex justify-end absolute mt-[-1.25rem]">
										<span className="font-semibold mr-6 bg-[var(--color-bg)] px-2 text-[var(--color-primary)]">
											{capitalizeEveryWord(
												detail.reimbursement_type
											)}
										</span>
									</div>
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

										{detail.details.map(
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
											<span className="font-semibold text-nowrap">
												Total Amount:
											</span>
											<CustomInput
												inputType="text"
												inputPlaceHolder="Enter Amount"
												inputValue={
													detail.amount
														? "PHP " +
														  parseFloat(
																detail.amount
														  ).toLocaleString(
																"en-US",
																{
																	minimumFractionDigits: 2,
																	maximumFractionDigits: 2,
																}
														  )
														: "PHP 0.00"
												}
												isDisabled
												isReadOnly
											/>
										</div>
									</div>
								</div>
							)
						)}
					</>
				)}
				<div className="w-full">
					<label className="font-semibold text-color flex">
						Receipts
					</label>
					<div className="w-full p-2 border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md flex flex-wrap gap-2">
						{details.receipts &&
							JSON.parse(details.receipts).map(
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
																setIsPreviewOpen(
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
															handleDownloadReceipt(
																receipt
															)
														}
														isDisabled={isLoading}
														isScaledOnHover={false}
														isDarkendOnHover
													/>
												</div>
											</div>
										</div>
									</div>
								)
							)}
					</div>
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
					<CustomInput
						inputType="text"
						inputLabel="Total Expense"
						inputValue={
							details.total_expense
								? "PHP " +
								  parseFloat(
										details.total_expense
								  ).toLocaleString("en-US", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
								  })
								: "PHP 0.00"
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
			</div>
		</>
	);
	return (
		<>
			<CustomModalNoScroll
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				modalSize="md"
				modalTitle="Request Details"
				modalTitleTWStyle="leading-none px-6"
				modalContent={modalContent}
				isCloseable
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
				isModalOpen={isPreviewOpen}
				setIsModalOpen={setIsPreviewOpen}
				imageName={imageName}
				getImage={getReceiptImage}
			/>
		</>
	);
}

export default RequestListViewDetailsModal;
