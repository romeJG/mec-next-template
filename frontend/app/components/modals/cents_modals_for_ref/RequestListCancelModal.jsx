import { useEffect, useRef, useState } from "react";
import CustomModalNoScroll from "../customs/CustomModalNoScroll";
import CustomTextArea from "../customs/CustomTextArea";
import CustomButton from "../customs/CustomButton";
import useReimbursement from "../../apis/useReimbursement";
import CustomAlertModal from "../customs/CustomAlertModal";
import useDeviceSize from "../../hooks/useDeviceSize";

function RequestListCancelModal({
	details,
	fullname,
	getAllRequest,
	isModalOpen,
	setIsModalOpen,
	role,
}) {
	const { postRequestorCancelRequest } = useReimbursement();
	const { isMobile } = useDeviceSize();
	const [note, setNote] = useState("");
	const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);
	const [isCancelLoading, setIsCancelLoading] = useState(false);
	const [isCancelSuccess, setIsCancelSuccess] = useState(false);
	const [isCancelError, setIsCancelError] = useState(false);
	const [cancelFetchMessage, setCancelFetchMessage] = useState("");
	const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);

	const handleConfirm = () => {
		setIsCancelAlertOpen(true);
	};

	const handleProceedCancelRequest = async () => {
		setIsCancelAlertOpen(false);
		await postRequestorCancelRequest(
			details.ref_number,
			fullname,
			role,
			note,
			setIsCancelLoading,
			setIsCancelSuccess,
			setIsCancelError,
			setCancelFetchMessage
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
		if (isCancelSuccess || !isModalOpen) {
			setNote("");
			setIsModalOpen(false);
		}
	}, [isCancelSuccess, isModalOpen]);

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
					inputNotes="Kindly include a note or reason for cancelling this request."
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
					isLoading={isCancelLoading}
					isDisabled={isCancelLoading || isConfirmDisabled}
				/>
				<CustomButton
					buttonVariant="bordered"
					buttonLabel="Cancel"
					buttonClick={() => setIsModalOpen(false)}
					isDisabled={isCancelLoading}
				/>
			</div>
		</>
	);
	return (
		<>
			<CustomModalNoScroll
				modalSize="md"
				modalTitle="Cancel Request"
				modalTitleTWStyle="leading-none px-6"
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				modalContent={modalContent}
				isCloseable
			/>

			<CustomAlertModal
				isModalOpen={isCancelAlertOpen}
				modalVariant="confirm"
				modalHeadline="Cancel request?"
				modalMessage="Proceeding will cancel the reimbursement request."
				modalButtonConfirm={handleProceedCancelRequest}
				modalButtonClick={() => setIsCancelAlertOpen(false)}
			/>

			<CustomAlertModal
				isModalOpen={isCancelSuccess}
				modalVariant="success"
				modalMessage={cancelFetchMessage}
				modalButtonClick={() => setIsCancelSuccess(false)}
			/>
			<CustomAlertModal
				isModalOpen={isCancelError}
				modalVariant="error"
				modalMessage={cancelFetchMessage}
				modalButtonClick={() => setIsCancelError(false)}
			/>
		</>
	);
}

export default RequestListCancelModal;
