"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface CartItem {
    productId: {
        _id: string;
        name: string;
        price: number;
        image: string;
    } | null;
    quantity: number;
}

interface Cart {
    items: CartItem[];
}

export default function Cart() {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.push("/auth/login");
            return;
        }
        const fetchCart = async () => {
            try {
                const res = await fetch("/api/cart");
                if (!res.ok) throw new Error("Failed to load cart");
                const data = await res.json();
                setCart(data);
            } catch (err) {
                setError("Failed to load cart");
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [session, router]);

    const updateQuantity = async (productId: string, quantity: number) => {
        try {
            const res = await fetch("/api/cart", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity }),
            });
            if (res.ok) {
                const updatedCart = await res.json();
                setCart(updatedCart);
            } else {
                alert("Failed to update quantity");
            }
        } catch (error) {
            alert("Error updating quantity");
        }
    };

    const removeItem = async (productId: string) => {
        try {
            const res = await fetch("/api/cart", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });
            if (res.ok) {
                const updatedCart = await res.json();
                setCart(updatedCart);
            } else {
                alert("Failed to remove item");
            }
        } catch (error) {
            alert("Error removing item");
        }
    };

    if (!session) return null;
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    // Filter out items with null productId and calculate total safely
    const validItems =
        cart?.items.filter((item) => item.productId !== null) || [];
    const total = validItems.reduce(
        (sum, item) => sum + item.quantity * (item.productId?.price || 0),
        0
    );

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
            {validItems.length === 0 ? (
                <p>
                    Your cart is empty.{" "}
                    <Link href="/" className="text-blue-500">
                        Continue shopping
                    </Link>
                </p>
            ) : (
                <>
                    <div className="space-y-4">
                        {validItems.map((item) => (
                            <div
                                key={item.productId!._id}
                                className="flex items-center border p-4 rounded"
                            >
                                {item.productId!.image && (
                                    <img
                                        src={item.productId!.image}
                                        alt={item.productId!.name}
                                        className="w-24 h-24 object-cover rounded mr-4"
                                    />
                                )}
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold">
                                        {item.productId!.name}
                                    </h2>
                                    <p className="text-gray-600">
                                        ${item.productId!.price.toFixed(2)} x{" "}
                                        {item.quantity}
                                    </p>
                                    <div className="flex items-center mt-2">
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.productId!._id,
                                                    item.quantity - 1
                                                )
                                            }
                                            className="bg-gray-200 px-2 py-1 rounded"
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="mx-2">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.productId!._id,
                                                    item.quantity + 1
                                                )
                                            }
                                            className="bg-gray-200 px-2 py-1 rounded"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() =>
                                                removeItem(item.productId!._id)
                                            }
                                            className="text-red-500 ml-4 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                                <p className="text-lg font-bold">
                                    $
                                    {(
                                        item.quantity * item.productId!.price
                                    ).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 p-4 border rounded">
                        <h2 className="text-xl font-bold">
                            Total: ${total.toFixed(2)}
                        </h2>
                        <Link
                            href="/checkout"
                            className="bg-blue-500 text-white p-2 rounded mt-4 inline-block"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
