"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSearch } from "../context/SearchContext";
import ProductGrid from "../components/ProductGrid";
import Pagination from "../components/Pagination";

function HomeContent() {
    const [allProducts, setAllProducts] = useState([]); // Cache all products
    const [filteredProducts, setFilteredProducts] = useState([]); // Displayed products
    const [error, setError] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        limit: 8, // Increased for better layout
    });
    const [isFetching, setIsFetching] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const { data: session } = useSession();
    const router = useRouter();
    const { search } = useSearch();
    const [showLoginPopup, setShowLoginPopup] = useState(false); // State for login popup

    // Fetch all products (or large batch) on initial load
    useEffect(() => {
        const fetchProducts = async () => {
            if (isFetching) return;
            setIsFetching(true);
            setError("");
            const params = new URLSearchParams({
                page: "1",
                limit: "1000", // Fetch large batch to cache all products
            });

            try {
                const response = await fetch(
                    `/api/products?${params.toString()}`
                );
                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(
                        `API error: ${response.status} ${response.statusText} - ${text}`
                    );
                }
                const data = await response.json();
                if (data.products && Array.isArray(data.products)) {
                    setAllProducts(data.products);
                    setFilteredProducts(data.products);
                    setPagination({
                        currentPage: 1,
                        totalPages: Math.ceil(
                            data.products.length / pagination.limit
                        ),
                        totalProducts: data.products.length,
                        limit: pagination.limit,
                    });
                    setRetryCount(0);
                } else {
                    throw new Error(
                        "Invalid data format: Expected an array of products"
                    );
                }
            } catch (error) {
                console.error("Fetch error:", error.message);
                if (retryCount < 3) {
                    setRetryCount((prev) => prev + 1);
                    setTimeout(() => {
                        fetchProducts();
                    }, 1000 * (retryCount + 1));
                } else {
                    setError(`Failed to load products: ${error.message}`);
                    setRetryCount(0);
                }
            } finally {
                setIsFetching(false);
            }
        };

        fetchProducts();
    }, [retryCount]);

    // Filter products based on search query
    useEffect(() => {
        if (!search) {
            setFilteredProducts(allProducts);
            setPagination((prev) => ({
                ...prev,
                totalProducts: allProducts.length,
                totalPages: Math.ceil(allProducts.length / prev.limit),
                currentPage: 1,
            }));
            return;
        }
        const filtered = allProducts.filter(
            (product) =>
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                (product.description &&
                    product.description
                        .toLowerCase()
                        .includes(search.toLowerCase()))
        );
        setFilteredProducts(filtered);
        setPagination((prev) => ({
            ...prev,
            totalProducts: filtered.length,
            totalPages: Math.ceil(filtered.length / prev.limit),
            currentPage: 1,
        }));
    }, [search, allProducts]);

    const handleAddToCart = async (productId) => {
        if (!session) {
            setShowLoginPopup(true); // Show login popup
            return;
        }

        try {
            const response = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity: 1 }),
            });
            if (response.ok) {
                window.dispatchEvent(new Event("cartUpdated"));
                // Success notification
                const notification = document.createElement("div");
                notification.className =
                    "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
                notification.textContent = "Đã thêm vào giỏ hàng!";
                document.body.appendChild(notification);
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 3000);
            } else {
                const errorData = await response.json();
                alert(
                    `Failed to add to cart: ${
                        errorData.error || "Unknown error"
                    }`
                );
            }
        } catch (error) {
            alert("Error adding to cart");
            console.error("Add to cart error:", error.message);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages && !isFetching) {
            setPagination((prev) => ({ ...prev, currentPage: newPage }));
            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Slice filtered products for current page
    const startIndex = (pagination.currentPage - 1) * pagination.limit;
    const paginatedProducts = filteredProducts.slice(
        startIndex,
        startIndex + pagination.limit
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        Sản Phẩm Nổi Bật
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Khám phá bộ sưu tập sản phẩm chất lượng cao với thiết kế
                        hiện đại và tính năng vượt trội
                    </p>
                    {search && (
                        <div className="mt-4 inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                            <span className="text-sm">
                                Kết quả tìm kiếm cho:{" "}
                            </span>
                            <span className="font-semibold">
                                &quot;{search}&quot;
                            </span>
                            <span className="text-sm ml-2">
                                ({filteredProducts.length} sản phẩm)
                            </span>
                        </div>
                    )}
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                        <div className="flex items-center">
                            <svg
                                className="w-6 h-6 text-red-500 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <div>
                                <h3 className="text-red-800 font-semibold">
                                    Có lỗi xảy ra
                                </h3>
                                <p className="text-red-600 mt-1">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isFetching && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        </div>
                        <p className="text-gray-600 mt-4 text-lg">
                            Đang tải sản phẩm...
                        </p>
                    </div>
                )}

                {/* Login Popup */}
                {showLoginPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                Vui lòng đăng nhập
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.
                            </p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setShowLoginPopup(false)}
                                    className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-100"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={() => {
                                        setShowLoginPopup(false);
                                        router.push("/auth/login");
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Đăng nhập
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                <ProductGrid
                    paginatedProducts={paginatedProducts}
                    handleAddToCart={handleAddToCart}
                    isFetching={isFetching}
                />

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <Pagination
                        pagination={pagination}
                        handlePageChange={handlePageChange}
                        isFetching={isFetching}
                    />
                )}
            </div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
            <div className="text-center">
                <div className="relative mb-4">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                </div>
                <p className="text-gray-600 text-lg">Đang tải trang...</p>
            </div>
        </div>
    );
}

// Main component
const Home = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <HomeContent />
        </Suspense>
    );
};

export default Home;
