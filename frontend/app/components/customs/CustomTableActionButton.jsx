import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function CustomTableActionButton({ row, index, actionButtons }) {
	const actionsButtonRef = useRef();
	const actionsContentRef = useRef();
	const [actionsOpen, setActionsOpen] = useState(false);

	const handleClickOutside = (event) => {
		if (
			actionsButtonRef.current &&
			!actionsButtonRef.current.contains(event.target) &&
			actionsContentRef.current &&
			!actionsContentRef.current.contains(event.target)
		) {
			setActionsOpen(false);
		}
	};

	useEffect(() => {
		if (actionsOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [actionsOpen]);

	return (
		<>
			<div className="w-full flex justify-center relative">
				<div>
					<div
						ref={actionsButtonRef}
						className="bg-[var(--color-accent-medium)] py-[0.35rem] px-3 flex items-center gap-2 rounded-md text-white font-semibold cursor-pointer z-[2]"
						onClick={() => setActionsOpen(!actionsOpen)}
					>
						<span>Actions</span>
						<motion.span
							className="fa-solid fa-chevron-down"
							initial={{ rotate: 0 }}
							animate={{ rotate: actionsOpen ? "180deg" : 0 }}
						></motion.span>
					</div>
					{actionsOpen && (
						<motion.div
							className={`absolute p-1 bg-[var(--color-bg)] shadow-lift rounded-lg flex flex-col gap-1 z-[3] ${
								index > 3 && "bottom-0 mb-8"
							}`}
							ref={actionsContentRef}
							initial={{ opacity: 0 }}
							animate={{ opacity: actionsOpen ? 1 : 0 }}
							transition={{ duration: 0.2 }}
						>
							{actionButtons
								.sort(
									(a, b, index) =>
										//makes the sorting optional
										(a.sort ?? index) - (b.sort ?? index)
								)
								.map((buttons, index) => (
									<motion.div
										key={buttons.buttonLabel + index}
										className="flex gap-2 items-center text-center py-[0.35rem] px-4 rounded-md cursor-pointer truncate"
										whileHover={{ scale: 1.015 }}
										whileTap={{ scale: 0.95 }}
										style={{
											background: buttons.buttonColor,
										}}
										onClick={() => {
											buttons.buttonClick(row);
											setActionsOpen(false);
										}}
									>
										<span
											className={`${buttons.buttonIcon} text-white text-[0.9em]`}
										/>

										<span className="text-white font-medium">
											{buttons.buttonLabel}
										</span>
									</motion.div>
								))}
						</motion.div>
					)}
				</div>
			</div>
		</>
	);
}

export default CustomTableActionButton;
