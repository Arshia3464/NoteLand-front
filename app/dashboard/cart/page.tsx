"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // fetch cart from backend
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get<any>(`${BASE_URL}/cart/`, {
        withCredentials: true,
      });
      setCart(res.data.items);
    } catch (err: any) {
      setError(err.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId: number, delta: number) => {
    try {
      await axios.post(
        `${BASE_URL}/api/cart/update/`,
        { item_id: itemId, delta },
        { withCredentials: true }
      );
      // fetch updated cart
      fetchCart();
    } catch (err: any) {
      setError(err.message || "Failed to update item");
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await axios.post(
        `${BASE_URL}/api/cart/remove/`,
        { item_id: itemId },
        { withCredentials: true }
      );
      fetchCart();
    } catch (err: any) {
      setError(err.message || "Failed to remove item");
    }
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4">Product</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Total</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id} className="text-center border-b">
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4">${item.price}</td>
                  <td className="py-2 px-4">
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="bg-gray-300 px-2 rounded hover:bg-gray-400"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="bg-gray-300 px-2 rounded hover:bg-gray-400"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="py-2 px-4">${item.price * item.quantity}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center p-4">
            <h2 className="text-xl font-bold">Total: ${totalPrice}</h2>
            <button
              onClick={() => alert("Implement checkout API")}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
