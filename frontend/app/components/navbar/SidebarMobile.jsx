import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { NavLink } from "react-router-dom";

function SidebarMobile({
	isSidebarCollapsed,
	setIsSidebarCollapsed,
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
		setCollapsedRoles((prev) => ({
			...prev,
			[roleKey]: !prev[roleKey],
		}));
	};
	return (
		<>
			<div
				className="h-[calc(100%-3.5rem)] w-full flex absolute z-[998]"
				style={{ pointerEvents: isSidebarCollapsed ? "none" : "auto" }}
			>
				<motion.div
					className="h-full w-[18rem] min-w-[18rem] bg-[var(--color-bg)] z-[997] shadow-lift"
					initial={{
						x: isSidebarCollapsed ? "-19rem" : 0,
					}}
					animate={{
						x: isSidebarCollapsed ? "-19rem" : 0,
					}}
					transition={{ duration: 0.2, ease: "easeInOut" }}
				>
					<div className="h-full w-full flex flex-col overflow-hidden">
						<div className="h-full p-4 flex flex-col gap-2 overflow-y-auto">
							<div className="sidebar_navlink_wrap flex flex-col gap-2">
								<NavLink
									className="w-full h-12 p-4 rounded-md flex items-center gap-2 bg-[var(--color-grey-light)] brightness-[97%] hover:brightness-110 hover:bg-[var(--color-grey)]"
									to="/dashboard"
									title="Dashboard"
									onClick={() => {
										setIsSidebarCollapsed(true);
									}}
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
									onClick={() => {
										setIsSidebarCollapsed(true);
									}}
								>
									<span className="fa fa-user-gear w-6 min-w-6" />
									{!isSidebarCollapsed && (
										<span className="font-semibold truncate">
											Profile Settings
										</span>
									)}
								</NavLink>
							</div>
							{userAccess &&
								Object.keys(userAccess).length > 0 && (
									<>
										{Object.keys(userAccess).map(
											(accessKey) => (
												<div
													key={accessKey}
													className="sidebar_navlink_wrap w-full mb-4 flex flex-col gap-2"
												>
													<div className="w-full flex gap-2 items-center">
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
																toggleRole(
																	accessKey
																)
															}
															className={`leading-none font-semibold text-[0.85rem] cursor-pointer ${
																isSidebarCollapsed
																	? "overflow-hidden text-ellipsis"
																	: "text-nowrap"
															} `}
															title={accessKey}
														>
															{accessKey}
														</span>
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
																toggleRole(
																	accessKey
																)
															}
														>
															<i className="fa-solid fa-chevron-right fa-sm w-6 h-6 rounded-full grid place-content-center text-center p-1 bg-transparent hover:bg-[var(--color-grey)]"></i>
														</motion.span>
													</div>
													<AnimatePresence>
														{!collapsedRoles[
															accessKey
														] &&
															userAccess &&
															Object.keys(
																userAccess
															).length > 0 && (
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
																							height: 0,
																							x: -10,
																						}}
																						animate={{
																							opacity: 1,
																							height: "auto",
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
																							) => {
																								e.stopPropagation();
																								setIsSidebarCollapsed(
																									true
																								);
																							}}
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
																								className={
																									userAccess[
																										accessKey
																									][
																										subAccessKey
																									]
																										.icon
																								}
																							/>
																							{!isSidebarCollapsed && (
																								<span className="font-semibold leading-none truncate">
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
											)
										)}
									</>
								)}
						</div>
					</div>
				</motion.div>
				<AnimatePresence>
					{!isSidebarCollapsed && (
						<motion.div
							className="w-full h-full backdrop-blur-sm z-[996] absolute bg-black/30"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsSidebarCollapsed(true)}
						></motion.div>
					)}
				</AnimatePresence>
			</div>
		</>
	);
}

export default SidebarMobile;
