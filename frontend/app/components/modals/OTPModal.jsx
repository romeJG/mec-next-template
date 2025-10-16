import { useEffect, useRef, useState } from "react";
import SolidCircleShield from "../animated/SolidCircleShield";
import CustomModal from "../customs/CustomModal";
import CustomButton from "../customs/CustomButton";

function OTPModal({
	isModalOpen,
	setIsModalOpen,
	setOTPValue,
	handleGenerateOTP,
	handleVerifyOTP,
	isLoading,
}) {
	const [otp, setOtp] = useState(new Array(6).fill(""));
	const [counter, setCounter] = useState(0);
	const [isCounting, setIsCounting] = useState(true);
	const inputRefs = useRef([]);

	useEffect(() => {
		focusFirstInput();
		setCounter(30);
	}, [isModalOpen]);

	const focusFirstInput = () => {
		// Focus the first input when the modal opens
		if (isModalOpen && inputRefs.current[0]) {
			inputRefs.current[0].focus();
		}
	};

	const handleChange = (element, index) => {
		setOtp([
			...otp.map((d, idx) =>
				idx === index ? element.value.toUpperCase() : d
			),
		]);

		if (element.nextSibling && element.value) {
			element.nextSibling.select();
		}
	};

	const handleKeyDown = (event, index) => {
		if (event.key === "Backspace") {
			if (otp[index] === "") {
				if (event.target.previousSibling) {
					event.target.previousSibling.focus();
				}
			}
		}
		if (event.key === "Enter" && !isLoading) {
			handleVerifyOTP();
		}
	};

	const handlePaste = (e) => {
		const pastedData = e.clipboardData
			.getData("Text")
			.toUpperCase()
			.slice(0, 6);
		const otpArray = [...otp];

		for (let i = 0; i < pastedData.length; i++) {
			if (i < otpArray.length) {
				otpArray[i] = pastedData[i];
				if (inputRefs.current[i]) {
					inputRefs.current[i].value = pastedData[i];
				}
			}
		}
		setOtp(otpArray);

		const nextIndex = Math.min(
			pastedData.length,
			inputRefs.current.length - 1
		);
		if (inputRefs.current[nextIndex]) {
			inputRefs.current[nextIndex].focus();
		}
	};

	useEffect(() => {
		setOTPValue(otp.join(""));
	}, [otp]);

	useEffect(() => {
		if (isCounting) {
			const timer = setInterval(() => {
				setCounter((prevCounter) => {
					if (prevCounter > 0) {
						return prevCounter - 1;
					} else {
						clearInterval(timer);
						setIsCounting(false);
						return prevCounter;
					}
				});
			}, 1000);

			return () => clearInterval(timer);
		}
	}, [isCounting]);

	const handleResendOTP = (e) => {
		setCounter(60);
		setIsCounting(true);
		focusFirstInput();
		setOtp(new Array(6).fill(""));
		handleGenerateOTP(e);
	};

	const otpModalContent = (
		<>
			<div className="w-full flex flex-col items-center text-center sm:p-2">
				<SolidCircleShield />
				<div className="text-gradient mt-4 mb-1 font-bold text-[2rem] leading-none">
					OTP VERIFICATION
				</div>
				<p className="leading-none">
					Enter the verification code sent to your email address.
				</p>
				<div className="mt-8 mb-4 flex justify-center gap-2">
					{otp.map((data, index) => (
						<input
							className="otp-input w-[2.75rem] text-[2.75rem] sm:w-[3.5rem] py-1 sm:text-[4rem] border-2 border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-lg text-center font-semibold font-mono leading-none"
							key={index}
							type="text"
							name="otp"
							maxLength="1"
							value={data}
							onChange={(e) => handleChange(e.target, index)}
							onKeyDown={(e) => handleKeyDown(e, index)}
							onPaste={handlePaste}
							ref={(ref) => (inputRefs.current[index] = ref)}
						/>
					))}
				</div>
				<div className="w-full flex flex-col sm:block font-semibold leading-none">
					<span className="w-full sm:w-auto">
						{!isCounting && "Haven't received the OTP?"}
					</span>

					<span className="w-full flex justify-center">
						<CustomButton
							buttonVariant="solid"
							buttonLabel={
								<>
									{isCounting ? (
										<span className="w-full sm:w-auto text-[var(--color-accent-medium)] pl-1 font-bold cursor-pointer">
											Please wait {counter + "s"} to
											resend
										</span>
									) : (
										<span className="w-full sm:w-auto text-[var(--color-accent-medium)] pl-1 font-bold cursor-pointer">
											RESEND OTP
										</span>
									)}
								</>
							}
							buttonSolidColor="none"
							buttonWidth="auto"
							buttonClick={handleResendOTP}
							isDisabled={isCounting}
						/>
					</span>
				</div>
				<div className="w-full mt-6">
					<CustomButton
						buttonVariant="primary"
						buttonLabel="VERIFY OTP"
						buttonClick={handleVerifyOTP}
						isScaledOnHover
						isLoading={isLoading}
						isDisabled={isLoading}
					/>
				</div>
			</div>
		</>
	);

	return (
		<>
			<CustomModal
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				modalSize="sm"
				modalContent={otpModalContent}
			/>
		</>
	);
}

export default OTPModal;
