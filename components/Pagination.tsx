"use client";
function Pagination({ pagination, handlePageChange, isFetching }) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-md shadow-lg p-4 border border-gray-200">
            <div className="text-gray-600 mb-4 sm:mb-0">
                Hiển thị {(pagination.currentPage - 1) * pagination.limit + 1} -{" "}
                {Math.min(
                    (pagination.currentPage - 1) * pagination.limit +
                        pagination.limit,
                    pagination.totalProducts
                )}
                <span className="mx-1">trên</span>
                {pagination.totalProducts} sản phẩm
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1 || isFetching}
                    className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 24l-7-7 7-7"
                        />
                    </svg>
                    Trước
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                    {[...Array(Math.min(5, pagination.totalPages))].map(
                        (_, index) => {
                            let pageNum;
                            if (pagination.totalPages <= 5) {
                                pageNum = index + 1;
                            } else if (pagination.currentPage <= 3) {
                                pageNum = index + 1;
                            } else if (
                                pagination.currentPage >=
                                pagination.totalPages - 2
                            ) {
                                pageNum = pagination.totalPages - 4 + index;
                            } else {
                                pageNum = pagination.currentPage - 2 + index;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`w-10 h-10 rounded-lg font-medium ${
                                        pageNum === pagination.currentPage
                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                    }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        }
                    )}
                </div>

                <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={
                        pagination.currentPage === pagination.totalPages ||
                        isFetching
                    }
                    className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Sau
                    <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default Pagination;
