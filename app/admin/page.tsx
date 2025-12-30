"use client";

import { useEffect, useState } from "react";

interface AdminStats {
  users: number;
  products: number;
  orders: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await fetch("http://localhost:8000/users/me/", {
          credentials: "include",
        });

        if (res.status === 403) {
          throw new Error("Not authorized");
        }

        if (!res.ok) {
          throw new Error("Failed to load admin data");
        }

        const json = await res.json();
        setStats(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) return <p className="p-8">Loading...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;
  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-black mb-6">Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Users</p>
          <p className="text-2xl font-bold text-black">{stats.users}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Products</p>
          <p className="text-2xl font-bold text-black">{stats.products}</p>
          <a href="/admin/products" className="text-black">
            products
          </a>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Orders</p>
          <p className="text-2xl font-bold text-black">{stats.orders}</p>
        </div>
      </div>
    </div>
  );
}
