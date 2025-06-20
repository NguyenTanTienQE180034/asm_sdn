import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    await connectDB();
    const { email, password, name } = await req.json();

    if (!email || !password)
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const existingUser = await User.findOne({ email });
    if (existingUser)
        return NextResponse.json(
            { error: "Email already exists" },
            { status: 400 }
        );

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name });

    return NextResponse.json({ message: "User created" }, { status: 201 });
}
