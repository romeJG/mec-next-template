import { useEffect, useRef, useState } from "react";
import { Camera } from "react-camera-pro";
import CustomButton from "../../customs/CustomButton";
import { AnimatePresence, motion } from "framer-motion";

const popUp = {
	hidden: {
		scale: 0.5,
		opacity: 0,
	},
	visible: {
		scale: 1,
		opacity: 1,
		transition: {
			duration: 0.1,
			type: "spring",
			damping: 25,
			stiffness: 500,
		},
	},
	exit: {
		scale: 0.5,
		opacity: 0,
	},
};

function CapturePhotoFullScreen({ isModalOpen, setIsModalOpen, setFiles }) {
	const cameraRef = useRef(null);
	const [image, setImage] = useState("");
	// const [cameraType, setCameraType] = useState("front");
	const [numberOfCameras, setNumberOfCameras] = useState(0);
	const [orientation, setOrientation] = useState(
		window.innerWidth > window.innerHeight ? "Landscape" : "Portrait"
	);

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
		const handleResize = () => {
			setOrientation(
				window.innerWidth > window.innerHeight
					? "Landscape"
					: "Portrait"
			);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		if (!isModalOpen) {
			setImage("");
		}
	}, [isModalOpen]);

	return (
		<>
			<AnimatePresence>
				{isModalOpen && (
					<motion.div
						className="fixed top-0 left-0 w-dvw h-dvh bg-[var(--color-bg-modal)] z-[9999]"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							className="w-full h-full rounded-xl flex flex-col items-center shadow-lift relative"
							onClick={(e) => e.stopPropagation()}
							variants={popUp}
							initial="hidden"
							animate="visible"
							exit="exit"
						>
							<div className="w-full">
								<div className="w-full">
									<div className="flex flex-col gap-2">
										<div className="w-full rounded-lg overflow-hidden bg-[var(--color-grey-light)] flex justify-center items-center relative">
											<div className="w-full flex flex-col justify-center items-center z-[2] absolute">
												<span className="fa-solid fa-camera text-[var(--color-grey-dark)] text-[4rem]" />
												<span className="text-[var(--color-grey-dark)] font-semibold">
													Loading Camera
												</span>
												<span className="fa-solid fa-spinner fa-spin text-[var(--color-grey-dark)] text-[1.5rem] mt-2" />
											</div>
											<div className="w-dvw h-dvh z-[3]">
												<Camera
													numberOfCamerasCallback={
														setNumberOfCameras
													}
													ref={cameraRef}
													// aspectRatio={16 / 9}
													style={{
														width: "100%",
														height: "100%",
														objectFit: "cover",
													}}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div
								className={`absolute top-0 left-0 w-dvw h-dvh flex z-[4]
									${orientation === "Landscape" ? "justify-end items-center" : "items-end"}
								`}
							>
								<div
									className={`${
										orientation === "Landscape"
											? "h-full flex flex-col justify-evenly items-center mr-10"
											: "w-full flex justify-evenly items-center mb-24"
									}`}
								>
									<motion.button
										className="min-w-[5rem] sm:min-w-[8rem] aspect-square rounded-full bg-white shadow-lift flex justify-center items-center cursor-pointer"
										whileHover={{
											scale: 1.025,
										}}
										whileTap={{
											scale: 0.95,
										}}
										onClick={handleSwitchCamera}
										disabled={
											numberOfCameras < 2 ? true : false
										}
									>
										<div className="text-[3rem] sm:text-[5rem] fa-solid fa-arrows-rotate text-[#393e46]"></div>
									</motion.button>
									<motion.button
										className="min-h-[7rem] sm:min-h-[12rem] border-[0.5rem] sm:border-[1.25rem] aspect-square rounded-full border-white shadow-lift flex justify-center items-center cursor-pointer"
										whileHover={{
											scale: 1.025,
										}}
										whileTap={{
											scale: 0.95,
										}}
										onClick={handleTakePhoto}
										disabled={
											numberOfCameras < 1 ? true : false
										}
									>
										<div className="w-[70%] aspect-square rounded-full bg-[var(--color-primary)] opacity-50"></div>
									</motion.button>
									<motion.button
										className="min-w-[5rem] sm:min-w-[8rem] aspect-square rounded-full bg-white shadow-lift flex justify-center items-center cursor-pointer"
										whileHover={{
											scale: 1.025,
										}}
										whileTap={{
											scale: 0.95,
										}}
										onClick={() => setIsModalOpen(false)}
										disabled={
											numberOfCameras < 1 ? true : false
										}
									>
										<div className="text-[3rem] sm:text-[5rem] fa-solid fa-xmark text-[#393e46]"></div>
									</motion.button>
								</div>
							</div>
							{image && (
								<div className="absolute w-dvw h-dvh z-[5] flex justify-center items-center">
									<div
										className={`flex flex-col gap-2 justify-between h-full w-full`}
									>
										<img
											src={image}
											alt="image captured"
											className="w-full"
										/>
										<div className="absolute h-full w-full flex items-end justify-center gap-20 pb-20">
											<motion.div
												className="min-w-[5rem] sm:min-w-[8rem] min-h-[5rem] sm:min-h-[8rem] aspect-square rounded-full bg-white/50 shadow-lift flex justify-center items-center cursor-pointer"
												whileHover={{
													scale: 1.025,
												}}
												whileTap={{
													scale: 0.95,
												}}
												onClick={handleSubmitPhoto}
											>
												<div className="text-[3rem] sm:text-[5rem] fa-solid fa-check text-[#393e46]"></div>
											</motion.div>
											<motion.div
												className="min-w-[5rem] sm:min-w-[8rem] min-h-[5rem] sm:min-h-[8rem] aspect-square rounded-full bg-white/50 shadow-lift flex justify-center items-center cursor-pointer"
												whileHover={{
													scale: 1.025,
												}}
												whileTap={{
													scale: 0.95,
												}}
												onClick={() => setImage("")}
											>
												<div className="text-[3rem] sm:text-[5rem] fa-solid fa-arrow-rotate-left text-[#393e46]"></div>
											</motion.div>
										</div>
									</div>
								</div>
							)}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

export default CapturePhotoFullScreen;
