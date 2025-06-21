"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface CartItem {
    productId: { _id: string; name: string; price: number };
    quantity: number;
}

interface Cart {
    items: CartItem[];
}

export default function Checkout() {
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
                console.error(err);
                setError("Failed to load cart");
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [session, router]);

    const handlePlaceOrder = async () => {
        if (!cart || cart.items.length === 0) {
            alert("Cart is empty");
            return;
        }
        try {
            // Simulate payment processing (replace with Stripe integration for bonus marks)
            const paymentSuccess = true; // Placeholder for payment result
            if (!paymentSuccess) throw new Error("Payment failed");

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                alert("Order placed successfully!");
                router.push("/orders");
            } else {
                alert("Failed to place order");
            }
        } catch (error) {
            console.error(error);
            alert("Error placing order");
        }
    };

    if (!session) return null;
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    const total =
        cart?.items.reduce(
            (sum, item) => sum + item.quantity * item.productId.price,
            0
        ) || 0;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            {cart?.items.length === 0 ? (
                <p>
                    Your cart is empty.{" "}
                    <Link href="/" className="text-blue-500">
                        Continue shopping
                    </Link>
                </p>
            ) : (
                <>
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Order Summary</h2>
                        {cart?.items.map((item) => (
                            <div
                                key={item.productId._id}
                                className="flex justify-between border-b py-2"
                            >
                                <span>
                                    {item.productId.name} x {item.quantity}
                                </span>
                                <span>
                                    $
                                    {(
                                        item.quantity * item.productId.price
                                    ).toFixed(2)}
                                </span>
                            </div>
                        ))}
                        <div className="flex justify-between font-bold mt-4">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h2 className="text-xl font-bold mb-4">
                            Payment Information
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Payment processing is simulated. For production,
                            integrate Stripe here.
                        </p>
                        <button
                            onClick={handlePlaceOrder}
                            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                            Place Order
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
