// import React from 'react'

import { useEffect, useRef, useState } from "react";
import CustomModalNoScroll from "../customs/CustomModalNoScroll";
import CustomButton from "../customs/CustomButton";
import capitalizeEveryWord from "../../utils/capitalizeEveryWord";
import useDeviceSize from "../../services/hooks/useDeviceSize";
import useUser from "../../services/auth/useUser";
import useJWT from "../../services/auth/useJWT";

const bannerDesigns = [
	"profile-banner-gradient",
	"profile-banner-banig",
	"profile-banner-cubes",
	"profile-banner-lastikman",
	"profile-banner-bricks",
	"profile-banner-triangles",
	"profile-banner-office",
	"profile-banner-waves",
	"profile-banner-victorian",
	"profile-banner-picnic",
];

function ProfileChangeBannerModal({
	isModalOpen,
	setIsModalOpen,
	banner,
	handleGetProfileAndBanner,
	isBannerLoading,
	setIsBannerLoading,
}) {
	const [selectedBanner, setSelectedBanner] = useState("");
	const { patchUpdateProfileBanner } = useUser();
	const { getUserInfoFromJWT } = useJWT();
	const { isMobile } = useDeviceSize();

	const handleUpdateProfileBanner = async () => {
		setIsBannerLoading(true);
		await patchUpdateProfileBanner(selectedBanner, setIsBannerLoading);
		setIsModalOpen(false);
		handleGetProfileAndBanner();
	};

	useEffect(() => {
		if (isModalOpen) {
			setSelectedBanner(
				bannerDesigns.includes(banner) ? banner : bannerDesigns[0]
			);
		}
	}, [isModalOpen]);

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
					className={`${
						selectedBanner || "profile-banner-gradient"
					} w-full h-[7rem] min-h-[7rem] rounded-lg`}
				></div>
				<div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-2">
					{bannerDesigns.map((banner, index) => (
						<div className="w-full" key={index}>
							<div
								className={`${banner} ${banner}-preview w-full h-[3.5rem] min-h-[3.5rem] rounded-md hover:brightness-90 cursor-pointer p-2`}
								onClick={() => setSelectedBanner(banner)}
							>
								<span className="font-semibold py-[0.15rem] px-3 rounded-full bg-[rgba(255,255,255,0.90)] text-black shadow-lift">
									{capitalizeEveryWord(
										banner.split("-").pop()
									)}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
				<CustomButton
					buttonVariant="primary"
					buttonLabel="Confirm"
					buttonClick={handleUpdateProfileBanner}
					isLoading={isBannerLoading}
					isDisabled={isBannerLoading}
					// isDisabled={isLoading || !hasCroppedImage}
				/>
				<CustomButton
					buttonVariant="bordered"
					buttonLabel="Cancel"
					buttonClick={() => setIsModalOpen(false)}
					isDisabled={isBannerLoading}
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
				modalContent={modalContent}
				modalTitle="Change Profile Banner"
				modalTitleTWStyle="leading-none px-6"
				isCloseable
			/>
		</>
	);
}

export default ProfileChangeBannerModal;
