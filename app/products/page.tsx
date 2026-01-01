"use client";

import { useEffect, useState } from "react";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/products/`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to load products");
        }

        const json = await res.json();
        setProducts(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="p-8">Loading...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-black">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <a key={product.id} href={`products/${product.id}`}>
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold text-black">
                {product.name}
              </h2>
              <img src={`${BASE_URL}${product.image}`} alt="" />
              <p className="text-gray-700 mt-2">{product.description}</p>
              <p className="mt-4 font-bold text-black">${product.price}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
