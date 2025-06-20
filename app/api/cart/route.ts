import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const cart = await Cart.findOne({ userId: session.user.id }).populate(
        "items.productId"
    );

    if (cart) {
        // Filter out items where productId is null (deleted products)
        const validItems = cart.items.filter(
            (item: any) => item.productId !== null
        );

        // Update cart if invalid items were found
        if (validItems.length !== cart.items.length) {
            cart.items = validItems;
            await cart.save();
        }

        return NextResponse.json({ ...cart._doc, items: validItems });
    }

    return NextResponse.json({ items: [] });
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { productId, quantity } = await req.json();
    let cart = await Cart.findOne({ userId: session.user.id });

    if (!cart) {
        cart = new Cart({ userId: session.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
        (item: any) => item.productId.toString() === productId
    );
    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
    } else {
        cart.items.push({ productId, quantity });
    }

    await cart.save();

    // Populate and return updated cart
    const updatedCart = await Cart.findOne({
        userId: session.user.id,
    }).populate("items.productId");

    return NextResponse.json(updatedCart);
}

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { productId } = await req.json();
    let cart = await Cart.findOne({ userId: session.user.id });

    if (!cart)
        return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    cart.items = cart.items.filter(
        (item: any) => item.productId.toString() !== productId
    );
    await cart.save();

    // Populate and return updated cart
    const updatedCart = await Cart.findOne({
        userId: session.user.id,
    }).populate("items.productId");

    return NextResponse.json(updatedCart);
}

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { productId, quantity } = await req.json();
    let cart = await Cart.findOne({ userId: session.user.id });

    if (!cart)
        return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    const itemIndex = cart.items.findIndex(
        (item: any) => item.productId.toString() === productId
    );
    if (itemIndex > -1) {
        if (quantity > 0) {
            cart.items[itemIndex].quantity = quantity;
        } else {
            cart.items.splice(itemIndex, 1);
        }
        await cart.save();

        // Populate and return updated cart
        const updatedCart = await Cart.findOne({
            userId: session.user.id,
        }).populate("items.productId");

        return NextResponse.json(updatedCart);
    }

    return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
    );
}
