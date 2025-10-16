// import React from 'react'

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import AvatarEditor from "react-avatar-editor";
import CustomModalNoScroll from "../customs/CustomModalNoScroll";
import CustomAlertModal from "../customs/CustomAlertModal";
import CustomButton from "../customs/CustomButton";
import useDeviceSize from "../../services/hooks/useDeviceSize";
import useUser from "../../services/auth/useUser";
import useJWT from "../../services/auth/useJWT";

function ProfileChangePhotoModal({
	isModalOpen,
	setIsModalOpen,
	setProfilePicture,
	handleGetProfileAndBanner,
}) {
	const { patchUpdateProfilePicture } = useUser();

	const { getUserInfoFromJWT } = useJWT();
	const { isMobile } = useDeviceSize();
	const user = getUserInfoFromJWT() || [];

	const [profileImage, setProfileImage] = useState("");
	const [profilePictureName, setProfilePictureName] = useState(user.profile);
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [fetchMessage, setFetchMessage] = useState("");

	const [hasImage, setHasImage] = useState(false);
	const [hasCroppedImage, setHasCroppedImage] = useState("");
	const [profilePreview, setProfilePreview] = useState("");
	const [isInvalidImage, setIsInvalidImage] = useState(false);
	const [invalidImageMsg, setInvalidImageMsg] = useState(null);
	const [scale, setScale] = useState(1);
	const fileInputRef = useRef(null);
	const editorRef = useRef(null);

	const isValidImageFile = (file) => {
		const acceptedImageTypes = [
			"image/jpeg",
			"image/png",
			"image/gif",
			"image/webp",
		];
		return file && acceptedImageTypes.includes(file.type);
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (isValidImageFile(file)) {
			setHasImage(true);
			setHasCroppedImage(false);
			const reader = new FileReader();
			setProfilePreview(URL.createObjectURL(file));
			setHasImage(true);
			setProfileImage(file);
			reader.readAsDataURL(file);
		} else {
			setProfileImage("No file chosen");
			setIsInvalidImage(true);
			setInvalidImageMsg(
				<>
					Only image files are allowed
					<p className="w-full text-center">
						(.jpg, .jpeg, .png, or .webp)
					</p>
				</>
			);
		}
	};

	const handleDragOver = (event) => {
		event.preventDefault();
		event.stopPropagation();
	};

	const handleDragLeave = (event) => {
		event.preventDefault();
		event.stopPropagation();
	};

	const handleDrop = (event) => {
		event.preventDefault();
		event.stopPropagation();
		const file = event.dataTransfer.files[0];
		if (isValidImageFile(file)) {
			setProfileImage(file);
			setHasImage(true);
			setHasCroppedImage(false);
			if (fileInputRef.current) {
				fileInputRef.current.files = event.dataTransfer.files;
				const changeEvent = new Event("change", { bubbles: true });
				fileInputRef.current.dispatchEvent(changeEvent);
			}
		} else {
			setIsInvalidImage(true);
			setInvalidImageMsg(
				<>
					Only image files are allowed
					<p className="w-full text-center">(.jpg, .jpeg, or .png)</p>
				</>
			);
		}
	};

	const handleScaleChange = (e) => {
		setScale(parseFloat(e.target.value));
	};

	const handleSave = () => {
		if (editorRef.current) {
			const canvas = editorRef.current.getImage();
			const dataUrl = canvas.toDataURL();
			setProfilePreview(dataUrl);
			setHasImage(false);
			setHasCroppedImage(true);
			canvas.toBlob((blob) => {
				const croppedFile = new File([blob], profileImage.name, {
					type: profileImage.type,
					lastModified: Date.now(),
				});
				setProfileImage(croppedFile);
			}, profileImage.type);
		}
	};

	const handleConfirm = async () => {
		await patchUpdateProfilePicture(
			profileImage,
			setIsLoading,
			setIsSuccess,
			setIsError,
			setFetchMessage
		);
		handleGetProfileAndBanner();
	};

	useEffect(() => {
		if (isSuccess) {
			setIsModalOpen(false);
			handleGetProfileAndBanner();
		}
	}, [isSuccess]);

	const contentRef = useRef(null);
	const [isContentScrollable, setIsContentScrollable] = useState(false);
	useEffect(() => {
		const checkScrollability = () => {
			if (contentRef.current) {
				const { scrollHeight, clientHeight } = contentRef.current;
				setIsContentScrollable(scrollHeight > clientHeight);
			}
		};
		checkScrollability();
		window.addEventListener("resize", checkScrollability);
		return () => {
			window.removeEventListener("resize", checkScrollability);
		};
	}, [isModalOpen]);

	useEffect(() => {
		if (!isModalOpen) {
			setProfileImage("");
			setProfilePicture(profilePictureName);
			setHasImage(false);
			handleGetProfileAndBanner();
		}
		if (isModalOpen) {
			setProfilePicture("");
		}
	}, [isModalOpen]);

	const modalContent = (
		<>
			<div
				ref={contentRef}
				className="w-full h-full mt-2 pl-6 pt-2 pb-4 flex flex-col gap-3 overflow-x-hidden overflow-y-auto"
				style={{
					paddingRight:
						isContentScrollable && !isMobile ? "0.5rem" : "1.5rem",
				}}
			>
				<div
					className="w-full border-dashed border border-[var(--color-grey)] rounded-md p-4 text-center
                bg-[var(--color-grey-light)] hover:bg-[var(--color-bg-secondary)] flex flex-col items-center"
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
				>
					<div>
						{hasImage ? (
							<div>
								<AvatarEditor
									ref={editorRef}
									image={profilePreview}
									width={200}
									height={200}
									border={50}
									borderRadius={125}
									color={[0, 0, 0, 0.5]}
									scale={scale}
									style={{
										backgroundColor: "var(--color-grey)",
										borderRadius: "0.5rem",
									}}
								/>
								<div className="mt-2 w-full">
									<label className="font-semibold">
										Scale:
										<input
											className="w-full bg-[var(--color-grey)] accent-[var(--color-text)] rounded-lg appearance-none cursor-pointer"
											type="range"
											value={scale}
											min="1"
											max="2"
											step="0.01"
											onChange={handleScaleChange}
										/>
									</label>
								</div>
								<div className="w-full flex justify-center">
									<button
										className="px-4 py-3 bg-[var(--color-primary)] text-white rounded-lg"
										onClick={handleSave}
									>
										Save Image
									</button>
								</div>
							</div>
						) : hasCroppedImage ? (
							<img
								className="h-[10rem] w-[10rem] object-cover aspect-square"
								src={profilePreview}
								alt="profile_preview"
							/>
						) : (
							<span className="fa-solid fa-image text-[7rem] text-[var(--color-grey)]"></span>
						)}
					</div>
					{!hasImage && (
						<>
							<div className="font-medium mt-4">
								Drag & drop your image file here or
							</div>
							<div className="my-3">
								<input
									type="file"
									id="file"
									accept=".jpg,.jpeg,.png,.webp"
									className="hidden"
									ref={fileInputRef}
									onChange={handleFileChange}
								/>
								<motion.label
									htmlFor="file"
									className="w-[10rem] py-2 px-4 text-white leading-none bg-[var(--color-primary)] rounded-md cursor-pointer"
									whileHover={{ scale: 1.015 }}
									whileTap={{ scale: 0.975 }}
								>
									Choose File
								</motion.label>
							</div>
						</>
					)}
				</div>
			</div>

			<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
				<CustomButton
					buttonVariant="primary"
					buttonLabel="Confirm"
					buttonClick={handleConfirm}
					isLoading={isLoading}
					isDisabled={isLoading || !hasCroppedImage}
				/>
				<CustomButton
					buttonVariant="bordered"
					buttonLabel="Cancel"
					buttonClick={() => setIsModalOpen(false)}
					isDisabled={isLoading}
				/>
			</div>
		</>
	);
	return (
		<>
			<CustomModalNoScroll
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				modalSize="md"
				modalTitle="Change Profile Photo"
				modalTitleTWStyle="leading-none px-6"
				modalContent={modalContent}
				isCloseable
			/>

			<CustomAlertModal
				isModalOpen={isInvalidImage}
				modalVariant="error"
				modalMessage={invalidImageMsg}
				modalButtonClick={() => setIsInvalidImage(false)}
			/>

			<CustomAlertModal
				isModalOpen={isError}
				modalVariant="error"
				modalMessage={fetchMessage}
				modalButtonClick={() => setIsError(false)}
			/>
			<CustomAlertModal
				isModalOpen={isSuccess}
				modalVariant="success"
				modalMessage={fetchMessage}
				modalButtonClick={() => setIsSuccess(false)}
			/>
		</>
	);
}

export default ProfileChangePhotoModal;
