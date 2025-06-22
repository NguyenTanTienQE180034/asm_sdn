import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Cart from "../../../models/Cart";
import Product from "../../../models/Product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import mongoose from "mongoose";

// Helper: Retry connectDB
async function connectWithRetry(attempts = 3, delay = 1000) {
    for (let i = 0; i < attempts; i++) {
        try {
            console.log(`Connection attempt ${i + 1}/${attempts}...`);
            await connectDB();
            console.log("MongoDB connected successfully");
            return;
        } catch (error: any) {
            console.error(`Connection attempt ${i + 1} failed:`, error.message);
            if (i < attempts - 1)
                await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    throw new Error("Failed to connect to MongoDB after retries");
}

export async function GET() {
    try {
        console.log("GET /api/cart: Starting request...");
        const session = await getServerSession(authOptions);
        if (!session) {
            console.warn("GET /api/cart: Unauthorized access attempt");
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectWithRetry();
        const userId = new mongoose.Types.ObjectId(session.user.id);
        const cart = await Cart.findOne({ userId })
            .populate("items.productId", "name price image")
            .lean();

        const items =
            cart?.items
                .filter((item: any) => item.productId) // Ensure productId exists
                .map((item: any) => ({
                    productId: item.productId._id.toString(),
                    name: item.productId.name || "Unknown Product",
                    price: item.productId.price || 0,
                    image: item.productId.image || "/placeholder.jpg",
                    quantity: item.quantity,
                })) || [];

        console.log("GET /api/cart: Cart fetched", { items: items.length });
        return NextResponse.json({ items });
    } catch (error: any) {
        console.error("GET /api/cart: Error:", {
            message: error.message,
            stack: error.stack,
        });
        return NextResponse.json(
            { error: "Failed to fetch cart", details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        console.log("POST /api/cart: Starting request...");
        const session = await getServerSession(authOptions);
        if (!session) {
            console.warn("POST /api/cart: Unauthorized access attempt");
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { productId, quantity = 1 } = await req.json();
        if (!mongoose.Types.ObjectId.isValid(productId) || quantity < 1) {
            console.warn("POST /api/cart: Invalid input", {
                productId,
                quantity,
            });
            return NextResponse.json(
                { error: "Invalid input data" },
                { status: 400 }
            );
        }

        await connectWithRetry();
        const product = await Product.findById(productId).lean();
        if (!product) {
            console.warn("POST /api/cart: Product not found", { productId });
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }

        const userId = new mongoose.Types.ObjectId(session.user.id);
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            console.log("POST /api/cart: Creating new cart...");
            cart = new Cart({ userId, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(
            (item: any) => item.productId.toString() === productId
        );
        if (existingItemIndex >= 0) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        const populatedCart = await Cart.findOne({ userId })
            .populate("items.productId", "name price image")
            .lean();

        const items =
            populatedCart?.items
                .filter((item: any) => item.productId)
                .map((item: any) => ({
                    productId: item.productId._id.toString(),
                    name: item.productId.name || "Unknown Product",
                    price: item.productId.price || 0,
                    image: item.productId.image || "/placeholder.jpg",
                    quantity: item.quantity,
                })) || [];

        console.log("POST /api/cart: Cart updated", { items: items.length });
        return NextResponse.json({ items });
    } catch (error: any) {
        console.error("POST /api/cart: Error:", {
            message: error.message,
            stack: error.stack,
        });
        return NextResponse.json(
            { error: "Failed to add to cart", details: error.message },
            { status: 500 }
        );
    }
}

export async function PATCH(req: Request) {
    try {
        console.log("PATCH /api/cart: Starting request...");
        const session = await getServerSession(authOptions);
        if (!session) {
            console.warn("PATCH /api/cart: Unauthorized access attempt");
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { productId, quantity } = await req.json();
        if (
            !mongoose.Types.ObjectId.isValid(productId) ||
            !Number.isInteger(quantity) ||
            quantity < 0
        ) {
            console.warn("PATCH /api/cart: Invalid input", {
                productId,
                quantity,
            });
            return NextResponse.json(
                { error: "Invalid input data" },
                { status: 400 }
            );
        }

        await connectWithRetry();
        const userId = new mongoose.Types.ObjectId(session.user.id);
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            console.warn("PATCH /api/cart: Cart not found");
            return NextResponse.json(
                { error: "Cart not found" },
                { status: 404 }
            );
        }

        const itemIndex = cart.items.findIndex(
            (item: any) => item.productId.toString() === productId
        );
        if (itemIndex === -1) {
            console.warn("PATCH /api/cart: Item not found", { productId });
            return NextResponse.json(
                { error: "Item not found" },
                { status: 404 }
            );
        }

        if (quantity === 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        const populatedCart = await Cart.findOne({ userId })
            .populate("items.productId", "name price image")
            .lean();

        const items =
            populatedCart?.items
                .filter((item: any) => item.productId)
                .map((item: any) => ({
                    productId: item.productId._id.toString(),
                    name: item.productId.name || "Unknown Product",
                    price: item.productId.price || 0,
                    image: item.productId.image || "/placeholder.jpg",
                    quantity: item.quantity,
                })) || [];

        console.log("PATCH /api/cart: Cart updated", { items: items.length });
        return NextResponse.json({ items });
    } catch (error: any) {
        console.error("PATCH /api/cart: Error:", {
            message: error.message,
            stack: error.stack,
        });
        return NextResponse.json(
            { error: "Failed to update cart", details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    try {
        console.log("DELETE /api/cart: Starting request...");
        const session = await getServerSession(authOptions);
        if (!session) {
            console.warn("DELETE /api/cart: Unauthorized access attempt");
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { productId } = await req.json();
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            console.warn("DELETE /api/cart: Invalid input", { productId });
            return NextResponse.json(
                { error: "Invalid input data" },
                { status: 400 }
            );
        }

        await connectWithRetry();
        const userId = new mongoose.Types.ObjectId(session.user.id);
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            console.warn("DELETE /api/cart: Cart not found");
            return NextResponse.json(
                { error: "Cart not found" },
                { status: 404 }
            );
        }

        cart.items = cart.items.filter(
            (item: any) => item.productId.toString() !== productId
        );
        await cart.save();
        const populatedCart = await Cart.findOne({ userId })
            .populate("items.productId", "name price image")
            .lean();

        const items =
            populatedCart?.items
                .filter((item: any) => item.productId)
                .map((item: any) => ({
                    productId: item.productId._id.toString(),
                    name: item.productId.name || "Unknown Product",
                    price: item.productId.price || 0,
                    image: item.productId.image || "/placeholder.jpg",
                    quantity: item.quantity,
                })) || [];

        console.log("DELETE /api/cart: Item removed", { items: items.length });
        return NextResponse.json({ items });
    } catch (error: any) {
        console.error("DELETE /api/cart: Error:", {
            message: error.message,
            stack: error.stack,
        });
        return NextResponse.json(
            { error: "Failed to remove from cart", details: error.message },
            { status: 500 }
        );
    }
}
