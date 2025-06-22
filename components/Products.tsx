"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        limit: 6,
    });
    const [isFetching, setIsFetching] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const refresh = searchParams.get("refresh");
        if (refresh && retryCount < 3) {
            setIsFetching(true);
            setTimeout(() => {
                fetchProducts(pagination.currentPage, pagination.limit);
            }, 1000);
        } else {
            fetchProducts(pagination.currentPage, pagination.limit);
        }
    }, [pagination.currentPage, pagination.limit, searchParams, retryCount]);

    const fetchProducts = (page, limit) => {
        if (isFetching) return;
        setIsFetching(true);
        setError("");
        fetch(`/api/products?page=${page}&limit=${limit}`)
            .then((res) => {
                if (!res.ok) {
                    console.error("API error:", {
                        status: res.status,
                        statusText: res.statusText,
                    });
                    return res.text().then((text) => {
                        throw new Error(
                            `API error: ${res.status} ${res.statusText} - ${text}`
                        );
                    });
                }
                return res.json();
            })
            .then((data) => {
                console.log("API response:", data);
                if (data.products && Array.isArray(data.products)) {
                    setProducts(data.products);
                    setPagination({
                        currentPage: data.pagination?.currentPage || 1,
                        totalPages: data.pagination?.totalPages || 1,
                        totalProducts: data.pagination?.totalProducts || 0,
                        limit: data.pagination?.limit || limit,
                    });
                    setRetryCount(0);
                } else {
                    console.error("Invalid API response format:", data);
                    throw new Error(
                        "Invalid data format: Expected an array of products"
                    );
                }
            })
            .catch((err) => {
                console.error("Fetch error:", err.message);
                if (retryCount < 3) {
                    setRetryCount((prev) => prev + 1);
                    setTimeout(() => {
                        fetchProducts(page, limit);
                    }, 1000 * (retryCount + 1));
                } else {
                    setError(`Failed to load products: ${err.message}`);
                    setRetryCount(0);
                }
            })
            .finally(() => {
                setIsFetching(false);
            });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?"))
            return;
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setProducts(products.filter((product) => product._id !== id));
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

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Products</h1>
            {session && (
                <Link
                    href="/products/new"
                    className="bg-blue-500 text-white p-2 rounded mb-4 inline-block"
                >
                    Add New Product
                </Link>
            )}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {products.length === 0 && !error && !isFetching ? (
                <p>No products available.</p>
            ) : isFetching ? (
                <p>Loading products...</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="border p-4 rounded shadow hover:shadow-lg transition"
                            >
                                {product.image && (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-48 object-cover mb-2 rounded"
                                    />
                                )}
                                <h2 className="text-xl font-semibold">
                                    {product.name}
                                </h2>
                                <p className="text-gray-600 truncate">
                                    {product.description}
                                </p>
                                <p className="text-lg font-bold mt-2">
                                    ${Number(product.price).toFixed(2)}
                                </p>
                                <div className="mt-4 flex space-x-2">
                                    <Link
                                        href={`/products/${product._id}`}
                                        className="text-blue-500 hover:underline"
                                    >
                                        View Details
                                    </Link>
                                    {session && (
                                        <>
                                            <Link
                                                href={`/products/${product._id}/edit`}
                                                className="text-green-500 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    handleDelete(product._id)
                                                }
                                                className="text-red-500 hover:underline"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleAddToCart(product._id)
                                                }
                                                className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
                                            >
                                                Add to Cart
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-center items-center space-x-4">
                        <p className="text-gray-600">
                            Showing {products.length} of{" "}
                            {pagination.totalProducts} products
                        </p>
                        <button
                            onClick={() =>
                                handlePageChange(pagination.currentPage - 1)
                            }
                            disabled={
                                pagination.currentPage === 1 || isFetching
                            }
                            className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
                        >
                            Previous
                        </button>
                        <span>
                            Page {pagination.currentPage} of{" "}
                            {pagination.totalPages}
                        </span>
                        <button
                            onClick={() =>
                                handlePageChange(pagination.currentPage + 1)
                            }
                            disabled={
                                pagination.currentPage ===
                                    pagination.totalPages || isFetching
                            }
                            className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
