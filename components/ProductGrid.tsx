"use client";
import ProductCard from "./ProductCart";

function ProductGrid({ paginatedProducts, handleAddToCart, isFetching }) {
    if (paginatedProducts.length === 0 && !isFetching) {
        return (
            <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                    </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                    Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                    Thử thay đổi từ khóa tìm kiếm hoặc xóa bộ lọc để xem tất cả
                    sản phẩm
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
            {paginatedProducts.map((product) => (
                <ProductCard
                    key={product._id}
                    product={product}
                    handleAddToCart={handleAddToCart}
                />
            ))}
        </div>
    );
}

export default ProductGrid;
