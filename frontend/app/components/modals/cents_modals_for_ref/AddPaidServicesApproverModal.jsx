import { useEffect, useRef, useState } from "react";
import CustomModalNoScroll from "../../customs/CustomModalNoScroll";
import CustomButton from "../../customs/CustomButton";
import CustomInput from "../../customs/CustomInput";
import useUser from "../../apis/useUser";
import LoadingSpinner from "../../animated/LoadingSpinner";
import CustomAlertModal from "../../customs/CustomAlertModal";
import useDeviceSize from "../../../hooks/useDeviceSize";

function AddPaidServicesApproverModal({
	isModalOpen,
	setIsModalOpen,
	handleGetPaidServicesApprovers,
}) {
	const { getTpoUsers, addPaidServiceApprover } = useUser();
	const { isMobile } = useDeviceSize();

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

	const [selectedAccount, setSelectedAccount] = useState([]);

	const [tpoUsers, setTpoUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState(tpoUsers);
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [isAddLoading, setIsAddLoading] = useState(false);
	const [isAddSuccess, setIsAddSuccess] = useState(false);
	const [isAddError, setIsAddError] = useState(false);
	const [fetchMessageAdd, setFetrchMessageAdd] = useState("");

	const handleGetTpoUsers = () => {
		getTpoUsers(setTpoUsers, setIsLoading, setIsSuccess);
	};

	const handleAddApprover = (e) => {
		e.preventDefault();
		addPaidServiceApprover(
			selectedAccount.value,
			setIsAddLoading,
			setIsAddSuccess,
			setIsAddError,
			setFetrchMessageAdd
		);
	};

	const [searchQuery, setSearchQuery] = useState("");
	function search(data, searchQuery) {
		if (searchQuery === "") {
			return data;
		}
		return data.filter((entry) => {
			return Object.values(entry).some((value) => {
				if (value === null) {
					return;
				} else {
					return value
						.toString()
						.toLowerCase()
						.includes(searchQuery.toLowerCase());
				}
			});
		});
	}

	useEffect(() => {
		setFilteredUsers(search(tpoUsers, searchQuery));
	}, [searchQuery]);

	useEffect(() => {
		handleGetTpoUsers();
		setSelectedAccount([]);
	}, [isModalOpen]);

	useEffect(() => {
		setFilteredUsers(tpoUsers);
	}, [tpoUsers]);

	useEffect(() => {
		setIsModalOpen(false);
		handleGetPaidServicesApprovers();
	}, [isAddSuccess]);

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
				<div className="w-full flex flex-col gap-2 ">
					<CustomInput
						inputType="search"
						inputPlaceHolder="Search users..."
						inputValue={searchQuery}
						setInputValue={setSearchQuery}
					/>
					<div className="w-full rounded-md border border-[var(--color-grey)] bg-[var(--color-grey-light)] flex flex-col">
						{isLoading ? (
							<>
								<div className="w-full h-[12rem] grid place-content-center">
									<LoadingSpinner
										loadingSpinnerColor="var(--color-primary)"
										loadingSpinnerWidth="0.5rem"
										loadingSpinnerSize="4rem"
									/>
								</div>
							</>
						) : (
							<>
								<div className="w-full border-b border-b-[var(--color-grey)] p-2">
									{selectedAccount.label || "Select User"}
								</div>
								<div className="w-full max-h-[12rem] flex flex-col gap-1 overflow-x-hidden overflow-y-auto">
									{filteredUsers.length > 0 ? (
										<>
											{filteredUsers.map((option) => (
												<div
													key={option.value}
													className="px-2 py-1 w-full hover:bg-[var(--color-grey)] cursor-pointer"
													onClick={() =>
														setSelectedAccount(
															option
														)
													}
												>
													{option.label}
												</div>
											))}
										</>
									) : (
										<>
											<div className="px-2 py-1 w-full">
												No Records Found...
											</div>
										</>
									)}
								</div>
							</>
						)}
					</div>
				</div>
			</div>

			<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
				<CustomButton
					buttonVariant="primary"
					buttonLabel="Add"
					buttonClick={handleAddApprover}
					isLoading={isAddLoading}
					isDisabled={isAddLoading}
				/>
				<CustomButton
					buttonVariant="bordered"
					buttonLabel="Cancel"
					buttonClick={(e) => {
						e.preventDefault();
						setIsModalOpen(false);
					}}
					isDisabled={isAddLoading}
				/>
			</div>
		</>
	);

	return (
		<>
			<CustomModalNoScroll
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				modalSize="sm"
				modalTitle="Add Paid Service/s Approver"
				modalTitleTWStyle="leading-none px-6"
				modalContent={modalContent}
			/>

			<CustomAlertModal
				isModalOpen={isAddError}
				modalButtonClick={() => setIsAddError(false)}
				modalVariant="error"
				modalMessage={fetchMessageAdd}
			/>

			<CustomAlertModal
				isModalOpen={isAddSuccess}
				modalButtonClick={() => setIsAddSuccess(false)}
				modalVariant="success"
				modalMessage={fetchMessageAdd}
			/>
		</>
	);
}

export default AddPaidServicesApproverModal;
