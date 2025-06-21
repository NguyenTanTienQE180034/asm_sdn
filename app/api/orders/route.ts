import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Order, { IOrder, IOrderItem } from "../../../models/Order";
import Cart, { ICart, ICartItem } from "../../../models/Cart";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth"; // hoặc đường dẫn phù hợp
import { Session } from "next-auth";
import mongoose from "mongoose";
interface ExtendedSession extends Session {
    user: {
        id: string;
        email?: string | null;
        name?: string | null;
    };
}

export async function GET() {
    const session = (await getServerSession(
        authOptions
    )) as ExtendedSession | null;
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const orders = await Order.find({ userId: session.user.id })
        .populate<{ items: IOrderItem[] }>("items.productId")
        .exec();
    return NextResponse.json(orders);
}

export async function POST() {
    const session = (await getServerSession(
        authOptions
    )) as ExtendedSession | null;
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const cart = await Cart.findOne({ userId: session.user.id })
        .populate<{ items: ICartItem[] }>("items.productId")
        .exec();
    if (!cart || cart.items.length === 0) {
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const totalAmount = cart.items.reduce(
        (sum: number, item: ICartItem) =>
            sum + item.quantity * (item.productId as any).price,
        0
    );

    const orderItems = cart.items.map((item: ICartItem) => ({
        productId: (item.productId as any)._id,
        quantity: item.quantity,
        price: (item.productId as any).price,
    }));

    const order = await Order.create({
        userId: new mongoose.Types.ObjectId(session.user.id),
        items: orderItems,
        totalAmount,
        status: "pending",
    } as IOrder);

    cart.items = [];
    await cart.save();
    return NextResponse.json(order, { status: 201 });
}
