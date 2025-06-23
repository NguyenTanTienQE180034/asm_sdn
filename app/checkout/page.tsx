"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { CheckCircle, AlertCircle, X } from "lucide-react";

interface CartItem {
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface Cart {
    items: CartItem[];
}

export default function Checkout() {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [popupType, setPopupType] = useState<"success" | "error">("success");
    const { data: session } = useSession();
    const router = useRouter();
    const popupRef = useRef<HTMLDivElement>(null);

    // Fetch cart items
    useEffect(() => {
        if (!session) {
            router.push("/auth/login");
            return;
        }
        const fetchCart = async () => {
            try {
                const res = await fetch("/api/cart");
                if (!res.ok) {
                    throw new Error(`Failed to load cart: ${res.status}`);
                }
                const data = await res.json();
                if (!Array.isArray(data.items)) {
                    throw new Error("Invalid cart data format");
                }
                setCart({ items: data.items });
            } catch (err) {
                console.error("Fetch cart error:", err.message);
                setError(`Failed to load cart: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [session, router]);

    // Close popup on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node)
            ) {
                setIsPopupOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Disable body scroll when popup is open
    useEffect(() => {
        if (isPopupOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isPopupOpen]);

    const handleUpdateQuantity = async (
        productId: string,
        quantity: number
    ) => {
        try {
            const res = await fetch("/api/cart", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity }),
            });
            if (res.ok) {
                const data = await res.json();
                setCart({ items: data.items });
                window.dispatchEvent(new Event("cartUpdated"));
            } else {
                const errorData = await res.json();
                setPopupMessage(
                    `Failed to update quantity: ${
                        errorData.error || "Unknown error"
                    }`
                );
                setPopupType("error");
                setIsPopupOpen(true);
            }
        } catch (error) {
            console.error("Update quantity error:", error.message);
            setPopupMessage("Error updating quantity");
            setPopupType("error");
            setIsPopupOpen(true);
        }
    };

    const handlePlaceOrder = async () => {
        if (!cart || cart.items.length === 0) {
            setPopupMessage("Cart is empty");
            setPopupType("error");
            setIsPopupOpen(true);
            return;
        }
        try {
            // Simulate payment processing
            const paymentSuccess = true;
            if (!paymentSuccess) throw new Error("Payment failed");

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                setPopupMessage("Order placed successfully!");
                setPopupType("success");
                setIsPopupOpen(true);
                setCart({ items: [] });
                window.dispatchEvent(new Event("cartUpdated"));
                setTimeout(() => {
                    setIsPopupOpen(false);
                    router.push("/orders");
                }, 2000); // Redirect after 2 seconds
            } else {
                const errorData = await res.json();
                setPopupMessage(
                    `Failed to place order: ${
                        errorData.error || "Unknown error"
                    }`
                );
                setPopupType("error");
                setIsPopupOpen(true);
            }
        } catch (error) {
            console.error("Place order error:", error.message);
            setPopupMessage("Error placing order");
            setPopupType("error");
            setIsPopupOpen(true);
        }
    };

    const total =
        cart?.items.reduce(
            (sum, item) => sum + item.quantity * Number(item.price || 0),
            0
        ) || 0;

    if (!session) return null;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-slate-600 font-medium">
                        Loading your cart...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100">
                    <div className="flex items-center space-x-3 text-red-600 mb-4">
                        <AlertCircle className="w-8 h-8" />
                        <h2 className="text-xl font-bold">Error</h2>
                    </div>
                    <p className="text-slate-700">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        Checkout
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
                </div>

                {cart?.items.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-slate-100">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg
                                    className="w-12 h-12 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">
                                Your cart is empty
                            </h2>
                            <p className="text-slate-600 mb-8">
                                Looks like you haven&apos;t added any items to
                                your cart yet.
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16l-4-4m0 0l4-4m-4 4h18"
                                    />
                                </svg>
                                <span>Continue Shopping</span>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Order Summary */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                                <div className="flex items-center space-x-3 mb-8">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5H7a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-800">
                                        Order Summary
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    {cart?.items.map((item, index) => (
                                        <div
                                            key={item.productId}
                                            className={`flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-100 hover:shadow-md transition-all duration-200 ${
                                                index !== cart.items.length - 1
                                                    ? "mb-4"
                                                    : ""
                                            }`}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="relative">
                                                    <img
                                                        src={
                                                            item.image ||
                                                            "/placeholder.jpg"
                                                        }
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded-xl shadow-md"
                                                    />
                                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                        {item.quantity}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-800 text-lg">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-slate-600">
                                                        Quantity:{" "}
                                                        {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-slate-800">
                                                    $
                                                    {(
                                                        item.quantity *
                                                        Number(item.price || 0)
                                                    ).toFixed(2)}
                                                </p>
                                                <p className="text-slate-500 text-sm">
                                                    $
                                                    {Number(
                                                        item.price || 0
                                                    ).toFixed(2)}{" "}
                                                    each
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Payment Section */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 sticky top-8">
                                {/* Total */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-700 font-medium text-lg">
                                            Total Amount
                                        </span>
                                        <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                            ${total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className="mb-8">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                            <svg
                                                className="w-6 h-6 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800">
                                            Payment Information
                                        </h3>
                                    </div>

                                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
                                        <div className="flex items-start space-x-3">
                                            <svg
                                                className="w-6 h-6 text-amber-600 mt-0.5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <div>
                                                <p className="text-amber-800 font-medium mb-1">
                                                    Demo Mode
                                                </p>
                                                <p className="text-amber-700 text-sm">
                                                    Payment processing is
                                                    simulated. For production,
                                                    integrate Stripe here.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    onClick={handlePlaceOrder}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
                                    aria-label="Place order"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span>Place Order</span>
                                </button>

                                {/* Security Info */}
                                <div className="mt-6 flex items-center justify-center space-x-2 text-slate-500 text-sm">
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                    <span>Secure checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Message Popup */}
                {isPopupOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[2000] min-h-screen overflow-auto p-4 animate-fade-in">
                        <div
                            ref={popupRef}
                            className="bg-white rounded-2xl shadow-2xl max-w-xs sm:max-w-sm w-full p-6 relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsPopupOpen(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                                aria-label="Close message popup"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Popup Content */}
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                                    {popupType === "success" ? (
                                        <CheckCircle className="h-8 w-8 text-green-600" />
                                    ) : (
                                        <AlertCircle className="h-8 w-8 text-red-600" />
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    {popupType === "success"
                                        ? "Success"
                                        : "Error"}
                                </h3>
                                <p className="text-gray-600 text-sm mb-6">
                                    {popupMessage}
                                </p>
                                <button
                                    onClick={() => setIsPopupOpen(false)}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:scale-[1.01]"
                                    aria-label="Close message popup"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
