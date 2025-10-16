import { useEffect, useRef, useState } from "react";
import CustomModalNoScroll from "../customs/CustomModalNoScroll";
import { format } from "date-fns";
import useDeviceSize from "../../hooks/useDeviceSize";
import CustomInput from "../customs/CustomInput";
import CustomFileUpload from "../customs/CustomFileUpload";
import CapturePhotoFullScreen from "./CapturePhotoFullScreen";
import CustomTextArea from "../customs/CustomTextArea";
import CustomButton from "../customs/CustomButton";
import useCashAdvance from "../../apis/useCashAdvance";
import CustomAlertModal from "../customs/CustomAlertModal";

function SDReplenishmentModal({
	isModalOpen,
	setIsModalOpen,
	details,
	handleReload,
}) {
	const { isMobile } = useDeviceSize();
	const { replenishCARequestSD } = useCashAdvance();

	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const [files, setFiles] = useState([]);
	const [notes, setNotes] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const [fetchMessage, setFetchMessage] = useState("");

	const handleReplenishRequests = async () => {
		await replenishCARequestSD(
			details.ref_number,
			files,
			notes,
			setIsLoading,
			setIsSuccess,
			setIsError,
			setFetchMessage
		);
	};

	const handleCancel = () => {
		setFiles([]);
		setNotes("");
		setIsModalOpen(false);
	};

	useEffect(() => {
		if (isSuccess) {
			setFiles([]);
			setNotes("");
			setIsModalOpen(false);
			handleReload();
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
	}, [isContentScrollable, isModalOpen]);

	const modalContent = (
		<>
			<div
				// ref={contentRef}
				className="w-full h-full mt-2 pl-6 pt-2 pb-4 flex flex-col gap-3 overflow-x-hidden overflow-y-auto leading-tight"
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
				<div className="w-full">
					<CustomFileUpload
						files={files}
						setFiles={setFiles}
						inputLabel="Proof of Replenishment"
						inputNotes="Please upload or capture the proof of salary deduction and/or replenishment. (Optional)"
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
				<div className="w-full leading-tight">
					<CustomTextArea
						inputLabel="Notes"
						inputNotes="Input some additional notes if needed. (Optional)"
						inputPlaceHolder="Type here..."
						inputValue={notes}
						setInputValue={setNotes}
					/>
				</div>
			</div>
			<div className="w-full flex px-6 pt-2 gap-2 border-t border-[var(--color-grey)]">
				<CustomButton
					buttonLabel="Confirm"
					buttonVariant="primary"
					buttonClick={handleReplenishRequests}
					isLoading={isLoading}
					isDisabled={isLoading}
				/>
				<CustomButton
					buttonLabel="Cancel"
					buttonVariant="bordered"
					buttonClick={handleCancel}
					isDisabled={isLoading}
				/>
			</div>
		</>
	);

	return (
		<>
			<CustomModalNoScroll
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				modalSize="lg"
				modalTitle="Replenishment via Salary Deduction"
				modalTitleTWStyle="leading-none px-6"
				modalContent={modalContent}
			/>

			<CapturePhotoFullScreen
				isModalOpen={isCameraOpen}
				setIsModalOpen={setIsCameraOpen}
				setFiles={setFiles}
			/>

			<CustomAlertModal
				isModalOpen={isSuccess}
				modalButtonClick={() => setIsSuccess(false)}
				modalVariant="success"
				modalMessage={fetchMessage}
			/>
			<CustomAlertModal
				isModalOpen={isError}
				modalButtonClick={() => setIsError(false)}
				modalVariant="error"
				modalMessage={fetchMessage}
			/>
		</>
	);
}

export default SDReplenishmentModal;
