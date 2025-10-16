import logo from "../../assets/mec-logo-blue.png";
import SidebarExpandButton from "./SidebarExpandButton";
import useDeviceSize from "../../services/hooks/useDeviceSize";
import NavbarTitle from "./NavbarTitle";
import { useLocation } from "react-router-dom";
import generateBreadCrumbs from "../../utils/generateBreadCrumbs";
import BreadCrumbs from "./BreadCrumbs";
import TopbarTitle from "./TopbarTitle";
import ProfileSettings from "./ProfileSettings";
import useThemeToggle from "../../services/hooks/useThemeToggle";
import CustomButton from "../customs/CustomButton";

function Topbar({
	isSidebarCollapsed,
	setIsSidebarCollapsed,
	isSidebarScrollable,
}) {
	const { isTablet } = useDeviceSize();
	const [isDarkMode, setIsDarkMode] = useThemeToggle();

	// Used to toggle the button to expand or collapse the sidebar
	const handleExpandSidebar = () => {
		setIsSidebarCollapsed(!isSidebarCollapsed);
	};

	const BreadCrumbWrapper = () => {
		const location = useLocation();
		const crumbs = generateBreadCrumbs(location.pathname);

		return <BreadCrumbs crumbs={crumbs} />;
	};

	const TopbarTitleWrapper = () => {
		const location = useLocation();
		const crumbs = generateBreadCrumbs(location.pathname);

		return <TopbarTitle crumbs={crumbs} />;
	};

	return (
		<>
			<div className="w-full h-14 min-h-14 bg-[var(--color-bg)] shadow-lift-2 flex items-center z-[999]">
				{isTablet ? (
					<div className="w-14 h-full flex justify-center items-center">
						<SidebarExpandButton
							handleClick={handleExpandSidebar}
							isClicked={isSidebarCollapsed}
						/>
					</div>
				) : (
					<>
						<NavbarTitle
							logo={logo}
							title="Template"
							isSidebarCollapsed={isSidebarCollapsed}
							isSidebarScrollable={isSidebarScrollable}
							handleExpandSidebar={handleExpandSidebar}
						/>
						<div className="w-[2px] min-w-[2px] h-8 rounded-sm bg-[var(--color-grey)]" />
					</>
				)}
				<div
					className="w-full flex justify-between items-center pr-4"
					style={{ paddingLeft: isTablet ? 0 : "1rem" }}
				>
					{/* BREADECRUMBS */}
					<div className="flex flex-col gap-[0.15rem]">
						<TopbarTitleWrapper />
						<BreadCrumbWrapper />
					</div>

					{/* PROFILES */}
					<div className="h-full flex items-center gap-2">
						<div
							className="w-8 h-8 rounded-md shadow-lift overflow-hidden"
							title={`Enable ${isDarkMode ? "Light Mode" : "Dark Mode"
								}`}
						>
							<CustomButton
								buttonVariant="solid"
								buttonLabel={
									<span
										className={`fa-solid ${isDarkMode ? "fa-sun" : "fa-moon"
											}`}
									></span>
								}
								buttonWidth="2rem"
								buttonHeight="2rem"
								buttonSolidColor="var(--color-bg)"
								buttonClick={() => setIsDarkMode(!isDarkMode)}
								isScaledOnHover={false}
								isDarkendOnHover
							/>
						</div>

						<ProfileSettings
							isDarkmode={isDarkMode}
							setIsDarkmode={setIsDarkMode}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export default Topbar;
