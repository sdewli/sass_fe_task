import React, { useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Pagination from '../PaginationComponent';
import Loader from '../Loader';
import  CaretDownSvg  from '../../assets/Svg/CaretDownSvg';
import './Table.scss';

type ITableComponent = {
	title?: string;
	data: any[];
	columns: any[];
	children?: JSX.Element;
	totalCount?: number;
	fetchMore?: (pageSize: number, page: number) => void;
	isSearch?: boolean;
	isGenerate?: boolean;
	selectUser?: number[];
	setSelectUsers?: (previousState: (previousState: number[]) => number[]) => void;
	onFilterChange?: any;
	customBodyCss?: string;
	loading?: boolean;
	sort?:boolean;
	handleModal?: (value: string) => void;
	handleOnClickTr?: (row: any) => void;
	isServerSidePagination?: boolean;
	isPagination?: boolean;
	activePage?: number;
	perPageSize?: number;
	handleSort?: (sortColumn: string, sortOrder: 'ASC' | 'DESC') => void;
	selectedSorting?: 'createdAt' | 'A-Z' | 'Z-A' | 'lastModified';
};

type IColumn = {
	id: string | number;
	key: string;
	value: string;
	label?: string;
	renderCell?: (data: unknown, index: number | string) => React.ReactNode;
	labelCell?: () => React.ReactNode;
	isSort?: boolean;
	sorter?: (a: unknown, b: unknown) => number;
	width?: number;
};

type ITR = {
	title: string;
	sno: number;
	columns?: IColumn[];
	rowData: unknown;
	handleOnClickEvent?: (rowData: unknown) => void;
	selectUser?: number[];
	handleSetSelectUser?: (values: number[]) => void;
};

const TR: React.FC<ITR> = (props) => {
	const { columns, rowData, sno, handleOnClickEvent = () => {} } = props;

	return (
		<tr className="text-center" onClick={() => handleOnClickEvent(rowData)}>
			{columns?.map((column, index) => {
				return (
					<td className="align-middle  text-center" key={index}>
						{typeof column.renderCell === 'function' ? column.renderCell(rowData, sno) : '-'}
					</td>
				);
			})}
		</tr>
	);
};

const TableComponent: React.FC<ITableComponent> = ({
	title = '',
	data = [],
	columns = [],
	children,
	customBodyCss = '',
	totalCount,
	fetchMore,
	onFilterChange,
	loading,
	isSearch,
	handleOnClickTr,
	isServerSidePagination = false,
	isPagination = true,
	activePage,
	perPageSize = 5,
	handleSort,
	sort,
	selectedSorting,
}) => {
	const [perPageData, setPerPageData] = useState<number>(perPageSize);
	const [totalPages, setTotalPages] = useState<number>(0);
	const [pages, setPage] = useState<number>(1);
	const [filter, setFilter] = useState<any>();
	const [isSort, setIsSort] = useState<boolean>(sort ?? false);
	const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
	const [sortColumn, setSortColumn] = useState<string>('created_on');

	useEffect(() => {
		setIsSort(selectedSorting === 'lastModified');
	}, [selectedSorting]);

	useEffect(() => {
		if (totalCount && totalCount >= 0) {
			const totalPages = Math.ceil(totalCount / perPageData);
			setTotalPages(totalPages);
		} else {
			setTotalPages(1);
		}
	}, [perPageData, totalCount]);

	useEffect(() => {
		if (activePage) {
			setPage(Number(activePage));
		} else {
			setPage(1);
		}
	}, [isSearch, activePage]);

	useEffect(() => {
		if (!data.length && totalPages > 1 && pages !== 1) {
			setPage(Number(pages));
			if (fetchMore) {
				fetchMore(perPageData, pages);
			}
		} else if (!data.length && pages === 1 && totalPages > 1) {
			if (fetchMore) {
				fetchMore(perPageData, 1);
			}
		} else {
			setPage(1);
		}
	}, [!data.length]);

	const handlePageChangeEvent = (page: number) => {
		setPage(Number(page));
		if (fetchMore) {
			fetchMore(perPageData, page);
		}
	};
	const handlePerPageData = (limit: number | string) => {
		setPage(1);
		setPerPageData(Number(limit));
		if (fetchMore && data.length) {
			fetchMore(Number(limit), 1);
		}
	};

	const onSort = (column: IColumn, order: 'ASC' | 'DESC') => (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setSortColumn(column.value);
		setSortOrder(order);
		setFilter({ ...filter, sortBy: column.value, orderBy: isSort ? 'ASC' : 'DESC' });
		onFilterChange?.({ ...filter, sortBy: column.value, orderBy: isSort ? 'ASC' : 'DESC' });
		handleSort?.(column.value, order);
	};

	const handleSortLocal = async (sorter: (a: unknown, b: unknown) => number, column: IColumn) => {
		setIsSort(!isSort);
		if (sorter) {
			return data.sort(sorter);
		} else {
			return data.sort((a, b) => {
				const nameA = a[column.value];
				const nameB = b[column.value];
				if (isSort) {
					if (nameA > nameB) {
						return 1;
					} else {
						return -1;
					}
				} else {
					if (nameA < nameB) {
						return 1;
					} else {
						return -1;
					}
				}
			});
		}
	};

	const recordsToDisplay = useMemo(() => {
		if (isServerSidePagination) {
			return data;
		}
		const startIndex = (Number(pages) - 1) * Number(perPageData);
		const endIndex = startIndex + Number(perPageData);
		if (data) {
			return data?.slice(startIndex, endIndex);
		} else return [];
	}, [data, isServerSidePagination, pages, perPageData]);

	return (
		<Row className={`custom-table m-0 ${customBodyCss}`}>
			<Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
				{children}
			</Col>
			<Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className="position-relative p-0">
				{loading && <Loader />}
				<div className="table-responsive">
					<table className="table">
						<thead>
							<tr>
								{columns?.map((column: IColumn, index: number) => {
									return (
										<th className="py-3" key={index} style={{ width: column.width }}>
											<div className="d-flex align-items-center text-nowrap justify-content-center">
												{column.labelCell ? column.labelCell() : column.label}
												{column.isSort && (
													<div className="d-flex align-items-center flex-column sort-wrapper">
														<div
															onClick={
																isServerSidePagination
																	? onSort(column, 'ASC')
																	: () => {
																			if (column.sorter) {
																				handleSortLocal(column.sorter, column);
																			}
																	  }
															}
															className={`d-flex cursor-pointer ${
																column.value === sortColumn && sortOrder === 'ASC' ? '' : 'opacity-50'
															}`}
														>
															<CaretDownSvg height={12} width={12} style={{ transform: 'rotate(180deg)' }} />
														</div>
														<div
															onClick={
																isServerSidePagination
																	? onSort(column, 'DESC')
																	: () => {
																			if (column.sorter) {
																				handleSortLocal(column.sorter, column);
																			}
																	  }
															}
															className={`d-flex cursor-pointer ${
																column.value === sortColumn && sortOrder === 'DESC' ? '' : 'opacity-50'
															}`}
														>
															<CaretDownSvg height={12} width={12} />
														</div>
													</div>
												)}
											</div>
										</th>
									);
								})}
							</tr>
						</thead>
						<tbody>
							{!!data.length
								? (recordsToDisplay || [])?.map((row: unknown, index: number) => {
										return (
											<TR
												title={title}
												sno={index + 1}
												columns={columns}
												rowData={row}
												key={index}
												handleOnClickEvent={handleOnClickTr}
											/>
										);
								  })
								: !loading && (
										<tr>
											<td colSpan={columns.length + 1}>
												<div className="no-data mt-2">No data found</div>
											</td>
										</tr>
								  )}
						</tbody>
					</table>
				</div>
			</Col>
			{isPagination && (
				<div>
					<div className="align-items-center mt-sm-3 pagination-main-wrapper">
						<div className="w-100">
							{totalPages > 0 && (
								<Pagination
									totalPages={totalPages}
									currentPage={pages} 
									onPageChange={(page) => handlePageChangeEvent(page)} 
									pageSize={perPageData} 
									onPageSizeChange={handlePerPageData} 
								/>
							)}
						</div>
					</div>
				</div>
			)}
		</Row>
	);
};

export default TableComponent;
