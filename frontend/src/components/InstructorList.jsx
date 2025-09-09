import React, { useEffect, useState, useCallback } from "react";
import { useApi } from "../api/useApi";

export default function InstructorList({ refreshKey = 0, onEdit }) {
  const { request, loading, error } = useApi();
  const [instructors, setInstructors] = useState([]);

  const fetchInstructors = useCallback(async () => {
    try {
      const { data } = await request("/instructors/");
      setInstructors(data || []);
    } catch (e) {
      console.error("Error loading instructors", e);
    }
  }, [request]);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors, refreshKey]);

  const handleDelete = async (id) => {
    // if (!confirm("Delete this instructor? This will cascade delete related courses if backend has on_delete=CASCADE.")) return;
    if (!confirm("Delete this instructor?")) return;
    try {
      await request(`/instructors/${id}/`, { method: "DELETE" });
      await fetchInstructors();
    } catch (e) {
      console.error(e);
      alert("Failed to delete");
    }
  };

  if (loading) return <p className="p-4">Loading instructors...</p>;
  if (error) return <p className="p-4 text-red-600">Error loading instructors</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-3">Instructors</h2>
      <div className="space-y-3">
        {instructors.map((i) => (
          <div key={i.id} className="p-3 border rounded bg-white flex justify-between items-center">
            <div>
              <div className="font-semibold">{i.name}</div>
              <div className="text-sm text-gray-600">{i.email}</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit && onEdit(i)}
                className="px-3 py-1 bg-yellow-400 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(i.id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {instructors.length === 0 && <p>No instructors yet</p>}
      </div>
    </div>
  );
}

