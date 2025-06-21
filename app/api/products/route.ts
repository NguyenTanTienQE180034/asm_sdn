import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";

import Product from "../../../models/Product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import cloudinary from "../../../lib/cloudinary";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
    try {
        console.log("Fetching products from database...");
        await connectDB();
        const products = await Product.find().sort({ createdAt: -1 });
        console.log("Found products:", products.length);
        return NextResponse.json(products);
    } catch (error: any) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Failed to fetch products", details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const image = formData.get("image") as File;

    let imageUrl = "";
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
        imageUrl = (uploadResult as any).secure_url;
    }

    const product = await Product.create({
        name,
        description,
        price,
        image: imageUrl,
    });

    return NextResponse.json(product, { status: 201 });
}
