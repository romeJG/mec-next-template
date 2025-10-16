import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CustomModalNoScroll from "../customs/CustomModalNoScroll";
import CustomInput from "../customs/CustomInput";
import CustomSelect from "../customs/CustomSelect";
import CustomFileUpload from "../customs/CustomFileUpload";
import useReimbursement from "../../apis/useReimbursement";
import CustomButton from "../customs/CustomButton";
import CustomAlertModal from "../customs/CustomAlertModal";
import { format, isAfter } from "date-fns";
import capitalizeEveryWord from "../../utils/capitalizeEveryWord";
import useDropdown from "../../apis/useDropdown";
import CustomRadioButton from "../customs/CustomRadioButton";
import CapturePhotoFullScreen from "./CapturePhotoFullScreen";
import useDeviceSize from "../../hooks/useDeviceSize";
import useConstants from "../../hooks/useConstants";
import CustomCheckbox2 from "../customs/CustomCheckBox2";
import ReimbursementDetailsEditModal from "./ReimbursementDetailsEditModal";
import useMindee from "../../apis/useMindee";
import ChooseRequestTypeModal from "./ChooseRequestTypeModal";
import ReceiptIsScanningModal from "./ReceiptIsScanningModal";

function RequestListUpdateDetailsModal({
	details,
	isModalOpen,
	setIsModalOpen,
	handleGetAllRequests,
}) {
	const { postUpdateRequest } = useReimbursement();
	const { getDropdownOptions } = useDropdown();
	const { isMobile } = useDeviceSize();
	const { VAT_AMOUNT } = useConstants();
	const { uploadReceipt, getMindeeAPIkey } = useMindee();
	const today = new Date();

	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const [email, setEmail] = useState("");
	const [refNumber, setRefNumber] = useState("");
	const [applicationDate, setApplicationDate] = useState("");
	const [typeOfReimbursement, setTypeOfReimbursement] = useState([]);
	const [reimbursementDetails, setReimbursementDetails] = useState("");
	const [receipts, setReceipts] = useState([]);
	const [newReceipts, setNewReceipts] = useState([]);
	const [receiptsToBeDeleted, setReceiptsToBeDeleted] = useState([]);
	const [receiptName, setReceiptName] = useState("");
	const [isDeleteReceiptOpen, setIsDeleteReceiptOpen] = useState(false);
	const [totalAmount, setTotalAmount] = useState("");
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

	const { getDownloadReceipts } = useReimbursement();
	const [isUpdateAlertOpen, setIsUpdateAlertOpen] = useState(false);
	const [isUpdateLoading, setIsUpdateLoading] = useState(false);
	const [isUpdateError, setIsUpdateError] = useState(false);
	const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [fetchMessage, setFetchMessage] = useState("");
	const [dropdownOptions, setDropdownOptions] = useState([]);
	const [isDropdownLoading, setIsDropdownLoading] = useState(false);

	const [isNoReimbursement, setIsNoReimbursement] = useState(false);
	const [isNoReceipts, setIsNoReceipts] = useState(false);

	const [isPaidServices, setIsPaidServices] = useState(
		details.is_paid_services === 1 ? "yes" : "no"
	);

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

	const handleRadioChange = (value) => {
		setIsPaidServices(value);
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

	const handleClose = () => {
		setPaymentType(paymentMethods[0]);
		setTypeOfReimbursement([]);
		setReimbursementDetails([]);
		setReceipts([]);
		setNewReceipts([]);
		setReceiptsToBeDeleted([]);
		setIsPaidServices("no");
		setGCashName("");
		setGCashNumber("");
		setBdoAccountName("");
		setBdoAccountNumber("");
		setTotalAmount("");
		setApplicationDate(new Date());
		setIsModalOpen(false);
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

	const handleToggle = (type, label, fromScan = false) => {
		setTypeOfReimbursement((prev) => {
			const exists = prev.some((item) => item.type === type);

			if (exists) {
				// if it's from a scanner and type is already selected, do nothing
				if (fromScan) return prev;

				// don't allow deselect if it's the last one
				if (prev.length === 1) {
					setIsNoReimbursement(true);
					return prev;
				}

				// otherwise, remove this type
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
				// not yet selected — add it
				return [...prev, { type, label, details: "", amount: "0" }];
			}
		});
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

	const handleGCashNameChange = (value) => {
		setGCashName(value.toUpperCase());
	};

	const handleBdoNameChange = (value) => {
		setBdoAccountName(value.toUpperCase());
	};

	const handleUpdateRequest = async () => {
		setIsUpdateAlertOpen(false);
		await postUpdateRequest(
			email,
			refNumber,
			format(applicationDate, "yyyy-MM-dd"),
			typeOfReimbursement,
			reimbursementDetails,
			totalAmount,
			newReceipts,
			receiptsToBeDeleted,
			paymentType.value,
			gCashName,
			gCashNumber,
			bdoAccountName,
			bdoAccountNumber,
			isPaidServices,
			setIsUpdateLoading,
			setIsUpdateSuccess,
			setIsUpdateError,
			setFetchMessage
		);
	};

	const areRequiredFieldsFilled = () => {
		const basicFields = [
			applicationDate,
			typeOfReimbursement,
			reimbursementDetails,
			totalAmount,
		];

		const paymentFields =
			paymentType.value === 2
				? [gCashName, gCashNumber]
				: paymentType.value === 3
				? [bdoAccountName, bdoAccountNumber]
				: [];

		return [...basicFields, ...paymentFields].every(Boolean);
	};

	const handleUpdateConfirm = (e) => {
		e.preventDefault();

		const missingType = typeOfReimbursement.find(
			(item) =>
				!reimbursementTypeDetailsMap[item.type] ||
				reimbursementTypeDetailsMap[item.type].length === 0
		);

		if (missingType) {
			setFetchMessage(
				`Please input at least one receipt for the "${missingType.label}" reimbursement type.`
			);
			setIsError(true);
			return;
		}

		if (isAfter(applicationDate, today)) {
			setIsError(true);
			setFetchMessage("The application date cannot be later than today.");
			return;
		}

		if (!areRequiredFieldsFilled()) {
			setFetchMessage("Please fill in all the required fields.");
			setIsError(true);
			return;
		}

		if (receipts.length <= 0) {
			if (newReceipts.length <= 0) {
				setIsNoReceipts(true);
				return;
			}
		}

		setIsUpdateAlertOpen(true);
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
		if (isModalOpen) {
			handleGetDropdowns();
			setEmail(details.email || "");
			setRefNumber(details.ref_number || "");
			setApplicationDate(details.application_date || "");
			setReimbursementDetails(
				details.reimbursement_details
					? JSON.parse(details.reimbursement_details)
					: []
			);
			setTotalAmount(details.total_expense || "");
			setGCashName(details.gcash_name || "");
			setGCashNumber(details.gcash_number || "");
			setBdoAccountName(details.bdo_name || "");
			setBdoAccountNumber(details.bdo_number || "");
			setReceipts(details.receipts ? JSON.parse(details.receipts) : []);
			setNewReceipts([]);
			setPaymentType(
				details.payment_type === 3 || details.payment_type === 2
					? paymentMethods[0]
					: paymentMethods[1]
			);
			setIsPaidServices(details.is_paid_services === 1 ? "yes" : "no");
			if (details?.reimbursement_details) {
				try {
					const parsed = JSON.parse(details.reimbursement_details);

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
	}, [isModalOpen, details]);

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
		if (isUpdateSuccess) {
			setIsModalOpen(false);
			handleGetAllRequests();
		}
	}, [isUpdateSuccess]);

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

	useEffect(() => {
		const total = typeOfReimbursement.reduce((sum, details) => {
			return sum + parseFloat(details.amount);
		}, 0);
		setTotalAmount(total);
	}, [typeOfReimbursement]);

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
						isDisabled
						isReadOnly
					/>
					<CustomInput
						inputType="text"
						inputLabel="Email"
						inputValue={email}
						setInputValue={setEmail}
						isDisabled
						isReadOnly
					/>
				</div>
				<div className="w-full flex flex-col md:flex-row gap-3">
					<CustomInput
						inputType="text"
						inputLabel="Position"
						inputValue={details.position}
						isDisabled
						isReadOnly
					/>
					<CustomInput
						inputType="text"
						inputLabel="Department"
						inputValue={details.department}
						isDisabled
						isReadOnly
					/>
				</div>
				<div className="w-full flex flex-col md:flex-row gap-3">
					<CustomInput
						inputType="text"
						inputLabel="Reference Number"
						inputValue={refNumber}
						setInputValue={setRefNumber}
						isDisabled
						isReadOnly
					/>
					<CustomInput
						inputType="date"
						inputLabel="Application Date"
						inputValue={applicationDate}
						setInputValue={setApplicationDate}
					/>
				</div>
				<div className="w-full">
					<label className="font-semibold text-color flex">
						Reimbursement Type
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
									{dropdownOptions.map((choice) => (
										<label
											key={choice.value}
											className="flex items-center gap-2"
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
														choice.label,
														false
													)
												}
											/>
											{choice.label}
										</label>
									))}
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
									reimbursementTypeDetailsMap[item.type] || []
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
												handleAddDetails(e, item.type);
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
								<span className="font-semibold whitespace-nowrap">
									Total Amount:
								</span>
								<CustomInput
									inputType="text"
									inputPlaceHolder="Enter Amount"
									inputValue={
										"PHP " +
										(
											totalReceiptAmount[item.type] || 0
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
					</div>
				))}
				{details.department &&
					details.department.includes(
						"Technical Planning & Operations"
					) && (
						<div className="w-full flex flex-col">
							<label className="font-semibold flex">
								Is the Reimbursement a Paid Service/s?
							</label>
							<div className="w-full min-h-[2.75rem] flex items-center p-2 border border-[var(--color-grey)] rounded-md bg-[var(--color-grey-light)]">
								<CustomRadioButton
									name="paid_services"
									options={[
										{ value: "yes", label: "Yes" },
										{ value: "no", label: "No" },
									]}
									selectedValue={isPaidServices}
									onChange={handleRadioChange}
								/>
							</div>
						</div>
					)}
				<div className="w-full flex flex-col md:flex-row gap-3">
					<CustomSelect
						isCustomVariant
						selectLabel="Payment Type"
						selectOptions={paymentMethods}
						selectedOption={paymentType}
						setSelectedOption={setPaymentType}
					/>
					<CustomInput
						inputType="text"
						inputLabel="Total Expense"
						inputValue={
							totalAmount
								? "PHP " +
								  parseFloat(totalAmount).toLocaleString(
										"en-US",
										{
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										}
								  )
								: "PHP 0.00"
						}
						setInputValue={setTotalAmount}
						// isNumberCurrency
						isDisabled
						isReadOnly
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
																{isLoading ? (
																	<>
																		<span className="fa-solid fa-spinner fa-spin text-white" />
																	</>
																) : (
																	<>
																		<div className="flex gap-2 items-center">
																			<span className="fa-solid fa-file-download text-white" />
																			<span className="text-white text-[0.75rem]">
																				Download
																			</span>
																		</div>
																	</>
																)}
															</>
														}
														buttonClick={() =>
															handleDownloadReceipt(
																receipt
															)
														}
														buttonWidth="7rem"
														isDisabled={isLoading}
														isScaledOnHover={false}
														isDarkendOnHover
													/>
													<CustomButton
														buttonVariant="solid"
														buttonSolidColor="var(--color-secondary)"
														buttonLabel={
															<>
																{isLoading ? (
																	<>
																		<span className="fa-solid fa-spinner fa-spin text-white" />
																	</>
																) : (
																	<>
																		<div className="flex gap-2 items-center">
																			<span className="fa-solid fa-trash text-white" />
																			<span className="text-white text-[0.75rem]">
																				Delete
																			</span>
																		</div>
																	</>
																)}
															</>
														}
														buttonClick={() =>
															handleDeleteAlert(
																receipt
															)
														}
														buttonWidth="7rem"
														isDisabled={isLoading}
														isScaledOnHover={false}
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
						isMultiple={false}
					/>
				</div>
			</div>
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
				modalSize="lg"
				modalTitle="Edit Request Details"
				modalTitleTWStyle="leading-none px-6"
				modalContent={modalContent}
				// isCloseable
			/>
			<CapturePhotoFullScreen
				isModalOpen={isCameraOpen}
				setIsModalOpen={setIsCameraOpen}
				setFiles={setNewReceipts}
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
				modalButtonClick={() => setIsErrorDetails(false)}
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
				modalButtonConfirm={handleUpdateRequest}
				modalHeadline="Confirm Update?"
				modalMessage="Proceeding will update/apply the details you modified"
				modalVariant="confirm"
			/>
			<CustomAlertModal
				modalVariant="success"
				modalMessage={fetchMessage}
				isModalOpen={isUpdateSuccess}
				modalButtonClick={() => setIsUpdateSuccess(false)}
			/>
			<CustomAlertModal
				modalVariant="error"
				modalMessage={fetchMessage}
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

export default RequestListUpdateDetailsModal;
