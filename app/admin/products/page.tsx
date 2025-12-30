"use client";

import { useEffect, useState } from "react";

interface Product {
  id: number;
  owner: number; // user id
  name: string;
  price: number;
  description: string;
  available: boolean;
  created_at: string;
  image?: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    available: true,
    image: null as File | null,
  });

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/products/`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to load products");

      const json = await res.json();
      setProducts(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      price: "",
      description: "",
      available: true,
      image: null,
    });
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: String(product.price),
      description: product.description,
      available: product.available,
      image: null,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const url = editingProduct
      ? `${BASE_URL}/products/update/${editingProduct.id}/`
      : `${BASE_URL}/products/create/`;

    const method = editingProduct ? "PUT" : "POST";

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("available", String(form.available));
    if (form.image) formData.append("image", form.image);

    try {
      const res = await fetch(url, {
        method,
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to save product");

      setShowModal(false);
      fetchProducts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteProduct = async (id: number) => {
    if (!confirm("Delete this product?")) return;

    try {
      const res = await fetch(`${BASE_URL}/products/delete/${id}/`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      fetchProducts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p className="p-8">Loading...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 text-black p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black">Admin – Products</h1>
        <button
          onClick={openAddModal}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Available</th>
            <th className="p-3 text-left">Image</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">{p.name}</td>
              <td className="p-3">${p.price}</td>
              <td className="p-3">{p.available ? "Yes" : "No"}</td>
              <td className="p-3">
                {p.image ? (
                  <img
                    src={`http://localhost:8000${p.image}`}
                    alt={p.name}
                    className="h-12 w-12 object-cover rounded"
                  />
                ) : (
                  "—"
                )}
              </td>
              <td className="p-3 space-x-3">
                <button
                  onClick={() => openEditModal(p)}
                  className="text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <input
              className="w-full border p-2 mb-3"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="w-full border p-2 mb-3"
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <textarea
              className="w-full border p-2 mb-3"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) =>
                  setForm({ ...form, available: e.target.checked })
                }
              />
              Available
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm({
                  ...form,
                  image: e.target.files ? e.target.files[0] : null,
                })
              }
              className="mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
