import { useEffect, useRef, useState } from "react";
import CustomButton from "../customs/CustomButton";
import CustomTextArea from "../customs/CustomTextArea";
import useDeviceSize from "../../hooks/useDeviceSize";
import CustomModalNoScroll from "../customs/CustomModalNoScroll";
import useAudit from "../../apis/useAudit";
import CustomAlertModal from "../customs/CustomAlertModal";

function PettyCashConfirmReplenish({
	isModalOpen,
	setIsModalOpen,
	setIsModalOpenParent,
	handleReload,
	details,
}) {
	const { isMobile } = useDeviceSize();
	const { confirmPettyCashReplenishment } = useAudit();

	const [note, setNote] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const [fetchMessage, setFetchMessage] = useState("");

	const handleConfirm = async () => {
		await confirmPettyCashReplenishment(
			details.id,
			note,
			setIsLoading,
			setIsError,
			setIsSuccess,
			setFetchMessage
		);
	};

	useEffect(() => {
		if (isSuccess) {
			setNote("");
			setIsModalOpen(false);
			setIsModalOpenParent(false);
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
	}, [isModalOpen]);

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
				<CustomTextArea
					inputLabel="Remarks"
					inputNotes="Kindly include a note or reason for confirming this request. (Optional)"
					inputPlaceHolder="Enter a remark..."
					inputValue={note}
					setInputValue={setNote}
				/>
			</div>

			<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
				<CustomButton
					buttonVariant="primary"
					buttonLabel="Confirm"
					buttonClick={handleConfirm}
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
				modalSize="md"
				modalTitle="Confirm Request"
				modalTitleTWStyle="leading-none px-6"
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				modalContent={modalContent}
				isCloseable
			/>

			<CustomAlertModal
				isModalOpen={isSuccess}
				modalVariant="success"
				modalMessage={fetchMessage}
				modalButtonClick={() => setIsSuccess(false)}
			/>
			<CustomAlertModal
				isModalOpen={isError}
				modalVariant="error"
				modalMessage={fetchMessage}
				modalButtonClick={() => setIsError(false)}
			/>
		</>
	);
}

export default PettyCashConfirmReplenish;
