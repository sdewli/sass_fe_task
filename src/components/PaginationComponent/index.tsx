import React, { useState, useEffect } from 'react';
import './Pagination.scss';
import { debounce } from 'lodash';
import { PageLeftArrow, PageRightArrow } from '../../assets/Svg/PaginationArrow';

type IPagination = {
	currentPage: number;
	totalPages: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
	options?: number[];
};

const Pagination: React.FC<IPagination> = ({
	currentPage,
	totalPages,
	pageSize,
	onPageChange,
	onPageSizeChange,
	options = [5, 10, 20, 100],
}) => {
	const [pageNumberInput, setPageNumberInput] = useState(currentPage);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		setPageNumberInput(currentPage);
	}, [currentPage]);

	const debouncedHandlePageChange = debounce((page) => {
		if (page >= 1 && page <= totalPages) {
			onPageChange(page);
		}
	}, 300);

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			debouncedHandlePageChange(currentPage + 1);
		}
	};

	const handlePrevPage = () => {
		if (currentPage > 1) {
			debouncedHandlePageChange(currentPage - 1);
		}
	};

	const handlePageNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPageNumberInput(Number(e.target.value));
	};

	const handleGoButtonClick = () => {
		debouncedHandlePageChange(pageNumberInput);
	};

	const handlePageSizeChange = (value: number) => {
		onPageSizeChange(value);
		setIsOpen(false);
	};

	const maxPageNumbersToShow = 5;
	const pageNumbers = [];

	let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
	let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

	if (endPage - startPage < maxPageNumbersToShow - 1) {
		startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
	}

	for (let i = startPage; i <= endPage; i++) {
		pageNumbers.push(i);
	}

	return (
		<div className="pagination-controls">
			<div className="dropdown select">
				<button className={`selected-option ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
					{pageSize} / Page
					<svg className="icon" xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none">
						{isOpen ? (
							<path d="M11 6L6 1.40234L1 6" stroke="#191919" strokeWidth="2" />
						) : (
							<path d="M1 1L6 5.5977L11 1" stroke="#191919" strokeWidth="2" />
						)}
					</svg>
				</button>
				<div className={`dropdown-content ${isOpen ? 'open' : ''}`}>
					{options.map((option) => (
						<button key={option} onClick={() => handlePageSizeChange(option)} className="content-dropdown">
							{option} / Page
						</button>
					))}
				</div>
			</div>
			<div className="pagination-buttons">
				<button onClick={handlePrevPage} disabled={currentPage === 1}>
					<PageLeftArrow />
				</button>
				{pageNumbers.map((page) => (
					<button
						key={page}
						onClick={() => debouncedHandlePageChange(page)}
						className={page === currentPage ? 'active' : ''}
					>
						{page}
					</button>
				))}
				{endPage < totalPages && <button className="ellipsis">...</button>}
				<button onClick={handleNextPage} disabled={currentPage === totalPages}>
					<PageRightArrow />
				</button>
			</div>
			<div className="go-to-page">
				<span>Go to</span>
				<input type="number" value={pageNumberInput} onChange={handlePageNumberInput} min="1" max={totalPages} />
				<button onClick={handleGoButtonClick}>Go</button>
			</div>
		</div>
	);
};

export default Pagination;
