import { useEffect, useRef, useState } from "react";
import CustomModalNoScroll from "../../customs/CustomModalNoScroll";
import CustomButton from "../../customs/CustomButton";
import CustomSelect from "../../customs/CustomSelect";
import CustomInput from "../../customs/CustomInput";
import { format, set } from "date-fns";
import BillsTable from "../audit_form/BillsTable";
import CoinsTable from "../audit_form/CoinsTable";
import ReceiptsTable from "../audit_form/ReceiptsTable";
import NotReplenishedTable from "../audit_form/NotReplenishedTable";
import AuiditFormEditReceiptModal from "./AuiditFormEditReceiptModal";
import useAudit from "../../apis/useAudit";
import CustomAlertModal from "../../customs/CustomAlertModal";
import useDeviceSize from "../../../hooks/useDeviceSize";

function AuditEditFormModal({
	isModalOpen,
	setIsModalOpen,
	auditDetails,
	handleFetch,
}) {
	const { getTotalDisburseAndReplenished, updatePettyCashAudit } = useAudit();

	const { isMobile } = useDeviceSize();

	const today = new Date();
	const [dateFrom, setDateFrom] = useState(today);
	const [dateTo, setDateTo] = useState(today);

	// UPDATE
	const [isUpdateAlertOpen, setIsUpdateAlertOpen] = useState(false);
	const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
	const [isSuccessUpdate, setIsSuccessUpdate] = useState(false);
	const [isErrorUpdate, setIsErrorUpdate] = useState(false);
	const [fetchMessageUpdate, setFetchMessageUpdate] = useState("");

	// SUMMARY
	const [disbursement, setDisbursement] = useState(0);
	const [replenishment, setReplenishment] = useState(0);
	const [pendingReplenishment, setPendingReplenishment] = useState(0);
	const [runningBalance, setRunningBalance] = useState(0);
	const [isLoadingSummary, setIsLoadingSummary] = useState(false);
	const [isSuccessSummary, setIsSuccessSummary] = useState(false);
	const [isErrorSummary, setIsErrorSummary] = useState(false);
	const [fetchMessageSummary, setFetchMessageSummary] = useState("");
	const [notReplenished, setNotReplenished] = useState([]);
	const [notReimbursed, setNotReimbursed] = useState([]);

	// CASH ON HAND
	// Bills
	const [bill1000Quantity, setBill1000Quantity] = useState(0);
	const [bill500Quantity, setBill500Quantity] = useState(0);
	const [bill200Quantity, setBill200Quantity] = useState(0);
	const [bill100Quantity, setBill100Quantity] = useState(0);
	const [bill50Quantity, setBill50Quantity] = useState(0);
	const [bill20Quantity, setBill20Quantity] = useState(0);
	const [totalAmountBills, setTotalAmountBills] = useState(0);
	// Coins
	const [coin20Quantity, setCoin20Quantity] = useState(0);
	const [coin10Quantity, setCoin10Quantity] = useState(0);
	const [coin5Quantity, setCoin5Quantity] = useState(0);
	const [coin1Quantity, setCoin1Quantity] = useState(0);
	const [coin025Quantity, setCoin025Quantity] = useState(0);
	const [coin010Quantity, setCoin010Quantity] = useState(0);
	const [coin005Quantity, setCoin005Quantity] = useState(0);
	const [coin001Quantity, setCoin001Quantity] = useState(0);
	const [totalAmountCoins, setTotalAmountCoins] = useState(0);

	const [bills, setBills] = useState([]);
	const [coins, setCoins] = useState([]);

	// RECEIPTS
	const [requests, setRequests] = useState([]);
	const [totalAmountReceipts, setTotalAmountReceipts] = useState(0);
	// const [notReplenished, setNotReplenished] = useState([]);
	const [totalNotReplenished, setTotalNotReplenished] = useState(0);
	// EDIT RECEIPT
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [receiptDetails, setReceiptDetails] = useState([]);

	// RECONCILIATION
	const [totalPendingClaims, setTotalPendingClaims] = useState(0);
	const [totalCashOverShort, setTotalCashOverShort] = useState(0);

	const handleGetDisbursedAndReplenished = async () => {
		let custodian = auditDetails.custodian
			? JSON.parse(auditDetails.custodian)[0]
			: "";
		await getTotalDisburseAndReplenished(
			custodian,
			format(dateFrom, "yyyy-MM-dd"),
			format(dateTo, "yyyy-MM-dd"),
			setDisbursement,
			setReplenishment,
			setRequests,
			setNotReplenished,
			setNotReimbursed,
			setIsLoadingSummary,
			setIsErrorSummary,
			setIsSuccessSummary,
			setFetchMessageSummary
		);
	};

	const handleUpdatePettyCashAudit = async () => {
		setIsUpdateAlertOpen(false);
		await updatePettyCashAudit(
			auditDetails.audit_id,
			format(dateFrom, "yyyy-MM-dd"),
			format(dateTo, "yyyy-MM-dd"),
			parseFloat(auditDetails.initial_balance),
			disbursement,
			replenishment,
			pendingReplenishment,
			runningBalance,
			bills,
			coins,
			totalAmountBills,
			totalAmountCoins,
			totalAmountBills + totalAmountCoins,
			requests,
			totalAmountReceipts,
			notReplenished,
			totalNotReplenished,
			notReimbursed,
			totalPendingClaims,
			totalNotReplenished + totalPendingClaims,
			totalCashOverShort,
			setIsLoadingUpdate,
			setIsErrorUpdate,
			setIsSuccessUpdate,
			setFetchMessageUpdate
		);
	};

	const handleClose = () => {
		setIsModalOpen(false);
		setIsEditModalOpen(false);
		setIsUpdateAlertOpen(false);
		setIsSuccessSummary(false);
		setIsSuccessUpdate(false);
		setIsErrorSummary(false);
		setIsErrorUpdate(false);
		setFetchMessageSummary("");
		setFetchMessageUpdate("");
	};

	useEffect(() => {
		if (isSuccessUpdate) {
			handleClose();
			handleFetch();
		}
	}, [isSuccessUpdate]);

	// SET VALUES FROM SELECTED AUDIT HISTORY
	useEffect(() => {
		if (isModalOpen) {
			let bills = auditDetails.bills
				? JSON.parse(auditDetails.bills)
				: [];
			let coins = auditDetails.coins
				? JSON.parse(auditDetails.coins)
				: [];
			let receipts = auditDetails.receipts
				? JSON.parse(auditDetails.receipts)
				: [];
			let notReplenished = auditDetails.not_replenished
				? JSON.parse(auditDetails.not_replenished)
				: [];
			let notReimbursed = auditDetails.not_reimbursed
				? JSON.parse(auditDetails.not_reimbursed)
				: [];
			let dateFrom = auditDetails.date_from
				? format(auditDetails.date_from, "MM/dd/yyyy")
				: today;
			let dateTo = auditDetails.date_to
				? format(auditDetails.date_to, "MM/dd/yyyy")
				: today;

			setDateFrom(new Date(dateFrom));
			setDateTo(new Date(dateTo));
			setDisbursement(
				auditDetails.disbursement
					? parseFloat(auditDetails.disbursement)
					: 0
			);
			setReplenishment(
				auditDetails.replenishment
					? parseFloat(auditDetails.replenishment)
					: 0
			);

			setBills(bills);
			setCoins(coins);
			setBill1000Quantity(bills[0].quantity);
			setBill500Quantity(bills[1].quantity);
			setBill200Quantity(bills[2].quantity);
			setBill100Quantity(bills[3].quantity);
			setBill50Quantity(bills[4].quantity);
			setBill20Quantity(bills[5].quantity);
			setCoin20Quantity(coins[0].quantity);
			setCoin10Quantity(coins[1].quantity);
			setCoin5Quantity(coins[2].quantity);
			setCoin1Quantity(coins[3].quantity);
			setCoin025Quantity(coins[4].quantity);
			setCoin010Quantity(coins[5].quantity);
			setCoin005Quantity(coins[6].quantity);
			setCoin001Quantity(coins[7].quantity);

			setRequests(receipts);
			setTotalAmountReceipts(auditDetails.total_receipts);
			setNotReplenished(notReplenished);
			setNotReimbursed(notReimbursed);
			setTotalNotReplenished(auditDetails.total_not_replenished);
			setTotalPendingClaims(auditDetails.previous_claims);
			setTotalCashOverShort(auditDetails.cash_over_short);
		}
	}, [isModalOpen]);

	// SUMMARY
	useEffect(() => {
		let initialBalance = auditDetails.initial_balance
			? parseFloat(auditDetails.initial_balance)
			: 0;
		let totalPending = parseFloat(disbursement) - parseFloat(replenishment);
		let totalBalance =
			parseFloat(initialBalance) -
			parseFloat(disbursement) +
			parseFloat(replenishment);

		setPendingReplenishment(totalPending);
		setRunningBalance(totalBalance);
	}, [disbursement, replenishment]);

	// RECONCILIATION
	useEffect(() => {
		let initialBalance = auditDetails.initial_balance
			? parseFloat(auditDetails.initial_balance)
			: 0;
		let totalCashOnHand =
			parseFloat(totalAmountBills) + parseFloat(totalAmountCoins);
		let total =
			parseFloat(totalCashOnHand) +
			parseFloat(totalNotReplenished) -
			parseFloat(initialBalance);

		let notReimburseTotal = 0;
		notReimbursed.forEach((request) => {
			notReimburseTotal += parseFloat(request.total_expense);
		});

		setTotalPendingClaims(notReimburseTotal);
		setTotalCashOverShort(total);
	}, [
		totalAmountReceipts,
		totalNotReplenished,
		totalAmountBills,
		totalAmountCoins,
		notReimbursed,
	]);

	useEffect(() => {
		setBills([
			{
				bill: 1000,
				quantity: bill1000Quantity,
				amount: bill1000Quantity * 1000,
			},
			{
				bill: 500,
				quantity: bill500Quantity,
				amount: bill500Quantity * 500,
			},
			{
				bill: 200,
				quantity: bill200Quantity,
				amount: bill200Quantity * 200,
			},
			{
				bill: 100,
				quantity: bill100Quantity,
				amount: bill100Quantity * 100,
			},
			{
				bill: 50,
				quantity: bill50Quantity,
				amount: bill50Quantity * 50,
			},
			{
				bill: 20,
				quantity: bill20Quantity,
				amount: bill20Quantity * 20,
			},
		]);
	}, [
		bill1000Quantity,
		bill500Quantity,
		bill200Quantity,
		bill100Quantity,
		bill50Quantity,
		bill20Quantity,
	]);

	useEffect(() => {
		setCoins([
			{
				coin: 20,
				quantity: coin20Quantity,
				amount: coin20Quantity * 20,
			},
			{
				coin: 10,
				quantity: coin10Quantity,
				amount: coin10Quantity * 10,
			},
			{
				coin: 5,
				quantity: coin5Quantity,
				amount: coin5Quantity * 5,
			},
			{
				coin: 1,
				quantity: coin1Quantity,
				amount: coin1Quantity * 1,
			},
			{
				coin: 0.25,
				quantity: coin025Quantity,
				amount: coin025Quantity * 0.25,
			},
			{
				coin: 0.1,
				quantity: coin010Quantity,
				amount: coin010Quantity * 0.1,
			},
			{
				coin: 0.05,
				quantity: coin005Quantity,
				amount: coin005Quantity * 0.05,
			},
			{
				coin: 0.01,
				quantity: coin001Quantity,
				amount: coin001Quantity * 0.01,
			},
		]);
	}, [
		coin20Quantity,
		coin10Quantity,
		coin5Quantity,
		coin1Quantity,
		coin025Quantity,
		coin010Quantity,
		coin005Quantity,
		coin001Quantity,
	]);

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
				<div className="w-full flex flex-col lg:grid grid-cols-2 gap-4">
					<CustomInput
						inputType="text"
						inputLabel="Reimbursement Processor"
						inputValue={
							auditDetails.custodian
								? JSON.parse(auditDetails.custodian)[1]
								: ""
						}
						isReadOnly
						isDisabled
					/>
					<CustomInput
						inputType="text"
						inputLabel="Department"
						inputValue={
							auditDetails.department
								? auditDetails.department
								: ""
						}
						isReadOnly
						isDisabled
					/>
				</div>
				<div className="w-full flex flex-col lg:grid grid-cols-2 gap-4">
					<CustomInput
						inputType="date"
						inputLabel="Coverage Period - From"
						inputValue={dateFrom}
						setInputValue={setDateFrom}
					/>
					<CustomInput
						inputType="date"
						inputLabel="Coverage Period - To"
						inputValue={dateTo}
						setInputValue={setDateTo}
					/>
				</div>
				<div className="font-semibold text-gradient-soft text-[1.25rem] mt-4 mb-[-0.5rem] flex items-center gap-2">
					<span className="leading-none text-nowrap">SUMMARY</span>
					<div className="w-full h-[2px] min-h-[2px] bg-[var(--color-accent-medium)] rounded-sm" />
				</div>

				<div className="w-full flex flex-col-reverse lg:flex-row gap-2 items-end">
					<CustomInput
						inputType="text"
						inputLabel="Initial Balance"
						inputValue={
							"PHP " +
							(auditDetails.initial_balance
								? parseFloat(
										auditDetails.initial_balance
								  ).toLocaleString("en-US", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
								  })
								: "0.00")
						}
						isLoading={isLoadingSummary}
						isDisabled
						isReadOnly
					/>
					<div className="w-full lg:w-[12rem]">
						<CustomButton
							buttonVariant="solid"
							buttonLabel={
								<>
									<div className="flex gap-2 text-white items-center">
										<span className="fa-solid fa-calculator"></span>
										<span className="font-semibold">
											Calculate
										</span>
									</div>
								</>
							}
							buttonSolidColor="var(--color-primary)"
							buttonHeight="2.6rem"
							isDarkendOnHover
							isScaledOnHover={false}
							buttonClick={handleGetDisbursedAndReplenished}
							isLoading={isLoadingSummary}
							isDisabled={isLoadingSummary}
						/>
					</div>
				</div>
				<div className="w-full flex flex-col lg:grid grid-cols-2 gap-4">
					<CustomInput
						inputType="text"
						inputLabel="Disbursement"
						inputValue={
							"PHP " +
							disbursement.toLocaleString("en-US", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})
						}
						isDisabled
						isReadOnly
						isLoading={isLoadingSummary}
					/>
					<CustomInput
						inputType="text"
						inputLabel="Replenishment"
						inputValue={
							"PHP " +
							replenishment.toLocaleString("en-US", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})
						}
						isDisabled
						isReadOnly
						isLoading={isLoadingSummary}
					/>
				</div>
				<div className="w-full flex flex-col lg:grid grid-cols-2 gap-4">
					<CustomInput
						inputType="text"
						inputLabel="Pending for Replenishment"
						inputValue={
							"PHP " +
							pendingReplenishment.toLocaleString("en-US", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})
						}
						isDisabled
						isReadOnly
						isLoading={isLoadingSummary}
					/>
					<CustomInput
						inputType="text"
						inputLabel="Running Balance"
						inputValue={
							"PHP " +
							(isNaN(runningBalance)
								? "0.00"
								: parseFloat(runningBalance).toLocaleString(
										"en-US",
										{
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
										}
								  ))
						}
						isDisabled
						isReadOnly
						isLoading={isLoadingSummary}
					/>
				</div>
				<div className="font-semibold text-gradient-soft text-[1.25rem] mt-4 mb-[-0.5rem] flex items-center gap-2">
					<span className="leading-none text-nowrap">
						CASH ON HAND
					</span>
					<div className="w-full h-[2px] min-h-[2px] bg-[var(--color-accent-medium)] rounded-sm" />
				</div>
				<label className="font-semibold text-color flex mb-[-0.5rem]">
					Manage Cash on Hand
				</label>
				<BillsTable
					bill1000Quantity={bill1000Quantity}
					setBill1000Quantity={setBill1000Quantity}
					bill500Quantity={bill500Quantity}
					setBill500Quantity={setBill500Quantity}
					bill200Quantity={bill200Quantity}
					setBill200Quantity={setBill200Quantity}
					bill100Quantity={bill100Quantity}
					setBill100Quantity={setBill100Quantity}
					bill50Quantity={bill50Quantity}
					setBill50Quantity={setBill50Quantity}
					bill20Quantity={bill20Quantity}
					setBill20Quantity={setBill20Quantity}
					setTotalAmountBills={setTotalAmountBills}
				/>
				<div className="w-full mt-[-0.25rem]">
					<CoinsTable
						coin20Quantity={coin20Quantity}
						setCoin20Quantity={setCoin20Quantity}
						coin10Quantity={coin10Quantity}
						setCoin10Quantity={setCoin10Quantity}
						coin5Quantity={coin5Quantity}
						setCoin5Quantity={setCoin5Quantity}
						coin1Quantity={coin1Quantity}
						setCoin1Quantity={setCoin1Quantity}
						coin025Quantity={coin025Quantity}
						setCoin025Quantity={setCoin025Quantity}
						coin010Quantity={coin010Quantity}
						setCoin010Quantity={setCoin010Quantity}
						coin005Quantity={coin005Quantity}
						setCoin005Quantity={setCoin005Quantity}
						coin001Quantity={coin001Quantity}
						setCoin001Quantity={setCoin001Quantity}
						setTotalAmountCoins={setTotalAmountCoins}
					/>
				</div>

				<div className="w-full flex flex-col sm:flex-row sm:justify-end sm:items-center gap-1 sm:gap-2 p-2 border rounded-md border-[var(--color-grey)] mt-[-0.25rem]">
					<label className="leading-none text-color font-semibold">
						Total Cash On Hand:
					</label>
					<div className="min-w-[7rem]">
						<CustomInput
							inputType="text"
							inputValue={
								"PHP " +
								(
									totalAmountBills + totalAmountCoins
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

				<div className="font-semibold text-gradient-soft text-[1.25rem] mt-4 mb-[-0.5rem] flex items-center gap-2">
					<span className="leading-none text-nowrap">RECEIPTS</span>
					<div className="w-full h-[2px] min-h-[2px] bg-[var(--color-accent-medium)] rounded-sm" />
				</div>
				<label className="font-semibold text-color flex mb-[-0.5rem]">
					Manage Receipts
				</label>
				<ReceiptsTable
					requests={requests}
					totalAmountReceipts={totalAmountReceipts}
					setTotalAmountReceipts={setTotalAmountReceipts}
					setIsEditModalOpen={setIsEditModalOpen}
					setSelectedReceiptOutside={setReceiptDetails}
					isForPage={false}
					fetchReceipts={handleGetDisbursedAndReplenished}
				/>
				<label className="font-semibold text-color inline-block leading-tight mb-[-0.5rem]">
					Receipts for Request Not Yet Replenished
				</label>
				<NotReplenishedTable
					requests={notReplenished}
					totalAmountReceipts={totalNotReplenished}
					setTotalAmountReceipts={setTotalNotReplenished}
					setIsEditModalOpen={setIsEditModalOpen}
					setSelectedReceiptOutside={setReceiptDetails}
					isForPage={false}
					fetchReceipts={handleGetDisbursedAndReplenished}
				/>
				<div className="font-semibold text-gradient-soft text-[1.25rem] mt-4 mb-[-0.5rem] flex items-center gap-2">
					<span className="leading-none text-nowrap">
						RECONCILIATION
					</span>
					<div className="w-full h-[2px] min-h-[2px] bg-[var(--color-accent-medium)] rounded-sm" />
				</div>
				<label className="font-semibold text-color inline-block mb-[-0.5rem]">
					Manage Reconciliation
				</label>
				<div className="w-full flex justify-end items-center gap-2 p-2 border rounded-md border-[var(--color-grey)]">
					<div className="w-full flex flex-col gap-2">
						<div className="w-full flex flex-col sm:flex-row sm:justify-end sm:items-center gap-1 sm:gap-2">
							<label className="leading-none text-color sm:text-right font-semibold">
								Previous claims submitted but not yet
								reimbursed:
							</label>
							<div className="min-w-[10rem]">
								<CustomInput
									inputType="text"
									inputValue={
										"PHP " +
										parseFloat(
											totalPendingClaims
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
						{/* Total (Receipts + Pending Claims) */}
						<div className="w-full flex flex-col sm:flex-row sm:justify-end sm:items-center gap-1 sm:gap-2">
							<label className="leading-none text-color sm:text-right font-semibold">
								Total:
							</label>
							<div className="min-w-[10rem]">
								<CustomInput
									inputType="text"
									inputValue={
										"PHP " +
										(
											parseFloat(totalNotReplenished) +
											parseFloat(totalPendingClaims)
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
						{/* Cash (Over) Short */}
						<div className="w-full flex flex-col sm:flex-row sm:justify-end sm:items-center gap-1 sm:gap-2">
							<label className="leading-none text-color sm:text-right font-semibold">
								Cash (Over) Short:
							</label>
							<div className="min-w-[10rem]">
								<CustomInput
									inputType="text"
									inputValue={
										"PHP " +
										parseFloat(
											totalCashOverShort
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
				</div>
			</div>

			<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
				<CustomButton
					buttonVariant="primary"
					buttonLabel="Update"
					buttonClick={() => setIsUpdateAlertOpen(true)}
					isLoading={isLoadingUpdate}
					isDisabled={isLoadingUpdate}
				/>
				<CustomButton
					buttonVariant="bordered"
					buttonLabel="Cancel"
					buttonClick={() => setIsModalOpen(false)}
					isDisabled={isLoadingUpdate}
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
				modalTitle="Edit Petty Cash Audit Form"
				modalTitleTWStyle="leading-none px-6"
				modalContent={modalContent}
			/>

			<AuiditFormEditReceiptModal
				isModalOpen={isEditModalOpen}
				setIsModalOpen={setIsEditModalOpen}
				receipt_details={receiptDetails}
				fetchReceipts={handleGetDisbursedAndReplenished}
				audit_id={auditDetails.audit_id ? auditDetails.audit_id : ""}
			/>

			{/* UPDATE */}
			<CustomAlertModal
				isModalOpen={isUpdateAlertOpen}
				modalButtonClick={() => setIsUpdateAlertOpen(false)}
				modalButtonConfirm={handleUpdatePettyCashAudit}
				modalHeadline="Confirm Update?"
				modalMessage="Proceeding will update/apply the details you modified"
				modalVariant="confirm"
			/>
			<CustomAlertModal
				modalVariant="success"
				modalMessage={fetchMessageUpdate}
				isModalOpen={isSuccessUpdate}
				modalButtonClick={() => setIsSuccessUpdate(false)}
			/>
			<CustomAlertModal
				modalVariant="error"
				modalMessage={fetchMessageUpdate}
				isModalOpen={isErrorUpdate}
				modalButtonClick={() => setIsErrorUpdate(false)}
			/>
		</>
	);
}

export default AuditEditFormModal;
