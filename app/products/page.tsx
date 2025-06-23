"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSearch } from "../../context/SearchContext";
import { Eye, Edit, Trash2, Plus, ShoppingCart, Package } from "lucide-react";

// Tách component sử dụng useSearchParams ra thành component riêng
function ProductsContent() {
    const [allProducts, setAllProducts] = useState([]); // Cache all products
    const [filteredProducts, setFilteredProducts] = useState([]); // Displayed products
    const [error, setError] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        limit: 10, // Tăng limit cho table view
    });
    const [isFetching, setIsFetching] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const { data: session } = useSession();
    const router = useRouter();
    const { search } = useSearch();

    // Fetch all products (or large batch) on initial load
    useEffect(() => {
        const fetchProducts = async () => {
            if (isFetching) return;
            setIsFetching(true);
            setError("");
            const params = new URLSearchParams({
                page: "1",
                limit: "1000", // Fetch large batch to cover all products
            });

            try {
                const res = await fetch(`/api/products?${params.toString()}`);
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(
                        `API error: ${res.status} ${res.statusText} - ${text}`
                    );
                }
                const data = await res.json();
                if (data.products && Array.isArray(data.products)) {
                    setAllProducts(data.products); // Cache all products
                    setFilteredProducts(data.products); // Initial display
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
            } catch (err) {
                console.error("Fetch error:", err.message);
                if (retryCount < 3) {
                    setRetryCount((prev) => prev + 1);
                    setTimeout(() => {
                        fetchProducts();
                    }, 1000 * (retryCount + 1));
                } else {
                    setError(`Failed to load products: ${err.message}`);
                    setRetryCount(0);
                }
            } finally {
                setIsFetching(false);
            }
        };

        fetchProducts();
    }, [retryCount]);

    // Filter products client-side when search term changes
    useEffect(() => {
        if (!search) {
            setFilteredProducts(allProducts);
            setPagination((prev) => ({
                ...prev,
                totalProducts: allProducts.length,
                totalPages: Math.ceil(allProducts.length / prev.limit),
                currentPage: 1, // Reset to first page
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

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?"))
            return;
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setAllProducts(
                    allProducts.filter((product) => product._id !== id)
                );
                router.push(`/products?refresh=${Date.now()}`);
            } else {
                const errorData = await res.json();
                alert(
                    `Failed to delete product: ${
                        errorData.error || "Unknown error"
                    }`
                );
            }
        } catch (error) {
            alert("Error deleting product");
            console.error("Delete error:", error.message);
        }
    };

    const handleAddToCart = async (productId) => {
        if (!session) {
            alert("Please log in to add items to your cart.");
            router.push("/auth/login");
            return;
        }

        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity: 1 }),
            });
            if (res.ok) {
                window.dispatchEvent(new Event("cartUpdated"));
                alert("Item added to cart!");
            } else {
                const errorData = await res.json();
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
        }
    };

    const startIndex = (pagination.currentPage - 1) * pagination.limit;
    const paginatedProducts = filteredProducts.slice(
        startIndex,
        startIndex + pagination.limit
    );

    const truncateText = (text, maxLength = 50) => {
        if (!text) return "";
        return text.length > maxLength
            ? text.substring(0, maxLength) + "..."
            : text;
    };

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">
                                    Products Management
                                </h1>
                                <p className="text-gray-600">
                                    Manage your product inventory
                                </p>
                            </div>
                        </div>
                        {session && (
                            <Link
                                href="/products/new"
                                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Add New Product</span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {isFetching && (
                    <div className="flex items-center justify-center py-12">
                        <div className="relative">
                            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                            <div
                                className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"
                                style={{ animationDirection: "reverse" }}
                            ></div>
                        </div>
                        <span className="ml-3 text-gray-600">
                            Loading products...
                        </span>
                    </div>
                )}

                {/* Empty State */}
                {paginatedProducts.length === 0 && !error && !isFetching && (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            No products found
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {search
                                ? `No products match "${search}"`
                                : "No products available."}
                        </p>
                        {session && !search && (
                            <Link
                                href="/products/new"
                                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Add Your First Product</span>
                            </Link>
                        )}
                    </div>
                )}

                {/* Products Table */}
                {paginatedProducts.length > 0 && (
                    <>
                        <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Description
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {paginatedProducts.map(
                                            (product, index) => (
                                                <tr
                                                    key={product._id}
                                                    className="hover:bg-gray-50 transition-colors duration-200"
                                                    style={{
                                                        animationDelay: `${
                                                            index * 0.05
                                                        }s`,
                                                    }}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="flex-shrink-0">
                                                                {product.image ? (
                                                                    <img
                                                                        src={
                                                                            product.image
                                                                        }
                                                                        alt={
                                                                            product.name
                                                                        }
                                                                        className="w-16 h-16 object-cover rounded-lg shadow-md"
                                                                    />
                                                                ) : (
                                                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                                        <Package className="w-8 h-8 text-gray-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-lg font-semibold text-gray-800 truncate">
                                                                    {
                                                                        product.name
                                                                    }
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    ID:{" "}
                                                                    {product._id.slice(
                                                                        -8
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-gray-600 max-w-xs">
                                                            {truncateText(
                                                                product.description,
                                                                80
                                                            )}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="text-2xl font-bold text-green-600">
                                                            $
                                                            {Number(
                                                                product.price
                                                            ).toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <div className="flex items-center justify-center space-x-2">
                                                            <Link
                                                                href={`/products/${product._id}`}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                                                                title="View Details"
                                                            >
                                                                <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                            </Link>
                                                            {session && (
                                                                <>
                                                                    <Link
                                                                        href={`/products/${product._id}/edit`}
                                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 group"
                                                                        title="Edit Product"
                                                                    >
                                                                        <Edit className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                                    </Link>
                                                                    <button
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                product._id
                                                                            )
                                                                        }
                                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group"
                                                                        title="Delete Product"
                                                                    >
                                                                        <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                            <div className="text-gray-600">
                                Showing {startIndex + 1} to{" "}
                                {Math.min(
                                    startIndex + pagination.limit,
                                    filteredProducts.length
                                )}{" "}
                                of {filteredProducts.length} products
                                {search && (
                                    <span className="ml-2 text-sm text-purple-600">
                                        (filtered from {allProducts.length}{" "}
                                        total)
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() =>
                                        handlePageChange(
                                            pagination.currentPage - 1
                                        )
                                    }
                                    disabled={
                                        pagination.currentPage === 1 ||
                                        isFetching
                                    }
                                    className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    Previous
                                </button>

                                <div className="flex items-center space-x-1">
                                    {[
                                        ...Array(
                                            Math.min(5, pagination.totalPages)
                                        ),
                                    ].map((_, i) => {
                                        const pageNum = i + 1;
                                        const isActive =
                                            pageNum === pagination.currentPage;
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() =>
                                                    handlePageChange(pageNum)
                                                }
                                                className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                                                    isActive
                                                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                                                        : "text-gray-600 hover:bg-gray-100"
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    {pagination.totalPages > 5 && (
                                        <span className="px-2 text-gray-400">
                                            ...
                                        </span>
                                    )}
                                </div>

                                <button
                                    onClick={() =>
                                        handlePageChange(
                                            pagination.currentPage + 1
                                        )
                                    }
                                    disabled={
                                        pagination.currentPage ===
                                            pagination.totalPages || isFetching
                                    }
                                    className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

// Loading component
function LoadingFallback() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                <div
                    className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"
                    style={{ animationDirection: "reverse" }}
                ></div>
                <span className="sr-only">Loading products...</span>
            </div>
        </div>
    );
}

// Main component
export default function Products() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <ProductsContent />
        </Suspense>
    );
}
