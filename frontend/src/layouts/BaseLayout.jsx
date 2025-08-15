import { Outlet } from "react-router";
import Header from "../components/Header";

export const BaseLayout = () => {
	return (
		<div className="flex flex-col min-h-screen bg-white">
			<Header />
			<main className="flex-1 w-full">
				<Outlet />
			</main>
		</div>
	);
};
