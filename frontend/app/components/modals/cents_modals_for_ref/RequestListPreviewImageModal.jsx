import { useEffect, useRef, useState } from "react";
import CustomModalNoScroll from "../customs/CustomModalNoScroll";
import useReimbursement from "../../apis/useReimbursement";
import LoadingSpinner from "../animated/LoadingSpinner";
import useDeviceSize from "../../hooks/useDeviceSize";

function RequestListPreviewImageModal({
	isModalOpen,
	setIsModalOpen,
	imageName,
}) {
	const { getReceiptImage } = useReimbursement();
	const { isMobile } = useDeviceSize();
	const [image, setImage] = useState("");
	const [isImageLoading, setIsImageLoading] = useState(false);

	const handleGetImage = async () => {
		await getReceiptImage(imageName, setImage, setIsImageLoading);
	};

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
		if (isModalOpen) {
			handleGetImage();
		}
	}, [isModalOpen]);

	const modalContent = (
		<>
			<span className="w-full px-6 font-semibold mb-1">{imageName}</span>
			<div
				ref={contentRef}
				className="w-full h-full pl-6 pt-2 pb-4 flex flex-col overflow-x-hidden overflow-y-auto"
				style={{
					paddingRight:
						isContentScrollable && !isMobile ? "0.5rem" : "1.5rem",
				}}
			>
				<div className="w-full flex justify-center">
					{isImageLoading ? (
						<>
							<div className="w-full h-[12rem] grid place-content-center bg-[var(--color-grey-light)] border border-[var(--color-grey)] rounded-md">
								<LoadingSpinner
									loadingSpinnerColor="var(--color-primary)"
									loadingSpinnerWidth="0.5rem"
									loadingSpinnerSize="5rem"
								/>
							</div>
						</>
					) : (
						<div className="w-full aspect-video flex justify-center bg-[var(--color-grey-light)] border border-[var(--color-grey)] rounded-md overflow-hidden p-2">
							<img
								src={image}
								alt="image preview"
								className="h-full object-cover"
							/>
						</div>
					)}
				</div>
			</div>
		</>
	);
	return (
		<>
			<CustomModalNoScroll
				modalSize="lg"
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				modalContent={modalContent}
				modalTitle="Image Preview"
				modalTitleTWStyle="leading-none px-6"
				isCloseable
			/>
		</>
	);
}

export default RequestListPreviewImageModal;
