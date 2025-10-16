import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
	const user = JSON.parse(localStorage.getItem("user-info"));
	return user ? children : <Navigate to="/" />;
};

export default AuthRoute;
