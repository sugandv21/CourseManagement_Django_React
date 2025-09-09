import React, { useEffect, useState } from "react";
import { useApi } from "../api/useApi";
import InstructorForm from "./InstructorForm";

export default function InstructorList() {
  const { request, loading, error } = useApi();
  const [instructors, setInstructors] = useState([]);
  const [editing, setEditing] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await request("/instructors/");
        setInstructors(data || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [request, refreshKey]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this instructor? This will cascade delete related courses if backend has on_delete=CASCADE.")) return;
    try {
      await request(`/instructors/${id}/`, { method: "DELETE" });
      setRefreshKey((k) => k + 1);
    } catch (e) {
      console.error(e);
      alert("Failed to delete");
    }
  };

  if (loading) return <p className="p-4">Loading instructors...</p>;
  if (error) return <p className="p-4 text-red-600">Error loading instructors</p>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <InstructorForm
          editingInstructor={editing}
          onSaved={() => {
            setEditing(null);
            setRefreshKey((k) => k + 1);
          }}
          onCancel={() => setEditing(null)}
        />
      </div>

      <h2 className="text-2xl font-bold mb-3">Instructors</h2>
      <div className="space-y-3">
        {instructors.map((i) => (
          <div key={i.id} className="p-3 border rounded bg-white flex justify-between items-center">
            <div>
              <div className="font-semibold">{i.name}</div>
              <div className="text-sm text-gray-600">{i.email}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(i)} className="px-3 py-1 bg-yellow-400 rounded">Edit</button>
              <button onClick={() => handleDelete(i.id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
        {instructors.length === 0 && <p>No instructors yet</p>}
      </div>
    </div>
  );
}
