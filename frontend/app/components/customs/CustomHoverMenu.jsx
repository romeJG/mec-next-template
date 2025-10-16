import { motion } from "framer-motion";
import { useState } from "react";

const SAMPLE_MENU_OPTIONS = [
	{ value: "item1", label: "item 1" },
	{ value: "item2", label: "item 2" },
	{ value: "item3", label: "item 3" },
];
function CustomHoverMenu({
	menuButtonIconFA = "fa fa-ellipsis",
	menuOptions = SAMPLE_MENU_OPTIONS,
	setSelectedOption = SAMPLE_MENU_OPTIONS[0],
}) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<>
			<div
				className="flex justify-end"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<motion.div
					className={`${menuButtonIconFA} h-7 aspect-square grid place-content-center text-center rounded-md cursor-pointer relative`}
					style={{
						background: isHovered
							? "var(--color-grey)"
							: "transparent",
					}}
				/>
				<motion.div
					className="max-h-[10rem] mt-8 bg-[var(--color-bg)] shadow-lift flex flex-col rounded-md gap-1 text-[0.9rem] overflow-x-hidden overflow-y-auto absolute"
					initial={{
						opacity: isHovered ? 1 : 0,
						y: isHovered ? "0rem" : "-1.5rem",
						pointerEvents: isHovered ? "auto" : "none",
					}}
					animate={{
						opacity: isHovered ? 1 : 0,
						y: isHovered ? "0rem" : "-1.5rem",
						pointerEvents: isHovered ? "auto" : "none",
					}}
				>
					{menuOptions.map((options, index) => (
						<div
							key={index}
							onClick={() => setSelectedOption(options)}
							className="hover:bg-[var(--color-grey)] px-2 py-1 cursor-pointer"
						>
							{options.label}
						</div>
					))}
				</motion.div>
			</div>
		</>
	);
}

export default CustomHoverMenu;
