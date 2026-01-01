"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
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
    <div className="min-h-screen bg-[#131C30] text-white p-8">
      <div className="w-full flex ">
        <div className="w-1/2">
          {/* IMAGE AND GALLERY */}
          <img src={`${BASE_URL}${product.image}`} alt="" />
        </div>
        <div className="w-1/2">
          <h1 className="text-3xl font-bold text-left ">{product.name}</h1>
          <h1 className="text-3xl font-bold text-left ">
            {product.name} English here
          </h1>
          <div className="w-full h-px bg-white m-4"></div>

          <div className="w-full flex h-75 text-2xl font-bold ">
            <div className="w-1/3 h-full text-center">تعداد</div>
            <div className="w-1/3 h-full text-center">غلظت</div>
            <div className="w-1/3 h-full text-center">حجم</div>
          </div>

          <p className="mt-4 ">{product.description}</p>

          <p className="mt-6 text-2xl font-bold ">${product.price}</p>
          <div className="flex">
            {/* RATING */}
            <img src="/Star.png" className="siz-6 p-4 pr-0" alt="" />
            <img src="/Star.png" className="siz-6 p-4 pr-0" alt="" />
            <img src="/Star.png" className="siz-6 p-4 pr-0" alt="" />
            <img src="/Star.png" className="siz-6 p-4 pr-0" alt="" />
            <img src="/Star.png" className="siz-6 p-4 pr-0" alt="" />
          </div>
          <button
            className="bg-white cursor-pointer rounded-xl p-4 text-[#131C30] text-2xl px-4 py-2"
            onClick={() => handleAddItem(product)}
          >
            افزودن به سبد خرید
          </button>
        </div>
      </div>
    </div>
  );
}
