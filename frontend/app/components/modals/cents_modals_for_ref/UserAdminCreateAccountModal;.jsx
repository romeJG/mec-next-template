// import React from "react";

import { useEffect, useRef, useState } from "react";
import CustomModalNoScroll from "../customs/CustomModalNoScroll";
import CustomInput from "../customs/CustomInput";
import CustomToggleSwitch from "../customs/CustomToggleSwitch";
import CustomButton from "../customs/CustomButton";

function UserAdminCreateAccountModal({ isModalOpen, setIsModalOpen }) {
	const [isLoading, setIsLoading] = useState(false);

	const [fullname, setFullname] = useState("");
	const [email, setEmail] = useState("");
	const [position, setPosition] = useState("");
	const [department, setDepartment] = useState("");

	// Role Access
	const [isAdminChecked, setIsAdminChecked] = useState(false);
	const [isRequestorChecked, setIsRequestorChecked] = useState(false);
	const [isInitialApproverChecked, setIsInitialApproverChecked] =
		useState(false);
	const [isFinalApproverChecked, setIsFinalApproverChecked] = useState(false);
	const [isProcessorChecked, setIsProcessorChecked] = useState(false);

	const handleConfirm = () => {
		const updatedRoles = [];
		if (isAdminChecked) updatedRoles.push("admin");
		if (isRequestorChecked) updatedRoles.push("requestor");
		if (isInitialApproverChecked) updatedRoles.push("initial approver");
		if (isFinalApproverChecked) updatedRoles.push("final approver");
		if (isProcessorChecked) updatedRoles.push("reimbursement processor");
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
	}, []);

	const modalContent = (
		<>
			<div
				ref={contentRef}
				className="w-full h-full mt-2 pl-6 pt-2 pb-4 flex flex-col gap-3 overflow-x-hidden overflow-y-auto"
				style={{
					paddingRight: isContentScrollable ? "0.5rem" : "1.5rem",
				}}
			>
				<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
					<CustomInput
						inputType="text"
						inputLabel="Fullname"
						inputValue={fullname.toUpperCase()}
						setInputValue={setFullname}
						isRequired
					/>
					<CustomInput
						inputType="email"
						inputLabel="Email"
						inputValue={email}
						setInputValue={setEmail}
						isRequired
					/>
					<CustomInput
						inputType="text"
						inputLabel="Position"
						inputValue={position}
						setInputValue={setFullname}
						isRequired
					/>
					<CustomInput
						inputType="email"
						inputLabel="Department"
						inputValue={department}
						setInputValue={setDepartment}
						isRequired
					/>
				</div>
				<div className="w-full">
					<label className="font-semibold text-color flex">
						Role Access
						<span className="text-[var(--color-secondary)]">*</span>
					</label>
					<div className="w-full py-1 border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md flex flex-col">
						<div className="w-full border-b border-[var(--color-grey)] py-[0.375rem] px-3 flex justify-between">
							<span>Admin</span>
							<CustomToggleSwitch
								isChecked={isAdminChecked}
								setIsChecked={setIsAdminChecked}
							/>
						</div>
						<div className="w-full border-b border-[var(--color-grey)] py-[0.375rem] px-3 flex justify-between">
							<span>Requestor</span>
							<CustomToggleSwitch
								isChecked={isRequestorChecked}
								setIsChecked={setIsRequestorChecked}
							/>
						</div>
						<div className="w-full border-b border-[var(--color-grey)] py-[0.375rem] px-3 flex justify-between">
							<span>Initial Approver</span>
							<CustomToggleSwitch
								isChecked={isInitialApproverChecked}
								setIsChecked={setIsInitialApproverChecked}
							/>
						</div>
						<div className="w-full border-b border-[var(--color-grey)] py-[0.375rem] px-3 flex justify-between">
							<span>Final Approver</span>
							<CustomToggleSwitch
								isChecked={isFinalApproverChecked}
								setIsChecked={setIsFinalApproverChecked}
							/>
						</div>
						<div className="w-full py-[0.375rem] px-3 flex justify-between">
							<span>Reimbursement Processor</span>
							<CustomToggleSwitch
								isChecked={isProcessorChecked}
								setIsChecked={setIsProcessorChecked}
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
		<CustomModalNoScroll
			isModalOpen={isModalOpen}
			setIsModalOpen={setIsModalOpen}
			modalSize="md"
			modalTitle="Create Account"
			modalContent={modalContent}
			isCloseable
		/>
	);
}

export default UserAdminCreateAccountModal;
