import React, { useEffect, useState } from "react";
import { useApi } from "../api/useApi";

export default function Home() {
  const { request } = useApi();
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: courseData }, { data: instructorData }] = await Promise.all([
          request("/courses/"),
          request("/instructors/"),
        ]);
        setCourses(courseData || []);
        setInstructors(instructorData || []);
      } catch (err) {
        console.error("Error fetching homepage data", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [request]);

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading homepage...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">
      {/* Page Heading */}
      <h1 className="text-4xl font-extrabold mb-2 text-indigo-600 drop-shadow-md">
        Welcome to Online Course Tracker
      </h1>
      <p className="text-gray-700 mb-8 text-lg">
        Manage your courses and instructors easily.
      </p>

      {/* Courses Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-blue-600 border-b-2 border-blue-200 pb-2">
          Available Courses
        </h2>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.slice(0, 4).map((course) => (
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
          <p className="text-gray-500">No courses available.</p>
        )}
      </section>

      {/* Instructors Section */}
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
