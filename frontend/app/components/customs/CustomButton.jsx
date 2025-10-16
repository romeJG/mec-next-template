import { motion } from "framer-motion";
// import LoadingBars from "../animated/LoadingBars";
import LoadingSpinner from "../animated/LoadingSpinner";

function CustomButton({
	buttonVariant,
	buttonLabel,
	buttonLabelSize = "1rem",
	buttonTitle,
	buttonWidth = "100%",
	buttonHeight = "auto",
	buttonLabelColor = "var(--color-text)",
	buttonSolidColor = "var(--color-bg)",
	buttonBorderColor = "var(--color-text)",
	buttonBorderWidth = "2px",
	buttonClick,
	isLoading = false,
	isScaledOnHover = true,
	isDarkendOnHover = false,
	isDisabled = false,
	isWithTitle = false,
}) {
	return (
		<>
			{buttonVariant === "primary" ? (
				<motion.button
					className="bg-gradient-primary py-2 px-4 rounded-md font-semibold text-white grid place-content-center text-center"
					style={{
						width: buttonWidth,
						height: buttonHeight,
						fontSize: buttonLabelSize,
						opacity: isDisabled ? 0.75 : 1,
						cursor: isDisabled ? "not-allowed" : "pointer",
					}}
					whileHover={{
						scale: isScaledOnHover ? 1.015 : 1,
						filter: isDarkendOnHover ? "brightness(95%)" : "none",
						transition: {
							duration: 0.1,
							ease: "easeInOut",
						},
					}}
					whileTap={{
						scale: 0.985,
					}}
					disabled={isDisabled}
					onClick={buttonClick}
					title={isWithTitle ? buttonTitle : ""}
				>
					{isLoading ? (
						<LoadingSpinner
							loadingSpinnerSize="1.5rem"
							loadingSpinnerWidth="0.25rem"
							loadingSpinnerColor="white"
						/>
					) : (
						buttonLabel
					)}
				</motion.button>
			) : buttonVariant === "secondary" ? (
				<motion.button
					className="bg-gradient-secondary py-2 px-4 rounded-md text-white font-semibold grid place-content-center text-center"
					style={{
						width: buttonWidth,
						height: buttonHeight,
						fontSize: buttonLabelSize,
						opacity: isDisabled ? 0.75 : 1,
						cursor: isDisabled ? "not-allowed" : "pointer",
					}}
					whileHover={{
						scale: isScaledOnHover ? 1.015 : 1,
						filter: isDarkendOnHover ? "brightness(95%)" : "none",
						transition: {
							duration: 0.1,
							ease: "easeInOut",
						},
					}}
					whileTap={{
						scale: 0.985,
					}}
					disabled={isDisabled}
					onClick={buttonClick}
					title={isWithTitle ? buttonTitle : ""}
				>
					{isLoading ? (
						<LoadingSpinner
							loadingSpinnerSize="1.5rem"
							loadingSpinnerWidth="0.25rem"
							loadingSpinnerColor="white"
						/>
					) : (
						buttonLabel
					)}
				</motion.button>
			) : buttonVariant === "bordered" ? (
				<motion.button
					className="relative py-2 px-4 font-bold bg-transparent rounded-lg grid place-content-center text-center"
					style={{
						width: buttonWidth,
						height: buttonHeight,
						fontSize: buttonLabelSize,
						opacity: isDisabled ? 0.75 : 1,
						cursor: isDisabled ? "not-allowed" : "pointer",
					}}
					whileHover={{
						scale: isScaledOnHover ? 1.015 : 1,
						filter: isDarkendOnHover ? "brightness(95%)" : "none",
						transition: {
							duration: 0.1,
							ease: "easeInOut",
						},
					}}
					whileTap={{
						scale: 0.985,
					}}
					disabled={isDisabled}
					onClick={buttonClick}
					title={isWithTitle ? buttonTitle : ""}
				>
					<span
						className="absolute inset-0 bg-gradient-primary rounded-md"
						style={{
							padding: buttonBorderWidth,
						}}
					>
						<span
							className="flex items-center justify-center h-full w-full bg-[var(--color-bg)]"
							style={{
								borderRadius: `calc(0.375rem - ${buttonBorderWidth})`,
							}}
						>
							<span className="flex items-center justify-center h-full w-full bg-clip-text text-[transparent] bg-gradient-to-r from-[var(--color-accent-medium)] to-[var(--color-primary)]">
								{isLoading ? (
									<LoadingSpinner
										loadingSpinnerSize="1.5rem"
										loadingSpinnerWidth="0.25rem"
										loadingSpinnerColor="var(--color-primary)"
									/>
								) : (
									buttonLabel
								)}
							</span>
						</span>
					</span>
				</motion.button>
			) : buttonVariant === "solid" ? (
				<motion.button
					className="py-2 px-4 rounded-md font-semibold grid place-content-center text-center"
					style={{
						background: buttonSolidColor,
						width: buttonWidth,
						height: buttonHeight,
						fontSize: buttonLabelSize,
						color: buttonLabelColor,
						opacity: isDisabled ? 0.75 : 1,
						cursor: isDisabled ? "not-allowed" : "pointer",
					}}
					whileHover={{
						scale: isScaledOnHover ? 1.015 : 1,
						filter: isDarkendOnHover ? "brightness(95%)" : "none",
						transition: {
							duration: 0.1,
							ease: "easeInOut",
						},
					}}
					whileTap={{
						scale: 0.985,
					}}
					disabled={isDisabled}
					onClick={buttonClick}
					title={isWithTitle ? buttonTitle : ""}
				>
					{isLoading ? (
						<LoadingSpinner
							loadingSpinnerSize="1.5rem"
							loadingSpinnerWidth="0.25rem"
							loadingSpinnerColor={buttonLabelColor}
						/>
					) : (
						buttonLabel
					)}
				</motion.button>
			) : buttonVariant === "bordered solid" ? (
				<motion.div
					className="py-[calc(0.5rem-3px)] px-4 rounded-md font-semibold grid place-content-center text-center box-border cursor-pointer"
					style={{
						background: buttonSolidColor,
						border: `${buttonBorderWidth} solid ${buttonBorderColor}`,
						width: buttonWidth,
						height: buttonHeight,
						fontSize: buttonLabelSize,
						color: buttonLabelColor,
						opacity: isDisabled ? 0.75 : 1,
						cursor: isDisabled ? "not-allowed" : "pointer",
					}}
					whileHover={{
						scale: isScaledOnHover ? 1.015 : 1,
						filter: isDarkendOnHover ? "brightness(95%)" : "none",
						transition: {
							duration: 0.1,
							ease: "easeInOut",
						},
					}}
					whileTap={{
						scale: 0.985,
					}}
					disabled={isDisabled}
					onClick={buttonClick}
					title={isWithTitle ? buttonTitle : ""}
				>
					{isLoading ? (
						<LoadingSpinner
							loadingSpinnerSize="1.5rem"
							loadingSpinnerWidth="0.25rem"
							loadingSpinnerColor={buttonLabelColor}
						/>
					) : (
						buttonLabel
					)}
				</motion.div>
			) : (
				<div
					className="w-full py-2 px-4 bg-[var(--color-secondary)] rounded-md grid place-content-center text-center"
					style={{
						height: buttonHeight,
					}}
				>
					<span className="font-semibold text-white leading-none">
						{`Sorry, there is no such button variants :(`}
					</span>
				</div>
			)}
		</>
	);
}

export default CustomButton;
