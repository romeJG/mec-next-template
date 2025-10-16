import { useEffect, useRef, useState } from "react";
import CustomModalNoScroll from "../customs/CustomModalNoScroll";
import CustomInput from "../customs/CustomInput";
import CustomButton from "../customs/CustomButton";
import useUser from "../../apis/useUser";
import useDeviceSize from "../../hooks/useDeviceSize";

function UserAdminEditEmailModal({
	details,
	isModalOpen,
	isEditLoading,
	isEditSuccess,
	setIsModalOpen,
	setIsEditLoading,
	setIsEditError,
	setIsEditSuccess,
	setEditFetchMessage,
}) {
	const { updateEmail } = useUser();
	const { isMobile } = useDeviceSize();

	const [email, setEmail] = useState("");

	const handleEditEmail = async () => {
		await updateEmail(
			details.email,
			email,
			details.name,
			details.system_id,
			setIsEditLoading,
			setIsEditSuccess,
			setIsEditError,
			setEditFetchMessage
		);
	};

	useEffect(() => {
		setEmail(details.email);
	}, [isModalOpen]);

	useEffect(() => {
		setIsModalOpen(false);
	}, [isEditSuccess]);

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
				<div className="w-full grid md:grid-cols-2 gap-3">
					<CustomInput
						inputType="email"
						inputLabel="Email"
						inputValue={email}
						setInputValue={setEmail}
					/>
					<CustomInput
						inputType="text"
						inputLabel="Full Name"
						inputValue={details.name}
						isReadOnly
						isDisabled
					/>
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
			</div>
			<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
				<CustomButton
					buttonVariant="primary"
					buttonLabel="Confirm"
					buttonClick={handleEditEmail}
					isLoading={isEditLoading}
					isDisabled={isEditLoading}
				/>
				<CustomButton
					buttonVariant="bordered"
					buttonLabel="Cancel"
					buttonClick={() => setIsModalOpen(false)}
					isDisabled={isEditLoading}
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
				modalTitle="Edit User Email"
				modalContent={modalContent}
				isCloseable
			/>
		</>
	);
}

export default UserAdminEditEmailModal;
