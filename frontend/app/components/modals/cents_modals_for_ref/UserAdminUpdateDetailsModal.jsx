// import useConstants from "../../hooks/useConstants";
import user_init from "../../assets/user_init.png";
import CustomInput from "../customs/CustomInput";
import CustomToggleSwitch from "../customs/CustomToggleSwitch";
import { useEffect, useRef, useState } from "react";
import CustomButton from "../customs/CustomButton";
import CustomModalNoScroll from "../customs/CustomModalNoScroll";
import useUser from "../../apis/useUser";
import { AnimatePresence, motion } from "framer-motion";
import UserManageInitialApprover from "./UserManageInitialApprover";
import UserManageFinalApprover from "./UserManageFinalApprover";
// import CustomSelect from "../customs/CustomSelect";
import CustomSelectModalType from "../customs/CustomSelectModalType";
import UserManageProcessorModal from "./UserManageProcessorModal";
import useDeviceSize from "../../hooks/useDeviceSize";

function UserAdminUpdateDetailsModal({
	details,
	isModalOpen,
	setIsModalOpen,
	setIsSuccess,
	setIsError,
	setFetchMessage,
	handleGetUsers,
}) {
	// const { BACKEND_URL } = useConstants();
	const { updateUserDetails, getDepartments } = useUser();
	const { isMobile } = useDeviceSize();

	const [isLoading, setIsLoading] = useState(false);

	// Email Update for Inactive Users
	// const [email, setEmail] = useState("");

	// Role Access
	const [isAdminChecked, setIsAdminChecked] = useState(false);
	const [isRequestorChecked, setIsRequestorChecked] = useState(false);
	const [isInitialApproverChecked, setIsInitialApproverChecked] =
		useState(false);
	const [isFinalApproverChecked, setIsFinalApproverChecked] = useState(false);
	const [isProcessorChecked, setIsProcessorChecked] = useState(false);
	const [isPayablesChecked, setIsPayablesChecked] = useState(false);
	const [isPayrollChecked, setIsPayrollChecked] = useState(false);
	const [isAuditorChecked, setIsAuditorChecked] = useState(false);

	// Account Details
	const [fullname, setFullname] = useState("");
	const [position, setPosition] = useState("");
	const [department, setDepartment] = useState([]);
	const [departments, setDepartments] = useState([]);
	const [isDeptLoading, setIsDeptLoading] = useState(true);
	// const [roleAccess, setRoleAccess] = useState([]);

	// Manage Initial Approver
	const [isManageInitialOpen, setIsManageInitialOpen] = useState(false);

	// Manage Final Approver
	const [isManageFinalOpen, setIsManageFinalOpen] = useState(false);

	// Manage Reimbursement Processor
	const [isManageProcessorOpen, setIsManageProcessorOpen] = useState(false);

	const handleGetDepartments = () => {
		getDepartments(setDepartments, setIsDeptLoading);
	};

	// Sync the roles when the modal opens or when details change
	useEffect(() => {
		if (!details.role) return;
		const currentRoleAccess = details.role || [];

		setIsAdminChecked(currentRoleAccess.includes("admin"));
		setIsRequestorChecked(currentRoleAccess.includes("requestor"));
		setIsInitialApproverChecked(
			currentRoleAccess.includes("initial approver")
		);
		setIsFinalApproverChecked(currentRoleAccess.includes("final approver"));
		setIsProcessorChecked(
			currentRoleAccess.includes("reimbursement processor")
		);
		setIsPayablesChecked(currentRoleAccess.includes("payables"));
		setIsPayrollChecked(currentRoleAccess.includes("payroll"));
		setIsAuditorChecked(currentRoleAccess.includes("auditor"));

		setFullname(details.name);
		setPosition(details.position || "N/A");
		setDepartment(details.department || "N/A");
	}, [details.role, isModalOpen]);

	const handleConfirm = async () => {
		const updatedRoles = [];
		if (isAdminChecked) updatedRoles.push("admin");
		if (isRequestorChecked) updatedRoles.push("requestor");
		if (isInitialApproverChecked) updatedRoles.push("initial approver");
		if (isFinalApproverChecked) updatedRoles.push("final approver");
		if (isProcessorChecked) updatedRoles.push("reimbursement processor");
		if (isPayablesChecked) updatedRoles.push("payables");
		if (isPayrollChecked) updatedRoles.push("payroll");
		if (isAuditorChecked) updatedRoles.push("auditor");

		await updateUserDetails(
			details.email,
			fullname,
			position,
			department.value,
			updatedRoles,
			setIsLoading,
			setIsSuccess,
			setIsError,
			setFetchMessage
		);

		setIsModalOpen(false);
		handleGetUsers();
	};

	useEffect(() => {
		handleGetDepartments();
		// setEmail(details.email);
		setDepartment({
			label: details.department,
			value: details.department,
		});
	}, [isModalOpen]);

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
				<div className="w-full mt-2 mb-3 flex justify-center">
					<div className="w-[10rem] h-[10rem] rounded-xl border-[0.25rem] border-[var(--color-bg)] shadow-lift overflow-hidden">
						<img
							src={details.profileImage || user_init}
							alt="profile"
						/>
					</div>
				</div>

				<CustomInput
					inputType="text"
					inputLabel="Fullname"
					inputValue={fullname.toUpperCase()}
					setInputValue={setFullname}
				/>

				<div className="flex flex-col lg:flex-row gap-3">
					<CustomInput
						inputType="text"
						inputLabel="Email"
						inputValue={details.email}
						isReadOnly
						isDisabled
					/>
					<CustomInput
						inputType="text"
						inputLabel="Status"
						inputValue={
							details.status === 0
								? "Inactive"
								: details.status === 1
								? "Active"
								: details.status === 2
								? "Terminated"
								: "Locked"
						}
						isReadOnly
						isDisabled
					/>
				</div>

				<div className="flex flex-col lg:flex-row gap-3">
					<CustomInput
						inputType="text"
						inputLabel="Position"
						inputValue={position}
						setInputValue={setPosition}
					/>
					<div className="w-full lg:max-w-[calc(50%-0.5rem)]">
						<CustomSelectModalType
							selectLabel="Department"
							selectOptions={Object.keys(departments).map(
								(dept) => ({
									label: dept,
									value: dept,
								})
							)}
							selectedOption={department}
							setSelectedOption={setDepartment}
							isLoading={isDeptLoading}
						/>
					</div>
				</div>

				<div className="w-full">
					<label className="font-semibold text-color flex">
						Role Access
					</label>
					<div className="w-full border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md flex flex-col">
						<div className="w-full h-[2.5rem] border-b border-[var(--color-grey)] py-[0.375rem] px-3 flex justify-between items-center">
							<span className="leading-none">Admin</span>
							<CustomToggleSwitch
								isChecked={isAdminChecked}
								setIsChecked={setIsAdminChecked}
							/>
						</div>
						<div className="w-full h-[2.5rem] border-b border-[var(--color-grey)] py-[0.375rem] px-3 flex justify-between items-center">
							<span className="leading-none">Requestor</span>
							<CustomToggleSwitch
								isChecked={isRequestorChecked}
								setIsChecked={setIsRequestorChecked}
							/>
						</div>
						<div className="w-full h-[2.5rem] border-b border-[var(--color-grey)] py-[0.375rem] px-3 flex justify-between items-center">
							<span className="leading-none">
								Initial Approver
							</span>
							<div className="flex gap-3">
								<AnimatePresence exit>
									{isInitialApproverChecked && (
										<motion.div
											initial={{ x: -15, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											exit={{ x: -15, opacity: 0 }}
										>
											<CustomButton
												buttonVariant="solid"
												buttonLabel="Manage"
												buttonSolidColor="var(--color-tertiary)"
												buttonHeight="1.75rem"
												buttonLabelSize="0.85rem"
												buttonClick={() =>
													setIsManageInitialOpen(true)
												}
												isLoading={isLoading}
												isScaledOnHover={false}
												isDarkendOnHover
											/>
										</motion.div>
									)}
								</AnimatePresence>
								<CustomToggleSwitch
									isChecked={isInitialApproverChecked}
									setIsChecked={setIsInitialApproverChecked}
								/>
							</div>
						</div>
						<div className="w-full h-[2.5rem] border-b border-[var(--color-grey)] py-[0.375rem] px-3 flex justify-between items-center">
							<span className="leading-none">Final Approver</span>
							<div className="flex gap-3">
								<AnimatePresence exit>
									{isFinalApproverChecked && (
										<motion.div
											initial={{ x: -15, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											exit={{ x: -15, opacity: 0 }}
										>
											<CustomButton
												buttonVariant="solid"
												buttonLabel="Manage"
												buttonSolidColor="var(--color-tertiary)"
												buttonHeight="1.75rem"
												buttonLabelSize="0.85rem"
												buttonClick={() =>
													setIsManageFinalOpen(true)
												}
												isLoading={isLoading}
												isScaledOnHover={false}
												isDarkendOnHover
											/>
										</motion.div>
									)}
								</AnimatePresence>
								<CustomToggleSwitch
									isChecked={isFinalApproverChecked}
									setIsChecked={setIsFinalApproverChecked}
								/>
							</div>
						</div>

						<div className="w-full h-[2.5rem] border-b border-[var(--color-grey)] py-[0.375rem] px-3 flex justify-between items-center">
							<span className="leading-none">
								Reimbursement Processor
							</span>
							<div className="flex gap-3">
								<AnimatePresence exit>
									{isProcessorChecked && (
										<motion.div
											initial={{ x: -15, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											exit={{ x: -15, opacity: 0 }}
										>
											<CustomButton
												buttonVariant="solid"
												buttonLabel="Manage"
												buttonSolidColor="var(--color-tertiary)"
												buttonHeight="1.75rem"
												buttonLabelSize="0.85rem"
												buttonClick={() =>
													setIsManageProcessorOpen(
														true
													)
												}
												isLoading={isLoading}
												isScaledOnHover={false}
												isDarkendOnHover
											/>
										</motion.div>
									)}
								</AnimatePresence>
								<CustomToggleSwitch
									isChecked={isProcessorChecked}
									setIsChecked={setIsProcessorChecked}
								/>
							</div>
						</div>

						<div className="w-full h-[2.5rem] border-b border-[var(--color-grey)] py-[0.375rem] px-3 flex justify-between items-center">
							<span className="leading-none">Payables</span>
							<CustomToggleSwitch
								isChecked={isPayablesChecked}
								setIsChecked={setIsPayablesChecked}
							/>
						</div>

						<div className="w-full h-[2.5rem] border-b border-[var(--color-grey)] py-[0.375rem] px-3 flex justify-between items-center">
							<span className="leading-none">Payroll</span>
							<CustomToggleSwitch
								isChecked={isPayrollChecked}
								setIsChecked={setIsPayrollChecked}
							/>
						</div>

						<div className="w-full h-[2.5rem] py-[0.375rem] px-3 flex justify-between items-center">
							<span className="leading-none">Auditor</span>
							<CustomToggleSwitch
								isChecked={isAuditorChecked}
								setIsChecked={setIsAuditorChecked}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
				<CustomButton
					buttonVariant="primary"
					buttonLabel="Confirm"
					buttonClick={handleConfirm}
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
				modalTitle="Update Account Details"
				modalContent={modalContent}
				isCloseable
			/>

			<UserManageInitialApprover
				email={details.email}
				isModalOpen={isManageInitialOpen}
				setIsModalOpen={setIsManageInitialOpen}
				handleConfirm={handleConfirm}
			/>

			<UserManageFinalApprover
				email={details.email}
				isModalOpen={isManageFinalOpen}
				setIsModalOpen={setIsManageFinalOpen}
				handleConfirm={handleConfirm}
			/>

			<UserManageProcessorModal
				email={details.email}
				isModalOpen={isManageProcessorOpen}
				setIsModalOpen={setIsManageProcessorOpen}
				handleConfirm={handleConfirm}
			/>
		</>
	);
}

export default UserAdminUpdateDetailsModal;
