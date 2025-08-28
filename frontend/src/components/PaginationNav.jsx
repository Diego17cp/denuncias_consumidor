import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export const PaginationNav = ({
	currentPage = 1,
	totalPages = 1,
	onPageChange,
}) => {
	const safeTotal = Math.max(1, Number(totalPages) || 1);
	const safeCurrent = Math.min(
		safeTotal,
		Math.max(1, Number(currentPage) || 1)
	);

	const goPrev = () => {
		if (safeCurrent > 1) onPageChange?.(safeCurrent - 1);
	};
	const goNext = () => {
		if (safeCurrent < safeTotal) onPageChange?.(safeCurrent + 1);
	};

	return (
		<div className="inline-flex items-center gap-3">
			<button
				type="button"
				aria-label="Página anterior"
				onClick={goPrev}
				disabled={safeCurrent <= 1}
				className="px-3 py-1 rounded-md bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				<FiArrowLeft />
			</button>

			<div className="px-4 py-1 rounded-md bg-gray-100 text-sm font-medium border border-gray-200">
				{safeCurrent}/{safeTotal}
			</div>

			<button
				type="button"
				aria-label="Página siguiente"
				onClick={goNext}
				disabled={safeCurrent >= safeTotal}
				className="px-3 py-1 rounded-md bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				<FiArrowRight />
			</button>
		</div>
	);
};
