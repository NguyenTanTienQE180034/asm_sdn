import { ShoppingCart } from "lucide-react";

export default function CartButton({ onClick, session, cartItems }) {
    return (
        <button
            onClick={onClick}
            className="relative text-white hover:text-blue-200 rounded-full p-2 hover:bg-white/10 transition-colors"
            aria-label="View cart"
        >
            <ShoppingCart className="h-6 w-6" />
            {session && cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                </span>
            )}
        </button>
    );
}
