import { AnimatePresence, motion } from "framer-motion";
import SolidCircleCheck from "../animated/SolidCircleCheck";
import CustomButton from "./CustomButton";
import SolidCircleXMark from "../animated/SolidCircleXMark";
import SolidTriangleExclamation from "../animated/SolidTriangleExclamation";
import { useEffect, useState } from "react";

const popUp = {
	hidden: {
		scale: 0.5,
		opacity: 0,
	},
	visible: {
		scale: 1,
		opacity: 1,
		transition: {
			duration: 0.1,
			type: "spring",
			damping: 25,
			stiffness: 500,
		},
	},
	exit: {
		scale: 0.5,
		opacity: 0,
	},
};

function CustomAlertModal({
	isModalOpen = false,
	modalVariant,
	modalHeadline = "Are you sure?",
	modalMessage,
	modalButtonClick,
	modalButtonConfirm,
	isLoading = false,
}) {
	// MODAL VARIANTS
	// success
	// error
	// confirm

	const [isVariantValid, setIsVariantValid] = useState(false);

	useEffect(() => {
		const validVariants = ["success", "error", "confirm"];
		if (validVariants.includes(modalVariant)) {
			setIsVariantValid(true);
		} else {
			setIsVariantValid(false);
		}
	}, [modalVariant]);

	return (
		<>
			<AnimatePresence>
				{isModalOpen && (
					<motion.div
						className="fixed top-0 left-0 w-dvw h-dvh bg-[rgba(0,0,0,0.75)] z-[9999] flex justify-center items-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							className="w-[90%] md:w-[30rem] md:min-w-[30rem] md:max-w-[30rem] bg-[var(--color-bg)] shadow-lift max-h-[90%] rounded-xl flex flex-col items-center relative"
							onClick={(e) => e.stopPropagation()}
							variants={popUp}
							initial="hidden"
							animate="visible"
							exit="exit"
						>
							{isVariantValid ? (
								<div className="w-full mt-8 mb-6 px-6 overflow-hidden">
									<div className="w-full flex justify-center">
										{modalVariant === "success" ? (
											<SolidCircleCheck />
										) : modalVariant === "error" ? (
											<SolidCircleXMark />
										) : modalVariant === "confirm" ? (
											<SolidTriangleExclamation />
										) : (
											<></>
										)}
									</div>
									<div className="w-full flex flex-col items-center text-center">
										<span className="text-[2.5rem] font-semibold leading-none mt-2">
											{modalVariant === "success"
												? "Success!"
												: modalVariant === "error"
												? "Error!"
												: modalHeadline}
										</span>
										<div className="mt-2">
											{modalMessage}
										</div>
									</div>
									<div className="w-full pt-2 mt-4 flex justify-center">
										{modalVariant === "confirm" ? (
											<div className="w-full grid grid-cols-2 gap-3">
												<CustomButton
													buttonVariant="primary"
													buttonLabel="PROCEED"
													buttonClick={
														modalButtonConfirm
													}
													isLoading={isLoading}
													isDisabled={isLoading}
												/>
												<CustomButton
													buttonVariant="bordered"
													buttonLabel="CANCEL"
													buttonClick={
														modalButtonClick
													}
													isDisabled={isLoading}
												/>
											</div>
										) : (
											<div className="w-full">
												<CustomButton
													buttonVariant="primary"
													buttonLabel="OK"
													buttonClick={
														modalButtonClick
													}
												/>
											</div>
										)}
									</div>
								</div>
							) : (
								<div className="w-full mt-8 mb-6 px-6 overflow-x-hidden overflow-y-auto flex flex-col text-center items-center">
									<motion.span
										className="text-[6rem]"
										initial={{ scale: 0, rotate: 45 }}
										animate={{ scale: 1, rotate: 0 }}
										transition={{
											type: "spring",
											damping: 25,
											stiffness: 300,
											delay: 0.2,
											duration: 0.3,
										}}
									>
										😞
									</motion.span>
									<span className="text-[1.5rem] font-semibold leading-none mb-6">
										Sorry, the variant you provided does not
										exist.
									</span>

									<div className="w-full">
										<CustomButton
											buttonVariant="primary"
											buttonLabel="OK"
											buttonClick={modalButtonClick}
										/>
									</div>
								</div>
							)}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

export default CustomAlertModal;
