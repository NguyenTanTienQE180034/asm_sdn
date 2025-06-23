import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import CartItem from "./CartItemNav";

export default function CartDropdownContent({
    cartItems,
    handleUpdateQuantity,
    handleRemoveFromCart,
    setIsCartOpen,
    getTotalPrice,
}) {
    return (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-[1000] animate-slide-in-right">
            {/* Dropdown Arrow */}
            <div className="absolute -top-2 right-6 w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-100"></div>

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold flex items-center">
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Your Cart
                    </h3>
                    <span className="bg-white/20 px-2 py-1 rounded-full text-sm font-medium">
                        {cartItems.length} items
                    </span>
                </div>
            </div>

            {/* Cart Content */}
            <div className="p-4">
                {cartItems.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <ShoppingCart className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600 font-medium">
                            Cart is empty
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                            Add your favorite products
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Cart Items */}
                        <div className="max-h-56 overflow-y-auto space-y-3 mb-4 scrollbar-thin">
                            {cartItems.map((item) => (
                                <CartItem
                                    key={item.productId}
                                    item={item}
                                    handleUpdateQuantity={handleUpdateQuantity}
                                    handleRemoveFromCart={handleRemoveFromCart}
                                />
                            ))}
                        </div>

                        {/* Total Section */}
                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-600 font-medium">
                                    Total:
                                </span>
                                <span className="text-xl font-bold text-gray-800">
                                    ${getTotalPrice()}
                                </span>
                            </div>
                        </div>
                    </>
                )}

                {/* View Cart Button */}
                <Link
                    href="/cart"
                    className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-center py-2.5 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:scale-[1.01]"
                    onClick={() => setIsCartOpen(false)}
                    aria-label="View full cart"
                >
                    <span className="flex items-center justify-center">
                        View Cart
                        <svg
                            className="w-4 h-4 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    </span>
                </Link>
            </div>
        </div>
    );
}
