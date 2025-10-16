import { useEffect, useRef, useState } from "react";
import CustomModalNoScroll from "../customs/CustomModalNoScroll";
import CustomTimeline from "../customs/CustomTimeline";
import useDeviceSize from "../../hooks/useDeviceSize";

function ViewTimelineModal({
	timeline,
	isModalOpen,
	setIsModalOpen,
	modalTitle,
}) {
	const timelineJSON = timeline ? JSON.parse(timeline) : [];
	const { isMobile } = useDeviceSize();

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
				<CustomTimeline timelineContent={timelineJSON} />
			</div>
		</>
	);
	return (
		<>
			<CustomModalNoScroll
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				modalSize="md"
				modalTitle={modalTitle}
				modalTitleTWStyle="leading-none px-6"
				modalContent={modalContent}
				isCloseable
			/>
		</>
	);
}

export default ViewTimelineModal;
