import React, { useState, useEffect } from "react";
import { useApi } from "../api/useApi";

export default function CourseForm({ onSaved, editingCourse = null, onCancel }) {
  const { request } = useApi();
  const [instructors, setInstructors] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    instructor_id: "",
    total_lessons: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await request("/instructors/");
        setInstructors(data || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [request]);

  // load editingCourse into form
  useEffect(() => {
    if (editingCourse) {
      setForm({
        title: editingCourse.title || "",
        description: editingCourse.description || "",
        instructor_id: editingCourse.instructor?.id || "",
        total_lessons: editingCourse.total_lessons ?? 0,
      });
    } else {
      setForm({
        title: "",
        description: "",
        instructor_id: "",
        total_lessons: 0,
      });
    }
  }, [editingCourse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        title: form.title,
        description: form.description,
        instructor_id: Number(form.instructor_id),
        total_lessons: Number(form.total_lessons),
      };

      if (editingCourse) {
        // Use PATCH so we don't need to send all fields if not changed
        await request(`/courses/${editingCourse.id}/`, { method: "PATCH", body });
      } else {
        await request("/courses/", { method: "POST", body });
      }

      if (onSaved) onSaved();
      setForm({ title: "", description: "", instructor_id: "", total_lessons: 0 });
    } catch (err) {
      console.error(err);
      alert("Error saving course");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-3">{editingCourse ? "Edit Course" : "Add Course"}</h2>

      <div className="mb-2">
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium">Instructor</label>
        <select
          value={form.instructor_id}
          onChange={(e) => setForm({ ...form, instructor_id: e.target.value })}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select instructor</option>
          {instructors.map((i) => (
            <option value={i.id} key={i.id}>
              {i.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium">Total Lessons</label>
        <input
          type="number"
          min={0}
          value={form.total_lessons}
          onChange={(e) => setForm({ ...form, total_lessons: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex gap-2 mt-3">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editingCourse ? "Save changes" : "Create course"}
        </button>
        {editingCourse && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
