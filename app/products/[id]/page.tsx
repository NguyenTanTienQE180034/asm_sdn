"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
}

export default function ProductDetail() {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { id } = useParams();
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) throw new Error("Product not found");
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                setError("Failed to load product");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!session) {
            router.push("/auth/login");
            return;
        }
        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: id, quantity: 1 }),
            });
            if (res.ok) {
                alert("Product added to cart");
            } else {
                alert("Failed to add to cart");
            }
        } catch (error) {
            console.error(error);
            alert("Error adding to cart");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">{product.name}</h1>
            <div className="flex flex-col md:flex-row gap-6">
                {product.image && (
                    <Image
                        src={product.image}
                        alt={product.name}
                        className="w-full md:w-1/2 h-64 object-cover rounded"
                        width={500}
                        height={500}
                    />
                )}
                <div className="flex-1">
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <p className="text-2xl font-bold mb-4">
                        ${product.price.toFixed(2)}
                    </p>
                    {session ? (
                        <button
                            onClick={handleAddToCart}
                            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                            Add to Cart
                        </button>
                    ) : (
                        <p className="text-gray-600">
                            Please{" "}
                            <Link href="/auth/login" className="text-blue-500">
                                log in
                            </Link>{" "}
                            to add to cart.
                        </p>
                    )}
                    {session && (
                        <div className="mt-4 flex space-x-4">
                            <Link
                                href={`/products/${product._id}/edit`}
                                className="text-green-500 hover:underline"
                            >
                                Edit Product
                            </Link>
                            <button
                                onClick={async () => {
                                    if (
                                        !confirm(
                                            "Are you sure you want to delete this product?"
                                        )
                                    )
                                        return;
                                    try {
                                        const res = await fetch(
                                            `/api/products/${id}`,
                                            { method: "DELETE" }
                                        );
                                        if (res.ok) {
                                            router.push("/");
                                        } else {
                                            alert("Failed to delete product");
                                        }
                                    } catch (error) {
                                        console.error(error);
                                        alert("Error deleting product");
                                    }
                                }}
                                className="text-red-500 hover:underline"
                            >
                                Delete Product
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
