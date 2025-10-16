// import React from 'react'

import { useEffect, useRef, useState } from "react";
import CustomModalNoScroll from "../../customs/CustomModalNoScroll";
import CustomInput from "../../customs/CustomInput";
import CustomButton from "../../customs/CustomButton";
import useDropdown from "../../apis/useDropdown";
import CustomAlertModal from "../../customs/CustomAlertModal";
import useDeviceSize from "../../../hooks/useDeviceSize";

function DropdownUpdateModal({
	isModalOpen,
	setIsModalOpen,
	currentValue,
	currentLabel,
	handleGetDropdowns,
}) {
	const { editDropdownItem } = useDropdown();
	const { isMobile } = useDeviceSize();

	const [newValue, setNewValue] = useState(currentLabel);

	const [isEditLoading, setIsEditLoading] = useState(false);
	const [isEditSuccess, setIsEditSuccess] = useState(false);
	const [isEditError, setIsEditError] = useState(false);
	const [fetchMessage, setFetchMessage] = useState("");

	const handleEditItem = async (e) => {
		e.preventDefault();

		if (newValue === "") {
			setIsEditError(true);
			setFetchMessage("Please do not leave any fields blank.");
			return;
		}

		await editDropdownItem(
			"reimbursement_type",
			currentValue,
			newValue,
			setIsEditLoading,
			setIsEditSuccess,
			setIsEditError,
			setFetchMessage
		);
	};

	useEffect(() => {
		if (isEditSuccess) {
			setIsModalOpen(false);
			handleGetDropdowns();
		}
	}, [isEditSuccess]);

	useEffect(() => {
		setNewValue(currentLabel);
		if (!isModalOpen) {
			setNewValue("");
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
					inputValue={newValue}
					setInputValue={setNewValue}
					isRequired
					isNoRequiredIndicator
				/>
			</div>

			<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
				<CustomButton
					buttonVariant="primary"
					buttonLabel="Update"
					buttonClick={handleEditItem}
					isLoading={isEditLoading}
					isDisabled={isEditLoading}
				/>
				<CustomButton
					buttonVariant="bordered"
					buttonLabel="Cancel"
					buttonClick={(e) => {
						e.preventDefault();
						setIsModalOpen(false);
					}}
					isDisabled={isEditLoading}
				/>
			</div>
		</form>
	);
	return (
		<>
			<CustomModalNoScroll
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				modalTitle="Edit Dropdown Item"
				modalContent={modalContent}
				modalSize="sm"
				isCloseable
			/>

			<CustomAlertModal
				isModalOpen={isEditSuccess}
				modalVariant="success"
				modalMessage={fetchMessage}
				modalButtonClick={() => setIsEditSuccess(false)}
			/>
			<CustomAlertModal
				isModalOpen={isEditError}
				modalVariant="error"
				modalMessage={fetchMessage}
				modalButtonClick={() => setIsEditError(false)}
			/>
		</>
	);
}

export default DropdownUpdateModal;
