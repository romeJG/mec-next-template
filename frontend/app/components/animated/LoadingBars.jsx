import { motion } from "framer-motion";

function LoadingBars({
	loadingBarsColor = "var(--color-text)",
	loadingBarsWidth = "3px",
	loadingBarsHeight = "20px",
}) {
	return (
		<>
			<div
				className="flex items-center"
				style={{
					height: loadingBarsHeight,
					gap: loadingBarsWidth,
				}}
			>
				{/* Processing */}
				<motion.div
					className={`rounded-[${loadingBarsWidth}]`}
					style={{
						background: loadingBarsColor,
						width: loadingBarsWidth,
						height: loadingBarsHeight,
						borderRadius: loadingBarsWidth,
					}}
					initial={{ height: loadingBarsWidth }}
					animate={{ height: loadingBarsHeight }}
					transition={{
						delay: 0.3,
						duration: 0.5,
						repeatType: "mirror",
						repeat: Infinity,
					}}
				></motion.div>
				<motion.div
					className={`rounded-[${loadingBarsWidth}]`}
					style={{
						background: loadingBarsColor,
						width: loadingBarsWidth,
						height: loadingBarsHeight,
						borderRadius: loadingBarsWidth,
					}}
					initial={{ height: loadingBarsWidth }}
					animate={{ height: loadingBarsHeight }}
					transition={{
						delay: 0.6,
						duration: 0.5,
						repeatType: "mirror",
						repeat: Infinity,
					}}
				></motion.div>
				<motion.div
					style={{
						background: loadingBarsColor,
						width: loadingBarsWidth,
						height: loadingBarsHeight,
						borderRadius: loadingBarsWidth,
					}}
					initial={{ height: loadingBarsWidth }}
					animate={{ height: loadingBarsHeight }}
					transition={{
						delay: 0.9,
						duration: 0.5,
						repeatType: "mirror",
						repeat: Infinity,
					}}
				></motion.div>
			</div>
		</>
	);
}

export default LoadingBars;
