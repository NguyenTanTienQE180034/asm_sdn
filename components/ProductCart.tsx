"use client";
import Link from "next/link";

function ProductCard({ product, handleAddToCart }) {
    return (
        <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-visible border border-gray-100">
            <div className="overflow-hidden bg-gray-100">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-auto max-h-64 object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <svg
                            className="w-16 h-16 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                )}

                {/* Overlay with quick actions */}
            </div>

            {/* Product Info */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {product.name}
                </h3>

                {product.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                    </p>
                )}

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <span className="text-3xl font-bold text-blue-600">
                            ${Number(product.price).toFixed(2)}
                        </span>
                    </div>

                    {/* Rating stars (placeholder) */}
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                className="w-4 h-4 text-yellow-400 fill-current"
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                        ))}
                        <span className="text-gray-500 text-xs ml-1">
                            (4.5)
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                    <Link
                        href={`/products/${product._id}`}
                        className="flex-1 text-center py-2 px-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50"
                    >
                        Chi tiết
                    </Link>
                    <button
                        onClick={() => handleAddToCart(product._id)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 flex items-center justify-center cursor-pointer"
                    >
                        <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5m6-2.5h2.5"
                            />
                        </svg>
                        Thêm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
