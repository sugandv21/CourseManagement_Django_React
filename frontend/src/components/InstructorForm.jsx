import React, { useState, useEffect } from "react";
import { useApi } from "../api/useApi";

export default function InstructorForm({ onSaved, editingInstructor = null, onCancel }) {
  const { request } = useApi();
  const [form, setForm] = useState({ name: "", email: "", bio: "" });
  const [saving, setSaving] = useState(false);

  // modal state for success flash
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (editingInstructor) {
      setForm({
        name: editingInstructor.name || "",
        email: editingInstructor.email || "",
        bio: editingInstructor.bio || "",
      });
    } else {
      setForm({ name: "", email: "", bio: "" });
    }
  }, [editingInstructor]);

  // small flash modal helper
  const flashSuccess = (ms = 1400) => {
    setShowModal(true);
    setTimeout(() => setShowModal(false), ms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingInstructor) {
        await request(`/instructors/${editingInstructor.id}/`, {
          method: "PATCH",
          body: form,
        });
      } else {
        await request("/instructors/", { method: "POST", body: form });
      }

      flashSuccess();

      if (onSaved) onSaved();

      // reset only when creating (not when editing)
      if (!editingInstructor) setForm({ name: "", email: "", bio: "" });
    } catch (err) {
      console.error("Save error", err);
      alert("Error saving instructor");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-3">
          {editingInstructor ? "Edit Instructor" : "Add Instructor"}
        </h2>

        <div className="mb-2">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex gap-2 mt-3">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {editingInstructor ? "Save changes" : "Save Instructor"}
          </button>

          {editingInstructor && (
            <button
              type="button"
              onClick={() => {
                if (onCancel) onCancel();
                else setForm({ name: "", email: "", bio: "" });
              }}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Success modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Saved successfully"
        >
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          <div className="relative z-10 w-80 max-w-full mx-4">
            <div className="bg-white rounded-lg shadow-lg p-4 text-center">
              <svg
                className="mx-auto mb-2 h-10 w-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="text-lg font-semibold">Saved successfully</h3>
              <p className="text-sm text-gray-600 mt-1">Your instructor was saved.</p>
              <button
                onClick={() => setShowModal(false)}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
