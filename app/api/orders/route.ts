import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const orders = await Order.find({ userId: session.user.id }).populate(
        "items.productId"
    );
    return NextResponse.json(orders);
}

export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const cart = await Cart.findOne({ userId: session.user.id }).populate(
        "items.productId"
    );
    if (!cart || cart.items.length === 0)
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

    const totalAmount = cart.items.reduce(
        (sum: number, item: any) => sum + item.quantity * item.productId.price,
        0
    );
    const orderItems = cart.items.map((item: any) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
    }));

    const order = await Order.create({
        userId: session.user.id,
        items: orderItems,
        totalAmount,
        status: "pending",
    });

    cart.items = [];
    await cart.save();
    return NextResponse.json(order, { status: 201 });
}
