import { AnimatePresence, motion } from "framer-motion";
import SidebarExpandButton from "./SidebarExpandButton";
import { NavLink } from "react-router-dom";
import { useState } from "react";

function SidebarDefault({
	sidebarRef,
	isSidebarCollapsed,
	isSidebarScrollable,
	handleExpandSidebar,
	userAccess,
}) {
	const roleKeys = Object.keys(userAccess);
	const [collapsedRoles, setCollapsedRoles] = useState(() => {
		// initialize all roles to be collapsed if they have multiple roles
		if (roleKeys.length === 1) {
			return { [roleKeys[0]]: false };
		}
		return roleKeys.reduce((acc, key) => ({ ...acc, [key]: true }), {});
	});
	const toggleRole = (roleKey) => {
		setCollapsedRoles((prev) => {
			const isCurrentlyOpen = !prev[roleKey];
			const newState = {};

			for (const key in prev) {
				newState[key] = true; // collapse all by default
			}

			newState[roleKey] = isCurrentlyOpen; // then toggle the clicked one

			return newState;
		});
	};

	return (
		<>
			<motion.div
				className="h-full bg-[var(--color-bg)] z-[998] shadow-lift"
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
				<div className="h-full w-full flex flex-col overflow-hidden">
					<motion.div
						className="w-full h-8 flex justify-center items-center pl-2"
						initial={{
							marginTop: isSidebarCollapsed ? "1rem" : "-2rem",
						}}
						animate={{
							marginTop: isSidebarCollapsed ? "1rem" : "-2rem",
						}}
						transition={{
							delay: isSidebarCollapsed ? 0.2 : 0,
						}}
					>
						<SidebarExpandButton
							handleClick={handleExpandSidebar}
							isClicked={isSidebarCollapsed}
						/>
					</motion.div>

					<motion.div
						className="h-full pt-4 pb-4 flex flex-col gap-2 overflow-y-auto"
						ref={sidebarRef}
						initial={{
							paddingRight: isSidebarCollapsed
								? `${
										isSidebarScrollable
											? "0.25rem"
											: "0.5rem"
								  }`
								: `${isSidebarScrollable ? "0.5rem" : "1rem"}`,
							paddingLeft: isSidebarCollapsed ? "0.5rem" : "1rem",
						}}
						animate={{
							paddingRight: isSidebarCollapsed
								? `${
										isSidebarScrollable
											? "0.25rem"
											: "0.5rem"
								  }`
								: `${isSidebarScrollable ? "0.5rem" : "1rem"}`,
							paddingLeft: isSidebarCollapsed ? "0.5rem" : "1rem",
						}}
					>
						<div className="sidebar_navlink_wrap flex flex-col gap-2">
							<NavLink
								className="w-full h-12 p-4 rounded-md flex items-center gap-2 bg-[var(--color-grey-light)] brightness-[97%] hover:brightness-110 hover:bg-[var(--color-grey)]"
								to="/dashboard"
								title="Dashboard"
							>
								<span className="fa fa-house w-6 min-w-6" />
								{!isSidebarCollapsed && (
									<span className="font-semibold truncate">
										Dashboard
									</span>
								)}
							</NavLink>
							<NavLink
								className="w-full h-12 p-4 mb-4 rounded-md flex items-center gap-2 bg-[var(--color-grey-light)] brightness-[97%] hover:brightness-110 hover:bg-[var(--color-grey)]"
								to="/profile-settings"
								title="Profile Settings"
							>
								<span className="fa fa-user-gear w-6 min-w-6" />
								{!isSidebarCollapsed && (
									<span className="font-semibold truncate">
										Profile Settings
									</span>
								)}
							</NavLink>
						</div>
						{userAccess && Object.keys(userAccess).length > 0 && (
							<>
								{Object.keys(userAccess).map((accessKey) => (
									<div
										key={accessKey}
										className="sidebar_navlink_wrap w-full mb-4 flex flex-col gap-2 "
									>
										<div className="w-full flex gap-2 items-center ">
											{!isSidebarCollapsed && (
												<span
													style={{
														fontWeight:
															collapsedRoles[
																accessKey
															]
																? "normal"
																: "bold",
													}}
													onClick={() =>
														toggleRole(accessKey)
													}
													className={`leading-none font-semibold text-[0.85rem] cursor-pointer
											${isSidebarCollapsed ? "overflow-hidden text-ellipsis" : "text-nowrap"} 
											
										`}
													title={accessKey}
												>
													{accessKey}
												</span>
											)}
											{!isSidebarCollapsed && (
												<div className="w-full h-[2px] max-h-[2px] bg-[var(--color-grey)] rounded-md" />
											)}

											<motion.span
												animate={{
													rotate: collapsedRoles[
														accessKey
													]
														? 0
														: 90,
												}}
												transition={{
													duration: 0.2,
													ease: "easeInOut",
												}}
												className={` cursor-pointer ${
													isSidebarCollapsed &&
													"w-full text-center"
												} `}
												onClick={() =>
													toggleRole(accessKey)
												}
											>
												<i className="fa-solid fa-chevron-right fa-sm w-6 h-6 rounded-full grid place-content-center text-center p-1 bg-transparent hover:bg-[var(--color-grey)]"></i>
											</motion.span>
										</div>
										<AnimatePresence>
											{!collapsedRoles[accessKey] &&
												userAccess &&
												Object.keys(userAccess).length >
													0 && (
													<>
														{Object.keys(
															userAccess[
																accessKey
															]
														)
															.filter(
																(
																	subAccessKey
																) => {
																	const item =
																		userAccess[
																			accessKey
																		][
																			subAccessKey
																		];
																	return (
																		typeof item ===
																			"object" &&
																		item.sidebar
																	);
																}
															)
															.map(
																(
																	subAccessKey,
																	index
																) => (
																	<motion.div
																		className="overflow-hidden "
																		initial={{
																			opacity: 0,
																			height: 0,
																			y: -10,
																		}}
																		animate={{
																			opacity: 1,
																			height: "auto",
																			y: 0,
																		}}
																		exit={{
																			opacity: 0,
																			height: 0,
																			y: -10,
																		}}
																		transition={{
																			duration: 0.3,
																			ease: "easeInOut",
																		}}
																	>
																		<motion.div
																			initial={{
																				opacity: 0,
																				x: -10,
																			}}
																			animate={{
																				opacity: 1,
																				x: 0,
																			}}
																			transition={{
																				delay:
																					index *
																					0.03,
																				duration: 0.2,
																			}}
																		>
																			<NavLink
																				onClick={(
																					e
																				) =>
																					e.stopPropagation()
																				}
																				key={
																					subAccessKey
																				}
																				className="w-full h-12 p-4 rounded-md flex items-center gap-2 bg-[var(--color-grey-light)] brightness-[97%] hover:brightness-110 hover:bg-[var(--color-grey)]"
																				to={
																					userAccess[
																						accessKey
																					][
																						subAccessKey
																					]
																						.route
																				}
																				title={
																					subAccessKey
																				}
																			>
																				<span
																					className={`${userAccess[accessKey][subAccessKey].icon} w-6 min-w-6`}
																				/>

																				{!isSidebarCollapsed && (
																					<span className="font-semibold truncate">
																						{
																							subAccessKey
																						}
																					</span>
																				)}
																			</NavLink>
																		</motion.div>
																	</motion.div>
																)
															)}
													</>
												)}
										</AnimatePresence>
									</div>
								))}
							</>
						)}
					</motion.div>
				</div>
			</motion.div>
		</>
	);
}

export default SidebarDefault;
