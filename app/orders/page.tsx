"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface OrderItem {
    productId: { _id: string; name: string; price: number };
    quantity: number;
    price: number;
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
                setOrders(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [session, router]);

    if (!session) return null;
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Order History</h1>
            {orders.length === 0 ? (
                <p>
                    You have no orders yet.{" "}
                    <Link href="/" className="text-blue-500">
                        Continue shopping
                    </Link>
                </p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="border p-4 rounded">
                            <h2 className="text-xl font-semibold">
                                Order #{order._id}
                            </h2>
                            <p className="text-gray-600">
                                Placed on:{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600">
                                Status: {order.status}
                            </p>
                            <div className="mt-4">
                                <h3 className="font-bold">Items</h3>
                                {order.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between py-2"
                                    >
                                        <span>
                                            {item.productId ? (
                                                item.productId.name
                                            ) : (
                                                <span className="text-red-500">
                                                    [Deleted Product]
                                                </span>
                                            )}{" "}
                                            x {item.quantity}
                                        </span>
                                        <span>
                                            $
                                            {(
                                                item.quantity * item.price
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p className="font-bold mt-4">
                                Total: ${order.totalAmount.toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
