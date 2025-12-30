"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Item {
  id: number;
  username: string;
  description: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/users/me/`, {
          credentials: "include", // send cookies automatically
        });

        console.log("Response status:", res.status);
        console.log(
          "Response headers:",
          Object.fromEntries(res.headers.entries())
        );

        // if (res.status === 401) {
        //   // Not authenticated, redirect to login
        //   router.push("/login");
        //   return;
        // }

        if (!res.ok) throw new Error("Failed to fetch data");

        const json = await res.json();
        console.log("Response data:", json);
        setData(json);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
        console.log(data);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-black">Dashboard</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {data && <div className="text-black">{data.username}</div>}
    </div>
  );
}
