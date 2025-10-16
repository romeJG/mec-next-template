import { useEffect, useRef, useState } from "react";
import CustomModalNoScroll from "../../customs/CustomModalNoScroll";
import { format } from "date-fns";
import CustomFileUpload from "../../customs/CustomFileUpload";
import CustomButton from "../../customs/CustomButton";
import CustomTextArea from "../../customs/CustomTextArea";
import CapturePhotoModal from "./CapturePhotoModal";
import CustomAlertModal from "../../customs/CustomAlertModal";
import useReplenishment from "../../apis/useReplenishment";
import CapturePhotoFullScreen from "./CapturePhotoFullScreen";
import useDeviceSize from "../../../hooks/useDeviceSize";

function CAReplenishmentModal({
	selectedRequests,
	isModalOpen,
	setIsModalOpen,
	handleGetAllRequest,
	dateFrom,
	dateTo,
	selectedProcessor,
}) {
	const { postCAReplenishment } = useReplenishment();
	const userInfo = JSON.parse(localStorage.getItem("user-info"));
	const { isMobile } = useDeviceSize();

	// Calculating the Overall Total of Expense
	const [overallTotal, setOverallTotal] = useState(0);
	const calculateTotalExpense = () => {
		let total = 0;
		for (let i = 0; i < selectedRequests.length; i++) {
			if (selectedRequests[i].total_expense) {
				total += parseFloat(selectedRequests[i].total_expense);
			}
		}
		setOverallTotal(total);
	};

	const [requestNumbers, setRequestNumbers] = useState([]);
	const handleListRequestNumbers = () => {
		let arr = [];
		for (let i = 0; i < selectedRequests.length; i++) {
			arr.push(selectedRequests[i].ref_number);
		}
		setRequestNumbers(arr);
	};

	// Attachment
	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const [files, setFiles] = useState([]);
	const [notes, setNotes] = useState("");

	// Replenishment
	const [isLoadingReplenish, setIsLoadingReplenish] = useState(false);
	const [isErrorReplenish, setIsErrorReplenish] = useState(false);
	const [isSuccessReplenish, setIsSuccessReplenish] = useState(false);
	const [fetchMessageReplenish, setFetchMessageReplenish] = useState("");

	// const today = new Date();

	const handleReplenishRequests = () => {
		if (files.length === 0) {
			setIsErrorReplenish(true);
			setFetchMessageReplenish("Please upload an attachement");
			return;
		}
		postCAReplenishment(
			userInfo.user_creds.email,
			userInfo.user_creds.name,
			format(dateFrom, "yyyy-MM-dd"),
			format(dateTo, "yyyy-MM-dd"),
			overallTotal,
			requestNumbers,
			files,
			notes,
			selectedProcessor,
			setIsLoadingReplenish,
			setIsSuccessReplenish,
			setIsErrorReplenish,
			setFetchMessageReplenish
		);
	};

	const handleCancel = () => {
		setFiles([]);
		setNotes("");
		setIsModalOpen(false);
	};

	useEffect(() => {
		if (isModalOpen) {
			calculateTotalExpense();
			handleListRequestNumbers();
		}
	}, [isModalOpen]);

	useEffect(() => {
		if (isSuccessReplenish) {
			handleCancel();
			handleGetAllRequest();
		}
	}, [isSuccessReplenish]);

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
	}, [isModalOpen, isContentScrollable]);

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
				<span className="font-semibold">
					{selectedRequests.length > 1
						? "List of CA Requests for Replenishments"
						: "List of CA Request for Replenishment"}
				</span>
				<div className="w-full p-2 rounded-md border border-[var(--color-grey)] mt-[-0.5rem]">
					<div
						className="w-full overflow-x-auto"
						// ref={contentRef}
					>
						<table className="w-full relative">
							<thead className="w-full">
								<tr className="leading-none text-left bg-[var(--color-bg-secondary)]">
									<th className="p-1 py-3 border border-[var(--color-grey)] bg-[var(--color-bg-secondary)] sticky top-0">
										Reference Number
									</th>
									<th className="p-1 border border-[var(--color-grey)] bg-[var(--color-bg-secondary)] sticky top-0">
										Requestor
									</th>
									<th className="p-1 border border-[var(--color-grey)] bg-[var(--color-bg-secondary)] sticky top-0">
										Application Date
									</th>
									<th className="p-1 border border-[var(--color-grey)] bg-[var(--color-bg-secondary)] sticky top-0">
										Disbursement Date
									</th>
									<th className="p-1 border border-[var(--color-grey)] bg-[var(--color-bg-secondary)] sticky top-0">
										Liquidation Date
									</th>
									<th className="p-1 border border-[var(--color-grey)] min-w-[10rem] bg-[var(--color-bg-secondary)] sticky top-0 right-0 z-20">
										Total Expense
									</th>
								</tr>
							</thead>
							<tbody className="w-full">
								{selectedRequests.map((request) => (
									<tr key={request.ref_number}>
										<td className="p-1 border border-[var(--color-grey)] min-w-[11rem]">
											{request.ref_number}
										</td>
										<td className="p-1 border border-[var(--color-grey)] min-w-[12rem] text-nowrap">
											{request.fullname}
										</td>
										<td className="p-1 border border-[var(--color-grey)] min-w-[10rem]">
											{request.application_date
												? format(
														request.application_date,
														"MM/dd/yyyy"
												  )
												: "--"}
										</td>
										<td className="p-1 border border-[var(--color-grey)] min-w-[12rem]">
											{request.disbursement_date
												? format(
														request.disbursement_date,
														"MM/dd/yyyy"
												  )
												: "--"}
										</td>
										<td className="p-1 border border-[var(--color-grey)] min-w-[12rem]">
											{request.liquidation_date
												? format(
														request.liquidation_date,
														"MM/dd/yyyy"
												  )
												: "--"}
										</td>
										<td className="p-1 border border-[var(--color-grey)] min-w-[10rem] bg-[var(--color-bg-secondary)] sticky right-0 z-10">
											PHP{" "}
											{request.total_expense
												? parseFloat(
														request.total_expense
												  ).toFixed(2)
												: "--"}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div
						className="w-full flex justify-end mt-2"
						style={{
							paddingRight: isContentScrollable ? "1rem" : "0",
						}}
					>
						<div className="font-semibold pr-1 opacity-75">
							Total:
						</div>
						<div className="font-bold">
							PHP {overallTotal.toFixed(2)}
						</div>
					</div>
				</div>

				<div className="w-full">
					<CustomFileUpload
						files={files}
						setFiles={setFiles}
						inputLabel="Replenishment Form"
						inputNotes="Please upload or capture the replenishment form"
						setIsCameraOpen={setIsCameraOpen}
						acceptedFileTypes={[
							"image/jpeg",
							"image/png",
							"image/gif",
							"text/csv",
							"application/pdf",
							"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
						]}
						isWithImageCapture
						isRequired
					/>
				</div>

				<div className="w-full leading-tight">
					<CustomTextArea
						inputLabel="Notes"
						inputNotes="Input some additional notes if needed. (Optional)"
						inputPlaceHolder="Type here..."
						inputValue={notes}
						setInputValue={setNotes}
					/>
				</div>
			</div>
			<div className="w-full flex px-6 pt-2 gap-2 border-t border-[var(--color-grey)]">
				<CustomButton
					buttonLabel="Confirm"
					buttonVariant="primary"
					buttonClick={handleReplenishRequests}
					isLoading={isLoadingReplenish}
					isDisabled={isLoadingReplenish}
				/>
				<CustomButton
					buttonLabel="Cancel"
					buttonVariant="bordered"
					buttonClick={handleCancel}
					isDisabled={isLoadingReplenish}
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
				modalTitle="Cash Advance Replenishment"
				modalTitleTWStyle="leading-none px-6"
				modalContent={modalContent}
				isCloseable
			/>

			<CapturePhotoFullScreen
				isModalOpen={isCameraOpen}
				setIsModalOpen={setIsCameraOpen}
				setFiles={setFiles}
			/>

			<CustomAlertModal
				isModalOpen={isErrorReplenish}
				modalButtonClick={() => setIsErrorReplenish(false)}
				modalVariant="error"
				modalMessage={fetchMessageReplenish}
			/>
			<CustomAlertModal
				isModalOpen={isSuccessReplenish}
				modalButtonClick={() => setIsSuccessReplenish(false)}
				modalVariant="success"
				modalMessage={fetchMessageReplenish}
			/>
		</>
	);
}

export default CAReplenishmentModal;
