"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  username: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BASE_URL}/users/me/`, {
          credentials: "include",
        });

        if (!res.ok) {
          setUser(null);
        } else {
          const json = await res.json();
          setUser(json);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await fetch(`${BASE_URL}/auth/logout/`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    router.push("/login");
  };

  if (loading) return null; // optional: show a loader

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center flex-col">
      <div className="flex justify-between w-full">
        <div className="text-xl font-bold">
          <Link href="/">
            <img src="/Logo.png" className="w-24" alt="logo" />
          </Link>
        </div>
        {user ? (
          <button onClick={handleLogout} className="hover:text-gray-300">
            خروج ({user.username})
          </button>
        ) : (
          <Link href="/login" className="hover:text-gray-300">
            ورود
          </Link>
        )}
      </div>
      <div className="w-full h-1 bg-white">{/* THE LINE */}</div>
      <div></div>

      <div className="space-x-6">
        <Link href="/dashboard" className="hover:text-gray-300">
          داشبورد
        </Link>
        <Link href="/products" className="hover:text-gray-300">
          محصولات
        </Link>
        <Link href="/admin/products" className="hover:text-gray-300">
          جستجوی پیشرفته
        </Link>
        <Link href="/dashboard/cart" className="hover:text-gray-300 relative">
          اخبار
        </Link>
        <Link href="/dashboard/cart" className="hover:text-gray-300 relative">
          درباره ما
        </Link>
        <Link href="/dashboard/cart" className="hover:text-gray-300 relative">
          پشتیبانی
        </Link>
      </div>
    </nav>
  );
}
