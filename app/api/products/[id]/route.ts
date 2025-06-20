import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import cloudinary from "@/lib/cloudinary";
import { v4 as uuidv4 } from "uuid";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await connectDB();
    const product = await Product.findById(params.id);
    if (!product)
        return NextResponse.json(
            { error: "Product not found" },
            { status: 404 }
        );
    return NextResponse.json(product);
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const image = formData.get("image") as File;

    const updateData: any = { name, description, price, updatedAt: new Date() };

    if (image) {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    { public_id: `products/${uuidv4()}`, folder: "ecommerce" },
                    (error, result) => {
                        if (error) reject(error);
                        resolve(result);
                    }
                )
                .end(buffer);
        });
        updateData.image = (uploadResult as any).secure_url;
    }

    const product = await Product.findByIdAndUpdate(params.id, updateData, {
        new: true,
    });
    if (!product)
        return NextResponse.json(
            { error: "Product not found" },
            { status: 404 }
        );

    return NextResponse.json(product);
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const product = await Product.findByIdAndDelete(params.id);
    if (!product)
        return NextResponse.json(
            { error: "Product not found" },
            { status: 404 }
        );

    return NextResponse.json({ message: "Product deleted" });
}
