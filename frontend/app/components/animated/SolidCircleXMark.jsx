import { motion } from "framer-motion";

function SodlidCircleXMark() {
	return (
		<>
			<motion.div
				className="w-28 h-28 bg-[var(--color-secondary)] rounded-full flex justify-center items-center"
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
				<div className="w-[3.75rem] h-[3.75rem] flex justify-center items-center relative">
					<motion.div
						className="w-3 h-[3.75rem] bg-white rounded rotate-[-45deg] absolute"
						initial={{ height: 0 }}
						animate={{ height: "3.75rem" }}
						transition={{
							delay: 0.3,
							duration: 0.2,
						}}
					></motion.div>
					<motion.div
						className="w-3 h-[3.75rem] bg-white rounded rotate-[45deg] absolute"
						initial={{ height: 0 }}
						animate={{ height: "3.75rem" }}
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

export default SodlidCircleXMark;
