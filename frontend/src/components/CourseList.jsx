import React, { useEffect, useState } from "react";
import { useApi } from "../api/useApi";

export default function CourseList({ refreshKey = 0, onEdit }) {
  const { request, loading, error } = useApi();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await request("/courses/");
        setCourses(data || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [request, refreshKey]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this course?")) return;
    try {
      await request(`/courses/${id}/`, { method: "DELETE" });
      // parent should change refreshKey; if not, you can also refetch here:
      const { data } = await request("/courses/");
      setCourses(data || []);
    } catch (e) {
      console.error(e);
      alert("Failed to delete");
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-600">Error loading courses</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-3">Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((c) => (
          <div key={c.id} className="p-4 border rounded shadow-sm bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{c.title}</h3>
                <p className="text-sm text-gray-600">Instructor: {c.instructor?.name}</p>
                <p className="mt-2">{c.description}</p>
                <div className="mt-2 text-sm">Lessons: {c.total_lessons}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onEdit && onEdit(c)}
                  className="px-3 py-1 bg-yellow-400 text-black rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {courses.length === 0 && <p>No courses yet</p>}
      </div>
    </div>
  );
}
