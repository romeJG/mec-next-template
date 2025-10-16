import { useEffect, useRef, useState } from "react";
import CustomModalNoScroll from "../../customs/CustomModalNoScroll";
import CustomInput from "../../customs/CustomInput";
import CustomButton from "../../customs/CustomButton";
import useDropdown from "../../apis/useDropdown";
import CustomAlertModal from "../../customs/CustomAlertModal";
import useDeviceSize from "../../../hooks/useDeviceSize";

function DropdownAddModal({ isModalOpen, setIsModalOpen, handleGetDropdowns }) {
	const { addDropdownItem } = useDropdown();
	const { isMobile } = useDeviceSize();

	const [dropdownValue, setDropdownValue] = useState("");

	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const [fetchMessage, setFetchMessage] = useState("");

	const handleAddItem = async (e) => {
		e.preventDefault();
		await addDropdownItem(
			"reimbursement_type",
			dropdownValue,
			setIsLoading,
			setIsSuccess,
			setIsError,
			setFetchMessage
		);
	};

	useEffect(() => {
		if (isSuccess) {
			setIsModalOpen(false);
			handleGetDropdowns();
		}
	}, [isSuccess]);

	useEffect(() => {
		if (!isModalOpen) {
			setDropdownValue("");
		}
	}, [isModalOpen]);

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
		<form>
			<div
				ref={contentRef}
				className="w-full h-full mt-2 pl-6 pt-2 pb-4 flex flex-col gap-3 overflow-x-hidden overflow-y-auto"
				style={{
					paddingRight:
						isContentScrollable && !isMobile ? "0.5rem" : "1.5rem",
				}}
			>
				<CustomInput
					inputType="text"
					inputLabel="Dropdown Item"
					inputNotes={
						<>
							<div className="flex gap-1">
								<span className="fa fa-circle-exclamation text-[0.8rem]"></span>
								<span className="leading-none">
									Please ensure the value entered is in the
									correct format, as it will be displayed to
									the user.
								</span>
							</div>
						</>
					}
					inputValue={dropdownValue}
					setInputValue={setDropdownValue}
					isRequired
					isNoRequiredIndicator
				/>
			</div>

			<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
				<CustomButton
					buttonVariant="primary"
					buttonLabel="Add"
					buttonClick={handleAddItem}
					isLoading={isLoading}
					isDisabled={isLoading}
				/>
				<CustomButton
					buttonVariant="bordered"
					buttonLabel="Cancel"
					buttonClick={(e) => {
						e.preventDefault();
						setIsModalOpen(false);
					}}
					isDisabled={isLoading}
				/>
			</div>
		</form>
	);
	return (
		<>
			<CustomModalNoScroll
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				modalTitle="Add a Dropdown Item"
				modalTitleTWStyle="leading-none px-6"
				modalContent={modalContent}
				modalSize="sm"
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

export default DropdownAddModal;
