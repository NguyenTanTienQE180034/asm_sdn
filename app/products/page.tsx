"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const { data: session } = useSession();

    useEffect(() => {
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data));
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map((product) => (
                    <div key={product._id} className="border p-4 rounded">
                        {product.image && (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-48 object-cover mb-2"
                            />
                        )}
                        <h2 className="text-xl font-bold">{product.name}</h2>
                        <p>{product.description}</p>
                        <p className="text-lg font-semibold">
                            ${product.price.toFixed(2)}
                        </p>
                        <Link
                            href={`/products/${product._id}`}
                            className="text-blue-500"
                        >
                            View Details
                        </Link>
                        {session && (
                            <button
                                onClick={() => handleDelete(product._id)}
                                className="text-red-500 ml-4"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
