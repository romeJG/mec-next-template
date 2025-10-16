import { Fragment, useEffect, useRef, useState } from "react";
import CustomModalNoScroll from "../customs/CustomModalNoScroll";
import useUser from "../../apis/useUser";
import LoadingSpinner from "../animated/LoadingSpinner";
import CustomInput from "../customs/CustomInput";
import CustomButton from "../customs/CustomButton";
import CustomAlertModal from "../customs/CustomAlertModal";
import CustomCheckboxMenu2 from "../customs/CustomCheckboxMenu2";
import CustomCheckboxMenu3 from "../customs/CustomCheckboxMenu3";
import CheckboxMenuReusable from "../customs/CustomCheckboxMenuReusable";
import CustomCheckbox2 from "../customs/CustomCheckBox2";
import useDeviceSize from "../../hooks/useDeviceSize";

function UserManageProcessorModal({
	email,
	isModalOpen,
	setIsModalOpen,
	handleConfirm,
}) {
	// const user = JSON.parse(localStorage.getItem("user-info"));
	const { getDepartments, setReimbursementProcessor, getUsersByProcessor } =
		useUser();

	const { isMobile } = useDeviceSize();

	const [departments, setDepartments] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");

	const [isSelectedLoading, setIsSelectedLoading] = useState(false);
	const [isAssignLoading, setIsAssignLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const [fetchMessage, setFetchMessage] = useState("");

	const handleGetDepartments = () => {
		getDepartments(setDepartments, setIsLoading);
	};

	const handleAssignProcessor = () => {
		setReimbursementProcessor(
			email,
			selectedUsers,
			setIsAssignLoading,
			setIsSuccess,
			setIsError,
			setFetchMessage
		);
	};

	// Will get all the users under the Reimbursement Processor
	const handleGetUsersByApprover = () => {
		getUsersByProcessor(email, setSelectedUsers, setIsSelectedLoading);
	};

	const handleCancel = () => {
		setSearchQuery("");
		setIsModalOpen(false);
		setSelectedUsers([]);
	};

	const handleOk = () => {
		setIsSuccess(false);
		handleConfirm();
	};

	// For Searching
	const filteredDepartments = Object.keys(departments).reduce(
		(acc, department) => {
			const departmentMatches = department
				.toLowerCase()
				.includes(searchQuery.toLowerCase());

			const filteredUsers = departments[department].filter(
				(user) =>
					user.name
						.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					user.email
						.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					user.position
						.toLowerCase()
						.includes(searchQuery.toLowerCase())
			);

			if (departmentMatches || filteredUsers.length > 0) {
				acc[department] = filteredUsers;
			}

			return acc;
		},
		{}
	);

	useEffect(() => {
		if (isModalOpen) {
			setSelectedUsers([]);
		}
		handleGetDepartments();
		handleGetUsersByApprover();
	}, [isModalOpen]);

	useEffect(() => {
		if (isSuccess) {
			handleCancel();
		}
	}, [isSuccess]);

	const contentRef = useRef(null);
	const [isContentScrollable, setIsContentScrollable] = useState(true);
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
	}, [searchQuery, isModalOpen]);

	const modalContent = (
		<>
			<div
				// ref={contentRef}
				className="w-full h-full min-h-[15rem] pt-2 flex flex-col gap-2"
				// style={{
				// 	paddingRight: isContentScrollable ? "0.5rem" : "1.5rem",
				// }}
			>
				{isLoading || isSelectedLoading ? (
					<div className="w-full h-[12rem] grid place-content-center">
						<LoadingSpinner
							loadingSpinnerColor="var(--color-primary)"
							loadingSpinnerSize="4rem"
							loadingSpinnerWidth="0.5rem"
						/>
					</div>
				) : (
					<>
						<div className="w-full flex flex-col items-center px-6">
							<CustomInput
								inputType="search"
								inputPlaceHolder="Search..."
								inputLabelSize="0.85rem"
								inputValue={searchQuery}
								setInputValue={setSearchQuery}
							/>
							<div className="w-full h-[1px] max-h-[1px] bg-[var(--color-grey)] mt-2 rounded-full" />
						</div>
						<div className="w-full px-6 relative">
							<div className="w-[calc(100%-3rem)] absolute z-[91] pointer-events-none">
								<CustomButton
									buttonLabel={
										<div className="h-full flex gap-2 text-white leading-none items-center text-[0.85rem]">
											<span className="fa-solid fa-eye"></span>
											<span>View Selected Users</span>
										</div>
									}
									buttonVariant="solid"
									buttonHeight="2.5rem"
									buttonSolidColor="var(--color-primary)"
								/>
							</div>
							<div className="w-full z-[90]">
								<CheckboxMenuReusable
									label=""
									options={selectedUsers}
									selected={selectedUsers}
									setSelected={setSelectedUsers}
									isLoading={isSelectedLoading}
									renderCheckbox={(
										label,
										checked,
										onChange
									) => (
										<CustomCheckbox2
											label={label}
											checked={checked}
											onChange={onChange}
											customStyles={{
												checkbox: { width: "0.85rem" },
												label: { fontSize: "0.95rem" },
											}}
										/>
									)}
									renderSearchInput={(value, setValue) => (
										<CustomInput
											inputType="search"
											inputPlaceHolder="Search..."
											inputValue={value}
											setInputValue={setValue}
										/>
									)}
									renderLoading={() => (
										<LoadingSpinner
											loadingSpinnerColor="var(--color-primary)"
											loadingSpinnerWidth="0.25rem"
											loadingSpinnerSize="3rem"
										/>
									)}
								/>
							</div>
						</div>
						<div
							ref={contentRef}
							className="w-full flex flex-col pl-6 pb-4 gap-2 overflow-x-hidden overflow-y-auto"
							style={{
								paddingRight:
									isContentScrollable && !isMobile
										? "0.5rem"
										: "1.5rem",
							}}
						>
							{Object.keys(filteredDepartments).map(
								(department) => (
									<Fragment key={department}>
										<CustomCheckboxMenu3
											userEmail={email}
											checkboxLabel={department}
											checkboxContents={departments[
												department
											]
												.map((user) => ({
													label: user.name,
													value: user.email,
													reimbursement_processor:
														user.reimbursement_processor,
													department: user.department,
												}))
												.sort((a, b) =>
													a.label.localeCompare(
														b.label
													)
												)}
											selectedCheckboxes={selectedUsers}
											setSelectedCheckboxes={
												setSelectedUsers
											}
											isCheckboxLoading={
												isLoading || isSelectedLoading
											}
											mainSearchQuery={searchQuery}
										/>
									</Fragment>
								)
							)}
						</div>
						<div className="w-full flex px-6 pt-2 gap-2 border-t border-[var(--color-grey)]">
							<CustomButton
								buttonLabel="Confirm"
								buttonVariant="primary"
								buttonClick={handleAssignProcessor}
								isLoading={isAssignLoading}
								isDisabled={isAssignLoading}
							/>
							<CustomButton
								buttonLabel="Cancel"
								buttonVariant="bordered"
								buttonClick={handleCancel}
								isDisabled={isAssignLoading}
							/>
						</div>
					</>
				)}
			</div>
		</>
	);

	return (
		<>
			<CustomModalNoScroll
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				modalSize="sm"
				modalTitle="Manage Reimbursement Processor"
				modalTitleTWStyle="leading-none px-6"
				modalContent={modalContent}
			/>

			<CustomAlertModal
				isModalOpen={isSuccess}
				modalMessage={fetchMessage}
				modalVariant="success"
				modalButtonClick={handleOk}
			/>

			<CustomAlertModal
				isModalOpen={isError}
				modalMessage={fetchMessage}
				modalVariant="error"
				modalButtonClick={() => setIsError(false)}
			/>
		</>
	);
}

export default UserManageProcessorModal;
