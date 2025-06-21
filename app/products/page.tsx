"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string>("");
    const { data: session } = useSession();

    useEffect(() => {
        fetch("/api/products")
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
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    throw new Error("Invalid data format: Expected an array");
                }
            })
            .catch((err) => {
                setError(`Failed to load products: ${err.message}`);
                console.error("Fetch error:", err.message);
            });
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setProducts(products.filter((product) => product._id !== id));
            } else {
                alert("Failed to delete product");
            }
        } catch (error) {
            console.error(error);
            alert("Error deleting product");
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
            {products.length === 0 && !error ? (
                <p>No products available.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="border p-4 rounded shadow hover:shadow-lg transition"
                        >
                            {product.image && (
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-48 object-cover mb-2 rounded"
                                    width={500}
                                    height={500}
                                />
                            )}
                            <h2 className="text-xl font-semibold">
                                {product.name}
                            </h2>
                            <p className="text-gray-600 truncate">
                                {product.description}
                            </p>
                            <p className="text-lg font-bold mt-2">
                                ${product.price.toFixed(2)}
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
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
