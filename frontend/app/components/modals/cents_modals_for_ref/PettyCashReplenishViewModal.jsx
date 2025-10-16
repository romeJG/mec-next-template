import { useEffect, useRef, useState } from "react";
import CustomModalNoScroll from "../customs/CustomModalNoScroll";
import CustomInput from "../customs/CustomInput";
import useDeviceSize from "../../hooks/useDeviceSize";
import CustomTextArea from "../customs/CustomTextArea";
import CustomButton from "../customs/CustomButton";
import useReplenishment from "../../apis/useReplenishment";
import CustomAlertModal from "../customs/CustomAlertModal";
import PreviewImageModal from "./PreviewImageModal";
import useAudit from "../../apis/useAudit";
import PettyCashConfirmReplenish from "./PettyCashConfirmReplenish";
import PettyCashDenyReplenish from "./PettyCashDenyReplenish";

function PettyCashReplenishViewModal({
	isModalOpen,
	setIsModalOpen,
	details,
	handleReload,
	isForReview = false,
}) {
	const { isMobile } = useDeviceSize();
	const { getDownloadAttachment, getAttachmentImage } = useReplenishment();
	const { confirmPettyCashReplenishment } = useAudit();

	const [isLoadingDownload, setIsLoadingDownload] = useState(false);
	const [isErrorDownload, setIsErrorDownload] = useState(false);
	const [isSuccessDownload, setIsSuccessDownload] = useState(false);
	const [fetchMessageDownload, setFetchMessageDownload] = useState("");
	const [isPreviewOpen, setIsPreviewOpen] = useState(false);
	const [imageName, setImageName] = useState("");

	const [isOpenConfirm, setIsOpenConfirm] = useState(false);
	const [isOpenDeny, setIsOpenDeny] = useState(false);

	const handleDownloadReceipt = (filename) => {
		getDownloadAttachment(
			filename,
			setIsLoadingDownload,
			setIsErrorDownload,
			setIsSuccessDownload,
			setFetchMessageDownload
		);
	};

	const handleOpenConfirm = () => {
		setIsOpenConfirm(true);
	};

	const handleOpenDeny = () => {
		setIsOpenDeny(true);
	};

	const generateStatus = (status) => {
		switch (status) {
			case 1:
				return (
					<div className="py-1 px-3 bg-[var(--color-yellow)] text-white font-medium rounded-full leading-tight">
						Pending
					</div>
				);
			case 2:
				return (
					<div className="py-1 px-3 bg-[var(--color-tertiary)] text-white font-medium rounded-full leading-tight">
						Confirmed
					</div>
				);
			case 3:
				return (
					<div className="py-1 px-3 bg-[var(--color-secondary)] text-white font-medium rounded-full leading-tight">
						Denied
					</div>
				);
			default:
				return null;
		}
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
				<div className="w-full flex flex-col gap-2">
					<CustomInput
						inputType="text"
						inputLabel="Reimbursement Processor"
						inputValue={
							details.custodian
								? JSON.parse(details.custodian)[1]
								: ""
						}
						isReadOnly
						isDisabled
					/>
					<div className="flex flex-col gap-3 md:flex-row">
						<CustomInput
							inputType="text"
							inputLabel="Max Petty Cash Fund"
							inputValue={
								details.initial_balance
									? details.initial_balance
									: ""
							}
							isReadOnly
							isDisabled
						/>
						<CustomInput
							inputType="text"
							inputLabel="Current Balance"
							inputValue={
								details.current_balance
									? details.current_balance
									: ""
							}
							isReadOnly
							isDisabled
						/>
					</div>
					<div className="flex flex-col gap-3 md:flex-row">
						<div className="w-full">
							<label className="font-semibold text-color flex">
								Status
							</label>
							<div className="w-full p-2 py-0 h-10 border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md flex flex-wrap items-center gap-2">
								{generateStatus(details.status)}
							</div>
						</div>
						<div className="w-full">
							<label className="font-semibold text-color flex">
								Adjusted Amount
							</label>
							<div className="w-full h-10 p-2 py-[0.4rem] border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md flex flex-wrap gap-2">
								<div className="flex gap-1 items-center">
									<div
										className={`w-4 h-4 rounded-full grid place-content-center text-center text-white text-[0.6rem]
						${
							parseFloat(details.adjusted_amount) > 0
								? "bg-[var(--color-tertiary)]"
								: "bg-[var(--color-secondary)]"
						}`}
									>
										<span
											className={`fa-solid
							${parseFloat(details.adjusted_amount) > 0 ? "fa-plus" : "fa-minus"}
							`}
										></span>
									</div>
									<div>
										{"PHP " +
											Math.abs(
												parseFloat(
													details.adjusted_amount
												)
											).toFixed(2)}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="w-full leading-tight">
						<CustomTextArea
							inputLabel="Remarks"
							inputPlaceHolder="Enter a remark..."
							inputValue={details.remarks ?? "No remarks"}
							// setInputValue={setNotes}
							isReadOnly
							isDisabled
						/>
					</div>
					{details.attachments && (
						<div className="w-full mt-[-0.5rem]">
							<label className="font-semibold text-color flex">
								{JSON.parse(details.attachments).length > 1
									? "Attachments"
									: "Attachment"}
							</label>
							<div className="w-full p-2 border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md flex flex-wrap gap-2">
								{JSON.parse(details.attachments).length > 0 ? (
									JSON.parse(details.attachments).map(
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
														{isImageFile(
															receipt
														) && (
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
										<div className="py-1">
											No Attachment
										</div>
									</>
								)}
							</div>
						</div>
					)}
					{!isForReview && (
						<div className="w-full leading-tight">
							<CustomTextArea
								inputLabel="Custodian's Remarks"
								inputPlaceHolder="Enter a remark..."
								inputValue={
									details.custodian_remarks ?? "No remarks"
								}
								// setInputValue={setNotes}
								isReadOnly
								isDisabled
							/>
						</div>
					)}
				</div>
			</div>
			{isForReview && (
				<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
					<CustomButton
						buttonVariant="primary"
						buttonLabel="Confirm"
						buttonClick={handleOpenConfirm}
						// isLoading={isLoading}
						// isDisabled={isLoading}
					/>
					<CustomButton
						buttonVariant="secondary"
						buttonLabel="Deny"
						buttonClick={handleOpenDeny}
						// isDisabled={isLoading}
					/>
				</div>
			)}
		</>
	);

	return (
		<>
			<CustomModalNoScroll
				modalContent={modalContent}
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				modalSize="md"
				modalTitle="Replenished Petty Cash's Details"
				modalTitleTWStyle="leading-none px-6"
				isCloseable
			/>

			<PreviewImageModal
				isModalOpen={isPreviewOpen}
				setIsModalOpen={setIsPreviewOpen}
				imageName={imageName}
				getImage={getAttachmentImage}
			/>

			<PettyCashConfirmReplenish
				isModalOpen={isOpenConfirm}
				setIsModalOpen={setIsOpenConfirm}
				setIsModalOpenParent={setIsModalOpen}
				handleReload={handleReload}
				details={details}
			/>

			<PettyCashDenyReplenish
				isModalOpen={isOpenDeny}
				setIsModalOpen={setIsOpenDeny}
				setIsModalOpenParent={setIsModalOpen}
				handleReload={handleReload}
				details={details}
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

export default PettyCashReplenishViewModal;
