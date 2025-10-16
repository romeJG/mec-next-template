import { motion } from "framer-motion";

function LoadingSpinner({
	loadingSpinnerSize = "5rem",
	loadingSpinnerWidth = "0.5rem",
	loadingSpinnerColor = "var(--color-primary)",
}) {
	return (
		<>
			<motion.div
				className=" rounded-[50%] drop-shadow-sm"
				style={{
					width: loadingSpinnerSize,
					height: loadingSpinnerSize,
					border: `${loadingSpinnerWidth} solid ${loadingSpinnerColor}`,
					// borderBottomColor: "rgba(238, 238, 238, 0.5)",
					borderBottomColor: "var(--color-grey-transparent)",
				}}
				animate={{ rotate: [0, 540, 720] }}
				transition={{
					repeat: Infinity,
					duration: 2,
					ease: "linear",
				}}
			/>
		</>
	);
}

export default LoadingSpinner;
