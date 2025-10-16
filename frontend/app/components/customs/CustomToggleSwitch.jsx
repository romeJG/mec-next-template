import { motion } from "framer-motion";

const CustomToggleSwitch = ({
	isChecked,
	setIsChecked,
	functionToTrigger,
	isFunctionControlled = false,
	isDisabled = false,
}) => {
	//   const [isChecked, setIsChecked] = useState(false);

	const handleCheckboxChange = () => {
		setIsChecked(!isChecked);
	};

	return (
		<>
			<label className="flex cursor-pointer select-none items-center">
				<div className="relative">
					{isFunctionControlled ? (
						<input
							type="checkbox"
							checked={isChecked}
							onChange={functionToTrigger}
							className="sr-only"
							disabled={isDisabled}
						/>
					) : (
						<input
							type="checkbox"
							checked={isChecked}
							onChange={handleCheckboxChange}
							className="sr-only"
							disabled={isDisabled}
						/>
					)}
					<motion.div
						className="block h-6 w-11 rounded-full"
						initial={{
							background: "var(--color-grey)",
						}}
						animate={{
							background: isChecked
								? "var(--color-primary)"
								: "var(--color-grey)",
						}}
					></motion.div>
					<motion.div
						className="dot absolute left-[0.2rem] top-[0.2rem] flex h-[1.15rem] w-[1.15rem] items-center justify-center rounded-full"
						initial={{
							x: isChecked ? "100%" : "0%",
							background: "white",
						}}
						animate={{
							x: isChecked ? "100%" : "0%",
							background: "white",
							transition: {
								duration: 0.15,
								ease: "easeInOut",
							},
						}}
					></motion.div>
				</div>
			</label>
		</>
	);
};

export default CustomToggleSwitch;
