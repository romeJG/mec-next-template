import CustomButton from "../../customs/CustomButton";
import CustomModalNoScroll from "../../customs/CustomModalNoScroll";
import { useState, useEffect, useRef } from "react";
import useDeviceSize from "../../../hooks/useDeviceSize";

function ChooseRequestTypeModal({
	isModalOpen,
	setIsModalOpen,
	typeOptions,
	scanForType,
	setScanForType,
	setIsTypeSelected,
}) {
	const { isMobile } = useDeviceSize();
	const [selectedItem, setSelectedItem] = useState(0);

	const handleRadioChange = (value, index) => {
		setSelectedItem(index);
		setScanForType(value);
	};

	const handleSelectType = (e) => {
		e.preventDefault();
		setIsTypeSelected(true);
		setIsModalOpen(false);
	};

	useEffect(() => {
		if (isModalOpen) {
			setSelectedItem(0);
			setScanForType(typeOptions[0]);
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
				<div className="w-full flex flex-col gap-2">
					{typeOptions.length > 0 ? (
						typeOptions.map((option, index) => (
							<div
								key={index}
								className={`w-full p-2 rounded-md border border-[var(--color-grey)] hover:bg-[var(--color-bg-secondary)] cursor-pointer ${
									index === selectedItem
										? "border-[var(--color-primary)]"
										: ""
								}`}
								onClick={() => handleRadioChange(option, index)}
							>
								<div>{option.label}</div>
							</div>
						))
					) : (
						<></>
					)}
				</div>
			</div>

			<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
				<CustomButton
					buttonVariant="primary"
					buttonLabel="Select"
					buttonClick={handleSelectType}
				/>
				<CustomButton
					buttonVariant="bordered"
					buttonLabel="Cancel"
					buttonClick={(e) => {
						e.preventDefault();
						setIsModalOpen(false);
					}}
				/>
			</div>
		</>
	);

	return (
		<>
			<CustomModalNoScroll
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				modalTitle="Reimbursement Type"
				modalTitleTWStyle="leading-none px-6"
				modalContent={modalContent}
				modalSize="sm"
				isCloseable
			/>
		</>
	);
}

export default ChooseRequestTypeModal;
