// src/pages/Courses.jsx
import React, { useState } from "react";
import CourseList from "../components/CourseList";
import CourseForm from "../components/CourseForm";

export default function Courses() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingCourse, setEditingCourse] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      <div className="md:col-span-1 space-y-4">
        <CourseForm
          key={editingCourse ? `edit-${editingCourse.id}` : "create"}
          editingCourse={editingCourse}
          onSaved={() => {
            setEditingCourse(null);
            setRefreshKey((k) => k + 1);
          }}
          onCancel={() => setEditingCourse(null)}
        />
      </div>

      <div className="md:col-span-2">
        <CourseList
          refreshKey={refreshKey}
          onEdit={(course) => setEditingCourse(course)}
        />
      </div>
    </div>
  );
}
