import { motion } from "framer-motion";
import SidebarExpandButton from "./SidebarExpandButton";

function NavbarTitle({
	logo,
	title,
	isSidebarCollapsed,
	isSidebarScrollable,
	handleExpandSidebar,
}) {
	return (
		<>
			<motion.div
				className="h-full pr-2 flex items-center justify-between"
				initial={{
					width: isSidebarCollapsed
						? `${isSidebarScrollable ? "5rem" : "4rem"}`
						: "18rem",
					minWidth: isSidebarCollapsed
						? `${isSidebarScrollable ? "5rem" : "4rem"}`
						: "18rem",
				}}
				animate={{
					width: isSidebarCollapsed
						? `${isSidebarScrollable ? "5rem" : "4rem"}`
						: "18rem",
					minWidth: isSidebarCollapsed
						? `${isSidebarScrollable ? "5rem" : "4rem"}`
						: "18rem",
				}}
				transition={{
					delay: isSidebarCollapsed ? 0 : 0.2,
				}}
			>
				<div className="w-full h-full flex items-center">
					<motion.div
						className="h-full bg-[var(--color-bg)] flex justify-center items-center pl-4 pr-2 z-[5]"
						initial={{
							width: isSidebarCollapsed
								? `${isSidebarScrollable ? "5rem" : "4rem"}`
								: "4rem",
							minWidth: isSidebarCollapsed
								? `${isSidebarScrollable ? "5rem" : "4rem"}`
								: "4rem",
						}}
						animate={{
							width: isSidebarCollapsed
								? `${isSidebarScrollable ? "5rem" : "4rem"}`
								: "4rem",
							minWidth: isSidebarCollapsed
								? `${isSidebarScrollable ? "5rem" : "4rem"}`
								: "4rem",
						}}
					>
						<img
							className="w-9 min-w-9 max-w-9 aspect-square"
							src={logo}
							alt="logo"
						/>
					</motion.div>
					<motion.span
						className="text-[1.5rem] font-semibold text-color z-[4]"
						initial={{
							opacity: isSidebarCollapsed ? 0 : 1,
							marginLeft: isSidebarCollapsed ? "-10rem" : 0,
						}}
						animate={{
							opacity: isSidebarCollapsed ? 0 : 1,
							marginLeft: isSidebarCollapsed ? "-10rem" : 0,
						}}
						transition={{
							delay: isSidebarCollapsed ? 0 : 0.2,
						}}
					>
						{title}
					</motion.span>
				</div>
				<SidebarExpandButton
					handleClick={handleExpandSidebar}
					isClicked={isSidebarCollapsed}
				/>
			</motion.div>
		</>
	);
}

export default NavbarTitle;
