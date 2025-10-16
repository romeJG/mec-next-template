import { useEffect, useRef, useState } from "react";
import CustomModalNoScroll from "../customs/CustomModalNoScroll";
import CustomInput from "../customs/CustomInput";
import CustomButton from "../customs/CustomButton";
import useUser from "../../apis/useUser";
import LoadingSpinner from "../animated/LoadingSpinner";
import CustomAlertModal from "../customs/CustomAlertModal";
import useDeviceSize from "../../hooks/useDeviceSize";

function ProfilePaymentSettingsModal({
	isModalOpen,
	setIsModalOpen,
	handleGetPaymentDetails,
}) {
	const { updateUserPaymentDetails, getUserPaymentDetails } = useUser();
	const { isMobile } = useDeviceSize();
	const user = JSON.parse(localStorage.getItem("user-info"));

	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const [fetchMessage, setFetchMessage] = useState("");
	const [bdoName, setBdoName] = useState("");
	const [bdoNumber, setBdoNumber] = useState("");
	const [gcashName, setGcashName] = useState("");
	const [gcashNumber, setGcashNumber] = useState("");

	const [isSettingsLoading, setIsSettingsLoading] = useState(false);
	const [profileSettings, setProfileSettings] = useState([]);

	const handleUpdatePaymentSettings = async (e) => {
		e.preventDefault();
		await updateUserPaymentDetails(
			user.user_creds.email,
			bdoName,
			bdoNumber,
			gcashName,
			gcashNumber,
			setIsLoading,
			setIsSuccess,
			setIsError,
			setFetchMessage
		);
	};

	const handleGetPaymentDetailsB = async () => {
		await getUserPaymentDetails(
			user.user_creds.email,
			setIsSettingsLoading,
			setProfileSettings
		);
	};

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
		setBdoName(profileSettings.bdo_name || "");
		setBdoNumber(profileSettings.bdo_number || "");
		setGcashName(profileSettings.gcash_name || "");
		setGcashNumber(profileSettings.gcash_number || "");
	}, [profileSettings]);

	useEffect(() => {
		if (isSuccess || isModalOpen) {
			handleGetPaymentDetailsB();
			setBdoName("");
			setBdoNumber("");
			setGcashName("");
			setGcashNumber("");
		}
	}, [isSuccess, isModalOpen]);

	useEffect(() => {
		if (isSuccess) {
			setIsModalOpen(false);
			handleGetPaymentDetails();
		}
	}, [isSuccess]);

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
				{isSettingsLoading ? (
					<div className="w-full h-[12rem] grid place-content-center">
						<LoadingSpinner
							loadingSpinnerColor="var(--color-primary)"
							loadingSpinnerWidth="0.5rem"
							loadingSpinnerSize="4rem"
						/>
					</div>
				) : (
					<form className="grid grid-col-1 lg:grid-cols-2 gap-4">
						<div className="flex flex-col gap-4">
							<CustomInput
								inputType="text"
								inputLabel={
									<span className="mb-1">
										BDO Account Name
									</span>
								}
								inputPlaceHolder="Enter BDO account name"
								inputValue={bdoName}
								setInputValue={setBdoName}
							/>
							<CustomInput
								inputType="text"
								inputLabel={
									<span className="mb-1">
										BDO Account Number
									</span>
								}
								inputPlaceHolder="Enter BDO account number"
								inputValue={bdoNumber}
								setInputValue={setBdoNumber}
							/>
						</div>
						<div className="flex flex-col gap-4">
							<CustomInput
								inputType="text"
								inputLabel={
									<span className="mb-1">GCash Name</span>
								}
								inputPlaceHolder="Enter GCash account name"
								inputValue={gcashName}
								setInputValue={setGcashName}
							/>
							<CustomInput
								inputType="text"
								inputLabel={
									<span className="mb-1">GCash Number</span>
								}
								inputPlaceHolder="Enter GCash account number"
								inputValue={gcashNumber}
								setInputValue={setGcashNumber}
							/>
						</div>
					</form>
				)}
			</div>

			<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
				<CustomButton
					buttonVariant="primary"
					buttonLabel="Confirm"
					buttonClick={handleUpdatePaymentSettings}
					isLoading={isLoading}
					isDisabled={isLoading}
				/>
				<CustomButton
					buttonVariant="bordered"
					buttonLabel="Cancel"
					buttonClick={() => setIsModalOpen(false)}
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
				modalContent={modalContent}
				modalTitle="Edit Payment Settings"
				modalTitleTWStyle="leading-none px-6"
				isCloseable
			/>

			<CustomAlertModal
				isModalOpen={isError}
				modalVariant="error"
				modalMessage={fetchMessage}
				modalButtonClick={() => setIsError(false)}
			/>
			<CustomAlertModal
				isModalOpen={isSuccess}
				modalVariant="success"
				modalMessage={fetchMessage}
				modalButtonClick={() => setIsSuccess(false)}
			/>
		</>
	);
}

export default ProfilePaymentSettingsModal;
