import Link from "next/link";
import { ShoppingCart, X } from "lucide-react";

export default function LoginPrompt({ isOpen, setIsOpen, loginPromptRef }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[2000] min-h-screen overflow-auto p-4 animate-fade-in">
            <div
                ref={loginPromptRef}
                className="bg-white rounded-2xl shadow-2xl max-w-xs sm:max-w-sm w-full p-6 relative"
            >
                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    aria-label="Close login prompt"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Popup Content */}
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <ShoppingCart className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Please Log In
                    </h3>
                    <p className="text-gray-600 text-sm mb-6">
                        You need to be logged in to view or modify your cart.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/auth/login"
                            className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-[1.01]"
                            onClick={() => setIsOpen(false)}
                            aria-label="Go to login page"
                        >
                            Log In
                        </Link>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                            aria-label="Cancel and close prompt"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
