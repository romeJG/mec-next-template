import { Fragment, useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CustomCheckbox from "../customs/CustomCheckBox";
import CustomFileUpload from "../customs/CustomFileUpload";
import CustomInput from "../customs/CustomInput";
import CustomTextArea from "../customs/CustomTextArea";
import CapturePhotoModal from "../modals/CapturePhotoModal";
import CustomRadioButton from "../customs/CustomRadioButton";
import CapturePhotoFullScreen from "../modals/CapturePhotoFullScreen";
import CustomButton from "../customs/CustomButton";
import CustomAlertModal from "../customs/CustomAlertModal";
import ReimbursementDetailsEditModal from "../modals/ReimbursementDetailsEditModal";
import CustomCheckbox2 from "../customs/CustomCheckBox2";
import useConstants from "../../hooks/useConstants";
import ChooseRequestTypeModal from "../modals/ChooseRequestTypeModal";
import useMindee from "../../apis/useMindee";
import ReceiptIsScanningModal from "../modals/ReceiptIsScanningModal";

function ExpenseDetails({
	dropdownOptions,
	isDropdownLoading,
	reimbursementTypes,
	setReimbursementTypes,
	setReimbursementDetails,
	totalAmount,
	setTotalAmount,
	receipts,
	setReceipts,
	isSuccess,
	isPaidServices,
	setIsPaidServices,
	quickAmount,
	quickRefNumber,
	setIsOpenAutoFilled,
}) {
	const userInfo = JSON.parse(localStorage.getItem("user-info"));
	const { VAT_AMOUNT } = useConstants();
	const { uploadReceipt, getMindeeAPIkey } = useMindee();

	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const [selectedReimbursements, setSelectedReimbursements] = useState([]);

	const [receiptNumber, setReceiptNumber] = useState("");
	const [reimbursementDesc, setReimbursementDesc] = useState("");
	const [reimbursementAmount, setReimbursementAmount] = useState("");
	const [grossAmount, setGrossAmount] = useState("");
	const [reimbursementTypeDetailsMap, setReimbursementTypeDetailsMap] =
		useState({});

	const [isEditOpen, setIsEditOpen] = useState(false);
	const [detailsToEdit, setDetailsToEdit] = useState({});

	const [totalReceiptAmount, setTotalReceiptAmount] = useState({});
	const [isErrorDetails, setIsErrorDetails] = useState(false);
	const [fetchMessageDetails, setFetchMessageDetails] = useState("");

	const [isWithTax, setIsWithTax] = useState(false);
	const taxCheckboxStyles = {
		label: {
			width: "0",
			marginLeft: "0rem",
			marginRight: "0rem",
		},
	};

	// IMAGE SCANNING
	const [openAllowScan, setOpenAllowScan] = useState(false);
	const [openChooseType, setOpenChooseType] = useState(false);
	const [scanForType, setScanForType] = useState([]);
	const [isTypeSelected, setIsTypeSelected] = useState(false);
	const [isSuccessReceipts, setIsSuccessReceipts] = useState(false);
	const [isLoadingReceipts, setIsLoadingReceipts] = useState(false);
	const [isErrorReceipts, setIsErrorReceipts] = useState(false);
	const [fetchMessageReceipts, setFetchMessageReceipts] = useState("");
	const [fetchNotesReceipts, setFetchNotesReceipts] = useState("");
	const [scanResult, setScanResult] = useState([]);
	const [triggerAddValue, setTriggerAddValue] = useState(false);

	// QUICK ADD
	const [isWithQuickAmount, setIsWithQuickAmount] = useState(false);

	// MINDEE
	const [mindeeAPI, setMindeeAPI] = useState("");
	const [isLoadingMindee, setIsLoadingMindee] = useState(false);
	const [isErrorMindee, setIsErrorMindee] = useState(false);
	const [isSuccessMindee, setIsSuccessMindee] = useState(false);
	const [fetchMessageMindee, setFetchMessageMindee] = useState("");

	const handleGetMindee = async () => {
		await getMindeeAPIkey(
			setMindeeAPI,
			setIsLoadingMindee,
			setIsErrorMindee,
			setIsSuccessMindee,
			setFetchMessageMindee
		);
	};

	const handleAllowScan = (e) => {
		e.preventDefault();
		setOpenAllowScan(false);
		setOpenChooseType(true);
	};

	const options = [
		{ value: "yes", label: "Yes" },
		{ value: "no", label: "No" },
	];

	const handleCalculateGrossAmount = () => {
		let totalGross =
			parseFloat(
				!isNaN(parseFloat(reimbursementAmount)) &&
					reimbursementAmount !== ""
					? reimbursementAmount
					: 0
			) *
			(1 + VAT_AMOUNT);

		if (isWithTax) {
			setGrossAmount(totalGross);
		} else {
			setGrossAmount(reimbursementAmount);
		}
	};

	const handleRadioChange = (value) => {
		setIsPaidServices(value);
	};

	// Handle checkbox change
	const handleCheckboxChange = (type, label) => {
		setReimbursementTypes((prev) => ({
			...prev,
			[type]: !prev[type],
		}));

		setSelectedReimbursements((prev) => {
			if (prev.some((item) => item.type === type)) {
				return prev.filter((item) => item.type !== type);
			} else {
				return [...prev, { type, label, details: "", amount: "" }];
			}
		});

		setReimbursementDetails((prev) =>
			prev.filter((detail) => detail.reimbursement_type !== type)
		);

		setReimbursementTypeDetailsMap((prev) => {
			const updated = { ...prev };
			delete updated[type];
			return updated;
		});
	};

	const handleClear = (e) => {
		e.preventDefault();

		setReceiptNumber("");
		setReimbursementDesc("");
		setReimbursementAmount("");
		setGrossAmount("");
		setIsWithTax(false);
	};

	const handleClearB = () => {
		setReceiptNumber("");
		setReimbursementDesc("");
		setReimbursementAmount("");
		setGrossAmount("");
		setIsWithTax(false);
	};

	const handleAddDetails = (e, type) => {
		// e.preventDefault();
		if (e?.preventDefault) e.preventDefault();

		if (reimbursementDesc === "" || reimbursementAmount === "") {
			setIsErrorDetails(true);
			setFetchMessageDetails("Please fill in all fields");
			return;
		} else if (isNaN(reimbursementAmount)) {
			setIsErrorDetails(true);
			setFetchMessageDetails(
				`Please enter a numeric value in the "Amount" field.`
			);
			return;
		}

		const newDetails = {
			receipt_number: receiptNumber,
			reimbursement_desc: reimbursementDesc,
			reimbursement_amount: reimbursementAmount,
			with_tax: isWithTax ? 1 : 0,
			gross_amount: grossAmount,
		};

		setReimbursementTypeDetailsMap((prev) => {
			return {
				...prev,
				[type]: [...(prev[type] || []), newDetails],
			};
		});

		setReimbursementDetails((existing) => {
			const others = existing.filter(
				(item) => item.reimbursement_type !== type
			);
			return [
				...others,
				{
					reimbursement_type: type,
					details: [
						...(reimbursementTypeDetailsMap[type] || []),
						newDetails,
					],
					amount: "",
				},
			];
		});

		handleClear(e);
	};

	const handleAddDetailsB = (type) => {
		if (reimbursementDesc === "" || reimbursementAmount === "") {
			setIsErrorDetails(true);
			setFetchMessageDetails("Please fill in all fields");
			return;
		} else if (isNaN(reimbursementAmount)) {
			setIsErrorDetails(true);
			setFetchMessageDetails(
				`Please enter a numeric value in the "Amount" field.`
			);
			return;
		}

		const newDetails = {
			receipt_number: receiptNumber,
			reimbursement_desc: reimbursementDesc,
			reimbursement_amount: reimbursementAmount,
			with_tax: isWithTax ? 1 : 0,
			gross_amount: grossAmount,
		};

		setReimbursementTypeDetailsMap((prev) => {
			return {
				...prev,
				[type]: [...(prev[type] || []), newDetails],
			};
		});

		setReimbursementDetails((existing) => {
			const others = existing.filter(
				(item) => item.reimbursement_type !== type
			);
			return [
				...others,
				{
					reimbursement_type: type,
					details: [
						...(reimbursementTypeDetailsMap[type] || []),
						newDetails,
					],
					amount: "",
				},
			];
		});

		handleClearB();
	};

	const handleOpenEditReceipt = (
		e,
		index,
		type,
		receipt,
		description,
		withTax,
		amount,
		grossAmount
	) => {
		e.preventDefault();
		setDetailsToEdit({
			index: index,
			reimbursement_type: type,
			receipt_number: receipt,
			reimbursement_desc: description,
			with_tax: withTax,
			reimbursement_amount: amount,
			gross_amount: grossAmount,
		});
		setIsEditOpen(true);
	};

	const handleEditReceipt = (type, index, updatedData) => {
		setReimbursementTypeDetailsMap((prev) => {
			const detailsList = prev[type] || [];

			if (index < 0 || index >= detailsList.length) {
				console.warn(
					`Index ${index} is out of bounds for type ${type}`
				);
				return prev;
			}

			const updatedTypeList = [...detailsList];
			updatedTypeList[index] = {
				...updatedTypeList[index],
				...updatedData,
			};

			const newMap = { ...prev, [type]: updatedTypeList };

			setReimbursementDetails((existing) => {
				const others = existing.filter(
					(item) => item.reimbursement_type !== type
				);

				const total = updatedTypeList.reduce(
					(sum, entry) =>
						sum + parseFloat(entry.reimbursement_amount || 0),
					0
				);

				return [
					...others,
					{
						reimbursement_type: type,
						details: updatedTypeList,
						amount: parseFloat(total),
					},
				];
			});

			return newMap;
		});
	};

	const handleDeleteReceipt = (e, type, index) => {
		e.preventDefault();

		const currentList = reimbursementTypeDetailsMap[type] || [];

		if (index < 0 || index >= currentList.length) {
			console.warn(`Invalid index: ${index} for type ${type}`);
			return;
		}

		const filtered = currentList.filter((_, i) => i !== index);

		setReimbursementTypeDetailsMap((prev) => ({
			...prev,
			[type]: filtered,
		}));

		const total = filtered.reduce(
			(sum, item) => sum + parseFloat(item.reimbursement_amount || 0),
			0
		);

		setReimbursementDetails((existing) => {
			const others = existing.filter(
				(item) => item.reimbursement_type !== type
			);

			return [
				...others,
				{
					reimbursement_type: type,
					details: filtered,
					amount: total.toFixed(2),
				},
			];
		});

		setTotalReceiptAmount((prevTotals) => ({
			...prevTotals,
			[type]: total,
		}));
	};

	const handleScanReceipt = async () => {
		const file = receipts[receipts.length - 1];
		await uploadReceipt(
			file,
			setScanResult,
			setIsLoadingReceipts,
			setIsErrorReceipts,
			setIsSuccessReceipts,
			setFetchMessageReceipts,
			mindeeAPI
		);
	};

	const handleQuickAmount = () => {
		setReceiptNumber(`${quickRefNumber}-AP`);
		setReimbursementDesc(`Advance payment from ${quickRefNumber}`);
		setReimbursementAmount(quickAmount);
		setGrossAmount(quickAmount);
		setIsWithTax(false);

		setIsWithQuickAmount(true);
	};

	useEffect(() => {
		if (isWithQuickAmount) {
			handleAddDetailsB("representation");
			setIsOpenAutoFilled(true);
		}
	}, [isWithQuickAmount]);

	useEffect(() => {
		if (!isDropdownLoading && quickAmount !== "") {
			setTimeout(() => {
				handleCheckboxChange("representation", "Representation");
				handleQuickAmount();
			}, 200);
		}
	}, [quickAmount, isDropdownLoading]);

	useEffect(() => {
		const totals = {};

		Object.entries(reimbursementTypeDetailsMap).forEach(
			([type, detailsList]) => {
				totals[type] = detailsList.reduce(
					(sum, item) => sum + parseFloat(item.gross_amount || 0),
					0
				);
			}
		);

		setTotalReceiptAmount(totals);

		setReimbursementDetails((prev) => {
			return Object.entries(totals).map(([type, total]) => {
				const existing = prev.find(
					(item) => item.reimbursement_type === type
				);
				return {
					reimbursement_type: type,
					details: reimbursementTypeDetailsMap[type] || [],
					amount: parseFloat(total),
				};
			});
		});
	}, [reimbursementTypeDetailsMap]);

	useEffect(() => {
		handleCalculateGrossAmount();
	}, [reimbursementAmount, isWithTax]);

	useEffect(() => {
		if (isSuccess) {
			setSelectedReimbursements([]);
			setReimbursementTypeDetailsMap({});
			setTotalReceiptAmount({});
			setIsErrorDetails(false);
			setReceiptNumber("");
			setReimbursementDesc("");
			setReimbursementAmount("");
		}
	}, [isSuccess]);

	const scannedFiles = useRef(new Set());

	useEffect(() => {
		if (receipts.length > 0) {
			let shouldOpenScan = false;

			receipts.forEach((receipt) => {
				const isImage = receipt.type.startsWith("image/");
				const isNew = !scannedFiles.current.has(receipt.name);

				if (isImage && isNew) {
					scannedFiles.current.add(receipt.name);
					shouldOpenScan = true;
				}
			});

			if (shouldOpenScan) {
				setOpenAllowScan(true);
			}
		}
	}, [receipts]);

	useEffect(() => {
		if (isTypeSelected) {
			if (
				reimbursementTypes[scanForType.value] === undefined ||
				reimbursementTypes[scanForType.value] === false
			) {
				handleCheckboxChange(scanForType.value, scanForType.label);
			}
			// handleScanReceipt();
			handleGetMindee();
			setIsTypeSelected(false);
		}
	}, [isTypeSelected]);

	useEffect(() => {
		if (isSuccessMindee) {
			handleScanReceipt();
		}
	}, [isSuccessMindee]);

	useEffect(() => {
		if (isSuccessReceipts) {
			let totalAmount = scanResult.total_amount?.value || 0;
			let totalTax = scanResult.total_tax?.value || 0;

			setReceiptNumber(scanResult.receipt_number?.value || "--");
			setGrossAmount(totalAmount || 0);
			setReimbursementDesc(scanResult.category?.value || "--");
			setIsWithTax(
				scanResult.total_tax?.value !== null &&
					scanResult.total_tax?.value !== 0
					? true
					: false
			);
			setReimbursementAmount(
				scanResult.total_tax?.value !== null &&
					scanResult.total_tax?.value !== 0
					? parseFloat(totalAmount) - parseFloat(totalTax)
					: totalAmount
			);

			const interpretConfidence = (confidence) => {
				if (confidence >= 90) return "very_high";
				if (confidence >= 75) return "moderate";
				if (confidence >= 50) return "low";
				return "very_low";
			};

			const fieldLabels = {
				receipt_number: "Receipt Number",
				total_amount: "Total Amount",
				category: "Description",
				total_tax: "VAT",
			};

			const evaluateConfidences = (scanResult) => {
				const results = [];

				Object.entries(fieldLabels).forEach(([field, label]) => {
					const confidence =
						parseFloat(scanResult[field]?.confidence || 0) * 100;
					if (confidence !== undefined) {
						const level = interpretConfidence(confidence);
						results.push({ field, label, confidence, level });
					}
				});

				return results;
			};

			const confidenceEvaluations = evaluateConfidences(scanResult);

			const criticalFields = confidenceEvaluations.filter(
				(e) => e.level === "very_low"
			);
			const uncertainFields = confidenceEvaluations.filter(
				(e) => e.level === "low" || e.level === "moderate"
			);

			if (criticalFields.length > 0) {
				setFetchNotesReceipts(
					`❌ Inaccurate result: Check ${criticalFields
						.map((f) => f.label)
						.join(", ")}`
				);
			} else if (uncertainFields.length > 0) {
				setFetchNotesReceipts(
					`⚠️ Some fields may need review: ${uncertainFields
						.map((f) => f.label)
						.join(", ")}`
				);
			} else {
				setFetchNotesReceipts("✅ All receipt data looks accurate.");
			}

			setTriggerAddValue(true);
		}
	}, [isSuccessReceipts]);

	useEffect(() => {
		if (triggerAddValue) {
			handleAddDetailsB(scanForType.value);
			setTriggerAddValue(false);
		}
	}, [triggerAddValue]);

	return (
		<>
			<div className="font-semibold text-gradient-soft text-[1.25rem] mt-4 mb-[-0.5rem] flex items-center gap-2">
				<span className="leading-none text-nowrap">
					EXPENSE DETAILS
				</span>
				<div className="w-full h-[2px] min-h-[2px] bg-[var(--color-accent-medium)] rounded-sm" />
			</div>
			<div className="w-full">
				<span
					className="font-semibold text-color flex mb-1"
					style={{
						fontSize: "1rem",
					}}
				>
					Type of Reimbursement
					<span className="text-[var(--color-secondary)]">*</span>
				</span>
				<div className="w-full p-2 border rounded-md border-[var(--color-grey)] bg-[var(--color-grey-light)]">
					<div className="w-full sm:w-[25rem] grid grid-cols-1 sm:grid-cols-2">
						{isDropdownLoading ? (
							<div className="w-full h-[3rem] flex gap-1 items-center">
								<span>Loading</span>
								<div>
									<span className="fa fa-spinner fa-spin"></span>
								</div>
							</div>
						) : (
							dropdownOptions.map((dropdown, index) => (
								<Fragment key={index}>
									<CustomCheckbox2
										checked={
											reimbursementTypes[
												dropdown.value
											] || false
										}
										onChange={() =>
											handleCheckboxChange(
												dropdown.value,
												dropdown.label
											)
										}
										label={dropdown.label}
										labelPosition="right"
									/>
								</Fragment>
							))
						)}
					</div>
				</div>
			</div>

			<AnimatePresence exit>
				{selectedReimbursements.map((reimbursement, index) => (
					<motion.div
						key={index}
						className="w-full p-2 mt-1 flex flex-col bg-[var(--color-bg)] border border-[var(--color-grey)] rounded-md relative"
						initial={{ y: -30, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: -30, opacity: 0 }}
					>
						<div className="w-full flex justify-end absolute mt-[-1.5rem]">
							<span className="font-semibold text-[1.25rem] mr-6 bg-[var(--color-bg)] px-2 text-[var(--color-primary)]">
								{reimbursement.label}
							</span>
						</div>
						<div className="w-full flex flex-col">
							<label className="font-semibold text-color inline-block">
								Reimbursement Details
								<span className="text-[var(--color-secondary)]">
									*
								</span>
							</label>

							<div className="w-full flex justify-start text-[0.85rem] text-[var(--color-grey-dark)] italic mb-1">
								<ul className="list-disc ml-4 flex flex-col leading-tight">
									<li>
										Specify the transaction or expense
										(Example: Representation: Meeting with
										CLIENT-SMSGT)
									</li>
									<li>
										Enumerate the details if you have
										multiple expense (Example: 1. MEC to
										Huawei, 2. Huawei to Lantro, 3. Lantro
										to MEC)
									</li>
								</ul>
							</div>

							<div className="w-full flex flex-col gap-2 mb-2 overflow-y-auto pb-1">
								<div className="w-full flex gap-2 leading-tight mb-[-0.5rem] font-semibold justify-between relative">
									<div className="min-w-[3rem] w-[3rem]"></div>
									<div className="min-w-[15rem] w-[15rem]">
										Receipt No.
									</div>
									<div className="min-w-[18rem] w-full">
										Description
									</div>
									<div className="min-w-[10rem] w-[10rem]">
										Net Amount
									</div>
									<div className="min-w-[3rem] w-[3rem] text-center">
										VAT
									</div>
									<div className="min-w-[10rem] w-[10rem] mr-[calc(-0.5rem+1px)]">
										Gross Amount
									</div>
									<div className="min-w-[7rem] w-[7rem] sticky right-0 bg-[var(--color-bg)] pl-2 text-center">
										Actions
									</div>
								</div>
								{(
									reimbursementTypeDetailsMap[
										reimbursement.type
									] || []
								).map((details, index) => (
									<div
										key={index}
										className="w-full flex gap-2 leading-none justify-between relative"
									>
										<div className="min-w-[3rem] w-[3rem] border border-[var(--color-grey)] rounded-md bg-[var(--color-grey-light)] grid place-content-center">
											{index > 9
												? index + 1
												: "0" + (index + 1)}
										</div>
										<div className="min-w-[15rem] w-[15rem]">
											<CustomInput
												inputType="text"
												inputValue={
													details.receipt_number
												}
												inputPlaceHolder="Enter Receipt No."
												isDisabled
												isReadOnly
											/>
										</div>
										<div className="min-w-[18rem] w-full">
											<CustomInput
												inputType="text"
												inputValue={
													details.reimbursement_desc
												}
												inputPlaceHolder="Enter Description"
												isDisabled
												isReadOnly
											/>
										</div>
										<div className="min-w-[10rem] w-[10rem]">
											<CustomInput
												inputType="text"
												inputValue={
													details.reimbursement_amount
														? "PHP " +
														  parseFloat(
																details.reimbursement_amount
														  ).toLocaleString(
																"en-US",
																{
																	minimumFractionDigits: 2,
																	maximumFractionDigits: 2,
																}
														  )
														: "PHP 0.00"
												}
												inputPlaceHolder="Enter Amount"
												isDisabled
												isReadOnly
											/>
										</div>
										<div className="min-w-[3rem] w-[3rem]">
											<div className="w-full h-full border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md grid place-content-center">
												<CustomCheckbox2
													checked={
														details.with_tax === 1
													}
													disabled
													customStyles={
														taxCheckboxStyles
													}
												/>
											</div>
										</div>
										<div className="min-w-[10rem] w-[10rem] mr-[calc(-0.5rem+1px)]">
											<CustomInput
												inputType="text"
												inputValue={
													details.gross_amount
														? "PHP " +
														  parseFloat(
																details.gross_amount
														  ).toLocaleString(
																"en-US",
																{
																	minimumFractionDigits: 2,
																	maximumFractionDigits: 2,
																}
														  )
														: "PHP 0.00"
												}
												inputPlaceHolder="Enter Amount"
												isDisabled
												isReadOnly
											/>
										</div>
										<div className="min-w-[7rem] w-[7rem] sticky right-0 bg-[var(--color-bg)] pl-2 flex gap-2">
											<CustomButton
												buttonVariant="solid"
												buttonLabel={
													<div className="h-full items-center justify-center text-white text-[0.85rem] leading-none">
														<span className="fa-solid fa-trash"></span>
													</div>
												}
												buttonClick={(e) =>
													handleDeleteReceipt(
														e,
														reimbursement.type,
														index
													)
												}
												buttonSolidColor="var(--color-secondary)"
												buttonHeight="2.6rem"
												isDarkendOnHover
												isScaledOnHover={false}
											/>
											<CustomButton
												buttonVariant="solid"
												buttonLabel={
													<div className="h-full items-center justify-center text-white text-[0.85rem] leading-none">
														<span className="fa-solid fa-pen"></span>
													</div>
												}
												buttonClick={(e) =>
													handleOpenEditReceipt(
														e,
														index,
														reimbursement.type,
														details.receipt_number,
														details.reimbursement_desc,
														details.with_tax,
														details.reimbursement_amount,
														details.gross_amount
													)
												}
												buttonSolidColor="var(--color-yellow)"
												buttonHeight="2.6rem"
												isDarkendOnHover
												isScaledOnHover={false}
											/>
										</div>
									</div>
								))}

								<div className="w-full flex gap-2 leading-none justify-between relative">
									<div className="min-w-[3rem] w-[3rem] border border-[var(--color-grey)] rounded-md bg-[var(--color-grey-light)] grid place-content-center">
										--
									</div>
									<div className="min-w-[15rem] w-[15rem]">
										<CustomInput
											inputType="text"
											inputValue={receiptNumber}
											setInputValue={setReceiptNumber}
											inputPlaceHolder="Enter Receipt No."
										/>
									</div>
									<div className="min-w-[18rem] w-full">
										<CustomInput
											inputType="text"
											inputValue={reimbursementDesc}
											setInputValue={setReimbursementDesc}
											inputPlaceHolder="Enter Description"
										/>
									</div>

									<div className="min-w-[10rem] w-[10rem]">
										<CustomInput
											inputType="text"
											inputValue={reimbursementAmount}
											setInputValue={
												setReimbursementAmount
											}
											inputPlaceHolder="Enter Amount"
										/>
									</div>
									<div className="min-w-[3rem] w-[3rem]">
										<div className="w-full h-full border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md grid place-content-center">
											<CustomCheckbox2
												checked={isWithTax}
												onChange={() =>
													setIsWithTax(!isWithTax)
												}
												customStyles={taxCheckboxStyles}
											/>
										</div>
									</div>
									<div className="min-w-[10rem] w-[10rem] mr-[calc(-0.5rem+1px)]">
										<CustomInput
											inputType="text"
											inputValue={
												!isNaN(
													parseFloat(grossAmount)
												) && grossAmount !== ""
													? "PHP " +
													  parseFloat(
															grossAmount
													  ).toLocaleString(
															"en-US",
															{
																minimumFractionDigits: 2,
																maximumFractionDigits: 2,
															}
													  )
													: "PHP 0.00"
											}
											inputPlaceHolder="Enter Amount"
											isDisabled
											isLoading
										/>
									</div>
									<div className="min-w-[7rem] w-[7rem] sticky right-0 bg-[var(--color-bg)] pl-2 flex gap-2">
										<CustomButton
											buttonVariant="solid"
											buttonLabel={
												<div className="h-full items-center justify-center text-white leading-none">
													<span className="fa-solid fa-check"></span>
												</div>
											}
											buttonClick={(e) => {
												handleAddDetails(
													e,
													reimbursement.type
												);
											}}
											buttonSolidColor="var(--color-tertiary)"
											buttonHeight="2.6rem"
											isDarkendOnHover
											isScaledOnHover={false}
										/>
										<CustomButton
											buttonVariant="solid"
											buttonLabel={
												<div className="h-full items-center justify-center text-white text-[0.85rem] leading-none">
													<span className="fa-solid fa-arrow-rotate-left"></span>
												</div>
											}
											buttonClick={handleClear}
											buttonSolidColor="var(--color-primary)"
											buttonHeight="2.6rem"
											isDarkendOnHover
											isScaledOnHover={false}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="w-full flex justify-end">
							<div className="flex gap-2 items-center">
								<span className="font-semibold flex text-nowrap">
									Total Amount:
								</span>
								<CustomInput
									inputType="text"
									inputPlaceHolder="Enter Amount"
									inputValue={
										"PHP " +
										(
											totalReceiptAmount[
												reimbursement.type
											] || 0
										).toLocaleString("en-US", {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										})
									}
									isDisabled
									isReadOnly
								/>
							</div>
						</div>
					</motion.div>
				))}
			</AnimatePresence>

			<div className="w-full">
				<CustomInput
					inputType="text"
					inputLabel="Total Amount of Expense"
					inputPlaceHolder="Automatically Computed"
					inputNotes="Automatically Computed"
					inputValue={
						totalAmount
							? "PHP " +
							  parseFloat(totalAmount).toLocaleString("en-US", {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
							  })
							: "PHP 0.00"
					}
					setInputValue={setTotalAmount}
					// isRequired
					isReadOnly
				/>
			</div>
			<div className="w-full">
				<CustomFileUpload
					files={receipts}
					setFiles={setReceipts}
					inputLabel="Upload Receipts and/or Summary of Expense"
					inputNotes="Suggested to Upload all receipts in PDF File. Summary of Expense in Excel File"
					acceptedFileTypes={[
						"image/jpeg",
						"image/png",
						"image/gif",
						"text/csv",
						"application/pdf",
						"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
					]}
					setIsCameraOpen={setIsCameraOpen}
					isRequired
					isWithImageCapture
					isMultiple={false}
				/>
			</div>

			{userInfo.user_creds.department.includes(
				"Technical Planning & Operations"
			) && (
				<div className="w-full flex flex-col">
					<label className="font-semibold inline-block">
						Is the Reimbursement a Paid Service/s?
						<span className="text-[var(--color-secondary)]">*</span>
					</label>
					<div className="w-full min-h-[2.75rem] p-2 border border-[var(--color-grey)] rounded-md bg-[var(--color-grey-light)] flex items-center">
						<CustomRadioButton
							name="paid_services"
							options={options}
							selectedValue={isPaidServices}
							onChange={handleRadioChange}
						/>
					</div>
				</div>
			)}

			<CapturePhotoFullScreen
				isModalOpen={isCameraOpen}
				setIsModalOpen={setIsCameraOpen}
				setFiles={setReceipts}
			/>

			<ReimbursementDetailsEditModal
				isModalOpen={isEditOpen}
				setIsModalOpen={setIsEditOpen}
				details={detailsToEdit}
				handleEdit={handleEditReceipt}
				setIsError={setIsErrorDetails}
				setFetchMessage={setFetchMessageDetails}
			/>

			<CustomAlertModal
				modalVariant="error"
				modalMessage={fetchMessageDetails}
				isModalOpen={isErrorDetails}
				modalButtonClick={(e) => {
					e.preventDefault();
					setIsErrorDetails(false);
				}}
			/>

			<CustomAlertModal
				modalVariant="confirm"
				modalHeadline={"Would you like to scan the receipt?"}
				modalMessage={
					"Proceeding will scan the receipt you provided and will automatically fill the reimbursement details for you."
				}
				isModalOpen={openAllowScan}
				modalButtonClick={(e) => {
					e.preventDefault();
					setOpenAllowScan(false);
				}}
				modalButtonConfirm={handleAllowScan}
			/>

			<ChooseRequestTypeModal
				isModalOpen={openChooseType}
				setIsModalOpen={setOpenChooseType}
				typeOptions={dropdownOptions}
				scanForType={scanForType}
				setScanForType={setScanForType}
				setIsTypeSelected={setIsTypeSelected}
			/>

			<ReceiptIsScanningModal
				isModalOpen={isLoadingReceipts || isLoadingMindee}
				setIsModalOpen={setIsLoadingReceipts}
			/>
			<CustomAlertModal
				modalVariant="error"
				modalMessage={fetchMessageMindee}
				isModalOpen={isErrorMindee}
				modalButtonClick={() => setIsErrorMindee(false)}
			/>

			<CustomAlertModal
				modalVariant="error"
				modalMessage={fetchMessageReceipts}
				isModalOpen={isErrorReceipts}
				modalButtonClick={(e) => {
					e.preventDefault();
					setIsErrorReceipts(false);
				}}
			/>
			<CustomAlertModal
				modalVariant="success"
				modalMessage={
					<div className="w-full flex flex-col">
						<p className="w-full leading-none">
							{fetchMessageReceipts}
						</p>
						{fetchNotesReceipts !== "" && (
							<p className="w-full leading-none mt-3">
								Notes: {fetchNotesReceipts}
							</p>
						)}
					</div>
				}
				isModalOpen={isSuccessReceipts}
				modalButtonClick={(e) => {
					e.preventDefault();
					setIsSuccessReceipts(false);
				}}
			/>
		</>
	);
}

export default ExpenseDetails;
