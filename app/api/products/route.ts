import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import Product from "../../../models/Product";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import cloudinary from "../../../lib/cloudinary";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "6", 10);
        const skip = (page - 1) * limit;
        const search = searchParams.get("search") || "";

        // Thêm filter cho search
        const filter = search
            ? {
                  $or: [
                      { name: { $regex: search, $options: "i" } },
                      { description: { $regex: search, $options: "i" } },
                  ],
              }
            : {};

        const [products, totalProducts] = await Promise.all([
            Product.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Product.countDocuments(filter),
        ]);

        return NextResponse.json({
            products,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalProducts / limit),
                totalProducts,
                limit,
            },
        });
    } catch (error) {
        console.error("Error in GET /api/products:", {
            message: error.message,
            stack: error.stack,
        });
        return NextResponse.json(
            { error: "Failed to fetch products", details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await connectDB();
        const formData = await req.formData();
        const name = formData.get("name");
        const description = formData.get("description");
        const price = parseFloat(formData.get("price"));
        const image = formData.get("image");

        let imageUrl = "";
        if (image) {
            const bytes = await image.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const uploadResult = await new Promise<any>((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        {
                            public_id: `products/${uuidv4()}`,
                            folder: "ecommerce",
                        },
                        (error, result) => {
                            if (error) reject(error);
                            resolve(result);
                        }
                    )
                    .end(buffer);
            });
            imageUrl = uploadResult.secure_url;
        }

        const product = await Product.create({
            name,
            description,
            price,
            image: imageUrl,
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/products:", {
            message: error.message,
            stack: error.stack,
        });
        return NextResponse.json(
            { error: "Failed to create product", details: error.message },
            { status: 500 }
        );
    }
}
