import { useEffect, useRef, useState } from "react";
import CustomInput from "../../customs/CustomInput";
import { format, isAfter } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import CustomModalNoScroll from "../../customs/CustomModalNoScroll";
import CustomButton from "../../customs/CustomButton";
import CustomAlertModal from "../../customs/CustomAlertModal";
import CustomTextArea from "../../customs/CustomTextArea";
import CustomSelect from "../../customs/CustomSelect";
import useCashAdvance from "../../apis/useCashAdvance";
import useDeviceSize from "../../../hooks/useDeviceSize";

function CARequestListUpdateDetailsModal({
	details,
	isModalOpen,
	setIsModalOpen,
	getAllRequest,
}) {
	const { updateCashAdvanceRequest } = useCashAdvance();
	const { isMobile } = useDeviceSize();
	const userInfo = JSON.parse(localStorage.getItem("user-info"));
	const today = new Date();

	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [fetchMessage, setFetchMessage] = useState("");

	// Data to be updated
	const [applicationDate, setApplicationDate] = useState(
		details.application_date
			? new Date(details.application_date)
			: new Date()
	);
	const [totalAmount, setTotalAmount] = useState(
		details.amount_requested ? details.amount_requested : "--"
	);
	const [paymentMethods, setPaymentMethods] = useState([
		{ value: 2, label: "GCash" },
		{ value: 3, label: "BDO" },
		{ value: 1, label: "Petty Cash" },
	]);
	const [paymentType, setPaymentType] = useState(paymentMethods[0]);
	const [gCashName, setGCashName] = useState("");
	const [gCashNumber, setGCashNumber] = useState("");
	const [bdoAccountName, setBdoAccountName] = useState("");
	const [bdoAccountNumber, setBdoAccountNumber] = useState("");
	const [purpose, setPurpose] = useState("");

	const isValid = () => {
		if (paymentType.value === 1) {
			return totalAmount !== "" && purpose !== "";
		}

		if (paymentType.value === 3) {
			return (
				bdoAccountName !== "" &&
				bdoAccountNumber !== "" &&
				totalAmount !== "" &&
				purpose !== ""
			);
		}

		if (paymentType.value === 2) {
			return (
				gCashName !== "" &&
				gCashNumber !== "" &&
				totalAmount !== "" &&
				purpose !== ""
			);
		}

		return false;
	};

	const handleClose = () => {
		setApplicationDate(new Date());
		setPaymentType(paymentMethods[0]);
		setGCashName("");
		setGCashNumber("");
		setBdoAccountName("");
		setBdoAccountNumber("");
		setTotalAmount("");
		setPurpose("");

		setIsModalOpen(false);
	};

	const handleGCashNameChange = (value) => {
		setGCashName(value.toUpperCase());
	};

	const handleBdoNameChange = (value) => {
		setBdoAccountName(value.toUpperCase());
	};

	const handleUpdateDetails = async () => {
		if (isAfter(applicationDate, today)) {
			setIsError(true);
			setFetchMessage("The application date cannot be later than today.");
			return;
		}

		if (!isValid()) {
			setIsError(true);
			setFetchMessage("Please do not leave any fields blank.");
			return;
		}

		await updateCashAdvanceRequest(
			userInfo.user_creds.email,
			details.ref_number,
			totalAmount,
			purpose,
			paymentType.value,
			gCashName,
			gCashNumber,
			bdoAccountName,
			bdoAccountNumber,
			format(applicationDate, "yyyy-MM-dd"),
			setIsLoading,
			setIsSuccess,
			setIsError,
			setFetchMessage
		);
	};

	useEffect(() => {
		const updatedPaymentMethods =
			totalAmount > 3000
				? [{ value: 3, label: "BDO" }]
				: [
						{ value: 2, label: "GCash" },
						{ value: 1, label: "Petty Cash" },
				  ];

		setPaymentMethods(updatedPaymentMethods);

		if (
			!updatedPaymentMethods.find(
				(method) => method.value === paymentType.value
			)
		) {
			setPaymentType(updatedPaymentMethods[0]);
		}
	}, [details, totalAmount, paymentType.value]);

	// Details Initialization
	useEffect(() => {
		if (isModalOpen) {
			setApplicationDate(
				details.application_date
					? new Date(details.application_date)
					: new Date()
			);
			setPaymentType(
				details.payment_type === 3 || details.payment_type === 2
					? paymentMethods[0]
					: paymentMethods[1]
			);
			setTotalAmount(details.amount_requested || "");
			setGCashName(details.gcash_name || "");
			setGCashNumber(details.gcash_number || "");
			setBdoAccountName(details.bdo_name || "");
			setBdoAccountNumber(details.bdo_number || "");
			setPurpose(details.ca_purpose || "");
		}
	}, [isModalOpen]);

	useEffect(() => {
		if (isSuccess) {
			setIsModalOpen(false);
			getAllRequest();
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
				className="w-full h-full mt-2 pl-6 pt-2 pb-4 flex flex-col gap-3 overflow-x-hidden overflow-y-auto"
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
						inputType="date"
						inputLabel="Application Date"
						inputValue={
							details.application_date
								? format(applicationDate, "MMMM dd, yyyy")
								: "--"
						}
						setInputValue={setApplicationDate}
						// isReadOnly
						// isDisabled
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
						inputLabel="Email"
						inputValue={details.email}
						isReadOnly
						isDisabled
					/>
				</div>
				<div className="w-full flex flex-col md:flex-row gap-3">
					<CustomInput
						inputType="text"
						inputLabel="Position"
						inputValue={details.position}
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
					<CustomSelect
						isCustomVariant
						selectLabel="Payment Type"
						selectOptions={paymentMethods}
						selectedOption={paymentType}
						setSelectedOption={setPaymentType}
					/>
					<CustomInput
						inputType="number"
						inputLabel="Amount Requested"
						inputValue={totalAmount}
						setInputValue={setTotalAmount}
						isNumberCurrency
					/>
				</div>
				<AnimatePresence mode="wait">
					{parseFloat(totalAmount) > 3000 &&
						paymentType.value === 3 && (
							<motion.div
								key="bdo"
								className="w-full flex flex-col gap-4"
								initial={{ x: "-30%", opacity: 0 }}
								animate={{
									x: 0,
									opacity: 1,
									transition: {
										type: "spring",
										damping: 30,
										stiffness: 400,
									},
								}}
								exit={{
									x: "30%",
									opacity: 0,
								}}
							>
								<div className="w-full">
									<CustomInput
										inputType="text"
										inputLabel="BDO Account Name"
										inputNotes="First Name, Middle Initial. Last Name (Example: JUAN D. CRUZ)"
										inputValue={bdoAccountName}
										setInputValue={handleBdoNameChange}
									/>
								</div>
								<div className="w-full">
									<CustomInput
										inputType="number"
										inputLabel="BDO Account Number"
										inputNotes="Registered Number with MEC"
										inputValue={bdoAccountNumber}
										setInputValue={setBdoAccountNumber}
									/>
								</div>
							</motion.div>
						)}
					{paymentType.value === 2 && totalAmount <= 3000 && (
						<motion.div
							key="gcash"
							className="w-full flex flex-col gap-4"
							initial={{ x: "-30%", opacity: 0 }}
							animate={{
								x: 0,
								opacity: 1,
								transition: {
									type: "spring",
									damping: 30,
									stiffness: 400,
								},
							}}
							exit={{
								x: "30%",
								opacity: 0,
							}}
						>
							<div className="w-full">
								<CustomInput
									inputType="text"
									inputLabel="GCash Name"
									inputNotes="First Name, Middle Initial. Last Name (Example: JUAN D. CRUZ)"
									inputValue={gCashName}
									setInputValue={handleGCashNameChange}
								/>
							</div>
							<div className="w-full">
								<CustomInput
									inputType="number"
									inputLabel="GCash Number"
									inputNotes="Registered Number with MEC"
									inputValue={gCashNumber}
									setInputValue={setGCashNumber}
								/>
							</div>
						</motion.div>
					)}
					{paymentType.value === 1 && (
						<motion.div
							ket="petty"
							className="w-full p-4 py-10 flex flex-col justify-center items-center border border-spacing-0.5
									 border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md text-center"
							initial={{ x: "-30%", opacity: 0 }}
							animate={{
								x: 0,
								opacity: 1,
								transition: {
									type: "spring",
									damping: 30,
									stiffness: 400,
								},
							}}
							exit={{
								x: "30%",
								opacity: 0,
							}}
						>
							<p>
								You have selected 'Petty Cash' as your payment
								method.
							</p>
							<p>
								Please coordinate with your respective approvers
								and adhere to petty cash guidelines.
							</p>
						</motion.div>
					)}
				</AnimatePresence>
				<div className="w-full">
					<CustomTextArea
						inputLabel="Cash Advance Purpose"
						inputNotes="A clear description of why the cash advance is needed (e.g., travel, event, procurement)."
						inputValue={purpose}
						setInputValue={setPurpose}
					/>
				</div>
			</div>
			<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
				<CustomButton
					buttonVariant="primary"
					buttonLabel="Update"
					buttonClick={handleUpdateDetails}
					isLoading={isLoading}
					isDisabled={isLoading}
				/>
				<CustomButton
					buttonVariant="bordered"
					buttonLabel="Cancel"
					buttonClick={handleClose}
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
				modalSize="md"
				modalTitle="Edit Cash Advance Request"
				modalTitleTWStyle="leading-none px-6"
				modalContent={modalContent}
			/>

			<CustomAlertModal
				modalVariant="success"
				modalMessage={fetchMessage}
				isModalOpen={isSuccess}
				modalButtonClick={() => setIsSuccess(false)}
			/>
			<CustomAlertModal
				modalVariant="error"
				modalMessage={fetchMessage}
				isModalOpen={isError}
				modalButtonClick={() => setIsError(false)}
			/>
		</>
	);
}

export default CARequestListUpdateDetailsModal;
