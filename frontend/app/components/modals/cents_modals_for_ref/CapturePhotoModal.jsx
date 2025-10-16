import { useEffect, useRef, useState } from "react";
import { Camera } from "react-camera-pro";
import CustomModal from "../../customs/CustomModal";
import CustomButton from "../../customs/CustomButton";

function CapturePhotoModal({ isModalOpen, setIsModalOpen, setFiles }) {
	const cameraRef = useRef(null);
	const [image, setImage] = useState("");
	// const [cameraType, setCameraType] = useState("front");
	const [numberOfCameras, setNumberOfCameras] = useState(0);

	const handleTakePhoto = (e) => {
		e.preventDefault();
		setImage(cameraRef.current.takePhoto());
	};

	const handleSwitchCamera = (e) => {
		e.preventDefault();
		// setCameraType((prevType) => (prevType === "front" ? "back" : "front"));
		cameraRef.current.switchCamera();
	};

	const handleSubmitPhoto = (e) => {
		e.preventDefault();
		const date = new Date().toISOString().split("T")[0];
		const randomString = Math.random().toString(36).substring(2, 8);
		const fileName = `image_${date}_${randomString}.jpg`;

		// Convert base64 to Blob
		const byteString = atob(image.split(",")[1]);
		const arrayBuffer = new ArrayBuffer(byteString.length);
		const uintArray = new Uint8Array(arrayBuffer);

		for (let i = 0; i < byteString.length; i++) {
			uintArray[i] = byteString.charCodeAt(i);
		}

		const blob = new Blob([uintArray], { type: "image/jpeg" });
		const file = new File([blob], fileName, { type: "image/jpeg" });

		setFiles((prevFiles) => [...prevFiles, file]);
		setImage("");
		setIsModalOpen(false);
	};

	useEffect(() => {
		if (!isModalOpen) {
			setImage("");
		}
	}, [isModalOpen]);

	const modalContent = (
		<>
			<div className="flex flex-col gap-2">
				<div className="w-full rounded-lg overflow-hidden bg-[var(--color-grey-light)] flex justify-center items-center relative">
					<div className="w-full flex flex-col justify-center items-center z-[2] absolute">
						<span className="fa-solid fa-camera text-[var(--color-grey-dark)] text-[4rem]" />
						<span className="text-[var(--color-grey-dark)] font-semibold">
							Loading Camera
						</span>
						<span className="fa-solid fa-spinner fa-spin text-[var(--color-grey-dark)] text-[1.5rem] mt-2" />
					</div>
					<div className="w-full z-[3]">
						{image ? (
							<img
								src={image}
								alt="image captured"
								className="aspect-video w-full"
							/>
						) : (
							<Camera
								numberOfCamerasCallback={setNumberOfCameras}
								ref={cameraRef}
								aspectRatio={16 / 9}
								// cameraType={cameraType}
							/>
						)}
					</div>
				</div>
				{image ? (
					<div className="flex flex-col sm:flex-row gap-2">
						<CustomButton
							buttonVariant="solid"
							buttonLabel="Submit Photo"
							buttonSolidColor="var(--color-primary)"
							buttonLabelColor="white"
							buttonClick={handleSubmitPhoto}
							isScaledOnHover={false}
							isDarkendOnHover
						/>
						<CustomButton
							buttonVariant="bordered solid"
							buttonLabel="Retake Photo"
							buttonBorderColor="var(--color-primary)"
							buttonSolidColor="var(--color-bg)"
							buttonLabelColor="var(--color-primary)"
							buttonClick={() => setImage("")}
							isScaledOnHover={false}
							isDarkendOnHover
						/>
					</div>
				) : (
					<div className="flex flex-col sm:flex-row gap-2">
						<CustomButton
							buttonVariant="solid"
							buttonLabel="Take Photo"
							buttonSolidColor="var(--color-primary)"
							buttonLabelColor="white"
							buttonClick={handleTakePhoto}
							isScaledOnHover={false}
							isDarkendOnHover
						/>
						{numberOfCameras >= 1 && (
							<CustomButton
								buttonVariant="bordered solid"
								buttonLabel="Switch Camera"
								buttonSolidColor="var(--color-bg)"
								buttonBorderColor="var(--color-primary)"
								buttonLabelColor="var(--color-primary)"
								buttonClick={handleSwitchCamera}
								isScaledOnHover={false}
								isDarkendOnHover
							/>
						)}
					</div>
				)}
			</div>
		</>
	);

	return (
		<CustomModal
			isModalOpen={isModalOpen}
			setIsModalOpen={setIsModalOpen}
			modalSize="md"
			modalTitle="Take a Photo"
			modalContent={modalContent}
			isCloseable
		/>
	);
}

export default CapturePhotoModal;
