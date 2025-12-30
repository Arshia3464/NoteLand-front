"use client";
import React, { useState } from "react";
import { useFetch } from "@/app/hooks/useFetch";

interface User {
  user_id: number;
  name: string;
  last_name: string;
  address: string;
  birth_date: string | null;
  contact_number: string;
  zip_code: string;
  image: string;
}

const page = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const { data, loading, error } = useFetch<User[]>(
    `${BASE_URL}/profiles/all-profiles/`
  );

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-b">#</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Last Name</th>
              <th className="py-2 px-4 border-b">Contact</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((u, index) => (
              <tr
                key={u.user_id}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => setSelectedUser(u)}
              >
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{u.name}</td>
                <td className="py-2 px-4 border-b">{u.last_name}</td>
                <td className="py-2 px-4 border-b">
                  {u.contact_number || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black font-bold"
            >
              ×
            </button>
            <div className="flex flex-col items-center">
              <img
                src={`${BASE_URL}${selectedUser.image}`}
                alt={selectedUser.name}
                className="w-24 h-24 rounded-full mb-4 object-cover"
              />
              <h2 className="text-xl font-bold mb-2">
                {selectedUser.name} {selectedUser.last_name}
              </h2>
              <p>
                <strong>Contact:</strong> {selectedUser.contact_number || "-"}
              </p>
              <p>
                <strong>Address:</strong> {selectedUser.address || "-"}
              </p>
              <p>
                <strong>Zip Code:</strong> {selectedUser.zip_code || "-"}
              </p>
              <p>
                <strong>Birth Date:</strong> {selectedUser.birth_date || "-"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
