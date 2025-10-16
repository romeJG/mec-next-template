import { Link } from "react-router-dom";
import capitalizeEveryWord from "../../utils/capitalizeEveryWord";

const BreadCrumbs = ({ crumbs }) => {
	return (
		<nav>
			<ol className="leading-none text-[0.85rem] flex opacity-75">
				{crumbs.map((crumb, index) => (
					<li
						key={index}
						className={`after:content-['/'] after:m-1 last:after:content-[''] ${
							crumb.isActive && "font-semibold"
						}`}
					>
						{crumb.isActive ? (
							capitalizeEveryWord(crumb.label)
						) : (
							<Link to={crumb.path}>
								{capitalizeEveryWord(crumb.label)}
							</Link>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
};

export default BreadCrumbs;
