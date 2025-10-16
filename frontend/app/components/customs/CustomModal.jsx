import { AnimatePresence, motion } from "framer-motion";
import React from "react";

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

function CustomModal({
	isModalOpen = false,
	setIsModalOpen,
	modalSize = "sm",
	modalTitle,
	modalContent,
	isCloseable,
}) {
	return (
		<>
			<AnimatePresence>
				{isModalOpen && (
					<motion.div
						className="fixed top-0 left-0 w-dvw h-dvh bg-[var(--color-bg-modal)] z-[9999] flex justify-center items-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							className={`bg-[var(--color-bg)] max-h-[90%] rounded-xl flex flex-col items-center shadow-lift relative ${
								modalSize === "sm"
									? "w-[90%] md:w-[30%] md:min-w-[30rem]"
									: modalSize === "md"
									? "w-[90%] md:w-[45%] md:min-w-[37.5rem]"
									: modalSize === "lg"
									? "w-[90%] md:w-[65%] md:min-w-[45rem]"
									: "w-[20rem]"
							}`}
							onClick={(e) => e.stopPropagation()}
							variants={popUp}
							initial="hidden"
							animate="visible"
							exit="exit"
						>
							{isCloseable && (
								<div className="w-full h-4 absolute flex justify-end p-1">
									<motion.div
										className="w-7 h-7 rounded-full flex justify-center items-center text-center cursor-pointer"
										whileHover={{
											scale: 1.025,
											background: "var(--color-grey)",
										}}
										whileTap={{ scale: 0.95 }}
										onClick={() => setIsModalOpen(false)}
									>
										<span className="fa-solid fa-xmark" />
									</motion.div>
								</div>
							)}
							<div className="w-full mt-8 mb-6 px-6 overflow-x-hidden overflow-y-auto">
								<div className="w-full flex justify-center text-center">
									<span className="text-gradient text-[2rem] font-bold leading-tight">
										{modalTitle}
									</span>
								</div>
								<div className="w-full mt-4">
									{modalContent}
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

export default CustomModal;
