import { useEffect, useRef, useState } from "react";
import CustomInput from "../../customs/CustomInput";
import { format } from "date-fns";
import { motion } from "framer-motion";
import CustomModalNoScroll from "../../customs/CustomModalNoScroll";
import CustomButton from "../../customs/CustomButton";
import CustomAlertModal from "../../customs/CustomAlertModal";
import PreviewImageModal from "../PreviewImageModal";
import CustomTextArea from "../../customs/CustomTextArea";
import useCashAdvance from "../../apis/useCashAdvance";
import capitalizeEveryWord from "../../../utils/capitalizeEveryWord";
import useDropdown from "../../apis/useDropdown";
import CustomFileUpload from "../../customs/CustomFileUpload";
import CapturePhotoFullScreen from "./CapturePhotoFullScreen";
import useDeviceSize from "../../../hooks/useDeviceSize";
import CustomCheckbox2 from "../../customs/CustomCheckBox2";
import useConstants from "../../../hooks/useConstants";
import ReimbursementDetailsEditModal from "../ReimbursementDetailsEditModal";
import useMindee from "../../apis/useMindee";
import ChooseRequestTypeModal from "./ChooseRequestTypeModal";
import ReceiptIsScanningModal from "../ReceiptIsScanningModal";

// This component is long AF. If you are task to maintain this, Sorry :(
function CARequestListReviseModal({
	details,
	isModalOpen,
	setIsModalOpen,
	getAllRequest,
}) {
	const userInfo = JSON.parse(localStorage.getItem("user-info"));
	const { isMobile } = useDeviceSize();
	const { VAT_AMOUNT } = useConstants();
	const { uploadReceipt, getMindeeAPIkey } = useMindee();
	const today = new Date();

	const {
		getDisbursementAttachmentImage,
		getLiquidationAttachmentImage,
		getReturnAttachmentImage,
		downloadDisbursementAttachment,
		downloadLiquidationAttachment,
		downloadReturnAttachment,
		reviseCARequest,
	} = useCashAdvance();

	const { getDropdownOptions } = useDropdown();

	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [fetchMessage, setFetchMessage] = useState("");

	// Additional Notes
	const [additionalNotes, setAdditonalNotes] = useState("");
	const [isReviseOpen, setIsReviseOpen] = useState(false);
	const [isLoadingRevise, setIsLoadingRevise] = useState(false);
	const [isErrorRevise, setIsErrorRevise] = useState(false);
	const [isSuccessRevise, setIsSuccessRevise] = useState(false);

	// Image Preview
	const [isPreviewOpenDisburse, setIsPreviewOpenDisburse] = useState(false);
	const [isPreviewOpenLiquidate, setIsPreviewOpenLiquidate] = useState(false);
	const [isPreviewOpenReturn, setIsPreviewOpenReturn] = useState(false);
	const [imageName, setImageName] = useState("");

	// Expense Details
	const [typeOfExpense, setTypeOfExpense] = useState([]);
	const [expenseDetails, setExpenseDetails] = useState([]);
	const [totalExpense, setTotalExpense] = useState(0);
	const [attachementToDelete, setAttachmentsToDelete] = useState([]);
	const [expenseAttachments, setExpenseAttachments] = useState([]);
	const [newAttachmentsExpense, setNewAttachmentsExpense] = useState([]);
	const [expenseAttachName, setExpenseAttachName] = useState("");
	const [isCameraOpenExpense, setIsCameraOpenExpense] = useState(false);
	const [isDeleteOpenExpense, setIsDeleteOpenExpense] = useState(false);

	// Excess Details
	const [totalExcess, setTotalExcess] = useState(0);
	const [excessFilesToDelete, setExcessFilesToDelete] = useState([]);
	const [excessAttachments, setExcessAttachments] = useState([]);
	const [newAttachmentsExcess, setNewAttachmentsExcess] = useState([]);
	const [excessAttachName, setExcessAttachName] = useState("");
	const [isCameraOpenExcess, setIsCameraOpenExcess] = useState(false);
	const [isDeleteOpenExcess, setIsDeleteOpenExcess] = useState(false);
	const [isNoReimbursement, setIsNoReimbursement] = useState(false);

	const [isNoExpense, setIsNoExpense] = useState(false);
	const [isNoReceipts, setIsNoReceipts] = useState(false);
	const [dropdownOptions, setDropdownOptions] = useState([]);
	const [isDropdownLoading, setIsDropdownLoading] = useState(false);

	// Request Details
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

	const handleDownloadReceiptDisburse = (filename) => {
		downloadDisbursementAttachment(
			filename,
			setIsLoading,
			setIsError,
			setIsSuccess,
			setFetchMessage
		);
	};
	const handleDownloadReceiptLiquidate = (filename) => {
		downloadLiquidationAttachment(
			filename,
			setIsLoading,
			setIsError,
			setIsSuccess,
			setFetchMessage
		);
	};
	const handleDownloadReceiptReturn = (filename) => {
		downloadReturnAttachment(
			filename,
			setIsLoading,
			setIsError,
			setIsSuccess,
			setFetchMessage
		);
	};

	const handleCheckUpdate = async () => {
		const missingType = typeOfExpense.find(
			(item) =>
				!reimbursementTypeDetailsMap[item.type] ||
				reimbursementTypeDetailsMap[item.type].length === 0
		);

		if (missingType) {
			setFetchMessage(
				`Please input at least one receipt for the "${missingType.label}" expense type.`
			);
			setIsError(true);
			return;
		}

		if (expenseAttachments.length <= 0) {
			if (newAttachmentsExpense.length <= 0) {
				setIsNoReceipts(true);
				return;
			}
		}

		setIsReviseOpen(true);
	};

	const handleReviseCARequest = async () => {
		setIsReviseOpen(false);
		await reviseCARequest(
			details.ref_number,
			userInfo.user_creds.email,
			additionalNotes,
			typeOfExpense,
			expenseDetails,
			totalExpense,
			totalExcess,
			newAttachmentsExpense,
			newAttachmentsExcess,
			attachementToDelete,
			excessFilesToDelete,
			setIsLoadingRevise,
			setIsSuccessRevise,
			setIsErrorRevise,
			setFetchMessage
		);
	};

	const handleClose = () => {
		setAdditonalNotes("");
		setTypeOfExpense([]);
		setExpenseDetails([]);
		setExcessAttachments([]);
		setExpenseAttachments([]);
		setNewAttachmentsExpense([]);
		setNewAttachmentsExcess([]);
		setAttachmentsToDelete([]);
		setExpenseAttachName("");
		setIsModalOpen(false);
	};

	function isImageFile(filename) {
		const imageExtensions = [
			".png",
			".jpg",
			".jfif",
			".jpeg",
			".gif",
			".bmp",
			".webp",
			".tiff",
			".svg",
		];
		const fileExtension = filename
			.slice(filename.lastIndexOf("."))
			.toLowerCase();
		return imageExtensions.includes(fileExtension);
	}

	// Type of Expense Change
	// const handleToggle = (type, label) => {
	// 	setTypeOfExpense((prev) => {
	// 		const exists = prev.some((item) => item.type === type);

	// 		if (exists && prev.length === 1) {
	// 			setIsNoExpense(true);
	// 			return prev;
	// 		}

	// 		if (exists) {
	// 			const updated = prev.filter((item) => item.type !== type);
	// 			setExpenseDetails((details) =>
	// 				details.filter(
	// 					(detail) => detail.reimbursement_type !== type
	// 				)
	// 			);
	// 			return updated;
	// 		} else {
	// 			return [...prev, { type, label, details: "", amount: "0" }];
	// 		}
	// 	});
	// };

	const handleToggle = (type, label, fromScan = false) => {
		setTypeOfExpense((prev) => {
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

				setExpenseDetails((details) =>
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

	const handleInputChange = (type, field, value) => {
		setTypeOfExpense((prev) =>
			prev.map((item) =>
				item.type === type ? { ...item, [field]: value } : item
			)
		);

		setExpenseDetails((prev) => {
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

	// EXPENSE
	const handleDeleteAlert = (filename) => {
		setExpenseAttachName(filename);
		setIsDeleteOpenExpense(true);
	};
	const handleDeleteExpense = () => {
		setExpenseAttachments((prevReceipts) =>
			prevReceipts.filter((item) => item !== expenseAttachName)
		);
		setAttachmentsToDelete((prev) => [...prev, expenseAttachName]);
		setIsDeleteOpenExpense(false);
	};

	// EXCESS
	const handleDeleteAlertExcess = (filename) => {
		setExcessAttachName(filename);
		setIsDeleteOpenExcess(true);
	};
	const handleDeleteExcess = () => {
		setExcessAttachments((prevReceipts) =>
			prevReceipts.filter((item) => item !== excessAttachName)
		);
		setExcessFilesToDelete((prev) => [...prev, excessAttachName]);
		setIsDeleteOpenExcess(false);
	};

	// CA REQUEST DETAILS
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

		setExpenseDetails((existing) => {
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

		setExpenseDetails((existing) => {
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

			setExpenseDetails((existing) => {
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

		setExpenseDetails((existing) => {
			const others = existing.filter(
				(item) => item.reimbursement_type !== type
			);

			return [
				...others,
				{
					reimbursement_type: type,
					details: filtered,
					amount: parseFloat(total),
				},
			];
		});
	};

	const handleScanReceipt = async () => {
		const file = newAttachmentsExpense[newAttachmentsExpense.length - 1];
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

		setExpenseDetails((prev) => {
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
	}, [reimbursementAmount]);

	useEffect(() => {
		const total = expenseDetails.reduce((sum, details) => {
			return sum + parseFloat(details.amount || 0);
		}, 0);
		setTotalExpense(total);
	}, [reimbursementTypeDetailsMap, expenseDetails]);

	// Automatically calculate the excess amount
	useEffect(() => {
		const total = parseFloat(details.amount_requested) - totalExpense;
		setTotalExcess(total > 0 ? total : 0);
	}, [totalExpense]);

	// Initialize Data
	useEffect(() => {
		if (isModalOpen) {
			handleGetDropdowns();
			setTotalExcess(details.total_excess || 0);
			setExpenseAttachments(
				details.liquidation_attachment
					? JSON.parse(details.liquidation_attachment)
					: []
			);
			setExpenseDetails(
				details.expense_details
					? JSON.parse(details.expense_details)
					: []
			);
			setTypeOfExpense(
				details.expense_details
					? JSON.parse(details.expense_details).map((detail) => ({
							type: detail.reimbursement_type,
							label: capitalizeEveryWord(
								detail.reimbursement_type
							),
							details: detail.details || "",
							amount: detail.amount || "",
					  }))
					: []
			);
			setExcessAttachments(
				details.return_attachment
					? JSON.parse(details.return_attachment)
					: []
			);
			setNewAttachmentsExpense([]);
			setNewAttachmentsExcess([]);

			if (details?.expense_details) {
				try {
					const parsed = JSON.parse(details.expense_details);

					// set reimbursement type selections
					setTypeOfExpense(
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
					setTypeOfExpense([]);
					setReimbursementTypeDetailsMap({});
				}
			}
		}
	}, [isModalOpen]);

	const handleGetDropdowns = async () => {
		await getDropdownOptions(
			"reimbursement_type",
			setDropdownOptions,
			setIsDropdownLoading
		);
	};

	useEffect(() => {
		if (isSuccessRevise) {
			handleClose();
			getAllRequest();
		}
	}, [isSuccessRevise]);

	const scannedFiles = useRef(new Set());

	useEffect(() => {
		if (newAttachmentsExpense.length > 0) {
			let shouldOpenScan = false;

			newAttachmentsExpense.forEach((receipt) => {
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
	}, [newAttachmentsExpense]);

	useEffect(() => {
		if (isTypeSelected) {
			if (
				typeOfExpense[scanForType.value] === undefined ||
				typeOfExpense[scanForType.value] === false
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
				<div className="font-semibold text-gradient-soft text-[1.25rem] mt-4 mb-[-0.5rem] flex items-center gap-2">
					<span className="leading-none text-nowrap">
						CASH ADVANCE DETAILS
					</span>
					<div className="w-full h-[2px] min-h-[2px] bg-[var(--color-accent-medium)] rounded-sm" />
				</div>
				<div className="w-full flex flex-col md:flex-row gap-3">
					<CustomInput
						inputType="text"
						inputLabel="Reference Number"
						inputValue={details.ref_number}
						isReadOnly
						isDisabled
					/>
					<CustomInput
						inputType="text"
						inputLabel="Application Date"
						inputValue={
							details.application_date
								? format(
										details.application_date,
										"MMMM dd, yyyy"
								  )
								: "--"
						}
						isReadOnly
						isDisabled
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
					<CustomInput
						inputType="text"
						inputLabel="Disbursement Date"
						inputValue={
							details.disbursement_date
								? format(
										details.disbursement_date,
										"MMMM dd, yyyy"
								  )
								: "--"
						}
						isReadOnly
						isDisabled
					/>
					<CustomInput
						inputType="text"
						inputLabel="Liquidation Date"
						inputValue={
							details.liquidation_date
								? format(
										details.liquidation_date,
										"MMMM dd, yyyy"
								  )
								: "--"
						}
						isReadOnly
						isDisabled
					/>
				</div>

				<div className="w-full flex flex-col gap-3">
					<CustomInput
						inputType="text"
						inputLabel="Amount Requested"
						inputValue={
							details.amount_requested
								? "PHP " +
								  parseFloat(details.amount_requested).toFixed(
										2
								  )
								: "--"
						}
						isReadOnly
						isDisabled
					/>
					<CustomTextArea
						inputLabel="Cash Advance Purpose"
						inputValue={details.ca_purpose}
						isReadOnly
						isDisabled
					/>
				</div>
				{details.disbursement_attachment && (
					<>
						{JSON.parse(details.disbursement_attachment).length >
							0 && (
							<div className="w-full">
								<label className="font-semibold text-color flex">
									{JSON.parse(details.disbursement_attachment)
										.length > 1
										? "Disbursement Attachments"
										: "Disbursement Attachment"}
								</label>
								<div className="w-full p-2 border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md flex flex-wrap gap-2">
									{JSON.parse(
										details.disbursement_attachment
									).map((receipt, index) => (
										<div
											key={receipt + index}
											className="p-2 bg-[var(--color-bg)] shadow-lift flex gap-4 items-center justify-between font-medium rounded-md min-w-[15.5rem] max-w-[15.5rem]"
										>
											<div className="w-full flex flex-col gap-2">
												<span className="text-[0.9rem] truncate">
													{receipt}
												</span>
												<div className="flex gap-2">
													{isImageFile(receipt) && (
														<div className="w-full">
															<CustomButton
																buttonVariant="solid"
																buttonSolidColor="var(--color-accent-medium)"
																buttonLabel={
																	<>
																		{isLoading ? (
																			<>
																				<span className="fa-solid fa-spinner fa-spin text-white" />
																			</>
																		) : (
																			<>
																				<div className="flex gap-2 items-center">
																					<span className="fa-solid fa-eye text-white" />
																					<span className="text-white text-[0.75rem]">
																						View
																					</span>
																				</div>
																			</>
																		)}
																	</>
																}
																buttonClick={() => {
																	setIsPreviewOpenDisburse(
																		true
																	);
																	setImageName(
																		receipt
																	);
																}}
																isDisabled={
																	isLoading
																}
																isScaledOnHover={
																	false
																}
																isDarkendOnHover
															/>
														</div>
													)}
													<div className="w-full">
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
																handleDownloadReceiptDisburse(
																	receipt
																)
															}
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
										</div>
									))}
								</div>
							</div>
						)}
					</>
				)}
				<div className="font-semibold text-gradient-soft text-[1.25rem] mt-4 mb-[-0.5rem] flex items-center gap-2">
					<span className="leading-none text-nowrap">
						PAYMENT DETAILS
					</span>
					<div className="w-full h-[2px] min-h-[2px] bg-[var(--color-accent-medium)] rounded-sm" />
				</div>
				<div className="w-full flex flex-col md:flex-row gap-3">
					<CustomInput
						inputType="text"
						inputLabel="Payment Type"
						inputValue={
							details.payment_type === 1
								? "Petty Cash"
								: details.payment_type === 2
								? "GCash"
								: "BDO"
						}
						isReadOnly
						isDisabled
					/>
				</div>
				{details.payment_type === 2 ? (
					<>
						<div className="w-full flex flex-col md:flex-row gap-3">
							<CustomInput
								inputType="text"
								inputLabel="GCash Name"
								inputValue={details.gcash_name}
								isReadOnly
								isDisabled
							/>
							<CustomInput
								inputType="text"
								inputLabel="GCash Number"
								inputValue={details.gcash_number}
								isReadOnly
								isDisabled
							/>
						</div>
					</>
				) : details.payment_type === 3 ? (
					<>
						<div className="w-full flex flex-col md:flex-row gap-3">
							<CustomInput
								inputType="text"
								inputLabel="BDO Name"
								inputValue={details.bdo_name}
								isReadOnly
								isDisabled
							/>
							<CustomInput
								inputType="text"
								inputLabel="BDO Number"
								inputValue={details.bdo_number}
								isReadOnly
								isDisabled
							/>
						</div>
					</>
				) : (
					<></>
				)}
				<div className="font-semibold text-gradient-soft text-[1.25rem] mt-4 mb-[-0.5rem] flex items-center gap-2">
					<span className="leading-none text-nowrap">
						EXPENSE DETAILS
					</span>
					<div className="w-full h-[2px] min-h-[2px] bg-[var(--color-accent-medium)] rounded-sm" />
				</div>
				<div className="w-full">
					<label className="font-semibold text-color flex">
						Expense Type
					</label>
					<div className="border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md">
						<div className="w-full p-2 flex flex-wrap gap-2">
							{typeOfExpense.map((rtype, index) => (
								<div
									key={rtype.type + "000" + index}
									className="py-1 px-4 bg-[var(--color-bg)] shadow-lift font-medium rounded-md"
								>
									{capitalizeEveryWord(rtype.label)}
								</div>
							))}
						</div>
						<div className="p-2 pt-0 flex flex-col lg:flex-row flex-wrap gap-1 lg:gap-3">
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
											className="flex items-center gap-2 truncate"
										>
											<input
												type="checkbox"
												checked={typeOfExpense.some(
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
				{typeOfExpense.map((item, index) => (
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
								handleInputChange(item.type, "details", value)
							}
						/> */}
						<div className="w-full flex flex-col">
							<label className="font-semibold text-color inline-block">
								Expense Details
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
				<div className="w-full">
					<CustomInput
						inputType="text"
						inputLabel="Total Amount of Expense"
						inputValue={
							totalExpense
								? "PHP " +
								  parseFloat(totalExpense).toLocaleString(
										"en-US",
										{
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										}
								  )
								: "PHP 0.00"
						}
						isDisabled
						isReadOnly
					/>
				</div>

				<div className="w-full">
					<div className="w-full mb-4">
						<label className="font-semibold text-color flex">
							Current Liquidation Attachments
						</label>
						<div className="w-full p-2 border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md flex flex-wrap gap-2">
							{expenseAttachments.length > 0 ? (
								<>
									{expenseAttachments.map(
										(receipt, index) => (
											<div
												key={receipt + index}
												className="p-2 bg-[var(--color-bg)] shadow-lift flex gap-4 items-center justify-between font-medium rounded-md min-w-[15.5rem] max-w-[15.5rem]"
											>
												<div className="w-full flex flex-col gap-2">
													<div className="flex justify-between">
														<span className="text-[0.9rem] truncate">
															{receipt}
														</span>
														<motion.div
															className="min-w-6 min-h-6 grid place-content-center rounded-full cursor-pointer"
															whileHover={{
																scale: 1.025,
																background:
																	"var(--color-grey)",
															}}
															whileTap={{
																scale: 0.95,
															}}
															onClick={() =>
																handleDeleteAlert(
																	receipt
																)
															}
														>
															<span className="fa-solid fa-xmark text-[1rem]"></span>
														</motion.div>
													</div>
													<div className="flex gap-2">
														{isImageFile(
															receipt
														) && (
															<div className="w-full">
																<CustomButton
																	buttonVariant="solid"
																	buttonSolidColor="var(--color-accent-medium)"
																	buttonLabel={
																		<>
																			{isLoading ? (
																				<>
																					<span className="fa-solid fa-spinner fa-spin text-white" />
																				</>
																			) : (
																				<>
																					<div className="flex gap-2 items-center">
																						<span className="fa-solid fa-eye text-white" />
																						<span className="text-white text-[0.75rem]">
																							View
																						</span>
																					</div>
																				</>
																			)}
																		</>
																	}
																	buttonClick={() => {
																		setIsPreviewOpenLiquidate(
																			true
																		);
																		setImageName(
																			receipt
																		);
																	}}
																	isDisabled={
																		isLoading
																	}
																	isScaledOnHover={
																		false
																	}
																	isDarkendOnHover
																/>
															</div>
														)}
														<div className="w-full">
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
																	handleDownloadReceiptLiquidate(
																		receipt
																	)
																}
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
											</div>
										)
									)}
								</>
							) : (
								<>
									<div className="w-full opacity-50">
										No Attachment
									</div>
								</>
							)}
						</div>
					</div>
				</div>
				<div className="w-full mt-[-1rem] leading-tight">
					<CustomFileUpload
						files={newAttachmentsExpense}
						setFiles={setNewAttachmentsExpense}
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
						setIsCameraOpen={setIsCameraOpenExpense}
						isWithImageCapture
						inputId="input-file-expense"
						isMultiple={false}
					/>
				</div>
				{parseFloat(totalExcess) > 0 && (
					<>
						<div className="font-semibold text-gradient-soft text-[1.25rem] mt-4 mb-[-0.5rem] flex items-center gap-2">
							<span className="leading-none text-nowrap">
								EXCESS DETAILS
							</span>
							<div className="w-full h-[2px] min-h-[2px] bg-[var(--color-accent-medium)] rounded-sm" />
						</div>
						<div className="w-full">
							<CustomInput
								inputType="text"
								inputLabel="Total Amount of Excess"
								inputValue={
									"PHP " + parseFloat(totalExcess).toFixed(2)
								}
								isReadOnly
								isDisabled
							/>
						</div>
						<div className="w-full">
							<div className="w-full mb-4">
								<label className="font-semibold text-color flex">
									Current Return Attachments
								</label>
								<div className="w-full p-2 border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md flex flex-wrap gap-2">
									{excessAttachments.length > 0 ? (
										<>
											{excessAttachments.map(
												(receipt, index) => (
													<div
														key={receipt + index}
														className="p-2 bg-[var(--color-bg)] shadow-lift flex gap-4 items-center justify-between font-medium rounded-md min-w-[15.5rem] max-w-[15.5rem]"
													>
														<div className="w-full flex flex-col gap-2">
															<div className="flex justify-between">
																<span className="text-[0.9rem] truncate">
																	{receipt}
																</span>
																<motion.div
																	className="min-w-6 min-h-6 grid place-content-center rounded-full cursor-pointer"
																	whileHover={{
																		scale: 1.025,
																		background:
																			"var(--color-grey)",
																	}}
																	whileTap={{
																		scale: 0.95,
																	}}
																	onClick={() =>
																		handleDeleteAlertExcess(
																			receipt
																		)
																	}
																>
																	<span className="fa-solid fa-xmark text-[1rem]"></span>
																</motion.div>
															</div>
															<div className="flex gap-2">
																{isImageFile(
																	receipt
																) && (
																	<div className="w-full">
																		<CustomButton
																			buttonVariant="solid"
																			buttonSolidColor="var(--color-accent-medium)"
																			buttonLabel={
																				<>
																					{isLoading ? (
																						<>
																							<span className="fa-solid fa-spinner fa-spin text-white" />
																						</>
																					) : (
																						<>
																							<div className="flex gap-2 items-center">
																								<span className="fa-solid fa-eye text-white" />
																								<span className="text-white text-[0.75rem]">
																									View
																								</span>
																							</div>
																						</>
																					)}
																				</>
																			}
																			buttonClick={() => {
																				setIsPreviewOpenReturn(
																					true
																				);
																				setImageName(
																					receipt
																				);
																			}}
																			isDisabled={
																				isLoading
																			}
																			isScaledOnHover={
																				false
																			}
																			isDarkendOnHover
																		/>
																	</div>
																)}
																<div className="w-full">
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
																			handleDownloadReceiptReturn(
																				receipt
																			)
																		}
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
													</div>
												)
											)}
										</>
									) : (
										<>
											<div className="w-full opacity-50">
												No Attachment
											</div>
										</>
									)}
								</div>
							</div>
						</div>
						<div className="w-full mt-[-1rem] leading-tight">
							<CustomFileUpload
								files={newAttachmentsExcess}
								setFiles={setNewAttachmentsExcess}
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
								setIsCameraOpen={setIsCameraOpenExcess}
								inputId="input-file-excess"
								isWithImageCapture
								isMultiple={false}
							/>
						</div>
					</>
				)}
				<div className="font-semibold text-gradient-soft text-[1.25rem] mt-4 mb-[-0.25rem] flex items-center gap-2">
					<div className="w-full h-[2px] min-h-[2px] bg-[var(--color-accent-medium)] rounded-sm" />
				</div>
				<div className="w-full leading-tight">
					<CustomTextArea
						inputLabel="Remarks"
						inputNotes="Add an additonal note if needed. (Optional)"
						inputValue={additionalNotes}
						setInputValue={setAdditonalNotes}
					/>
				</div>
			</div>
			<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex flex-col sm:flex-row gap-2 bg-[var(--color-bg)]">
				<CustomButton
					buttonVariant="primary"
					buttonLabel="Confirm"
					buttonClick={handleCheckUpdate}
					isLoading={isLoadingRevise}
					isDisabled={isLoadingRevise}
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
				modalTitle="Revise Liquidated CA Request"
				modalTitleTWStyle="leading-none px-6"
				modalContent={modalContent}
			/>

			{/* EXPENSE DETAILS */}
			<CapturePhotoFullScreen
				isModalOpen={isCameraOpenExpense}
				setIsModalOpen={setIsCameraOpenExpense}
				setFiles={setNewAttachmentsExpense}
			/>
			<CustomAlertModal
				isModalOpen={isDeleteOpenExpense}
				modalButtonClick={() => setIsDeleteOpenExpense(false)}
				modalButtonConfirm={handleDeleteExpense}
				modalHeadline="Delete File?"
				modalMessage="Proceeding will delete the file/receipt"
				modalVariant="confirm"
			/>

			{/* EXCESS DETAILS */}
			<CapturePhotoFullScreen
				isModalOpen={isCameraOpenExcess}
				setIsModalOpen={setIsCameraOpenExcess}
				setFiles={setNewAttachmentsExcess}
			/>
			<CustomAlertModal
				isModalOpen={isDeleteOpenExcess}
				modalButtonClick={() => setIsDeleteOpenExcess(false)}
				modalButtonConfirm={handleDeleteExcess}
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

			<PreviewImageModal
				isModalOpen={isPreviewOpenDisburse}
				setIsModalOpen={setIsPreviewOpenDisburse}
				imageName={imageName}
				getImage={getDisbursementAttachmentImage}
			/>
			<PreviewImageModal
				isModalOpen={isPreviewOpenLiquidate}
				setIsModalOpen={setIsPreviewOpenLiquidate}
				imageName={imageName}
				getImage={getLiquidationAttachmentImage}
			/>
			<PreviewImageModal
				isModalOpen={isPreviewOpenReturn}
				setIsModalOpen={setIsPreviewOpenReturn}
				imageName={imageName}
				getImage={getReturnAttachmentImage}
			/>

			{/* NO REIMBURSEMENT TYPE */}
			<CustomAlertModal
				modalVariant="error"
				modalMessage="Please select at least one reimbursemnt type"
				isModalOpen={isNoExpense}
				modalButtonClick={() => setIsNoExpense(false)}
			/>

			{/* NO RECEIPTS */}
			<CustomAlertModal
				modalVariant="error"
				modalMessage="Please include at least one receipts"
				isModalOpen={isNoReceipts}
				modalButtonClick={() => setIsNoReceipts(false)}
			/>

			{/* REVISE REQUEST */}
			<CustomAlertModal
				isModalOpen={isReviseOpen}
				modalButtonClick={() => setIsReviseOpen(false)}
				modalButtonConfirm={handleReviseCARequest}
				modalHeadline="Revise the CA Request?"
				modalMessage="Proceeding will revise the cash advance request. Please ensure all entered data is correct."
				modalVariant="confirm"
			/>
			<CustomAlertModal
				modalVariant="success"
				modalMessage={fetchMessage}
				isModalOpen={isSuccessRevise}
				modalButtonClick={() => setIsSuccessRevise(false)}
			/>
			<CustomAlertModal
				modalVariant="error"
				modalMessage={fetchMessage}
				isModalOpen={isErrorRevise}
				modalButtonClick={() => setIsErrorRevise(false)}
			/>

			{/* CA REQUEST DETAILS */}
			<ReimbursementDetailsEditModal
				isModalOpen={isEditOpen}
				setIsModalOpen={setIsEditOpen}
				details={detailsToEdit}
				handleEdit={handleEditReceipt}
				setIsError={setIsErrorDetails}
				setFetchMessage={setFetchMessageDetails}
			/>

			{/* NO REIMBURSEMENT TYPE */}
			<CustomAlertModal
				modalVariant="error"
				modalMessage="Please select at least one reimbursemnt type"
				isModalOpen={isNoReimbursement}
				modalButtonClick={() => setIsNoReimbursement(false)}
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

export default CARequestListReviseModal;
