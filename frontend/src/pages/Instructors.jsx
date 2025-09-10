import React, { useState, useRef, useEffect } from "react";
import InstructorList from "../components/InstructorList";
import InstructorForm from "../components/InstructorForm";

export default function Instructors() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const formContainerRef = useRef(null);

  // scroll to the form when clicks Edit in the list
  useEffect(() => {
    if (editingInstructor) {
      formContainerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [editingInstructor]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <div ref={formContainerRef} className="md:col-span-1 space-y-4">
        <InstructorForm
          editingInstructor={editingInstructor}
          onSaved={() => {
            // after saving, refresh list and clear editing state
            setRefreshKey((k) => k + 1);
            setEditingInstructor(null);
          }}
          onCancel={() => setEditingInstructor(null)}
        />
      </div>

      <div className="md:col-span-2">
        <InstructorList
          refreshKey={refreshKey}
          onEdit={(instructor) => setEditingInstructor(instructor)}
        />
      </div>
    </div>
  );
}


