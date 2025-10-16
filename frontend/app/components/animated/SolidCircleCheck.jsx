import { motion } from "framer-motion";

function SolidCircleCheck() {
	return (
		<>
			<motion.div
				className="w-28 h-28 bg-[var(--color-tertiary)] rounded-full flex justify-center items-center"
				initial={{ scale: 0, rotate: 0 }}
				animate={{ scale: 1, rotate: 360 }}
				transition={{
					type: "spring",
					damping: 25,
					stiffness: 300,
					delay: 0.2,
					duration: 0.3,
				}}
			>
				<div className="w-[3.75rem] h-8 flex items-end rotate-[-45deg] translate-x-[3px] translate-y-[-3px]">
					<motion.div
						className="w-3 h-8 bg-white"
						style={{
							borderRadius: "0.25rem 0.25rem 0 0.25rem",
						}}
						initial={{ height: 0 }}
						animate={{ height: "2rem" }}
						transition={{
							delay: 0.3,
							duration: 0.2,
						}}
					></motion.div>
					<motion.div
						className="w-12 h-3 translate-x-[-3px] bg-white"
						style={{
							borderRadius: "0 0.25rem 0.25rem 0",
						}}
						initial={{ width: 0 }}
						animate={{ width: "3rem" }}
						transition={{
							delay: 0.5,
							duration: 0.2,
						}}
					></motion.div>
				</div>
			</motion.div>
		</>
	);
}

export default SolidCircleCheck;
