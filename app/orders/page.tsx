"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ShoppingBag, Package, AlertCircle } from "lucide-react";

interface OrderItem {
    productId: { _id: string; name: string; price: number; image: string };
    quantity: number;
    price: number;
    image: string;
}

interface Order {
    _id: string;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    createdAt: string;
}

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.push("/auth/login");
            return;
        }
        const fetchOrders = async () => {
            try {
                const res = await fetch("/api/orders");
                if (!res.ok) throw new Error("Failed to load orders");
                const data = await res.json();
                const sortedOrders = data.sort((a: Order, b: Order) => {
                    return (
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    );
                });
                setOrders(sortedOrders);
            } catch (err) {
                console.error(err);
                setError("Failed to load orders. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [session, router]);

    if (!session) return null;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 font-medium">
                        Loading your orders...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
                    <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 font-medium">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Your Orders
                    </h1>
                    <p className="mt-2 text-gray-600 text-lg">
                        View and track your order history
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-6">
                            <ShoppingBag className="w-10 h-10 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                            No Orders Yet
                        </h3>
                        <p className="text-gray-600 max-w-md mx-auto mb-6">
                            Start shopping now, and your orders will appear
                            here.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                        >
                            <ShoppingBag className="w-5 h-5 mr-2" />
                            Shop Now
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, orderIndex) => (
                            <div
                                key={order._id}
                                className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden animate-fade-in"
                                style={{
                                    animationDelay: `${orderIndex * 0.1}s`,
                                }}
                            >
                                {/* Order Header */}
                                <div className="bg-gray-50 px-6 py-5 border-b border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-blue-600 font-bold">
                                                    #{orderIndex + 1}
                                                </span>
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-900">
                                                    Order #
                                                    {order._id
                                                        .slice(-8)
                                                        .toUpperCase()}
                                                </h2>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(
                                                        order.createdAt
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                    order.status === "completed"
                                                        ? "bg-green-100 text-green-700"
                                                        : order.status ===
                                                          "pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : order.status ===
                                                          "cancelled"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                <span
                                                    className={`w-2 h-2 rounded-full mr-2 ${
                                                        order.status ===
                                                        "completed"
                                                            ? "bg-green-500"
                                                            : order.status ===
                                                              "pending"
                                                            ? "bg-yellow-500"
                                                            : order.status ===
                                                              "cancelled"
                                                            ? "bg-red-500"
                                                            : "bg-gray-500"
                                                    }`}
                                                />
                                                {order.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    order.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="px-6 py-5">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <Package className="w-5 h-5 mr-2 text-gray-500" />
                                        Items ({order.items.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {order.items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={
                                                            item.productId
                                                                ?.image ||
                                                            "/placeholder.jpg"
                                                        }
                                                        alt={
                                                            item.productId
                                                                ?.name ||
                                                            "Deleted Product"
                                                        }
                                                        className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                                                    />
                                                    <div>
                                                        {item.productId ? (
                                                            <p className="font-medium text-gray-900">
                                                                {
                                                                    item
                                                                        .productId
                                                                        .name
                                                                }
                                                            </p>
                                                        ) : (
                                                            <p className="font-medium text-red-600">
                                                                [Deleted
                                                                Product]
                                                            </p>
                                                        )}
                                                        <p className="text-sm text-gray-500">
                                                            Quantity:{" "}
                                                            {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">
                                                        $
                                                        {(
                                                            item.quantity *
                                                            item.price
                                                        ).toFixed(2)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        ${item.price.toFixed(2)}{" "}
                                                        each
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Total */}
                                <div className="bg-gray-50 px-6 py-5 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-900">
                                            Total
                                        </span>
                                        <span className="text-2xl font-bold text-blue-600">
                                            ${order.totalAmount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
