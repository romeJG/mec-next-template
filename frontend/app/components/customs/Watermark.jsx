import React, { useState } from "react";
import watermark from "../../assets/SoftDevs_logo.png";
import watermark_dark from "../../assets/SoftDevs_logo_dark.png";
import { motion } from "framer-motion";
function Watermark() {
	const [isWaterMarkHovered, setIsWaterMarkHovered] = useState(false);
	return (
		<div
			className="w-[10rem] rounded-full shadow-lift bg-white relative overflow-hidden"
			onMouseEnter={() => setIsWaterMarkHovered(true)}
			onMouseLeave={() => setIsWaterMarkHovered(false)}
		>
			<div
				className={`w-full px-1 py-1 bg-gradient-primary rounded-full transition-all duration-300 z-[2] absolute ${
					isWaterMarkHovered
						? "translate-y-[calc(-100%-2px)]"
						: "translate-y-0"
				}`}
			>
				<img
					src={watermark}
					alt="softdevs"
					className="h-full object-cover image_drop_shadow"
				/>
			</div>
			<motion.div
				className="w-full px-1 py-1 bg-white rounded-full z-[1]"
				animate={{
					scale: isWaterMarkHovered ? 1 : 0.8,
					transition: {
						delay: 0.1,
					},
				}}
			>
				<img
					src={watermark_dark}
					alt="softdevs"
					className="h-full object-cover image_drop_shadow"
				/>
			</motion.div>
		</div>
	);
}

export default Watermark;
