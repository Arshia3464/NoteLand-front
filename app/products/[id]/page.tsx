"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${BASE_URL}/products/${id}/`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Product not found");
        }

        const json = await res.json();
        setProduct(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddItem = async (product: Product) => {
    try {
      // 1️⃣ Check if user is logged in
      const authRes = await fetch(`${BASE_URL}/users/me/`, {
        credentials: "include",
      });
      if (!authRes.ok) {
        alert("Please login first!");
        return;
      }

      // 2️⃣ Add item to cart
      const res = await fetch(`${BASE_URL}/cart/add/`, {
        method: "POST",
        credentials: "include", // send httpOnly cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
        }),
      });

      if (!res.ok) throw new Error("Failed to add item to cart");

      const data = await res.json();
      console.log("Item added:", data);
      alert("Item added to cart successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Something went wrong");
    }
  };

  if (loading) return <p className="p-8">Loading...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;
  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-black">{product.name}</h1>

      <p className="mt-4 text-gray-700">{product.description}</p>

      <p className="mt-6 text-2xl font-bold text-black">${product.price}</p>
      <button
        className="bg-green-800 cursor-pointer rounded-xl p-4"
        onClick={() => handleAddItem(product)}
      >
        Add to Cart
      </button>
    </div>
  );
}
