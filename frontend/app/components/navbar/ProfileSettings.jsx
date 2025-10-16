import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

//init profile picture
import user_init from "../../assets/user_init.png";

import CustomButton from "../customs/CustomButton";
import CustomAlertModal from "../customs/CustomAlertModal";

// custom hooks
import useJWT from "../../services/auth/useJWT";
import useAuth from "../../services/auth/useAuth";
import useUser from "../../services/auth/useUser";
import useProfileStore from "../../services/stores/useProfileStore";
import LoadingSpinner from "../animated/LoadingSpinner";

function ProfileSettings() {
	const { postLogout } = useAuth();

	const navigate = useNavigate();
	const { getUserInfoFromJWT, getJWT } = useJWT();
	const [userData, setuserData] = useState(getUserInfoFromJWT());
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [isError, setIsError] = useState(false);
	const [fetchMessage, setFetchMessage] = useState("");

	const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
	const profileButtonRef = useRef(null);
	const profileContentRef = useRef(null);
	// const [isProfileLoading, setIsProfileLoading] = useState(false);

	const { profilePicture, isProfileLoading, getProfilePhotoAndBanner } =
		useProfileStore();

	const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);

	const handleConfirmLogout = () => {
		setIsConfirmLogoutOpen(true);
	};

	const handleLogout = () => {
		postLogout(getJWT(), setIsLoggingOut, setIsError, setFetchMessage);
	};

	const handleGetProfilePicture = async () => {
		// await getProfilePhotoAndBanner(setProfilePicture, setIsProfileLoading);
	};

	const handleClickOutside = (event) => {
		if (
			profileButtonRef.current &&
			!profileButtonRef.current.contains(event.target) &&
			profileContentRef.current &&
			!profileContentRef.current.contains(event.target)
		) {
			setIsProfileSettingsOpen(false);
		}
	};

	useEffect(() => {
		if (isProfileSettingsOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isProfileSettingsOpen]);

	useEffect(() => {
		getProfilePhotoAndBanner();
	}, []);

	return (
		<>
			<div className="relative flex flex-col items-end">
				<motion.div
					className="w-10 h-10 overflow-hidden shadow-lift rounded-full cursor-pointer"
					ref={profileButtonRef}
					whileHover={{ scale: 1.025 }}
					whileTap={{ scale: 0.975 }}
					onClick={() =>
						setIsProfileSettingsOpen(!isProfileSettingsOpen)
					}
				>
					{isProfileLoading ? (
						<div className="w-full h-full rounded-full bg-[var(--color-bg-secondary)] z-[2] grid place-content-center">
							<LoadingSpinner
								loadingSpinnerSize="1rem"
								loadingSpinnerWidth="0.15rem"
								loadingSpinnerColor="var(--color-text)"
							/>
						</div>
					) : (
						<img
							src={profilePicture || user_init}
							alt="profile picture"
							className="w-full h-full"
						/>
					)}
				</motion.div>
				<AnimatePresence>
					{isProfileSettingsOpen && (
						<motion.div
							className="w-[20rem] min-w-[20rem] p-4 bg-[var(--color-bg)] shadow-lift rounded-lg flex flex-col gap-2 absolute"
							ref={profileContentRef}
							initial={{
								y: "0rem",
								opacity: 0,
							}}
							animate={{
								y: "2.75rem",
								opacity: 1,
							}}
							exit={{
								y: "0rem",
								opacity: 0,
							}}
						>
							<div className="w-full flex gap-2 items-center">
								<div className="w-16 h-16 min-w-16 min-h-16 rounded-full shadow-lift overflow-hidden">
									<img
										src={profilePicture || user_init}
										alt="profile picture"
										className="w-full h-full"
									/>
								</div>
								<div className="flex flex-col gap-1 leading-none">
									<span className="font-semibold">
										{userData.first_name +
											" " +
											userData.last_name}
									</span>
									<span className="text-[0.85rem] opacity-75">
										{userData.position}
									</span>
								</div>
							</div>
							<div className="w-full flex gap-2 mt-2">
								<CustomButton
									buttonVariant="bordered solid"
									buttonLabel={
										<div className="flex items-center leading-none text-[0.85rem]">
											<span>Profile Settings</span>
											<span className="fa-solid fa-gear text-[1.05rem]" />
										</div>
									}
									buttonClick={() =>
										navigate("/profile-settings")
									}
									buttonBorderWidth="2px"
									buttonSolidColor="var(--color-bg)"
									buttonLabelColor="var(--color-text)"
									buttonBorderColor="var(--color-grey)"
								/>
								<CustomButton
									buttonVariant="bordered solid"
									buttonClick={handleConfirmLogout}
									buttonLabel={
										<div className="flex gap-2 items-center leading-none text-[0.85rem]">
											{isLoggingOut ? (
												<>
													<span>Logging Out...</span>
												</>
											) : (
												<>
													<span>Logout</span>
													<span className="fa-solid fa-right-from-bracket text-[1.05rem]" />
												</>
											)}
										</div>
									}
									buttonBorderWidth="2px"
									buttonSolidColor="var(--color-bg)"
									buttonLabelColor="var(--color-text)"
									buttonBorderColor="var(--color-grey)"
									isDisabled={isLoggingOut}
								/>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<CustomAlertModal
				isModalOpen={isError}
				modalVariant="error"
				modalMessage={fetchMessage}
				modalButtonConfirm={() => setIsError(false)}
			/>

			<CustomAlertModal
				isModalOpen={isConfirmLogoutOpen}
				modalVariant="confirm"
				modalHeadline="Are you sure you want to log out?"
				modalMessage="Proceeding will log you out of the system."
				modalButtonConfirm={handleLogout}
				modalButtonClick={() => setIsConfirmLogoutOpen(false)}
				isLoading={isLoggingOut}
			/>
		</>
	);
}

export default ProfileSettings;
