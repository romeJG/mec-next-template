import { useState } from "react";
import { motion } from "framer-motion";

const CustomButtonGroup = ({
	options,
	onSelect,
	defaultSelected = { value: 0, label: options[0] },
}) => {
	const [selected, setSelected] = useState(defaultSelected);

	const handleSelect = (index, value) => {
		setSelected({
			value: index,
			label: value,
		});
		onSelect &&
			onSelect({
				value: index,
				label: value,
			});
	};

	return (
		<div className="overflow-x-auto flex scrollbar-hide">
			<div className="flex gap-[1.5px] p-[1.5px] bg-[var(--color-grey)] rounded-lg">
				{options.map((option, index) => (
					<div
						key={index}
						className="pb-1 pt-[calc(0.25rem+1.5px)] px-6 bg-[var(--color-bg)] flex flex-col items-center gap-[1.5px] 
                    first-of-type:rounded-s-md last-of-type:rounded-e-md cursor-pointer hover:bg-[var(--color-grey-light)]"
						onClick={() => handleSelect(index, option)}
					>
						<span className="font-semibold truncate">{option}</span>
						<motion.div
							className="h-[3px] bg-[var(--color-primary)] rounded-md"
							animate={{
								width: selected.value === index ? "50%" : "0%",
							}}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default CustomButtonGroup;
