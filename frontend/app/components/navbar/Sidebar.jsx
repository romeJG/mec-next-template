import React, { useEffect, useRef } from "react";
import useDeviceSize from "../../services/hooks/useDeviceSize";
import SidebarDefault from "./SidebarDefault";
import SidebarMobile from "./SidebarMobile";
import useJWT from "../../services/auth/useJWT";

function Sidebar({
	isSidebarCollapsed,
	setIsSidebarCollapsed,
	isSidebarScrollable,
	setIsSidebarScrollable,
}) {
	const { isTablet } = useDeviceSize();

	const { getUserInfoFromJWT } = useJWT();
	const userAccess = getUserInfoFromJWT().route_access;
	// Used to toggle the button to expand or collapse the sidebar
	const handleExpandSidebar = () => {
		setIsSidebarCollapsed(!isSidebarCollapsed);
	};

	// Use to determine if the sidebar is scrollable
	const sidebarRef = useRef(null);
	useEffect(() => {
		const checkScrollability = () => {
			if (sidebarRef.current) {
				const { scrollHeight, clientHeight } = sidebarRef.current;
				setIsSidebarScrollable(scrollHeight > clientHeight);
			}
		};
		checkScrollability();
		window.addEventListener("resize", checkScrollability);
		return () => {
			window.removeEventListener("resize", checkScrollability);
		};
	}, []);

	return (
		<>
			{isTablet ? (
				<SidebarMobile
					isSidebarCollapsed={isSidebarCollapsed}
					setIsSidebarCollapsed={setIsSidebarCollapsed}
					userAccess={userAccess}
				/>
			) : (
				<SidebarDefault
					isSidebarCollapsed={isSidebarCollapsed}
					isSidebarScrollable={isSidebarScrollable}
					handleExpandSidebar={handleExpandSidebar}
					sidebarRef={sidebarRef}
					userAccess={userAccess}
				/>
			)}
		</>
	);
}

export default Sidebar;
