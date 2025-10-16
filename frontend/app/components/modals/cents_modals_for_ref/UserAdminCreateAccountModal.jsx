import { useEffect, useRef, useState } from "react";
import CustomInput from "../customs/CustomInput";
import CustomModalNoScroll from "../customs/CustomModalNoScroll";
import CustomButton from "../customs/CustomButton";
import useUser from "../../apis/useUser";
import CustomSelectModalType from "../customs/CustomSelectModalType";
import CustomAlertModal from "../customs/CustomAlertModal";
import LoadingSpinner from "../animated/LoadingSpinner";
import useDeviceSize from "../../hooks/useDeviceSize";

function UserAdminCreateAccountModal({ isModalOpen, setIsModalOpen }) {
	const { getDepartmentsOnly, getPositionsOnly, createUser } = useUser();
	const { isMobile } = useDeviceSize();

	const [fullname, setFullname] = useState("");
	const [email, setEmail] = useState("");

	const [position, setPosition] = useState("");
	const [positions, setPositions] = useState([]);
	const [isPosLoading, setIsPosLoading] = useState(false);

	const [department, setDepartment] = useState("");
	const [departments, setDepartments] = useState([]);
	const [isDeptLoading, setIsDeptLoading] = useState(false);
	const [isDeptSuccess, setIsDeptSuccess] = useState(false);

	const userRole = ["requestor"];
	const [isCreating, setIsCreating] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isError, setIsError] = useState(false);
	const [fetchMessage, setFetchMessage] = useState("");

	const handleGetDepartments = async () => {
		await getDepartmentsOnly(
			setDepartments,
			setIsDeptLoading,
			setIsDeptSuccess
		);
		await getPositionsOnly(setPositions, setIsPosLoading);
	};

	const handleCreateUser = async () => {
		await createUser(
			email,
			fullname,
			position,
			department,
			userRole,
			setIsCreating,
			setIsSuccess,
			setIsError,
			setFetchMessage
		);
	};

	useEffect(() => {
		setDepartment(departments[0]);
		setPosition(positions[0]);
	}, [departments, positions, isDeptSuccess]);

	useEffect(() => {
		if (isModalOpen) {
			handleGetDepartments();
		}
	}, [isModalOpen]);

	useEffect(() => {
		if (isSuccess) {
			setIsModalOpen(false);
			setEmail("");
			setFullname("");
			setDepartment(departments[0]);
			setPosition(positions[0]);
		}
	}, [isSuccess]);

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
			{isDeptLoading || isPosLoading ? (
				<>
					<div className="w-full h-[12rem] flex justify-center items-center">
						<LoadingSpinner
							loadingSpinnerColor="var(--color-primary)"
							loadingSpinnerWidth="0.5rem"
							loadingSpinnerSize="4rem"
						/>
					</div>
				</>
			) : (
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
						<CustomInput
							inputType="text"
							inputLabel="Full Name"
							inputValue={fullname}
							setInputValue={setFullname}
						/>
						<CustomInput
							inputType="text"
							inputLabel="Email"
							inputValue={email}
							setInputValue={setEmail}
						/>
						<CustomSelectModalType
							selectLabel="Position"
							selectOptions={positions}
							selectedOption={position}
							setSelectedOption={setPosition}
						/>
						<CustomSelectModalType
							selectLabel="Department"
							selectOptions={departments}
							selectedOption={department}
							setSelectedOption={setDepartment}
						/>
					</div>
					<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
						<CustomButton
							buttonVariant="primary"
							buttonLabel="Confirm"
							buttonClick={handleCreateUser}
							isLoading={isCreating}
							isDisabled={isCreating}
						/>
						<CustomButton
							buttonVariant="bordered"
							buttonLabel="Cancel"
							buttonClick={() => setIsModalOpen(false)}
							isDisabled={isCreating}
						/>
					</div>
				</>
			)}
		</>
	);

	return (
		<>
			<CustomModalNoScroll
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				modalSize="md"
				modalTitle="Create Account"
				modalTitleTWStyle="leading-none px-6"
				modalContent={modalContent}
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

export default UserAdminCreateAccountModal;
