import { useLayoutEffect, useRef } from "react";

function CustomTextArea({
	inputLabel,
	inputPlaceHolder = "Enter " + inputLabel,
	inputValue,
	setInputValue,
	inputNotes,
	inputLabelSize = "1rem",
	inputTextSize = "1rem",
	isReadOnly = false,
	isRequired = false,
	isDisabled = false,
}) {
	const MIN_TEXTAREA_HEIGHT = 100;
	const textareaRef = useRef(null);
	useLayoutEffect(() => {
		textareaRef.current.style.height = "inherit";
		textareaRef.current.style.height = `${Math.max(
			textareaRef.current.scrollHeight,
			MIN_TEXTAREA_HEIGHT
		)}px`;
	}, [inputValue]);

	return (
		<>
			<div className="w-full">
				<label
					className="font-semibold text-color inline-block"
					style={{
						fontSize: inputLabelSize,
					}}
				>
					{inputLabel}
					{isRequired && (
						<span className="text-[var(--color-secondary)]">*</span>
					)}
				</label>
				{inputNotes && (
					<div className="w-full flex justify-start text-[0.85rem] text-[var(--color-grey-dark)] italic mb-1">
						{inputNotes}
					</div>
				)}
				<textarea
					ref={textareaRef}
					className="custom-textarea min-h-[2.75rem] w-full p-2 rounded-md resize-y overflow-y-hidden"
					style={{
						fontSize: inputTextSize,
						lineHeight: 1,
						background: "var(--color-grey-light)",
						resize: (isDisabled || isReadOnly) && "none",
						color:
							(isDisabled || isReadOnly) &&
							"var(--color-grey-dark)",
					}}
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder={inputPlaceHolder}
					disabled={isDisabled}
					readOnly={isReadOnly}
					required={isRequired}
				></textarea>
			</div>
		</>
	);
}

export default CustomTextArea;
