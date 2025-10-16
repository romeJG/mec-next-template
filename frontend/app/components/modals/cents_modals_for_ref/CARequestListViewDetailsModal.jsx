import { useEffect, useRef, useState } from "react";
import CustomInput from "../../customs/CustomInput";
import { format } from "date-fns";
import CustomModalNoScroll from "../../customs/CustomModalNoScroll";
import CustomButton from "../../customs/CustomButton";
import CustomAlertModal from "../../customs/CustomAlertModal";
import PreviewImageModal from "../PreviewImageModal";
import CustomTextArea from "../../customs/CustomTextArea";
import useCashAdvance from "../../apis/useCashAdvance";
import useDeviceSize from "../../../hooks/useDeviceSize";

function CARequestListViewDetailsModal({
	details,
	isModalOpen,
	setIsModalOpen,
}) {
	// const { getDownloadReceipts } = useReimbursement();
	const { isMobile } = useDeviceSize();
	const {
		getDisbursementAttachmentImage,
		getLiquidationAttachmentImage,
		getReturnAttachmentImage,
		downloadDisbursementAttachment,
		downloadLiquidationAttachment,
		downloadReturnAttachment,
	} = useCashAdvance();

	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [fetchMessage, setFetchMessage] = useState("");

	const [isPreviewOpenDisburse, setIsPreviewOpenDisburse] = useState(false);
	const [isPreviewOpenLiquidate, setIsPreviewOpenLiquidate] = useState(false);
	const [isPreviewOpenReturn, setIsPreviewOpenReturn] = useState(false);
	const [imageName, setImageName] = useState("");

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
	}, []);

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
				<div className="w-full">
					<CustomTextArea
						inputLabel="Cash Advance Purpose"
						inputValue={details.ca_purpose}
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
				{details.return_attachment && (
					<>
						{JSON.parse(details.return_attachment).length > 0 && (
							<div className="w-full">
								<label className="font-semibold text-color flex">
									{JSON.parse(details.return_attachment)
										.length > 1
										? "Excess Return Attachments"
										: "Excess Return Attachment"}
								</label>
								<div className="w-full p-2 border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md flex flex-wrap gap-2">
									{JSON.parse(details.return_attachment).map(
										(receipt, index) => (
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
										)
									)}
								</div>
							</div>
						)}
					</>
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
				modalTitle="CA Request Details"
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

export default CARequestListViewDetailsModal;
