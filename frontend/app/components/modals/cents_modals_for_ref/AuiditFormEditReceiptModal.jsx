// import React from 'react'

import { useEffect, useRef, useState } from "react";
import CustomInput from "../../customs/CustomInput";
import CustomModalNoScroll from "../../customs/CustomModalNoScroll";
import { format, set } from "date-fns";
import CustomTextArea from "../../customs/CustomTextArea";
import CustomFileUpload from "../../customs/CustomFileUpload";
import CustomButton from "../../customs/CustomButton";
import CapturePhotoFullScreen from "./CapturePhotoFullScreen";
import capitalizeEveryWord from "../../../utils/capitalizeEveryWord";
import useDropdown from "../../apis/useDropdown";
import useReimbursement from "../../apis/useReimbursement";
import CustomAlertModal from "../../customs/CustomAlertModal";
import useAudit from "../../apis/useAudit";
import useDeviceSize from "../../../hooks/useDeviceSize";
import useConstants from "../../../hooks/useConstants";
import useMindee from "../../apis/useMindee";
import CustomCheckbox2 from "../../customs/CustomCheckBox2";
import ChooseRequestTypeModal from "./ChooseRequestTypeModal";
import ReceiptIsScanningModal from "../ReceiptIsScanningModal";

function AuiditFormEditReceiptModal({
	isModalOpen,
	setIsModalOpen,
	receipt_details,
	fetchReceipts,
	audit_id = "",
}) {
	const { getDropdownOptions } = useDropdown();
	const { getDownloadReceipts } = useReimbursement();
	const { postUpdateRequestReceipt } = useAudit();
	const { isMobile } = useDeviceSize();
	const { VAT_AMOUNT } = useConstants();
	const { uploadReceipt, getMindeeAPIkey } = useMindee();

	const user = JSON.parse(localStorage.getItem("user-info")) ?? {};

	const [receipts, setReceipts] = useState([]);
	const [newReceipts, setNewReceipts] = useState([]);
	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const [amount, setAmount] = useState(0);
	const [pcv, setPcv] = useState("");
	const [typeOfReimbursement, setTypeOfReimbursement] = useState([]);
	const [reimbursementDetails, setReimbursementDetails] = useState("");

	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [fetchMessage, setFetchMessage] = useState("");
	const [dropdownOptions, setDropdownOptions] = useState([]);
	const [isDropdownLoading, setIsDropdownLoading] = useState(false);

	const [isNoReimbursement, setIsNoReimbursement] = useState(false);
	const [isNoReceipts, setIsNoReceipts] = useState(false);
	const [receiptName, setReceiptName] = useState("");
	const [isDeleteReceiptOpen, setIsDeleteReceiptOpen] = useState(false);
	const [receiptsToBeDeleted, setReceiptsToBeDeleted] = useState([]);

	const [isUpdateAlertOpen, setIsUpdateAlertOpen] = useState(false);
	const [isUpdateLoading, setIsUpdateLoading] = useState(false);
	const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
	const [isUpdateError, setIsUpdateError] = useState(false);
	const [fetchMessageUpdate, setFetchMessageUpdate] = useState("");

	// REIMBURSEMENT DETAILS
	const [receiptNumber, setReceiptNumber] = useState("");
	const [reimbursementDesc, setReimbursementDesc] = useState("");
	const [reimbursementAmount, setReimbursementAmount] = useState("");
	const [grossAmount, setGrossAmount] = useState("");
	const [reimbursementTypeDetailsMap, setReimbursementTypeDetailsMap] =
		useState({});

	const [totalReceiptAmount, setTotalReceiptAmount] = useState({});
	const [isErrorDetails, setIsErrorDetails] = useState(false);
	const [fetchMessageDetails, setFetchMessageDetails] = useState("");
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [detailsToEdit, setDetailsToEdit] = useState({});

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

	const handleClose = () => {
		setReceipts([]);
		setNewReceipts([]);
		setTypeOfReimbursement([]);
		setReimbursementDetails([]);
		setReceiptsToBeDeleted([]);
		setAmount(0);
		setPcv("");
		setIsCameraOpen(false);
		setIsModalOpen(false);
	};

	const handleUpdateConfirm = (e) => {
		e.preventDefault();

		if (receipts.length <= 0) {
			if (newReceipts.length <= 0) {
				setIsNoReceipts(true);
				return;
			}
		}

		setIsUpdateAlertOpen(true);
	};

	const handleUpdateReceipt = async () => {
		setIsUpdateAlertOpen(false);
		await postUpdateRequestReceipt(
			audit_id,
			user.user_creds.email,
			receipt_details.ref_number,
			typeOfReimbursement,
			reimbursementDetails,
			pcv,
			amount,
			newReceipts,
			receiptsToBeDeleted,
			setIsUpdateLoading,
			setIsUpdateSuccess,
			setIsUpdateError,
			setFetchMessageUpdate
		);
	};

	const handleInputChange = (type, field, value) => {
		setTypeOfReimbursement((prev) =>
			prev.map((item) =>
				item.type === type ? { ...item, [field]: value } : item
			)
		);

		setReimbursementDetails((prev) => {
			const existing = prev.find(
				(detail) => detail.reimbursement_type === type
			);
			if (existing) {
				return prev.map((detail) =>
					detail.reimbursement_type === type
						? { ...detail, [field]: value }
						: detail
				);
			} else {
				return [
					...prev,
					{
						reimbursement_type: type,
						details: field === "details" ? value : "",
						amount: field === "amount" ? value : "",
					},
				];
			}
		});
	};

	const handleToggle = (type, label, fromScan = false) => {
		setTypeOfReimbursement((prev) => {
			const exists = prev.some((item) => item.type === type);

			if (exists) {
				if (fromScan) return prev;

				if (prev.length === 1) {
					setIsNoReimbursement(true);
					return prev;
				}

				const updated = prev.filter((item) => item.type !== type);

				setReimbursementDetails((details) =>
					details.filter(
						(detail) => detail.reimbursement_type !== type
					)
				);

				setReimbursementTypeDetailsMap((map) => {
					const newMap = { ...map };
					delete newMap[type];
					return newMap;
				});

				setTotalReceiptAmount((totals) => {
					const newTotals = { ...totals };
					delete newTotals[type];
					return newTotals;
				});

				return updated;
			} else {
				return [...prev, { type, label, details: "", amount: "0" }];
			}
		});
	};

	const handleGetDropdowns = async () => {
		await getDropdownOptions(
			"reimbursement_type",
			setDropdownOptions,
			setIsDropdownLoading
		);
	};

	const handleDownloadReceipt = (filename) => {
		getDownloadReceipts(
			filename,
			setIsLoading,
			setIsError,
			setIsSuccess,
			setFetchMessage
		);
	};

	const handleDeleteAlert = (filename) => {
		setReceiptName(filename);
		setIsDeleteReceiptOpen(true);
	};

	const handleDeleteReceipt = () => {
		setReceipts((prevReceipts) =>
			prevReceipts.filter((item) => item !== receiptName)
		);
		setReceiptsToBeDeleted((prev) => [...prev, receiptName]);
		setIsDeleteReceiptOpen(false);
	};

	const handleCalculateGrossAmount = () => {
		let totalGross =
			parseFloat(
				!isNaN(parseFloat(reimbursementAmount)) &&
					reimbursementAmount !== ""
					? reimbursementAmount
					: 0
			) /
			(1 + VAT_AMOUNT);

		if (isWithTax) {
			setGrossAmount(totalGross);
		} else {
			setGrossAmount(reimbursementAmount);
		}
	};

	const handleAddDetails = (e, type) => {
		e.preventDefault();

		if (
			receiptNumber === "" ||
			reimbursementDesc === "" ||
			reimbursementAmount === ""
		) {
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

	const handleDeleteReceiptRec = (e, type, index) => {
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
		const file = newReceipts[newReceipts.length - 1];
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
		const total = typeOfReimbursement.reduce((sum, details) => {
			return sum + parseFloat(details.amount);
		}, 0);
		setAmount(total);
	}, [typeOfReimbursement]);

	useEffect(() => {
		if (isModalOpen) {
			handleGetDropdowns();

			setReceipts(
				receipt_details.receipts
					? JSON.parse(receipt_details.receipts)
					: []
			);
			setAmount(
				receipt_details.total_expense
					? receipt_details.total_expense
					: 0
			);
			setPcv(receipt_details.pcv ? receipt_details.pcv : "");
			setReimbursementDetails(
				receipt_details.reimbursement_details
					? JSON.parse(receipt_details.reimbursement_details)
					: []
			);
			setTypeOfReimbursement(
				receipt_details.reimbursement_details
					? JSON.parse(receipt_details.reimbursement_details).map(
							(detail) => ({
								type: detail.reimbursement_type,
								label: capitalizeEveryWord(
									detail.reimbursement_type
								),
								details: detail.details || "",
								amount: detail.amount || "",
							})
					  )
					: []
			);
			setPcv(
				receipt_details.pcv_number ? receipt_details.pcv_number : ""
			);
			if (receipt_details?.reimbursement_details) {
				try {
					const parsed = JSON.parse(
						receipt_details.reimbursement_details
					);

					// set reimbursement type selections
					setTypeOfReimbursement(
						parsed.map((detail) => ({
							type: detail.reimbursement_type,
							label: capitalizeEveryWord(
								detail.reimbursement_type
							),
							details: detail.details || "",
							amount: detail.amount || "",
						}))
					);

					// set the map for detailed receipt data
					const mapped = parsed.reduce((acc, item) => {
						acc[item.reimbursement_type] = item.details || [];
						return acc;
					}, {});

					setReimbursementTypeDetailsMap(mapped);
				} catch (error) {
					console.error(
						"Failed to parse reimbursement details:",
						error
					);
					setTypeOfReimbursement([]);
					setReimbursementTypeDetailsMap({});
				}
			}
		}
	}, [isModalOpen]);

	useEffect(() => {
		if (isUpdateSuccess) {
			handleClose();
			fetchReceipts();
		}
	}, [isUpdateSuccess]);

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
		setTypeOfReimbursement(
			reimbursementDetails
				? reimbursementDetails.map((detail) => ({
						type: detail.reimbursement_type,
						label: capitalizeEveryWord(detail.reimbursement_type),
						details: detail.details || "",
						amount: detail.amount || "",
				  }))
				: []
		);
	}, [reimbursementDetails]);

	// useEffect(() => {
	// 	const total = typeOfReimbursement.reduce((sum, details) => {
	// 		return sum + parseFloat(details.amount);
	// 	}, 0);
	// 	setTotalAmount(total);
	// }, [typeOfReimbursement]);

	const scannedFiles = useRef(new Set());

	useEffect(() => {
		if (newReceipts.length > 0) {
			let shouldOpenScan = false;

			newReceipts.forEach((receipt) => {
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
	}, [newReceipts]);

	useEffect(() => {
		if (isTypeSelected) {
			if (
				typeOfReimbursement[scanForType.value] === undefined ||
				typeOfReimbursement[scanForType.value] === false
			) {
				handleToggle(scanForType.value, scanForType.label, true);
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

	const modalContent = (
		<>
			{receipts ? (
				<>
					<div
						ref={contentRef}
						className="w-full h-full mt-2 pl-6 pt-2 pb-4 flex flex-col gap-3 overflow-x-hidden overflow-y-auto"
						style={{
							paddingRight:
								isContentScrollable && !isMobile
									? "0.5rem"
									: "1.5rem",
						}}
					>
						<div className="w-full flex flex-col lg:flex-row gap-2">
							<CustomInput
								inputType="text"
								inputLabel="Reference Number"
								inputValue={receipt_details.ref_number}
								isReadOnly
								isDisabled
							/>
							<CustomInput
								inputType="text"
								inputLabel="Reimbursement Date"
								inputValue={
									receipt_details.disbursement_date
										? format(
												receipt_details.disbursement_date,
												"MMMM dd, yyyy"
										  )
										: ""
								}
								isReadOnly
								isDisabled
							/>
						</div>
						<div className="w-full flex flex-col lg:flex-row gap-2">
							<CustomInput
								inputType="text"
								inputLabel="PCV Number"
								inputValue={pcv}
								setInputValue={setPcv}
								// isReadOnly
								// isDisabled
							/>
							<CustomInput
								inputType="text"
								inputLabel="Amount"
								inputValue={
									"PHP " +
									parseFloat(amount).toLocaleString("en-US", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									})
								}
								isReadOnly
								isDisabled
							/>
						</div>
						<div className="w-full">
							<label className="font-semibold text-color flex">
								Details
							</label>
							<div className="border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md">
								<div className="w-full p-2 flex flex-wrap gap-2">
									{typeOfReimbursement.map((rtype) => (
										<div
											key={rtype.type}
											className="py-1 px-4 bg-[var(--color-bg)] shadow-lift font-medium rounded-md"
										>
											{capitalizeEveryWord(rtype.label)}
										</div>
									))}
								</div>
								<div className="p-2 pt-0 flex flex-col lg:flex-row gap-1 lg:gap-4">
									{isDropdownLoading ? (
										<div className="w-full flex gap-2">
											<span>Loading</span>
											<div>
												<span className="fa fa-spinner fa-spin"></span>
											</div>
										</div>
									) : (
										<>
											<div className="w-full flex flex-wrap gap-x-4 gap-y-2">
												{dropdownOptions.map(
													(choice) => (
														<label
															key={choice.value}
															className="flex items-center gap-1 leading-none text-nowrap"
														>
															<input
																type="checkbox"
																checked={typeOfReimbursement.some(
																	(item) =>
																		item.type ===
																		choice.value
																)}
																onChange={() =>
																	handleToggle(
																		choice.value,
																		choice.label
																	)
																}
															/>
															{choice.label}
														</label>
													)
												)}
											</div>
										</>
									)}
								</div>
							</div>
						</div>
						{typeOfReimbursement.map((item, index) => (
							<div
								key={item.type + index}
								className="w-full p-2 mt-1 flex flex-col bg-[var(--color-bg)] border border-[var(--color-grey)] rounded-md relative"
							>
								<div className="w-full flex justify-end absolute mt-[-1.25rem]">
									<span className="font-semibold mr-6 bg-[var(--color-bg)] px-2 text-[var(--color-primary)]">
										{capitalizeEveryWord(item.label)}
									</span>
								</div>
								{/* <CustomTextArea
									inputLabel="Reimbursement Details"
									inputValue={item.details}
									setInputValue={(value) =>
										handleInputChange(
											item.type,
											"details",
											value
										)
									}
								/> */}

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
											Amount
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
											item.type
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
															details.with_tax ===
															1
														}
														disabled
														customStyles={
															taxCheckboxStyles
														}
														onChange={() => {
															return;
														}}
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
														handleDeleteReceiptRec(
															e,
															item.type,
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
															item.type,
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
												setInputValue={
													setReimbursementDesc
												}
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
														item.type
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
								<div className="w-full flex justify-end">
									<div className="flex gap-2 items-center">
										<span className="font-semibold">
											Amount:
										</span>
										<CustomInput
											inputType="number"
											inputPlaceHolder="Enter Amount"
											inputValue={item.amount}
											isNumberCurrency
											setInputValue={(value) =>
												handleInputChange(
													item.type,
													"amount",
													value
												)
											}
										/>
									</div>
								</div>
							</div>
						))}
						<div className="w-full">
							<div className="w-full mb-4">
								<label className="font-semibold text-color flex">
									Current Receipts and/or Summary of Expense
								</label>
								<div className="w-full p-2 border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md flex flex-wrap gap-2">
									{receipts.length > 0 ? (
										<>
											{receipts.map((receipt, index) => (
												<div
													key={receipt + index}
													className="p-2 bg-[var(--color-bg)] shadow-lift flex gap-4 items-center justify-between font-medium rounded-md max-w-[15.5rem]"
												>
													<div className="w-full flex flex-col gap-2">
														<span className="text-[0.9rem] truncate">
															{receipt}
														</span>
														<div className="w-full flex gap-2">
															<CustomButton
																buttonVariant="solid"
																buttonSolidColor="var(--color-primary)"
																buttonLabel={
																	<>
																		<div className="flex gap-2 items-center">
																			<span className="fa-solid fa-file-download text-white" />
																			<span className="text-white text-[0.75rem]">
																				Download
																			</span>
																		</div>
																	</>
																}
																buttonClick={() =>
																	handleDownloadReceipt(
																		receipt
																	)
																}
																buttonWidth="7rem"
																isDisabled={
																	isLoading
																}
																isScaledOnHover={
																	false
																}
																isDarkendOnHover
															/>
															<CustomButton
																buttonVariant="solid"
																buttonSolidColor="var(--color-secondary)"
																buttonLabel={
																	<>
																		<div className="flex gap-2 items-center">
																			<span className="fa-solid fa-trash text-white" />
																			<span className="text-white text-[0.75rem]">
																				Delete
																			</span>
																		</div>
																	</>
																}
																buttonClick={() =>
																	handleDeleteAlert(
																		receipt
																	)
																}
																buttonWidth="7rem"
																isDisabled={
																	isLoading
																}
																isScaledOnHover={
																	false
																}
																isDarkendOnHover
															/>
														</div>
													</div>
												</div>
											))}
										</>
									) : (
										<>
											<div className="w-full h-10 flex justify-center items-center">
												No Receipts
											</div>
										</>
									)}
								</div>
							</div>
							<CustomFileUpload
								files={newReceipts}
								setFiles={setNewReceipts}
								inputLabel="Upload Additional Receipts and/or Summary of Expense (If Needed)"
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
								isWithImageCapture
							/>
						</div>
					</div>
				</>
			) : (
				<div className="w-full flex justify-center items-center">
					<span>No Receipt</span>
				</div>
			)}
			<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
				<CustomButton
					buttonVariant="primary"
					buttonLabel="Update"
					buttonClick={handleUpdateConfirm}
					isLoading={isUpdateLoading}
					isDisabled={isUpdateLoading}
				/>
				<CustomButton
					buttonVariant="bordered"
					buttonLabel="Cancel"
					buttonClick={handleClose}
					isDisabled={isUpdateLoading}
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
				modalTitle="Edit Receipt"
				modalTitleTWStyle="leading-none px-6"
				modalContent={modalContent}
			/>

			<CapturePhotoFullScreen
				isModalOpen={isCameraOpen}
				setIsModalOpen={setIsCameraOpen}
				setFiles={setNewReceipts}
			/>

			<CustomAlertModal
				isModalOpen={isDeleteReceiptOpen}
				modalButtonClick={() => setIsDeleteReceiptOpen(false)}
				modalButtonConfirm={handleDeleteReceipt}
				modalHeadline="Delete File?"
				modalMessage="Proceeding will delete the file/receipt"
				modalVariant="confirm"
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

			{/* UPDATE */}
			<CustomAlertModal
				isModalOpen={isUpdateAlertOpen}
				modalButtonClick={() => setIsUpdateAlertOpen(false)}
				modalButtonConfirm={handleUpdateReceipt}
				modalHeadline="Confirm Update?"
				modalMessage="Proceeding will update/apply the details you modified"
				modalVariant="confirm"
			/>
			<CustomAlertModal
				modalVariant="success"
				modalMessage={fetchMessageUpdate}
				isModalOpen={isUpdateSuccess}
				modalButtonClick={() => setIsUpdateSuccess(false)}
			/>
			<CustomAlertModal
				modalVariant="error"
				modalMessage={fetchMessageUpdate}
				isModalOpen={isUpdateError}
				modalButtonClick={() => setIsUpdateError(false)}
			/>

			{/* NO REIMBURSEMENT TYPE */}
			<CustomAlertModal
				modalVariant="error"
				modalMessage="Please select at least one reimbursemnt type"
				isModalOpen={isNoReimbursement}
				modalButtonClick={() => setIsNoReimbursement(false)}
			/>

			{/* NO RECEIPTS */}
			<CustomAlertModal
				modalVariant="error"
				modalMessage="Please include at least one receipts"
				isModalOpen={isNoReceipts}
				modalButtonClick={() => setIsNoReceipts(false)}
			/>

			{/* SCAN RECEIPT */}
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
			<CustomAlertModal
				modalVariant="error"
				modalMessage={fetchMessageMindee}
				isModalOpen={isErrorMindee}
				modalButtonClick={() => setIsErrorMindee(false)}
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

export default AuiditFormEditReceiptModal;
