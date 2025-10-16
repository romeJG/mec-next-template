import { motion } from "framer-motion";

const shieldAnim = {
	init: {
		scale: 0.5,
		rotate: "-45deg",
	},
	start: {
		scale: 1,
		rotate: 0,
		transition: {
			delay: 0.2,
			duration: 0.15,
			type: "spring",
			damping: 25,
			stiffness: 500,
		},
	},
};

const checkAnim = {
	init: {
		scale: 0.5,
		rotate: "-45deg",
	},
	start: {
		scale: 1,
		rotate: 0,
		transition: {
			delay: 0.25,
			duration: 0.15,
			type: "spring",
			damping: 25,
			stiffness: 500,
		},
	},
};

function SolidCircleShield() {
	return (
		<>
			<div className="w-28 h-28 rounded-full bg-[var(--color-primary)] grid place-content-center relative">
				<motion.span
					className="fa-solid fa-shield text-7xl text-white"
					variants={shieldAnim}
					initial="init"
					animate="start"
				></motion.span>
				<div className="translate-x-9 translate-y-8 absolute">
					<motion.span
						className="fa-solid fa-check text-5xl text-[var(--color-primary)]"
						variants={checkAnim}
						initial="init"
						animate="start"
					></motion.span>
				</div>
			</div>
		</>
	);
}

export default SolidCircleShield;
