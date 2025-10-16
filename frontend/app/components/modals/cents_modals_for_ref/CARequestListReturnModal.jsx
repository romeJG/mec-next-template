import { useEffect, useRef, useState } from "react";
import CustomModalNoScroll from "../../customs/CustomModalNoScroll";
import CustomTextArea from "../../customs/CustomTextArea";
import CustomButton from "../../customs/CustomButton";
// import useReimbursement from "../../apis/useReimbursement";
import CustomAlertModal from "../../customs/CustomAlertModal";
import useCashAdvance from "../../apis/useCashAdvance";
import useDeviceSize from "../../../hooks/useDeviceSize";

function CARequestListReturnModal({
	details,
	fullname,
	getAllRequest,
	isModalOpen,
	setIsModalOpen,
	role,
}) {
	// const { postReturnToRequestorRequest } = useReimbursement();
	const { initialApproverReturnCARequest } = useCashAdvance();
	const { isMobile } = useDeviceSize();
	const [note, setNote] = useState("");
	const [isReturnAlertOpen, setIsReturnAlertOpen] = useState(false);
	const [isReturnLoading, setIsReturnIsLoading] = useState(false);
	const [isReturnSuccess, setIsReturnSuccess] = useState(false);
	const [isReturnError, setIsReturnError] = useState(false);
	const [returnFetchMessage, setReturnFetchMessage] = useState("");
	const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);

	const handleConfirm = () => {
		setIsReturnAlertOpen(true);
	};

	const handleProceedReturnRequest = async () => {
		setIsReturnAlertOpen(false);
		await initialApproverReturnCARequest(
			details.ref_number,
			fullname,
			note,
			role,
			setIsReturnIsLoading,
			setIsReturnSuccess,
			setIsReturnError,
			setReturnFetchMessage
		);
		getAllRequest();
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

	useEffect(() => {
		setIsConfirmDisabled(note === "");
	}, [note]);

	useEffect(() => {
		if (isReturnSuccess || !isModalOpen) {
			setNote("");
			setIsModalOpen(false);
		}
	}, [isReturnSuccess, isModalOpen]);

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
				<CustomTextArea
					inputLabel="Remarks"
					inputNotes="Kindly include a note or reason for returning this request."
					inputPlaceHolder="Enter a remark..."
					inputValue={note}
					setInputValue={setNote}
					isRequired
				/>
			</div>

			<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
				<CustomButton
					buttonVariant="primary"
					buttonLabel="Confirm"
					buttonClick={handleConfirm}
					isLoading={isReturnLoading}
					isDisabled={isReturnLoading || isConfirmDisabled}
				/>
				<CustomButton
					buttonVariant="bordered"
					buttonLabel="Cancel"
					buttonClick={() => setIsModalOpen(false)}
					isDisabled={isReturnLoading}
				/>
			</div>
		</>
	);
	return (
		<>
			<CustomModalNoScroll
				modalSize="md"
				modalTitle="Return the CA Request"
				modalTitleTWStyle="leading-none px-6"
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				modalContent={modalContent}
				isCloseable
			/>

			<CustomAlertModal
				isModalOpen={isReturnAlertOpen}
				modalVariant="confirm"
				modalHeadline="Return to requestor?"
				modalMessage="Proceeding will return the reimbursement request to the requestor."
				modalButtonConfirm={handleProceedReturnRequest}
				modalButtonClick={() => setIsReturnAlertOpen(false)}
			/>

			<CustomAlertModal
				isModalOpen={isReturnSuccess}
				modalVariant="success"
				modalMessage={returnFetchMessage}
				modalButtonClick={() => setIsReturnSuccess(false)}
			/>
			<CustomAlertModal
				isModalOpen={isReturnError}
				modalVariant="error"
				modalMessage={returnFetchMessage}
				modalButtonClick={() => setIsReturnError(false)}
			/>
		</>
	);
}

export default CARequestListReturnModal;
