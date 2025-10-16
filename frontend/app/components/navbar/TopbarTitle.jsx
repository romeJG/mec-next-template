import capitalizeEveryWord from "../../utils/capitalizeEveryWord";

const TopbarTitle = ({ crumbs }) => {
	return (
		<>
			{crumbs.map((crumb, index) => (
				<span key={index} className="leading-none font-semibold">
					{crumb.isActive && capitalizeEveryWord(crumb.label)}
				</span>
			))}
		</>
	);
};

export default TopbarTitle;
