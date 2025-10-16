import { motion } from "framer-motion";

function LockedAccountTempModal() {
	const userInfo = JSON.parse(localStorage.getItem("user-info"));

	return (
		<>
			<div className="w-full h-full absolute top-0 right-0 bg-[var(--color-bg-modal-b)] flex justify-center items-center backdrop-blur-sm">
				<div className="bg-[var(--color-bg)] max-h-[90%] rounded-xl flex flex-col items-center shadow-lift relative w-[90%] md:w-[30%] md:min-w-[30rem]">
					<div className="w-full flex flex-col mt-8 mb-6 overflow-hidden px-4">
						<div className="w-full flex justify-center text-center">
							<span className="text-gradient text-[2rem] font-bold leading-tight">
								<div className="leading-none px-6">
									Your account is only temporarily unlocked
								</div>
							</span>
						</div>
						<div className="flex flex-col overflow-x-hidden overflow-y-auto">
							<div className="w-full my-4 flex justify-center">
								<motion.div
									className="h-[6.75rem] flex flex-col items-center justify-end"
									animate={{
										x: [0, 0, -2, 2, -2, 2, 0, 0, 0, 0],
									}}
									transition={{
										duration: 3.2,
										repeat: Infinity,
										times: [
											0, 0.06, 0.09, 0.12, 0.15, 0.18,
											0.21, 0.9, 0.95, 1,
										],
										ease: "easeInOut",
									}}
								>
									<motion.div
										className="w-14 flex flex-col items-end"
										animate={{
											y: [
												"0rem",
												"0.75rem",
												"0.75rem",
												"0rem",
												"0rem",
											],
										}}
										transition={{
											duration: 3.2,
											repeat: Infinity,
											times: [0, 0.06, 0.7, 0.73, 1],
											ease: "easeInOut",
										}}
									>
										<div className="w-14 h-8 rounded-tl-full rounded-tr-full border-[0.75rem] border-[var(--color-text)] border-b-0"></div>
										<div className="w-3 h-3 bg-[var(--color-text)]"></div>
									</motion.div>

									<div className="w-20 h-16 rounded-lg bg-[var(--color-text)] grid place-content-center">
										<span className="fa-solid fa-user text-[var(--color-text-reverse)] text-[2rem]"></span>
									</div>
								</motion.div>
							</div>
							<div className="flex flex-col gap-4">
								<span className="mb-1 text-center">
									Please settle your pending cash advance
									request to unlock your account.
								</span>
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
									your custodian or reimbursement processor
									for further assistance.
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default LockedAccountTempModal;
