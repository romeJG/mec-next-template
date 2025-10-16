import { useEffect, useRef, useState } from "react";
import CustomModalNoScroll from "./CustomModalNoScroll";
import useDeviceSize from "../../hooks/useDeviceSize";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import CustomMultipleSelect from "./CustomMultipleSelect";
import useUser from "../../apis/useUser";
import CustomFileUploadInput from "./CustomFileUploadInput";

function CustomEmailFormModal({
	isModalOpen,
	setIsModalOpen,
	emailFormTitle = "Email Form",
	emailFormSize = "md",
	to = [],
	setTo = () => {},
	cc = [],
	setCc = () => {},
	subject = "",
	setSubject = () => {},
	message = "",
	setMessage = () => {},
	attachments = [],
	setAttachments = () => {},
	handleSendEmail = () => {},
	isLoading,
}) {
	const { isMobile } = useDeviceSize();
	const { getAllUsersEmailName } = useUser();

	const handleFiles = (files) => {
		console.log("Files:", files);
	};

	const quillModules = {
		toolbar: [
			[{ header: [1, 2, 3, false] }],
			["bold", "italic", "underline", "strike"],
			[{ list: "ordered" }, { list: "bullet" }],
			[{ align: [] }],
			[{ color: [] }, { background: [] }],
			["link"],
			["clean"],
		],
	};

	const quillFormats = [
		"header",
		"bold",
		"italic",
		"underline",
		"strike",
		"list",
		"bullet",
		"align",
		"color",
		"background",
		"link",
		"image",
	];

	const [accounts, setAccounts] = useState([]);
	const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

	const handleGetAccounts = async () => {
		await getAllUsersEmailName(setAccounts, setIsLoadingAccounts);
	};

	const handleClose = () => {
		setIsModalOpen(false);
		setTo([]);
		setCc([]);
		setSubject("");
		setMessage("");
		setAttachments([]);
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
			handleGetAccounts();
		}
	}, [isModalOpen]);

	const modalContent = (
		<>
			<div
				ref={contentRef}
				className="w-full h-full mt-2 pl-6 pt-2 pb-0 flex flex-col gap-3 overflow-x-hidden overflow-y-auto leading-tight"
				style={{
					paddingRight:
						isContentScrollable && !isMobile ? "0.5rem" : "1.5rem",
				}}
			>
				<CustomMultipleSelect
					selectLabel="To:"
					selectPlaceHolder="Select recipients..."
					selectOptions={accounts}
					selectedOptions={to}
					setSelectedOptions={setTo}
					isShowValue
					isLoading={isLoadingAccounts}
					isDisabled={isLoadingAccounts}
					isWithSubOption
					isSubOptionValue
					isOptionWithBorder
				/>
				<CustomMultipleSelect
					selectLabel="CC: "
					selectPlaceHolder="Select recipients..."
					selectOptions={accounts}
					selectedOptions={cc}
					setSelectedOptions={setCc}
					isShowValue
					isLoading={isLoadingAccounts}
					isDisabled={isLoadingAccounts}
					isWithSubOption
					isSubOptionValue
					isOptionWithBorder
				/>
				<CustomInput
					inputLabel="Subject: "
					inputPlaceHolder="Enter subject here..."
					inputValue={subject}
					setInputValue={setSubject}
					inputType="text"
				/>
				<CustomFileUploadInput
					onChange={handleFiles}
					files={attachments}
					setFiles={setAttachments}
					inputLabel={`${
						attachments.length === 1 || attachments.length <= 0
							? "Attachment"
							: "Attachments"
					}:`}
				/>
				<div className="flex flex-col gap-2 pb-4">
					<label className="font-semibold leading-tight mb-[-0.5rem]">
						Message:
					</label>
					<ReactQuill
						theme="snow"
						value={message}
						onChange={setMessage}
						modules={quillModules}
						formats={quillFormats}
					/>
				</div>
			</div>
			<div className="w-full px-6 pt-2 border-t-2 border-[var(--color-grey)] flex gap-2 bg-[var(--color-bg)]">
				<CustomButton
					buttonVariant="primary"
					buttonLabel={
						<div className="flex items-center gap-2">
							<span>Send</span>
							<span className="fa-solid fa-paper-plane"></span>
						</div>
					}
					buttonClick={handleSendEmail}
					isLoading={isLoading}
					isDisabled={isLoading}
				/>
				<CustomButton
					buttonVariant="bordered"
					buttonLabel="Cancel"
					buttonClick={handleClose}
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
				modalTitle={emailFormTitle}
				modalSize={emailFormSize}
				modalContent={modalContent}
			/>
		</>
	);
}

export default CustomEmailFormModal;
