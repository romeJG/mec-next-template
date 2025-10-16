import { motion } from "framer-motion";

function SolidTriangleExclamation() {
	return (
		<>
			<motion.div
				className="w-[7rem] h-[7rem] flex justify-center items-center text-center relative"
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
				<div className="fa-solid fa-triangle-exclamation text-[7.5rem] text-yellow-400 absolute" />
				<div
					className="w-0 h-0 border-l-[2.5rem] border-l-transparent border-b-[5rem] 
								border-b-yellow-400 border-r-[2.5rem] border-r-transparent absolute"
				/>
				<div className="w-[3.75rem] h-[3.75rem] grid place-content-center gap-2 absolute translate-y-2">
					<motion.div
						className="w-3 h-12 rounded bg-white"
						initial={{ height: 0 }}
						animate={{ height: "3rem" }}
						transition={{
							delay: 0.3,
							duration: 0.2,
						}}
					></motion.div>
					<motion.div
						className="w-3 h-3 rounded bg-white"
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
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

export default SolidTriangleExclamation;
