import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import Product, { IProduct } from "../../../../models/Product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import cloudinary from "../../../../lib/cloudinary";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

// GET /api/products/[id]
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
            { error: "Invalid product ID" },
            { status: 400 }
        );
    }

    try {
        await connectDB();
        const product = await Product.findById<IProduct>(id);
        if (!product) {
            return NextResponse.json(
                { error: "Product not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(product);
    } catch (error) {
        console.error("GET error:", error);
        return NextResponse.json(
            { error: "Failed to fetch product" },
            { status: 500 }
        );
    }
}

// PUT /api/products/[id]
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
            { error: "Invalid product ID" },
            { status: 400 }
        );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const image = formData.get("image") as File | null;

    const updateData: Partial<IProduct> = {
        name,
        description,
        price,
        updatedAt: new Date(),
    };

    if (image) {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        try {
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        {
                            public_id: `products/${uuidv4()}`,
                            folder: "ecommerce",
                        },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result);
                        }
                    )
                    .end(buffer);
            });

            updateData.image = (uploadResult as any).secure_url;
        } catch (error) {
            console.error("Image upload error:", error);
            return NextResponse.json(
                { error: "Failed to upload image" },
                { status: 500 }
            );
        }
    }

    const product = await Product.findByIdAndUpdate<IProduct>(id, updateData, {
        new: true,
    });

    if (!product) {
        return NextResponse.json(
            { error: "Product not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(product);
}

// DELETE /api/products/[id]
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json(
            { error: "Invalid product ID" },
            { status: 400 }
        );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const product = await Product.findByIdAndDelete<IProduct>(id);

    if (!product) {
        return NextResponse.json(
            { error: "Product not found" },
            { status: 404 }
        );
    }

    return NextResponse.json({ message: "Product deleted" });
}
