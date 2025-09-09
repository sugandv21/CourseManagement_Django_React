import React, { useEffect, useState } from "react";
import { useApi } from "../api/useApi";

export default function InstructorList({ refreshKey = 0, onEdit }) {
  const { request, loading, error } = useApi();
  const [instructors, setInstructors] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  // fetch instructors
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await request("/instructors/");
        if (mounted) setInstructors(data || []);
      } catch (err) {
        console.error("Failed to load instructors", err);
      }
    })();
    return () => { mounted = false; };
  }, [request, refreshKey]);

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this instructor? This will also delete their courses if backend uses on_delete=CASCADE.");
    if (!ok) return;
    try {
      setDeletingId(id);
      await request(`/instructors/${id}/`, { method: "DELETE" });
      // remove locally for immediate feedback
      setInstructors(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete instructor");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="p-4">Loading instructors...</p>;
  if (error) return <p className="p-4 text-red-600">Error loading instructors</p>;

  return (
    <div className="p-4 bg-white border rounded shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Instructors</h2>
      {instructors.length === 0 ? (
        <p className="text-gray-500">No instructors yet.</p>
      ) : (
        <div className="space-y-3">
          {instructors.map((i) => (
            <div key={i.id} className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">{i.name}</div>
                <div className="text-sm text-gray-600">{i.email}</div>
                {i.bio && <div className="text-sm text-gray-700 mt-1">{i.bio}</div>}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit && onEdit(i)}
                  className="px-3 py-1 bg-yellow-400 rounded text-black text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(i.id)}
                  disabled={deletingId === i.id}
                  className={`px-3 py-1 rounded text-sm ${deletingId === i.id ? "bg-gray-300 text-gray-600" : "bg-red-500 text-white"}`}
                >
                  {deletingId === i.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
