"use client";
import { Trash2, Plus, Minus } from "lucide-react";

export default function CartItems({
    cartItems,
    handleUpdateQuantity,
    handleRemoveFromCart,
}) {
    return (
        <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item, index) => (
                <div
                    key={item.productId}
                    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    style={{
                        animationDelay: `${index * 0.1}s`,
                    }}
                >
                    <div className="flex items-center space-x-6">
                        <div className="relative group">
                            <img
                                src={item.image || "/placeholder.jpg"}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">
                                {item.name}
                            </h2>
                            <p className="text-gray-600 text-lg">
                                <span className="text-2xl font-bold text-purple-600">
                                    ${Number(item.price).toFixed(2)}
                                </span>
                                <span className="mx-2 text-gray-400">×</span>
                                <span className="text-gray-700">
                                    {item.quantity}
                                </span>
                            </p>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() =>
                                    handleUpdateQuantity(
                                        item.productId,
                                        item.quantity - 1
                                    )
                                }
                                disabled={item.quantity <= 1}
                                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:hover:scale-100 border border-gray-200"
                            >
                                <Minus className="w-4 h-4 text-gray-600" />
                            </button>

                            <span className="text-2xl font-bold text-gray-800 min-w-[3rem] text-center">
                                {item.quantity}
                            </span>

                            <button
                                onClick={() =>
                                    handleUpdateQuantity(
                                        item.productId,
                                        item.quantity + 1
                                    )
                                }
                                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-200"
                            >
                                <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>

                        <button
                            onClick={() => handleRemoveFromCart(item.productId)}
                            className="w-12 h-12 bg-red-50 hover:bg-red-100 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group border border-red-200"
                        >
                            <Trash2 className="w-5 h-5 text-red-500 group-hover:text-red-600" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
