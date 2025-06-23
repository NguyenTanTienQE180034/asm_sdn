"use client";
import Link from "next/link";
import { CreditCard } from "lucide-react";

export default function OrderSummary({ cartItems }) {
    const totalPrice = cartItems.reduce((total, item) => {
        const price = Number(item.price) || 0;
        return total + price * item.quantity;
    }, 0);

    return (
        <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg sticky top-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <CreditCard className="w-6 h-6 mr-3 text-purple-500" />
                    Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal ({cartItems.length} items)</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between text-3xl font-bold text-gray-800">
                            <span>Total</span>
                            <span className="text-purple-600">
                                ${totalPrice.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                <Link
                    href="/checkout"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mb-4 block text-center"
                >
                    Proceed to Checkout
                </Link>

                <Link
                    href="/"
                    className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-300 block text-center border border-gray-200"
                >
                    Continue Shopping
                </Link>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm flex items-center justify-center">
                        🔒{" "}
                        <span className="ml-1">Secure checkout guaranteed</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
