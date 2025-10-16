import { useEffect, useRef, useState } from "react";
import CustomModalNoScroll from "../customs/CustomModalNoScroll";
import useDeviceSize from "../../hooks/useDeviceSize";
import CustomInput from "../customs/CustomInput";
import { format } from "date-fns";
import CustomButton from "../customs/CustomButton";
import CustomTextArea from "../customs/CustomTextArea";
import CustomFileUpload from "../customs/CustomFileUpload";
import CapturePhotoFullScreen from "./CapturePhotoFullScreen";
import useCashAdvance from "../../apis/useCashAdvance";
import CustomAlertModal from "../customs/CustomAlertModal";

function SDReviewModal({ isModalOpen, setIsModalOpen, details, handleReload }) {
	const { isMobile } = useDeviceSize();
	const { approveCARequestSD, rejectCARequestSD } = useCashAdvance();

	// APPROVE SD
	const [isOpenApprove, setIsOpenApprove] = useState(false);
	const [approveNotes, setApproveNotes] = useState("");
	const [files, setFiles] = useState([]);
	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const [isLoadingApprove, setIsLoadingApprove] = useState(false);
	const [isSuccessApprove, setIsSuccessApprove] = useState(false);
	const [isErrorApprove, setIsErrorApprove] = useState(false);
	const [fetchMessage, setFetchMessage] = useState("");

	// REJECT SD
	const [isOpenReject, setIsOpenReject] = useState(false);
	const [rejectNotes, setRejectNotes] = useState("");
	const [isLoadingReject, setIsLoadingReject] = useState(false);
	const [isSuccessReject, setIsSuccessReject] = useState(false);
	const [isErrorReject, setIsErrorReject] = useState(false);

	const handleApproveSD = async () => {
		if (files.length <= 0) {
			setIsErrorApprove(true);
			setFetchMessage(
				"Please include at least one proof of salary deduction."
			);
			return;
		}

		await approveCARequestSD(
			details.ref_number,
			files,
			approveNotes,
			setIsLoadingApprove,
			setIsSuccessApprove,
			setIsErrorApprove,
			setFetchMessage
		);
	};

	const handleRejectSD = async () => {
		if (rejectNotes === "") {
			setIsErrorReject(true);
			setFetchMessage("Please provide a reason for rejection.");
		}

		await rejectCARequestSD(
			details.ref_number,
			rejectNotes,
			setIsLoadingReject,
			setIsSuccessReject,
			setIsErrorReject,
			setFetchMessage
		);
	};

	const handleClose = () => {
		setIsModalOpen(false);
	};

	const handleCancelApprove = () => {
		setFiles([]);
		setApproveNotes("");
		setIsOpenApprove(false);
	};

	const handleCancelReject = () => {
		setRejectNotes("");
		setIsOpenReject(false);
	};

	useEffect(() => {
		if (isSuccessApprove) {
			setFiles([]);
			setApproveNotes("");
			setIsOpenApprove(false);
			setIsModalOpen(false);
			handleReload();
		}
	}, [isSuccessApprove]);

	useEffect(() => {
		if (isSuccessReject) {
			setRejectNotes("");
			setIsOpenReject(false);
			setIsModalOpen(false);
			handleReload();
		}
	}, [isSuccessReject]);

	const contentRef = useRef(null);
	const [isContentScrollable, setIsContentScrollable] = useState(true);
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

	return (
		<>
			<CustomModalNoScroll
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				modalSize="md"
				modalTitle="Review Salary Deduction Approval"
				closingFunction={handleClose}
				isCloseable
				modalContent={
					<>
						<div
							ref={contentRef}
							className="w-full h-full mt-2 pl-6 pt-2 pb-4 flex flex-col gap-3 overflow-x-hidden overflow-y-auto leading-tight"
							style={{
								paddingRight:
									isContentScrollable && !isMobile
										? "0.5rem"
										: "1.5rem",
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
											  parseFloat(
													details.amount_requested
											  ).toFixed(2)
											: "--"
									}
									isReadOnly
									isDisabled
								/>
							</div>
							<div className="w-full flex flex-col md:flex-row gap-3">
								<CustomInput
									inputType="text"
									inputLabel="Reimbursement Processor"
									inputValue={details.custodian_name}
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
						</div>
						<div className="w-full flex px-6 pt-2 gap-2 border-t border-[var(--color-grey)]">
							<CustomButton
								buttonLabel="APPROVE"
								buttonVariant="primary"
								buttonClick={() => setIsOpenApprove(true)}
								// isLoading={isLoadingReplenish}
								// isDisabled={isLoadingReplenish}
							/>
							<CustomButton
								buttonLabel="REJECT"
								buttonVariant="secondary"
								buttonClick={() => setIsOpenReject(true)}
								// isDisabled={isLoadingReplenish}
							/>
						</div>
					</>
				}
			/>

			{/* APPROVE SALARY DEDUCTION */}
			<CustomModalNoScroll
				isModalOpen={isOpenApprove}
				setIsModalOpen={setIsOpenApprove}
				modalSize="md"
				modalTitle="Approve Salary Deduction"
				modalContent={
					<>
						<div
							ref={contentRef}
							className="w-full h-full mt-2 pl-6 pt-2 pb-4 flex flex-col gap-3 overflow-x-hidden overflow-y-auto leading-tight"
							style={{
								paddingRight:
									isContentScrollable && !isMobile
										? "0.5rem"
										: "1.5rem",
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
									inputLabel="Amount to be Deducted"
									inputValue={
										details.amount_requested
											? "PHP " +
											  parseFloat(
													details.amount_requested
											  ).toFixed(2)
											: "--"
									}
									isReadOnly
									isDisabled
								/>
							</div>
							<div className="w-full">
								<CustomFileUpload
									files={files}
									setFiles={setFiles}
									inputLabel="Proof of Salary Deduction"
									inputNotes="Please upload or capture the proof of salary deduction."
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
									isRequired
								/>
							</div>
							<div className="w-full leading-tight">
								<CustomTextArea
									inputLabel="Remarks"
									inputNotes="Enter some additional notes if needed. Optional"
									inputPlaceHolder="Enter a remark..."
									inputValue={approveNotes}
									setInputValue={setApproveNotes}
								/>
							</div>
						</div>
						<div className="w-full flex px-6 pt-2 gap-2 border-t border-[var(--color-grey)]">
							<CustomButton
								buttonLabel="Confirm"
								buttonVariant="primary"
								buttonClick={handleApproveSD}
								isLoading={isLoadingApprove}
								isDisabled={isLoadingApprove}
							/>
							<CustomButton
								buttonLabel="Cancel"
								buttonVariant="bordered"
								buttonClick={handleCancelApprove}
								isDisabled={isLoadingApprove}
							/>
						</div>
					</>
				}
			/>

			{/* REJECT SALARY DEDUCTION */}
			<CustomModalNoScroll
				isModalOpen={isOpenReject}
				setIsModalOpen={setIsOpenReject}
				modalSize="md"
				modalTitle="Reject Salary Deduction"
				isCloseable
				modalContent={
					<>
						<div
							ref={contentRef}
							className="w-full h-full mt-2 pl-6 pt-2 pb-4 flex flex-col gap-3 overflow-x-hidden overflow-y-auto leading-tight"
							style={{
								paddingRight:
									isContentScrollable && !isMobile
										? "0.5rem"
										: "1.5rem",
							}}
						>
							<div className="w-full leading-tight">
								<CustomTextArea
									inputLabel="Remarks"
									inputNotes="Enter some remarks or reason for rejection."
									inputPlaceHolder="Enter a remark..."
									inputValue={rejectNotes}
									setInputValue={setRejectNotes}
									isRequired
								/>
							</div>
						</div>
						<div className="w-full flex px-6 pt-2 gap-2 border-t border-[var(--color-grey)]">
							<CustomButton
								buttonLabel="Confirm"
								buttonVariant="primary"
								buttonClick={handleRejectSD}
								isLoading={isLoadingReject}
								isDisabled={isLoadingReject}
							/>
							<CustomButton
								buttonLabel="Cancel"
								buttonVariant="bordered"
								buttonClick={handleCancelReject}
								isDisabled={isLoadingReject}
							/>
						</div>
					</>
				}
			/>

			<CapturePhotoFullScreen
				isModalOpen={isCameraOpen}
				setIsModalOpen={setIsCameraOpen}
				setFiles={setFiles}
			/>

			<CustomAlertModal
				isModalOpen={isSuccessApprove}
				modalButtonClick={() => setIsSuccessApprove(false)}
				modalVariant="success"
				modalMessage={fetchMessage}
			/>
			<CustomAlertModal
				isModalOpen={isErrorApprove}
				modalButtonClick={() => setIsErrorApprove(false)}
				modalVariant="error"
				modalMessage={fetchMessage}
			/>

			<CustomAlertModal
				isModalOpen={isSuccessReject}
				modalButtonClick={() => setIsSuccessReject(false)}
				modalVariant="success"
				modalMessage={fetchMessage}
			/>
			<CustomAlertModal
				isModalOpen={isErrorReject}
				modalButtonClick={() => setIsErrorReject(false)}
				modalVariant="error"
				modalMessage={fetchMessage}
			/>
		</>
	);
}

export default SDReviewModal;
