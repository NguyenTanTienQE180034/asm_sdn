"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import CartButton from "./CartButton";
import CartDropdownContent from "./CartDropDownContent";
import LoginPrompt from "./LoginPrompt";
import CustomStyles from "./CustomStyle";

export default function CartDropdown() {
    const { data: session } = useSession();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [cartRefresh, setCartRefresh] = useState(0);
    const cartRef = useRef(null);
    const loginPromptRef = useRef(null);
    useEffect(() => {
        const fetchCart = async () => {
            if (!session) {
                setCartItems([]);
                return;
            }
            try {
                const res = await fetch("/api/cart");
                if (!res.ok) {
                    throw new Error(`Failed to fetch cart: ${res.status}`);
                }
                const data = await res.json();
                if (Array.isArray(data.items)) {
                    setCartItems(data.items);
                } else {
                    console.error("Invalid cart data format:", data);
                    setCartItems([]);
                }
            } catch (error) {
                console.error("Fetch cart error:", error.message);
                setCartItems([]);
            }
        };

        fetchCart();
    }, [session, cartRefresh]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cartRef.current && !cartRef.current.contains(event.target)) {
                setIsCartOpen(false);
            }
            if (
                loginPromptRef.current &&
                !loginPromptRef.current.contains(event.target)
            ) {
                setIsLoginPromptOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Disable body scroll when popup is open
    useEffect(() => {
        if (isLoginPromptOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isLoginPromptOpen]);

    // Listen for cart updates
    useEffect(() => {
        const handleCartUpdate = () => {
            setCartRefresh((prev) => prev + 1);
        };
        window.addEventListener("cartUpdated", handleCartUpdate);
        return () =>
            window.removeEventListener("cartUpdated", handleCartUpdate);
    }, []);

    const handleUpdateQuantity = async (productId, quantity) => {
        if (!session) {
            setIsLoginPromptOpen(true);
            return;
        }
        try {
            const res = await fetch("/api/cart", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity }),
            });
            if (res.ok) {
                const data = await res.json();
                setCartItems(data.items);
                window.dispatchEvent(new Event("cartUpdated"));
            } else {
                const errorData = await res.json();
                alert(
                    `Failed to update quantity: ${
                        errorData.error || "Unknown error"
                    }`
                );
            }
        } catch (error) {
            console.error("Update quantity error:", error.message);
            alert("Error updating quantity");
        }
    };

    const handleRemoveFromCart = async (productId) => {
        if (!session) {
            setIsLoginPromptOpen(true);
            return;
        }
        try {
            const res = await fetch("/api/cart", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });
            if (res.ok) {
                const data = await res.json();
                setCartItems(data.items);
                window.dispatchEvent(new Event("cartUpdated"));
            } else {
                const errorData = await res.json();
                alert(
                    `Failed to remove item: ${
                        errorData.error || "Unknown error"
                    }`
                );
            }
        } catch (error) {
            console.error("Remove from cart error:", error.message);
            alert("Error removing item");
        }
    };

    const handleCartClick = () => {
        if (!session) {
            setIsLoginPromptOpen(true);
            return;
        }
        setIsCartOpen(!isCartOpen);
    };

    const getTotalPrice = () => {
        return cartItems
            .reduce(
                (total, item) => total + Number(item.price) * item.quantity,
                0
            )
            .toFixed(2);
    };

    return (
        <div className="relative" ref={cartRef}>
            <CartButton
                onClick={handleCartClick}
                session={session}
                cartItems={cartItems}
            />
            {isCartOpen && (
                <CartDropdownContent
                    cartItems={cartItems}
                    handleUpdateQuantity={handleUpdateQuantity}
                    handleRemoveFromCart={handleRemoveFromCart}
                    setIsCartOpen={setIsCartOpen}
                    getTotalPrice={getTotalPrice}
                />
            )}
            <LoginPrompt
                isOpen={isLoginPromptOpen}
                setIsOpen={setIsLoginPromptOpen}
                loginPromptRef={loginPromptRef}
            />
            <CustomStyles />
        </div>
    );
}
