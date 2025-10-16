import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet, useLocation } from "react-router-dom";
function SideBarLayout() {
	const year = new Date().getFullYear();
	// Sidebar States
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [isSidebarScrollable, setIsSidebarScrollable] = useState(false);
	return (
		<div className="w-dvw h-dvh flex flex-col">
			<Topbar
				isSidebarCollapsed={isSidebarCollapsed}
				setIsSidebarCollapsed={setIsSidebarCollapsed}
				isSidebarScrollable={isSidebarScrollable}
			/>
			<div className="h-full max-h-[calc(100%-3.5rem)] w-full flex rounded-s-md">
				<Sidebar
					isSidebarCollapsed={isSidebarCollapsed}
					setIsSidebarCollapsed={setIsSidebarCollapsed}
					isSidebarScrollable={isSidebarScrollable}
					setIsSidebarScrollable={setIsSidebarScrollable}
				/>
				<div className="h-full w-full flex flex-col justify-between bg-[var(--color-bg-secondary)] overflow-x-hidden overflow-y-auto">
					<Outlet />
					<div className="w-full flex justify-center items-center">
						<div className="text-color text-center font-semibold opacity-45 py-1 mr-0 md:mr-4 text-[0.85em] leading-tight">
							<span className="fa-regular fa-copyright" /> {year}{" "}
							• MEC Networks Corporation
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SideBarLayout;
