import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the Product document
export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    image: string;
    createdAt: Date;
    updatedAt: Date;
}

// Define the schema
const productSchema: Schema<IProduct> = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, default: "" },
    },
    { timestamps: true }
);

// Create and export the model with explicit typing
const Product: Model<IProduct> =
    mongoose.models.Product ||
    mongoose.model<IProduct>("Product", productSchema);

export default Product;
