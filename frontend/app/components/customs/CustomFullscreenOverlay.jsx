import { createPortal } from "react-dom";
import { motion } from "framer-motion";

function CustomFullscreenOverlay({ children }) {
	return createPortal(
		<motion.div
			className="w-dvw h-dvh fixed top-0 left-0 flex justify-center items-center bg-[var(--color-bg-modal)] z-[9999] backdrop-blur-sm"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			{children}
		</motion.div>,
		document.body
	);
}

export default CustomFullscreenOverlay;
