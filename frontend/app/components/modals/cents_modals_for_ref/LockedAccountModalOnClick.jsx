import CustomButton from "../../customs/CustomButton";
import CustomModalNoScroll from "../../customs/CustomModalNoScroll";

function LockedAccountModalOnClick({ isModalOpen, setIsModalOpen }) {
	const userInfo = JSON.parse(localStorage.getItem("user-info"));

	return (
		<>
			<CustomModalNoScroll
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				modalSize="sm"
				modalTitle="Your account has been locked"
				modalTitleTWStyle="leading-none px-6"
				modalContent={
					<>
						<div className="flex flex-col gap-4 overflow-x-hidden p-4 pt-6 overflow-y-auto">
							<div className="text-center inline-block">
								Please contact{" "}
								{
									<div className="font-semibold">
										{
											userInfo.user_creds
												.reimbursement_processor
										}
										,
									</div>
								}
								your custodian or reimbursement processor, to
								unlock your account and for further assistance.
							</div>
						</div>
						<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
							<CustomButton
								buttonVariant="primary"
								buttonLabel="OK"
								buttonClick={(e) => {
									e.preventDefault();
									setIsModalOpen(false);
								}}
							/>
						</div>
					</>
				}
			/>
		</>
	);
}

export default LockedAccountModalOnClick;
