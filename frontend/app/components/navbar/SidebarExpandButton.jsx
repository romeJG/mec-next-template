import { motion } from "framer-motion";

function SidebarExpandButton({ handleClick, isClicked }) {
	return (
		<motion.div
			onClick={handleClick}
			className="flex flex-col gap-[3px] cursor-pointer"
			whileHover={{ scale: 1.025 }}
			whileTap={{ scale: 0.975 }}
			title={isClicked ? "Expand Sidebar" : "Collapse Sidebar"}
		>
			<motion.div
				className="bg-[var(--color-text)] h-[3px] min-h-[3px] w-4 min-w-4 rounded-sm"
				initial={{ x: 0 }}
				animate={{
					x: isClicked ? "-0.25rem" : "0",
				}}
			/>
			<motion.div
				className="bg-[var(--color-text)] h-[3px] min-h-[3px] w-4 min-w-4 rounded-sm"
				initial={{ x: "-0.25rem" }}
				animate={{
					x: isClicked ? "0" : "-0.25rem",
				}}
			/>
			<motion.div
				className="bg-[var(--color-text)] h-[3px] min-h-[3px] w-4 min-w-4 rounded-sm"
				initial={{ x: 0 }}
				animate={{
					x: isClicked ? "-0.25rem" : "0",
				}}
			/>
		</motion.div>
	);
}

export default SidebarExpandButton;
