import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-pink-600 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <div className="text-2xl font-bold tracking-wide">
        <Link to="/" className=" hover:text-pink-200 transition-colors">
          CourseTracker
        </Link>
      </div>
      <div className="space-x-6 font-semibold text-xl">
        <Link to="/" className="hover:text-pink-200 transition-colors">
          Home
        </Link>
        <Link to="/courses" className="hover:text-pink-200 transition-colors">
          Courses
        </Link>
        <Link to="/instructors" className="hover:text-pink-200 transition-colors">
          Instructors
        </Link>
      </div>
    </nav>
  );
}
