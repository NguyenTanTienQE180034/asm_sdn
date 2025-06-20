"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";

interface Product {
    name: string;
    description: string;
    price: number;
    image: string;
}

export default function EditProduct() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();
    const { id } = useParams();
    const { data: session } = useSession();

    useEffect(() => {
        if (!session) {
            router.push("/auth/login");
            return;
        }
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (!res.ok) throw new Error("Product not found");
                const data: Product = await res.json();
                setName(data.name);
                setDescription(data.description);
                setPrice(data.price.toString());
                setLoading(false);
            } catch (err) {
                setError("Failed to load product");
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, session, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        if (image) formData.append("image", image);

        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "PUT",
                body: formData,
            });
            if (res.ok) {
                router.push(`/products/${id}`);
            } else {
                const data = await res.json();
                alert(data.error);
            }
        } catch (error) {
            alert("Failed to update product");
        }
    };

    if (!session) return null;
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block">Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                        min="0"
                        step="0.01"
                    />
                </div>
                <div>
                    <label className="block">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Update Product
                </button>
            </form>
        </div>
    );
}
