import React, { useEffect, useState, useRef } from "react";
import { useApi } from "../api/useApi";

export default function Home() {
  const { request } = useApi();
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  // filter/search state
  const [q, setQ] = useState("");
  const [selectedInstructorId, setSelectedInstructorId] = useState("");
  const debounceRef = useRef(null);

  // load instructors once
  useEffect(() => {
    (async () => {
      try {
        const { data: instructorData } = await request("/instructors/");
        setInstructors(instructorData || []);
      } catch (err) {
        console.error("Failed to load instructors", err);
      }
    })();
  }, [request]);

  // fetch courses with filters
  const fetchCourses = async ({ query = q, instructorId = selectedInstructorId } = {}) => {
    try {
      const params = new URLSearchParams();
      if (query) params.append("search", query);
      if (instructorId) params.append("instructor_id", instructorId);
      const url = params.toString() ? `/courses/?${params.toString()}` : "/courses/";
      const { data: courseData } = await request(url);
      setCourses(courseData || []);
    } catch (err) {
      console.error("Error fetching courses", err);
      setCourses([]);
    }
  };

  // initial load
  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        // fetch both in parallel (courses will apply no filters)
        const [{ data: courseData }, { data: instructorData }] = await Promise.all([
          request("/courses/"),
          request("/instructors/"),
        ]);
        setCourses(courseData || []);
        // instructors may already be loaded by the other effect; set anyway if available
        if (instructorData) setInstructors(instructorData || []);
      } catch (err) {
        console.error("Error fetching homepage data", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [request]);

  // debounced effect for search + instructor filter
  useEffect(() => {
    // clear previous debounce
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      fetchCourses({ query: q, instructorId: selectedInstructorId });
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, selectedInstructorId]);

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading homepage...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-4xl font-extrabold mb-2 text-indigo-600 drop-shadow-md">
        Welcome to Online Course Tracker
      </h1>

      {/* Search & filter controls */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title/description..."
            className="w-full md:w-80 p-2 border rounded shadow-sm"
            aria-label="Search courses"
          />
        </div>

        <div className="w-full md:w-64">
          <select
            value={selectedInstructorId}
            onChange={(e) => setSelectedInstructorId(e.target.value)}
            className="w-full p-2 border rounded shadow-sm"
            aria-label="Filter by instructor"
          >
            <option value="">All instructors</option>
            {instructors.map((ins) => (
              <option key={ins.id} value={ins.id}>
                {ins.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-blue-600 border-b-2 border-blue-200 pb-2">
          Available Courses {selectedInstructorId ? `by ${instructors.find(i => i.id === Number(selectedInstructorId))?.name || ""}` : ""}
        </h2>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.slice(0, 8).map((course) => (
              <div
                key={course.id}
                className="p-6 rounded-2xl shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-800">{course.title}</h3>
                <p className="text-sm text-gray-500">
                  Instructor: {course.instructor?.name || "N/A"}
                </p>
                <p className="mt-3 text-gray-700 line-clamp-3">{course.description}</p>
                <div className="mt-3 text-sm font-medium text-indigo-600">
                  Lessons: {course.total_lessons}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No courses found for the selected filter.</p>
        )}
      </section>

      {/* Instructors */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-green-600 border-b-2 border-green-200 pb-2">
          Instructors
        </h2>
        {instructors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {instructors.slice(0, 6).map((instructor) => (
              <div
                key={instructor.id}
                className="p-6 rounded-2xl shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-800">{instructor.name}</h3>
                <p className="text-sm text-gray-500">{instructor.email}</p>
                <p className="mt-2 text-gray-700 line-clamp-2">{instructor.bio}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No instructors available.</p>
        )}
      </section>
    </div>
  );
}
