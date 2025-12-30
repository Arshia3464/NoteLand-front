"use client";

import { useEffect, useState } from "react";

interface Slider {
  id: number;
  owner: number; // user id
  name: string;
  price: number;
  link: string;
  description: string;
  active: boolean;
  created_at: string;
  image?: string;
}

export default function AdminProductsPage() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    link: "",
    available: true,
    image: null as File | null,
  });
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchSliders = async () => {
    try {
      const res = await fetch(`${BASE_URL}/sliders/`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to load sliders");

      const json = await res.json();
      setSliders(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const openAddModal = () => {
    setEditingSlider(null);
    setForm({
      name: "",
      price: "",
      description: "",
      link: "",
      available: true,
      image: null,
    });
    setShowModal(true);
  };

  const openEditModal = (slider: Slider) => {
    setEditingSlider(slider);
    setForm({
      name: slider.name,
      price: String(slider.price),
      link: slider.link,
      description: slider.description,
      available: slider.active,
      image: null,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const url = editingSlider
      ? `${BASE_URL}/sliders/update/${editingSlider.id}/`
      : `${BASE_URL}/sliders/add/`;

    const method = editingSlider ? "PUT" : "POST";

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("link", form.link);
    formData.append("description", form.description);
    formData.append("active", String(form.available));
    if (form.image) formData.append("image", form.image);

    try {
      const res = await fetch(url, {
        method,
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to save slider");

      setShowModal(false);
      fetchSliders();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteSlider = async (id: number) => {
    if (!confirm("Delete this slider?")) return;

    try {
      const res = await fetch(`${BASE_URL}/sliders/delete/${id}/`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete slider");

      fetchSliders();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p className="p-8">Loading...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 text-black p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black">Admin – Sliders</h1>
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
          {sliders.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">{p.name}</td>
              <td className="p-3">${p.price}</td>
              <td className="p-3">{p.active ? "Yes" : "No"}</td>
              <td className="p-3">
                {p.image ? (
                  <img
                    src={`${BASE_URL}${p.image}`}
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
                  onClick={() => deleteSlider(p.id)}
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
              {editingSlider ? "Edit Product" : "Add Product"}
            </h2>

            <input
              className="w-full border p-2 mb-3"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="w-full border p-2 mb-3"
              placeholder="Link"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
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
