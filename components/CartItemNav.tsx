import { Trash2 } from "lucide-react";

export default function CartItem({
    item,
    handleUpdateQuantity,
    handleRemoveFromCart,
}) {
    return (
        <div className="flex items-center bg-gray-50 hover:bg-gray-100 rounded-lg p-3 transition-colors">
            {/* Product Image */}
            <img
                src={item.image || "/placeholder.jpg"}
                alt={item.name}
                className="h-12 w-12 object-cover rounded-md border border-gray-200"
            />

            {/* Product Details */}
            <div className="flex-1 ml-3">
                <p className="font-semibold text-gray-800 text-sm line-clamp-2">
                    {item.name}
                </p>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-blue-600 font-bold text-sm">
                        ${Number(item.price).toFixed(2)}
                    </p>
                    <p className="text-gray-500 text-xs">
                        Total: $
                        {(Number(item.price) * item.quantity).toFixed(2)}
                    </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <button
                            onClick={() =>
                                handleUpdateQuantity(
                                    item.productId,
                                    item.quantity - 1
                                )
                            }
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                        >
                            <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 12H4"
                                />
                            </svg>
                        </button>
                        <span className="w-10 h-8 flex items-center justify-center text-sm font-medium text-gray-800 bg-gray-50">
                            {item.quantity}
                        </span>
                        <button
                            onClick={() =>
                                handleUpdateQuantity(
                                    item.productId,
                                    item.quantity + 1
                                )
                            }
                            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-green-500 hover:bg-green-50"
                            aria-label="Increase quantity"
                        >
                            <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                        </button>
                    </div>
                    <button
                        onClick={() => handleRemoveFromCart(item.productId)}
                        className="ml-2 text-red-500 hover:text-red-700 rounded-full p-1 hover:bg-red-50 transition-colors"
                        aria-label="Remove from cart"
                        title="Remove from cart"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
