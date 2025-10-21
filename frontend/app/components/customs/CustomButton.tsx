"use client";

import { motion } from "framer-motion";
import React from "react";
import LoadingSpinner from "../animated/LoadingSpinner";

type ButtonVariant =
	| "primary"
	| "secondary"
	| "bordered"
	| "solid"
	| "bordered solid";

interface CustomButtonProps {
	buttonVariant: ButtonVariant;
	buttonLabel: React.ReactNode;
	buttonLabelSize?: string;
	buttonTitle?: string;
	buttonWidth?: string;
	buttonHeight?: string;
	buttonLabelColor?: string;
	buttonSolidColor?: string;
	buttonBorderColor?: string;
	buttonBorderWidth?: string;
	buttonClick?: React.MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
	isLoading?: boolean;
	isScaledOnHover?: boolean;
	isDarkendOnHover?: boolean;
	isDisabled?: boolean;
	isWithTitle?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
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
}) => {
	const hoverEffect = {
		scale: isScaledOnHover ? 1.015 : 1,
		filter: isDarkendOnHover ? "brightness(95%)" : "none",
		transition: {
			duration: 0.1,
			ease: "easeInOut" as const,
		},
	};

	const tapEffect = { scale: 0.985 };

	const baseStyle: React.CSSProperties = {
		width: buttonWidth,
		height: buttonHeight,
		fontSize: buttonLabelSize,
		opacity: isDisabled ? 0.75 : 1,
		cursor: isDisabled ? "not-allowed" : "pointer",
	};

	const renderSpinner = (color: string) => (
		<LoadingSpinner
			loadingSpinnerSize="1.5rem"
			loadingSpinnerWidth="0.25rem"
			loadingSpinnerColor={color}
		/>
	);

	switch (buttonVariant) {
		case "primary":
			return (
				<motion.button
					className="bg-gradient-primary py-2 px-4 rounded-md font-semibold text-white grid place-content-center text-center"
					style={baseStyle}
					whileHover={hoverEffect}
					whileTap={tapEffect}
					disabled={isDisabled}
					onClick={buttonClick}
					title={isWithTitle ? buttonTitle : ""}
				>
					{isLoading ? renderSpinner("white") : buttonLabel}
				</motion.button>
			);
		case "secondary":
			return (
				<motion.button
					className="bg-gradient-secondary py-2 px-4 rounded-md text-white font-semibold grid place-content-center text-center"
					style={baseStyle}
					whileHover={hoverEffect}
					whileTap={tapEffect}
					disabled={isDisabled}
					onClick={buttonClick}
					title={isWithTitle ? buttonTitle : ""}
				>
					{isLoading ? renderSpinner("white") : buttonLabel}
				</motion.button>
			);

		case "bordered":
			return (
				<motion.button
					className="relative py-2 px-4 font-bold bg-transparent rounded-lg grid place-content-center text-center"
					style={baseStyle}
					whileHover={hoverEffect}
					whileTap={tapEffect}
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
							<span className="flex items-center justify-center h-full w-full bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-accent-medium)] to-[var(--color-primary)]">
								{isLoading
									? renderSpinner("var(--color-primary)")
									: buttonLabel}
							</span>
						</span>
					</span>
				</motion.button>
			);

		case "solid":
			return (
				<motion.button
					className="py-2 px-4 rounded-md font-semibold grid place-content-center text-center"
					style={{
						...baseStyle,
						background: buttonSolidColor,
						color: buttonLabelColor,
					}}
					whileHover={hoverEffect}
					whileTap={tapEffect}
					disabled={isDisabled}
					onClick={buttonClick}
					title={isWithTitle ? buttonTitle : ""}
				>
					{isLoading ? renderSpinner(buttonLabelColor) : buttonLabel}
				</motion.button>
			);

		case "bordered solid":
			return (
				<motion.div
					className="py-[calc(0.5rem-3px)] px-4 rounded-md font-semibold grid place-content-center text-center box-border cursor-pointer"
					style={{
						...baseStyle,
						background: buttonSolidColor,
						border: `${buttonBorderWidth} solid ${buttonBorderColor}`,
						color: buttonLabelColor,
					}}
					whileHover={hoverEffect}
					whileTap={tapEffect}
					onClick={buttonClick}
					title={isWithTitle ? buttonTitle : ""}
				>
					{isLoading ? renderSpinner(buttonLabelColor) : buttonLabel}
				</motion.div>
			);

		default:
			return (
				<div
					className="w-full py-2 px-4 bg-[var(--color-secondary)] rounded-md grid place-content-center text-center"
					style={{ height: buttonHeight }}
				>
					<span className="font-semibold text-white leading-none">
						Sorry, there is no such button variant :(
					</span>
				</div>
			);
	}
};

export default CustomButton;
