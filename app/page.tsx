"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import Image from "next/image";
import { useSearch } from "../context/SearchContext";

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
}

export default function Home() {
    const { data: session } = useSession();
    const { search, setSearch } = useSearch();
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        fetchProducts();
    }, [search, currentPage]);

    const fetchProducts = async () => {
        try {
            const res = await fetch(
                `/api/products?search=${search}&page=${currentPage}&limit=${itemsPerPage}`
            );
            if (!res.ok) throw new Error("Failed to fetch products");
            const data = await res.json();
            console.log("API response:", data);
            if (!data.products || !Array.isArray(data.products)) {
                throw new Error(
                    "Invalid data format: 'products' is not an array"
                );
            }
            setProducts(data.products);
            setTotalPages(Math.ceil(data.total / itemsPerPage));
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            setProducts([]);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                const res = await fetch(`/api/products/${id}`, {
                    method: "DELETE",
                });
                if (!res.ok) throw new Error("Failed to delete product");
                fetchProducts();
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                );
            }
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setSearch("");
    };

    return (
        <div className="container mx-auto p-4">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.isArray(products) && products.length > 0 ? (
                    products.map((product) => (
                        <Card
                            key={product._id}
                            className="flex flex-col justify-between min-h-[500px] hover:shadow-lg transition-shadow duration-300"
                        >
                            <CardHeader>
                                <div className="w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                    {product.image && (
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            width={200}
                                            height={400}
                                            className="object-contain w-full h-full"
                                        />
                                    )}
                                </div>
                                <CardTitle className="text-xl font-semibold text-gray-700 mt-4">
                                    {product.name}
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="flex-grow">
                                <CardDescription className="text-gray-600 mb-2">
                                    {product.description}
                                </CardDescription>
                                <p className="text-lg font-bold text-green-600">
                                    ${product.price}
                                </p>
                            </CardContent>

                            <CardFooter className="flex space-x-2 mt-auto pt-4">
                                <Button asChild>
                                    <Link href={`/products/${product._id}`}>
                                        View
                                    </Link>
                                </Button>

                                {session && (
                                    <>
                                        <Button asChild variant="outline">
                                            <Link href={`/edit/${product._id}`}>
                                                Edit
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() =>
                                                handleDelete(product._id)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </>
                                )}
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <p className="text-gray-500 col-span-3 text-center">
                        No products found.
                    </p>
                )}
            </div>
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                            <Button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                variant={
                                    currentPage === page ? "default" : "outline"
                                }
                            >
                                {page}
                            </Button>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
