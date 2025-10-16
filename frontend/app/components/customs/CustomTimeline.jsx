// import { motion } from "framer-motion";
import { format } from "date-fns";

function CustomTimeline({ timelineContent }) {
	return (
		<>
			<ol className="relative border-s-2 border-[var(--color-primary)] translate-x-[0.75rem]">
				{timelineContent.map((timeline, index) => (
					<li
						key={index}
						className="relative flex flex-col pl-6 mb-4"
					>
						<div className="bg-[var(--color-primary)] text-white w-7 h-7 rounded-full translate-x-[calc(-2.375rem-1px)] grid place-content-center text-center absolute">
							<span
								className={`${timeline.icon} text-[0.75rem] leading-none`}
							/>
						</div>
						<span className="text-[1.15rem] font-semibold leading-none mt-[0.375rem] mb-1">
							{timeline.title}
						</span>
						<span className="text-[0.85rem] mb-2 text-[var(--color-grey-dark)]">
							{format(
								timeline.timestamp,
								"MM/dd/yyyy • hh:mm aa"
							)}
						</span>
						{/* <p className="leading-none">{timeline.description}</p> */}
						<div className="flex gap-1 ">
							<span>
								{timeline.action + " by: " + timeline.action_by}
							</span>
						</div>
						{timeline.note && (
							<div className="mt-2 p-2 w-[calc(100%-1rem)] rounded-md border border-[var(--color-grey)] bg-[var(--color-grey-light)]">
								<div className="flex gap-1 leading-none">
									<span className="font-semibold">
										Remarks:
									</span>
									<p>{timeline.note}</p>
								</div>
							</div>
						)}
					</li>
				))}
			</ol>
		</>
	);
}

export default CustomTimeline;
