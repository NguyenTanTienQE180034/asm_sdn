"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NewProduct() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState(null);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") return <div>Loading...</div>;
    if (!session) {
        router.push("/auth/login");
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setError("");

        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        if (image) formData.append("image", image);

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                router.push(`/products?refresh=${Date.now()}`);
            } else {
                const errorData = await res.json();
                setError(errorData.error || "Failed to create product");
            }
        } catch (err) {
            setError("Error creating product");
            console.error("Create product error:", err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full border rounded p-2"
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium"
                    >
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full border rounded p-2"
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div>
                    <label
                        htmlFor="price"
                        className="block text-sm font-medium"
                    >
                        Price
                    </label>
                    <input
                        id="price"
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="mt-1 block w-full border rounded p-2"
                        required
                        disabled={isSubmitting}
                    />
                </div>
                <div>
                    <label
                        htmlFor="image"
                        className="block text-sm font-medium"
                    >
                        Image
                    </label>
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="mt-1 block w-full"
                        disabled={isSubmitting}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Creating..." : "Create Product"}
                </button>
            </form>
        </div>
    );
}
