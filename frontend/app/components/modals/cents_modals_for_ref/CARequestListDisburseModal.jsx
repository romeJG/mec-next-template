import React, { useEffect, useRef, useState } from "react";
import CustomModalNoScroll from "../../customs/CustomModalNoScroll";
import CustomTextArea from "../../customs/CustomTextArea";
import CustomFileUpload from "../../customs/CustomFileUpload";
import CapturePhotoModal from "./CapturePhotoModal";
import CapturePhotoFullScreen from "./CapturePhotoFullScreen";
import CustomButton from "../../customs/CustomButton";
import CustomAlertModal from "../../customs/CustomAlertModal";
import CustomInput from "../../customs/CustomInput";
import { format } from "date-fns";
import useDeviceSize from "../../../hooks/useDeviceSize";

function CARequestListDisburseModal({
	details,
	isModalOpen,
	setIsModalOpen,
	additionalNotes,
	setAdditionalNotes,
	files,
	setFiles,
	handleApproveRequest,
	isLoading,
}) {
	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const [isApproveRequestOpen, setIsApproveRequestOpen] = useState(false);
	const { isMobile } = useDeviceSize();

	const handleApproveRequestFn = () => {
		handleApproveRequest();
		setIsApproveRequestOpen(false);
	};

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
								: ""
						}
						isReadOnly
						isDisabled
					/>
				</div>
				<div className="w-full flex justify-center py-1">
					<div className="w-full h-[2px] min-h-[2px] rounded-full bg-[var(--color-grey)]"></div>
				</div>
				<div className="w-full leading-tight">
					<CustomFileUpload
						files={files}
						setFiles={setFiles}
						inputLabel="Attachments"
						inputNotes="Upload or capture any supporting documents or proof of disbursement. (Optional)"
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
					/>
				</div>
				<div className="w-full leading-tight">
					<CustomTextArea
						inputLabel="Notes"
						inputNotes="Input some additional notes if needed. (Optional)"
						inputPlaceHolder="Type here..."
						inputValue={additionalNotes}
						setInputValue={setAdditionalNotes}
					/>
				</div>
			</div>
			<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
				<CustomButton
					buttonVariant="primary"
					buttonLabel="Disburse"
					buttonClick={() => setIsApproveRequestOpen(true)}
					isLoading={isLoading}
					isDisabled={isLoading}
				/>
				<CustomButton
					buttonVariant="bordered"
					buttonLabel="Cancel"
					buttonClick={() => setIsModalOpen(false)}
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
				modalTitle="Disburse Cash Advance Request"
				modalTitleTWStyle="leading-none px-6"
				modalContent={modalContent}
				isCloseable
			/>

			<CapturePhotoFullScreen
				isModalOpen={isCameraOpen}
				setIsModalOpen={setIsCameraOpen}
				setFiles={setFiles}
			/>

			<CustomAlertModal
				isModalOpen={isApproveRequestOpen}
				modalVariant="confirm"
				modalHeadline="Disburse Request?"
				modalMessage="Proceeding will disburse the reimbursement request."
				modalButtonConfirm={handleApproveRequestFn}
				modalButtonClick={() => setIsApproveRequestOpen(false)}
			/>
		</>
	);
}

export default CARequestListDisburseModal;
