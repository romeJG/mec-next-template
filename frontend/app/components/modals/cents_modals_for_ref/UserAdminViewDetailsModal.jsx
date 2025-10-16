import CustomInput from "../customs/CustomInput";
import CustomModal from "../customs/CustomModal";
import user_init from "../../assets/user_init.png";
import capitalizeEveryWord from "../../utils/capitalizeEveryWord";
// import useConstants from "../../hooks/useConstants";

function UserAdminViewDetailsModal({ details, isModalOpen, setIsModalOpen }) {
	// const { BACKEND_URL } = useConstants();

	const modalContent = (
		<>
			<div className="w-full flex flex-col gap-3">
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
					inputValue={details.name}
					isReadOnly
					isDisabled
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
								: details.status === 2
								? "Locked"
								: "Temporary Unlocked"
						}
						isReadOnly
						isDisabled
					/>
				</div>

				<div className="flex flex-col lg:flex-row gap-3">
					<CustomInput
						inputType="text"
						inputLabel="Position"
						inputValue={
							!details.position ? "N/A" : details.position
						}
						isReadOnly
						isDisabled
					/>
					<CustomInput
						inputType="text"
						inputLabel="Department"
						inputValue={
							!details.department ? "N/A" : details.department
						}
						isReadOnly
						isDisabled
					/>
				</div>

				<div className="w-full">
					<label className="font-semibold text-color flex">
						Role Access
					</label>
					<div className="w-full p-2 border border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md flex flex-wrap gap-2">
						{details.role &&
							details.role.map((role, index) => (
								<div
									key={role + index}
									className="py-1 px-4 bg-[var(--color-bg)] shadow-lift font-medium rounded-sm"
								>
									{capitalizeEveryWord(role)}
								</div>
							))}
					</div>
				</div>
			</div>
		</>
	);

	return (
		<CustomModal
			isModalOpen={isModalOpen}
			setIsModalOpen={setIsModalOpen}
			modalSize="md"
			modalTitle="Account Details"
			modalContent={modalContent}
			isCloseable
		/>
	);
}

export default UserAdminViewDetailsModal;
