import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 text-center py-4 mt-10 border-t">
      <p className="text-sm">
        © {new Date().getFullYear()} Online Course Tracker. All rights reserved.
      </p>
    </footer>
  );
}
