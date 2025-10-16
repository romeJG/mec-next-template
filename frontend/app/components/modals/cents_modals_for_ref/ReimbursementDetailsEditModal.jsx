// import React from 'react'

import { useEffect, useRef, useState } from "react";
import CustomModalNoScroll from "../customs/CustomModalNoScroll";
import CustomInput from "../customs/CustomInput";
import CustomButton from "../customs/CustomButton";
import useDeviceSize from "../../hooks/useDeviceSize";
import CustomCheckbox2 from "../customs/CustomCheckBox2";
import useConstants from "../../hooks/useConstants";

function ReimbursementDetailsEditModal({
	isModalOpen,
	setIsModalOpen,
	details,
	handleEdit,
	setIsError,
	setFetchMessage,
}) {
	const { isMobile } = useDeviceSize();
	const { VAT_AMOUNT } = useConstants();
	const [receiptNumber, setReceiptNumber] = useState("");
	const [reimbursementDesc, setReimbursementDesc] = useState("");
	const [reimbursementAmount, setReimbursementAmount] = useState("");
	const [grossAmount, setGrossAmount] = useState("");
	const [isWithTax, setIsWithTax] = useState(false);

	const taxCheckboxStyles = {
		label: {
			width: "0",
			marginLeft: "0rem",
			marginRight: "0rem",
		},
	};

	useEffect(() => {
		if (isModalOpen) {
			setReceiptNumber(details.receipt_number);
			setReimbursementDesc(details.reimbursement_desc);
			setReimbursementAmount(details.reimbursement_amount);
			setIsWithTax(details.with_tax === 1);
			if (details.with_tax === 1) {
				setGrossAmount(
					parseFloat(details.reimbursement_amount) * (1 + VAT_AMOUNT)
				);
			} else {
				setGrossAmount(details.reimbursement_amount);
			}
		}
	}, [isModalOpen]);

	const handleEditDetails = (e) => {
		e.preventDefault();

		if (
			receiptNumber === "" ||
			reimbursementDesc === "" ||
			reimbursementAmount === ""
		) {
			setIsError(true);
			setFetchMessage("Please fill in all fields");
			return;
		} else if (isNaN(reimbursementAmount)) {
			setIsError(true);
			setFetchMessage(
				`Please enter a numeric value in the "Amount" field.`
			);
			return;
		}

		const updatedDetails = {
			receipt_number: receiptNumber,
			reimbursement_desc: reimbursementDesc,
			reimbursement_amount: reimbursementAmount,
			gross_amount: grossAmount,
			with_tax: isWithTax ? 1 : 0,
		};

		handleEdit(details.reimbursement_type, details.index, updatedDetails);
		setIsModalOpen(false);
	};

	useEffect(() => {
		if (isWithTax) {
			setGrossAmount(
				parseFloat(
					!isNaN(parseFloat(reimbursementAmount)) &&
						reimbursementAmount !== ""
						? reimbursementAmount
						: 0
				) *
					(1 + VAT_AMOUNT)
			);
		} else {
			setGrossAmount(reimbursementAmount);
		}
	}, [isWithTax, reimbursementAmount]);

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
				ref={contentRef}
				className="w-full h-full mt-2 pl-6 pt-2 pb-4 flex flex-col gap-3 overflow-x-hidden overflow-y-auto leading-tight"
				style={{
					paddingRight:
						isContentScrollable && !isMobile ? "0.5rem" : "1.5rem",
				}}
			>
				<CustomInput
					inputType="text"
					inputLabel="Receipt No."
					inputValue={receiptNumber}
					setInputValue={setReceiptNumber}
				/>
				<CustomInput
					inputType="text"
					inputLabel="Description"
					inputValue={reimbursementDesc}
					setInputValue={setReimbursementDesc}
				/>
				<div className="w-full flex gap-2 items-end">
					<CustomInput
						inputType="text"
						inputLabel="Net Amount"
						inputValue={reimbursementAmount}
						setInputValue={setReimbursementAmount}
					/>
					<div className="min-w-[3rem] w-[3rem] flex flex-col">
						<span className="font-semibold text-color text-center">
							VAT
						</span>
						<div className="w-full h-[2.6rem] border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md grid place-content-center">
							<CustomCheckbox2
								checked={isWithTax}
								onChange={() => setIsWithTax(!isWithTax)}
								customStyles={taxCheckboxStyles}
							/>
						</div>
					</div>
				</div>
				<CustomInput
					inputType="text"
					inputLabel="Gross Amount"
					inputValue={
						grossAmount !== ""
							? "PHP " +
							  parseFloat(grossAmount).toLocaleString("en-US", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
							  })
							: "PHP 0.00"
					}
					isDisabled
					isReadOnly
				/>
			</div>
			<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
				<CustomButton
					buttonVariant="primary"
					buttonLabel="Update"
					buttonClick={handleEditDetails}
					// isLoading={isLoadingUpdate}
					// isDisabled={isLoadingUpdate}
				/>
				<CustomButton
					buttonVariant="bordered"
					buttonLabel="Cancel"
					buttonClick={(e) => {
						e.preventDefault();
						setIsModalOpen(false);
					}}
					// isDisabled={isLoadingUpdate}
				/>
			</div>
		</>
	);

	return (
		<>
			<CustomModalNoScroll
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				modalTitle="Edit Details"
				modalTitleTWStyle="leading-none px-6"
				modalSize="sm"
				modalContent={modalContent}
			/>
		</>
	);
}

export default ReimbursementDetailsEditModal;
