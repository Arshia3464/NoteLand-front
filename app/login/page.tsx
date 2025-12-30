"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  console.log(BASE_URL);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Login failed");

      console.log("Logged in:", data);
      router.push("/dashboard");
      // redirect or save token here
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r bg-[#131C30]">
      <div className="bg-white shadow-lg p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-black mb-6">
          نت لند
        </h2>
        <div className="w-full h-px bg-black my-2"></div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-2">ایمیل</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">رمز ورود</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border bg-white text-black rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#131C30] text-white py-2 rounded-xl transition"
          >
            {loading ? "ورود ..." : "ورود"}
          </button>
        </form>
        <div className="w-full h-px bg-black my-2"></div>

        <p className="mt-4 text-right text-gray-500">
          کاربر جدید؟
          <a
            href="/register"
            className="text-indigo-600 underline font-semibold hover:underline"
          >
            ثبت نام
          </a>
        </p>
      </div>
    </div>
  );
}
