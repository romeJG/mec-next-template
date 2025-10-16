import { useEffect, useRef, useState } from "react";
import CustomModalNoScroll from "../customs/CustomModalNoScroll";
import useDeviceSize from "../../hooks/useDeviceSize";
import { motion } from "framer-motion";

function ReceiptIsScanningModal({ isModalOpen, setIsModalOpen }) {
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

	const modalContent = (
		<>
			<div
				ref={contentRef}
				className="w-full h-full mt-2 pl-6 pt-2 pb-4 flex flex-col justify-center items-center gap-3 overflow-x-hidden overflow-y-auto"
				style={{
					paddingRight:
						isContentScrollable && !isMobile ? "0.5rem" : "1.5rem",
				}}
			>
				<span className="w-full font-semibold text-[2rem] text-center leading-none">
					Scanning Receipt
				</span>
				<div className="w-[10rem] h-[10rem] flex justify-between relative mt-4">
					<div className="h-full flex flex-col justify-between">
						<div className="w-8 h-8 border-t-4 border-l-4 border-[var(--color-text)]"></div>
						<div className="w-8 h-8 border-b-4 border-l-4 border-[var(--color-text)]"></div>
					</div>
					<div className="w-[10rem] h-[10rem] flex justify-center items-center">
						<div className="fa-solid fa-receipt text-[7rem] text-center leading-none"></div>
					</div>
					<div className="w-[10rem] mt-2 flex justify-center absolute">
						<motion.div
							className="w-[calc(10rem-16px)] h-[5px] bg-[var(--color-primary)]"
							initial={{ y: 0 }}
							animate={{
								y: [0, "140px", 0],
								transition: {
									repeat: Infinity,
									duration: 4,
								},
							}}
						></motion.div>
					</div>
					<div className="h-full flex flex-col justify-between">
						<div className="w-8 h-8 border-t-4 border-r-4 border-[var(--color-text)]"></div>
						<div className="w-8 h-8 border-b-4 border-r-4 border-[var(--color-text)]"></div>
					</div>
				</div>
			</div>
		</>
	);
	return (
		<>
			<CustomModalNoScroll
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				// modalTitle="Reimbursement Type"
				// modalTitleTWStyle="leading-none px-6"
				modalContent={modalContent}
				modalSize="sm"
				// isCloseable
			/>
		</>
	);
}

export default ReceiptIsScanningModal;
