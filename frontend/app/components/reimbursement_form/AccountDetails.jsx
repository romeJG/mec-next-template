// import React from 'react'

import { AnimatePresence, motion } from "framer-motion";
import CustomSelect from "../customs/CustomSelect";
import CustomInput from "../customs/CustomInput";
import useUser from "../../apis/useUser";
import { useEffect, useState } from "react";

function AccountDetails({
	paymentMethods,
	paymentMethod,
	setPaymentMethod,
	totalAmount,
	gCashName,
	setGCashName,
	gCashNumber,
	setGCashNumber,
	bdoAccountName,
	setBdoAccountName,
	bdoAccountNumber,
	setBdoAccountNumber,
}) {
	const user = JSON.parse(localStorage.getItem("user-info"));
	const { getUserPaymentDetails } = useUser();

	const [isSettingsLoading, setIsSettingsLoading] = useState(false);
	const [profileSettings, setProfileSettings] = useState([]);
	const handleGetPaymentDetails = async () => {
		await getUserPaymentDetails(
			user.user_creds.email,
			setIsSettingsLoading,
			setProfileSettings
		);
	};

	const handleGCashNameChange = (value) => {
		setGCashName(value.toUpperCase());
	};

	const handleBdoNameChange = (value) => {
		setBdoAccountName(value.toUpperCase());
	};

	useEffect(() => {
		setBdoAccountName(profileSettings.bdo_name || "");
		setBdoAccountNumber(profileSettings.bdo_number || "");
		setGCashName(profileSettings.gcash_name || "");
		setGCashNumber(profileSettings.gcash_number || "");
	}, [profileSettings]);

	useEffect(() => {
		handleGetPaymentDetails();
	}, []);

	return (
		<>
			<div className="font-semibold text-gradient-soft text-[1.25rem] mt-4 mb-[-0.5rem] flex items-center gap-2">
				<span className="leading-none text-nowrap">
					PAYMENT DETAILS
				</span>
				<div className="w-full h-[2px] min-h-[2px] bg-[var(--color-accent-medium)] rounded-sm" />
			</div>
			<div className="w-full">
				<div className="w-full sm:w-[15rem]">
					<CustomSelect
						isCustomVariant
						selectLabel="Payment Method:"
						selectOptions={paymentMethods}
						selectedOption={paymentMethod}
						setSelectedOption={setPaymentMethod}
					/>
				</div>
			</div>
			<AnimatePresence>
				{parseFloat(totalAmount) > 3000 &&
					paymentMethod.value === 3 && (
						<motion.div
							key="bdo"
							className="w-full flex flex-col gap-4"
							initial={{ x: "-30%", opacity: 0 }}
							animate={{
								x: 0,
								opacity: 1,
								transition: {
									type: "spring",
									damping: 30,
									stiffness: 400,
								},
							}}
							// exit={{
							// 	x: "30%",
							// 	opacity: 0,
							// }}
						>
							<div className="w-full">
								<CustomInput
									inputType="text"
									inputLabel="BDO Account Name"
									inputNotes={
										isSettingsLoading ? (
											<span className="fa fa-spinner fa-spin mb-1"></span>
										) : (
											<span>
												First Name, Middle Initial. Last
												Name (Example: JUAN D. CRUZ)
											</span>
										)
									}
									inputValue={bdoAccountName}
									setInputValue={handleBdoNameChange}
									isRequired
								/>
							</div>
							<div className="w-full">
								<CustomInput
									inputType="number"
									inputLabel="BDO Account Number"
									inputNotes={
										isSettingsLoading ? (
											<span className="fa fa-spinner fa-spin mb-1"></span>
										) : (
											<span>
												Registered Number with MEC
											</span>
										)
									}
									inputValue={bdoAccountNumber}
									setInputValue={setBdoAccountNumber}
									isRequired
								/>
							</div>
						</motion.div>
					)}
				{paymentMethod.value === 2 && totalAmount <= 3000 && (
					<motion.div
						key="gcash"
						className="w-full flex flex-col gap-4"
						initial={{ x: "-30%", opacity: 0 }}
						animate={{
							x: 0,
							opacity: 1,
							transition: {
								type: "spring",
								damping: 30,
								stiffness: 400,
							},
						}}
						// exit={{
						// 	x: "30%",
						// 	opacity: 0,
						// }}
					>
						<div className="w-full">
							<CustomInput
								inputType="text"
								inputLabel="GCash Name"
								inputNotes={
									isSettingsLoading ? (
										<span className="fa fa-spinner fa-spin mb-1"></span>
									) : (
										<span>
											First Name, Middle Initial. Last
											Name (Example: JUAN D. CRUZ)
										</span>
									)
								}
								inputValue={gCashName}
								setInputValue={handleGCashNameChange}
								isRequired
							/>
						</div>
						<div className="w-full">
							<CustomInput
								inputType="number"
								inputLabel="GCash Number"
								inputNotes={
									isSettingsLoading ? (
										<span className="fa fa-spinner fa-spin mb-1"></span>
									) : (
										<span>Registered Number with MEC</span>
									)
								}
								inputValue={gCashNumber}
								setInputValue={setGCashNumber}
								isRequired
							/>
						</div>
					</motion.div>
				)}
				{paymentMethod.value === 1 && (
					<motion.div
						ket="petty"
						className="w-full p-4 py-10 flex flex-col justify-center items-center border border-spacing-0.5
									 border-[var(--color-grey)] bg-[var(--color-grey-light)] rounded-md text-center"
						initial={{ x: "-30%", opacity: 0 }}
						animate={{
							x: 0,
							opacity: 1,
							transition: {
								type: "spring",
								damping: 30,
								stiffness: 400,
							},
						}}
						// exit={{
						// 	x: "30%",
						// 	opacity: 0,
						// }}
					>
						<p>
							You have selected 'Petty Cash' as your payment
							method.
						</p>
						<p>
							Please coordinate with your respective approvers and
							adhere to petty cash guidelines.
						</p>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

export default AccountDetails;
